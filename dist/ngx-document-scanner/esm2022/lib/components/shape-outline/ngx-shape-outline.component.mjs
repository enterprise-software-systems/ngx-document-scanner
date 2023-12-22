import { Component, Input, ViewChild } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/limits.service";
import * as i2 from "@angular/flex-layout/extended";
import * as i3 from "@angular/common";
const _c0 = ["outline"];
const _c1 = function (a0, a1) { return { width: a0, height: a1 }; };
function NgxShapeOutlineComponent_canvas_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "canvas", 1, 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngStyle", i0.ɵɵpureFunction2(1, _c1, ctx_r0.dimensions.width + "px", ctx_r0.dimensions.height + "px"));
} }
export class NgxShapeOutlineComponent {
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
    /** @nocollapse */ static { this.ɵfac = function NgxShapeOutlineComponent_Factory(t) { return new (t || NgxShapeOutlineComponent)(i0.ɵɵdirectiveInject(i1.LimitsService)); }; }
    /** @nocollapse */ static { this.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NgxShapeOutlineComponent, selectors: [["ngx-shape-outine"]], viewQuery: function NgxShapeOutlineComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
        } }, inputs: { color: "color", weight: "weight", dimensions: "dimensions" }, decls: 1, vars: 1, consts: [["style", "position: absolute; z-index: 1000", 3, "ngStyle", 4, "ngIf"], [2, "position", "absolute", "z-index", "1000", 3, "ngStyle"], ["outline", ""]], template: function NgxShapeOutlineComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, NgxShapeOutlineComponent_canvas_0_Template, 2, 4, "canvas", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.dimensions);
        } }, dependencies: [i2.DefaultStyleDirective, i3.NgIf, i3.NgStyle], encapsulation: 2 }); }
}
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxShapeOutlineComponent, [{
        type: Component,
        args: [{ selector: 'ngx-shape-outine', template: "<canvas #outline\r\n        style=\"position: absolute; z-index: 1000\"\r\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\r\n        *ngIf=\"dimensions\">\r\n</canvas>\r\n" }]
    }], function () { return [{ type: i1.LimitsService }]; }, { color: [{
            type: Input
        }], weight: [{
            type: Input
        }], dimensions: [{
            type: Input
        }], canvas: [{
            type: ViewChild,
            args: ['outline']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9jb21wb25lbnRzL3NoYXBlLW91dGxpbmUvbmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9jb21wb25lbnRzL3NoYXBlLW91dGxpbmUvbmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFnQixTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEVBQUMsYUFBYSxFQUFzQixNQUFNLCtCQUErQixDQUFDOzs7Ozs7OztJQ0RqRiwrQkFJUzs7O0lBRkQscUhBQThFOztBRE10RixNQUFNLE9BQU8sd0JBQXdCO0lBU25DLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBUHZDLFVBQUssR0FBRyxTQUFTLENBQUM7SUFPd0IsQ0FBQztJQUVwRCxlQUFlO1FBQ2IsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO2dCQUN6QixJ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UUFDNUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMxQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtZQUNELElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDOzRHQTdGVSx3QkFBd0I7bUdBQXhCLHdCQUF3Qjs7Ozs7O1lDUnJDLCtFQUlTOztZQURBLHFDQUFnQjs7O3VGREtaLHdCQUF3QjtjQUpwQyxTQUFTOzJCQUNFLGtCQUFrQjtnRUFLbkIsS0FBSztrQkFBYixLQUFLO1lBQ0csTUFBTTtrQkFBZCxLQUFLO1lBQ0csVUFBVTtrQkFBbEIsS0FBSztZQUNnQixNQUFNO2tCQUEzQixTQUFTO21CQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgSW5wdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNoYXBlLW91dGluZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNoYXBlT3V0bGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG5cclxuICBASW5wdXQoKSBjb2xvciA9ICcjM2NhYmUyJztcclxuICBASW5wdXQoKSB3ZWlnaHQ6IG51bWJlcjtcclxuICBASW5wdXQoKSBkaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgQFZpZXdDaGlsZCgnb3V0bGluZScpIGNhbnZhcztcclxuXHJcbiAgcHJpdmF0ZSBfcG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcclxuICBwcml2YXRlIF9zb3J0ZWRQb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSkge31cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgLy8gaW5pdCBkcmF3aW5nIGNhbnZhcyBkaW1lbnNpb25zXHJcbiAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gdGhpcy5kaW1lbnNpb25zLndpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9ucy5zdWJzY3JpYmUocG9zaXRpb25zID0+IHtcclxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPT09IDQpIHtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBwb3NpdGlvbnM7XHJcbiAgICAgICAgdGhpcy5zb3J0UG9pbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIHBhbmUncyBkaW1lbnNpb25zXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucGFuZURpbWVuc2lvbnMuc3Vic2NyaWJlKGRpbWVuc2lvbnMgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSBkaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IGRpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgfSk7XHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gcmVwb3NpdGlvbiBldmVudHNcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uRXZlbnQuc3Vic2NyaWJlKCBwb3NpdGlvbnMgPT4ge1xyXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA9PT0gNCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAgIHRoaXMuc29ydFBvaW50cygpO1xyXG4gICAgICAgICAgdGhpcy5kcmF3U2hhcGUoKTtcclxuICAgICAgICB9LCAxMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2xlYXJzIHRoZSBzaGFwZSBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudDtcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc29ydHMgdGhlIGFycmF5IG9mIHBvaW50cyBhY2NvcmRpbmcgdG8gdGhlaXIgY2xvY2t3aXNlIGFsaWdubWVudFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc29ydFBvaW50cygpIHtcclxuICAgIGNvbnN0IF9wb2ludHMgPSBBcnJheS5mcm9tKHRoaXMuX3BvaW50cyk7XHJcbiAgICBjb25zdCBzb3J0ZWRQb2ludHMgPSBbXTtcclxuXHJcbiAgICBjb25zdCBzb3J0T3JkZXIgPSB7XHJcbiAgICAgIHZlcnRpY2FsOiBbJ3RvcCcsICd0b3AnLCAnYm90dG9tJywgJ2JvdHRvbSddLFxyXG4gICAgICBob3Jpem9udGFsOiBbJ2xlZnQnLCAncmlnaHQnLCAncmlnaHQnLCAnbGVmdCddXHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHJvbGVzID0gQXJyYXkuZnJvbShbc29ydE9yZGVyLnZlcnRpY2FsW2ldLCBzb3J0T3JkZXIuaG9yaXpvbnRhbFtpXV0pO1xyXG4gICAgICBzb3J0ZWRQb2ludHMucHVzaChfcG9pbnRzLmZpbHRlcigocG9pbnQpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheShwb2ludC5yb2xlcywgcm9sZXMpO1xyXG4gICAgICB9KVswXSk7XHJcblxyXG4gICAgfVxyXG4gICAgdGhpcy5fc29ydGVkUG9pbnRzID0gc29ydGVkUG9pbnRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZHJhd3MgYSBsaW5lIGJldHdlZW4gdGhlIHBvaW50cyBhY2NvcmRpbmcgdG8gdGhlaXIgb3JkZXJcclxuICAgKi9cclxuICBwcml2YXRlIGRyYXdTaGFwZSgpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLndlaWdodDtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLl9zb3J0ZWRQb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgIGN0eC5tb3ZlVG8ocG9pbnQueCwgcG9pbnQueSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLl9zb3J0ZWRQb2ludHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIGNvbnN0IG5leHRQb2ludCA9IHRoaXMuX3NvcnRlZFBvaW50c1tpbmRleCArIDFdO1xyXG4gICAgICAgIGN0eC5saW5lVG8obmV4dFBvaW50LngsIG5leHRQb2ludC55KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIjxjYW52YXMgI291dGxpbmVcclxuICAgICAgICBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgei1pbmRleDogMTAwMFwiXHJcbiAgICAgICAgW25nU3R5bGVdPVwie3dpZHRoOiBkaW1lbnNpb25zLndpZHRoICsgJ3B4JywgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodCArICdweCd9XCJcclxuICAgICAgICAqbmdJZj1cImRpbWVuc2lvbnNcIj5cclxuPC9jYW52YXM+XHJcbiJdfQ==