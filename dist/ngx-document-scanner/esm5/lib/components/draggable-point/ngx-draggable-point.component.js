/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/draggable-point/ngx-draggable-point.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __assign } from "tslib";
import { Component, Input } from '@angular/core';
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
        _currentPosition: [{ type: Input }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUlyRztJQXdCRSxvQ0FBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFsQnZDLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUNsQixVQUFLLEdBQXNCLE1BQU0sQ0FBQztRQUNsQyxpQkFBWSxHQUFzQixNQUFNLENBQUM7UUFLbEQsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUNkLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsYUFBUSxHQUFlO1lBQ3JCLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDO0lBS0YsQ0FBQzs7OztJQUVELG9EQUFlOzs7SUFBZjtRQUFBLGlCQXFCQztRQXBCQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxHQUFHO1lBQ3hDLEtBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBQyxDQUFDO1FBQ0gsdUNBQXVDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFBLFVBQVU7WUFDcEQsSUFBSSxV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QUNELElBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO2dCQUM1QyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEIsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEI7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7O2dCQXZMRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsNmNBQW1EOztpQkFFcEQ7Ozs7Z0JBUk8sYUFBYTs7O3dCQVVsQixLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLOytCQUNMLEtBQUs7NkJBQ0wsS0FBSztnQ0FDTCxLQUFLOzRCQUNMLEtBQUs7bUNBQ0wsS0FBSzs7SUEwS1IsaUNBQUM7Q0FBQSxBQXhMRCxJQXdMQztTQW5MWSwwQkFBMEI7OztJQUNyQywyQ0FBb0I7O0lBQ3BCLDRDQUFxQjs7SUFDckIsMkNBQTJCOztJQUMzQiwyQ0FBMkM7O0lBQzNDLGtEQUFrRDs7SUFDbEQsZ0RBQWdFOztJQUNoRSxtREFBbUM7O0lBQ25DLCtDQUFnQzs7Ozs7SUFDaEMsc0RBQThDOztJQUM5QywyQ0FBYzs7SUFDZCw4Q0FBaUI7O0lBQ2pCLDhDQUdFOzs7OztJQUNGLHFEQUF5Qzs7SUFDekMsbURBQTBCOzs7OztJQUVkLG1EQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7SW1hZ2VEaW1lbnNpb25zfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQge0xpbWl0RXhjZXB0aW9uLCBYWVBvc2l0aW9ufSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRyYWdnYWJsZS1wb2ludCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1kcmFnZ2FibGUtcG9pbnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1kcmFnZ2FibGUtcG9pbnQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSB3aWR0aCA9IDEwO1xyXG4gIEBJbnB1dCgpIGhlaWdodCA9IDEwO1xyXG4gIEBJbnB1dCgpIGNvbG9yID0gJyMzY2FiZTInO1xyXG4gIEBJbnB1dCgpIHNoYXBlOiAncmVjdCcgfCAnY2lyY2xlJyA9ICdyZWN0JztcclxuICBASW5wdXQoKSBwb2ludE9wdGlvbnM6ICdyZWN0JyB8ICdjaXJjbGUnID0gJ3JlY3QnO1xyXG4gIEBJbnB1dCgpIGxpbWl0Um9sZXM6IEFycmF5PCdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nPjtcclxuICBASW5wdXQoKSBzdGFydFBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgQElucHV0KCkgcHJpdmF0ZSBfY3VycmVudFBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG4gIGhvdmVyID0gZmFsc2U7XHJcbiAgY2xpY2tpbmcgPSBmYWxzZTtcclxuICBwb3NpdGlvbjogWFlQb3NpdGlvbiA9IHtcclxuICAgIHg6IDAsXHJcbiAgICB5OiAwXHJcbiAgfTtcclxuICBwcml2YXRlIF9wYW5lRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIHJlc2V0UG9zaXRpb246IFhZUG9zaXRpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5wb2ludE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgdGhpc1trZXldID0gdGhpcy5wb2ludE9wdGlvbnNba2V5XTtcclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBhbmUgZGltZW5zaW9ucyBjaGFuZ2VzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucGFuZURpbWVuc2lvbnMuc3Vic2NyaWJlKGRpbWVuc2lvbnMgPT4ge1xyXG4gICAgICBpZiAoZGltZW5zaW9ucy53aWR0aCA+IDAgJiYgZGltZW5zaW9ucy53aWR0aCA+IDApIHtcclxuICAgICAgICB0aGlzLl9wYW5lRGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuZ2V0SW5pdGlhbFBvc2l0aW9uKGRpbWVuc2lvbnMpO1xyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBleHRlcm5hbCByZXBvc2l0aW9uIGV2ZW50c1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25FdmVudC5zdWJzY3JpYmUocG9zaXRpb25zID0+IHtcclxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5leHRlcm5hbFJlcG9zaXRpb24ocG9zaXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgY3NzIHN0eWxlIG9iamVjdCBmb3IgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9pbnRTdHlsZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArICdweCcsXHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5jb2xvcixcclxuICAgICAgJ2JvcmRlci1yYWRpdXMnOiB0aGlzLnNoYXBlID09PSAnY2lyY2xlJyA/ICcxMDAlJyA6IDAsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaG92ZXJQb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4udGhpcy5wb2ludFN0eWxlKCksXHJcbiAgICAgIGN1cnNvcjogJ2dyYWInLFxyXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjQ0NGRjMzJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNsaWNraW5nUG9pbnRTdHlsZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLnRoaXMuaG92ZXJQb2ludFN0eWxlKCksXHJcbiAgICAgIGN1cnNvcjogJ2dyYWJiaW5nJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldFN0eWxlKCkge1xyXG4gICAgaWYgKHRoaXMuY2xpY2tpbmcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xpY2tpbmdQb2ludFN0eWxlKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaG92ZXIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaG92ZXJQb2ludFN0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVnaXN0ZXJzIGEgcG9zaXRpb24gY2hhbmdlIG9uIHRoZSBsaW1pdHMgc2VydmljZSwgYW5kIGFkanVzdHMgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XHJcbiAgICogQHBhcmFtIHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9zaXRpb25DaGFuZ2UocG9zaXRpb246IFhZUG9zaXRpb24pIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEocG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbiA9IHRoaXMubGltaXRzU2VydmljZS5leGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5leGNlZWRzKSB7XHJcbiAgICAgIC8vIGlmIGV4Y2VlZHMgbGltaXRzLCByZXBvc2l0aW9uXHJcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbiA9IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgICAgdGhpcy5fY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhZGp1c3RzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYWZ0ZXIgYSBsaW1pdCBleGNlcHRpb25cclxuICAgKi9cclxuICBwcml2YXRlIGFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uOiBMaW1pdEV4Y2VwdGlvbikge1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb24gPSB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnN0YXJ0UG9zaXRpb24pLmZvckVhY2goYXhpcyA9PiB7XHJcbiAgICAgIG5ld1Bvc2l0aW9uW2F4aXNdID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1theGlzXSArIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2F4aXNdO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UobmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGxlZCBvbiBtb3ZlbWVudCBlbmQsIGNoZWNrcyBpZiBsYXN0IHBvc2l0aW9uIGV4Y2VlZGVkIHRoZSBsaW1pdHMgYWQgYWRqdXN0c1xyXG4gICAqL1xyXG4gIG1vdmVtZW50RW5kKHBvc2l0aW9uOiBYWVBvc2l0aW9uKSB7XHJcbiAgICBsZXQgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YShwb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uID0gdGhpcy5saW1pdHNTZXJ2aWNlLmV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlcztcclxuICAgICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgICB0aGlzLmFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uKTtcclxuICAgICAgICBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZXMgdGhlIGluaXRpYWwgcG9zaXRpb25zIG9mIHRoZSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgLSBkaW1lbnNpb25zIG9mIHRoZSBwYW5lIGluIHdoaWNoIHRoZSBwb2ludCBpcyBsb2NhdGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRJbml0aWFsUG9zaXRpb24oZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiB0aGlzLmxpbWl0Um9sZXMuaW5jbHVkZXMoJ2xlZnQnKSA/IDAgOiBkaW1lbnNpb25zLndpZHRoIC0gdGhpcy53aWR0aCAvIDIsXHJcbiAgICAgIHk6IHRoaXMubGltaXRSb2xlcy5pbmNsdWRlcygndG9wJykgPyAwIDogZGltZW5zaW9ucy5oZWlnaHQgLSB0aGlzLmhlaWdodCAvIDJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXBvc2l0aW9ucyB0aGUgcG9pbnQgYWZ0ZXIgYW4gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudFxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcG9pbnRzIG9uIHRoZSBwYW5lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBleHRlcm5hbFJlcG9zaXRpb24ocG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xyXG4gICAgICBpZiAodGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheSh0aGlzLmxpbWl0Um9sZXMsIHBvc2l0aW9uLnJvbGVzKSkge1xyXG4gICAgICAgIHBvc2l0aW9uID0gdGhpcy5lbmZvcmNlUGFuZUxpbWl0cyhwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgIHg6IHBvc2l0aW9uLngsXHJcbiAgICAgICAgICB5OiBwb3NpdGlvbi55XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgbmV3IHBvaW50IHBvc2l0aW9uIGlmIHRoZSBtb3ZlbWVudCBleGNlZWRlZCB0aGUgcGFuZSBsaW1pdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5mb3JjZVBhbmVMaW1pdHMocG9zaXRpb246IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIGlmICh0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCA9PT0gMCB8fCB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHBvc2l0aW9uLnggPiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnggPSB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueCA8IDApIHtcclxuICAgICAgICBwb3NpdGlvbi54ID0gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueSA+IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnkgPSB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgICAgcG9zaXRpb24ueSA9IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==