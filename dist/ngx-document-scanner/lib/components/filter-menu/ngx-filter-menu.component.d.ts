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
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<NgxFilterMenuComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<NgxFilterMenuComponent, "ngx-filter-menu", never, {}, { "filterSelected": "filterSelected"; }, never, never, false, never>;
}

//# sourceMappingURL=ngx-filter-menu.component.d.ts.map