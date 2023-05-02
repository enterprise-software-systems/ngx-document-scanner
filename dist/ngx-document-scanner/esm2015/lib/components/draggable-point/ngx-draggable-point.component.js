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
     * @return {?}
     */
    hoverPointStyle() {
        return Object.assign(Object.assign({}, this.pointStyle()), { cursor: 'grab', 'background-color': '#CCFF33' });
    }
    /**
     * @return {?}
     */
    clickingPointStyle() {
        return Object.assign(Object.assign({}, this.hoverPointStyle()), { cursor: 'grabbing' });
    }
    /**
     * @return {?}
     */
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
                template: "<div #point ngDraggable=\"draggable\"\r\n     (movingOffset)=\"positionChange($event)\"\r\n     [ngStyle]=\"getStyle()\"\r\n     (mousedown)=\"clicking=true\"\r\n     (mouseup)=\"clicking=false\"\r\n     (mouseover)=\"hover=true\"\r\n     (mouseleave)=\"hover=false\"\r\n     [position]=\"position\"\r\n     [bounds]=\"container\"\r\n     [inBounds]=\"true\"\r\n     (endOffset)=\"movementEnd($event)\"\r\n     style=\"z-index: 1000\">\r\n</div>\r\n",
                styles: [""]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMsYUFBYSxFQUF1QixrQkFBa0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBU3JHLE1BQU0sT0FBTywwQkFBMEI7Ozs7SUFtQnJDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBbEJ2QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFVBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsVUFBSyxHQUFzQixNQUFNLENBQUM7UUFDbEMsaUJBQVksR0FBc0IsTUFBTSxDQUFDO1FBS2xELFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBZTtZQUNyQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztJQUtGLENBQUM7Ozs7SUFFRCxlQUFlO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBQyxDQUFDO1FBQ0gsdUNBQXVDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFVLENBQUMsRUFBRTtZQUN2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SUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7YUFDMUM7WUFDRCxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQixRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQjtTQUNGO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7O1lBdkxGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQiw2Y0FBbUQ7O2FBRXBEOzs7O1lBUk8sYUFBYTs7O29CQVVsQixLQUFLO3FCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLO3dCQUNMLEtBQUs7K0JBQ0wsS0FBSzs7OztJQVJOLDJDQUFvQjs7SUFDcEIsNENBQXFCOztJQUNyQiwyQ0FBMkI7O0lBQzNCLDJDQUEyQzs7SUFDM0Msa0RBQWtEOztJQUNsRCxnREFBZ0U7O0lBQ2hFLG1EQUFtQzs7SUFDbkMsK0NBQWdDOzs7OztJQUNoQyxzREFBOEM7O0lBQzlDLDJDQUFjOztJQUNkLDhDQUFpQjs7SUFDakIsOENBR0U7Ozs7O0lBQ0YscURBQXlDOztJQUN6QyxtREFBMEI7Ozs7O0lBRWQsbURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGF9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7TGltaXRFeGNlcHRpb24sIFhZUG9zaXRpb259IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZHJhZ2dhYmxlLXBvaW50JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEcmFnZ2FibGVQb2ludENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIHdpZHRoID0gMTA7XHJcbiAgQElucHV0KCkgaGVpZ2h0ID0gMTA7XHJcbiAgQElucHV0KCkgY29sb3IgPSAnIzNjYWJlMic7XHJcbiAgQElucHV0KCkgc2hhcGU6ICdyZWN0JyB8ICdjaXJjbGUnID0gJ3JlY3QnO1xyXG4gIEBJbnB1dCgpIHBvaW50T3B0aW9uczogJ3JlY3QnIHwgJ2NpcmNsZScgPSAncmVjdCc7XHJcbiAgQElucHV0KCkgbGltaXRSb2xlczogQXJyYXk8J2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc+O1xyXG4gIEBJbnB1dCgpIHN0YXJ0UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgQElucHV0KCkgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuICBASW5wdXQoKSBwcml2YXRlIF9jdXJyZW50UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgaG92ZXIgPSBmYWxzZTtcclxuICBjbGlja2luZyA9IGZhbHNlO1xyXG4gIHBvc2l0aW9uOiBYWVBvc2l0aW9uID0ge1xyXG4gICAgeDogMCxcclxuICAgIHk6IDBcclxuICB9O1xyXG4gIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgcmVzZXRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnBvaW50T3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLnBvaW50T3B0aW9uc1trZXldO1xyXG4gICAgfSk7XHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gcGFuZSBkaW1lbnNpb25zIGNoYW5nZXNcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wYW5lRGltZW5zaW9ucy5zdWJzY3JpYmUoZGltZW5zaW9ucyA9PiB7XHJcbiAgICAgIGlmIChkaW1lbnNpb25zLndpZHRoID4gMCAmJiBkaW1lbnNpb25zLndpZHRoID4gMCkge1xyXG4gICAgICAgIHRoaXMuX3BhbmVEaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IGRpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5nZXRJbml0aWFsUG9zaXRpb24oZGltZW5zaW9ucyk7XHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9uQ2hhbmdlKG5ldyBQb3NpdGlvbkNoYW5nZURhdGEodGhpcy5wb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIGV4dGVybmFsIHJlcG9zaXRpb24gZXZlbnRzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvbkV2ZW50LnN1YnNjcmliZShwb3NpdGlvbnMgPT4ge1xyXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmV4dGVybmFsUmVwb3NpdGlvbihwb3NpdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBjc3Mgc3R5bGUgb2JqZWN0IGZvciB0aGUgcG9pbnRcclxuICAgKi9cclxuICBwb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyAncHgnLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiB0aGlzLmNvbG9yLFxyXG4gICAgICAnYm9yZGVyLXJhZGl1cyc6IHRoaXMuc2hhcGUgPT09ICdjaXJjbGUnID8gJzEwMCUnIDogMCxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBob3ZlclBvaW50U3R5bGUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi50aGlzLnBvaW50U3R5bGUoKSxcclxuICAgICAgY3Vyc29yOiAnZ3JhYicsXHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNDQ0ZGMzMnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY2xpY2tpbmdQb2ludFN0eWxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4udGhpcy5ob3ZlclBvaW50U3R5bGUoKSxcclxuICAgICAgY3Vyc29yOiAnZ3JhYmJpbmcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGUoKSB7XHJcbiAgICBpZiAodGhpcy5jbGlja2luZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGlja2luZ1BvaW50U3R5bGUoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5ob3Zlcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5ob3ZlclBvaW50U3R5bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wb2ludFN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWdpc3RlcnMgYSBwb3NpdGlvbiBjaGFuZ2Ugb24gdGhlIGxpbWl0cyBzZXJ2aWNlLCBhbmQgYWRqdXN0cyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcclxuICAgKiBAcGFyYW0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgKi9cclxuICBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogWFlQb3NpdGlvbikge1xyXG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2VEYXRhID0gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YShwb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uID0gdGhpcy5saW1pdHNTZXJ2aWNlLmV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMpIHtcclxuICAgICAgLy8gaWYgZXhjZWVkcyBsaW1pdHMsIHJlcG9zaXRpb25cclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uID0gbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG4gICAgICB0aGlzLl9jdXJyZW50UG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFkanVzdHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBhZnRlciBhIGxpbWl0IGV4Y2VwdGlvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgYWRqdXN0UG9zaXRpb24obGltaXRFeGNlcHRpb246IExpbWl0RXhjZXB0aW9uKSB7XHJcbiAgICBjb25zdCBuZXdQb3NpdGlvbiA9IHtcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMFxyXG4gICAgfTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuc3RhcnRQb3NpdGlvbikuZm9yRWFjaChheGlzID0+IHtcclxuICAgICAgbmV3UG9zaXRpb25bYXhpc10gPSBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzW2F4aXNdICsgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbYXhpc107XHJcbiAgICB9KTtcclxuICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbkNoYW5nZShuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHRoaXMucG9zaXRpb24sIHRoaXMubGltaXRSb2xlcykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsbGVkIG9uIG1vdmVtZW50IGVuZCwgY2hlY2tzIGlmIGxhc3QgcG9zaXRpb24gZXhjZWVkZWQgdGhlIGxpbWl0cyBhZCBhZGp1c3RzXHJcbiAgICovXHJcbiAgbW92ZW1lbnRFbmQocG9zaXRpb246IFhZUG9zaXRpb24pIHtcclxuICAgIGxldCBwb3NpdGlvbkNoYW5nZURhdGEgPSBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHBvc2l0aW9uLCB0aGlzLmxpbWl0Um9sZXMpO1xyXG4gICAgY29uc3QgbGltaXRFeGNlcHRpb24gPSB0aGlzLmxpbWl0c1NlcnZpY2UuZXhjZWVkc0xpbWl0KHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcbiAgICBpZiAobGltaXRFeGNlcHRpb24uZXhjZWVkcykge1xyXG4gICAgICB0aGlzLnJlc2V0UG9zaXRpb24gPSBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzO1xyXG4gICAgICBpZiAobGltaXRFeGNlcHRpb24uZXhjZWVkcykge1xyXG4gICAgICAgIHRoaXMuYWRqdXN0UG9zaXRpb24obGltaXRFeGNlcHRpb24pO1xyXG4gICAgICAgIHBvc2l0aW9uQ2hhbmdlRGF0YSA9IG5ldyBQb3NpdGlvbkNoYW5nZURhdGEodGhpcy5wb3NpdGlvbiwgdGhpcy5saW1pdFJvbGVzKTtcclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UudXBkYXRlUG9zaXRpb24ocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlcyB0aGUgaW5pdGlhbCBwb3NpdGlvbnMgb2YgdGhlIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgKiBAcGFyYW0gZGltZW5zaW9ucyAtIGRpbWVuc2lvbnMgb2YgdGhlIHBhbmUgaW4gd2hpY2ggdGhlIHBvaW50IGlzIGxvY2F0ZWRcclxuICAgKi9cclxuICBwcml2YXRlIGdldEluaXRpYWxQb3NpdGlvbihkaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IHRoaXMubGltaXRSb2xlcy5pbmNsdWRlcygnbGVmdCcpID8gMCA6IGRpbWVuc2lvbnMud2lkdGggLSB0aGlzLndpZHRoIC8gMixcclxuICAgICAgeTogdGhpcy5saW1pdFJvbGVzLmluY2x1ZGVzKCd0b3AnKSA/IDAgOiBkaW1lbnNpb25zLmhlaWdodCAtIHRoaXMuaGVpZ2h0IC8gMlxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlcG9zaXRpb25zIHRoZSBwb2ludCBhZnRlciBhbiBleHRlcm5hbCByZXBvc2l0aW9uIGV2ZW50XHJcbiAgICogQHBhcmFtIHBvc2l0aW9ucyAtIGFuIGFycmF5IG9mIGFsbCBwb2ludHMgb24gdGhlIHBhbmVcclxuICAgKi9cclxuICBwcml2YXRlIGV4dGVybmFsUmVwb3NpdGlvbihwb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3NpdGlvbiA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmxpbWl0c1NlcnZpY2UuY29tcGFyZUFycmF5KHRoaXMubGltaXRSb2xlcywgcG9zaXRpb24ucm9sZXMpKSB7XHJcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLmVuZm9yY2VQYW5lTGltaXRzKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgeDogcG9zaXRpb24ueCxcclxuICAgICAgICAgIHk6IHBvc2l0aW9uLnlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBuZXcgcG9pbnQgcG9zaXRpb24gaWYgdGhlIG1vdmVtZW50IGV4Y2VlZGVkIHRoZSBwYW5lIGxpbWl0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmZvcmNlUGFuZUxpbWl0cyhwb3NpdGlvbjogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgaWYgKHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoID09PSAwIHx8IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocG9zaXRpb24ueCA+IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgcG9zaXRpb24ueCA9IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgIHBvc2l0aW9uLnggPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb3NpdGlvbi55ID4gdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgcG9zaXRpb24ueSA9IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgICBwb3NpdGlvbi55ID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuIl19