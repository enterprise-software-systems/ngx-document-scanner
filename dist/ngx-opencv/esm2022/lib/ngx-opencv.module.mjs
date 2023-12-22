import { NgModule } from '@angular/core';
import { NgxOpenCVService, OpenCvConfigToken } from './ngx-open-cv.service';
import * as i0 from "@angular/core";
export class NgxOpenCVModule {
    static forRoot(config) {
        return {
            ngModule: NgxOpenCVModule,
            providers: [{ provide: OpenCvConfigToken, useValue: config }]
        };
    }
    /** @nocollapse */ static { this.ɵfac = function NgxOpenCVModule_Factory(t) { return new (t || NgxOpenCVModule)(); }; }
    /** @nocollapse */ static { this.ɵmod = /** @pureOrBreakMyCode */ i0.ɵɵdefineNgModule({ type: NgxOpenCVModule }); }
    /** @nocollapse */ static { this.ɵinj = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjector({ providers: [NgxOpenCVService] }); }
}
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxOpenCVModule, [{
        type: NgModule,
        args: [{
                declarations: [],
                exports: [],
                providers: [NgxOpenCVService]
            }]
    }], null, null); })();
const a = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9wZW5jdi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtb3BlbmN2L3NyYy9saWIvbmd4LW9wZW5jdi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7O0FBUTVFLE1BQU0sT0FBTyxlQUFlO0lBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBb0I7UUFDakMsT0FBTztZQUNMLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUM5RCxDQUFDO0lBQ0osQ0FBQzttR0FOVSxlQUFlO2tHQUFmLGVBQWU7dUdBRmYsQ0FBQyxnQkFBZ0IsQ0FBQzs7dUZBRWxCLGVBQWU7Y0FMM0IsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsRUFBRTtnQkFDWCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzthQUM5Qjs7QUFVRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPcGVuQ1ZDb25maWcgfSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7IE5neE9wZW5DVlNlcnZpY2UsIE9wZW5DdkNvbmZpZ1Rva2VuIH0gZnJvbSAnLi9uZ3gtb3Blbi1jdi5zZXJ2aWNlJztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW10sXHJcbiAgZXhwb3J0czogW10sXHJcbiAgcHJvdmlkZXJzOiBbTmd4T3BlbkNWU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neE9wZW5DVk1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBPcGVuQ1ZDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neE9wZW5DVk1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IE5neE9wZW5DVk1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBPcGVuQ3ZDb25maWdUb2tlbiwgdXNlVmFsdWU6IGNvbmZpZyB9XVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGEgPSAwO1xyXG4iXX0=