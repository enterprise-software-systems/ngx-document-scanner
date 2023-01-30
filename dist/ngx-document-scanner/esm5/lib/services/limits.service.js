/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/limits.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __read, __spread } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
var LimitsService = /** @class */ (function () {
    function LimitsService() {
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
    /**
     * set privew pane dimensions
     * @param {?} dimensions
     * @return {?}
     */
    LimitsService.prototype.setPaneDimensions = /**
     * set privew pane dimensions
     * @param {?} dimensions
     * @return {?}
     */
    function (dimensions) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this._paneDimensions = dimensions;
            _this.paneDimensions.next(dimensions);
            resolve();
        }));
    };
    /**
     * repositions points externally
     */
    /**
     * repositions points externally
     * @param {?} positions
     * @return {?}
     */
    LimitsService.prototype.repositionPoints = /**
     * repositions points externally
     * @param {?} positions
     * @return {?}
     */
    function (positions) {
        var _this = this;
        this._points = positions;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            _this.positionChange(position);
        }));
        this.repositionEvent.next(positions);
    };
    /**
     * updates limits and point positions and calls next on the observables
     * @param positionChangeData - position change event data
     */
    /**
     * updates limits and point positions and calls next on the observables
     * @param {?} positionChangeData - position change event data
     * @return {?}
     */
    LimitsService.prototype.positionChange = /**
     * updates limits and point positions and calls next on the observables
     * @param {?} positionChangeData - position change event data
     * @return {?}
     */
    function (positionChangeData) {
        var _this = this;
        // update positions according to current position change
        this.updatePosition(positionChangeData);
        // for each direction:
        // 1. filter the _points that have a role as the direction's limit
        // 2. for top and left find max x | y values, and min for right and bottom
        this.limitDirections.forEach((/**
         * @param {?} direction
         * @return {?}
         */
        function (direction) {
            /** @type {?} */
            var relevantPoints = _this._points.filter((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                return point.roles.includes(direction);
            }))
                .map((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                return point[_this.getDirectionAxis(direction)];
            }));
            /** @type {?} */
            var limit;
            if (direction === 'top' || direction === 'left') {
                limit = Math.max.apply(Math, __spread(relevantPoints));
            }
            if (direction === 'right' || direction === 'bottom') {
                limit = Math.min.apply(Math, __spread(relevantPoints));
            }
            _this._limits[direction] = limit;
        }));
        this.limits.next(this._limits);
        this.positions.next(Array.from(this._points));
    };
    /**
     * updates the position of the point
     * @param positionChange - position change event data
     */
    /**
     * updates the position of the point
     * @param {?} positionChange - position change event data
     * @return {?}
     */
    LimitsService.prototype.updatePosition = /**
     * updates the position of the point
     * @param {?} positionChange - position change event data
     * @return {?}
     */
    function (positionChange) {
        var _this = this;
        // finds the current position of the point by it's roles, than splices it for the new position or pushes it if it's not yet in the array
        /** @type {?} */
        var index = this._points.findIndex((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return _this.compareArray(positionChange.roles, point.roles);
        }));
        if (index === -1) {
            this._points.push(positionChange);
        }
        else {
            this._points.splice(index, 1, positionChange);
        }
    };
    /**
     * check if a position change event exceeds the limits
     * @param positionChange - position change event data
     * @returns LimitException0
     */
    /**
     * check if a position change event exceeds the limits
     * @param {?} positionChange - position change event data
     * @return {?} LimitException0
     */
    LimitsService.prototype.exceedsLimit = /**
     * check if a position change event exceeds the limits
     * @param {?} positionChange - position change event data
     * @return {?} LimitException0
     */
    function (positionChange) {
        var _this = this;
        /** @type {?} */
        var pointLimits = this.limitDirections.filter((/**
         * @param {?} direction
         * @return {?}
         */
        function (direction) {
            return !positionChange.roles.includes(direction);
        }));
        /** @type {?} */
        var limitException = {
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
        pointLimits.forEach((/**
         * @param {?} direction
         * @return {?}
         */
        function (direction) {
            /** @type {?} */
            var directionAxis = _this.getDirectionAxis(direction);
            if (direction === 'top' || direction === 'left') {
                if (positionChange[directionAxis] < _this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = 1;
                    limitException.resetCoordinates[directionAxis] = _this._limits[direction];
                }
            }
            else if (direction === 'right' || direction === 'bottom') {
                if (positionChange[directionAxis] > _this._limits[direction]) {
                    limitException.resetCoefficients[directionAxis] = -1;
                    limitException.resetCoordinates[directionAxis] = _this._limits[direction];
                }
            }
        }));
        if (limitException.resetCoefficients.x !== 0 || limitException.resetCoefficients.y !== 0) {
            limitException.exceeds = true;
        }
        return limitException;
    };
    /**
     * rotate crop tool points clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    /**
     * rotate crop tool points clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    LimitsService.prototype.rotateClockwise = /**
     * rotate crop tool points clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    function (resizeRatios, initialPreviewDimensions, initialPositions) {
        var _this = this;
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        }));
        this.repositionPoints(initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return _this.rotateCornerClockwise(point);
        })));
    };
    /**
     * rotate crop tool points anti-clockwise
     * @param resizeRatios - ratio between the new dimensions and the previous
     * @param initialPreviewDimensions - preview pane dimensions before rotation
     * @param initialPositions - current positions before rotation
     */
    /**
     * rotate crop tool points anti-clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    LimitsService.prototype.rotateAntiClockwise = /**
     * rotate crop tool points anti-clockwise
     * @param {?} resizeRatios - ratio between the new dimensions and the previous
     * @param {?} initialPreviewDimensions - preview pane dimensions before rotation
     * @param {?} initialPositions - current positions before rotation
     * @return {?}
     */
    function (resizeRatios, initialPreviewDimensions, initialPositions) {
        var _this = this;
        // convert positions to ratio between position to initial pane dimension
        initialPositions = initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return new PositionChangeData({
                x: point.x / initialPreviewDimensions.width,
                y: point.y / initialPreviewDimensions.height,
            }, point.roles);
        }));
        this.repositionPoints(initialPositions.map((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return _this.rotateCornerAntiClockwise(point);
        })));
    };
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     */
    /**
     * returns the corner positions after a 90 degrees clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    LimitsService.prototype.rotateCornerClockwise = /**
     * returns the corner positions after a 90 degrees clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    function (corner) {
        var _this = this;
        /** @type {?} */
        var rotated = {
            x: this._paneDimensions.width * (1 - corner.y),
            y: this._paneDimensions.height * corner.x,
            roles: []
        };
        // rotates corner according to order
        /** @type {?} */
        var order = [
            ['bottom', 'left'],
            ['top', 'left'],
            ['top', 'right'],
            ['bottom', 'right'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex((/**
         * @param {?} roles
         * @return {?}
         */
        function (roles) {
            return _this.compareArray(roles, corner.roles);
        })) + 1];
        console.log(rotated);
        return rotated;
    };
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     */
    /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    LimitsService.prototype.rotateCornerAntiClockwise = /**
     * returns the corner positions after a 90 degrees anti-clockwise rotation
     * @private
     * @param {?} corner
     * @return {?}
     */
    function (corner) {
        var _this = this;
        /** @type {?} */
        var rotated = {
            x: this._paneDimensions.width * corner.y,
            y: this._paneDimensions.height * (1 - corner.x),
            roles: []
        };
        // rotates corner according to order
        /** @type {?} */
        var order = [
            ['bottom', 'left'],
            ['bottom', 'right'],
            ['top', 'right'],
            ['top', 'left'],
            ['bottom', 'left']
        ];
        rotated.roles = order[order.findIndex((/**
         * @param {?} roles
         * @return {?}
         */
        function (roles) {
            return _this.compareArray(roles, corner.roles);
        })) + 1];
        console.log(rotated);
        return rotated;
    };
    /**
     * checks if two array contain the same values
     * @param array1 - array 1
     * @param array2 - array 2
     * @returns boolean
     */
    /**
     * checks if two array contain the same values
     * @param {?} array1 - array 1
     * @param {?} array2 - array 2
     * @return {?} boolean
     */
    LimitsService.prototype.compareArray = /**
     * checks if two array contain the same values
     * @param {?} array1 - array 1
     * @param {?} array2 - array 2
     * @return {?} boolean
     */
    function (array1, array2) {
        return array1.every((/**
         * @param {?} element
         * @return {?}
         */
        function (element) {
            return array2.includes(element);
        })) && array1.length === array2.length;
    };
    /**
     * @private
     * @param {?} direction
     * @return {?}
     */
    LimitsService.prototype.getDirectionAxis = /**
     * @private
     * @param {?} direction
     * @return {?}
     */
    function (direction) {
        return {
            left: 'x',
            right: 'x',
            top: 'y',
            bottom: 'y'
        }[direction];
    };
    LimitsService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    LimitsService.ctorParameters = function () { return []; };
    /** @nocollapse */ LimitsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function LimitsService_Factory() { return new LimitsService(); }, token: LimitsService, providedIn: "root" });
    return LimitsService;
}());
export { LimitsService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    LimitsService.prototype.limitDirections;
    /**
     * stores the crop limits limits
     * @type {?}
     * @private
     */
    LimitsService.prototype._limits;
    /**
     * stores the array of the draggable points displayed on the crop area
     * @type {?}
     * @private
     */
    LimitsService.prototype._points;
    /**
     * stores the pane dimensions
     * @type {?}
     * @private
     */
    LimitsService.prototype._paneDimensions;
    /** @type {?} */
    LimitsService.prototype.positions;
    /** @type {?} */
    LimitsService.prototype.repositionEvent;
    /** @type {?} */
    LimitsService.prototype.limits;
    /** @type {?} */
    LimitsService.prototype.paneDimensions;
}
/**
 * @record
 */
export function PointPositionChange() { }
if (false) {
    /** @type {?} */
    PointPositionChange.prototype.x;
    /** @type {?} */
    PointPositionChange.prototype.y;
    /** @type {?} */
    PointPositionChange.prototype.roles;
}
/**
 * @record
 */
export function AreaLimits() { }
if (false) {
    /** @type {?} */
    AreaLimits.prototype.top;
    /** @type {?} */
    AreaLimits.prototype.bottom;
    /** @type {?} */
    AreaLimits.prototype.right;
    /** @type {?} */
    AreaLimits.prototype.left;
}
var PositionChangeData = /** @class */ (function () {
    function PositionChangeData(position, roles) {
        this.x = position.x;
        this.y = position.y;
        this.roles = roles;
    }
    return PositionChangeData;
}());
export { PositionChangeData };
if (false) {
    /** @type {?} */
    PositionChangeData.prototype.x;
    /** @type {?} */
    PositionChangeData.prototype.y;
    /** @type {?} */
    PositionChangeData.prototype.roles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBSXJDO0lBaUNFO1FBM0JRLG9CQUFlLEdBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7OztRQUlqRSxZQUFPLEdBQUc7WUFDaEIsR0FBRyxFQUFFLENBQUM7WUFDTixNQUFNLEVBQUUsQ0FBQztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUM7U0FDUixDQUFDOzs7O1FBSU0sWUFBTyxHQUErQixFQUFFLENBQUM7Ozs7UUFTMUMsY0FBUyxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuSSxvQkFBZSxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsRUFBRSxDQUFDLENBQUM7UUFDbkgsV0FBTSxHQUFnQyxJQUFJLGVBQWUsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEYsbUJBQWMsR0FBcUMsSUFBSSxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3JHLENBQUM7SUFFRDs7T0FFRzs7Ozs7O0lBQ0kseUNBQWlCOzs7OztJQUF4QixVQUF5QixVQUEyQjtRQUFwRCxpQkFNQztRQUxDLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUM7WUFDbEMs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QUMsRUFBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN4QyxDQUFDOzs7Ozs7SUFFTyx3Q0FBZ0I7Ozs7O0lBQXhCLFVBQXlCLFNBQVM7UUFDaEMsT0FBTztZQUNMLElBQUksRUFBRSxHQUFHO1lBQ1QsS0FBSyxFQUFFLEdBQUc7WUFDVixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxHQUFHO1NBQ1osQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNmLENBQUM7O2dCQWhRRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Ozt3QkFQRDtDQXNRQyxBQWpRRCxJQWlRQztTQTlQWSxhQUFhOzs7Ozs7SUFHeEIsd0NBQXlFOzs7Ozs7SUFJekUsZ0NBS0U7Ozs7OztJQUlGLGdDQUFpRDs7Ozs7O0lBSWpELHdDQUF5Qzs7SUFLekMsa0NBQTBJOztJQUMxSSx3Q0FBMEg7O0lBQzFILCtCQUEyRjs7SUFDM0YsdUNBQXFHOzs7OztBQXFPdkcseUNBSUM7OztJQUhDLGdDQUFVOztJQUNWLGdDQUFVOztJQUNWLG9DQUFrQjs7Ozs7QUFHcEIsZ0NBS0M7OztJQUpDLHlCQUFZOztJQUNaLDRCQUFlOztJQUNmLDJCQUFjOztJQUNkLDBCQUFhOztBQUtmO0lBS0UsNEJBQVksUUFBb0IsRUFBRSxLQUFpQjtRQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFWRCxJQVVDOzs7O0lBVEMsK0JBQVU7O0lBQ1YsK0JBQVU7O0lBQ1YsbUNBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtMaW1pdEV4Y2VwdGlvbiwgWFlQb3NpdGlvbn0gZnJvbSAnLi4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaW1pdHNTZXJ2aWNlIHtcclxuXHJcblxyXG4gIHByaXZhdGUgbGltaXREaXJlY3Rpb25zOiBSb2xlc0FycmF5ID0gWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIGNyb3AgbGltaXRzIGxpbWl0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX2xpbWl0cyA9IHtcclxuICAgIHRvcDogMCxcclxuICAgIGJvdHRvbTogMCxcclxuICAgIHJpZ2h0OiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBhcnJheSBvZiB0aGUgZHJhZ2dhYmxlIHBvaW50cyBkaXNwbGF5ZWQgb24gdGhlIGNyb3AgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4gPSBbXTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHBhbmUgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgX3BhbmVEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcblxyXG4gIC8vICoqKioqKioqKioqIC8vXHJcbiAgLy8gT2JzZXJ2YWJsZXMgLy9cclxuICAvLyAqKioqKioqKioqKiAvL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihBcnJheS5mcm9tKHRoaXMuX3BvaW50cykpO1xyXG4gIHB1YmxpYyByZXBvc2l0aW9uRXZlbnQ6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PihbXSk7XHJcbiAgcHVibGljIGxpbWl0czogQmVoYXZpb3JTdWJqZWN0PEFyZWFMaW1pdHM+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcmVhTGltaXRzPih0aGlzLl9saW1pdHMpO1xyXG4gIHB1YmxpYyBwYW5lRGltZW5zaW9uczogQmVoYXZpb3JTdWJqZWN0PEltYWdlRGltZW5zaW9ucz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHt3aWR0aDogMCwgaGVpZ2h0OiAwfSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0IHByaXZldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwdWJsaWMgc2V0UGFuZURpbWVuc2lvbnMoZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLl9wYW5lRGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XHJcbiAgICAgIHRoaXMucGFuZURpbWVuc2lvbnMubmV4dChkaW1lbnNpb25zKTtcclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXBvc2l0aW9ucyBwb2ludHMgZXh0ZXJuYWxseVxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXBvc2l0aW9uUG9pbnRzKHBvc2l0aW9ucykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9zaXRpb25zO1xyXG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xyXG4gICAgICB0aGlzLnBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXBvc2l0aW9uRXZlbnQubmV4dChwb3NpdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBkYXRlcyBsaW1pdHMgYW5kIHBvaW50IHBvc2l0aW9ucyBhbmQgY2FsbHMgbmV4dCBvbiB0aGUgb2JzZXJ2YWJsZXNcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2VEYXRhIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgKi9cclxuICBwdWJsaWMgcG9zaXRpb25DaGFuZ2UocG9zaXRpb25DaGFuZ2VEYXRhOiBQb2ludFBvc2l0aW9uQ2hhbmdlKSB7XHJcbiAgICAvLyB1cGRhdGUgcG9zaXRpb25zIGFjY29yZGluZyB0byBjdXJyZW50IHBvc2l0aW9uIGNoYW5nZVxyXG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZURhdGEpO1xyXG5cclxuICAgIC8vIGZvciBlYWNoIGRpcmVjdGlvbjpcclxuICAgIC8vIDEuIGZpbHRlciB0aGUgX3BvaW50cyB0aGF0IGhhdmUgYSByb2xlIGFzIHRoZSBkaXJlY3Rpb24ncyBsaW1pdFxyXG4gICAgLy8gMi4gZm9yIHRvcCBhbmQgbGVmdCBmaW5kIG1heCB4IHwgeSB2YWx1ZXMsIGFuZCBtaW4gZm9yIHJpZ2h0IGFuZCBib3R0b21cclxuICAgIHRoaXMubGltaXREaXJlY3Rpb25zLmZvckVhY2goZGlyZWN0aW9uID0+IHtcclxuICAgICAgY29uc3QgcmVsZXZhbnRQb2ludHMgPSB0aGlzLl9wb2ludHMuZmlsdGVyKHBvaW50ID0+IHtcclxuICAgICAgICByZXR1cm4gcG9pbnQucm9sZXMuaW5jbHVkZXMoZGlyZWN0aW9uKTtcclxuICAgICAgfSlcclxuICAgICAgLm1hcCgocG9pbnQ6IFBvaW50UG9zaXRpb25DaGFuZ2UpID0+IHtcclxuICAgICAgICByZXR1cm4gcG9pbnRbdGhpcy5nZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbildO1xyXG4gICAgICB9KTtcclxuICAgICAgbGV0IGxpbWl0O1xyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndG9wJyB8fCBkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgIGxpbWl0ID0gTWF0aC5tYXgoLi4ucmVsZXZhbnRQb2ludHMpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcgfHwgZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIGxpbWl0ID0gTWF0aC5taW4oLi4ucmVsZXZhbnRQb2ludHMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dID0gbGltaXQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxpbWl0cy5uZXh0KHRoaXMuX2xpbWl0cyk7XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5uZXh0KEFycmF5LmZyb20odGhpcy5fcG9pbnRzKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB1cGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnRcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqL1xyXG4gIHB1YmxpYyB1cGRhdGVQb3NpdGlvbihwb3NpdGlvbkNoYW5nZTogUG9pbnRQb3NpdGlvbkNoYW5nZSkge1xyXG4gICAgLy8gZmluZHMgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50IGJ5IGl0J3Mgcm9sZXMsIHRoYW4gc3BsaWNlcyBpdCBmb3IgdGhlIG5ldyBwb3NpdGlvbiBvciBwdXNoZXMgaXQgaWYgaXQncyBub3QgeWV0IGluIHRoZSBhcnJheVxyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9wb2ludHMuZmluZEluZGV4KHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHBvc2l0aW9uQ2hhbmdlLnJvbGVzLCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgdGhpcy5fcG9pbnRzLnB1c2gocG9zaXRpb25DaGFuZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fcG9pbnRzLnNwbGljZShpbmRleCwgMSwgcG9zaXRpb25DaGFuZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2sgaWYgYSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZXhjZWVkcyB0aGUgbGltaXRzXHJcbiAgICogQHBhcmFtIHBvc2l0aW9uQ2hhbmdlIC0gcG9zaXRpb24gY2hhbmdlIGV2ZW50IGRhdGFcclxuICAgKiBAcmV0dXJucyBMaW1pdEV4Y2VwdGlvbjBcclxuICAgKi9cclxuICBwdWJsaWMgZXhjZWVkc0xpbWl0KHBvc2l0aW9uQ2hhbmdlOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogTGltaXRFeGNlcHRpb24ge1xyXG4gICAgY29uc3QgcG9pbnRMaW1pdHMgPSB0aGlzLmxpbWl0RGlyZWN0aW9ucy5maWx0ZXIoZGlyZWN0aW9uID0+IHtcclxuICAgICAgcmV0dXJuICFwb3NpdGlvbkNoYW5nZS5yb2xlcy5pbmNsdWRlcyhkaXJlY3Rpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbGltaXRFeGNlcHRpb246IExpbWl0RXhjZXB0aW9uID0ge1xyXG4gICAgICBleGNlZWRzOiBmYWxzZSxcclxuICAgICAgcmVzZXRDb2VmZmljaWVudHM6IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfSxcclxuICAgICAgcmVzZXRDb29yZGluYXRlczoge1xyXG4gICAgICAgIHg6IHBvc2l0aW9uQ2hhbmdlLngsXHJcbiAgICAgICAgeTogcG9zaXRpb25DaGFuZ2UueVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGxpbWl0IGRpcmVjdGlvbnMgYXJlIHRoZSBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgcG9pbnQncyByb2xlc1xyXG4gICAgcG9pbnRMaW1pdHMuZm9yRWFjaChkaXJlY3Rpb24gPT4ge1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb25BeGlzID0gdGhpcy5nZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbik7XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd0b3AnIHx8IGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uQ2hhbmdlW2RpcmVjdGlvbkF4aXNdIDwgdGhpcy5fbGltaXRzW2RpcmVjdGlvbl0pIHtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzW2RpcmVjdGlvbkF4aXNdID0gMTtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXNbZGlyZWN0aW9uQXhpc10gPSB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnIHx8IGRpcmVjdGlvbiA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICBpZiAocG9zaXRpb25DaGFuZ2VbZGlyZWN0aW9uQXhpc10gPiB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXSkge1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbZGlyZWN0aW9uQXhpc10gPSAtMTtcclxuICAgICAgICAgIGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29vcmRpbmF0ZXNbZGlyZWN0aW9uQXhpc10gPSB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50cy54ICE9PSAwIHx8IGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzLnkgIT09IDApIHtcclxuICAgICAgbGltaXRFeGNlcHRpb24uZXhjZWVkcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxpbWl0RXhjZXB0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGNyb3AgdG9vbCBwb2ludHMgY2xvY2t3aXNlXHJcbiAgICogQHBhcmFtIHJlc2l6ZVJhdGlvcyAtIHJhdGlvIGJldHdlZW4gdGhlIG5ldyBkaW1lbnNpb25zIGFuZCB0aGUgcHJldmlvdXNcclxuICAgKiBAcGFyYW0gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zIC0gcHJldmlldyBwYW5lIGRpbWVuc2lvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICogQHBhcmFtIGluaXRpYWxQb3NpdGlvbnMgLSBjdXJyZW50IHBvc2l0aW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgcm90YXRlQ2xvY2t3aXNlKHJlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgLy8gY29udmVydCBwb3NpdGlvbnMgdG8gcmF0aW8gYmV0d2VlbiBwb3NpdGlvbiB0byBpbml0aWFsIHBhbmUgZGltZW5zaW9uXHJcbiAgICBpbml0aWFsUG9zaXRpb25zID0gaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7XHJcbiAgICAgICAgeDogcG9pbnQueCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICB5OiBwb2ludC55IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodCxcclxuICAgICAgfSwgcG9pbnQucm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25Qb2ludHMoaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdGVDb3JuZXJDbG9ja3dpc2UocG9pbnQpO1xyXG4gICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGNyb3AgdG9vbCBwb2ludHMgYW50aS1jbG9ja3dpc2VcclxuICAgKiBAcGFyYW0gcmVzaXplUmF0aW9zIC0gcmF0aW8gYmV0d2VlbiB0aGUgbmV3IGRpbWVuc2lvbnMgYW5kIHRoZSBwcmV2aW91c1xyXG4gICAqIEBwYXJhbSBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgLSBwcmV2aWV3IHBhbmUgZGltZW5zaW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKiBAcGFyYW0gaW5pdGlhbFBvc2l0aW9ucyAtIGN1cnJlbnQgcG9zaXRpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyByb3RhdGVBbnRpQ2xvY2t3aXNlKHJlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPikge1xyXG4gICAgLy8gY29udmVydCBwb3NpdGlvbnMgdG8gcmF0aW8gYmV0d2VlbiBwb3NpdGlvbiB0byBpbml0aWFsIHBhbmUgZGltZW5zaW9uXHJcbiAgICBpbml0aWFsUG9zaXRpb25zID0gaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7XHJcbiAgICAgICAgeDogcG9pbnQueCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICB5OiBwb2ludC55IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodCxcclxuICAgICAgfSwgcG9pbnQucm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25Qb2ludHMoaW5pdGlhbFBvc2l0aW9ucy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdGVDb3JuZXJBbnRpQ2xvY2t3aXNlKHBvaW50KTtcclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgdGhlIGNvcm5lciBwb3NpdGlvbnMgYWZ0ZXIgYSA5MCBkZWdyZWVzIGNsb2Nrd2lzZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgcm90YXRlQ29ybmVyQ2xvY2t3aXNlKGNvcm5lcjogUG9pbnRQb3NpdGlvbkNoYW5nZSk6IFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gICAgY29uc3Qgcm90YXRlZDogUG9pbnRQb3NpdGlvbkNoYW5nZSA9IHtcclxuICAgICAgeDogdGhpcy5fcGFuZURpbWVuc2lvbnMud2lkdGggKiAoMSAtIGNvcm5lci55KSxcclxuICAgICAgeTogdGhpcy5fcGFuZURpbWVuc2lvbnMuaGVpZ2h0ICogY29ybmVyLngsXHJcbiAgICAgIHJvbGVzOiBbXVxyXG4gICAgfTtcclxuICAgIC8vIHJvdGF0ZXMgY29ybmVyIGFjY29yZGluZyB0byBvcmRlclxyXG4gICAgY29uc3Qgb3JkZXI6IEFycmF5PFJvbGVzQXJyYXk+ID0gW1xyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J10sXHJcbiAgICAgIFsndG9wJywgJ2xlZnQnXSxcclxuICAgICAgWyd0b3AnLCAncmlnaHQnXSxcclxuICAgICAgWydib3R0b20nLCAncmlnaHQnXSxcclxuICAgICAgWydib3R0b20nLCAnbGVmdCddXHJcbiAgICBdO1xyXG4gICAgcm90YXRlZC5yb2xlcyA9IG9yZGVyW29yZGVyLmZpbmRJbmRleChyb2xlcyA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVBcnJheShyb2xlcywgY29ybmVyLnJvbGVzKTtcclxuICAgIH0pICsgMV07XHJcbiAgICBjb25zb2xlLmxvZyhyb3RhdGVkKTtcclxuICAgIHJldHVybiByb3RhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgYW50aS1jbG9ja3dpc2Ugcm90YXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIHJvdGF0ZUNvcm5lckFudGlDbG9ja3dpc2UoY29ybmVyOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBjb25zdCByb3RhdGVkOiBQb2ludFBvc2l0aW9uQ2hhbmdlID0ge1xyXG4gICAgICB4OiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCAqIGNvcm5lci55LFxyXG4gICAgICB5OiB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgKiAoMSAtIGNvcm5lci54KSxcclxuICAgICAgcm9sZXM6IFtdXHJcbiAgICB9O1xyXG4gICAgLy8gcm90YXRlcyBjb3JuZXIgYWNjb3JkaW5nIHRvIG9yZGVyXHJcbiAgICBjb25zdCBvcmRlcjogQXJyYXk8Um9sZXNBcnJheT4gPSBbXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXSxcclxuICAgICAgWydib3R0b20nLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAnbGVmdCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J11cclxuICAgIF07XHJcbiAgICByb3RhdGVkLnJvbGVzID0gb3JkZXJbb3JkZXIuZmluZEluZGV4KHJvbGVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHJvbGVzLCBjb3JuZXIucm9sZXMpO1xyXG4gICAgfSkgKyAxXTtcclxuICAgIGNvbnNvbGUubG9nKHJvdGF0ZWQpO1xyXG4gICAgcmV0dXJuIHJvdGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVja3MgaWYgdHdvIGFycmF5IGNvbnRhaW4gdGhlIHNhbWUgdmFsdWVzXHJcbiAgICogQHBhcmFtIGFycmF5MSAtIGFycmF5IDFcclxuICAgKiBAcGFyYW0gYXJyYXkyIC0gYXJyYXkgMlxyXG4gICAqIEByZXR1cm5zIGJvb2xlYW5cclxuICAgKi9cclxuICBwdWJsaWMgY29tcGFyZUFycmF5KGFycmF5MTogQXJyYXk8c3RyaW5nPiwgYXJyYXkyOiBBcnJheTxzdHJpbmc+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gYXJyYXkxLmV2ZXJ5KChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiBhcnJheTIuaW5jbHVkZXMoZWxlbWVudCk7XHJcbiAgICB9KSAmJiBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREaXJlY3Rpb25BeGlzKGRpcmVjdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGVmdDogJ3gnLFxyXG4gICAgICByaWdodDogJ3gnLFxyXG4gICAgICB0b3A6ICd5JyxcclxuICAgICAgYm90dG9tOiAneSdcclxuICAgIH1bZGlyZWN0aW9uXTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbiAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJlYUxpbWl0cyB7XHJcbiAgdG9wOiBudW1iZXI7XHJcbiAgYm90dG9tOiBudW1iZXI7XHJcbiAgcmlnaHQ6IG51bWJlcjtcclxuICBsZWZ0OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJvbGVzQXJyYXkgPSBBcnJheTxEaXJlY3Rpb24+O1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uQ2hhbmdlRGF0YSBpbXBsZW1lbnRzIFBvaW50UG9zaXRpb25DaGFuZ2Uge1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbiAgcm9sZXM6IFJvbGVzQXJyYXk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBYWVBvc2l0aW9uLCByb2xlczogUm9sZXNBcnJheSkge1xyXG4gICAgdGhpcy54ID0gcG9zaXRpb24ueDtcclxuICAgIHRoaXMueSA9IHBvc2l0aW9uLnk7XHJcbiAgICB0aGlzLnJvbGVzID0gcm9sZXM7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEaXJlY3Rpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ3RvcCcgfCAnYm90dG9tJztcclxuIl19