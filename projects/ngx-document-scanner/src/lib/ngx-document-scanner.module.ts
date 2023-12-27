import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { AngularDraggableModule } from 'angular2-draggable';
import { NgxOpenCVModule, NgxOpenCVService, OpenCvConfigToken } from '@ess/ngx-opencv';
import { OpenCVConfig } from './PublicModels';
import { NgxDraggablePointComponent } from './components/draggable-point/ngx-draggable-point.component';
import { NgxFilterMenuComponent } from './components/filter-menu/ngx-filter-menu.component';
import { NgxDocScannerComponent } from './components/image-editor/ngx-doc-scanner.component';
import { NgxShapeOutlineComponent } from './components/shape-outline/ngx-shape-outline.component';
import { LimitsService } from './services/limits.service';

@NgModule({
  declarations: [
    NgxDraggablePointComponent,
    NgxFilterMenuComponent,
    NgxShapeOutlineComponent,
    NgxDocScannerComponent,
  ],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatListModule,
    AngularDraggableModule,
    CommonModule,
    NgxOpenCVModule,
    MatSliderModule,
    FormsModule,
  ],
  exports: [
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatListModule,
    AngularDraggableModule,
    NgxDocScannerComponent,
  ],
  providers: [
    NgxOpenCVService,
    LimitsService,
  ]
})
export class NgxDocumentScannerModule {
  static forRoot(config: OpenCVConfig): ModuleWithProviders<NgxDocumentScannerModule> {
    return {
      ngModule: NgxDocumentScannerModule,
      providers: [
        { provide: OpenCvConfigToken, useValue: config },
      ],
    };
  }
}
