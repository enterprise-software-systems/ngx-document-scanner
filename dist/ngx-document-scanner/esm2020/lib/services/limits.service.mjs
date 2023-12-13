import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class LimitsService {
    constructor() {
        this.limitDirections = ['left', 'right', 'top', 'bottom'];
        /**
         * stores the crop limits limits
         */
        this._limits = {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        };
        /**
         * stores the array of the draggable points displayed on the crop area
         */
        this._points = [];
        // *********** //
        // Observables //
        // *********** //
        this.positions = new BehaviorSubject(Array.from(this._points));
        this.repositionEvent = new BehaviorSubject([]);
        this.limits = new BehaviorSubject(this._limits);
        this.paneDimensions = new BehaviorSubject({ width: 0, height: 0 });
    }
    /**
     * set privew pane dimensions
     */
    setPaneDimensions(dimensions) {
        return new Promise((resolve, reject) => {
            this._paneDimensions = dimensions;
            this.paneDimensions.next(dimensions);
            resolve(dimensions);
        });
    }
    /**
     * repositions points externally
     */
    repositionPoints(positions) {
        this._points = positions;
        positions.forEach(position => {
            this.positionChange(position);
        });
        this.repositionEvent.next(positions);
    }
    /**
     * updates limits and point positions and calls next on the observables
     * @param positionChangeData - position change event data
     */
    positionChange(positionChangeData) {
        // update positions according to current position change
        this.updatePosition(positionChangeData);
        // for each direction:
        // 1. filter the _points that have a role as the direction's limit
        // 2. for top and left find max x | y values, and min for right and bottom
        this.limitDirections.forEach(direction => {
            const relevantPoints = this._points.filter(point => {
                return point.roles.includes(direction);
            })
                .map((point) => {
                return point[this.getDirectionAxis(direction)];
            });
            let limit;
            if (direction === 'top' || direction === 'left') {
                limit = Math.max(...relevantPoints);
            }
            if (direction === 'right' || direction === 'bottom') {
                limit = Math.min(...relevantPoints);
            }
            this._limits[direction] = limit;
        });
        this.limits.next(this._limits);
        this.positions.next(Array.from(this._points));
    }
    /**
     * updates the position of the point
     * @param positionChange - position change event data
     */
    updatePosition(positionChange) {
        // finds the current position of the point by it's roles, than splices it for the new position or pushes it if it's not yet in the array
        const index = this._points.findIndex(point => {
            return this.compareArray(positionChange.roles, point.roles);
        });
        if (index === -1) {
            this._points.push(positionChange);
        }
        else {
            this._points.splice(index, 1, positionChange);
        }
    }
    /**
     * check if a position change event exceeds the limits
     * @param positionChange - position change event data
     * @returns LimitException0
     */
    exceedsLimit(positionChange) {
        const pointLimits = this.limitDirections.filter(direction => {
            return !positionChange.roles.includes(direction);
        });
        const limitException = {
            exceeds: false,
            resetCoefficients: {
                x: 0,
                y: 0
            },
            resetCoordinates: {
                x: positionChange.x,
                y: positionChange.y
            }
        };
        // limit directions are the opposite sides of the point's roles
        pointLimits.forEach(direction => {
            const directionAxis = this.getDirectionAxis(direction);
            if (direction === 'top' || direction === 'left') {
                if (positionChange[directionAxis] < this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = 1;
                    limitException.resetCoordinates[directionAxis] = this._limits[direction];
                }
            }
            else if (direction === 'right' || direction === 'bottom') {
                if (positionChange[directionAxis] > this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = -1;
                    limitException.resetCoordinates[directionAxis] = this._limits[direction];
                }
            }
        });
        if (limitException.resetCoefficients.x !== 0 || limitException.resetCoefficients.y !== 0) {
            limitException.exceeds = true;
        }
        return limitException;
    }
    /**
     * rotate crop tool points clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map(point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        });
        this.repositionPoints(initialPositions.map(point => {
            return this.rotateCornerClockwise(point);
        }));
    }
    /**
     * rotate crop tool points anti-clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    rotateAntiClockwise(resizeRatios, initialPreviewDimensions, initialPositions) {
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map(point => {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        });
        this.repositionPoints(initialPositions.map(point => {
            return this.rotateCornerAntiClockwise(point);
        }));
    }
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     */
    rotateCornerClockwise(corner) {
        const rotated = {
            x: this._paneDimensions.width * (1 - corner.y),
            y: this._paneDimensions.height * corner.x,
            roles: []
        };
        // rotates corner according to order
        const order = [
            ['bottom', 'left'],
            ['top', 'left'],
            ['top', 'right'],
            ['bottom', 'right'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex(roles => {
            return this.compareArray(roles, corner.roles);
        }) + 1];
        return rotated;
    }
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     */
    rotateCornerAntiClockwise(corner) {
        const rotated = {
            x: this._paneDimensions.width * corner.y,
            y: this._paneDimensions.height * (1 - corner.x),
            roles: []
        };
        // rotates corner according to order
        const order = [
            ['bottom', 'left'],
            ['bottom', 'right'],
            ['top', 'right'],
            ['top', 'left'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex(roles => {
            return this.compareArray(roles, corner.roles);
        }) + 1];
        return rotated;
    }
    /**
     * checks if two array contain the same values
     * @param array1 - array 1
     * @param array2 - array 2
     * @returns boolean
     */
    compareArray(array1, array2) {
        return array1.every((element) => {
            return array2.includes(element);
        }) && array1.length === array2.length;
    }
    getDirectionAxis(direction) {
        return {
            left: 'x',
            right: 'x',
            top: 'y',
            bottom: 'y'
        }[direction];
    }
}
/** @nocollapse */ LimitsService.ɵfac = function LimitsService_Factory(t) { return new (t || LimitsService)(); };
/** @nocollapse */ LimitsService.ɵprov = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjectable({ token: LimitsService, factory: LimitsService.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LimitsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
export class PositionChangeData {
    constructor(position, roles) {
        this.x = position.x;
        this.y = position.y;
        this.roles = roles;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZG9jdW1lbnQtc2Nhbm5lci9zcmMvbGliL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPckMsTUFBTSxPQUFPLGFBQWE7SUE4QnhCO1FBM0JRLG9CQUFlLEdBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RTs7V0FFRztRQUNLLFlBQU8sR0FBRztZQUNoQixHQUFHLEVBQUUsQ0FBQztZQUNOLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7UUFDRjs7V0FFRztRQUNLLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1FBTWpELGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ1YsY0FBUyxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuSSxvQkFBZSxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsRUFBRSxDQUFDLENBQUM7UUFDbkgsV0FBTSxHQUFnQyxJQUFJLGVBQWUsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEYsbUJBQWMsR0FBcUMsSUFBSSxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3JHLENBQUM7SUFFRDs7T0FFRztJQUNJLGlCQUFpQixDQUFDLFVBQTJCO1FBQ2xELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFP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O1lBQ1QsS0FBSyxFQUFFLEdBQUc7WUFDVixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxHQUFHO1NBQ1osQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNmLENBQUM7OzZGQTNQVSxhQUFhO2tHQUFiLGFBQWEsV0FBYixhQUFhLG1CQUZaLE1BQU07dUZBRVAsYUFBYTtjQUh6QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O0FBK1FELE1BQU0sT0FBTyxrQkFBa0I7SUFLN0IsWUFBWSxRQUFvQixFQUFFLEtBQWlCO1FBQ2pELElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbn0gZnJvbSAnLi4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaW1pdHNTZXJ2aWNlIHtcclxuXHJcblxyXG4gIHByaXZhdGUgbGltaXREaXJlY3Rpb25zOiBSb2xlc0FycmF5ID0gWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIGNyb3AgbGltaXRzIGxpbWl0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX2xpbWl0cyA9IHtcclxuICAgIHRvcDogMCxcclxuICAgIGJvdHRvbTogMCxcclxuICAgIHJpZ2h0OiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBhcnJheSBvZiB0aGUgZHJhZ2dhYmxlIHBvaW50cyBkaXNwbGF5ZWQgb24gdGhlIGNyb3AgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4gPSBbXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHBhbmUgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcblxyXG4gIC8vICoqKioqKioqKioqIC8vXHJcbiAgLy8gT2JzZXJ2YWJsZXMgLy9cclxuICAvLyAqKioqKioqKioqKiAvL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihBcnJheS5mcm9tKHRoaXMuX3BvaW50cykpO1xyXG4gIHB1YmxpYyByZXBvc2l0aW9uRXZlbnQ6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihbXSk7XHJcbiAgcHVibGljIGxpbWl0czogQmVoYXZpb3JTdWJqZWN0PEFyZWFMaW1pdHM+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcmVhTGltaXRzPih0aGlzLl9saW1pdHMpO1xyXG4gIHB1YmxpYyBwYW5lRGltZW5zaW9uczogQmVoYXZpb3JTdWJqZWN0PEltYWdlRGltZW5zaW9ucz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHt3aWR0aDogMCwgaGVpZ2h0OiAwfSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0IHByaXZldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwdWJsaWMgc2V0UGFuZURpbWVuc2lvbnMoZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLl9wYW5lRGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XHJcbiAgICAgIHRoaXMucGFuZURpbWVuc2lvbnMubmV4dChkaW1lbnNpb25zKTtcclxuICAgICAgcmVzb2x2ZShkaW1lbnNpb25zKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVwb3NpdGlvbnMgcG9pbnRzIGV4dGVybmFsbHlcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3NpdGlvblBvaW50cyhwb3NpdGlvbnMpIHtcclxuICAgIHRoaXMuX3BvaW50cyA9IHBvc2l0aW9ucztcclxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcclxuICAgICAgdGhpcy5wb3NpdGlvbkNoYW5nZShwb3NpdGlvbik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVwb3NpdGlvbkV2ZW50Lm5leHQocG9zaXRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHVwZGF0ZXMgbGltaXRzIGFuZCBwb2ludCBwb3NpdGlvbnMgYW5kIGNhbGxzIG5leHQgb24gdGhlIG9ic2VydmFibGVzXHJcbiAgICogQHBhcmFtIHBvc2l0aW9uQ2hhbmdlRGF0YSAtIHBvc2l0aW9uIGNoYW5nZSBldmVudCBkYXRhXHJcbiAgICovXHJcbiAgcHVibGljIHBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uQ2hhbmdlRGF0YTogUG9pbnRQb3NpdGlvbkNoYW5nZSkge1xyXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9ucyBhY2NvcmRpbmcgdG8gY3VycmVudCBwb3NpdGlvbiBjaGFuZ2VcclxuICAgIHRoaXMudXBkYXRlUG9zaXRpb24ocG9zaXRpb25DaGFuZ2VEYXRhKTtcclxuXHJcbiAgICAvLyBmb3IgZWFjaCBkaXJlY3Rpb246XHJcbiAgICAvLyAxLiBmaWx0ZXIgdGhlIF9wb2ludHMgdGhhdCBoYXZlIGEgcm9sZSBhcyB0aGUgZGlyZWN0aW9uJ3MgbGltaXRcclxuICAgIC8vIDIuIGZvciB0b3AgYW5kIGxlZnQgZmluZCBtYXggeCB8IHkgdmFsdWVzLCBhbmQgbWluIGZvciByaWdodCBhbmQgYm90dG9tXHJcbiAgICB0aGlzLmxpbWl0RGlyZWN0aW9ucy5mb3JFYWNoKGRpcmVjdGlvbiA9PiB7XHJcbiAgICAgIGNvbnN0IHJlbGV2YW50UG9pbnRzID0gdGhpcy5fcG9pbnRzLmZpbHRlcihwb2ludCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBvaW50LnJvbGVzLmluY2x1ZGVzKGRpcmVjdGlvbik7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5tYXAoKHBvaW50OiBQb2ludFBvc2l0aW9uQ2hhbmdlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBvaW50W3RoaXMuZ2V0RGlyZWN0aW9uQXhpcyhkaXJlY3Rpb24pXTtcclxuICAgICAgfSk7XHJcbiAgICAgIGxldCBsaW1pdDtcclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3RvcCcgfHwgZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICBsaW1pdCA9IE1hdGgubWF4KC4uLnJlbGV2YW50UG9pbnRzKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnIHx8IGRpcmVjdGlvbiA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICBsaW1pdCA9IE1hdGgubWluKC4uLnJlbGV2YW50UG9pbnRzKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXSA9IGxpbWl0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5saW1pdHMubmV4dCh0aGlzLl9saW1pdHMpO1xyXG4gICAgdGhpcy5wb3NpdGlvbnMubmV4dChBcnJheS5mcm9tKHRoaXMuX3BvaW50cykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIHBvaW50XHJcbiAgICogQHBhcmFtIHBvc2l0aW9uQ2hhbmdlIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlUG9zaXRpb24ocG9zaXRpb25DaGFuZ2U6IFBvaW50UG9zaXRpb25DaGFuZ2UpIHtcclxuICAgIC8vIGZpbmRzIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludCBieSBpdCdzIHJvbGVzLCB0aGFuIHNwbGljZXMgaXQgZm9yIHRoZSBuZXcgcG9zaXRpb24gb3IgcHVzaGVzIGl0IGlmIGl0J3Mgbm90IHlldCBpbiB0aGUgYXJyYXlcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fcG9pbnRzLmZpbmRJbmRleChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVBcnJheShwb3NpdGlvbkNoYW5nZS5yb2xlcywgcG9pbnQucm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgIHRoaXMuX3BvaW50cy5wdXNoKHBvc2l0aW9uQ2hhbmdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3BvaW50cy5zcGxpY2UoaW5kZXgsIDEsIHBvc2l0aW9uQ2hhbmdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrIGlmIGEgcG9zaXRpb24gY2hhbmdlIGV2ZW50IGV4Y2VlZHMgdGhlIGxpbWl0c1xyXG4gICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZSAtIHBvc2l0aW9uIGNoYW5nZSBldmVudCBkYXRhXHJcbiAgICogQHJldHVybnMgTGltaXRFeGNlcHRpb24wXHJcbiAgICovXHJcbiAgcHVibGljIGV4Y2VlZHNMaW1pdChwb3NpdGlvbkNoYW5nZTogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IExpbWl0RXhjZXB0aW9uIHtcclxuICAgIGNvbnN0IHBvaW50TGltaXRzID0gdGhpcy5saW1pdERpcmVjdGlvbnMuZmlsdGVyKGRpcmVjdGlvbiA9PiB7XHJcbiAgICAgIHJldHVybiAhcG9zaXRpb25DaGFuZ2Uucm9sZXMuaW5jbHVkZXMoZGlyZWN0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGxpbWl0RXhjZXB0aW9uOiBMaW1pdEV4Y2VwdGlvbiA9IHtcclxuICAgICAgZXhjZWVkczogZmFsc2UsXHJcbiAgICAgIHJlc2V0Q29lZmZpY2llbnRzOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlc2V0Q29vcmRpbmF0ZXM6IHtcclxuICAgICAgICB4OiBwb3NpdGlvbkNoYW5nZS54LFxyXG4gICAgICAgIHk6IHBvc2l0aW9uQ2hhbmdlLnlcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBsaW1pdCBkaXJlY3Rpb25zIGFyZSB0aGUgb3Bwb3NpdGUgc2lkZXMgb2YgdGhlIHBvaW50J3Mgcm9sZXNcclxuICAgIHBvaW50TGltaXRzLmZvckVhY2goZGlyZWN0aW9uID0+IHtcclxuICAgICAgY29uc3QgZGlyZWN0aW9uQXhpcyA9IHRoaXMuZ2V0RGlyZWN0aW9uQXhpcyhkaXJlY3Rpb24pO1xyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndG9wJyB8fCBkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbkNoYW5nZVtkaXJlY3Rpb25BeGlzXSA8IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dKSB7XHJcbiAgICAgICAgICBsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50c1tkaXJlY3Rpb25BeGlzXSA9IDE7XHJcbiAgICAgICAgICBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzW2RpcmVjdGlvbkF4aXNdID0gdGhpcy5fbGltaXRzW2RpcmVjdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBkaXJlY3Rpb24gPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uQ2hhbmdlW2RpcmVjdGlvbkF4aXNdID4gdGhpcy5fbGltaXRzW2RpcmVjdGlvbl0pIHtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2RpcmVjdGlvbkF4aXNdID0gLTE7XHJcbiAgICAgICAgICBsaW1pdEV4Y2VwdGlvbi5yZXNldENvb3JkaW5hdGVzW2RpcmVjdGlvbkF4aXNdID0gdGhpcy5fbGltaXRzW2RpcmVjdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHMueCAhPT0gMCB8fCBsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50cy55ICE9PSAwKSB7XHJcbiAgICAgIGxpbWl0RXhjZXB0aW9uLmV4Y2VlZHMgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsaW1pdEV4Y2VwdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJvdGF0ZSBjcm9wIHRvb2wgcG9pbnRzIGNsb2Nrd2lzZVxyXG4gICAqIEBwYXJhbSByZXNpemVSYXRpb3MgLSByYXRpbyBiZXR3ZWVuIHRoZSBuZXcgZGltZW5zaW9ucyBhbmQgdGhlIHByZXZpb3VzXHJcbiAgICogQHBhcmFtIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyAtIHByZXZpZXcgcGFuZSBkaW1lbnNpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqIEBwYXJhbSBpbml0aWFsUG9zaXRpb25zIC0gY3VycmVudCBwb3NpdGlvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIHJvdGF0ZUNsb2Nrd2lzZShyZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9uczogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4pIHtcclxuICAgIC8vIGNvbnZlcnQgcG9zaXRpb25zIHRvIHJhdGlvIGJldHdlZW4gcG9zaXRpb24gdG8gaW5pdGlhbCBwYW5lIGRpbWVuc2lvblxyXG4gICAgaW5pdGlhbFBvc2l0aW9ucyA9IGluaXRpYWxQb3NpdGlvbnMubWFwKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe1xyXG4gICAgICAgIHg6IHBvaW50LnggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgICAgeTogcG9pbnQueSAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQsXHJcbiAgICAgIH0sIHBvaW50LnJvbGVzKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXBvc2l0aW9uUG9pbnRzKGluaXRpYWxQb3NpdGlvbnMubWFwKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMucm90YXRlQ29ybmVyQ2xvY2t3aXNlKHBvaW50KTtcclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJvdGF0ZSBjcm9wIHRvb2wgcG9pbnRzIGFudGktY2xvY2t3aXNlXHJcbiAgICogQHBhcmFtIHJlc2l6ZVJhdGlvcyAtIHJhdGlvIGJldHdlZW4gdGhlIG5ldyBkaW1lbnNpb25zIGFuZCB0aGUgcHJldmlvdXNcclxuICAgKiBAcGFyYW0gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zIC0gcHJldmlldyBwYW5lIGRpbWVuc2lvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICogQHBhcmFtIGluaXRpYWxQb3NpdGlvbnMgLSBjdXJyZW50IHBvc2l0aW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgcm90YXRlQW50aUNsb2Nrd2lzZShyZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9uczogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4pIHtcclxuICAgIC8vIGNvbnZlcnQgcG9zaXRpb25zIHRvIHJhdGlvIGJldHdlZW4gcG9zaXRpb24gdG8gaW5pdGlhbCBwYW5lIGRpbWVuc2lvblxyXG4gICAgaW5pdGlhbFBvc2l0aW9ucyA9IGluaXRpYWxQb3NpdGlvbnMubWFwKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe1xyXG4gICAgICAgIHg6IHBvaW50LnggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgICAgeTogcG9pbnQueSAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQsXHJcbiAgICAgIH0sIHBvaW50LnJvbGVzKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXBvc2l0aW9uUG9pbnRzKGluaXRpYWxQb3NpdGlvbnMubWFwKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMucm90YXRlQ29ybmVyQW50aUNsb2Nrd2lzZShwb2ludCk7XHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIHRoZSBjb3JuZXIgcG9zaXRpb25zIGFmdGVyIGEgOTAgZGVncmVlcyBjbG9ja3dpc2Ugcm90YXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIHJvdGF0ZUNvcm5lckNsb2Nrd2lzZShjb3JuZXI6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIGNvbnN0IHJvdGF0ZWQ6IFBvaW50UG9zaXRpb25DaGFuZ2UgPSB7XHJcbiAgICAgIHg6IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoICogKDEgLSBjb3JuZXIueSksXHJcbiAgICAgIHk6IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCAqIGNvcm5lci54LFxyXG4gICAgICByb2xlczogW11cclxuICAgIH07XHJcbiAgICAvLyByb3RhdGVzIGNvcm5lciBhY2NvcmRpbmcgdG8gb3JkZXJcclxuICAgIGNvbnN0IG9yZGVyOiBBcnJheTxSb2xlc0FycmF5PiA9IFtcclxuICAgICAgWydib3R0b20nLCAnbGVmdCddLFxyXG4gICAgICBbJ3RvcCcsICdsZWZ0J10sXHJcbiAgICAgIFsndG9wJywgJ3JpZ2h0J10sXHJcbiAgICAgIFsnYm90dG9tJywgJ3JpZ2h0J10sXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXVxyXG4gICAgXTtcclxuICAgIHJvdGF0ZWQucm9sZXMgPSBvcmRlcltvcmRlci5maW5kSW5kZXgocm9sZXMgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb21wYXJlQXJyYXkocm9sZXMsIGNvcm5lci5yb2xlcyk7XHJcbiAgICB9KSArIDFdO1xyXG4gICAgcmV0dXJuIHJvdGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIHRoZSBjb3JuZXIgcG9zaXRpb25zIGFmdGVyIGEgOTAgZGVncmVlcyBhbnRpLWNsb2Nrd2lzZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgcm90YXRlQ29ybmVyQW50aUNsb2Nrd2lzZShjb3JuZXI6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICAgIGNvbnN0IHJvdGF0ZWQ6IFBvaW50UG9zaXRpb25DaGFuZ2UgPSB7XHJcbiAgICAgIHg6IHRoaXMuX3BhbmVEaW1lbnNpb25zLndpZHRoICogY29ybmVyLnksXHJcbiAgICAgIHk6IHRoaXMuX3BhbmVEaW1lbnNpb25zLmhlaWdodCAqICgxIC0gY29ybmVyLngpLFxyXG4gICAgICByb2xlczogW11cclxuICAgIH07XHJcbiAgICAvLyByb3RhdGVzIGNvcm5lciBhY2NvcmRpbmcgdG8gb3JkZXJcclxuICAgIGNvbnN0IG9yZGVyOiBBcnJheTxSb2xlc0FycmF5PiA9IFtcclxuICAgICAgWydib3R0b20nLCAnbGVmdCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdyaWdodCddLFxyXG4gICAgICBbJ3RvcCcsICdyaWdodCddLFxyXG4gICAgICBbJ3RvcCcsICdsZWZ0J10sXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXVxyXG4gICAgXTtcclxuICAgIHJvdGF0ZWQucm9sZXMgPSBvcmRlcltvcmRlci5maW5kSW5kZXgocm9sZXMgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb21wYXJlQXJyYXkocm9sZXMsIGNvcm5lci5yb2xlcyk7XHJcbiAgICB9KSArIDFdO1xyXG4gICAgcmV0dXJuIHJvdGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVja3MgaWYgdHdvIGFycmF5IGNvbnRhaW4gdGhlIHNhbWUgdmFsdWVzXHJcbiAgICogQHBhcmFtIGFycmF5MSAtIGFycmF5IDFcclxuICAgKiBAcGFyYW0gYXJyYXkyIC0gYXJyYXkgMlxyXG4gICAqIEByZXR1cm5zIGJvb2xlYW5cclxuICAgKi9cclxuICBwdWJsaWMgY29tcGFyZUFycmF5KGFycmF5MTogQXJyYXk8c3RyaW5nPiwgYXJyYXkyOiBBcnJheTxzdHJpbmc+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gYXJyYXkxLmV2ZXJ5KChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiBhcnJheTIuaW5jbHVkZXMoZWxlbWVudCk7XHJcbiAgICB9KSAmJiBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGVmdDogJ3gnLFxyXG4gICAgICByaWdodDogJ3gnLFxyXG4gICAgICB0b3A6ICd5JyxcclxuICAgICAgYm90dG9tOiAneSdcclxuICAgIH1bZGlyZWN0aW9uXTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbiAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJlYUxpbWl0cyB7XHJcbiAgdG9wOiBudW1iZXI7XHJcbiAgYm90dG9tOiBudW1iZXI7XHJcbiAgcmlnaHQ6IG51bWJlcjtcclxuICBsZWZ0OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJvbGVzQXJyYXkgPSBBcnJheTxEaXJlY3Rpb24+O1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uQ2hhbmdlRGF0YSBpbXBsZW1lbnRzIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbiAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBYWVBvc2l0aW9uLCByb2xlczogUm9sZXNBcnJheSkge1xyXG4gICAgdGhpcy54ID0gcG9zaXRpb24ueDtcclxuICAgIHRoaXMueSA9IHBvc2l0aW9uLnk7XHJcbiAgICB0aGlzLnJvbGVzID0gcm9sZXM7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEaXJlY3Rpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ3RvcCcgfCAnYm90dG9tJztcclxuIl19