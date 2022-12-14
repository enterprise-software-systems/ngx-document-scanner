import { AfterViewInit } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { ImageDimensions } from '../../PublicModels';
import * as ɵngcc0 from '@angular/core';
export declare class NgxShapeOutlineComponent implements AfterViewInit {
    private limitsService;
    color: string;
    weight: number;
    dimensions: ImageDimensions;
    canvas: any;
    private _points;
    private _sortedPoints;
    constructor(limitsService: LimitsService);
    ngAfterViewInit(): void;
    /**
     * clears the shape canvas
     */
    private clearCanvas;
    /**
     * sorts the array of points according to their clockwise alignment
     */
    private sortPoints;
    /**
     * draws a line between the points according to their order
     */
    private drawShape;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgxShapeOutlineComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgxShapeOutlineComponent, "ngx-shape-outine", never, { "color": "color"; "weight": "weight"; "dimensions": "dimensions"; }, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIm5neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExpbWl0c1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7IEltYWdlRGltZW5zaW9ucyB9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE5neFNoYXBlT3V0bGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gICAgcHJpdmF0ZSBsaW1pdHNTZXJ2aWNlO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgY2FudmFzOiBhbnk7XHJcbiAgICBwcml2YXRlIF9wb2ludHM7XHJcbiAgICBwcml2YXRlIF9zb3J0ZWRQb2ludHM7XHJcbiAgICBjb25zdHJ1Y3RvcihsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlKTtcclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjbGVhcnMgdGhlIHNoYXBlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNsZWFyQ2FudmFzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzb3J0cyB0aGUgYXJyYXkgb2YgcG9pbnRzIGFjY29yZGluZyB0byB0aGVpciBjbG9ja3dpc2UgYWxpZ25tZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc29ydFBvaW50cztcclxuICAgIC8qKlxyXG4gICAgICogZHJhd3MgYSBsaW5lIGJldHdlZW4gdGhlIHBvaW50cyBhY2NvcmRpbmcgdG8gdGhlaXIgb3JkZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkcmF3U2hhcGU7XHJcbn1cclxuIl19