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
     * rotate crop tool points anti-clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateAntiClockwise(resizeRatios: any, initialPreviewDimensions: any, initialPositions: Array<PointPositionChange>): void;
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     */
    private rotateCornerClockwise;
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     */
    private rotateCornerAntiClockwise;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsibGltaXRzLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJbWFnZURpbWVuc2lvbnMgfSBmcm9tICcuLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQgeyBMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbiB9IGZyb20gJy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBMaW1pdHNTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgbGltaXREaXJlY3Rpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIGNyb3AgbGltaXRzIGxpbWl0c1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9saW1pdHM7XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgYXJyYXkgb2YgdGhlIGRyYWdnYWJsZSBwb2ludHMgZGlzcGxheWVkIG9uIHRoZSBjcm9wIGFyZWFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfcG9pbnRzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIHBhbmUgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9wYW5lRGltZW5zaW9ucztcclxuICAgIHBvc2l0aW9uczogQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PjtcclxuICAgIHJlcG9zaXRpb25FdmVudDogQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PjtcclxuICAgIGxpbWl0czogQmVoYXZpb3JTdWJqZWN0PEFyZWFMaW1pdHM+O1xyXG4gICAgcGFuZURpbWVuc2lvbnM6IEJlaGF2aW9yU3ViamVjdDxJbWFnZURpbWVuc2lvbnM+O1xyXG4gICAgY29uc3RydWN0b3IoKTtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IHByaXZldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgICAqL1xyXG4gICAgc2V0UGFuZURpbWVuc2lvbnMoZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKTogUHJvbWlzZTx1bmtub3duPjtcclxuICAgIC8qKlxyXG4gICAgICogcmVwb3NpdGlvbnMgcG9pbnRzIGV4dGVybmFsbHlcclxuICAgICAqL1xyXG4gICAgcmVwb3NpdGlvblBvaW50cyhwb3NpdGlvbnM6IGFueSk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZXMgbGltaXRzIGFuZCBwb2ludCBwb3NpdGlvbnMgYW5kIGNhbGxzIG5leHQgb24gdGhlIG9ic2VydmFibGVzXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2VEYXRhIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgICAqL1xyXG4gICAgcG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAgICovXHJcbiAgICB1cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZTogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGNoZWNrIGlmIGEgcG9zaXRpb24gY2hhbmdlIGV2ZW50IGV4Y2VlZHMgdGhlIGxpbWl0c1xyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uQ2hhbmdlIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgICAqIEByZXR1cm5zIExpbWl0RXhjZXB0aW9uMFxyXG4gICAgICovXHJcbiAgICBleGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2U6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBMaW1pdEV4Y2VwdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICogcm90YXRlIGNyb3AgdG9vbCBwb2ludHMgY2xvY2t3aXNlXHJcbiAgICAgKiBAcGFyYW0gcmVzaXplUmF0aW9zIC0gcmF0aW8gYmV0d2VlbiB0aGUgbmV3IGRpbWVuc2lvbnMgYW5kIHRoZSBwcmV2aW91c1xyXG4gICAgICogQHBhcmFtIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyAtIHByZXZpZXcgcGFuZSBkaW1lbnNpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAgICogQHBhcmFtIGluaXRpYWxQb3NpdGlvbnMgLSBjdXJyZW50IHBvc2l0aW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgICAqL1xyXG4gICAgcm90YXRlQ2xvY2t3aXNlKHJlc2l6ZVJhdGlvczogYW55LCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnM6IGFueSwgaW5pdGlhbFBvc2l0aW9uczogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4pOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBhbnRpLWNsb2Nrd2lzZVxyXG4gICAgICogQHBhcmFtIHJlc2l6ZVJhdGlvcyAtIHJhdGlvIGJldHdlZW4gdGhlIG5ldyBkaW1lbnNpb25zIGFuZCB0aGUgcHJldmlvdXNcclxuICAgICAqIEBwYXJhbSBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgLSBwcmV2aWV3IHBhbmUgZGltZW5zaW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgICAqIEBwYXJhbSBpbml0aWFsUG9zaXRpb25zIC0gY3VycmVudCBwb3NpdGlvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZUFudGlDbG9ja3dpc2UocmVzaXplUmF0aW9zOiBhbnksIGluaXRpYWxQcmV2aWV3RGltZW5zaW9uczogYW55LCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPik6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgdGhlIGNvcm5lciBwb3NpdGlvbnMgYWZ0ZXIgYSA5MCBkZWdyZWVzIGNsb2Nrd2lzZSByb3RhdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJvdGF0ZUNvcm5lckNsb2Nrd2lzZTtcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgYW50aS1jbG9ja3dpc2Ugcm90YXRpb25cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByb3RhdGVDb3JuZXJBbnRpQ2xvY2t3aXNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjaGVja3MgaWYgdHdvIGFycmF5IGNvbnRhaW4gdGhlIHNhbWUgdmFsdWVzXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkxIC0gYXJyYXkgMVxyXG4gICAgICogQHBhcmFtIGFycmF5MiAtIGFycmF5IDJcclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW5cclxuICAgICAqL1xyXG4gICAgY29tcGFyZUFycmF5KGFycmF5MTogQXJyYXk8c3RyaW5nPiwgYXJyYXkyOiBBcnJheTxzdHJpbmc+KTogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgZ2V0RGlyZWN0aW9uQXhpcztcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBBcmVhTGltaXRzIHtcclxuICAgIHRvcDogbnVtYmVyO1xyXG4gICAgYm90dG9tOiBudW1iZXI7XHJcbiAgICByaWdodDogbnVtYmVyO1xyXG4gICAgbGVmdDogbnVtYmVyO1xyXG59XHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgUm9sZXNBcnJheSA9IEFycmF5PERpcmVjdGlvbj47XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFBvc2l0aW9uQ2hhbmdlRGF0YSBpbXBsZW1lbnRzIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogWFlQb3NpdGlvbiwgcm9sZXM6IFJvbGVzQXJyYXkpO1xyXG59XHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgRGlyZWN0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc7XHJcbiJdfQ==