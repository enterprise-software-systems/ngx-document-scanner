import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { AngularDraggableModule } from 'angular2-draggable';
import { NgxOpenCVModule, NgxOpenCVService, OpenCvConfigToken } from '@ess/ngx-opencv';
import { NgxDraggablePointComponent } from './components/draggable-point/ngx-draggable-point.component';
import { NgxFilterMenuComponent } from './components/filter-menu/ngx-filter-menu.component';
import { NgxDocScannerComponent } from './components/image-editor/ngx-doc-scanner.component';
import { NgxShapeOutlineComponent } from './components/shape-outline/ngx-shape-outline.component';
import { LimitsService } from './services/limits.service';
import * as i0 from "@angular/core";
export class NgxDocumentScannerModule {
    static forRoot(config) {
        return {
            ngModule: NgxDocumentScannerModule,
            providers: [
                { provide: OpenCvConfigToken, useValue: config },
            ],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, declarations: [NgxDraggablePointComponent,
            NgxFilterMenuComponent,
            NgxShapeOutlineComponent,
            NgxDocScannerComponent], imports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            CommonModule,
            NgxOpenCVModule,
            MatSliderModule,
            FormsModule], exports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            NgxDocScannerComponent] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, providers: [
            NgxOpenCVService,
            LimitsService,
        ], imports: [FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule,
            CommonModule,
            NgxOpenCVModule,
            MatSliderModule,
            FormsModule, FlexLayoutModule,
            MatButtonModule,
            MatIconModule,
            MatBottomSheetModule,
            MatListModule,
            AngularDraggableModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocumentScannerModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvY3VtZW50LXNjYW5uZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9uZ3gtZG9jdW1lbnQtc2Nhbm5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDNUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzdGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFtQzFELE1BQU0sT0FBTyx3QkFBd0I7SUFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFvQjtRQUNqQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTthQUNqRDtTQUNGLENBQUM7SUFDSixDQUFDO2tJQVJVLHdCQUF3QjttSUFBeEIsd0JBQXdCLGlCQS9CakMsMEJBQTBCO1lBQzFCLHNCQUFzQjtZQUN0Qix3QkFBd0I7WUFDeEIsc0JBQXNCLGFBR3RCLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsYUFBYTtZQUNiLG9CQUFvQjtZQUNwQixhQUFhO1lBQ2Isc0JBQXNCO1lBQ3RCLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLFdBQVcsYUFHWCxnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGFBQWE7WUFDYixvQkFBb0I7WUFDcEIsYUFBYTtZQUNiLHNCQUFzQjtZQUN0QixzQkFBc0I7bUlBT2Isd0JBQXdCLGFBTHhCO1lBQ1QsZ0JBQWdCO1lBQ2hCLGFBQWE7U0FDZCxZQXZCQyxnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGFBQWE7WUFDYixvQkFBb0I7WUFDcEIsYUFBYTtZQUNiLHNCQUFzQjtZQUN0QixZQUFZO1lBQ1osZUFBZTtZQUNmLGVBQWU7WUFDZixXQUFXLEVBR1gsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixhQUFhO1lBQ2Isb0JBQW9CO1lBQ3BCLGFBQWE7WUFDYixzQkFBc0I7OzRGQVFiLHdCQUF3QjtrQkFqQ3BDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLDBCQUEwQjt3QkFDMUIsc0JBQXNCO3dCQUN0Qix3QkFBd0I7d0JBQ3hCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGdCQUFnQjt3QkFDaEIsZUFBZTt3QkFDZixhQUFhO3dCQUNiLG9CQUFvQjt3QkFDcEIsYUFBYTt3QkFDYixzQkFBc0I7d0JBQ3RCLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLFdBQVc7cUJBQ1o7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGdCQUFnQjt3QkFDaEIsZUFBZTt3QkFDZixhQUFhO3dCQUNiLG9CQUFvQjt3QkFDcEIsYUFBYTt3QkFDYixzQkFBc0I7d0JBQ3RCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULGdCQUFnQjt3QkFDaEIsYUFBYTtxQkFDZDtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuaW1wb3J0IHsgTWF0TGlzdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xpc3QnO1xyXG5pbXBvcnQgeyBNYXRTbGlkZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZXInO1xyXG5pbXBvcnQgeyBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhcjItZHJhZ2dhYmxlJztcclxuaW1wb3J0IHsgTmd4T3BlbkNWTW9kdWxlLCBOZ3hPcGVuQ1ZTZXJ2aWNlLCBPcGVuQ3ZDb25maWdUb2tlbiB9IGZyb20gJ0Blc3Mvbmd4LW9wZW5jdic7XHJcbmltcG9ydCB7IE9wZW5DVkNvbmZpZyB9IGZyb20gJy4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHsgTmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZHJhZ2dhYmxlLXBvaW50L25neC1kcmFnZ2FibGUtcG9pbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4RmlsdGVyTWVudUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pbWFnZS1lZGl0b3Ivbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neFNoYXBlT3V0bGluZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zaGFwZS1vdXRsaW5lL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExpbWl0c1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBOZ3hEcmFnZ2FibGVQb2ludENvbXBvbmVudCxcclxuICAgIE5neEZpbHRlck1lbnVDb21wb25lbnQsXHJcbiAgICBOZ3hTaGFwZU91dGxpbmVDb21wb25lbnQsXHJcbiAgICBOZ3hEb2NTY2FubmVyQ29tcG9uZW50LFxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgRmxleExheW91dE1vZHVsZSxcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRCb3R0b21TaGVldE1vZHVsZSxcclxuICAgIE1hdExpc3RNb2R1bGUsXHJcbiAgICBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTmd4T3BlbkNWTW9kdWxlLFxyXG4gICAgTWF0U2xpZGVyTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE1hdEJvdHRvbVNoZWV0TW9kdWxlLFxyXG4gICAgTWF0TGlzdE1vZHVsZSxcclxuICAgIEFuZ3VsYXJEcmFnZ2FibGVNb2R1bGUsXHJcbiAgICBOZ3hEb2NTY2FubmVyQ29tcG9uZW50LFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBOZ3hPcGVuQ1ZTZXJ2aWNlLFxyXG4gICAgTGltaXRzU2VydmljZSxcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEb2N1bWVudFNjYW5uZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogT3BlbkNWQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxOZ3hEb2N1bWVudFNjYW5uZXJNb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBOZ3hEb2N1bWVudFNjYW5uZXJNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogT3BlbkN2Q29uZmlnVG9rZW4sIHVzZVZhbHVlOiBjb25maWcgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==