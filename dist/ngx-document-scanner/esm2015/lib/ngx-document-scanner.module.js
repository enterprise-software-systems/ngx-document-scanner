/**
 * @fileoverview added by tsickle
 * Generated from: lib/ngx-document-scanner.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NgxDraggablePointComponent } from './components/draggable-point/ngx-draggable-point.component';
import { NgxFilterMenuComponent } from './components/filter-menu/ngx-filter-menu.component';
import { NgxShapeOutlineComponent } from './components/shape-outline/ngx-shape-outline.component';
import { NgxDocScannerComponent } from './components/image-editor/ngx-doc-scanner.component';
import { LimitsService } from './services/limits.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularDraggableModule } from 'angular2-draggable';
import { CommonModule } from '@angular/common';
import { NgxOpenCVModule } from 'ngx-opencv';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { NgxOpenCVService, OpenCvConfigToken } from 'ngx-opencv';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
export class NgxDocumentScannerModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgxDocumentScannerModule,
            providers: [
                { provide: OpenCvConfigToken, useValue: config },
            ],
        };
    }
}
NgxDocumentScannerModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvY3VtZW50LXNjYW5uZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvbmd4LWRvY3VtZW50LXNjYW5uZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDMUYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0RBQXdELENBQUM7QUFDaEcsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDM0YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBc0MzQyxNQUFNLE9BQU8sd0JBQXdCOzs7OztJQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW9CO1FBQ2pDLE9BQU87WUFDTCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQztJQUNKLENBQUM7OztZQTVDRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLDBCQUEwQjtvQkFDMUIsc0JBQXNCO29CQUN0Qix3QkFBd0I7b0JBQ3hCLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsYUFBYTtvQkFDYixzQkFBc0I7b0JBQ3RCLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixlQUFlO29CQUNmLFdBQVc7aUJBQ1o7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsYUFBYTtvQkFDYixzQkFBc0I7b0JBQ3RCLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULGdCQUFnQjtvQkFDaEIsYUFBYTtpQkFDZDthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9kcmFnZ2FibGUtcG9pbnQvbmd4LWRyYWdnYWJsZS1wb2ludC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neEZpbHRlck1lbnVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOZ3hTaGFwZU91dGxpbmVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaGFwZS1vdXRsaW5lL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tmd4RG9jU2Nhbm5lckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2ltYWdlLWVkaXRvci9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtGbGV4TGF5b3V0TW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XHJcbmltcG9ydCB7QW5ndWxhckRyYWdnYWJsZU1vZHVsZX0gZnJvbSAnYW5ndWxhcjItZHJhZ2dhYmxlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7T3BlbkNWQ29uZmlnfSBmcm9tICcuL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7Tmd4T3BlbkNWTW9kdWxlfSBmcm9tICduZ3gtb3BlbmN2JztcclxuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcclxuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IE1hdExpc3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9saXN0JztcclxuaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlLCBPcGVuQ3ZDb25maWdUb2tlbn0gZnJvbSAnbmd4LW9wZW5jdic7XHJcbmltcG9ydCB7TWF0U2xpZGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZXInO1xyXG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgTmd4RHJhZ2dhYmxlUG9pbnRDb21wb25lbnQsXHJcbiAgICBOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LFxyXG4gICAgTmd4U2hhcGVPdXRsaW5lQ29tcG9uZW50LFxyXG4gICAgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCxcclxuICBdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgIEZsZXhMYXlvdXRNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0Qm90dG9tU2hlZXRNb2R1bGUsXHJcbiAgICBNYXRMaXN0TW9kdWxlLFxyXG4gICAgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neE9wZW5DVk1vZHVsZSxcclxuICAgIE1hdFNsaWRlck1vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmxleExheW91dE1vZHVsZSxcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRCb3R0b21TaGVldE1vZHVsZSxcclxuICAgIE1hdExpc3RNb2R1bGUsXHJcbiAgICBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlLFxyXG4gICAgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCxcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgTmd4RmlsdGVyTWVudUNvbXBvbmVudCxcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgTmd4T3BlbkNWU2VydmljZSxcclxuICAgIExpbWl0c1NlcnZpY2UsXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jdW1lbnRTY2FubmVyTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IE9wZW5DVkNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IE5neERvY3VtZW50U2Nhbm5lck1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgeyBwcm92aWRlOiBPcGVuQ3ZDb25maWdUb2tlbiwgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICBdLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19