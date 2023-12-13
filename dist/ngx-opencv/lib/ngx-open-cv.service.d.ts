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
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<NgxOpenCVService, never>;
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

//# sourceMappingURL=ngx-open-cv.service.d.ts.map