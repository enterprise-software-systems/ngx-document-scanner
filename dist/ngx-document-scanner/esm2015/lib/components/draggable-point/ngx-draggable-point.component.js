/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/draggable-point/ngx-draggable-point.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
export class NgxDraggablePointComponent {
    /**
     * @param {?} limitsService
     */
    constructor(limitsService) {
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
    ngAfterViewInit() {
        Object.keys(this.pointOptions).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            this[key] = this.pointOptions[key];
        }));
        // subscribe to pane dimensions changes
        this.limitsService.paneDimensions.subscribe((/**
         * @param {?} dimensions
         * @return {?}
         */
        dimensions => {
            if (dimensions.width > 0 && dimensions.width > 0) {
                this._paneDimensions = {
                    width: dimensions.width,
                    height: dimensions.height
                };
                this.position = this.getInitialPosition(dimensions);
                this.limitsService.positionChange(new PositionChangeData(this.position, this.limitRoles));
            }
        }));
        // subscribe to external reposition events
        this.limitsService.repositionEvent.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        positions => {
            if (positions.length > 0) {
                this.externalReposition(positions);
            }
        }));
    }
    /**
     * returns a css style object for the point
     * @return {?}
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
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param {?} position - the current position of the point
     * @return {?}
     */
    positionChange(position) {
        /** @type {?} */
        const positionChangeData = new PositionChangeData(position, this.limitRoles);
        /** @type {?} */
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
     * @private
     * @param {?} limitException
     * @return {?}
     */
    adjustPosition(limitException) {
        /** @type {?} */
        const newPosition = {
            x: 0,
            y: 0
        };
        Object.keys(this.startPosition).forEach((/**
         * @param {?} axis
         * @return {?}
         */
        axis => {
            newPosition[axis] = limitException.resetCoordinates[axis] + limitException.resetCoefficients[axis];
        }));
        this.position = newPosition;
        this.limitsService.positionChange(new PositionChangeData(this.position, this.limitRoles));
    }
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     * @param {?} position
     * @return {?}
     */
    movementEnd(position) {
        /** @type {?} */
        let positionChangeData = new PositionChangeData(position, this.limitRoles);
        /** @type {?} */
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
     * @private
     * @param {?} dimensions - dimensions of the pane in which the point is located
     * @return {?}
     */
    getInitialPosition(dimensions) {
        return {
            x: this.limitRoles.includes('left') ? 0 : dimensions.width - this.width / 2,
            y: this.limitRoles.includes('top') ? 0 : dimensions.height - this.height / 2
        };
    }
    /**
     * repositions the point after an external reposition event
     * @private
     * @param {?} positions - an array of all points on the pane
     * @return {?}
     */
    externalReposition(positions) {
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        position => {
            if (this.limitsService.compareArray(this.limitRoles, position.roles)) {
                position = this.enforcePaneLimits(position);
                this.position = {
                    x: position.x,
                    y: position.y
                };
            }
        }));
    }
    /**
     * returns a new point position if the movement exceeded the pane limit
     * @private
     * @param {?} position
     * @return {?}
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
NgxDraggablePointComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-draggable-point',
                template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"pointStyle()\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n      style=\"z-index: 1000\">\r\n</div>\r\n"
            }] }
];
/** @nocollapse */
NgxDraggablePointComponent.ctorParameters = () => [
    { type: LimitsService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMsYUFBYSxFQUF1QixrQkFBa0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBUXJHLE1BQU0sT0FBTywwQkFBMEI7Ozs7SUFpQnJDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBaEJ2QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFVBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsVUFBSyxHQUFzQixNQUFNLENBQUM7UUFDbEMsaUJBQVksR0FBc0IsTUFBTSxDQUFDO1FBS2xELGFBQVEsR0FBZTtZQUNyQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztJQUlpRCxDQUFDOzs7O0lBRXBELGVBQWU7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFDLENBQUM7UUFDSCx1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsU0FBUzs7OztRQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3ZELElBQUksVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLEtB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Ozs7SUFDaEMsc0RBQThDOztJQUM5Qyw4Q0FHRTs7Ozs7SUFDRixxREFBeUM7O0lBQ3pDLG1EQUEwQjs7Ozs7SUFFZCxtREFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0xpbWl0c1NlcnZpY2UsIFBvaW50UG9zaXRpb25DaGFuZ2UsIFBvc2l0aW9uQ2hhbmdlRGF0YX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbn0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1kcmFnZ2FibGUtcG9pbnQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERyYWdnYWJsZVBvaW50Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgd2lkdGggPSAxMDtcclxuICBASW5wdXQoKSBoZWlnaHQgPSAxMDtcclxuICBASW5wdXQoKSBjb2xvciA9ICcjM2NhYmUyJztcclxuICBASW5wdXQoKSBzaGFwZTogJ3JlY3QnIHwgJ2NpcmNsZScgPSAncmVjdCc7XHJcbiAgQElucHV0KCkgcG9pbnRPcHRpb25zOiAncmVjdCcgfCAnY2lyY2xlJyA9ICdyZWN0JztcclxuICBASW5wdXQoKSBsaW1pdFJvbGVzOiBBcnJheTwnbGVmdCd8J3JpZ2h0J3wndG9wJ3wnYm90dG9tJz47XHJcbiAgQElucHV0KCkgc3RhcnRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICBASW5wdXQoKSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG4gIEBJbnB1dCgpIHByaXZhdGUgX2N1cnJlbnRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICBwb3NpdGlvbjogWFlQb3NpdGlvbiA9IHtcclxuICAgIHg6IDAsXHJcbiAgICB5OiAwXHJcbiAgfTtcclxuICBwcml2YXRlIF9wYW5lRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIHJlc2V0UG9zaXRpb246IFhZUG9zaXRpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSkge31cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5wb2ludE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgdGhpc1trZXldID0gdGhpcy5wb2ludE9wdGlvbnNba2V5XTtcclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBhbmUgZGltZW5zaW9ucyBjaGFuZ2VzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucGFuZURpbWVuc2lvbnMuc3Vic2NyaWJlKGRpbWVuc2lvbnMgPT4ge1xyXG4gICAgICBpZiAoZGltZW5zaW9ucy53aWR0aCA+IDAgJiYgZGltZW5zaW9ucy53aWR0aCA+IDApIHtcclxuICAgICAgICB0aGlzLl9wYW5lRGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuZ2V0SW5pdGlhbFBvc2l0aW9uKGRpbWVuc2lvbnMpO1xyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBleHRlcm5hbCByZXBvc2l0aW9uIGV2ZW50c1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25FdmVudC5zdWJzY3JpYmUocG9zaXRpb25zID0+IHtcclxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5leHRlcm5hbFJlcG9zaXRpb24ocG9zaXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgY3NzIHN0eWxlIG9iamVjdCBmb3IgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9pbnRTdHlsZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArICdweCcsXHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5jb2xvcixcclxuICAgICAgJ2JvcmRlci1yYWRpdXMnOiB0aGlzLnNoYXBlID09PSAnY2lyY2xlJyA/ICcxMDAlJyA6IDAsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVnaXN0ZXJzIGEgcG9zaXRpb24gY2hhbmdlIG9uIHRoZSBsaW1pdHMgc2VydmljZSwgYW5kIGFkanVzdHMgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XHJcbiAgICogQHBhcmFtIHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50XHJcbiAgICovXHJcbiAgcG9zaXRpb25DaGFuZ2UocG9zaXRpb246IFhZUG9zaXRpb24pIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEocG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbiA9IHRoaXMubGltaXRzU2VydmljZS5leGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5leGNlZWRzKSB7XHJcbiAgICAgIC8vIGlmIGV4Y2VlZHMgbGltaXRzLCByZXBvc2l0aW9uXHJcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbiA9IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgICAgdGhpcy5fY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhZGp1c3RzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYWZ0ZXIgYSBsaW1pdCBleGNlcHRpb25cclxuICAgKi9cclxuICBwcml2YXRlIGFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uOiBMaW1pdEV4Y2VwdGlvbikge1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb24gPSB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnN0YXJ0UG9zaXRpb24pLmZvckVhY2goYXhpcyA9PiB7XHJcbiAgICAgIG5ld1Bvc2l0aW9uW2F4aXNdID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1theGlzXSArIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2F4aXNdO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25DaGFuZ2UobmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh0aGlzLnBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGxlZCBvbiBtb3ZlbWVudCBlbmQsIGNoZWNrcyBpZiBsYXN0IHBvc2l0aW9uIGV4Y2VlZGVkIHRoZSBsaW1pdHMgYWQgYWRqdXN0c1xyXG4gICAqL1xyXG4gIG1vdmVtZW50RW5kKHBvc2l0aW9uOiBYWVBvc2l0aW9uKSB7XHJcbiAgICBsZXQgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YShwb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uID0gdGhpcy5saW1pdHNTZXJ2aWNlLmV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlcztcclxuICAgICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgICB0aGlzLmFkanVzdFBvc2l0aW9uKGxpbWl0RXhjZXB0aW9uKTtcclxuICAgICAgICBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcyk7XHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZXMgdGhlIGluaXRpYWwgcG9zaXRpb25zIG9mIHRoZSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgLSBkaW1lbnNpb25zIG9mIHRoZSBwYW5lIGluIHdoaWNoIHRoZSBwb2ludCBpcyBsb2NhdGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRJbml0aWFsUG9zaXRpb24oZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiB0aGlzLmxpbWl0Um9sZXMuaW5jbHVkZXMoJ2xlZnQnKSA/IDAgOiBkaW1lbnNpb25zLndpZHRoIC0gdGhpcy53aWR0aCAvIDIsXHJcbiAgICAgIHk6IHRoaXMubGltaXRSb2xlcy5pbmNsdWRlcygndG9wJykgPyAwIDogZGltZW5zaW9ucy5oZWlnaHQgLSB0aGlzLmhlaWdodCAvIDJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXBvc2l0aW9ucyB0aGUgcG9pbnQgYWZ0ZXIgYW4gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudFxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcG9pbnRzIG9uIHRoZSBwYW5lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBleHRlcm5hbFJlcG9zaXRpb24ocG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xyXG4gICAgICBpZiAodGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheSh0aGlzLmxpbWl0Um9sZXMsIHBvc2l0aW9uLnJvbGVzKSkge1xyXG4gICAgICAgIHBvc2l0aW9uID0gdGhpcy5lbmZvcmNlUGFuZUxpbWl0cyhwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgIHg6IHBvc2l0aW9uLngsXHJcbiAgICAgICAgICB5OiBwb3NpdGlvbi55XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgbmV3IHBvaW50IHBvc2l0aW9uIGlmIHRoZSBtb3ZlbWVudCBleGNlZWRlZCB0aGUgcGFuZSBsaW1pdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5mb3JjZVBhbmVMaW1pdHMocG9zaXRpb246IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIGlmICh0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCA9PT0gMCB8fCB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHBvc2l0aW9uLnggPiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCkgeyBwb3NpdGlvbi54ID0gdGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGg7IH1cclxuICAgICAgaWYgKHBvc2l0aW9uLnggPCAwKSB7IHBvc2l0aW9uLnggPSAxOyB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi55ID4gdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0KSB7IHBvc2l0aW9uLnkgPSB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQ7IH1cclxuICAgICAgaWYgKHBvc2l0aW9uLnkgPCAwKSB7IHBvc2l0aW9uLnkgPSAxOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=