import * as i5 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, Component, Input, HostListener, EventEmitter, Inject, Output, ViewChild, ElementRef, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import * as i1 from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import * as i3$1 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i4 from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import * as i3 from 'angular2-draggable';
import { AngularDraggableModule } from 'angular2-draggable';
import * as i1$1 from '@ess/ngx-opencv';
import { OpenCvConfigToken, NgxOpenCVModule, NgxOpenCVService } from '@ess/ngx-opencv';
import { BehaviorSubject } from 'rxjs';
import * as i2 from '@angular/flex-layout/extended';
import * as i5$1 from '@angular/flex-layout/flex';
import * as i4$1 from '@angular/platform-browser';

class LimitsService {
    constructor() {
        this.limitDirections = ['left', 'right', 'top', 'bottom'];
        /**
         * stores the crop limits limits
         */
        this._limits = {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        };
        /**
         * stores the array of the draggable points displayed on the crop area
         */
        this._points = [];
        // *********** //
        // Observables //
        // *********** //
        this.positions = new BehaviorSubject(Array.from(this._points));
        this.repositionEvent = new BehaviorSubject([]);
        this.limits = new BehaviorSubject(this._limits);
        this.paneDimensions = new BehaviorSubject({ width: 0, height: 0 });
    }
    /**
     * set privew pane dimensions
     */
    setPaneDimensions(dimensions) {
        return new Promise((resolve, reject) => {
            this._paneDimensions = dimensions;
            this.paneDimensions.next(dimensions);
            resolve(dimensions);
        });
    }
    /**
     * repositions points externally
     */
    repositionPoints(positions) {
        this._points = positions;
        positions.forEach(position => {
            this.positionChange(position);
        });
        this.repositionEvent.next(positions);
    }
    /**
     * updates limits and point positions and calls next on the observables
     * @param positionChangeData - position change event data
     */
    positionChange(positionChangeData) {
        // update positions according to current position change
        this.updatePosition(positionChangeData);
        // for each direction:
        // 1. filter the _points that have a role as the direction's limit
        // 2. for top and left find max x | y values, and min for right and bottom
        this.limitDirections.forEach(direction => {
            const relevantPoints = this._points.filter(point => {
                return point.roles.includes(direction);
            })
                .map((point) => {
                return point[this.getDirectionAxis(direction)];
            });
            let limit;
            if (direction === 'top' || direction === 'left') {
                limit = Math.max(...relevantPoints);
            }
            if (direction === 'right' || direction === 'bottom') {
                limit = Math.min(...relevantPoints);
            }
            this._limits[direction] = limit;
        });
        this.limits.next(this._limits);
        this.positions.next(Array.from(this._points));
    }
    /**
     * updates the position of the point
     * @param positionChange - position change event data
     */
    updatePosition(positionChange) {
        // finds the current position of the point by it's roles, than splices it for the new position or pushes it if it's not yet in the array
        const index = this._points.findIndex(point => {
            return this.compareArray(positionChange.roles, point.roles);
        });
        if (index === -1) {
            this._points.push(positionChange);
        }
        else {
            this._points.splice(index, 1, positionChange);
        }
    }
    /**
     * check if a position change event exceeds the limits
     * @param positionChange - position change event data
     * @returns LimitException0
     */
    exceedsLimit(positionChange) {
        const pointLimits = this.limitDirections.filter(direction => {
            return !positionChange.roles.includes(direction);
        });
        const limitException = {
            exceeds: false,
            resetCoefficients: {
                x: 0,
                y: 0
            },
            resetCoordinates: {
                x: positionChange.x,
                y: positionChange.y
            }
        };
        // limit directions are the opposite sides of the point's roles
        pointLimits.forEach(direction => {
            const directionAxis = this.getDirectionAxis(direction);
            if (direction === 'top' || direction === 'left') {
                if (positionChange[directionAxis] < this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = 1;
                    limitException.resetCoordinates[directionAxis] = this._limits[direction];
                }
            }
            else if (direction === 'right' || direction === 'bottom') {
                if (positionChange[directionAxis] > this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = -1;
                    limitException.resetCoordinates[directionAxis] = this._limits[direction];
                }
            }
        });
        if (limitException.resetCoefficients.x !== 0 || limitException.resetCoefficients.y !== 0) {
            limitException.exceeds = true;
        }
        return limitException;
    }
    /**
     * rotate crop tool points clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map(point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        });
        this.repositionPoints(initialPositions.map(point => {
            return this.rotateCornerClockwise(point);
        }));
    }
    /**
     * rotate crop tool points anti-clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateAntiClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map(point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        });
        this.repositionPoints(initialPositions.map(point => {
            return this.rotateCornerAntiClockwise(point);
        }));
    }
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     */
    rotateCornerClockwise(corner) {
        const rotated = {
            x: this._paneDimensions.width * (1 - corner.y),
            y: this._paneDimensions.height * corner.x,
            roles: []
        };
        // rotates corner according to order
        const order = [
            ['bottom', 'left'],
            ['top', 'left'],
            ['top', 'right'],
            ['bottom', 'right'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex(roles => {
            return this.compareArray(roles, corner.roles);
        }) + 1];
        return rotated;
    }
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     */
    rotateCornerAntiClockwise(corner) {
        const rotated = {
            x: this._paneDimensions.width * corner.y,
            y: this._paneDimensions.height * (1 - corner.x),
            roles: []
        };
        // rotates corner according to order
        const order = [
            ['bottom', 'left'],
            ['bottom', 'right'],
            ['top', 'right'],
            ['top', 'left'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex(roles => {
            return this.compareArray(roles, corner.roles);
        }) + 1];
        return rotated;
    }
    /**
     * checks if two array contain the same values
     * @param array1 - array 1
     * @param array2 - array 2
     * @returns boolean
     */
    compareArray(array1, array2) {
        return array1.every((element) => {
            return array2.includes(element);
        }) && array1.length === array2.length;
    }
    getDirectionAxis(direction) {
        return {
            left: 'x',
            right: 'x',
            top: 'y',
            bottom: 'y'
        }[direction];
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
class PositionChangeData {
    constructor(position, roles) {
        this.x = position.x;
        this.y = position.y;
        this.roles = roles;
    }
}

class NgxDraggablePointComponent {
    constructor(limitsService) {
        this.limitsService = limitsService;
        this.width = 10;
        this.height = 10;
        this.color = '#3cabe2';
        this.shape = 'rect';
        this.pointOptions = 'rect';
        this.hover = false;
        this.clicking = false;
        this.position = {
            x: 0,
            y: 0
        };
    }
    ngAfterViewInit() {
        Object.keys(this.pointOptions).forEach(key => {
            this[key] = this.pointOptions[key];
        });
        // subscribe to pane dimensions changes
        this.limitsService.paneDimensions.subscribe(dimensions => {
            if (dimensions.width > 0 && dimensions.width > 0) {
                this._paneDimensions = {
                    width: dimensions.width,
                    height: dimensions.height
                };
                this.position = this.getInitialPosition(dimensions);
                this.limitsService.positionChange(new PositionChangeData(this.position, this.limitRoles));
            }
        });
        // subscribe to external reposition events
        this.limitsService.repositionEvent.subscribe(positions => {
            if (positions.length > 0) {
                this.externalReposition(positions);
            }
        });
    }
    mouseUp(event) {
        this.clicking = false;
        this.hover = false;
    }
    /**
     * returns a css style object for the point
     */
    pointStyle() {
        return {
            width: this.width + 'px',
            height: this.height + 'px',
            'background-color': this.color,
            'border-radius': this.shape === 'circle' ? '100%' : 0,
            position: 'absolute'
        };
    }
    hoverPointStyle() {
        return {
            ...this.pointStyle(),
            cursor: 'grab',
            'background-color': '#CCFF33'
        };
    }
    clickingPointStyle() {
        return {
            ...this.hoverPointStyle(),
            cursor: 'grabbing'
        };
    }
    getStyle() {
        if (this.clicking) {
            return this.clickingPointStyle();
        }
        else if (this.hover) {
            return this.hoverPointStyle();
        }
        return this.pointStyle();
    }
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param position - the current position of the point
     */
    positionChange(position) {
        const positionChangeData = new PositionChangeData(position, this.limitRoles);
        const limitException = this.limitsService.exceedsLimit(positionChangeData);
        if (limitException.exceeds) {
            // if exceeds limits, reposition
            this.resetPosition = limitException.resetCoordinates;
        }
        else {
            this.limitsService.positionChange(positionChangeData);
            this._currentPosition = position;
        }
    }
    /**
     * adjusts the position of the point after a limit exception
     */
    adjustPosition(limitException) {
        const newPosition = {
            x: 0,
            y: 0
        };
        Object.keys(this.startPosition).forEach(axis => {
            newPosition[axis] = limitException.resetCoordinates[axis] + limitException.resetCoefficients[axis];
        });
        this.position = newPosition;
        this.limitsService.positionChange(new PositionChangeData(this.position, this.limitRoles));
    }
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     */
    movementEnd(position) {
        let positionChangeData = new PositionChangeData(position, this.limitRoles);
        const limitException = this.limitsService.exceedsLimit(positionChangeData);
        if (limitException.exceeds) {
            this.resetPosition = limitException.resetCoordinates;
            if (limitException.exceeds) {
                this.adjustPosition(limitException);
                positionChangeData = new PositionChangeData(this.position, this.limitRoles);
                this.limitsService.updatePosition(positionChangeData);
            }
        }
    }
    /**
     * calculates the initial positions of the point by it's roles
     * @param dimensions - dimensions of the pane in which the point is located
     */
    getInitialPosition(dimensions) {
        return {
            x: this.limitRoles.includes('left') ? 0 : dimensions.width - this.width / 2,
            y: this.limitRoles.includes('top') ? 0 : dimensions.height - this.height / 2
        };
    }
    /**
     * repositions the point after an external reposition event
     * @param positions - an array of all points on the pane
     */
    externalReposition(positions) {
        positions.forEach(position => {
            if (this.limitsService.compareArray(this.limitRoles, position.roles)) {
                position = this.enforcePaneLimits(position);
                this.position = {
                    x: position.x,
                    y: position.y
                };
            }
        });
    }
    /**
     * returns a new point position if the movement exceeded the pane limit
     */
    enforcePaneLimits(position) {
        if (this._paneDimensions.width === 0 || this._paneDimensions.height === 0) {
            return position;
        }
        else {
            if (position.x > this._paneDimensions.width) {
                position.x = this._paneDimensions.width;
            }
            if (position.x < 0) {
                position.x = 1;
            }
            if (position.y > this._paneDimensions.height) {
                position.y = this._paneDimensions.height;
            }
            if (position.y < 0) {
                position.y = 1;
            }
        }
        return position;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDraggablePointComponent, deps: [{ token: LimitsService }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxDraggablePointComponent, selector: "ngx-draggable-point", inputs: { width: "width", height: "height", color: "color", shape: "shape", pointOptions: "pointOptions", limitRoles: "limitRoles", startPosition: "startPosition", container: "container", _currentPosition: "_currentPosition" }, host: { listeners: { "window:mouseup": "mouseUp($event)" } }, ngImport: i0, template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"getStyle()\"\r\n     (mousedown)=\"clicking=true\"\r\n     (mouseup)=\"clicking=false\"\r\n     (mouseover)=\"hover=true\"\r\n     (mouseleave)=\"hover=false\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n     style=\"z-index: 1000\">\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "directive", type: i2.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { kind: "directive", type: i3.AngularDraggableDirective, selector: "[ngDraggable]", inputs: ["handle", "bounds", "outOfBounds", "gridSize", "zIndexMoving", "zIndex", "inBounds", "trackPosition", "scale", "preventDefaultEvent", "position", "lockAxis", "ngDraggable"], outputs: ["started", "stopped", "edge", "movingOffset", "endOffset"], exportAs: ["ngDraggable"] }, { kind: "directive", type: i5.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDraggablePointComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-draggable-point', template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"getStyle()\"\r\n     (mousedown)=\"clicking=true\"\r\n     (mouseup)=\"clicking=false\"\r\n     (mouseover)=\"hover=true\"\r\n     (mouseleave)=\"hover=false\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n     style=\"z-index: 1000\">\r\n</div>\r\n" }]
        }], ctorParameters: function () { return [{ type: LimitsService }]; }, propDecorators: { width: [{
                type: Input
            }], height: [{
                type: Input
            }], color: [{
                type: Input
            }], shape: [{
                type: Input
            }], pointOptions: [{
                type: Input
            }], limitRoles: [{
                type: Input
            }], startPosition: [{
                type: Input
            }], container: [{
                type: Input
            }], _currentPosition: [{
                type: Input
            }], mouseUp: [{
                type: HostListener,
                args: ['window:mouseup', ['$event']]
            }] } });

class NgxFilterMenuComponent {
    selectOption(optionName) {
        this.data.filter = optionName;
        this.bottomSheetRef.dismiss();
    }
    constructor(bottomSheetRef, data) {
        this.bottomSheetRef = bottomSheetRef;
        this.data = data;
        this.filterOptions = [
            {
                name: 'default',
                icon: 'filter_b_and_w',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W'
            },
            {
                name: 'bw2',
                icon: 'filter_b_and_w',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W 2'
            },
            {
                name: 'bw3',
                icon: 'blur_on',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W 3'
            },
            {
                name: 'magic_color',
                icon: 'filter_vintage',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'Magic Color'
            },
            {
                name: 'original',
                icon: 'crop_original',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'Original'
            },
        ];
        this.filterSelected = new EventEmitter();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxFilterMenuComponent, deps: [{ token: i1.MatBottomSheetRef }, { token: MAT_BOTTOM_SHEET_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxFilterMenuComponent, selector: "ngx-filter-menu", outputs: { filterSelected: "filterSelected" }, ngImport: i0, template: "<mat-action-list>\r\n  <button mat-list-item *ngFor=\"let option of filterOptions\" (click)=\"selectOption(option.name)\">\r\n    <mat-icon>{{option.icon}}</mat-icon>\r\n    <span fxFlex=\"100\" style=\"text-align: start; margin: 5px\">{{option.text}}</span>\r\n    <span fxFlex=\"100\"></span>\r\n    <mat-icon *ngIf=\"option.name === data.filter\">done</mat-icon>\r\n  </button>\r\n</mat-action-list>\r\n", dependencies: [{ kind: "directive", type: i5$1.DefaultFlexDirective, selector: "  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],  [fxFlex.gt-md], [fxFlex.gt-lg]", inputs: ["fxFlex", "fxFlex.xs", "fxFlex.sm", "fxFlex.md", "fxFlex.lg", "fxFlex.xl", "fxFlex.lt-sm", "fxFlex.lt-md", "fxFlex.lt-lg", "fxFlex.lt-xl", "fxFlex.gt-xs", "fxFlex.gt-sm", "fxFlex.gt-md", "fxFlex.gt-lg"] }, { kind: "component", type: i3$1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: i4.MatActionList, selector: "mat-action-list", exportAs: ["matActionList"] }, { kind: "component", type: i4.MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["activated"], exportAs: ["matListItem"] }, { kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxFilterMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-filter-menu', template: "<mat-action-list>\r\n  <button mat-list-item *ngFor=\"let option of filterOptions\" (click)=\"selectOption(option.name)\">\r\n    <mat-icon>{{option.icon}}</mat-icon>\r\n    <span fxFlex=\"100\" style=\"text-align: start; margin: 5px\">{{option.text}}</span>\r\n    <span fxFlex=\"100\"></span>\r\n    <mat-icon *ngIf=\"option.name === data.filter\">done</mat-icon>\r\n  </button>\r\n</mat-action-list>\r\n" }]
        }], ctorParameters: function () { return [{ type: i1.MatBottomSheetRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_BOTTOM_SHEET_DATA]
                }] }]; }, propDecorators: { filterSelected: [{
                type: Output
            }] } });

class NgxShapeOutlineComponent {
    constructor(limitsService) {
        this.limitsService = limitsService;
        this.color = '#3cabe2';
    }
    ngAfterViewInit() {
        // init drawing canvas dimensions
        this.canvas.nativeElement.width = this.dimensions.width;
        this.canvas.nativeElement.height = this.dimensions.height;
        this.limitsService.positions.subscribe(positions => {
            if (positions.length === 4) {
                this._points = positions;
                this.sortPoints();
                this.clearCanvas();
                this.drawShape();
            }
        });
        // subscribe to changes in the pane's dimensions
        this.limitsService.paneDimensions.subscribe(dimensions => {
            this.clearCanvas();
            this.canvas.nativeElement.width = dimensions.width;
            this.canvas.nativeElement.height = dimensions.height;
        });
        // subscribe to reposition events
        this.limitsService.repositionEvent.subscribe(positions => {
            if (positions.length === 4) {
                setTimeout(() => {
                    this.clearCanvas();
                    this.sortPoints();
                    this.drawShape();
                }, 10);
            }
        });
    }
    /**
     * clears the shape canvas
     */
    clearCanvas() {
        const canvas = this.canvas.nativeElement;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    }
    /**
     * sorts the array of points according to their clockwise alignment
     */
    sortPoints() {
        const _points = Array.from(this._points);
        const sortedPoints = [];
        const sortOrder = {
            vertical: ['top', 'top', 'bottom', 'bottom'],
            horizontal: ['left', 'right', 'right', 'left']
        };
        for (let i = 0; i < 4; i++) {
            const roles = Array.from([sortOrder.vertical[i], sortOrder.horizontal[i]]);
            sortedPoints.push(_points.filter((point) => {
                return this.limitsService.compareArray(point.roles, roles);
            })[0]);
        }
        this._sortedPoints = sortedPoints;
    }
    /**
     * draws a line between the points according to their order
     */
    drawShape() {
        const canvas = this.canvas.nativeElement;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = this.weight;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this._sortedPoints.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            }
            if (index !== this._sortedPoints.length - 1) {
                const nextPoint = this._sortedPoints[index + 1];
                ctx.lineTo(nextPoint.x, nextPoint.y);
            }
            else {
                ctx.closePath();
            }
        });
        ctx.stroke();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxShapeOutlineComponent, deps: [{ token: LimitsService }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxShapeOutlineComponent, selector: "ngx-shape-outine", inputs: { color: "color", weight: "weight", dimensions: "dimensions" }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["outline"], descendants: true }], ngImport: i0, template: "<canvas #outline\r\n        style=\"position: absolute; z-index: 1000\"\r\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\r\n        *ngIf=\"dimensions\">\r\n</canvas>\r\n", dependencies: [{ kind: "directive", type: i2.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxShapeOutlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-shape-outine', template: "<canvas #outline\r\n        style=\"position: absolute; z-index: 1000\"\r\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\r\n        *ngIf=\"dimensions\">\r\n</canvas>\r\n" }]
        }], ctorParameters: function () { return [{ type: LimitsService }]; }, propDecorators: { color: [{
                type: Input
            }], weight: [{
                type: Input
            }], dimensions: [{
                type: Input
            }], canvas: [{
                type: ViewChild,
                args: ['outline']
            }] } });

class NgxDocScannerComponent {
    /**
     * returns an array of buttons according to the editor mode
     */
    get displayedButtons() {
        return this.editorButtons.filter(button => {
            return button.mode === this.mode;
        });
    }
    // ****** //
    // INPUTS //
    // ****** //
    /**
     * set image for editing
     * @param file - file from form input
     */
    set file(file) {
        if (file) {
            setTimeout(() => {
                this.processing.emit(true);
            }, 5);
            this.imageLoaded = false;
            this.originalImage = file;
            this.ngxOpenCv.cvState.subscribe(async (cvState) => {
                if (cvState.ready) {
                    // read file to image & canvas
                    await this.loadFile(file);
                    this.processing.emit(false);
                }
            });
        }
    }
    constructor(ngxOpenCv, limitsService, bottomSheet, sanitizer) {
        this.ngxOpenCv = ngxOpenCv;
        this.limitsService = limitsService;
        this.bottomSheet = bottomSheet;
        this.sanitizer = sanitizer;
        this.value = 0;
        /**
         * true after the image is loaded and preview is displayed
         */
        this.imageLoaded = false;
        /**
         * editor mode
         */
        this.mode = 'crop';
        /**
         * filter selected by the user, returned by the filter selector bottom sheet
         */
        this.selectedFilter = 'default';
        /**
         * image dimensions
         */
        this.imageDimensions = {
            width: 0,
            height: 0
        };
        // ************** //
        // EVENT EMITTERS //
        // ************** //
        /**
         * optional binding to the exit button of the editor
         */
        this.exitEditor = new EventEmitter();
        /**
         * fires on edit completion
         */
        this.editResult = new EventEmitter();
        /**
         * emits errors, can be linked to an error handler of choice
         */
        this.error = new EventEmitter();
        /**
         * emits the loading status of the cv module.
         */
        this.ready = new EventEmitter();
        /**
         * emits true when processing is done, false when completed
         */
        this.processing = new EventEmitter();
        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        // subscribe to status of cv module
        this.ngxOpenCv.cvState.subscribe((cvState) => {
            this.cvState = cvState.state;
            this.ready.emit(cvState.ready);
            if (cvState.error) {
                this.error.emit(new Error('error loading cv'));
            }
            else if (cvState.loading) {
                this.processing.emit(true);
            }
            else if (cvState.ready) {
                this.processing.emit(false);
            }
        });
        // subscribe to positions of crop tool
        this.limitsService.positions.subscribe(points => {
            this.points = points;
        });
    }
    ngOnInit() {
        this.editorButtons = [
            {
                name: 'exit',
                action: () => {
                    this.exitEditor.emit('canceled');
                },
                icon: 'arrow_back',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'rotate',
                action: this.rotateImage.bind(this),
                icon: 'rotate_right',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'done_crop',
                action: this.doneCrop(),
                icon: 'done',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'back',
                action: this.undo(),
                icon: 'arrow_back',
                type: 'fab',
                mode: 'color'
            },
            {
                name: 'filter',
                action: () => {
                    if (this.config.filterEnable) {
                        return this.chooseFilters();
                    }
                },
                icon: 'photo_filter',
                type: 'fab',
                mode: this.config.filterEnable ? 'color' : 'disabled'
            },
            {
                name: 'upload',
                action: this.exportImage.bind(this),
                icon: 'cloud_upload',
                type: 'fab',
                mode: 'color'
            },
        ];
        // set options from config object
        this.options = new ImageEditorConfig(this.config);
        // set export image icon
        this.editorButtons.forEach(button => {
            if (button.name === 'upload') {
                button.icon = this.options.exportImageIcon;
            }
        });
        this.maxPreviewWidth = this.options.maxPreviewWidth;
        this.maxPreviewHeight = this.options.maxPreviewHeight;
        this.editorStyle = this.options.editorStyle;
    }
    ngOnChanges(changes) {
        if (changes.config) {
            if (!changes.config.previousValue) {
                return;
            }
            if (changes.config.currentValue.thresholdInfo.thresh !== changes.config.previousValue.thresholdInfo.thresh) {
                this.loadFile(this.originalImage);
            }
            let updatePreview = false;
            if (changes.config.currentValue.maxPreviewWidth !== changes.config.previousValue.maxPreviewWidth) {
                this.maxPreviewWidth = changes.config.currentValue.maxPreviewWidth;
                updatePreview = true;
            }
            if (changes.config.currentValue.maxPreviewHeight !== changes.config.previousValue.maxPreviewHeight) {
                this.maxPreviewHeight = changes.config.currentValue.maxPreviewHeight;
                updatePreview = true;
            }
            if (changes.config.currentValue.editorDimensions !== changes.config.previousValue.editorDimensions) {
                const obj = { ...this.editorStyle };
                Object.assign(obj, changes.config.currentValue.editorDimensions);
                this.editorStyle = obj;
                updatePreview = true;
            }
            if (updatePreview) {
                this.doubleRotate();
            }
        }
    }
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     */
    exit() {
        this.exitEditor.emit('canceled');
    }
    getMode() {
        return this.mode;
    }
    async doneCrop() {
        this.mode = 'color';
        await this.transform();
        if (this.config.filterEnable) {
            await this.applyFilter(true);
        }
    }
    undo() {
        this.mode = 'crop';
        this.loadFile(this.originalImage);
    }
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    async exportImage() {
        await this.applyFilter(false);
        if (this.options.maxImageDimensions) {
            this.resize(this.editedImage)
                .then(resizeResult => {
                resizeResult.toBlob((blob) => {
                    this.editResult.emit(blob);
                    this.processing.emit(false);
                }, 'image/jpeg', 0.8);
            });
        }
        else {
            this.editedImage.toBlob((blob) => {
                this.editResult.emit(blob);
                this.processing.emit(false);
            }, 'image/jpeg', 0.8);
        }
    }
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     */
    chooseFilters() {
        const data = { filter: this.selectedFilter };
        const bottomSheetRef = this.bottomSheet.open(NgxFilterMenuComponent, {
            data: data
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
            this.selectedFilter = data.filter;
            this.applyFilter(true);
        });
    }
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     */
    loadFile(file) {
        return new Promise(async (resolve, reject) => {
            this.processing.emit(true);
            try {
                await this.readImage(file);
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            try {
                await this.showPreview();
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            // set pane limits
            // show points
            this.imageLoaded = true;
            await this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
            setTimeout(async () => {
                await this.detectContours();
                this.processing.emit(false);
                resolve(false);
            }, 15);
        });
    }
    /**
     * read image from File object
     */
    readImage(file) {
        return new Promise(async (resolve, reject) => {
            let imageSrc;
            try {
                imageSrc = await readFile();
            }
            catch (err) {
                reject(err);
            }
            const img = new Image();
            if (this.editedImage) {
                console.log('clearing old edited image...');
                this.editedImage.remove();
            }
            img.onload = async () => {
                // set edited image canvas and dimensions
                this.editedImage = document.createElement('canvas');
                this.editedImage.width = img.width;
                this.editedImage.height = img.height;
                const ctx = this.editedImage.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // resize image if larger than max image size
                const width = img.width > img.height ? img.height : img.width;
                if (width > this.options.maxImageDimensions.width) {
                    this.editedImage = await this.resize(this.editedImage);
                }
                this.imageDimensions.width = this.editedImage.width;
                this.imageDimensions.height = this.editedImage.height;
                this.setPreviewPaneDimensions(this.editedImage);
                resolve(true);
            };
            img.src = imageSrc;
        });
        /**
         * read file from input field
         */
        function readFile() {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve(reader.result);
                };
                reader.onerror = (err) => {
                    reject(err);
                };
                reader.readAsDataURL(file);
            });
        }
    }
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     */
    rotateImage(clockwise = true) {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                this.rotate(clockwise);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve(true);
                });
            }, 30);
        });
    }
    doubleRotate() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                this.rotate(true);
                this.rotate(false);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve(true);
                });
            }, 30);
        });
    }
    rotate(clockwise = true) {
        const dst = cv.imread(this.editedImage);
        // const dst = new cv.Mat();
        cv.transpose(dst, dst);
        if (clockwise) {
            cv.flip(dst, dst, 1);
        }
        else {
            cv.flip(dst, dst, 0);
        }
        cv.imshow(this.editedImage, dst);
        // src.delete();
        dst.delete();
        // save current preview dimensions and positions
        const initialPreviewDimensions = { width: 0, height: 0 };
        Object.assign(initialPreviewDimensions, this.previewDimensions);
        const initialPositions = Array.from(this.points);
        // get new dimensions
        // set new preview pane dimensions
        this.setPreviewPaneDimensions(this.editedImage);
        // get preview pane resize ratio
        const previewResizeRatios = {
            width: this.previewDimensions.width / initialPreviewDimensions.width,
            height: this.previewDimensions.height / initialPreviewDimensions.height
        };
        // set new preview pane dimensions
        if (clockwise) {
            this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
        }
        else {
            this.limitsService.rotateAntiClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
        }
    }
    /**
     * detects the contours of the document and
     **/
    detectContours() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                // load the image and compute the ratio of the old height to the new height, clone it, and resize it
                // const processingResizeRatio = 0.5;
                const src = cv.imread(this.editedImage);
                const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
                const ksize = new cv.Size(5, 5);
                // convert the image to grayscale, blur it, and find edges in the image
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
                // cv.Canny(src, src, 75, 200);
                // find contours
                if (this.config.thresholdInfo.thresholdType === 'standard') {
                    cv.threshold(src, src, this.config.thresholdInfo.thresh, this.config.thresholdInfo.maxValue, cv.THRESH_BINARY);
                }
                else if (this.config.thresholdInfo.thresholdType === 'adaptive_mean') {
                    cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
                }
                else if (this.config.thresholdInfo.thresholdType === 'adaptive_gaussian') {
                    cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
                }
                const contours = new cv.MatVector();
                const hierarchy = new cv.Mat();
                cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                const cnt = contours.get(4);
                if (!cnt) {
                    this.processing.emit(false);
                    return;
                }
                // console.log('----------UNIQUE RECTANGLES FROM ALL CONTOURS----------');
                const rects = [];
                for (let i = 0; i < contours.size(); i++) {
                    const cn = contours.get(i);
                    const r = cv.minAreaRect(cn);
                    let add = true;
                    if (r.size.height < 50 || r.size.width < 50
                        || r.angle === 90 || r.angle === 180 || r.angle === 0
                        || r.angle === -90 || r.angle === -180) {
                        continue;
                    }
                    for (let j = 0; j < rects.length; j++) {
                        if (rects[j].angle === r.angle
                            && rects[j].center.x === r.center.x && rects[j].center.y === r.center.y
                            && rects[j].size.width === r.size.width && rects[j].size.height === r.size.height) {
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        rects.push(r);
                    }
                    else {
                        try {
                            r.delete();
                        }
                        catch (e) {
                        }
                    }
                }
                let rect2 = cv.minAreaRect(cnt);
                for (let i = 0; i < rects.length; i++) {
                    if (((rects[i].size.width * rects[i].size.height) > (rect2.size.width * rect2.size.height)
                        && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
                            || rects[i].angle === -90 || rects[i].angle === -180) && ((rects[i].angle > 85 || rects[i].angle < 5)))) {
                        rect2 = rects[i];
                    }
                }
                const vertices = cv.RotatedRect.points(rect2);
                for (let i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * this.imageResizeRatio;
                }
                const rect = cv.boundingRect(src);
                src.delete();
                hierarchy.delete();
                contours.delete();
                // transform the rectangle into a set of points
                Object.keys(rect).forEach(key => {
                    rect[key] = rect[key] * this.imageResizeRatio;
                });
                let contourCoordinates;
                const firstRoles = [this.isTop(vertices[0], [vertices[1], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                const secondRoles = [this.isTop(vertices[1], [vertices[0], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                const thirdRoles = [this.isTop(vertices[2], [vertices[0], vertices[1], vertices[3]]) ? 'top' : 'bottom'];
                const fourthRoles = [this.isTop(vertices[3], [vertices[0], vertices[2], vertices[1]]) ? 'top' : 'bottom'];
                const roles = [firstRoles, secondRoles, thirdRoles, fourthRoles];
                const ts = [];
                const bs = [];
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i][0] === 'top') {
                        ts.push(i);
                    }
                    else {
                        bs.push(i);
                    }
                }
                dst.delete();
                cnt.delete();
                try {
                    if (this.isLeft(vertices[ts[0]], vertices[ts[1]])) {
                        roles[ts[0]].push('left');
                        roles[ts[1]].push('right');
                    }
                    else {
                        roles[ts[1]].push('right');
                        roles[ts[0]].push('left');
                    }
                    if (this.isLeft(vertices[bs[0]], vertices[bs[1]])) {
                        roles[bs[0]].push('left');
                        roles[bs[1]].push('right');
                    }
                    else {
                        roles[bs[1]].push('left');
                        roles[bs[0]].push('right');
                    }
                }
                catch (e) {
                    this.processing.emit(false);
                    return;
                }
                if (this.config.useRotatedRectangle
                    && this.pointsAreNotTheSame(vertices)) {
                    contourCoordinates = [
                        new PositionChangeData({ x: vertices[0].x, y: vertices[0].y }, firstRoles),
                        new PositionChangeData({ x: vertices[1].x, y: vertices[1].y }, secondRoles),
                        new PositionChangeData({ x: vertices[2].x, y: vertices[2].y }, thirdRoles),
                        new PositionChangeData({ x: vertices[3].x, y: vertices[3].y }, fourthRoles),
                    ];
                }
                else {
                    contourCoordinates = [
                        new PositionChangeData({ x: rect.x, y: rect.y }, ['left', 'top']),
                        new PositionChangeData({ x: rect.x + rect.width, y: rect.y }, ['right', 'top']),
                        new PositionChangeData({ x: rect.x + rect.width, y: rect.y + rect.height }, ['right', 'bottom']),
                        new PositionChangeData({ x: rect.x, y: rect.y + rect.height }, ['left', 'bottom']),
                    ];
                }
                this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }, 30);
        });
    }
    isTop(coordinate, otherVertices) {
        let count = 0;
        for (let i = 0; i < otherVertices.length; i++) {
            if (coordinate.y < otherVertices[i].y) {
                count++;
            }
        }
        return count >= 2;
    }
    isLeft(coordinate, secondCoordinate) {
        return coordinate.x < secondCoordinate.x;
    }
    pointsAreNotTheSame(vertices) {
        return !(vertices[0].x === vertices[1].x && vertices[1].x === vertices[2].x && vertices[2].x === vertices[3].x &&
            vertices[0].y === vertices[1].y && vertices[1].y === vertices[2].y && vertices[2].y === vertices[3].y);
    }
    /**
     * apply perspective transform
     */
    transform() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                const dst = cv.imread(this.editedImage);
                // create source coordinates matrix
                const sourceCoordinates = [
                    this.getPoint(['top', 'left']),
                    this.getPoint(['top', 'right']),
                    this.getPoint(['bottom', 'right']),
                    this.getPoint(['bottom', 'left'])
                ].map(point => {
                    return [point.x / this.imageResizeRatio, point.y / this.imageResizeRatio];
                });
                // get max width
                const bottomWidth = this.getPoint(['bottom', 'right']).x - this.getPoint(['bottom', 'left']).x;
                const topWidth = this.getPoint(['top', 'right']).x - this.getPoint(['top', 'left']).x;
                const maxWidth = Math.max(bottomWidth, topWidth) / this.imageResizeRatio;
                // get max height
                const leftHeight = this.getPoint(['bottom', 'left']).y - this.getPoint(['top', 'left']).y;
                const rightHeight = this.getPoint(['bottom', 'right']).y - this.getPoint(['top', 'right']).y;
                const maxHeight = Math.max(leftHeight, rightHeight) / this.imageResizeRatio;
                // create dest coordinates matrix
                const destCoordinates = [
                    [0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]
                ];
                // convert to open cv matrix objects
                const Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...sourceCoordinates));
                const Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...destCoordinates));
                const transformMatrix = cv.getPerspectiveTransform(Ms, Md);
                // set new image size
                const dsize = new cv.Size(maxWidth, maxHeight);
                // perform warp
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_CUBIC, cv.BORDER_CONSTANT, new cv.Scalar());
                cv.imshow(this.editedImage, dst);
                dst.delete();
                Ms.delete();
                Md.delete();
                transformMatrix.delete();
                this.setPreviewPaneDimensions(this.editedImage);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve();
                });
            }, 30);
        });
    }
    /**
     * applies the selected filter to the image
     * @param preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     */
    applyFilter(preview) {
        return new Promise(async (resolve, reject) => {
            this.processing.emit(true);
            // default options
            const options = {
                blur: false,
                th: true,
                thMode: cv.ADAPTIVE_THRESH_MEAN_C,
                thMeanCorrection: 10,
                thBlockSize: 25,
                thMax: 255,
                grayScale: true,
            };
            const dst = cv.imread(this.editedImage);
            if (!this.config.filterEnable) {
                this.selectedFilter = 'original';
            }
            switch (this.selectedFilter) {
                case 'original':
                    options.th = false;
                    options.grayScale = false;
                    options.blur = false;
                    break;
                case 'magic_color':
                    options.grayScale = false;
                    break;
                case 'bw2':
                    options.thMode = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
                    options.thMeanCorrection = 15;
                    options.thBlockSize = 15;
                    break;
                case 'bw3':
                    options.blur = true;
                    options.thMeanCorrection = 15;
                    break;
            }
            setTimeout(async () => {
                if (options.grayScale) {
                    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                }
                if (options.blur) {
                    const ksize = new cv.Size(5, 5);
                    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
                }
                if (options.th) {
                    if (options.grayScale) {
                        cv.adaptiveThreshold(dst, dst, options.thMax, options.thMode, cv.THRESH_BINARY, options.thBlockSize, options.thMeanCorrection);
                    }
                    else {
                        dst.convertTo(dst, -1, 1, 60);
                        cv.threshold(dst, dst, 170, 255, cv.THRESH_BINARY);
                    }
                }
                if (!preview) {
                    cv.imshow(this.editedImage, dst);
                }
                await this.showPreview(dst);
                this.processing.emit(false);
                resolve();
            }, 30);
        });
    }
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     */
    resize(image) {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                const src = cv.imread(image);
                const currentDimensions = {
                    width: src.size().width,
                    height: src.size().height
                };
                const resizeDimensions = {
                    width: 0,
                    height: 0
                };
                if (currentDimensions.width > this.options.maxImageDimensions.width) {
                    resizeDimensions.width = this.options.maxImageDimensions.width;
                    resizeDimensions.height = this.options.maxImageDimensions.width / currentDimensions.width * currentDimensions.height;
                    if (resizeDimensions.height > this.options.maxImageDimensions.height) {
                        resizeDimensions.height = this.options.maxImageDimensions.height;
                        resizeDimensions.width = this.options.maxImageDimensions.height / currentDimensions.height * currentDimensions.width;
                    }
                    const dsize = new cv.Size(Math.floor(resizeDimensions.width), Math.floor(resizeDimensions.height));
                    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
                    const resizeResult = document.createElement('canvas');
                    cv.imshow(resizeResult, src);
                    src.delete();
                    this.processing.emit(false);
                    resolve(resizeResult);
                }
                else {
                    this.processing.emit(false);
                    resolve(image);
                }
            }, 30);
        });
    }
    /**
     * display a preview of the image on the preview canvas
     */
    showPreview(image) {
        return new Promise((resolve, reject) => {
            let src;
            if (image) {
                src = image;
            }
            else {
                src = cv.imread(this.editedImage);
            }
            const dst = new cv.Mat();
            const dsize = new cv.Size(0, 0);
            cv.resize(src, dst, dsize, this.imageResizeRatio, this.imageResizeRatio, cv.INTER_AREA);
            cv.imshow(this.previewCanvas.nativeElement, dst);
            src.delete();
            dst.delete();
            try {
                if (image) {
                    image.delete();
                }
            }
            catch (e) {
            }
            resolve(image);
        });
    }
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     */
    setPreviewPaneDimensions(img) {
        // set preview pane dimensions
        this.previewDimensions = this.calculateDimensions(img.width, img.height);
        this.previewCanvas.nativeElement.width = this.previewDimensions.width;
        this.previewCanvas.nativeElement.height = this.previewDimensions.height;
        this.imageResizeRatio = this.previewDimensions.width / img.width;
        this.imageDivStyle = {
            width: this.previewDimensions.width + this.options.cropToolDimensions.width + 'px',
            height: this.previewDimensions.height + this.options.cropToolDimensions.height + 'px',
            'margin-left': this.sanitizer.bypassSecurityTrustStyle(`calc((100% - ${this.previewDimensions.width + 10}px) / 2 + ${this.options.cropToolDimensions.width / 2}px)`),
            'margin-right': this.sanitizer.bypassSecurityTrustStyle(`calc((100% - ${this.previewDimensions.width + 10}px) / 2 - ${this.options.cropToolDimensions.width / 2}px)`),
        };
        this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
    }
    /**
     * calculate dimensions of the preview canvas
     */
    calculateDimensions(width, height) {
        const ratio = width / height;
        // const maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
        //   this.maxPreviewWidth : this.screenDimensions.width - 40;
        // const maxHeight = this.screenDimensions.height > this.maxPreviewHeight ? this.maxPreviewHeight : this.screenDimensions.height - 240;
        const maxWidth = this.maxPreviewWidth;
        const maxHeight = this.maxPreviewHeight;
        const calculated = {
            width: maxWidth,
            height: Math.round(maxWidth / ratio),
            ratio: ratio
        };
        if (calculated.height > maxHeight) {
            calculated.height = maxHeight;
            calculated.width = Math.round(maxHeight * ratio);
        }
        return calculated;
    }
    /**
     * returns a point by it's roles
     * @param roles - an array of roles by which the point will be fetched
     */
    getPoint(roles) {
        return this.points.find(point => {
            return this.limitsService.compareArray(point.roles, roles);
        });
    }
    getStoyle() {
        return this.editorStyle;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocScannerComponent, deps: [{ token: i1$1.NgxOpenCVService }, { token: LimitsService }, { token: i1.MatBottomSheet }, { token: i4$1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxDocScannerComponent, selector: "ngx-doc-scanner", inputs: { file: "file", config: "config" }, outputs: { exitEditor: "exitEditor", editResult: "editResult", error: "error", ready: "ready", processing: "processing" }, viewQueries: [{ propertyName: "previewCanvas", first: true, predicate: ["PreviewCanvas"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n", styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}\n"], dependencies: [{ kind: "directive", type: i5$1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { kind: "directive", type: i5$1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { kind: "directive", type: i2.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: NgxDraggablePointComponent, selector: "ngx-draggable-point", inputs: ["width", "height", "color", "shape", "pointOptions", "limitRoles", "startPosition", "container", "_currentPosition"] }, { kind: "component", type: NgxShapeOutlineComponent, selector: "ngx-shape-outine", inputs: ["color", "weight", "dimensions"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocScannerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-doc-scanner', template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n", styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}\n"] }]
        }], ctorParameters: function () { return [{ type: i1$1.NgxOpenCVService }, { type: LimitsService }, { type: i1.MatBottomSheet }, { type: i4$1.DomSanitizer }]; }, propDecorators: { previewCanvas: [{
                type: ViewChild,
                args: ['PreviewCanvas', { read: ElementRef }]
            }], exitEditor: [{
                type: Output
            }], editResult: [{
                type: Output
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], processing: [{
                type: Output
            }], file: [{
                type: Input
            }], config: [{
                type: Input
            }] } });
/**
 * a class for generating configuration objects for the editor
 */
class ImageEditorConfig {
    constructor(options) {
        /**
         * max dimensions of oputput image. if set to zero
         */
        this.maxImageDimensions = {
            width: 30000,
            height: 30000
        };
        /**
         * background color of the main editor div
         */
        this.editorBackgroundColor = '#fefefe';
        /**
         * css properties for the main editor div
         */
        this.editorDimensions = {
            width: '100vw',
            height: '100vh'
        };
        /**
         * css that will be added to the main div of the editor component
         */
        this.extraCss = {
            position: 'absolute',
            top: 0,
            left: 0
        };
        /**
         * material design theme color name
         */
        this.buttonThemeColor = 'accent';
        /**
         * icon for the button that completes the editing and emits the edited image
         */
        this.exportImageIcon = 'cloud_upload';
        /**
         * color of the crop tool
         */
        this.cropToolColor = '#FF3333';
        /**
         * shape of the crop tool, can be either a rectangle or a circle
         */
        this.cropToolShape = 'circle';
        /**
         * dimensions of the crop tool
         */
        this.cropToolDimensions = {
            width: 10,
            height: 10
        };
        /**
         * crop tool outline width
         */
        this.cropToolLineWeight = 3;
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewWidth = 800;
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewHeight = 800;
        if (options) {
            Object.keys(options).forEach(key => {
                this[key] = options[key];
            });
        }
        this.editorStyle = { 'background-color': this.editorBackgroundColor };
        Object.assign(this.editorStyle, this.editorDimensions);
        Object.assign(this.editorStyle, this.extraCss);
        this.pointOptions = {
            shape: this.cropToolShape,
            color: this.cropToolColor,
            width: 0,
            height: 0
        };
        Object.assign(this.pointOptions, this.cropToolDimensions);
    }
}

class NgxDocumentScannerModule {
    static forRoot(config) {
        return {
            ngModule: NgxDocumentScannerModule,
            providers: [
                { provide: OpenCvConfigToken, useValue: config },
            ],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, declarations: [NgxDraggablePointComponent,
            NgxFilterMenuComponent,
            NgxShapeOutlineComponent,
            NgxDocScannerComponent], imports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            CommonModule,
            NgxOpenCVModule,
            MatSliderModule,
            FormsModule], exports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            NgxDocScannerComponent] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, providers: [
            NgxOpenCVService,
            LimitsService,
        ], imports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            CommonModule,
            NgxOpenCVModule,
            MatSliderModule,
            FormsModule, FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxDraggablePointComponent,
                        NgxFilterMenuComponent,
                        NgxShapeOutlineComponent,
                        NgxDocScannerComponent,
                    ],
                    imports: [
                        FlexLayoutModule,
                        MatButtonModule,
                        MatIconModule,
                        MatBottomSheetModule,
                        MatListModule,
                        AngularDraggableModule,
                        CommonModule,
                        NgxOpenCVModule,
                        MatSliderModule,
                        FormsModule,
                    ],
                    exports: [
                        FlexLayoutModule,
                        MatButtonModule,
                        MatIconModule,
                        MatBottomSheetModule,
                        MatListModule,
                        AngularDraggableModule,
                        NgxDocScannerComponent,
                    ],
                    providers: [
                        NgxOpenCVService,
                        LimitsService,
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-document-scanner
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxDocScannerComponent, NgxDocumentScannerModule };
//# sourceMappingURL=ngx-document-scanner.mjs.map
