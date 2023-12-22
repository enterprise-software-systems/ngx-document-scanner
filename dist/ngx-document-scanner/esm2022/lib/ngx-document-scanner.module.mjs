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
import { NgxOpenCVModule, NgxOpenCVService, OpenCvConfigToken } from 'ngx-opencv';
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
    /** @nocollapse */ static { this.ɵfac = function NgxDocumentScannerModule_Factory(t) { return new (t || NgxDocumentScannerModule)(); }; }
    /** @nocollapse */ static { this.ɵmod = /** @pureOrBreakMyCode */ i0.ɵɵdefineNgModule({ type: NgxDocumentScannerModule }); }
    /** @nocollapse */ static { this.ɵinj = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjector({ providers: [
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
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxDocumentScannerModule, [{
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
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxDocumentScannerModule, { declarations: [NgxDraggablePointComponent,
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
        NgxDocScannerComponent] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvY3VtZW50LXNjYW5uZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9uZ3gtZG9jdW1lbnQtc2Nhbm5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDNUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVsRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM3RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBbUMxRCxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBb0I7UUFDakMsT0FBTztZQUNMLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7YUFDakQ7U0FDRixDQUFDO0lBQ0osQ0FBQzs0R0FSVSx3QkFBd0I7a0dBQXhCLHdCQUF3Qjt1R0FMeEI7WUFDVCxnQkFBZ0I7WUFDaEIsYUFBYTtTQUNkLFlBdkJDLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsYUFBYTtZQUNiLG9CQUFvQjtZQUNwQixhQUFhO1lBQ2Isc0JBQXNCO1lBQ3RCLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLFdBQVcsRUFHWCxnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGFBQWE7WUFDYixvQkFBb0I7WUFDcEIsYUFBYTtZQUNiLHNCQUFzQjs7dUZBUWIsd0JBQXdCO2NBakNwQyxRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLDBCQUEwQjtvQkFDMUIsc0JBQXNCO29CQUN0Qix3QkFBd0I7b0JBQ3hCLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsYUFBYTtvQkFDYixzQkFBc0I7b0JBQ3RCLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixlQUFlO29CQUNmLFdBQVc7aUJBQ1o7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsYUFBYTtvQkFDYixzQkFBc0I7b0JBQ3RCLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULGdCQUFnQjtvQkFDaEIsYUFBYTtpQkFDZDthQUNGOzt3RkFDWSx3QkFBd0IsbUJBL0JqQywwQkFBMEI7UUFDMUIsc0JBQXNCO1FBQ3RCLHdCQUF3QjtRQUN4QixzQkFBc0IsYUFHdEIsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGFBQWE7UUFDYixzQkFBc0I7UUFDdEIsWUFBWTtRQUNaLGVBQWU7UUFDZixlQUFlO1FBQ2YsV0FBVyxhQUdYLGdCQUFnQjtRQUNoQixlQUFlO1FBQ2YsYUFBYTtRQUNiLG9CQUFvQjtRQUNwQixhQUFhO1FBQ2Isc0JBQXNCO1FBQ3RCLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuaW1wb3J0IHsgTWF0TGlzdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xpc3QnO1xyXG5pbXBvcnQgeyBNYXRTbGlkZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZXInO1xyXG5pbXBvcnQgeyBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhcjItZHJhZ2dhYmxlJztcclxuaW1wb3J0IHsgTmd4T3BlbkNWTW9kdWxlLCBOZ3hPcGVuQ1ZTZXJ2aWNlLCBPcGVuQ3ZDb25maWdUb2tlbiB9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5pbXBvcnQgeyBPcGVuQ1ZDb25maWcgfSBmcm9tICcuL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7IE5neERyYWdnYWJsZVBvaW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RyYWdnYWJsZS1wb2ludC9uZ3gtZHJhZ2dhYmxlLXBvaW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEZpbHRlck1lbnVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neERvY1NjYW5uZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hTaGFwZU91dGxpbmVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc2hhcGUtb3V0bGluZS9uZ3gtc2hhcGUtb3V0bGluZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgTmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnQsXHJcbiAgICBOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LFxyXG4gICAgTmd4U2hhcGVPdXRsaW5lQ29tcG9uZW50LFxyXG4gICAgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCxcclxuICBdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgIEZsZXhMYXlvdXRNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0Qm90dG9tU2hlZXRNb2R1bGUsXHJcbiAgICBNYXRMaXN0TW9kdWxlLFxyXG4gICAgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neE9wZW5DVk1vZHVsZSxcclxuICAgIE1hdFNsaWRlck1vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmxleExheW91dE1vZHVsZSxcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRCb3R0b21TaGVldE1vZHVsZSxcclxuICAgIE1hdExpc3RNb2R1bGUsXHJcbiAgICBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlLFxyXG4gICAgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCxcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgTmd4T3BlbkNWU2VydmljZSxcclxuICAgIExpbWl0c1NlcnZpY2UsXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jdW1lbnRTY2FubmVyTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IE9wZW5DVkNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4RG9jdW1lbnRTY2FubmVyTW9kdWxlPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogTmd4RG9jdW1lbnRTY2FubmVyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICB7IHByb3ZpZGU6IE9wZW5DdkNvbmZpZ1Rva2VuLCB1c2VWYWx1ZTogY29uZmlnIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=