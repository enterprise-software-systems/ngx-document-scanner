import { EventEmitter } from '@angular/core';
import { EditorActionButton } from '../../PrivateModels';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import * as ɵngcc0 from '@angular/core';
export declare class NgxFilterMenuComponent {
    private bottomSheetRef;
    data: any;
    filterOptions: Array<EditorActionButton>;
    filterSelected: EventEmitter<string>;
    selectOption(optionName: any): void;
    constructor(bottomSheetRef: MatBottomSheetRef<NgxFilterMenuComponent>, data: any);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgxFilterMenuComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgxFilterMenuComponent, "ngx-filter-menu", never, {}, { "filterSelected": "filterSelected"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZpbHRlci1tZW51LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFZGl0b3JBY3Rpb25CdXR0b24gfSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuaW1wb3J0IHsgTWF0Qm90dG9tU2hlZXRSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBOZ3hGaWx0ZXJNZW51Q29tcG9uZW50IHtcclxuICAgIHByaXZhdGUgYm90dG9tU2hlZXRSZWY7XHJcbiAgICBkYXRhOiBhbnk7XHJcbiAgICBmaWx0ZXJPcHRpb25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+O1xyXG4gICAgZmlsdGVyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxzdHJpbmc+O1xyXG4gICAgc2VsZWN0T3B0aW9uKG9wdGlvbk5hbWU6IGFueSk6IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcihib3R0b21TaGVldFJlZjogTWF0Qm90dG9tU2hlZXRSZWY8Tmd4RmlsdGVyTWVudUNvbXBvbmVudD4sIGRhdGE6IGFueSk7XHJcbn1cclxuIl19