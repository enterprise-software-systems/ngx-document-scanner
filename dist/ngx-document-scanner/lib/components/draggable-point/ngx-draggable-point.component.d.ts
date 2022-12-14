import { AfterViewInit } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { XYPosition } from '../../PrivateModels';
import * as ɵngcc0 from '@angular/core';
export declare class NgxDraggablePointComponent implements AfterViewInit {
    private limitsService;
    width: number;
    height: number;
    color: string;
    shape: 'rect' | 'circle';
    pointOptions: 'rect' | 'circle';
    limitRoles: Array<'left' | 'right' | 'top' | 'bottom'>;
    startPosition: XYPosition;
    container: HTMLElement;
    private _currentPosition;
    position: XYPosition;
    private _paneDimensions;
    resetPosition: XYPosition;
    constructor(limitsService: LimitsService);
    ngAfterViewInit(): void;
    /**
     * returns a css style object for the point
     */
    pointStyle(): {
        width: string;
        height: string;
        'background-color': string;
        'border-radius': string | number;
        position: string;
    };
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param position - the current position of the point
     */
    positionChange(position: XYPosition): void;
    /**
     * adjusts the position of the point after a limit exception
     */
    private adjustPosition;
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     */
    movementEnd(position: XYPosition): void;
    /**
     * calculates the initial positions of the point by it's roles
     * @param dimensions - dimensions of the pane in which the point is located
     */
    private getInitialPosition;
    /**
     * repositions the point after an external reposition event
     * @param positions - an array of all points on the pane
     */
    private externalReposition;
    /**
     * returns a new point position if the movement exceeded the pane limit
     */
    private enforcePaneLimits;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgxDraggablePointComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgxDraggablePointComponent, "ngx-draggable-point", never, { "width": "width"; "height": "height"; "color": "color"; "shape": "shape"; "pointOptions": "pointOptions"; "_currentPosition": "_currentPosition"; "limitRoles": "limitRoles"; "startPosition": "startPosition"; "container": "container"; }, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExpbWl0c1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7IFhZUG9zaXRpb24gfSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICAgIHByaXZhdGUgbGltaXRzU2VydmljZTtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBzaGFwZTogJ3JlY3QnIHwgJ2NpcmNsZSc7XHJcbiAgICBwb2ludE9wdGlvbnM6ICdyZWN0JyB8ICdjaXJjbGUnO1xyXG4gICAgbGltaXRSb2xlczogQXJyYXk8J2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc+O1xyXG4gICAgc3RhcnRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50UG9zaXRpb247XHJcbiAgICBwb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICAgIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zO1xyXG4gICAgcmVzZXRQb3NpdGlvbjogWFlQb3NpdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UpO1xyXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBjc3Mgc3R5bGUgb2JqZWN0IGZvciB0aGUgcG9pbnRcclxuICAgICAqL1xyXG4gICAgcG9pbnRTdHlsZSgpOiB7XHJcbiAgICAgICAgd2lkdGg6IHN0cmluZztcclxuICAgICAgICBoZWlnaHQ6IHN0cmluZztcclxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHN0cmluZztcclxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IHN0cmluZyB8IG51bWJlcjtcclxuICAgICAgICBwb3NpdGlvbjogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogcmVnaXN0ZXJzIGEgcG9zaXRpb24gY2hhbmdlIG9uIHRoZSBsaW1pdHMgc2VydmljZSwgYW5kIGFkanVzdHMgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgICAqL1xyXG4gICAgcG9zaXRpb25DaGFuZ2UocG9zaXRpb246IFhZUG9zaXRpb24pOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZGp1c3RzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYWZ0ZXIgYSBsaW1pdCBleGNlcHRpb25cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGp1c3RQb3NpdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIG9uIG1vdmVtZW50IGVuZCwgY2hlY2tzIGlmIGxhc3QgcG9zaXRpb24gZXhjZWVkZWQgdGhlIGxpbWl0cyBhZCBhZGp1c3RzXHJcbiAgICAgKi9cclxuICAgIG1vdmVtZW50RW5kKHBvc2l0aW9uOiBYWVBvc2l0aW9uKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogY2FsY3VsYXRlcyB0aGUgaW5pdGlhbCBwb3NpdGlvbnMgb2YgdGhlIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgICAqIEBwYXJhbSBkaW1lbnNpb25zIC0gZGltZW5zaW9ucyBvZiB0aGUgcGFuZSBpbiB3aGljaCB0aGUgcG9pbnQgaXMgbG9jYXRlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldEluaXRpYWxQb3NpdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICogcmVwb3NpdGlvbnMgdGhlIHBvaW50IGFmdGVyIGFuIGV4dGVybmFsIHJlcG9zaXRpb24gZXZlbnRcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcG9pbnRzIG9uIHRoZSBwYW5lXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZXh0ZXJuYWxSZXBvc2l0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGEgbmV3IHBvaW50IHBvc2l0aW9uIGlmIHRoZSBtb3ZlbWVudCBleGNlZWRlZCB0aGUgcGFuZSBsaW1pdFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGVuZm9yY2VQYW5lTGltaXRzO1xyXG59XHJcbiJdfQ==