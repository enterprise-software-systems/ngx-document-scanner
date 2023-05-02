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
    hover: boolean;
    clicking: boolean;
    position: XYPosition;
    private _paneDimensions;
    resetPosition: XYPosition;
    constructor(limitsService: LimitsService);
    ngAfterViewInit(): void;
    mouseUp(event: any): void;
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
    hoverPointStyle(): {
        cursor: string;
        'background-color': string;
        width: string;
        height: string;
        'border-radius': string | number;
        position: string;
    };
    clickingPointStyle(): {
        cursor: string;
        'background-color': string;
        width: string;
        height: string;
        'border-radius': string | number;
        position: string;
    };
    getStyle(): {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsibmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBYWVBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE5neERyYWdnYWJsZVBvaW50Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgICBwcml2YXRlIGxpbWl0c1NlcnZpY2U7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gICAgc2hhcGU6ICdyZWN0JyB8ICdjaXJjbGUnO1xyXG4gICAgcG9pbnRPcHRpb25zOiAncmVjdCcgfCAnY2lyY2xlJztcclxuICAgIGxpbWl0Um9sZXM6IEFycmF5PCdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nPjtcclxuICAgIHN0YXJ0UG9zaXRpb246IFhZUG9zaXRpb247XHJcbiAgICBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudFBvc2l0aW9uO1xyXG4gICAgaG92ZXI6IGJvb2xlYW47XHJcbiAgICBjbGlja2luZzogYm9vbGVhbjtcclxuICAgIHBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG4gICAgcHJpdmF0ZSBfcGFuZURpbWVuc2lvbnM7XHJcbiAgICByZXNldFBvc2l0aW9uOiBYWVBvc2l0aW9uO1xyXG4gICAgY29uc3RydWN0b3IobGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSk7XHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZDtcclxuICAgIG1vdXNlVXAoZXZlbnQ6IGFueSk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBjc3Mgc3R5bGUgb2JqZWN0IGZvciB0aGUgcG9pbnRcclxuICAgICAqL1xyXG4gICAgcG9pbnRTdHlsZSgpOiB7XHJcbiAgICAgICAgd2lkdGg6IHN0cmluZztcclxuICAgICAgICBoZWlnaHQ6IHN0cmluZztcclxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHN0cmluZztcclxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IHN0cmluZyB8IG51bWJlcjtcclxuICAgICAgICBwb3NpdGlvbjogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIGhvdmVyUG9pbnRTdHlsZSgpOiB7XHJcbiAgICAgICAgY3Vyc29yOiBzdHJpbmc7XHJcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBzdHJpbmc7XHJcbiAgICAgICAgd2lkdGg6IHN0cmluZztcclxuICAgICAgICBoZWlnaHQ6IHN0cmluZztcclxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IHN0cmluZyB8IG51bWJlcjtcclxuICAgICAgICBwb3NpdGlvbjogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIGNsaWNraW5nUG9pbnRTdHlsZSgpOiB7XHJcbiAgICAgICAgY3Vyc29yOiBzdHJpbmc7XHJcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBzdHJpbmc7XHJcbiAgICAgICAgd2lkdGg6IHN0cmluZztcclxuICAgICAgICBoZWlnaHQ6IHN0cmluZztcclxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IHN0cmluZyB8IG51bWJlcjtcclxuICAgICAgICBwb3NpdGlvbjogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIGdldFN0eWxlKCk6IHtcclxuICAgICAgICB3aWR0aDogc3RyaW5nO1xyXG4gICAgICAgIGhlaWdodDogc3RyaW5nO1xyXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogc3RyaW5nO1xyXG4gICAgICAgICdib3JkZXItcmFkaXVzJzogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgICAgIHBvc2l0aW9uOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiByZWdpc3RlcnMgYSBwb3NpdGlvbiBjaGFuZ2Ugb24gdGhlIGxpbWl0cyBzZXJ2aWNlLCBhbmQgYWRqdXN0cyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludFxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogWFlQb3NpdGlvbik6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGFkanVzdHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBhZnRlciBhIGxpbWl0IGV4Y2VwdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkanVzdFBvc2l0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsZWQgb24gbW92ZW1lbnQgZW5kLCBjaGVja3MgaWYgbGFzdCBwb3NpdGlvbiBleGNlZWRlZCB0aGUgbGltaXRzIGFkIGFkanVzdHNcclxuICAgICAqL1xyXG4gICAgbW92ZW1lbnRFbmQocG9zaXRpb246IFhZUG9zaXRpb24pOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxjdWxhdGVzIHRoZSBpbml0aWFsIHBvc2l0aW9ucyBvZiB0aGUgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAgICogQHBhcmFtIGRpbWVuc2lvbnMgLSBkaW1lbnNpb25zIG9mIHRoZSBwYW5lIGluIHdoaWNoIHRoZSBwb2ludCBpcyBsb2NhdGVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0SW5pdGlhbFBvc2l0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXBvc2l0aW9ucyB0aGUgcG9pbnQgYWZ0ZXIgYW4gZXh0ZXJuYWwgcmVwb3NpdGlvbiBldmVudFxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9ucyAtIGFuIGFycmF5IG9mIGFsbCBwb2ludHMgb24gdGhlIHBhbmVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBleHRlcm5hbFJlcG9zaXRpb247XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBuZXcgcG9pbnQgcG9zaXRpb24gaWYgdGhlIG1vdmVtZW50IGV4Y2VlZGVkIHRoZSBwYW5lIGxpbWl0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZW5mb3JjZVBhbmVMaW1pdHM7XHJcbn1cclxuIl19