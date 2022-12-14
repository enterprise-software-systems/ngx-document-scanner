/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/shape-outline/ngx-shape-outline.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
var NgxShapeOutlineComponent = /** @class */ (function () {
    function NgxShapeOutlineComponent(limitsService) {
        this.limitsService = limitsService;
        this.color = '#3cabe2';
    }
    /**
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // init drawing canvas dimensions
        this.canvas.nativeElement.width = this.dimensions.width;
        this.canvas.nativeElement.height = this.dimensions.height;
        this.limitsService.positions.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        function (positions) {
            if (positions.length === 4) {
                _this._points = positions;
                _this.sortPoints();
                _this.clearCanvas();
                _this.drawShape();
            }
        }));
        // subscribe to changes in the pane's dimensions
        this.limitsService.paneDimensions.subscribe((/**
         * @param {?} dimensions
         * @return {?}
         */
        function (dimensions) {
            _this.clearCanvas();
            _this.canvas.nativeElement.width = dimensions.width;
            _this.canvas.nativeElement.height = dimensions.height;
        }));
        // subscribe to reposition events
        this.limitsService.repositionEvent.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        function (positions) {
            if (positions.length === 4) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.clearCanvas();
                    _this.sortPoints();
                    _this.drawShape();
                }), 10);
            }
        }));
    };
    /**
     * clears the shape canvas
     */
    /**
     * clears the shape canvas
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.clearCanvas = /**
     * clears the shape canvas
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canvas = this.canvas.nativeElement;
        /** @type {?} */
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    };
    /**
     * sorts the array of points according to their clockwise alignment
     */
    /**
     * sorts the array of points according to their clockwise alignment
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.sortPoints = /**
     * sorts the array of points according to their clockwise alignment
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var _points = Array.from(this._points);
        /** @type {?} */
        var sortedPoints = [];
        /** @type {?} */
        var sortOrder = {
            vertical: ['top', 'top', 'bottom', 'bottom'],
            horizontal: ['left', 'right', 'right', 'left']
        };
        var _loop_1 = function (i) {
            /** @type {?} */
            var roles = Array.from([sortOrder.vertical[i], sortOrder.horizontal[i]]);
            sortedPoints.push(_points.filter((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                return _this.limitsService.compareArray(point.roles, roles);
            }))[0]);
        };
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
        this._sortedPoints = sortedPoints;
    };
    /**
     * draws a line between the points according to their order
     */
    /**
     * draws a line between the points according to their order
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.drawShape = /**
     * draws a line between the points according to their order
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var canvas = this.canvas.nativeElement;
        /** @type {?} */
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = this.weight;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this._sortedPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            }
            if (index !== _this._sortedPoints.length - 1) {
                /** @type {?} */
                var nextPoint = _this._sortedPoints[index + 1];
                ctx.lineTo(nextPoint.x, nextPoint.y);
            }
            else {
                ctx.closePath();
            }
        }));
        ctx.stroke();
    };
    NgxShapeOutlineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-shape-outine',
                    template: "<canvas #outline\r\n        style=\"position: absolute; z-index: 1000\"\r\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\r\n        *ngIf=\"dimensions\">\r\n</canvas>\r\n"
                }] }
    ];
    /** @nocollapse */
    NgxShapeOutlineComponent.ctorParameters = function () { return [
        { type: LimitsService }
    ]; };
    NgxShapeOutlineComponent.propDecorators = {
        color: [{ type: Input }],
        weight: [{ type: Input }],
        dimensions: [{ type: Input }],
        canvas: [{ type: ViewChild, args: ['outline',] }]
    };
    return NgxShapeOutlineComponent;
}());
export { NgxShapeOutlineComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9zaGFwZS1vdXRsaW5lL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSwrQkFBK0IsQ0FBQztBQUdqRjtJQWFFLGtDQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVB2QyxVQUFLLEdBQUcsU0FBUyxDQUFDO0lBT3dCLENBQUM7Ozs7SUFFcEQsa0RBQWU7OztJQUFmO1FBQUEsaUJBNEJDO1FBM0JDLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFBLFNBQVM7WUFDOUMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDMUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDbEI7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFT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QUU7Z0JBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtZQUNELElBQUksS0FBSyxLQUFLLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7b0JBQ3JDLFNBQVMsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDOztnQkFqR0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLGlPQUFpRDtpQkFDbEQ7Ozs7Z0JBTk8sYUFBYTs7O3dCQVNsQixLQUFLO3lCQUNMLEtBQUs7NkJBQ0wsS0FBSzt5QkFDTCxTQUFTLFNBQUMsU0FBUzs7SUF5RnRCLCtCQUFDO0NBQUEsQUFsR0QsSUFrR0M7U0E5Rlksd0JBQXdCOzs7SUFFbkMseUNBQTJCOztJQUMzQiwwQ0FBd0I7O0lBQ3hCLDhDQUFxQzs7SUFDckMsMENBQTZCOzs7OztJQUU3QiwyQ0FBNEM7Ozs7O0lBQzVDLGlEQUFrRDs7Ozs7SUFDdEMsaURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0xpbWl0c1NlcnZpY2UsIFBvaW50UG9zaXRpb25DaGFuZ2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zaGFwZS1vdXRpbmUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtc2hhcGUtb3V0bGluZS5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTaGFwZU91dGxpbmVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgQElucHV0KCkgY29sb3IgPSAnIzNjYWJlMic7XHJcbiAgQElucHV0KCkgd2VpZ2h0OiBudW1iZXI7XHJcbiAgQElucHV0KCkgZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIEBWaWV3Q2hpbGQoJ291dGxpbmUnKSBjYW52YXM7XHJcblxyXG4gIHByaXZhdGUgX3BvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcbiAgcHJpdmF0ZSBfc29ydGVkUG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIC8vIGluaXQgZHJhd2luZyBjYW52YXMgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMuZGltZW5zaW9ucy53aWR0aDtcclxuICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvc2l0aW9ucyA9PiB7XHJcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID09PSA0KSB7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gcG9zaXRpb25zO1xyXG4gICAgICAgIHRoaXMuc29ydFBvaW50cygpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdTaGFwZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBwYW5lJ3MgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBhbmVEaW1lbnNpb25zLnN1YnNjcmliZShkaW1lbnNpb25zID0+IHtcclxuICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gZGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSBkaW1lbnNpb25zLmhlaWdodDtcclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHJlcG9zaXRpb24gZXZlbnRzXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvbkV2ZW50LnN1YnNjcmliZSggcG9zaXRpb25zID0+IHtcclxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPT09IDQpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgICAgICB0aGlzLnNvcnRQb2ludHMoKTtcclxuICAgICAgICAgIHRoaXMuZHJhd1NoYXBlKCk7XHJcbiAgICAgICAgfSwgMTApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNsZWFycyB0aGUgc2hhcGUgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjbGVhckNhbnZhcygpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNvcnRzIHRoZSBhcnJheSBvZiBwb2ludHMgYWNjb3JkaW5nIHRvIHRoZWlyIGNsb2Nrd2lzZSBhbGlnbm1lbnRcclxuICAgKi9cclxuICBwcml2YXRlIHNvcnRQb2ludHMoKSB7XHJcbiAgICBjb25zdCBfcG9pbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpO1xyXG4gICAgY29uc3Qgc29ydGVkUG9pbnRzID0gW107XHJcblxyXG4gICAgY29uc3Qgc29ydE9yZGVyID0ge1xyXG4gICAgICB2ZXJ0aWNhbDogWyd0b3AnLCAndG9wJywgJ2JvdHRvbScsICdib3R0b20nXSxcclxuICAgICAgaG9yaXpvbnRhbDogWydsZWZ0JywgJ3JpZ2h0JywgJ3JpZ2h0JywgJ2xlZnQnXVxyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICBjb25zdCByb2xlcyA9IEFycmF5LmZyb20oW3NvcnRPcmRlci52ZXJ0aWNhbFtpXSwgc29ydE9yZGVyLmhvcml6b250YWxbaV1dKTtcclxuICAgICAgc29ydGVkUG9pbnRzLnB1c2goX3BvaW50cy5maWx0ZXIoKHBvaW50KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcclxuICAgICAgfSlbMF0pO1xyXG5cclxuICAgIH1cclxuICAgIHRoaXMuX3NvcnRlZFBvaW50cyA9IHNvcnRlZFBvaW50cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRyYXdzIGEgbGluZSBiZXR3ZWVuIHRoZSBwb2ludHMgYWNjb3JkaW5nIHRvIHRoZWlyIG9yZGVyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBkcmF3U2hhcGUoKSB7XHJcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50O1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy53ZWlnaHQ7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5fc29ydGVkUG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xyXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICBjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5fc29ydGVkUG9pbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLl9zb3J0ZWRQb2ludHNbaW5kZXggKyAxXTtcclxuICAgICAgICBjdHgubGluZVRvKG5leHRQb2ludC54LCBuZXh0UG9pbnQueSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iXX0=