import { EventEmitter } from '@angular/core';
import { EditorActionButton } from '../../PrivateModels';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import * as i0 from "@angular/core";
export declare class NgxFilterMenuComponent {
    private bottomSheetRef;
    data: any;
    filterOptions: Array<EditorActionButton>;
    filterSelected: EventEmitter<string>;
    selectOption(optionName: any): void;
    constructor(bottomSheetRef: MatBottomSheetRef<NgxFilterMenuComponent>, data: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxFilterMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxFilterMenuComponent, "ngx-filter-menu", never, {}, { "filterSelected": "filterSelected"; }, never, never, false, never>;
}
