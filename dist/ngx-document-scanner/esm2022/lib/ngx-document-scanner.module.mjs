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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvY3VtZW50LXNjYW5uZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRvY3VtZW50LXNjYW5uZXIvc3JjL2xpYi9uZ3gtZG9jdW1lbnQtc2Nhbm5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDNUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVsRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM3RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBbUMxRCxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBb0I7UUFDakMsT0FBTztZQUNMLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7YUFDakQ7U0FDRixDQUFDO0lBQ0osQ0FBQztrSUFSVSx3QkFBd0I7bUlBQXhCLHdCQUF3QixpQkEvQmpDLDBCQUEwQjtZQUMxQixzQkFBc0I7WUFDdEIsd0JBQXdCO1lBQ3hCLHNCQUFzQixhQUd0QixnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGFBQWE7WUFDYixvQkFBb0I7WUFDcEIsYUFBYTtZQUNiLHNCQUFzQjtZQUN0QixZQUFZO1lBQ1osZUFBZTtZQUNmLGVBQWU7WUFDZixXQUFXLGFBR1gsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixhQUFhO1lBQ2Isb0JBQW9CO1lBQ3BCLGFBQWE7WUFDYixzQkFBc0I7WUFDdEIsc0JBQXNCO21JQU9iLHdCQUF3QixhQUx4QjtZQUNULGdCQUFnQjtZQUNoQixhQUFhO1NBQ2QsWUF2QkMsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixhQUFhO1lBQ2Isb0JBQW9CO1lBQ3BCLGFBQWE7WUFDYixzQkFBc0I7WUFDdEIsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsV0FBVyxFQUdYLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsYUFBYTtZQUNiLG9CQUFvQjtZQUNwQixhQUFhO1lBQ2Isc0JBQXNCOzs0RkFRYix3QkFBd0I7a0JBakNwQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWiwwQkFBMEI7d0JBQzFCLHNCQUFzQjt3QkFDdEIsd0JBQXdCO3dCQUN4QixzQkFBc0I7cUJBQ3ZCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxnQkFBZ0I7d0JBQ2hCLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGFBQWE7d0JBQ2Isc0JBQXNCO3dCQUN0QixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixXQUFXO3FCQUNaO29CQUNELE9BQU8sRUFBRTt3QkFDUCxnQkFBZ0I7d0JBQ2hCLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGFBQWE7d0JBQ2Isc0JBQXNCO3dCQUN0QixzQkFBc0I7cUJBQ3ZCO29CQUNELFNBQVMsRUFBRTt3QkFDVCxnQkFBZ0I7d0JBQ2hCLGFBQWE7cUJBQ2Q7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGbGV4TGF5b3V0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0Qm90dG9tU2hlZXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xyXG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IE1hdExpc3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9saXN0JztcclxuaW1wb3J0IHsgTWF0U2xpZGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2xpZGVyJztcclxuaW1wb3J0IHsgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLWRyYWdnYWJsZSc7XHJcbmltcG9ydCB7IE5neE9wZW5DVk1vZHVsZSwgTmd4T3BlbkNWU2VydmljZSwgT3BlbkN2Q29uZmlnVG9rZW4gfSBmcm9tICduZ3gtb3BlbmN2JztcclxuaW1wb3J0IHsgT3BlbkNWQ29uZmlnIH0gZnJvbSAnLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQgeyBOZ3hEcmFnZ2FibGVQb2ludENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kcmFnZ2FibGUtcG9pbnQvbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hGaWx0ZXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ZpbHRlci1tZW51L25neC1maWx0ZXItbWVudS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hEb2NTY2FubmVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ltYWdlLWVkaXRvci9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4U2hhcGVPdXRsaW5lQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3NoYXBlLW91dGxpbmUvbmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTGltaXRzU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIE5neERyYWdnYWJsZVBvaW50Q29tcG9uZW50LFxyXG4gICAgTmd4RmlsdGVyTWVudUNvbXBvbmVudCxcclxuICAgIE5neFNoYXBlT3V0bGluZUNvbXBvbmVudCxcclxuICAgIE5neERvY1NjYW5uZXJDb21wb25lbnQsXHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE1hdEJvdHRvbVNoZWV0TW9kdWxlLFxyXG4gICAgTWF0TGlzdE1vZHVsZSxcclxuICAgIEFuZ3VsYXJEcmFnZ2FibGVNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hPcGVuQ1ZNb2R1bGUsXHJcbiAgICBNYXRTbGlkZXJNb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEZsZXhMYXlvdXRNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0Qm90dG9tU2hlZXRNb2R1bGUsXHJcbiAgICBNYXRMaXN0TW9kdWxlLFxyXG4gICAgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSxcclxuICAgIE5neERvY1NjYW5uZXJDb21wb25lbnQsXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIE5neE9wZW5DVlNlcnZpY2UsXHJcbiAgICBMaW1pdHNTZXJ2aWNlLFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERvY3VtZW50U2Nhbm5lck1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBPcGVuQ1ZDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neERvY3VtZW50U2Nhbm5lck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IE5neERvY3VtZW50U2Nhbm5lck1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgeyBwcm92aWRlOiBPcGVuQ3ZDb25maWdUb2tlbiwgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICBdLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19