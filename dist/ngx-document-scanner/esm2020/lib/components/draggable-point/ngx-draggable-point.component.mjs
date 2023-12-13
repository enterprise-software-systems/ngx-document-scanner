import { Component, HostListener, Input } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/limits.service";
import * as i2 from "@angular/flex-layout/extended";
import * as i3 from "angular2-draggable";
import * as i4 from "@angular/common";
export class NgxDraggablePointComponent {
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
}
/** @nocollapse */ NgxDraggablePointComponent.ɵfac = function NgxDraggablePointComponent_Factory(t) { return new (t || NgxDraggablePointComponent)(i0.ɵɵdirectiveInject(i1.LimitsService)); };
/** @nocollapse */ NgxDraggablePointComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NgxDraggablePointComponent, selectors: [["ngx-draggable-point"]], hostBindings: function NgxDraggablePointComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mouseup", function NgxDraggablePointComponent_mouseup_HostBindingHandler($event) { return ctx.mouseUp($event); }, false, i0.ɵɵresolveWindow);
    } }, inputs: { width: "width", height: "height", color: "color", shape: "shape", pointOptions: "pointOptions", limitRoles: "limitRoles", startPosition: "startPosition", container: "container", _currentPosition: "_currentPosition" }, decls: 2, vars: 4, consts: [["ngDraggable", "draggable", 2, "z-index", "1000", 3, "ngStyle", "position", "bounds", "inBounds", "movingOffset", "mousedown", "mouseup", "mouseover", "mouseleave", "endOffset"], ["point", ""]], template: function NgxDraggablePointComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵlistener("movingOffset", function NgxDraggablePointComponent_Template_div_movingOffset_0_listener($event) { return ctx.positionChange($event); })("mousedown", function NgxDraggablePointComponent_Template_div_mousedown_0_listener() { return ctx.clicking = true; })("mouseup", function NgxDraggablePointComponent_Template_div_mouseup_0_listener() { return ctx.clicking = false; })("mouseover", function NgxDraggablePointComponent_Template_div_mouseover_0_listener() { return ctx.hover = true; })("mouseleave", function NgxDraggablePointComponent_Template_div_mouseleave_0_listener() { return ctx.hover = false; })("endOffset", function NgxDraggablePointComponent_Template_div_endOffset_0_listener($event) { return ctx.movementEnd($event); });
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("ngStyle", ctx.getStyle())("position", ctx.position)("bounds", ctx.container)("inBounds", true);
    } }, dependencies: [i2.DefaultStyleDirective, i3.AngularDraggableDirective, i4.NgStyle] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxDraggablePointComponent, [{
        type: Component,
        args: [{ selector: 'ngx-draggable-point', template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"getStyle()\"\r\n     (mousedown)=\"clicking=true\"\r\n     (mouseup)=\"clicking=false\"\r\n     (mouseover)=\"hover=true\"\r\n     (mouseleave)=\"hover=false\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n     style=\"z-index: 1000\">\r\n</div>\r\n" }]
    }], function () { return [{ type: i1.LimitsService }]; }, { width: [{
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
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZG9jdW1lbnQtc2Nhbm5lci9zcmMvbGliL2NvbXBvbmVudHMvZHJhZ2dhYmxlLXBvaW50L25neC1kcmFnZ2FibGUtcG9pbnQuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7O0FBU3JHLE1BQU0sT0FBTywwQkFBMEI7SUFtQnJDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBbEJ2QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFVBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsVUFBSyxHQUFzQixNQUFNLENBQUM7UUFDbEMsaUJBQVksR0FBc0IsTUFBTSxDQUFDO1FBS2xELFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBZTtZQUNyQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztJQUtGLENBQUM7SUFFRCxlQUFlO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFH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WUFDRyxTQUFTO2tCQUFqQixLQUFLO1lBQ1csZ0JBQWdCO2tCQUFoQyxLQUFLO1lBcUNOLE9BQU87a0JBRE4sWUFBWTttQkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGF9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7TGltaXRFeGNlcHRpb24sIFhZUG9zaXRpb259IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZHJhZ2dhYmxlLXBvaW50JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEcmFnZ2FibGVQb2ludENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIHdpZHRoID0gMTA7XHJcbiAgQElucHV0KCkgaGVpZ2h0ID0gMTA7XHJcbiAgQElucHV0KCkgY29sb3IgPSAnIzNjYWJlMic7XHJcbiAgQElucHV0KCkgc2hhcGU6ICdyZWN0JyB8ICdjaXJjbGUnID0gJ3JlY3QnO1xyXG4gIEBJbnB1dCgpIHBvaW50T3B0aW9uczogJ3JlY3QnIHwgJ2NpcmNsZScgPSAncmVjdCc7XHJcbiAgQElucHV0KCkgbGltaXRSb2xlczogQXJyYXk8J2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc+O1xyXG4gIEBJbnB1dCgpIHN0YXJ0UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgQElucHV0KCkgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuICBASW5wdXQoKSBwcml2YXRlIF9jdXJyZW50UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgaG92ZXIgPSBmYWxzZTtcclxuICBjbGlja2luZyA9IGZhbHNlO1xyXG4gIHBvc2l0aW9uOiBYWVBvc2l0aW9uID0ge1xyXG4gICAgeDogMCxcclxuICAgIHk6IDBcclxuICB9O1xyXG4gIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgcmVzZXRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnBvaW50T3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLnBvaW50T3B0aW9uc1trZXldO1xyXG4gICAgfSk7XHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gcGFuZSBkaW1lbnNpb25zIGNoYW5nZXNcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wYW5lRGltZW5zaW9ucy5zdWJzY3JpYmUoZGltZW5zaW9ucyA9PiB7XHJcbiAgICAgIGlmIChkaW1lbnNpb25zLndpZHRoID4gMCAmJiBkaW1lbnNpb25zLndpZHRoID4gMCkge1xyXG4gICAgICAgIHRoaXMuX3BhbmVEaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IGRpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5nZXRJbml0aWFsUG9zaXRpb24oZGltZW5zaW9ucyk7XHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9uQ2hhbmdlKG5ldyBQb3NpdGlvbkNoYW5nZURhdGEodGhpcy5wb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIGV4dGVybmFsIHJlcG9zaXRpb24gZXZlbnRzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvbkV2ZW50LnN1YnNjcmliZShwb3NpdGlvbnMgPT4ge1xyXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmV4dGVybmFsUmVwb3NpdGlvbihwb3NpdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZXVwJywgWyckZXZlbnQnXSlcclxuICBtb3VzZVVwKGV2ZW50KSB7XHJcbiAgICB0aGlzLmNsaWNraW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmhvdmVyID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgY3NzIHN0eWxlIG9iamVjdCBmb3IgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9pbnRTdHlsZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArICdweCcsXHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5jb2xvcixcclxuICAgICAgJ2JvcmRlci1yYWRpdXMnOiB0aGlzLnNoYXBlID09PSAnY2lyY2xlJyA/ICcxMDAlJyA6IDAsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaG92ZXJQb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4udGhpcy5wb2ludFN0eWxlKCksXHJcbiAgICAgIGN1cnNvcjogJ2dyYWInLFxyXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjQ0NGRjMzJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNsaWNraW5nUG9pbnRTdHlsZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLnRoaXMuaG92ZXJQb2ludFN0eWxlKCksXHJcbiAgICAgIGN1cnNvcjogJ2dyYWJiaW5nJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldFN0eWxlKCkge1xyXG4gICAgaWYgKHRoaXMuY2xpY2tpbmcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xpY2tpbmdQb2ludFN0eWxlKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaG92ZXIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaG92ZXJQb2ludFN0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVnaXN0ZXJzIGEgcG9zaXRpb24gY2hhbmdlIG9uIHRoZSBsaW1pdHMgc2VydmljZSwgYW5kIGFkanVzdHMgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XHJcbiAgICogQHBhcmFtIHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9zaXRpb25DaGFuZ2UocG9zaXRpb246IFhZUG9zaXRpb24pIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEocG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbiA9IHRoaXMubGltaXRzU2VydmljZS5leGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5leGNlZWRzKSB7XHJcbiAgICAgIC8vIGlmIGV4Y2VlZHMgbGltaXRzLCByZXBvc2l0aW9uXHJcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbiA9IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgICAgdGhpcy5fY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhZGp1c3RzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYWZ0ZXIgYSBsaW1pdCBleGNlcHRpb25cclxuICAgKi9cclxuICBwcml2YXRlIGFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uOiBMaW1pdEV4Y2VwdGlvbikge1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb24gPSB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnN0YXJ0UG9zaXRpb24pLmZvckVhY2goYXhpcyA9PiB7XHJcbiAgICAgIG5ld1Bvc2l0aW9uW2F4aXNdID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1theGlzXSArIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2F4aXNdO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UobmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGxlZCBvbiBtb3ZlbWVudCBlbmQsIGNoZWNrcyBpZiBsYXN0IHBvc2l0aW9uIGV4Y2VlZGVkIHRoZSBsaW1pdHMgYWQgYWRqdXN0c1xyXG4gICAqL1xyXG4gIG1vdmVtZW50RW5kKHBvc2l0aW9uOiBYWVBvc2l0aW9uKSB7XHJcbiAgICBsZXQgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YShwb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uID0gdGhpcy5saW1pdHNTZXJ2aWNlLmV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlcztcclxuICAgICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgICB0aGlzLmFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uKTtcclxuICAgICAgICBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZXMgdGhlIGluaXRpYWwgcG9zaXRpb25zIG9mIHRoZSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgLSBkaW1lbnNpb25zIG9mIHRoZSBwYW5lIGluIHdoaWNoIHRoZSBwb2ludCBpcyBsb2NhdGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRJbml0aWFsUG9zaXRpb24oZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiB0aGlzLmxpbWl0Um9sZXMuaW5jbHVkZXMoJ2xlZnQnKSA/IDAgOiBkaW1lbnNpb25zLndpZHRoIC0gdGhpcy53aWR0aCAvIDIsXHJcbiAgICAgIHk6IHRoaXMubGltaXRSb2xlcy5pbmNsdWRlcygndG9wJykgPyAwIDogZGltZW5zaW9ucy5oZWlnaHQgLSB0aGlzLmhlaWdodCAvIDJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXBvc2l0aW9ucyB0aGUgcG9pbnQgYWZ0ZXIgYW4gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudFxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcG9pbnRzIG9uIHRoZSBwYW5lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBleHRlcm5hbFJlcG9zaXRpb24ocG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xyXG4gICAgICBpZiAodGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheSh0aGlzLmxpbWl0Um9sZXMsIHBvc2l0aW9uLnJvbGVzKSkge1xyXG4gICAgICAgIHBvc2l0aW9uID0gdGhpcy5lbmZvcmNlUGFuZUxpbWl0cyhwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgIHg6IHBvc2l0aW9uLngsXHJcbiAgICAgICAgICB5OiBwb3NpdGlvbi55XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgbmV3IHBvaW50IHBvc2l0aW9uIGlmIHRoZSBtb3ZlbWVudCBleGNlZWRlZCB0aGUgcGFuZSBsaW1pdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5mb3JjZVBhbmVMaW1pdHMocG9zaXRpb246IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIGlmICh0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCA9PT0gMCB8fCB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHBvc2l0aW9uLnggPiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnggPSB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueCA8IDApIHtcclxuICAgICAgICBwb3NpdGlvbi54ID0gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueSA+IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnkgPSB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgICAgcG9zaXRpb24ueSA9IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbiIsIjxkaXYgI3BvaW50IG5nRHJhZ2dhYmxlPVwiZHJhZ2dhYmxlXCJcclxuICAgICAobW92aW5nT2Zmc2V0KT1cInBvc2l0aW9uQ2hhbmdlKCRldmVudClcIlxyXG4gICAgIFtuZ1N0eWxlXT1cImdldFN0eWxlKClcIlxyXG4gICAgIChtb3VzZWRvd24pPVwiY2xpY2tpbmc9dHJ1ZVwiXHJcbiAgICAgKG1vdXNldXApPVwiY2xpY2tpbmc9ZmFsc2VcIlxyXG4gICAgIChtb3VzZW92ZXIpPVwiaG92ZXI9dHJ1ZVwiXHJcbiAgICAgKG1vdXNlbGVhdmUpPVwiaG92ZXI9ZmFsc2VcIlxyXG4gICAgIFtwb3NpdGlvbl09XCJwb3NpdGlvblwiXHJcbiAgICAgW2JvdW5kc109XCJjb250YWluZXJcIlxyXG4gICAgIFtpbkJvdW5kc109XCJ0cnVlXCJcclxuICAgICAoZW5kT2Zmc2V0KT1cIm1vdmVtZW50RW5kKCRldmVudClcIlxyXG4gICAgIHN0eWxlPVwiei1pbmRleDogMTAwMFwiPlxyXG48L2Rpdj5cclxuIl19