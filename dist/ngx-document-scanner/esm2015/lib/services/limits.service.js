/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/limits.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class LimitsService {
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
     * @param {?} dimensions
     * @return {?}
     */
    setPaneDimensions(dimensions) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this._paneDimensions = dimensions;
            this.paneDimensions.next(dimensions);
            resolve();
        }));
    }
    /**
     * repositions points externally
     * @param {?} positions
     * @return {?}
     */
    repositionPoints(positions) {
        this._points = positions;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        position => {
            this.positionChange(position);
        }));
        this.repositionEvent.next(positions);
    }
    /**
     * updates limits and point positions and calls next on the observables
     * @param {?} positionChangeData - position change event data
     * @return {?}
     */
    positionChange(positionChangeData) {
        // update positions according to current position change
        this.updatePosition(positionChangeData);
        // for each direction:
        // 1. filter the _points that have a role as the direction's limit
        // 2. for top and left find max x | y values, and min for right and bottom
        this.limitDirections.forEach((/**
         * @param {?} direction
         * @return {?}
         */
        direction => {
            /** @type {?} */
            const relevantPoints = this._points.filter((/**
             * @param {?} point
             * @return {?}
             */
            point => {
                return point.roles.includes(direction);
            }))
                .map((/**
             * @param {?} point
             * @return {?}
             */
            (point) => {
                return point[this.getDirectionAxis(direction)];
            }));
            /** @type {?} */
            let limit;
            if (direction === 'top' || direction === 'left') {
                limit = Math.max(...relevantPoints);
            }
            if (direction === 'right' || direction === 'bottom') {
                limit = Math.min(...relevantPoints);
            }
            this._limits[direction] = limit;
        }));
        this.limits.next(this._limits);
        this.positions.next(Array.from(this._points));
    }
    /**
     * updates the position of the point
     * @param {?} positionChange - position change event data
     * @return {?}
     */
    updatePosition(positionChange) {
        // finds the current position of the point by it's roles, than splices it for the new position or pushes it if it's not yet in the array
        /** @type {?} */
        const index = this._points.findIndex((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return this.compareArray(positionChange.roles, point.roles);
        }));
        if (index === -1) {
            this._points.push(positionChange);
        }
        else {
            this._points.splice(index, 1, positionChange);
        }
    }
    /**
     * check if a position change event exceeds the limits
     * @param {?} positionChange - position change event data
     * @return {?} LimitException0
     */
    exceedsLimit(positionChange) {
        /** @type {?} */
        const pointLimits = this.limitDirections.filter((/**
         * @param {?} direction
         * @return {?}
         */
        direction => {
            return !positionChange.roles.includes(direction);
        }));
        /** @type {?} */
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
        pointLimits.forEach((/**
         * @param {?} direction
         * @return {?}
         */
        direction => {
            /** @type {?} */
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
        }));
        if (limitException.resetCoefficients.x !== 0 || limitException.resetCoefficients.y !== 0) {
            limitException.exceeds = true;
        }
        return limitException;
    }
    /**
     * rotate crop tool points clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    rotateClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        }));
        this.repositionPoints(initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return this.rotateCornerClockwise(point);
        })));
    }
    /**
     * rotate crop tool points anti-clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    rotateAntiClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        }));
        this.repositionPoints(initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return this.rotateCornerAntiClockwise(point);
        })));
    }
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    rotateCornerClockwise(corner) {
        /** @type {?} */
        const rotated = {
            x: this._paneDimensions.width * (1 - corner.y),
            y: this._paneDimensions.height * corner.x,
            roles: []
        };
        // rotates corner according to order
        /** @type {?} */
        const order = [
            ['bottom', 'left'],
            ['top', 'left'],
            ['top', 'right'],
            ['bottom', 'right'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex((/**
         * @param {?} roles
         * @return {?}
         */
        roles => {
            return this.compareArray(roles, corner.roles);
        })) + 1];
        return rotated;
    }
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    rotateCornerAntiClockwise(corner) {
        /** @type {?} */
        const rotated = {
            x: this._paneDimensions.width * corner.y,
            y: this._paneDimensions.height * (1 - corner.x),
            roles: []
        };
        // rotates corner according to order
        /** @type {?} */
        const order = [
            ['bottom', 'left'],
            ['bottom', 'right'],
            ['top', 'right'],
            ['top', 'left'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex((/**
         * @param {?} roles
         * @return {?}
         */
        roles => {
            return this.compareArray(roles, corner.roles);
        })) + 1];
        return rotated;
    }
    /**
     * checks if two array contain the same values
     * @param {?} array1 - array 1
     * @param {?} array2 - array 2
     * @return {?} boolean
     */
    compareArray(array1, array2) {
        return array1.every((/**
         * @param {?} element
         * @return {?}
         */
        (element) => {
            return array2.includes(element);
        })) && array1.length === array2.length;
    }
    /**
     * @private
     * @param {?} direction
     * @return {?}
     */
    getDirectionAxis(direction) {
        return {
            left: 'x',
            right: 'x',
            top: 'y',
            bottom: 'y'
        }[direction];
    }
}
LimitsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
LimitsService.ctorParameters = () => [];
/** @nocollapse */ LimitsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function LimitsService_Factory() { return new LimitsService(); }, token: LimitsService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    LimitsService.prototype.limitDirections;
    /**
     * stores the crop limits limits
     * @type {?}
     * @private
     */
    LimitsService.prototype._limits;
    /**
     * stores the array of the draggable points displayed on the crop area
     * @type {?}
     * @private
     */
    LimitsService.prototype._points;
    /**
     * stores the pane dimensions
     * @type {?}
     * @private
     */
    LimitsService.prototype._paneDimensions;
    /** @type {?} */
    LimitsService.prototype.positions;
    /** @type {?} */
    LimitsService.prototype.repositionEvent;
    /** @type {?} */
    LimitsService.prototype.limits;
    /** @type {?} */
    LimitsService.prototype.paneDimensions;
}
/**
 * @record
 */
export function PointPositionChange() { }
if (false) {
    /** @type {?} */
    PointPositionChange.prototype.x;
    /** @type {?} */
    PointPositionChange.prototype.y;
    /** @type {?} */
    PointPositionChange.prototype.roles;
}
/**
 * @record
 */
export function AreaLimits() { }
if (false) {
    /** @type {?} */
    AreaLimits.prototype.top;
    /** @type {?} */
    AreaLimits.prototype.bottom;
    /** @type {?} */
    AreaLimits.prototype.right;
    /** @type {?} */
    AreaLimits.prototype.left;
}
export class PositionChangeData {
    /**
     * @param {?} position
     * @param {?} roles
     */
    constructor(position, roles) {
        this.x = position.x;
        this.y = position.y;
        this.roles = roles;
    }
}
if (false) {
    /** @type {?} */
    PositionChangeData.prototype.x;
    /** @type {?} */
    PositionChangeData.prototype.y;
    /** @type {?} */
    PositionChangeData.prototype.roles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPckMsTUFBTSxPQUFPLGFBQWE7SUE4QnhCO1FBM0JRLG9CQUFlLEdBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7OztRQUlqRSxZQUFPLEdBQUc7WUFDaEIsR0FBRyxFQUFFLENBQUM7WUFDTixNQUFNLEVBQUUsQ0FBQztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUM7U0FDUixDQUFDOzs7O1FBSU0sWUFBTyxHQUErQixFQUFFLENBQUM7Ozs7UUFTMUMsY0FBUyxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuSSxvQkFBZSxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsRUFBRSxDQUFDLENBQUM7UUFDbkgsV0FBTSxHQUFnQyxJQUFJLGVBQWUsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEYsbUJBQWMsR0FBcUMsSUFBSSxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3JHLENBQUM7Ozs7OztJQUtNLGlCQUFpQixDQUFDLFVBQTJCO1FBQ2xELE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDO1lBQ2xDLElBQUksQ0FB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ekMsa0NBQTBJOztJQUMxSSx3Q0FBMEg7O0lBQzFILCtCQUEyRjs7SUFDM0YsdUNBQXFHOzs7OztBQW1PdkcseUNBSUM7OztJQUhDLGdDQUFVOztJQUNWLGdDQUFVOztJQUNWLG9DQUFrQjs7Ozs7QUFHcEIsZ0NBS0M7OztJQUpDLHlCQUFZOztJQUNaLDRCQUFlOztJQUNmLDJCQUFjOztJQUNkLDBCQUFhOztBQUtmLE1BQU0sT0FBTyxrQkFBa0I7Ozs7O0lBSzdCLFlBQVksUUFBb0IsRUFBRSxLQUFpQjtRQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7Q0FDRjs7O0lBVEMsK0JBQVU7O0lBQ1YsK0JBQVU7O0lBQ1YsbUNBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbn0gZnJvbSAnLi4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaW1pdHNTZXJ2aWNlIHtcclxuXHJcblxyXG4gIHByaXZhdGUgbGltaXREaXJlY3Rpb25zOiBSb2xlc0FycmF5ID0gWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIGNyb3AgbGltaXRzIGxpbWl0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX2xpbWl0cyA9IHtcclxuICAgIHRvcDogMCxcclxuICAgIGJvdHRvbTogMCxcclxuICAgIHJpZ2h0OiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBhcnJheSBvZiB0aGUgZHJhZ2dhYmxlIHBvaW50cyBkaXNwbGF5ZWQgb24gdGhlIGNyb3AgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4gPSBbXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHBhbmUgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcblxyXG4gIC8vICoqKioqKioqKioqIC8vXHJcbiAgLy8gT2JzZXJ2YWJsZXMgLy9cclxuICAvLyAqKioqKioqKioqKiAvL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihBcnJheS5mcm9tKHRoaXMuX3BvaW50cykpO1xyXG4gIHB1YmxpYyByZXBvc2l0aW9uRXZlbnQ6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihbXSk7XHJcbiAgcHVibGljIGxpbWl0czogQmVoYXZpb3JTdWJqZWN0PEFyZWFMaW1pdHM+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcmVhTGltaXRzPih0aGlzLl9saW1pdHMpO1xyXG4gIHB1YmxpYyBwYW5lRGltZW5zaW9uczogQmVoYXZpb3JTdWJqZWN0PEltYWdlRGltZW5zaW9ucz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHt3aWR0aDogMCwgaGVpZ2h0OiAwfSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0IHByaXZldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwdWJsaWMgc2V0UGFuZURpbWVuc2lvbnMoZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLl9wYW5lRGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XHJcbiAgICAgIHRoaXMucGFuZURpbWVuc2lvbnMubmV4dChkaW1lbnNpb25zKTtcclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXBvc2l0aW9ucyBwb2ludHMgZXh0ZXJuYWxseVxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXBvc2l0aW9uUG9pbnRzKHBvc2l0aW9ucykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9zaXRpb25zO1xyXG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xyXG4gICAgICB0aGlzLnBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXBvc2l0aW9uRXZlbnQubmV4dChwb3NpdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBkYXRlcyBsaW1pdHMgYW5kIHBvaW50IHBvc2l0aW9ucyBhbmQgY2FsbHMgbmV4dCBvbiB0aGUgb2JzZXJ2YWJsZXNcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2VEYXRhIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgKi9cclxuICBwdWJsaWMgcG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhOiBQb2ludFBvc2l0aW9uQ2hhbmdlKSB7XHJcbiAgICAvLyB1cGRhdGUgcG9zaXRpb25zIGFjY29yZGluZyB0byBjdXJyZW50IHBvc2l0aW9uIGNoYW5nZVxyXG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG5cclxuICAgIC8vIGZvciBlYWNoIGRpcmVjdGlvbjpcclxuICAgIC8vIDEuIGZpbHRlciB0aGUgX3BvaW50cyB0aGF0IGhhdmUgYSByb2xlIGFzIHRoZSBkaXJlY3Rpb24ncyBsaW1pdFxyXG4gICAgLy8gMi4gZm9yIHRvcCBhbmQgbGVmdCBmaW5kIG1heCB4IHwgeSB2YWx1ZXMsIGFuZCBtaW4gZm9yIHJpZ2h0IGFuZCBib3R0b21cclxuICAgIHRoaXMubGltaXREaXJlY3Rpb25zLmZvckVhY2goZGlyZWN0aW9uID0+IHtcclxuICAgICAgY29uc3QgcmVsZXZhbnRQb2ludHMgPSB0aGlzLl9wb2ludHMuZmlsdGVyKHBvaW50ID0+IHtcclxuICAgICAgICByZXR1cm4gcG9pbnQucm9sZXMuaW5jbHVkZXMoZGlyZWN0aW9uKTtcclxuICAgICAgfSlcclxuICAgICAgLm1hcCgocG9pbnQ6IFBvaW50UG9zaXRpb25DaGFuZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4gcG9pbnRbdGhpcy5nZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbildO1xyXG4gICAgICB9KTtcclxuICAgICAgbGV0IGxpbWl0O1xyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndG9wJyB8fCBkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgIGxpbWl0ID0gTWF0aC5tYXgoLi4ucmVsZXZhbnRQb2ludHMpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcgfHwgZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIGxpbWl0ID0gTWF0aC5taW4oLi4ucmVsZXZhbnRQb2ludHMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dID0gbGltaXQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxpbWl0cy5uZXh0KHRoaXMuX2xpbWl0cyk7XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5uZXh0KEFycmF5LmZyb20odGhpcy5fcG9pbnRzKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB1cGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqL1xyXG4gIHB1YmxpYyB1cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZTogUG9pbnRQb3NpdGlvbkNoYW5nZSkge1xyXG4gICAgLy8gZmluZHMgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50IGJ5IGl0J3Mgcm9sZXMsIHRoYW4gc3BsaWNlcyBpdCBmb3IgdGhlIG5ldyBwb3NpdGlvbiBvciBwdXNoZXMgaXQgaWYgaXQncyBub3QgeWV0IGluIHRoZSBhcnJheVxyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9wb2ludHMuZmluZEluZGV4KHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHBvc2l0aW9uQ2hhbmdlLnJvbGVzLCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgdGhpcy5fcG9pbnRzLnB1c2gocG9zaXRpb25DaGFuZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fcG9pbnRzLnNwbGljZShpbmRleCwgMSwgcG9zaXRpb25DaGFuZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2sgaWYgYSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZXhjZWVkcyB0aGUgbGltaXRzXHJcbiAgICogQHBhcmFtIHBvc2l0aW9uQ2hhbmdlIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgKiBAcmV0dXJucyBMaW1pdEV4Y2VwdGlvbjBcclxuICAgKi9cclxuICBwdWJsaWMgZXhjZWVkc0xpbWl0KHBvc2l0aW9uQ2hhbmdlOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogTGltaXRFeGNlcHRpb24ge1xyXG4gICAgY29uc3QgcG9pbnRMaW1pdHMgPSB0aGlzLmxpbWl0RGlyZWN0aW9ucy5maWx0ZXIoZGlyZWN0aW9uID0+IHtcclxuICAgICAgcmV0dXJuICFwb3NpdGlvbkNoYW5nZS5yb2xlcy5pbmNsdWRlcyhkaXJlY3Rpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbGltaXRFeGNlcHRpb246IExpbWl0RXhjZXB0aW9uID0ge1xyXG4gICAgICBleGNlZWRzOiBmYWxzZSxcclxuICAgICAgcmVzZXRDb2VmZmljaWVudHM6IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfSxcclxuICAgICAgcmVzZXRDb29yZGluYXRlczoge1xyXG4gICAgICAgIHg6IHBvc2l0aW9uQ2hhbmdlLngsXHJcbiAgICAgICAgeTogcG9zaXRpb25DaGFuZ2UueVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGxpbWl0IGRpcmVjdGlvbnMgYXJlIHRoZSBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgcG9pbnQncyByb2xlc1xyXG4gICAgcG9pbnRMaW1pdHMuZm9yRWFjaChkaXJlY3Rpb24gPT4ge1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb25BeGlzID0gdGhpcy5nZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbik7XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd0b3AnIHx8IGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uQ2hhbmdlW2RpcmVjdGlvbkF4aXNdIDwgdGhpcy5fbGltaXRzW2RpcmVjdGlvbl0pIHtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2RpcmVjdGlvbkF4aXNdID0gMTtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXNbZGlyZWN0aW9uQXhpc10gPSB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnIHx8IGRpcmVjdGlvbiA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICBpZiAocG9zaXRpb25DaGFuZ2VbZGlyZWN0aW9uQXhpc10gPiB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXSkge1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbZGlyZWN0aW9uQXhpc10gPSAtMTtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXNbZGlyZWN0aW9uQXhpc10gPSB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50cy54ICE9PSAwIHx8IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzLnkgIT09IDApIHtcclxuICAgICAgbGltaXRFeGNlcHRpb24uZXhjZWVkcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxpbWl0RXhjZXB0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGNyb3AgdG9vbCBwb2ludHMgY2xvY2t3aXNlXHJcbiAgICogQHBhcmFtIHJlc2l6ZVJhdGlvcyAtIHJhdGlvIGJldHdlZW4gdGhlIG5ldyBkaW1lbnNpb25zIGFuZCB0aGUgcHJldmlvdXNcclxuICAgKiBAcGFyYW0gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zIC0gcHJldmlldyBwYW5lIGRpbWVuc2lvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICogQHBhcmFtIGluaXRpYWxQb3NpdGlvbnMgLSBjdXJyZW50IHBvc2l0aW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgcm90YXRlQ2xvY2t3aXNlKHJlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgLy8gY29udmVydCBwb3NpdGlvbnMgdG8gcmF0aW8gYmV0d2VlbiBwb3NpdGlvbiB0byBpbml0aWFsIHBhbmUgZGltZW5zaW9uXHJcbiAgICBpbml0aWFsUG9zaXRpb25zID0gaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7XHJcbiAgICAgICAgeDogcG9pbnQueCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICB5OiBwb2ludC55IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodCxcclxuICAgICAgfSwgcG9pbnQucm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25Qb2ludHMoaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdGVDb3JuZXJDbG9ja3dpc2UocG9pbnQpO1xyXG4gICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGNyb3AgdG9vbCBwb2ludHMgYW50aS1jbG9ja3dpc2VcclxuICAgKiBAcGFyYW0gcmVzaXplUmF0aW9zIC0gcmF0aW8gYmV0d2VlbiB0aGUgbmV3IGRpbWVuc2lvbnMgYW5kIHRoZSBwcmV2aW91c1xyXG4gICAqIEBwYXJhbSBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgLSBwcmV2aWV3IHBhbmUgZGltZW5zaW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKiBAcGFyYW0gaW5pdGlhbFBvc2l0aW9ucyAtIGN1cnJlbnQgcG9zaXRpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyByb3RhdGVBbnRpQ2xvY2t3aXNlKHJlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgLy8gY29udmVydCBwb3NpdGlvbnMgdG8gcmF0aW8gYmV0d2VlbiBwb3NpdGlvbiB0byBpbml0aWFsIHBhbmUgZGltZW5zaW9uXHJcbiAgICBpbml0aWFsUG9zaXRpb25zID0gaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7XHJcbiAgICAgICAgeDogcG9pbnQueCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICB5OiBwb2ludC55IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodCxcclxuICAgICAgfSwgcG9pbnQucm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25Qb2ludHMoaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdGVDb3JuZXJBbnRpQ2xvY2t3aXNlKHBvaW50KTtcclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgdGhlIGNvcm5lciBwb3NpdGlvbnMgYWZ0ZXIgYSA5MCBkZWdyZWVzIGNsb2Nrd2lzZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgcm90YXRlQ29ybmVyQ2xvY2t3aXNlKGNvcm5lcjogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgY29uc3Qgcm90YXRlZDogUG9pbnRQb3NpdGlvbkNoYW5nZSA9IHtcclxuICAgICAgeDogdGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGggKiAoMSAtIGNvcm5lci55KSxcclxuICAgICAgeTogdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0ICogY29ybmVyLngsXHJcbiAgICAgIHJvbGVzOiBbXVxyXG4gICAgfTtcclxuICAgIC8vIHJvdGF0ZXMgY29ybmVyIGFjY29yZGluZyB0byBvcmRlclxyXG4gICAgY29uc3Qgb3JkZXI6IEFycmF5PFJvbGVzQXJyYXk+ID0gW1xyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J10sXHJcbiAgICAgIFsndG9wJywgJ2xlZnQnXSxcclxuICAgICAgWyd0b3AnLCAncmlnaHQnXSxcclxuICAgICAgWydib3R0b20nLCAncmlnaHQnXSxcclxuICAgICAgWydib3R0b20nLCAnbGVmdCddXHJcbiAgICBdO1xyXG4gICAgcm90YXRlZC5yb2xlcyA9IG9yZGVyW29yZGVyLmZpbmRJbmRleChyb2xlcyA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVBcnJheShyb2xlcywgY29ybmVyLnJvbGVzKTtcclxuICAgIH0pICsgMV07XHJcbiAgICByZXR1cm4gcm90YXRlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgdGhlIGNvcm5lciBwb3NpdGlvbnMgYWZ0ZXIgYSA5MCBkZWdyZWVzIGFudGktY2xvY2t3aXNlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByb3RhdGVDb3JuZXJBbnRpQ2xvY2t3aXNlKGNvcm5lcjogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgY29uc3Qgcm90YXRlZDogUG9pbnRQb3NpdGlvbkNoYW5nZSA9IHtcclxuICAgICAgeDogdGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGggKiBjb3JuZXIueSxcclxuICAgICAgeTogdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0ICogKDEgLSBjb3JuZXIueCksXHJcbiAgICAgIHJvbGVzOiBbXVxyXG4gICAgfTtcclxuICAgIC8vIHJvdGF0ZXMgY29ybmVyIGFjY29yZGluZyB0byBvcmRlclxyXG4gICAgY29uc3Qgb3JkZXI6IEFycmF5PFJvbGVzQXJyYXk+ID0gW1xyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J10sXHJcbiAgICAgIFsnYm90dG9tJywgJ3JpZ2h0J10sXHJcbiAgICAgIFsndG9wJywgJ3JpZ2h0J10sXHJcbiAgICAgIFsndG9wJywgJ2xlZnQnXSxcclxuICAgICAgWydib3R0b20nLCAnbGVmdCddXHJcbiAgICBdO1xyXG4gICAgcm90YXRlZC5yb2xlcyA9IG9yZGVyW29yZGVyLmZpbmRJbmRleChyb2xlcyA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVBcnJheShyb2xlcywgY29ybmVyLnJvbGVzKTtcclxuICAgIH0pICsgMV07XHJcbiAgICByZXR1cm4gcm90YXRlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrcyBpZiB0d28gYXJyYXkgY29udGFpbiB0aGUgc2FtZSB2YWx1ZXNcclxuICAgKiBAcGFyYW0gYXJyYXkxIC0gYXJyYXkgMVxyXG4gICAqIEBwYXJhbSBhcnJheTIgLSBhcnJheSAyXHJcbiAgICogQHJldHVybnMgYm9vbGVhblxyXG4gICAqL1xyXG4gIHB1YmxpYyBjb21wYXJlQXJyYXkoYXJyYXkxOiBBcnJheTxzdHJpbmc+LCBhcnJheTI6IEFycmF5PHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgIHJldHVybiBhcnJheTEuZXZlcnkoKGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIGFycmF5Mi5pbmNsdWRlcyhlbGVtZW50KTtcclxuICAgIH0pICYmIGFycmF5MS5sZW5ndGggPT09IGFycmF5Mi5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERpcmVjdGlvbkF4aXMoZGlyZWN0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsZWZ0OiAneCcsXHJcbiAgICAgIHJpZ2h0OiAneCcsXHJcbiAgICAgIHRvcDogJ3knLFxyXG4gICAgICBib3R0b206ICd5J1xyXG4gICAgfVtkaXJlY3Rpb25dO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxuICByb2xlczogUm9sZXNBcnJheTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBcmVhTGltaXRzIHtcclxuICB0b3A6IG51bWJlcjtcclxuICBib3R0b206IG51bWJlcjtcclxuICByaWdodDogbnVtYmVyO1xyXG4gIGxlZnQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgUm9sZXNBcnJheSA9IEFycmF5PERpcmVjdGlvbj47XHJcblxyXG5leHBvcnQgY2xhc3MgUG9zaXRpb25DaGFuZ2VEYXRhIGltcGxlbWVudHMgUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxuICByb2xlczogUm9sZXNBcnJheTtcclxuXHJcbiAgY29uc3RydWN0b3IocG9zaXRpb246IFhZUG9zaXRpb24sIHJvbGVzOiBSb2xlc0FycmF5KSB7XHJcbiAgICB0aGlzLnggPSBwb3NpdGlvbi54O1xyXG4gICAgdGhpcy55ID0gcG9zaXRpb24ueTtcclxuICAgIHRoaXMucm9sZXMgPSByb2xlcztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIERpcmVjdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nO1xyXG4iXX0=