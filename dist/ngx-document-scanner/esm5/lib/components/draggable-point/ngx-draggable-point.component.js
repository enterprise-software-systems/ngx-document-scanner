/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/draggable-point/ngx-draggable-point.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
                    template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"pointStyle()\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n      style=\"z-index: 1000\">\r\n</div>\r\n"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMsYUFBYSxFQUF1QixrQkFBa0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBSXJHO0lBcUJFLG9DQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWhCdkMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFDWixVQUFLLEdBQUcsU0FBUyxDQUFDO1FBQ2xCLFVBQUssR0FBc0IsTUFBTSxDQUFDO1FBQ2xDLGlCQUFZLEdBQXNCLE1BQU0sQ0FBQztRQUtsRCxhQUFRLEdBQWU7WUFDckIsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztTQUNMLENBQUM7SUFJaUQsQ0FBQzs7OztJQUVwRCxvREFBZTs7O0lBQWY7UUFBQSxpQkFxQkM7UUFwQkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsR0FBRztZQUN4QyxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQUMsQ0FBQztRQUNILHVDQUF1QztRQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQSxVQUFVO1lBQ3BELElBQUksVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssR0FBRyxD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Z0NBQ0wsS0FBSzs0QkFDTCxLQUFLO21DQUNMLEtBQUs7O0lBc0lSLGlDQUFDO0NBQUEsQUFuSkQsSUFtSkM7U0EvSVksMEJBQTBCOzs7SUFDckMsMkNBQW9COztJQUNwQiw0Q0FBcUI7O0lBQ3JCLDJDQUEyQjs7SUFDM0IsMkNBQTJDOztJQUMzQyxrREFBa0Q7O0lBQ2xELGdEQUEwRDs7SUFDMUQsbURBQW1DOztJQUNuQywrQ0FBZ0M7Ozs7O0lBQ2hDLHNEQUE4Qzs7SUFDOUMsOENBR0U7Ozs7O0lBQ0YscURBQXlDOztJQUN6QyxtREFBMEI7Ozs7O0lBRWQsbURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGF9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7TGltaXRFeGNlcHRpb24sIFhZUG9zaXRpb259IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZHJhZ2dhYmxlLXBvaW50JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEcmFnZ2FibGVQb2ludENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIHdpZHRoID0gMTA7XHJcbiAgQElucHV0KCkgaGVpZ2h0ID0gMTA7XHJcbiAgQElucHV0KCkgY29sb3IgPSAnIzNjYWJlMic7XHJcbiAgQElucHV0KCkgc2hhcGU6ICdyZWN0JyB8ICdjaXJjbGUnID0gJ3JlY3QnO1xyXG4gIEBJbnB1dCgpIHBvaW50T3B0aW9uczogJ3JlY3QnIHwgJ2NpcmNsZScgPSAncmVjdCc7XHJcbiAgQElucHV0KCkgbGltaXRSb2xlczogQXJyYXk8J2xlZnQnfCdyaWdodCd8J3RvcCd8J2JvdHRvbSc+O1xyXG4gIEBJbnB1dCgpIHN0YXJ0UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgQElucHV0KCkgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuICBASW5wdXQoKSBwcml2YXRlIF9jdXJyZW50UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgcG9zaXRpb246IFhZUG9zaXRpb24gPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMFxyXG4gIH07XHJcbiAgcHJpdmF0ZSBfcGFuZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICByZXNldFBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMucG9pbnRPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMucG9pbnRPcHRpb25zW2tleV07XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBwYW5lIGRpbWVuc2lvbnMgY2hhbmdlc1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBhbmVEaW1lbnNpb25zLnN1YnNjcmliZShkaW1lbnNpb25zID0+IHtcclxuICAgICAgaWYgKGRpbWVuc2lvbnMud2lkdGggPiAwICYmIGRpbWVuc2lvbnMud2lkdGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5fcGFuZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogZGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLmdldEluaXRpYWxQb3NpdGlvbihkaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UobmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudHNcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uRXZlbnQuc3Vic2NyaWJlKHBvc2l0aW9ucyA9PiB7XHJcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuZXh0ZXJuYWxSZXBvc2l0aW9uKHBvc2l0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhIGNzcyBzdHlsZSBvYmplY3QgZm9yIHRoZSBwb2ludFxyXG4gICAqL1xyXG4gIHBvaW50U3R5bGUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCArICdweCcsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQgKyAncHgnLFxyXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuY29sb3IsXHJcbiAgICAgICdib3JkZXItcmFkaXVzJzogdGhpcy5zaGFwZSA9PT0gJ2NpcmNsZScgPyAnMTAwJScgOiAwLFxyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlZ2lzdGVycyBhIHBvc2l0aW9uIGNoYW5nZSBvbiB0aGUgbGltaXRzIHNlcnZpY2UsIGFuZCBhZGp1c3RzIHBvc2l0aW9uIGlmIG5lY2Vzc2FyeVxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbiAtIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludFxyXG4gICAqL1xyXG4gIHBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uOiBYWVBvc2l0aW9uKSB7XHJcbiAgICBjb25zdCBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpO1xyXG4gICAgY29uc3QgbGltaXRFeGNlcHRpb24gPSB0aGlzLmxpbWl0c1NlcnZpY2UuZXhjZWVkc0xpbWl0KHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICBpZiAobGltaXRFeGNlcHRpb24uZXhjZWVkcykge1xyXG4gICAgICAvLyBpZiBleGNlZWRzIGxpbWl0cywgcmVwb3NpdGlvblxyXG4gICAgICB0aGlzLnJlc2V0UG9zaXRpb24gPSBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYWRqdXN0cyB0aGUgcG9zaXRpb24gb2YgdGhlIHBvaW50IGFmdGVyIGEgbGltaXQgZXhjZXB0aW9uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhZGp1c3RQb3NpdGlvbihsaW1pdEV4Y2VwdGlvbjogTGltaXRFeGNlcHRpb24pIHtcclxuICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0ge1xyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiAwXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5zdGFydFBvc2l0aW9uKS5mb3JFYWNoKGF4aXMgPT4ge1xyXG4gICAgICBuZXdQb3NpdGlvbltheGlzXSA9IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXNbYXhpc10gKyBsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50c1theGlzXTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ld1Bvc2l0aW9uO1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9uQ2hhbmdlKG5ldyBQb3NpdGlvbkNoYW5nZURhdGEodGhpcy5wb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxsZWQgb24gbW92ZW1lbnQgZW5kLCBjaGVja3MgaWYgbGFzdCBwb3NpdGlvbiBleGNlZWRlZCB0aGUgbGltaXRzIGFkIGFkanVzdHNcclxuICAgKi9cclxuICBtb3ZlbWVudEVuZChwb3NpdGlvbjogWFlQb3NpdGlvbikge1xyXG4gICAgbGV0IHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEocG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbiA9IHRoaXMubGltaXRzU2VydmljZS5leGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5leGNlZWRzKSB7XHJcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbiA9IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXM7XHJcbiAgICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5leGNlZWRzKSB7XHJcbiAgICAgICAgdGhpcy5hZGp1c3RQb3NpdGlvbihsaW1pdEV4Y2VwdGlvbik7XHJcbiAgICAgICAgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpO1xyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS51cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGVzIHRoZSBpbml0aWFsIHBvc2l0aW9ucyBvZiB0aGUgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAqIEBwYXJhbSBkaW1lbnNpb25zIC0gZGltZW5zaW9ucyBvZiB0aGUgcGFuZSBpbiB3aGljaCB0aGUgcG9pbnQgaXMgbG9jYXRlZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0SW5pdGlhbFBvc2l0aW9uKGRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogdGhpcy5saW1pdFJvbGVzLmluY2x1ZGVzKCdsZWZ0JykgPyAwIDogZGltZW5zaW9ucy53aWR0aCAtIHRoaXMud2lkdGggLyAyLFxyXG4gICAgICB5OiB0aGlzLmxpbWl0Um9sZXMuaW5jbHVkZXMoJ3RvcCcpID8gMCA6IGRpbWVuc2lvbnMuaGVpZ2h0IC0gdGhpcy5oZWlnaHQgLyAyXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVwb3NpdGlvbnMgdGhlIHBvaW50IGFmdGVyIGFuIGV4dGVybmFsIHJlcG9zaXRpb24gZXZlbnRcclxuICAgKiBAcGFyYW0gcG9zaXRpb25zIC0gYW4gYXJyYXkgb2YgYWxsIHBvaW50cyBvbiB0aGUgcGFuZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXh0ZXJuYWxSZXBvc2l0aW9uKHBvc2l0aW9uczogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4pIHtcclxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcclxuICAgICAgaWYgKHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkodGhpcy5saW1pdFJvbGVzLCBwb3NpdGlvbi5yb2xlcykpIHtcclxuICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZW5mb3JjZVBhbmVMaW1pdHMocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgICB4OiBwb3NpdGlvbi54LFxyXG4gICAgICAgICAgeTogcG9zaXRpb24ueVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhIG5ldyBwb2ludCBwb3NpdGlvbiBpZiB0aGUgbW92ZW1lbnQgZXhjZWVkZWQgdGhlIHBhbmUgbGltaXRcclxuICAgKi9cclxuICBwcml2YXRlIGVuZm9yY2VQYW5lTGltaXRzKHBvc2l0aW9uOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBpZiAodGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGggPT09IDAgfHwgdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChwb3NpdGlvbi54ID4gdGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGgpIHsgcG9zaXRpb24ueCA9IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoOyB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi54IDwgMCkgeyBwb3NpdGlvbi54ID0gMTsgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueSA+IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCkgeyBwb3NpdGlvbi55ID0gdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0OyB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi55IDwgMCkgeyBwb3NpdGlvbi55ID0gMTsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuIl19