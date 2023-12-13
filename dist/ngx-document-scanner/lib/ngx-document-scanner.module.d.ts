import { ModuleWithProviders } from '@angular/core';
import { OpenCVConfig } from './PublicModels';
import * as i0 from "@angular/core";
import * as i1 from "./components/draggable-point/ngx-draggable-point.component";
import * as i2 from "./components/filter-menu/ngx-filter-menu.component";
import * as i3 from "./components/shape-outline/ngx-shape-outline.component";
import * as i4 from "./components/image-editor/ngx-doc-scanner.component";
import * as i5 from "@angular/flex-layout";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/bottom-sheet";
import * as i9 from "@angular/material/list";
import * as i10 from "angular2-draggable";
import * as i11 from "@angular/common";
import * as i12 from "ngx-opencv";
import * as i13 from "@angular/material/slider";
import * as i14 from "@angular/forms";
export declare class NgxDocumentScannerModule {
    static forRoot(config: OpenCVConfig): ModuleWithProviders<NgxDocumentScannerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxDocumentScannerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxDocumentScannerModule, [typeof i1.NgxDraggablePointComponent, typeof i2.NgxFilterMenuComponent, typeof i3.NgxShapeOutlineComponent, typeof i4.NgxDocScannerComponent], [typeof i5.FlexLayoutModule, typeof i6.MatButtonModule, typeof i7.MatIconModule, typeof i8.MatBottomSheetModule, typeof i9.MatListModule, typeof i10.AngularDraggableModule, typeof i11.CommonModule, typeof i12.NgxOpenCVModule, typeof i13.MatSliderModule, typeof i14.FormsModule], [typeof i5.FlexLayoutModule, typeof i6.MatButtonModule, typeof i7.MatIconModule, typeof i8.MatBottomSheetModule, typeof i9.MatListModule, typeof i10.AngularDraggableModule, typeof i4.NgxDocScannerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxDocumentScannerModule>;
}
