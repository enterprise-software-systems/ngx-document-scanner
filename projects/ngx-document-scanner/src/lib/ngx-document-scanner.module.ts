import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgxDraggablePointComponent} from './components/draggable-point/ngx-draggable-point.component';
import {NgxFilterMenuComponent} from './components/filter-menu/ngx-filter-menu.component';
import {NgxShapeOutlineComponent} from './components/shape-outline/ngx-shape-outline.component';
import {NgxDocScannerComponent} from './components/image-editor/ngx-doc-scanner.component';
import {LimitsService} from './services/limits.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularDraggableModule} from 'angular2-draggable';
import {CommonModule} from '@angular/common';
import {OpenCVConfig} from './PublicModels';
import {NgxOpenCVModule} from 'ngx-opencv';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import {NgxOpenCVService, OpenCvConfigToken} from 'ngx-opencv';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';

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
  entryComponents: [
    NgxFilterMenuComponent,
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
