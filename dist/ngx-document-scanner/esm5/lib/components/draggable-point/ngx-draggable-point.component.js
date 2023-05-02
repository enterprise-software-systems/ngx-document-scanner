/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/draggable-point/ngx-draggable-point.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __assign } from "tslib";
import { Component, HostListener, Input } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
var NgxDraggablePointComponent = /** @class */ (function () {
    function NgxDraggablePointComponent(limitsService) {
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
    /**
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        Object.keys(this.pointOptions).forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            _this[key] = _this.pointOptions[key];
        }));
        // subscribe to pane dimensions changes
        this.limitsService.paneDimensions.subscribe((/**
         * @param {?} dimensions
         * @return {?}
         */
        function (dimensions) {
            if (dimensions.width > 0 && dimensions.width > 0) {
                _this._paneDimensions = {
                    width: dimensions.width,
                    height: dimensions.height
                };
                _this.position = _this.getInitialPosition(dimensions);
                _this.limitsService.positionChange(new PositionChangeData(_this.position, _this.limitRoles));
            }
        }));
        // subscribe to external reposition events
        this.limitsService.repositionEvent.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        function (positions) {
            if (positions.length > 0) {
                _this.externalReposition(positions);
            }
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.mouseUp = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.clicking = false;
        this.hover = false;
    };
    /**
     * returns a css style object for the point
     */
    /**
     * returns a css style object for the point
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.pointStyle = /**
     * returns a css style object for the point
     * @return {?}
     */
    function () {
        return {
            width: this.width + 'px',
            height: this.height + 'px',
            'background-color': this.color,
            'border-radius': this.shape === 'circle' ? '100%' : 0,
            position: 'absolute'
        };
    };
    /**
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.hoverPointStyle = /**
     * @return {?}
     */
    function () {
        return __assign(__assign({}, this.pointStyle()), { cursor: 'grab', 'background-color': '#CCFF33' });
    };
    /**
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.clickingPointStyle = /**
     * @return {?}
     */
    function () {
        return __assign(__assign({}, this.hoverPointStyle()), { cursor: 'grabbing' });
    };
    /**
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.getStyle = /**
     * @return {?}
     */
    function () {
        if (this.clicking) {
            return this.clickingPointStyle();
        }
        else if (this.hover) {
            return this.hoverPointStyle();
        }
        return this.pointStyle();
    };
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param position - the current position of the point
     */
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param {?} position - the current position of the point
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.positionChange = /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param {?} position - the current position of the point
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var positionChangeData = new PositionChangeData(position, this.limitRoles);
        /** @type {?} */
        var limitException = this.limitsService.exceedsLimit(positionChangeData);
        if (limitException.exceeds) {
            // if exceeds limits, reposition
            this.resetPosition = limitException.resetCoordinates;
        }
        else {
            this.limitsService.positionChange(positionChangeData);
            this._currentPosition = position;
        }
    };
    /**
     * adjusts the position of the point after a limit exception
     */
    /**
     * adjusts the position of the point after a limit exception
     * @private
     * @param {?} limitException
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.adjustPosition = /**
     * adjusts the position of the point after a limit exception
     * @private
     * @param {?} limitException
     * @return {?}
     */
    function (limitException) {
        /** @type {?} */
        var newPosition = {
            x: 0,
            y: 0
        };
        Object.keys(this.startPosition).forEach((/**
         * @param {?} axis
         * @return {?}
         */
        function (axis) {
            newPosition[axis] = limitException.resetCoordinates[axis] + limitException.resetCoefficients[axis];
        }));
        this.position = newPosition;
        this.limitsService.positionChange(new PositionChangeData(this.position, this.limitRoles));
    };
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     */
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     * @param {?} position
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.movementEnd = /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var positionChangeData = new PositionChangeData(position, this.limitRoles);
        /** @type {?} */
        var limitException = this.limitsService.exceedsLimit(positionChangeData);
        if (limitException.exceeds) {
            this.resetPosition = limitException.resetCoordinates;
            if (limitException.exceeds) {
                this.adjustPosition(limitException);
                positionChangeData = new PositionChangeData(this.position, this.limitRoles);
                this.limitsService.updatePosition(positionChangeData);
            }
        }
    };
    /**
     * calculates the initial positions of the point by it's roles
     * @param dimensions - dimensions of the pane in which the point is located
     */
    /**
     * calculates the initial positions of the point by it's roles
     * @private
     * @param {?} dimensions - dimensions of the pane in which the point is located
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.getInitialPosition = /**
     * calculates the initial positions of the point by it's roles
     * @private
     * @param {?} dimensions - dimensions of the pane in which the point is located
     * @return {?}
     */
    function (dimensions) {
        return {
            x: this.limitRoles.includes('left') ? 0 : dimensions.width - this.width / 2,
            y: this.limitRoles.includes('top') ? 0 : dimensions.height - this.height / 2
        };
    };
    /**
     * repositions the point after an external reposition event
     * @param positions - an array of all points on the pane
     */
    /**
     * repositions the point after an external reposition event
     * @private
     * @param {?} positions - an array of all points on the pane
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.externalReposition = /**
     * repositions the point after an external reposition event
     * @private
     * @param {?} positions - an array of all points on the pane
     * @return {?}
     */
    function (positions) {
        var _this = this;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            if (_this.limitsService.compareArray(_this.limitRoles, position.roles)) {
                position = _this.enforcePaneLimits(position);
                _this.position = {
                    x: position.x,
                    y: position.y
                };
            }
        }));
    };
    /**
     * returns a new point position if the movement exceeded the pane limit
     */
    /**
     * returns a new point position if the movement exceeded the pane limit
     * @private
     * @param {?} position
     * @return {?}
     */
    NgxDraggablePointComponent.prototype.enforcePaneLimits = /**
     * returns a new point position if the movement exceeded the pane limit
     * @private
     * @param {?} position
     * @return {?}
     */
    function (position) {
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
    };
    NgxDraggablePointComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-draggable-point',
                    template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"getStyle()\"\r\n     (mousedown)=\"clicking=true\"\r\n     (mouseup)=\"clicking=false\"\r\n     (mouseover)=\"hover=true\"\r\n     (mouseleave)=\"hover=false\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n     style=\"z-index: 1000\">\r\n</div>\r\n",
                    styles: [""]
                }] }
    ];
    /** @nocollapse */
    NgxDraggablePointComponent.ctorParameters = function () { return [
        { type: LimitsService }
    ]; };
    NgxDraggablePointComponent.propDecorators = {
        width: [{ type: Input }],
        height: [{ type: Input }],
        color: [{ type: Input }],
        shape: [{ type: Input }],
        pointOptions: [{ type: Input }],
        limitRoles: [{ type: Input }],
        startPosition: [{ type: Input }],
        container: [{ type: Input }],
        _currentPosition: [{ type: Input }],
        mouseUp: [{ type: HostListener, args: ['window:mouseup', ['$event'],] }]
    };
    return NgxDraggablePointComponent;
}());
export { NgxDraggablePointComponent };
if (false) {
    /** @type {?} */
    NgxDraggablePointComponent.prototype.width;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.height;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.color;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.shape;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.pointOptions;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.limitRoles;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.startPosition;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.container;
    /**
     * @type {?}
     * @private
     */
    NgxDraggablePointComponent.prototype._currentPosition;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.hover;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.clicking;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.position;
    /**
     * @type {?}
     * @private
     */
    NgxDraggablePointComponent.prototype._paneDimensions;
    /** @type {?} */
    NgxDraggablePointComponent.prototype.resetPosition;
    /**
     * @type {?}
     * @private
     */
    NgxDraggablePointComponent.prototype.limitsService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBQyxhQUFhLEVBQXVCLGtCQUFrQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFJckc7SUF3QkUsb0NBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBbEJ2QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFVBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsVUFBSyxHQUFzQixNQUFNLENBQUM7UUFDbEMsaUJBQVksR0FBc0IsTUFBTSxDQUFDO1FBS2xELFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBZTtZQUNyQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztJQUtGLENBQUM7Ozs7SUFFRCxvREFBZTs7O0lBQWY7UUFBQSxpQkFxQkM7UUFwQkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsR0FBRztZQUN4QyxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQUMsQ0FBQztRQUNILHVDQUF1QztRQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQSxVQUFVO1lB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OztJQUN6QyxtREFBMEI7Ozs7O0lBRWQsbURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEhvc3RMaXN0ZW5lciwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0xpbWl0c1NlcnZpY2UsIFBvaW50UG9zaXRpb25DaGFuZ2UsIFBvc2l0aW9uQ2hhbmdlRGF0YX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbn0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1kcmFnZ2FibGUtcG9pbnQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERyYWdnYWJsZVBvaW50Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgd2lkdGggPSAxMDtcclxuICBASW5wdXQoKSBoZWlnaHQgPSAxMDtcclxuICBASW5wdXQoKSBjb2xvciA9ICcjM2NhYmUyJztcclxuICBASW5wdXQoKSBzaGFwZTogJ3JlY3QnIHwgJ2NpcmNsZScgPSAncmVjdCc7XHJcbiAgQElucHV0KCkgcG9pbnRPcHRpb25zOiAncmVjdCcgfCAnY2lyY2xlJyA9ICdyZWN0JztcclxuICBASW5wdXQoKSBsaW1pdFJvbGVzOiBBcnJheTwnbGVmdCcgfCAncmlnaHQnIHwgJ3RvcCcgfCAnYm90dG9tJz47XHJcbiAgQElucHV0KCkgc3RhcnRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICBASW5wdXQoKSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG4gIEBJbnB1dCgpIHByaXZhdGUgX2N1cnJlbnRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICBob3ZlciA9IGZhbHNlO1xyXG4gIGNsaWNraW5nID0gZmFsc2U7XHJcbiAgcG9zaXRpb246IFhZUG9zaXRpb24gPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMFxyXG4gIH07XHJcbiAgcHJpdmF0ZSBfcGFuZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICByZXNldFBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMucG9pbnRPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMucG9pbnRPcHRpb25zW2tleV07XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBwYW5lIGRpbWVuc2lvbnMgY2hhbmdlc1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBhbmVEaW1lbnNpb25zLnN1YnNjcmliZShkaW1lbnNpb25zID0+IHtcclxuICAgICAgaWYgKGRpbWVuc2lvbnMud2lkdGggPiAwICYmIGRpbWVuc2lvbnMud2lkdGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5fcGFuZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogZGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLmdldEluaXRpYWxQb3NpdGlvbihkaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UobmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudHNcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uRXZlbnQuc3Vic2NyaWJlKHBvc2l0aW9ucyA9PiB7XHJcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuZXh0ZXJuYWxSZXBvc2l0aW9uKHBvc2l0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93Om1vdXNldXAnLCBbJyRldmVudCddKVxyXG4gIG1vdXNlVXAoZXZlbnQpIHtcclxuICAgIHRoaXMuY2xpY2tpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaG92ZXIgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBjc3Mgc3R5bGUgb2JqZWN0IGZvciB0aGUgcG9pbnRcclxuICAgKi9cclxuICBwb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyAncHgnLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiB0aGlzLmNvbG9yLFxyXG4gICAgICAnYm9yZGVyLXJhZGl1cyc6IHRoaXMuc2hhcGUgPT09ICdjaXJjbGUnID8gJzEwMCUnIDogMCxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBob3ZlclBvaW50U3R5bGUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi50aGlzLnBvaW50U3R5bGUoKSxcclxuICAgICAgY3Vyc29yOiAnZ3JhYicsXHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNDQ0ZGMzMnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY2xpY2tpbmdQb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4udGhpcy5ob3ZlclBvaW50U3R5bGUoKSxcclxuICAgICAgY3Vyc29yOiAnZ3JhYmJpbmcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGUoKSB7XHJcbiAgICBpZiAodGhpcy5jbGlja2luZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGlja2luZ1BvaW50U3R5bGUoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5ob3Zlcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5ob3ZlclBvaW50U3R5bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wb2ludFN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWdpc3RlcnMgYSBwb3NpdGlvbiBjaGFuZ2Ugb24gdGhlIGxpbWl0cyBzZXJ2aWNlLCBhbmQgYWRqdXN0cyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcclxuICAgKiBAcGFyYW0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgKi9cclxuICBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogWFlQb3NpdGlvbikge1xyXG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YShwb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uID0gdGhpcy5saW1pdHNTZXJ2aWNlLmV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgLy8gaWYgZXhjZWVkcyBsaW1pdHMsIHJlcG9zaXRpb25cclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgICB0aGlzLl9jdXJyZW50UG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFkanVzdHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBhZnRlciBhIGxpbWl0IGV4Y2VwdGlvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgYWRqdXN0UG9zaXRpb24obGltaXRFeGNlcHRpb246IExpbWl0RXhjZXB0aW9uKSB7XHJcbiAgICBjb25zdCBuZXdQb3NpdGlvbiA9IHtcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMFxyXG4gICAgfTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuc3RhcnRQb3NpdGlvbikuZm9yRWFjaChheGlzID0+IHtcclxuICAgICAgbmV3UG9zaXRpb25bYXhpc10gPSBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzW2F4aXNdICsgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbYXhpc107XHJcbiAgICB9KTtcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsbGVkIG9uIG1vdmVtZW50IGVuZCwgY2hlY2tzIGlmIGxhc3QgcG9zaXRpb24gZXhjZWVkZWQgdGhlIGxpbWl0cyBhZCBhZGp1c3RzXHJcbiAgICovXHJcbiAgbW92ZW1lbnRFbmQocG9zaXRpb246IFhZUG9zaXRpb24pIHtcclxuICAgIGxldCBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpO1xyXG4gICAgY29uc3QgbGltaXRFeGNlcHRpb24gPSB0aGlzLmxpbWl0c1NlcnZpY2UuZXhjZWVkc0xpbWl0KHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICBpZiAobGltaXRFeGNlcHRpb24uZXhjZWVkcykge1xyXG4gICAgICB0aGlzLnJlc2V0UG9zaXRpb24gPSBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzO1xyXG4gICAgICBpZiAobGltaXRFeGNlcHRpb24uZXhjZWVkcykge1xyXG4gICAgICAgIHRoaXMuYWRqdXN0UG9zaXRpb24obGltaXRFeGNlcHRpb24pO1xyXG4gICAgICAgIHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEodGhpcy5wb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UudXBkYXRlUG9zaXRpb24ocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlcyB0aGUgaW5pdGlhbCBwb3NpdGlvbnMgb2YgdGhlIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgKiBAcGFyYW0gZGltZW5zaW9ucyAtIGRpbWVuc2lvbnMgb2YgdGhlIHBhbmUgaW4gd2hpY2ggdGhlIHBvaW50IGlzIGxvY2F0ZWRcclxuICAgKi9cclxuICBwcml2YXRlIGdldEluaXRpYWxQb3NpdGlvbihkaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IHRoaXMubGltaXRSb2xlcy5pbmNsdWRlcygnbGVmdCcpID8gMCA6IGRpbWVuc2lvbnMud2lkdGggLSB0aGlzLndpZHRoIC8gMixcclxuICAgICAgeTogdGhpcy5saW1pdFJvbGVzLmluY2x1ZGVzKCd0b3AnKSA/IDAgOiBkaW1lbnNpb25zLmhlaWdodCAtIHRoaXMuaGVpZ2h0IC8gMlxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlcG9zaXRpb25zIHRoZSBwb2ludCBhZnRlciBhbiBleHRlcm5hbCByZXBvc2l0aW9uIGV2ZW50XHJcbiAgICogQHBhcmFtIHBvc2l0aW9ucyAtIGFuIGFycmF5IG9mIGFsbCBwb2ludHMgb24gdGhlIHBhbmVcclxuICAgKi9cclxuICBwcml2YXRlIGV4dGVybmFsUmVwb3NpdGlvbihwb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3NpdGlvbiA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmxpbWl0c1NlcnZpY2UuY29tcGFyZUFycmF5KHRoaXMubGltaXRSb2xlcywgcG9zaXRpb24ucm9sZXMpKSB7XHJcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLmVuZm9yY2VQYW5lTGltaXRzKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgeDogcG9zaXRpb24ueCxcclxuICAgICAgICAgIHk6IHBvc2l0aW9uLnlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBuZXcgcG9pbnQgcG9zaXRpb24gaWYgdGhlIG1vdmVtZW50IGV4Y2VlZGVkIHRoZSBwYW5lIGxpbWl0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmZvcmNlUGFuZUxpbWl0cyhwb3NpdGlvbjogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgaWYgKHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoID09PSAwIHx8IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocG9zaXRpb24ueCA+IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgcG9zaXRpb24ueCA9IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnggPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi55ID4gdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgcG9zaXRpb24ueSA9IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgICBwb3NpdGlvbi55ID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuIl19