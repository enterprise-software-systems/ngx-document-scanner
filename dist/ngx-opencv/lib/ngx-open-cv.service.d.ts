import { InjectionToken, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OpenCVConfig, OpenCVState } from './models';
import * as ɵngcc0 from '@angular/core';
export declare const OpenCvConfigToken: InjectionToken<OpenCVConfig>;
export declare class NgxOpenCVService {
    private _ngZone;
    cvState: BehaviorSubject<OpenCVState>;
    configModule: OpenCvConfigModule;
    constructor(options: OpenCVConfig, _ngZone: NgZone);
    /**
     * load the OpenCV script
     */
    loadOpenCv(): void;
    /**
     * generates a new state object
     * @param change - the new state of the module
     */
    private newState;
    /**
     * generates a config module for the global Module object
     * @param options - configuration options
     */
    private generateConfigModule;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgxOpenCVService, never>;
}
/**
 * describes the global Module object that is used to initiate OpenCV.js
 */
interface OpenCvConfigModule {
    scriptUrl: string;
    wasmBinaryFile: string;
    usingWasm: boolean;
    onRuntimeInitialized: Function;
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9wZW4tY3Yuc2VydmljZS5kLnRzIiwic291cmNlcyI6WyJuZ3gtb3Blbi1jdi5zZXJ2aWNlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE9wZW5DVkNvbmZpZywgT3BlbkNWU3RhdGUgfSBmcm9tICcuL21vZGVscyc7XHJcbmV4cG9ydCBkZWNsYXJlIGNvbnN0IE9wZW5DdkNvbmZpZ1Rva2VuOiBJbmplY3Rpb25Ub2tlbjxPcGVuQ1ZDb25maWc+O1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBOZ3hPcGVuQ1ZTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25nWm9uZTtcclxuICAgIGN2U3RhdGU6IEJlaGF2aW9yU3ViamVjdDxPcGVuQ1ZTdGF0ZT47XHJcbiAgICBjb25maWdNb2R1bGU6IE9wZW5DdkNvbmZpZ01vZHVsZTtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9wZW5DVkNvbmZpZywgX25nWm9uZTogTmdab25lKTtcclxuICAgIC8qKlxyXG4gICAgICogbG9hZCB0aGUgT3BlbkNWIHNjcmlwdFxyXG4gICAgICovXHJcbiAgICBsb2FkT3BlbkN2KCk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGdlbmVyYXRlcyBhIG5ldyBzdGF0ZSBvYmplY3RcclxuICAgICAqIEBwYXJhbSBjaGFuZ2UgLSB0aGUgbmV3IHN0YXRlIG9mIHRoZSBtb2R1bGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBuZXdTdGF0ZTtcclxuICAgIC8qKlxyXG4gICAgICogZ2VuZXJhdGVzIGEgY29uZmlnIG1vZHVsZSBmb3IgdGhlIGdsb2JhbCBNb2R1bGUgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlQ29uZmlnTW9kdWxlO1xyXG59XHJcbi8qKlxyXG4gKiBkZXNjcmliZXMgdGhlIGdsb2JhbCBNb2R1bGUgb2JqZWN0IHRoYXQgaXMgdXNlZCB0byBpbml0aWF0ZSBPcGVuQ1YuanNcclxuICovXHJcbmludGVyZmFjZSBPcGVuQ3ZDb25maWdNb2R1bGUge1xyXG4gICAgc2NyaXB0VXJsOiBzdHJpbmc7XHJcbiAgICB3YXNtQmluYXJ5RmlsZTogc3RyaW5nO1xyXG4gICAgdXNpbmdXYXNtOiBib29sZWFuO1xyXG4gICAgb25SdW50aW1lSW5pdGlhbGl6ZWQ6IEZ1bmN0aW9uO1xyXG59XHJcbmV4cG9ydCB7fTtcclxuIl19