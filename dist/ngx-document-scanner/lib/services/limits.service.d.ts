import { BehaviorSubject } from 'rxjs';
import { ImageDimensions } from '../PublicModels';
import { LimitException, XYPosition } from '../PrivateModels';
import * as ɵngcc0 from '@angular/core';
export declare class LimitsService {
    private limitDirections;
    /**
     * stores the crop limits limits
     */
    private _limits;
    /**
     * stores the array of the draggable points displayed on the crop area
     */
    private _points;
    /**
     * stores the pane dimensions
     */
    private _paneDimensions;
    positions: BehaviorSubject<Array<PointPositionChange>>;
    repositionEvent: BehaviorSubject<Array<PointPositionChange>>;
    limits: BehaviorSubject<AreaLimits>;
    paneDimensions: BehaviorSubject<ImageDimensions>;
    constructor();
    /**
     * set privew pane dimensions
     */
    setPaneDimensions(dimensions: ImageDimensions): Promise<unknown>;
    /**
     * repositions points externally
     */
    repositionPoints(positions: any): void;
    /**
     * updates limits and point positions and calls next on the observables
     * @param positionChangeData - position change event data
     */
    positionChange(positionChangeData: PointPositionChange): void;
    /**
     * updates the position of the point
     * @param positionChange - position change event data
     */
    updatePosition(positionChange: PointPositionChange): void;
    /**
     * check if a position change event exceeds the limits
     * @param positionChange - position change event data
     * @returns LimitException0
     */
    exceedsLimit(positionChange: PointPositionChange): LimitException;
    /**
     * rotate crop tool points clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateClockwise(resizeRatios: any, initialPreviewDimensions: any, initialPositions: Array<PointPositionChange>): void;
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     */
    private rotateCornerClockwise;
    /**
     * checks if two array contain the same values
     * @param array1 - array 1
     * @param array2 - array 2
     * @returns boolean
     */
    compareArray(array1: Array<string>, array2: Array<string>): boolean;
    private getDirectionAxis;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<LimitsService, never>;
}
export interface PointPositionChange {
    x: number;
    y: number;
    roles: RolesArray;
}
export interface AreaLimits {
    top: number;
    bottom: number;
    right: number;
    left: number;
}
export declare type RolesArray = Array<Direction>;
export declare class PositionChangeData implements PointPositionChange {
    x: number;
    y: number;
    roles: RolesArray;
    constructor(position: XYPosition, roles: RolesArray);
}
export declare type Direction = 'left' | 'right' | 'top' | 'bottom';

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsibGltaXRzLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEltYWdlRGltZW5zaW9ucyB9IGZyb20gJy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7IExpbWl0RXhjZXB0aW9uLCBYWVBvc2l0aW9uIH0gZnJvbSAnLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIExpbWl0c1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBsaW1pdERpcmVjdGlvbnM7XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgY3JvcCBsaW1pdHMgbGltaXRzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2xpbWl0cztcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBhcnJheSBvZiB0aGUgZHJhZ2dhYmxlIHBvaW50cyBkaXNwbGF5ZWQgb24gdGhlIGNyb3AgYXJlYVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9wb2ludHM7XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgcGFuZSBkaW1lbnNpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zO1xyXG4gICAgcG9zaXRpb25zOiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+O1xyXG4gICAgcmVwb3NpdGlvbkV2ZW50OiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+O1xyXG4gICAgbGltaXRzOiBCZWhhdmlvclN1YmplY3Q8QXJlYUxpbWl0cz47XHJcbiAgICBwYW5lRGltZW5zaW9uczogQmVoYXZpb3JTdWJqZWN0PEltYWdlRGltZW5zaW9ucz47XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgcHJpdmV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBzZXRQYW5lRGltZW5zaW9ucyhkaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMpOiBQcm9taXNlPHVua25vd24+O1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXBvc2l0aW9ucyBwb2ludHMgZXh0ZXJuYWxseVxyXG4gICAgICovXHJcbiAgICByZXBvc2l0aW9uUG9pbnRzKHBvc2l0aW9uczogYW55KTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlcyBsaW1pdHMgYW5kIHBvaW50IHBvc2l0aW9ucyBhbmQgY2FsbHMgbmV4dCBvbiB0aGUgb2JzZXJ2YWJsZXNcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZURhdGEgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbkNoYW5nZURhdGE6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiB1cGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZSAtIHBvc2l0aW9uIGNoYW5nZSBldmVudCBkYXRhXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogY2hlY2sgaWYgYSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZXhjZWVkcyB0aGUgbGltaXRzXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAgICogQHJldHVybnMgTGltaXRFeGNlcHRpb24wXHJcbiAgICAgKi9cclxuICAgIGV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZTogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IExpbWl0RXhjZXB0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBjbG9ja3dpc2VcclxuICAgICAqIEBwYXJhbSByZXNpemVSYXRpb3MgLSByYXRpbyBiZXR3ZWVuIHRoZSBuZXcgZGltZW5zaW9ucyBhbmQgdGhlIHByZXZpb3VzXHJcbiAgICAgKiBAcGFyYW0gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zIC0gcHJldmlldyBwYW5lIGRpbWVuc2lvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICAgKiBAcGFyYW0gaW5pdGlhbFBvc2l0aW9ucyAtIGN1cnJlbnQgcG9zaXRpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAgICovXHJcbiAgICByb3RhdGVDbG9ja3dpc2UocmVzaXplUmF0aW9zOiBhbnksIGluaXRpYWxQcmV2aWV3RGltZW5zaW9uczogYW55LCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPik6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgdGhlIGNvcm5lciBwb3NpdGlvbnMgYWZ0ZXIgYSA5MCBkZWdyZWVzIGNsb2Nrd2lzZSByb3RhdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJvdGF0ZUNvcm5lckNsb2Nrd2lzZTtcclxuICAgIC8qKlxyXG4gICAgICogY2hlY2tzIGlmIHR3byBhcnJheSBjb250YWluIHRoZSBzYW1lIHZhbHVlc1xyXG4gICAgICogQHBhcmFtIGFycmF5MSAtIGFycmF5IDFcclxuICAgICAqIEBwYXJhbSBhcnJheTIgLSBhcnJheSAyXHJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuXHJcbiAgICAgKi9cclxuICAgIGNvbXBhcmVBcnJheShhcnJheTE6IEFycmF5PHN0cmluZz4sIGFycmF5MjogQXJyYXk8c3RyaW5nPik6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIGdldERpcmVjdGlvbkF4aXM7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHJvbGVzOiBSb2xlc0FycmF5O1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJlYUxpbWl0cyB7XHJcbiAgICB0b3A6IG51bWJlcjtcclxuICAgIGJvdHRvbTogbnVtYmVyO1xyXG4gICAgcmlnaHQ6IG51bWJlcjtcclxuICAgIGxlZnQ6IG51bWJlcjtcclxufVxyXG5leHBvcnQgZGVjbGFyZSB0eXBlIFJvbGVzQXJyYXkgPSBBcnJheTxEaXJlY3Rpb24+O1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBQb3NpdGlvbkNoYW5nZURhdGEgaW1wbGVtZW50cyBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHJvbGVzOiBSb2xlc0FycmF5O1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IFhZUG9zaXRpb24sIHJvbGVzOiBSb2xlc0FycmF5KTtcclxufVxyXG5leHBvcnQgZGVjbGFyZSB0eXBlIERpcmVjdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nO1xyXG4iXX0=