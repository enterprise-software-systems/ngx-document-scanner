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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGltaXRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZG9jdW1lbnQtc2Nhbm5lci8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBSXJDO0lBaUNFO1FBM0JRLG9CQUFlLEdBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7OztRQUlqRSxZQUFPLEdBQUc7WUFDaEIsR0FBRyxFQUFFLENBQUM7WUFDTixNQUFNLEVBQUUsQ0FBQztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUM7U0FDUixDQUFDOzs7O1FBSU0sWUFBTyxHQUErQixFQUFFLENBQUM7Ozs7UUFTMUMsY0FBUyxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuSSxvQkFBZSxHQUFnRCxJQUFJLGVBQWUsQ0FBNkIsRUFBRSxDQUFDLENBQUM7UUFDbkgsV0FBTSxHQUFnQyxJQUFJLGVBQWUsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEYsbUJBQWMsR0FBcUMsSUFBSSxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3JHLENBQUM7SUFFRDs7T0FFRzs7Ozs7O0lBQ0kseUNBQWlCOzs7OztJQUF4QixVQUF5QixVQUEyQjtRQUFwRCxpQkFNQztRQUxDLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUM7WUFDbEMs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Ozs7SUFBeEIsVUFBeUIsU0FBUztRQUNoQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEdBQUc7WUFDVCxLQUFLLEVBQUUsR0FBRztZQUNWLEdBQUcsRUFBRSxHQUFHO1lBQ1IsTUFBTSxFQUFFLEdBQUc7U0FDWixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2YsQ0FBQzs7Z0JBOVBGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7O3dCQVBEO0NBb1FDLEFBL1BELElBK1BDO1NBNVBZLGFBQWE7Ozs7OztJQUd4Qix3Q0FBeUU7Ozs7OztJQUl6RSxnQ0FLRTs7Ozs7O0lBSUYsZ0NBQWlEOzs7Ozs7SUFJakQsd0NBQXlDOztJQUt6QyxrQ0FBMEk7O0lBQzFJLHdDQUEwSDs7SUFDMUgsK0JBQTJGOztJQUMzRix1Q0FBcUc7Ozs7O0FBbU92Ryx5Q0FJQzs7O0lBSEMsZ0NBQVU7O0lBQ1YsZ0NBQVU7O0lBQ1Ysb0NBQWtCOzs7OztBQUdwQixnQ0FLQzs7O0lBSkMseUJBQVk7O0lBQ1osNEJBQWU7O0lBQ2YsMkJBQWM7O0lBQ2QsMEJBQWE7O0FBS2Y7SUFLRSw0QkFBWSxRQUFvQixFQUFFLEtBQWlCO1FBQ2pELElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7Ozs7SUFUQywrQkFBVTs7SUFDViwrQkFBVTs7SUFDVixtQ0FBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7SW1hZ2VEaW1lbnNpb25zfSBmcm9tICcuLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQge0xpbWl0RXhjZXB0aW9uLCBYWVBvc2l0aW9ufSBmcm9tICcuLi9Qcml2YXRlTW9kZWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIExpbWl0c1NlcnZpY2Uge1xyXG5cclxuXHJcbiAgcHJpdmF0ZSBsaW1pdERpcmVjdGlvbnM6IFJvbGVzQXJyYXkgPSBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgY3JvcCBsaW1pdHMgbGltaXRzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfbGltaXRzID0ge1xyXG4gICAgdG9wOiAwLFxyXG4gICAgYm90dG9tOiAwLFxyXG4gICAgcmlnaHQ6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIGFycmF5IG9mIHRoZSBkcmFnZ2FibGUgcG9pbnRzIGRpc3BsYXllZCBvbiB0aGUgY3JvcCBhcmVhXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfcG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPiA9IFtdO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgcGFuZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfcGFuZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuXHJcbiAgLy8gKioqKioqKioqKiogLy9cclxuICAvLyBPYnNlcnZhYmxlcyAvL1xyXG4gIC8vICoqKioqKioqKioqIC8vXHJcbiAgcHVibGljIHBvc2l0aW9uczogQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+KEFycmF5LmZyb20odGhpcy5fcG9pbnRzKSk7XHJcbiAgcHVibGljIHJlcG9zaXRpb25FdmVudDogQmVoYXZpb3JTdWJqZWN0PEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+PiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT4+KFtdKTtcclxuICBwdWJsaWMgbGltaXRzOiBCZWhhdmlvclN1YmplY3Q8QXJlYUxpbWl0cz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFyZWFMaW1pdHM+KHRoaXMuX2xpbWl0cyk7XHJcbiAgcHVibGljIHBhbmVEaW1lbnNpb25zOiBCZWhhdmlvclN1YmplY3Q8SW1hZ2VEaW1lbnNpb25zPiA9IG5ldyBCZWhhdmlvclN1YmplY3Qoe3dpZHRoOiAwLCBoZWlnaHQ6IDB9KTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzZXQgcHJpdmV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRQYW5lRGltZW5zaW9ucyhkaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuX3BhbmVEaW1lbnNpb25zID0gZGltZW5zaW9ucztcclxuICAgICAgdGhpcy5wYW5lRGltZW5zaW9ucy5uZXh0KGRpbWVuc2lvbnMpO1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlcG9zaXRpb25zIHBvaW50cyBleHRlcm5hbGx5XHJcbiAgICovXHJcbiAgcHVibGljIHJlcG9zaXRpb25Qb2ludHMocG9zaXRpb25zKSB7XHJcbiAgICB0aGlzLl9wb2ludHMgPSBwb3NpdGlvbnM7XHJcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3NpdGlvbiA9PiB7XHJcbiAgICAgIHRoaXMucG9zaXRpb25DaGFuZ2UocG9zaXRpb24pO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlcG9zaXRpb25FdmVudC5uZXh0KHBvc2l0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB1cGRhdGVzIGxpbWl0cyBhbmQgcG9pbnQgcG9zaXRpb25zIGFuZCBjYWxscyBuZXh0IG9uIHRoZSBvYnNlcnZhYmxlc1xyXG4gICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZURhdGEgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbkNoYW5nZShwb3NpdGlvbkNoYW5nZURhdGE6IFBvaW50UG9zaXRpb25DaGFuZ2UpIHtcclxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbnMgYWNjb3JkaW5nIHRvIGN1cnJlbnQgcG9zaXRpb24gY2hhbmdlXHJcbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlRGF0YSk7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggZGlyZWN0aW9uOlxyXG4gICAgLy8gMS4gZmlsdGVyIHRoZSBfcG9pbnRzIHRoYXQgaGF2ZSBhIHJvbGUgYXMgdGhlIGRpcmVjdGlvbidzIGxpbWl0XHJcbiAgICAvLyAyLiBmb3IgdG9wIGFuZCBsZWZ0IGZpbmQgbWF4IHggfCB5IHZhbHVlcywgYW5kIG1pbiBmb3IgcmlnaHQgYW5kIGJvdHRvbVxyXG4gICAgdGhpcy5saW1pdERpcmVjdGlvbnMuZm9yRWFjaChkaXJlY3Rpb24gPT4ge1xyXG4gICAgICBjb25zdCByZWxldmFudFBvaW50cyA9IHRoaXMuX3BvaW50cy5maWx0ZXIocG9pbnQgPT4ge1xyXG4gICAgICAgIHJldHVybiBwb2ludC5yb2xlcy5pbmNsdWRlcyhkaXJlY3Rpb24pO1xyXG4gICAgICB9KVxyXG4gICAgICAubWFwKChwb2ludDogUG9pbnRQb3NpdGlvbkNoYW5nZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwb2ludFt0aGlzLmdldERpcmVjdGlvbkF4aXMoZGlyZWN0aW9uKV07XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgbGltaXQ7XHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd0b3AnIHx8IGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgbGltaXQgPSBNYXRoLm1heCguLi5yZWxldmFudFBvaW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBkaXJlY3Rpb24gPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgbGltaXQgPSBNYXRoLm1pbiguLi5yZWxldmFudFBvaW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fbGltaXRzW2RpcmVjdGlvbl0gPSBsaW1pdDtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubGltaXRzLm5leHQodGhpcy5fbGltaXRzKTtcclxuICAgIHRoaXMucG9zaXRpb25zLm5leHQoQXJyYXkuZnJvbSh0aGlzLl9wb2ludHMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludFxyXG4gICAqIEBwYXJhbSBwb3NpdGlvbkNoYW5nZSAtIHBvc2l0aW9uIGNoYW5nZSBldmVudCBkYXRhXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uQ2hhbmdlOiBQb2ludFBvc2l0aW9uQ2hhbmdlKSB7XHJcbiAgICAvLyBmaW5kcyB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgYnkgaXQncyByb2xlcywgdGhhbiBzcGxpY2VzIGl0IGZvciB0aGUgbmV3IHBvc2l0aW9uIG9yIHB1c2hlcyBpdCBpZiBpdCdzIG5vdCB5ZXQgaW4gdGhlIGFycmF5XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX3BvaW50cy5maW5kSW5kZXgocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb21wYXJlQXJyYXkocG9zaXRpb25DaGFuZ2Uucm9sZXMsIHBvaW50LnJvbGVzKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICB0aGlzLl9wb2ludHMucHVzaChwb3NpdGlvbkNoYW5nZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9wb2ludHMuc3BsaWNlKGluZGV4LCAxLCBwb3NpdGlvbkNoYW5nZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVjayBpZiBhIHBvc2l0aW9uIGNoYW5nZSBldmVudCBleGNlZWRzIHRoZSBsaW1pdHNcclxuICAgKiBAcGFyYW0gcG9zaXRpb25DaGFuZ2UgLSBwb3NpdGlvbiBjaGFuZ2UgZXZlbnQgZGF0YVxyXG4gICAqIEByZXR1cm5zIExpbWl0RXhjZXB0aW9uMFxyXG4gICAqL1xyXG4gIHB1YmxpYyBleGNlZWRzTGltaXQocG9zaXRpb25DaGFuZ2U6IFBvaW50UG9zaXRpb25DaGFuZ2UpOiBMaW1pdEV4Y2VwdGlvbiB7XHJcbiAgICBjb25zdCBwb2ludExpbWl0cyA9IHRoaXMubGltaXREaXJlY3Rpb25zLmZpbHRlcihkaXJlY3Rpb24gPT4ge1xyXG4gICAgICByZXR1cm4gIXBvc2l0aW9uQ2hhbmdlLnJvbGVzLmluY2x1ZGVzKGRpcmVjdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsaW1pdEV4Y2VwdGlvbjogTGltaXRFeGNlcHRpb24gPSB7XHJcbiAgICAgIGV4Y2VlZHM6IGZhbHNlLFxyXG4gICAgICByZXNldENvZWZmaWNpZW50czoge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgICB9LFxyXG4gICAgICByZXNldENvb3JkaW5hdGVzOiB7XHJcbiAgICAgICAgeDogcG9zaXRpb25DaGFuZ2UueCxcclxuICAgICAgICB5OiBwb3NpdGlvbkNoYW5nZS55XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gbGltaXQgZGlyZWN0aW9ucyBhcmUgdGhlIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSBwb2ludCdzIHJvbGVzXHJcbiAgICBwb2ludExpbWl0cy5mb3JFYWNoKGRpcmVjdGlvbiA9PiB7XHJcbiAgICAgIGNvbnN0IGRpcmVjdGlvbkF4aXMgPSB0aGlzLmdldERpcmVjdGlvbkF4aXMoZGlyZWN0aW9uKTtcclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3RvcCcgfHwgZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICBpZiAocG9zaXRpb25DaGFuZ2VbZGlyZWN0aW9uQXhpc10gPCB0aGlzLl9saW1pdHNbZGlyZWN0aW9uXSkge1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHNbZGlyZWN0aW9uQXhpc10gPSAxO1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1tkaXJlY3Rpb25BeGlzXSA9IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcgfHwgZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbkNoYW5nZVtkaXJlY3Rpb25BeGlzXSA+IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dKSB7XHJcbiAgICAgICAgICBsaW1pdEV4Y2VwdGlvbi5yZXNldENvZWZmaWNpZW50c1tkaXJlY3Rpb25BeGlzXSA9IC0xO1xyXG4gICAgICAgICAgbGltaXRFeGNlcHRpb24ucmVzZXRDb29yZGluYXRlc1tkaXJlY3Rpb25BeGlzXSA9IHRoaXMuX2xpbWl0c1tkaXJlY3Rpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGxpbWl0RXhjZXB0aW9uLnJlc2V0Q29lZmZpY2llbnRzLnggIT09IDAgfHwgbGltaXRFeGNlcHRpb24ucmVzZXRDb2VmZmljaWVudHMueSAhPT0gMCkge1xyXG4gICAgICBsaW1pdEV4Y2VwdGlvbi5leGNlZWRzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGltaXRFeGNlcHRpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBjbG9ja3dpc2VcclxuICAgKiBAcGFyYW0gcmVzaXplUmF0aW9zIC0gcmF0aW8gYmV0d2VlbiB0aGUgbmV3IGRpbWVuc2lvbnMgYW5kIHRoZSBwcmV2aW91c1xyXG4gICAqIEBwYXJhbSBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgLSBwcmV2aWV3IHBhbmUgZGltZW5zaW9ucyBiZWZvcmUgcm90YXRpb25cclxuICAgKiBAcGFyYW0gaW5pdGlhbFBvc2l0aW9ucyAtIGN1cnJlbnQgcG9zaXRpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyByb3RhdGVDbG9ja3dpc2UocmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICAvLyBjb252ZXJ0IHBvc2l0aW9ucyB0byByYXRpbyBiZXR3ZWVuIHBvc2l0aW9uIHRvIGluaXRpYWwgcGFuZSBkaW1lbnNpb25cclxuICAgIGluaXRpYWxQb3NpdGlvbnMgPSBpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHtcclxuICAgICAgICB4OiBwb2ludC54IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgIHk6IHBvaW50LnkgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0LFxyXG4gICAgICB9LCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVwb3NpdGlvblBvaW50cyhpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUNvcm5lckNsb2Nrd2lzZShwb2ludCk7XHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByb3RhdGUgY3JvcCB0b29sIHBvaW50cyBhbnRpLWNsb2Nrd2lzZVxyXG4gICAqIEBwYXJhbSByZXNpemVSYXRpb3MgLSByYXRpbyBiZXR3ZWVuIHRoZSBuZXcgZGltZW5zaW9ucyBhbmQgdGhlIHByZXZpb3VzXHJcbiAgICogQHBhcmFtIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyAtIHByZXZpZXcgcGFuZSBkaW1lbnNpb25zIGJlZm9yZSByb3RhdGlvblxyXG4gICAqIEBwYXJhbSBpbml0aWFsUG9zaXRpb25zIC0gY3VycmVudCBwb3NpdGlvbnMgYmVmb3JlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIHJvdGF0ZUFudGlDbG9ja3dpc2UocmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+KSB7XHJcbiAgICAvLyBjb252ZXJ0IHBvc2l0aW9ucyB0byByYXRpbyBiZXR3ZWVuIHBvc2l0aW9uIHRvIGluaXRpYWwgcGFuZSBkaW1lbnNpb25cclxuICAgIGluaXRpYWxQb3NpdGlvbnMgPSBpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHtcclxuICAgICAgICB4OiBwb2ludC54IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgIHk6IHBvaW50LnkgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0LFxyXG4gICAgICB9LCBwb2ludC5yb2xlcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVwb3NpdGlvblBvaW50cyhpbml0aWFsUG9zaXRpb25zLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUNvcm5lckFudGlDbG9ja3dpc2UocG9pbnQpO1xyXG4gICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgY2xvY2t3aXNlIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByb3RhdGVDb3JuZXJDbG9ja3dpc2UoY29ybmVyOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBjb25zdCByb3RhdGVkOiBQb2ludFBvc2l0aW9uQ2hhbmdlID0ge1xyXG4gICAgICB4OiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCAqICgxIC0gY29ybmVyLnkpLFxyXG4gICAgICB5OiB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgKiBjb3JuZXIueCxcclxuICAgICAgcm9sZXM6IFtdXHJcbiAgICB9O1xyXG4gICAgLy8gcm90YXRlcyBjb3JuZXIgYWNjb3JkaW5nIHRvIG9yZGVyXHJcbiAgICBjb25zdCBvcmRlcjogQXJyYXk8Um9sZXNBcnJheT4gPSBbXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXSxcclxuICAgICAgWyd0b3AnLCAnbGVmdCddLFxyXG4gICAgICBbJ3RvcCcsICdyaWdodCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdyaWdodCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J11cclxuICAgIF07XHJcbiAgICByb3RhdGVkLnJvbGVzID0gb3JkZXJbb3JkZXIuZmluZEluZGV4KHJvbGVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHJvbGVzLCBjb3JuZXIucm9sZXMpO1xyXG4gICAgfSkgKyAxXTtcclxuICAgIHJldHVybiByb3RhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyB0aGUgY29ybmVyIHBvc2l0aW9ucyBhZnRlciBhIDkwIGRlZ3JlZXMgYW50aS1jbG9ja3dpc2Ugcm90YXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIHJvdGF0ZUNvcm5lckFudGlDbG9ja3dpc2UoY29ybmVyOiBQb2ludFBvc2l0aW9uQ2hhbmdlKTogUG9pbnRQb3NpdGlvbkNoYW5nZSB7XHJcbiAgICBjb25zdCByb3RhdGVkOiBQb2ludFBvc2l0aW9uQ2hhbmdlID0ge1xyXG4gICAgICB4OiB0aGlzLl9wYW5lRGltZW5zaW9ucy53aWR0aCAqIGNvcm5lci55LFxyXG4gICAgICB5OiB0aGlzLl9wYW5lRGltZW5zaW9ucy5oZWlnaHQgKiAoMSAtIGNvcm5lci54KSxcclxuICAgICAgcm9sZXM6IFtdXHJcbiAgICB9O1xyXG4gICAgLy8gcm90YXRlcyBjb3JuZXIgYWNjb3JkaW5nIHRvIG9yZGVyXHJcbiAgICBjb25zdCBvcmRlcjogQXJyYXk8Um9sZXNBcnJheT4gPSBbXHJcbiAgICAgIFsnYm90dG9tJywgJ2xlZnQnXSxcclxuICAgICAgWydib3R0b20nLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAncmlnaHQnXSxcclxuICAgICAgWyd0b3AnLCAnbGVmdCddLFxyXG4gICAgICBbJ2JvdHRvbScsICdsZWZ0J11cclxuICAgIF07XHJcbiAgICByb3RhdGVkLnJvbGVzID0gb3JkZXJbb3JkZXIuZmluZEluZGV4KHJvbGVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZUFycmF5KHJvbGVzLCBjb3JuZXIucm9sZXMpO1xyXG4gICAgfSkgKyAxXTtcclxuICAgIHJldHVybiByb3RhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2tzIGlmIHR3byBhcnJheSBjb250YWluIHRoZSBzYW1lIHZhbHVlc1xyXG4gICAqIEBwYXJhbSBhcnJheTEgLSBhcnJheSAxXHJcbiAgICogQHBhcmFtIGFycmF5MiAtIGFycmF5IDJcclxuICAgKiBAcmV0dXJucyBib29sZWFuXHJcbiAgICovXHJcbiAgcHVibGljIGNvbXBhcmVBcnJheShhcnJheTE6IEFycmF5PHN0cmluZz4sIGFycmF5MjogQXJyYXk8c3RyaW5nPik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGFycmF5MS5ldmVyeSgoZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gYXJyYXkyLmluY2x1ZGVzKGVsZW1lbnQpO1xyXG4gICAgfSkgJiYgYXJyYXkxLmxlbmd0aCA9PT0gYXJyYXkyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGlyZWN0aW9uQXhpcyhkaXJlY3Rpb24pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxlZnQ6ICd4JyxcclxuICAgICAgcmlnaHQ6ICd4JyxcclxuICAgICAgdG9wOiAneScsXHJcbiAgICAgIGJvdHRvbTogJ3knXHJcbiAgICB9W2RpcmVjdGlvbl07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHJvbGVzOiBSb2xlc0FycmF5O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFyZWFMaW1pdHMge1xyXG4gIHRvcDogbnVtYmVyO1xyXG4gIGJvdHRvbTogbnVtYmVyO1xyXG4gIHJpZ2h0OiBudW1iZXI7XHJcbiAgbGVmdDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBSb2xlc0FycmF5ID0gQXJyYXk8RGlyZWN0aW9uPjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3NpdGlvbkNoYW5nZURhdGEgaW1wbGVtZW50cyBQb2ludFBvc2l0aW9uQ2hhbmdlIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHJvbGVzOiBSb2xlc0FycmF5O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogWFlQb3NpdGlvbiwgcm9sZXM6IFJvbGVzQXJyYXkpIHtcclxuICAgIHRoaXMueCA9IHBvc2l0aW9uLng7XHJcbiAgICB0aGlzLnkgPSBwb3NpdGlvbi55O1xyXG4gICAgdGhpcy5yb2xlcyA9IHJvbGVzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRGlyZWN0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbSc7XHJcbiJdfQ==