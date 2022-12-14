/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/filter-menu/ngx-filter-menu.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
var NgxFilterMenuComponent = /** @class */ (function () {
    function NgxFilterMenuComponent(bottomSheetRef, data) {
        var _this = this;
        this.bottomSheetRef = bottomSheetRef;
        this.data = data;
        this.filterOptions = [
            {
                name: 'default',
                icon: 'filter_b_and_w',
                action: (/**
                 * @param {?} filter
                 * @return {?}
                 */
                function (filter) {
                    _this.filterSelected.emit(filter);
                }),
                text: 'B&W'
            },
            {
                name: 'bw2',
                icon: 'filter_b_and_w',
                action: (/**
                 * @param {?} filter
                 * @return {?}
                 */
                function (filter) {
                    _this.filterSelected.emit(filter);
                }),
                text: 'B&W 2'
            },
            {
                name: 'bw3',
                icon: 'blur_on',
                action: (/**
                 * @param {?} filter
                 * @return {?}
                 */
                function (filter) {
                    _this.filterSelected.emit(filter);
                }),
                text: 'B&W 3'
            },
            {
                name: 'magic_color',
                icon: 'filter_vintage',
                action: (/**
                 * @param {?} filter
                 * @return {?}
                 */
                function (filter) {
                    _this.filterSelected.emit(filter);
                }),
                text: 'Magic Color'
            },
            {
                name: 'original',
                icon: 'crop_original',
                action: (/**
                 * @param {?} filter
                 * @return {?}
                 */
                function (filter) {
                    _this.filterSelected.emit(filter);
                }),
                text: 'Original'
            },
        ];
        this.filterSelected = new EventEmitter();
    }
    /**
     * @param {?} optionName
     * @return {?}
     */
    NgxFilterMenuComponent.prototype.selectOption = /**
     * @param {?} optionName
     * @return {?}
     */
    function (optionName) {
        this.data.filter = optionName;
        this.bottomSheetRef.dismiss();
    };
    NgxFilterMenuComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-filter-menu',
                    template: "<mat-action-list>\r\n  <button mat-list-item *ngFor=\"let option of filterOptions\" (click)=\"selectOption(option.name)\">\r\n    <mat-icon>{{option.icon}}</mat-icon>\r\n    <span fxFlex=\"100\" style=\"text-align: start; margin: 5px\">{{option.text}}</span>\r\n    <span fxFlex=\"100\"></span>\r\n    <mat-icon *ngIf=\"option.name === data.filter\">done</mat-icon>\r\n  </button>\r\n</mat-action-list>\r\n"
                }] }
    ];
    /** @nocollapse */
    NgxFilterMenuComponent.ctorParameters = function () { return [
        { type: MatBottomSheetRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_BOTTOM_SHEET_DATA,] }] }
    ]; };
    NgxFilterMenuComponent.propDecorators = {
        filterSelected: [{ type: Output }]
    };
    return NgxFilterMenuComponent;
}());
export { NgxFilterMenuComponent };
if (false) {
    /** @type {?} */
    NgxFilterMenuComponent.prototype.filterOptions;
    /** @type {?} */
    NgxFilterMenuComponent.prototype.filterSelected;
    /**
     * @type {?}
     * @private
     */
    NgxFilterMenuComponent.prototype.bottomSheetRef;
    /** @type {?} */
    NgxFilterMenuComponent.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZpbHRlci1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdEUsT0FBTyxFQUFDLHFCQUFxQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFeEY7SUFxREUsZ0NBQW9CLGNBQXlELEVBQzNCLElBQVM7UUFEM0QsaUJBRWdCO1FBRkksbUJBQWMsR0FBZCxjQUFjLENBQTJDO1FBQzNCLFNBQUksR0FBSixJQUFJLENBQUs7UUFqRDNELGtCQUFhLEdBQThCO1lBQ3pDO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLE1BQU07Ozs7Z0JBQUUsVUFBQyxNQUFNO29CQUNiLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUE7Z0JBQ0QsSUFBSSxFQUFFLEtBQUs7YUFDWjtZQUNEO2dCQUNFLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLE1BQU07Ozs7Z0JBQUUsVUFBQyxNQUFNO29CQUNiLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUE7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87YUFDZDtZQUNEO2dCQUNFLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxTQUFTO2dCQUNmLE1BQU07Ozs7Z0JBQUUsVUFBQyxNQUFNO29CQUNiLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUE7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87YUFDZDtZQUNEO2dCQUNFLElBQUksRUFBRSxhQUFhO2dCQUNuQixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixNQUFNOzs7O2dCQUFFLFVBQUMsTUFBTTtvQkFDYixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFBO2dCQUNELElBQUksRUFBRSxhQUFhO2FBQ3BCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxlQUFlO2dCQUNyQixNQUFNOzs7O2dCQUFFLFVBQUMsTUFBTTtvQkFDYixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFBO2dCQUNELElBQUksRUFBRSxVQUFVO2FBQ2pCO1NBQ0YsQ0FBQztRQUNRLG1CQUFjLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7SUFRckQsQ0FBQzs7Ozs7SUFQaEIsNkNBQVk7Ozs7SUFBWixVQUFhLFVBQVU7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7Z0JBbkRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixrYUFBK0M7aUJBQ2hEOzs7O2dCQUw4QixpQkFBaUI7Z0RBd0RqQyxNQUFNLFNBQUMscUJBQXFCOzs7aUNBUHhDLE1BQU07O0lBVVQsNkJBQUM7Q0FBQSxBQXpERCxJQXlEQztTQXJEWSxzQkFBc0I7OztJQUNqQywrQ0F5Q0U7O0lBQ0YsZ0RBQW9FOzs7OztJQU14RCxnREFBaUU7O0lBQ2pFLHNDQUErQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgT3V0cHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtFZGl0b3JBY3Rpb25CdXR0b259IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5pbXBvcnQge01BVF9CT1RUT01fU0hFRVRfREFUQSwgTWF0Qm90dG9tU2hlZXRSZWZ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1maWx0ZXItbWVudScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1maWx0ZXItbWVudS5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hGaWx0ZXJNZW51Q29tcG9uZW50IHtcclxuICBmaWx0ZXJPcHRpb25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+ID0gW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZGVmYXVsdCcsXHJcbiAgICAgIGljb246ICdmaWx0ZXJfYl9hbmRfdycsXHJcbiAgICAgIGFjdGlvbjogKGZpbHRlcikgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQuZW1pdChmaWx0ZXIpO1xyXG4gICAgICB9LFxyXG4gICAgICB0ZXh0OiAnQiZXJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2J3MicsXHJcbiAgICAgIGljb246ICdmaWx0ZXJfYl9hbmRfdycsXHJcbiAgICAgIGFjdGlvbjogKGZpbHRlcikgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQuZW1pdChmaWx0ZXIpO1xyXG4gICAgICB9LFxyXG4gICAgICB0ZXh0OiAnQiZXIDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnczJyxcclxuICAgICAgaWNvbjogJ2JsdXJfb24nLFxyXG4gICAgICBhY3Rpb246IChmaWx0ZXIpID0+IHtcclxuICAgICAgICB0aGlzLmZpbHRlclNlbGVjdGVkLmVtaXQoZmlsdGVyKTtcclxuICAgICAgfSxcclxuICAgICAgdGV4dDogJ0ImVyAzJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hZ2ljX2NvbG9yJyxcclxuICAgICAgaWNvbjogJ2ZpbHRlcl92aW50YWdlJyxcclxuICAgICAgYWN0aW9uOiAoZmlsdGVyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZC5lbWl0KGZpbHRlcik7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRleHQ6ICdNYWdpYyBDb2xvcidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdvcmlnaW5hbCcsXHJcbiAgICAgIGljb246ICdjcm9wX29yaWdpbmFsJyxcclxuICAgICAgYWN0aW9uOiAoZmlsdGVyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZC5lbWl0KGZpbHRlcik7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRleHQ6ICdPcmlnaW5hbCdcclxuICAgIH0sXHJcbiAgXTtcclxuICBAT3V0cHV0KCkgZmlsdGVyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIHNlbGVjdE9wdGlvbihvcHRpb25OYW1lKSB7XHJcbiAgICB0aGlzLmRhdGEuZmlsdGVyID0gb3B0aW9uTmFtZTtcclxuICAgIHRoaXMuYm90dG9tU2hlZXRSZWYuZGlzbWlzcygpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBib3R0b21TaGVldFJlZjogTWF0Qm90dG9tU2hlZXRSZWY8Tmd4RmlsdGVyTWVudUNvbXBvbmVudD4sXHJcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfQk9UVE9NX1NIRUVUX0RBVEEpIHB1YmxpYyBkYXRhOiBhbnlcclxuICAgICAgICAgICAgICApIHt9XHJcblxyXG59XHJcbiJdfQ==