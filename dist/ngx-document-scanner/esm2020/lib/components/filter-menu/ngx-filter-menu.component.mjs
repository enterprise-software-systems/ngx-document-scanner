import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/bottom-sheet";
import * as i2 from "@angular/flex-layout/flex";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/list";
import * as i5 from "@angular/common";
function NgxFilterMenuComponent_button_1_mat_icon_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1, "done");
    i0.ɵɵelementEnd();
} }
function NgxFilterMenuComponent_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 1);
    i0.ɵɵlistener("click", function NgxFilterMenuComponent_button_1_Template_button_click_0_listener() { const restoredCtx = i0.ɵɵrestoreView(_r4); const option_r1 = restoredCtx.$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.selectOption(option_r1.name)); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 2);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "span", 3);
    i0.ɵɵtemplate(6, NgxFilterMenuComponent_button_1_mat_icon_6_Template, 2, 0, "mat-icon", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(option_r1.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(option_r1.text);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", option_r1.name === ctx_r0.data.filter);
} }
export class NgxFilterMenuComponent {
    selectOption(optionName) {
        this.data.filter = optionName;
        this.bottomSheetRef.dismiss();
    }
    constructor(bottomSheetRef, data) {
        this.bottomSheetRef = bottomSheetRef;
        this.data = data;
        this.filterOptions = [
            {
                name: 'default',
                icon: 'filter_b_and_w',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W'
            },
            {
                name: 'bw2',
                icon: 'filter_b_and_w',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W 2'
            },
            {
                name: 'bw3',
                icon: 'blur_on',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'B&W 3'
            },
            {
                name: 'magic_color',
                icon: 'filter_vintage',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'Magic Color'
            },
            {
                name: 'original',
                icon: 'crop_original',
                action: (filter) => {
                    this.filterSelected.emit(filter);
                },
                text: 'Original'
            },
        ];
        this.filterSelected = new EventEmitter();
    }
}
/** @nocollapse */ NgxFilterMenuComponent.ɵfac = function NgxFilterMenuComponent_Factory(t) { return new (t || NgxFilterMenuComponent)(i0.ɵɵdirectiveInject(i1.MatBottomSheetRef), i0.ɵɵdirectiveInject(MAT_BOTTOM_SHEET_DATA)); };
/** @nocollapse */ NgxFilterMenuComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NgxFilterMenuComponent, selectors: [["ngx-filter-menu"]], outputs: { filterSelected: "filterSelected" }, decls: 2, vars: 1, consts: [["mat-list-item", "", 3, "click", 4, "ngFor", "ngForOf"], ["mat-list-item", "", 3, "click"], ["fxFlex", "100", 2, "text-align", "start", "margin", "5px"], ["fxFlex", "100"], [4, "ngIf"]], template: function NgxFilterMenuComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "mat-action-list");
        i0.ɵɵtemplate(1, NgxFilterMenuComponent_button_1_Template, 7, 3, "button", 0);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", ctx.filterOptions);
    } }, dependencies: [i2.DefaultFlexDirective, i3.MatIcon, i4.MatActionList, i4.MatListItem, i5.NgForOf, i5.NgIf], encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxFilterMenuComponent, [{
        type: Component,
        args: [{ selector: 'ngx-filter-menu', template: "<mat-action-list>\r\n  <button mat-list-item *ngFor=\"let option of filterOptions\" (click)=\"selectOption(option.name)\">\r\n    <mat-icon>{{option.icon}}</mat-icon>\r\n    <span fxFlex=\"100\" style=\"text-align: start; margin: 5px\">{{option.text}}</span>\r\n    <span fxFlex=\"100\"></span>\r\n    <mat-icon *ngIf=\"option.name === data.filter\">done</mat-icon>\r\n  </button>\r\n</mat-action-list>\r\n" }]
    }], function () { return [{ type: i1.MatBottomSheetRef }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_BOTTOM_SHEET_DATA]
            }] }]; }, { filterSelected: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZpbHRlci1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kb2N1bWVudC1zY2FubmVyL3NyYy9saWIvY29tcG9uZW50cy9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9jb21wb25lbnRzL2ZpbHRlci1tZW51L25neC1maWx0ZXItbWVudS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXRFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOzs7Ozs7OztJQ0dwRixnQ0FBOEM7SUFBQSxvQkFBSTtJQUFBLGlCQUFXOzs7O0lBSi9ELGlDQUErRjtJQUFwQyxtT0FBUyxlQUFBLG1DQUF5QixDQUFBLElBQUM7SUFDNUYsZ0NBQVU7SUFBQSxZQUFlO0lBQUEsaUJBQVc7SUFDcEMsK0JBQTBEO0lBQUEsWUFBZTtJQUFBLGlCQUFPO0lBQ2hGLDBCQUEwQjtJQUMxQiwwRkFBNkQ7SUFDL0QsaUJBQVM7Ozs7SUFKRyxlQUFlO0lBQWYsb0NBQWU7SUFDaUMsZUFBZTtJQUFmLG9DQUFlO0lBRTlELGVBQWlDO0lBQWpDLDREQUFpQzs7QURHaEQsTUFBTSxPQUFPLHNCQUFzQjtJQTRDakMsWUFBWSxDQUFDLFVBQVU7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFlBQW9CLGNBQXlELEVBQzNCLElBQVM7UUFEdkMsbUJBQWMsR0FBZCxjQUFjLENBQTJDO1FBQzNCLFNBQUksR0FBSixJQUFJLENBQUs7UUFqRDNELGtCQUFhLEdBQThCO1lBQ3pDO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxJQUFJLEVBQUUsS0FBSzthQUNaO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUNELElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsU0FBUztnQkFDZixNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87YUFDZDtZQUNEO2dCQUNFLElBQUksRUFBRSxhQUFhO2dCQUNuQixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLGFBQWE7YUFDcEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxJQUFJLEVBQUUsVUFBVTthQUNqQjtTQUNGLENBQUM7UUFDUSxtQkFBYyxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBUXJELENBQUM7OytHQW5ETCxzQkFBc0IsbUVBa0RiLHFCQUFxQjt3R0FsRDlCLHNCQUFzQjtRQ1JuQyx1Q0FBaUI7UUFDZiw2RUFLUztRQUNYLGlCQUFrQjs7UUFOeUIsZUFBZ0I7UUFBaEIsMkNBQWdCOzt1RkRPOUMsc0JBQXNCO2NBSmxDLFNBQVM7MkJBQ0UsaUJBQWlCOztzQkFxRGQsTUFBTTt1QkFBQyxxQkFBcUI7d0JBUC9CLGNBQWM7a0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7RWRpdG9yQWN0aW9uQnV0dG9ufSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuaW1wb3J0IHtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIE1hdEJvdHRvbVNoZWV0UmVmfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZmlsdGVyLW1lbnUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50Lmh0bWwnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RmlsdGVyTWVudUNvbXBvbmVudCB7XHJcbiAgZmlsdGVyT3B0aW9uczogQXJyYXk8RWRpdG9yQWN0aW9uQnV0dG9uPiA9IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2RlZmF1bHQnLFxyXG4gICAgICBpY29uOiAnZmlsdGVyX2JfYW5kX3cnLFxyXG4gICAgICBhY3Rpb246IChmaWx0ZXIpID0+IHtcclxuICAgICAgICB0aGlzLmZpbHRlclNlbGVjdGVkLmVtaXQoZmlsdGVyKTtcclxuICAgICAgfSxcclxuICAgICAgdGV4dDogJ0ImVydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdidzInLFxyXG4gICAgICBpY29uOiAnZmlsdGVyX2JfYW5kX3cnLFxyXG4gICAgICBhY3Rpb246IChmaWx0ZXIpID0+IHtcclxuICAgICAgICB0aGlzLmZpbHRlclNlbGVjdGVkLmVtaXQoZmlsdGVyKTtcclxuICAgICAgfSxcclxuICAgICAgdGV4dDogJ0ImVyAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2J3MycsXHJcbiAgICAgIGljb246ICdibHVyX29uJyxcclxuICAgICAgYWN0aW9uOiAoZmlsdGVyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZC5lbWl0KGZpbHRlcik7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRleHQ6ICdCJlcgMydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYWdpY19jb2xvcicsXHJcbiAgICAgIGljb246ICdmaWx0ZXJfdmludGFnZScsXHJcbiAgICAgIGFjdGlvbjogKGZpbHRlcikgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQuZW1pdChmaWx0ZXIpO1xyXG4gICAgICB9LFxyXG4gICAgICB0ZXh0OiAnTWFnaWMgQ29sb3InXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnb3JpZ2luYWwnLFxyXG4gICAgICBpY29uOiAnY3JvcF9vcmlnaW5hbCcsXHJcbiAgICAgIGFjdGlvbjogKGZpbHRlcikgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQuZW1pdChmaWx0ZXIpO1xyXG4gICAgICB9LFxyXG4gICAgICB0ZXh0OiAnT3JpZ2luYWwnXHJcbiAgICB9LFxyXG4gIF07XHJcbiAgQE91dHB1dCgpIGZpbHRlclNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBzZWxlY3RPcHRpb24ob3B0aW9uTmFtZSkge1xyXG4gICAgdGhpcy5kYXRhLmZpbHRlciA9IG9wdGlvbk5hbWU7XHJcbiAgICB0aGlzLmJvdHRvbVNoZWV0UmVmLmRpc21pc3MoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYm90dG9tU2hlZXRSZWY6IE1hdEJvdHRvbVNoZWV0UmVmPE5neEZpbHRlck1lbnVDb21wb25lbnQ+LFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0JPVFRPTV9TSEVFVF9EQVRBKSBwdWJsaWMgZGF0YTogYW55XHJcbiAgICAgICAgICAgICAgKSB7fVxyXG5cclxufVxyXG4iLCI8bWF0LWFjdGlvbi1saXN0PlxyXG4gIDxidXR0b24gbWF0LWxpc3QtaXRlbSAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIGZpbHRlck9wdGlvbnNcIiAoY2xpY2spPVwic2VsZWN0T3B0aW9uKG9wdGlvbi5uYW1lKVwiPlxyXG4gICAgPG1hdC1pY29uPnt7b3B0aW9uLmljb259fTwvbWF0LWljb24+XHJcbiAgICA8c3BhbiBmeEZsZXg9XCIxMDBcIiBzdHlsZT1cInRleHQtYWxpZ246IHN0YXJ0OyBtYXJnaW46IDVweFwiPnt7b3B0aW9uLnRleHR9fTwvc3Bhbj5cclxuICAgIDxzcGFuIGZ4RmxleD1cIjEwMFwiPjwvc3Bhbj5cclxuICAgIDxtYXQtaWNvbiAqbmdJZj1cIm9wdGlvbi5uYW1lID09PSBkYXRhLmZpbHRlclwiPmRvbmU8L21hdC1pY29uPlxyXG4gIDwvYnV0dG9uPlxyXG48L21hdC1hY3Rpb24tbGlzdD5cclxuIl19