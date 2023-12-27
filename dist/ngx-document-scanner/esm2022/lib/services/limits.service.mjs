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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LimitsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
export class PositionChangeData {
    constructor(position, roles) {
        this.x = position.x;
        this.y = position.y;
        this.roles = roles;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZG9jdW1lbnQtc2Nhbm5lci9zcmMvbGliL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPckMsTUFBTSxPQUFPLGFBQWE7SUE4QnhCO1FBM0JRLG9CQUFlLEdBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RTs7V0FFRztRQUNLLFlBQU8sR0FBRztZQUNoQixHQUFHLEVBQUUsQ0FBQztZQUNOLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7UUFDRjs7V0FFRztRQUNLLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1FBTWpELGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ1YsY0FBUyxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuSSxvQkFBZSxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsRUFBRSxDQUFDLENBQUM7UUFDbkgsV0FBTSxHQUFnQyxJQUFJLGVBQWUsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEYsbUJBQWMsR0FBcUMsSUFBSSxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3JHLENBQUM7SUFFRDs7T0FFRztJQUNJLGlCQUFpQixDQUFDLFVBQTJCO1FBQ2xELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFP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O1lBQ1QsS0FBSyxFQUFFLEdBQUc7WUFDVixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxHQUFHO1NBQ1osQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNmLENBQUM7a0lBM1BVLGFBQWE7c0lBQWIsYUFBYSxjQUZaLE1BQU07OzRGQUVQLGFBQWE7a0JBSHpCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COztBQStRRCxNQUFNLE9BQU8sa0JBQWtCO0lBSzdCLFlBQVksUUFBb0IsRUFBRSxLQUFpQjtRQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0fSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtJbWFnZURpbWVuc2lvbnN9IGZyb20gJy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7TGltaXRFeGNlcHRpb24sIFhZUG9zaXRpb259IGZyb20gJy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTGltaXRzU2VydmljZSB7XHJcblxyXG5cclxuICBwcml2YXRlIGxpbWl0RGlyZWN0aW9uczogUm9sZXNBcnJheSA9IFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBjcm9wIGxpbWl0cyBsaW1pdHNcclxuICAgKi9cclxuICBwcml2YXRlIF9saW1pdHMgPSB7XHJcbiAgICB0b3A6IDAsXHJcbiAgICBib3R0b206IDAsXHJcbiAgICByaWdodDogMCxcclxuICAgIGxlZnQ6IDBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgYXJyYXkgb2YgdGhlIGRyYWdnYWJsZSBwb2ludHMgZGlzcGxheWVkIG9uIHRoZSBjcm9wIGFyZWFcclxuICAgKi9cclxuICBwcml2YXRlIF9wb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+ID0gW107XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBwYW5lIGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIF9wYW5lRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG5cclxuICAvLyAqKioqKioqKioqKiAvL1xyXG4gIC8vIE9ic2VydmFibGVzIC8vXHJcbiAgLy8gKioqKioqKioqKiogLy9cclxuICBwdWJsaWMgcG9zaXRpb25zOiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4oQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpKTtcclxuICBwdWJsaWMgcmVwb3NpdGlvbkV2ZW50OiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4oW10pO1xyXG4gIHB1YmxpYyBsaW1pdHM6IEJlaGF2aW9yU3ViamVjdDxBcmVhTGltaXRzPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXJlYUxpbWl0cz4odGhpcy5fbGltaXRzKTtcclxuICBwdWJsaWMgcGFuZURpbWVuc2lvbnM6IEJlaGF2aW9yU3ViamVjdDxJbWFnZURpbWVuc2lvbnM+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh7d2lkdGg6IDAsIGhlaWdodDogMH0pO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNldCBwcml2ZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHVibGljIHNldFBhbmVEaW1lbnNpb25zKGRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5fcGFuZURpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xyXG4gICAgICB0aGlzLnBhbmVEaW1lbnNpb25zLm5leHQoZGltZW5zaW9ucyk7XHJcbiAgICAgIHJlc29sdmUoZGltZW5zaW9ucyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlcG9zaXRpb25zIHBvaW50cyBleHRlcm5hbGx5XHJcbiAgICovXHJcbiAgcHVibGljIHJlcG9zaXRpb25Qb2ludHMocG9zaXRpb25zKSB7XHJcbiAgICB0aGlzLl9wb2ludHMgPSBwb3NpdGlvbnM7XHJcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3NpdGlvbiA9PiB7XHJcbiAgICAgIHRoaXMucG9zaXRpb25DaGFuZ2UocG9zaXRpb24pO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25FdmVudC5uZXh0KHBvc2l0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB1cGRhdGVzIGxpbWl0cyBhbmQgcG9pbnQgcG9zaXRpb25zIGFuZCBjYWxscyBuZXh0IG9uIHRoZSBvYnNlcnZhYmxlc1xyXG4gICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZURhdGEgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbkNoYW5nZURhdGE6IFBvaW50UG9zaXRpb25DaGFuZ2UpIHtcclxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbnMgYWNjb3JkaW5nIHRvIGN1cnJlbnQgcG9zaXRpb24gY2hhbmdlXHJcbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggZGlyZWN0aW9uOlxyXG4gICAgLy8gMS4gZmlsdGVyIHRoZSBfcG9pbnRzIHRoYXQgaGF2ZSBhIHJvbGUgYXMgdGhlIGRpcmVjdGlvbidzIGxpbWl0XHJcbiAgICAvLyAyLiBmb3IgdG9wIGFuZCBsZWZ0IGZpbmQgbWF4IHggfCB5IHZhbHVlcywgYW5kIG1pbiBmb3IgcmlnaHQgYW5kIGJvdHRvbVxyXG4gICAgdGhpcy5saW1pdERpcmVjdGlvbnMuZm9yRWFjaChkaXJlY3Rpb24gPT4ge1xyXG4gICAgICBjb25zdCByZWxldmFudFBvaW50cyA9IHRoaXMuX3BvaW50cy5maWx0ZXIocG9pbnQgPT4ge1xyXG4gICAgICAgIHJldHVybiBwb2ludC5yb2xlcy5pbmNsdWRlcyhkaXJlY3Rpb24pO1xyXG4gICAgICB9KVxyXG4gICAgICAubWFwKChwb2ludDogUG9pbnRQb3NpdGlvbkNoYW5nZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwb2ludFt0aGlzLmdldERpcmVjdGlvbkF4aXMoZGlyZWN0aW9uKV07XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgbGltaXQ7XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd0b3AnIHx8IGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgbGltaXQgPSBNYXRoLm1heCguLi5yZWxldmFudFBvaW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBkaXJlY3Rpb24gPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgbGltaXQgPSBNYXRoLm1pbiguLi5yZWxldmFudFBvaW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fbGltaXRzW2RpcmVjdGlvbl0gPSBsaW1pdDtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubGltaXRzLm5leHQodGhpcy5fbGltaXRzKTtcclxuICAgIHRoaXMucG9zaXRpb25zLm5leHQoQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludFxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZSAtIHBvc2l0aW9uIGNoYW5nZSBldmVudCBkYXRhXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlOiBQb2ludFBvc2l0aW9uQ2hhbmdlKSB7XHJcbiAgICAvLyBmaW5kcyB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYnkgaXQncyByb2xlcywgdGhhbiBzcGxpY2VzIGl0IGZvciB0aGUgbmV3IHBvc2l0aW9uIG9yIHB1c2hlcyBpdCBpZiBpdCdzIG5vdCB5ZXQgaW4gdGhlIGFycmF5XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX3BvaW50cy5maW5kSW5kZXgocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb21wYXJlQXJyYXkocG9zaXRpb25DaGFuZ2Uucm9sZXMsIHBvaW50LnJvbGVzKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICB0aGlzLl9wb2ludHMucHVzaChwb3NpdGlvbkNoYW5nZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9wb2ludHMuc3BsaWNlKGluZGV4LCAxLCBwb3NpdGlvbkNoYW5nZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVjayBpZiBhIHBvc2l0aW9uIGNoYW5nZSBldmVudCBleGNlZWRzIHRoZSBsaW1pdHNcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqIEByZXR1cm5zIExpbWl0RXhjZXB0aW9uMFxyXG4gICAqL1xyXG4gIHB1YmxpYyBleGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2U6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBMaW1pdEV4Y2VwdGlvbiB7XHJcbiAgICBjb25zdCBwb2ludExpbWl0cyA9IHRoaXMubGltaXREaXJlY3Rpb25zLmZpbHRlcihkaXJlY3Rpb24gPT4ge1xyXG4gICAgICByZXR1cm4gIXBvc2l0aW9uQ2hhbmdlLnJvbGVzLmluY2x1ZGVzKGRpcmVjdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbjogTGltaXRFeGNlcHRpb24gPSB7XHJcbiAgICAgIGV4Y2VlZHM6IGZhbHNlLFxyXG4gICAgICByZXNldENvZWZmaWNpZW50czoge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgICB9LFxyXG4gICAgICByZXNldENvb3JkaW5hdGVzOiB7XHJcbiAgICAgICAgeDogcG9zaXRpb25DaGFuZ2UueCxcclxuICAgICAgICB5OiBwb3NpdGlvbkNoYW5nZS55XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gbGltaXQgZGlyZWN0aW9ucyBhcmUgdGhlIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSBwb2ludCdzIHJvbGVzXHJcbiAgICBwb2ludExpbWl0cy5mb3JFYWNoKGRpcmVjdGlvbiA9PiB7XHJcbiAgICAgIGNvbnN0IGRpcmVjdGlvbkF4aXMgPSB0aGlzLmdldERpcmVjdGlvbkF4aXMoZGlyZWN0aW9uKTtcclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3RvcCcgfHwgZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICBpZiAocG9zaXRpb25DaGFuZ2VbZGlyZWN0aW9uQXhpc10gPCB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXSkge1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbZGlyZWN0aW9uQXhpc10gPSAxO1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1tkaXJlY3Rpb25BeGlzXSA9IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcgfHwgZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbkNoYW5nZVtkaXJlY3Rpb25BeGlzXSA+IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dKSB7XHJcbiAgICAgICAgICBsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50c1tkaXJlY3Rpb25BeGlzXSA9IC0xO1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1tkaXJlY3Rpb25BeGlzXSA9IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzLnggIT09IDAgfHwgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHMueSAhPT0gMCkge1xyXG4gICAgICBsaW1pdEV4Y2VwdGlvbi5leGNlZWRzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGltaXRFeGNlcHRpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBjbG9ja3dpc2VcclxuICAgKiBAcGFyYW0gcmVzaXplUmF0aW9zIC0gcmF0aW8gYmV0d2VlbiB0aGUgbmV3IGRpbWVuc2lvbnMgYW5kIHRoZSBwcmV2aW91c1xyXG4gICAqIEBwYXJhbSBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgLSBwcmV2aWV3IHBhbmUgZGltZW5zaW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKiBAcGFyYW0gaW5pdGlhbFBvc2l0aW9ucyAtIGN1cnJlbnQgcG9zaXRpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyByb3RhdGVDbG9ja3dpc2UocmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICAvLyBjb252ZXJ0IHBvc2l0aW9ucyB0byByYXRpbyBiZXR3ZWVuIHBvc2l0aW9uIHRvIGluaXRpYWwgcGFuZSBkaW1lbnNpb25cclxuICAgIGluaXRpYWxQb3NpdGlvbnMgPSBpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHtcclxuICAgICAgICB4OiBwb2ludC54IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgIHk6IHBvaW50LnkgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0LFxyXG4gICAgICB9LCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVwb3NpdGlvblBvaW50cyhpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUNvcm5lckNsb2Nrd2lzZShwb2ludCk7XHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBhbnRpLWNsb2Nrd2lzZVxyXG4gICAqIEBwYXJhbSByZXNpemVSYXRpb3MgLSByYXRpbyBiZXR3ZWVuIHRoZSBuZXcgZGltZW5zaW9ucyBhbmQgdGhlIHByZXZpb3VzXHJcbiAgICogQHBhcmFtIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyAtIHByZXZpZXcgcGFuZSBkaW1lbnNpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqIEBwYXJhbSBpbml0aWFsUG9zaXRpb25zIC0gY3VycmVudCBwb3NpdGlvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIHJvdGF0ZUFudGlDbG9ja3dpc2UocmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICAvLyBjb252ZXJ0IHBvc2l0aW9ucyB0byByYXRpbyBiZXR3ZWVuIHBvc2l0aW9uIHRvIGluaXRpYWwgcGFuZSBkaW1lbnNpb25cclxuICAgIGluaXRpYWxQb3NpdGlvbnMgPSBpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHtcclxuICAgICAgICB4OiBwb2ludC54IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgIHk6IHBvaW50LnkgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0LFxyXG4gICAgICB9LCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVwb3NpdGlvblBvaW50cyhpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUNvcm5lckFudGlDbG9ja3dpc2UocG9pbnQpO1xyXG4gICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgY2xvY2t3aXNlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByb3RhdGVDb3JuZXJDbG9ja3dpc2UoY29ybmVyOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBjb25zdCByb3RhdGVkOiBQb2ludFBvc2l0aW9uQ2hhbmdlID0ge1xyXG4gICAgICB4OiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCAqICgxIC0gY29ybmVyLnkpLFxyXG4gICAgICB5OiB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgKiBjb3JuZXIueCxcclxuICAgICAgcm9sZXM6IFtdXHJcbiAgICB9O1xyXG4gICAgLy8gcm90YXRlcyBjb3JuZXIgYWNjb3JkaW5nIHRvIG9yZGVyXHJcbiAgICBjb25zdCBvcmRlcjogQXJyYXk8Um9sZXNBcnJheT4gPSBbXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXSxcclxuICAgICAgWyd0b3AnLCAnbGVmdCddLFxyXG4gICAgICBbJ3RvcCcsICdyaWdodCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdyaWdodCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J11cclxuICAgIF07XHJcbiAgICByb3RhdGVkLnJvbGVzID0gb3JkZXJbb3JkZXIuZmluZEluZGV4KHJvbGVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHJvbGVzLCBjb3JuZXIucm9sZXMpO1xyXG4gICAgfSkgKyAxXTtcclxuICAgIHJldHVybiByb3RhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgYW50aS1jbG9ja3dpc2Ugcm90YXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIHJvdGF0ZUNvcm5lckFudGlDbG9ja3dpc2UoY29ybmVyOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBjb25zdCByb3RhdGVkOiBQb2ludFBvc2l0aW9uQ2hhbmdlID0ge1xyXG4gICAgICB4OiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCAqIGNvcm5lci55LFxyXG4gICAgICB5OiB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgKiAoMSAtIGNvcm5lci54KSxcclxuICAgICAgcm9sZXM6IFtdXHJcbiAgICB9O1xyXG4gICAgLy8gcm90YXRlcyBjb3JuZXIgYWNjb3JkaW5nIHRvIG9yZGVyXHJcbiAgICBjb25zdCBvcmRlcjogQXJyYXk8Um9sZXNBcnJheT4gPSBbXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXSxcclxuICAgICAgWydib3R0b20nLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAnbGVmdCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J11cclxuICAgIF07XHJcbiAgICByb3RhdGVkLnJvbGVzID0gb3JkZXJbb3JkZXIuZmluZEluZGV4KHJvbGVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHJvbGVzLCBjb3JuZXIucm9sZXMpO1xyXG4gICAgfSkgKyAxXTtcclxuICAgIHJldHVybiByb3RhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2tzIGlmIHR3byBhcnJheSBjb250YWluIHRoZSBzYW1lIHZhbHVlc1xyXG4gICAqIEBwYXJhbSBhcnJheTEgLSBhcnJheSAxXHJcbiAgICogQHBhcmFtIGFycmF5MiAtIGFycmF5IDJcclxuICAgKiBAcmV0dXJucyBib29sZWFuXHJcbiAgICovXHJcbiAgcHVibGljIGNvbXBhcmVBcnJheShhcnJheTE6IEFycmF5PHN0cmluZz4sIGFycmF5MjogQXJyYXk8c3RyaW5nPik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGFycmF5MS5ldmVyeSgoZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gYXJyYXkyLmluY2x1ZGVzKGVsZW1lbnQpO1xyXG4gICAgfSkgJiYgYXJyYXkxLmxlbmd0aCA9PT0gYXJyYXkyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGlyZWN0aW9uQXhpcyhkaXJlY3Rpb24pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxlZnQ6ICd4JyxcclxuICAgICAgcmlnaHQ6ICd4JyxcclxuICAgICAgdG9wOiAneScsXHJcbiAgICAgIGJvdHRvbTogJ3knXHJcbiAgICB9W2RpcmVjdGlvbl07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHJvbGVzOiBSb2xlc0FycmF5O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFyZWFMaW1pdHMge1xyXG4gIHRvcDogbnVtYmVyO1xyXG4gIGJvdHRvbTogbnVtYmVyO1xyXG4gIHJpZ2h0OiBudW1iZXI7XHJcbiAgbGVmdDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBSb2xlc0FycmF5ID0gQXJyYXk8RGlyZWN0aW9uPjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3NpdGlvbkNoYW5nZURhdGEgaW1wbGVtZW50cyBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHJvbGVzOiBSb2xlc0FycmF5O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogWFlQb3NpdGlvbiwgcm9sZXM6IFJvbGVzQXJyYXkpIHtcclxuICAgIHRoaXMueCA9IHBvc2l0aW9uLng7XHJcbiAgICB0aGlzLnkgPSBwb3NpdGlvbi55O1xyXG4gICAgdGhpcy5yb2xlcyA9IHJvbGVzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRGlyZWN0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc7XHJcbiJdfQ==