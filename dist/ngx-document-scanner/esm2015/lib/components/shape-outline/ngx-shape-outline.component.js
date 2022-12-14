/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/shape-outline/ngx-shape-outline.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
export class NgxShapeOutlineComponent {
    /**
     * @param {?} limitsService
     */
    constructor(limitsService) {
        this.limitsService = limitsService;
        this.color = '#3cabe2';
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // init drawing canvas dimensions
        this.canvas.nativeElement.width = this.dimensions.width;
        this.canvas.nativeElement.height = this.dimensions.height;
        this.limitsService.positions.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        positions => {
            if (positions.length === 4) {
                this._points = positions;
                this.sortPoints();
                this.clearCanvas();
                this.drawShape();
            }
        }));
        // subscribe to changes in the pane's dimensions
        this.limitsService.paneDimensions.subscribe((/**
         * @param {?} dimensions
         * @return {?}
         */
        dimensions => {
            this.clearCanvas();
            this.canvas.nativeElement.width = dimensions.width;
            this.canvas.nativeElement.height = dimensions.height;
        }));
        // subscribe to reposition events
        this.limitsService.repositionEvent.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        positions => {
            if (positions.length === 4) {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this.clearCanvas();
                    this.sortPoints();
                    this.drawShape();
                }), 10);
            }
        }));
    }
    /**
     * clears the shape canvas
     * @private
     * @return {?}
     */
    clearCanvas() {
        /** @type {?} */
        const canvas = this.canvas.nativeElement;
        /** @type {?} */
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    }
    /**
     * sorts the array of points according to their clockwise alignment
     * @private
     * @return {?}
     */
    sortPoints() {
        /** @type {?} */
        const _points = Array.from(this._points);
        /** @type {?} */
        const sortedPoints = [];
        /** @type {?} */
        const sortOrder = {
            vertical: ['top', 'top', 'bottom', 'bottom'],
            horizontal: ['left', 'right', 'right', 'left']
        };
        for (let i = 0; i < 4; i++) {
            /** @type {?} */
            const roles = Array.from([sortOrder.vertical[i], sortOrder.horizontal[i]]);
            sortedPoints.push(_points.filter((/**
             * @param {?} point
             * @return {?}
             */
            (point) => {
                return this.limitsService.compareArray(point.roles, roles);
            }))[0]);
        }
        this._sortedPoints = sortedPoints;
    }
    /**
     * draws a line between the points according to their order
     * @private
     * @return {?}
     */
    drawShape() {
        /** @type {?} */
        const canvas = this.canvas.nativeElement;
        /** @type {?} */
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = this.weight;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this._sortedPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        (point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            }
            if (index !== this._sortedPoints.length - 1) {
                /** @type {?} */
                const nextPoint = this._sortedPoints[index + 1];
                ctx.lineTo(nextPoint.x, nextPoint.y);
            }
            else {
                ctx.closePath();
            }
        }));
        ctx.stroke();
    }
}
NgxShapeOutlineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-shape-outine',
                template: "<canvas #outline\r\n        style=\"position: absolute; z-index: 1000\"\r\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\r\n        *ngIf=\"dimensions\">\r\n</canvas>\r\n"
            }] }
];
/** @nocollapse */
NgxShapeOutlineComponent.ctorParameters = () => [
    { type: LimitsService }
];
NgxShapeOutlineComponent.propDecorators = {
    color: [{ type: Input }],
    weight: [{ type: Input }],
    dimensions: [{ type: Input }],
    canvas: [{ type: ViewChild, args: ['outline',] }]
};
if (false) {
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.color;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.weight;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.dimensions;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.canvas;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype._points;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype._sortedPoints;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype.limitsService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9zaGFwZS1vdXRsaW5lL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSwrQkFBK0IsQ0FBQztBQU9qRixNQUFNLE9BQU8sd0JBQXdCOzs7O0lBU25DLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBUHZDLFVBQUssR0FBRyxTQUFTLENBQUM7SUFPd0IsQ0FBQzs7OztJQUVwRCxlQUFlO1FBQ2IsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsU0FBUzs7OztRQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2xCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMs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QUMsQ0FBQzthQUM5QjtZQUNELElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7c0JBQ3JDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDOzs7WUFqR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLGlPQUFpRDthQUNsRDs7OztZQU5PLGFBQWE7OztvQkFTbEIsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsU0FBUyxTQUFDLFNBQVM7Ozs7SUFIcEIseUNBQTJCOztJQUMzQiwwQ0FBd0I7O0lBQ3hCLDhDQUFxQzs7SUFDckMsMENBQTZCOzs7OztJQUU3QiwyQ0FBNEM7Ozs7O0lBQzVDLGlEQUFrRDs7Ozs7SUFDdEMsaURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0xpbWl0c1NlcnZpY2UsIFBvaW50UG9zaXRpb25DaGFuZ2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zaGFwZS1vdXRpbmUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtc2hhcGUtb3V0bGluZS5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTaGFwZU91dGxpbmVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgQElucHV0KCkgY29sb3IgPSAnIzNjYWJlMic7XHJcbiAgQElucHV0KCkgd2VpZ2h0OiBudW1iZXI7XHJcbiAgQElucHV0KCkgZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIEBWaWV3Q2hpbGQoJ291dGxpbmUnKSBjYW52YXM7XHJcblxyXG4gIHByaXZhdGUgX3BvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcbiAgcHJpdmF0ZSBfc29ydGVkUG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIC8vIGluaXQgZHJhd2luZyBjYW52YXMgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMuZGltZW5zaW9ucy53aWR0aDtcclxuICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvc2l0aW9ucyA9PiB7XHJcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID09PSA0KSB7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gcG9zaXRpb25zO1xyXG4gICAgICAgIHRoaXMuc29ydFBvaW50cygpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdTaGFwZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBwYW5lJ3MgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBhbmVEaW1lbnNpb25zLnN1YnNjcmliZShkaW1lbnNpb25zID0+IHtcclxuICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gZGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSBkaW1lbnNpb25zLmhlaWdodDtcclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHJlcG9zaXRpb24gZXZlbnRzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvbkV2ZW50LnN1YnNjcmliZSggcG9zaXRpb25zID0+IHtcclxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPT09IDQpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgICAgICB0aGlzLnNvcnRQb2ludHMoKTtcclxuICAgICAgICAgIHRoaXMuZHJhd1NoYXBlKCk7XHJcbiAgICAgICAgfSwgMTApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNsZWFycyB0aGUgc2hhcGUgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjbGVhckNhbnZhcygpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNvcnRzIHRoZSBhcnJheSBvZiBwb2ludHMgYWNjb3JkaW5nIHRvIHRoZWlyIGNsb2Nrd2lzZSBhbGlnbm1lbnRcclxuICAgKi9cclxuICBwcml2YXRlIHNvcnRQb2ludHMoKSB7XHJcbiAgICBjb25zdCBfcG9pbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpO1xyXG4gICAgY29uc3Qgc29ydGVkUG9pbnRzID0gW107XHJcblxyXG4gICAgY29uc3Qgc29ydE9yZGVyID0ge1xyXG4gICAgICB2ZXJ0aWNhbDogWyd0b3AnLCAndG9wJywgJ2JvdHRvbScsICdib3R0b20nXSxcclxuICAgICAgaG9yaXpvbnRhbDogWydsZWZ0JywgJ3JpZ2h0JywgJ3JpZ2h0JywgJ2xlZnQnXVxyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICBjb25zdCByb2xlcyA9IEFycmF5LmZyb20oW3NvcnRPcmRlci52ZXJ0aWNhbFtpXSwgc29ydE9yZGVyLmhvcml6b250YWxbaV1dKTtcclxuICAgICAgc29ydGVkUG9pbnRzLnB1c2goX3BvaW50cy5maWx0ZXIoKHBvaW50KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcclxuICAgICAgfSlbMF0pO1xyXG5cclxuICAgIH1cclxuICAgIHRoaXMuX3NvcnRlZFBvaW50cyA9IHNvcnRlZFBvaW50cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRyYXdzIGEgbGluZSBiZXR3ZWVuIHRoZSBwb2ludHMgYWNjb3JkaW5nIHRvIHRoZWlyIG9yZGVyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBkcmF3U2hhcGUoKSB7XHJcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50O1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy53ZWlnaHQ7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5fc29ydGVkUG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xyXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICBjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5fc29ydGVkUG9pbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLl9zb3J0ZWRQb2ludHNbaW5kZXggKyAxXTtcclxuICAgICAgICBjdHgubGluZVRvKG5leHRQb2ludC54LCBuZXh0UG9pbnQueSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iXX0=