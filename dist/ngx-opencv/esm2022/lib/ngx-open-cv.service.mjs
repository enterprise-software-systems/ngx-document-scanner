import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export const OpenCvConfigToken = new InjectionToken('OpenCV config object token');
export class NgxOpenCVService {
    constructor(options, _ngZone) {
        this._ngZone = _ngZone;
        this.cvState = new BehaviorSubject({
            ready: false,
            error: false,
            loading: true,
            state: 'loading'
        });
        if (!options) {
            options = {};
        }
        this.configModule = this.generateConfigModule(options);
        this.loadOpenCv();
    }
    /**
     * load the OpenCV script
     */
    loadOpenCv() {
        this.cvState.next(this.newState('loading'));
        // create global module variable
        window['Module'] = this.configModule;
        // create script element and set attributes
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        // listen for errors
        script.addEventListener('error', () => {
            const err = new Error('Failed to load ' + this.configModule.scriptUrl);
            this.cvState.next(this.newState('error'));
            this.cvState.error(err);
        }, { passive: true });
        // set script url
        script.src = this.configModule.scriptUrl;
        // insert script as first script tag
        const node = document.getElementsByTagName('script')[0];
        if (node) {
            node.parentNode.insertBefore(script, node);
        }
        else {
            document.head.appendChild(script);
        }
    }
    /**
     * generates a new state object
     * @param change - the new state of the module
     */
    newState(change) {
        const newStateObj = {
            ready: false,
            loading: false,
            error: false,
            state: ''
        };
        Object.keys(newStateObj).forEach(key => {
            if (key !== 'state') {
                if (key === change) {
                    newStateObj[key] = true;
                    newStateObj.state = key;
                }
                else {
                    newStateObj[key] = false;
                }
            }
        });
        return newStateObj;
    }
    /**
     * generates a config module for the global Module object
     * @param options - configuration options
     */
    generateConfigModule(options) {
        return {
            scriptUrl: options.openCVDirPath ? `${options.openCVDirPath}/opencv.js` : `/assets/opencv/opencv.js`,
            wasmBinaryFile: 'opencv_js.wasm',
            usingWasm: true,
            onRuntimeInitialized: () => {
                this._ngZone.run(() => {
                    console.log('openCV Ready');
                    this.cvState.next(this.newState('ready'));
                    if (options.runOnOpenCVInit) {
                        options.runOnOpenCVInit();
                    }
                });
            }
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.8", ngImport: i0, type: NgxOpenCVService, deps: [{ token: OpenCvConfigToken }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.8", ngImport: i0, type: NgxOpenCVService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.8", ngImport: i0, type: NgxOpenCVService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [OpenCvConfigToken]
                }] }, { type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9wZW4tY3Yuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1vcGVuY3Yvc3JjL2xpYi9uZ3gtb3Blbi1jdi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFHckMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWUsNEJBQTRCLENBQUMsQ0FBQztBQUtoRyxNQUFNLE9BQU8sZ0JBQWdCO0lBVTNCLFlBQXVDLE9BQXFCLEVBQVUsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFSckYsWUFBTyxHQUFHLElBQUksZUFBZSxDQUFjO1lBQ3pDLEtBQUssRUFBRSxLQUFLO1lBQ1osS0FBSyxFQUFFLEtBQUs7WUFDWixPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUlELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsVUFBVTtRQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3QyxnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFckMsMkNBQTJDO1FBQzNDLE1BQU0sTUFBTSxHQUF1QixRQUFR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QjtrQkFINUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQVdjLE1BQU07MkJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7T3BlbkNWQ29uZmlnLCBPcGVuQ1ZTdGF0ZX0gZnJvbSAnLi9tb2RlbHMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IE9wZW5DdkNvbmZpZ1Rva2VuID0gbmV3IEluamVjdGlvblRva2VuPE9wZW5DVkNvbmZpZz4oJ09wZW5DViBjb25maWcgb2JqZWN0IHRva2VuJyk7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hPcGVuQ1ZTZXJ2aWNlIHtcclxuXHJcbiAgY3ZTdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8T3BlbkNWU3RhdGU+KHtcclxuICAgIHJlYWR5OiBmYWxzZSxcclxuICAgIGVycm9yOiBmYWxzZSxcclxuICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICBzdGF0ZTogJ2xvYWRpbmcnXHJcbiAgfSk7XHJcbiAgY29uZmlnTW9kdWxlOiBPcGVuQ3ZDb25maWdNb2R1bGU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoT3BlbkN2Q29uZmlnVG9rZW4pIG9wdGlvbnM6IE9wZW5DVkNvbmZpZywgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcclxuICAgIGlmICghb3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0ge307XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvbmZpZ01vZHVsZSA9IHRoaXMuZ2VuZXJhdGVDb25maWdNb2R1bGUob3B0aW9ucyk7XHJcbiAgICB0aGlzLmxvYWRPcGVuQ3YoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWQgdGhlIE9wZW5DViBzY3JpcHRcclxuICAgKi9cclxuICBsb2FkT3BlbkN2KCkge1xyXG4gICAgdGhpcy5jdlN0YXRlLm5leHQoIHRoaXMubmV3U3RhdGUoJ2xvYWRpbmcnKSk7XHJcbiAgICAvLyBjcmVhdGUgZ2xvYmFsIG1vZHVsZSB2YXJpYWJsZVxyXG4gICAgd2luZG93WydNb2R1bGUnXSA9IHRoaXMuY29uZmlnTW9kdWxlO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBzY3JpcHQgZWxlbWVudCBhbmQgc2V0IGF0dHJpYnV0ZXNcclxuICAgIGNvbnN0IHNjcmlwdCA9IDxIVE1MU2NyaXB0RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdhc3luYycsICcnKTtcclxuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XHJcblxyXG4gICAgLy8gbGlzdGVuIGZvciBlcnJvcnNcclxuICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcclxuICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCAnICsgdGhpcy5jb25maWdNb2R1bGUuc2NyaXB0VXJsKTtcclxuICAgICAgdGhpcy5jdlN0YXRlLm5leHQodGhpcy5uZXdTdGF0ZSgnZXJyb3InKSk7XHJcbiAgICAgIHRoaXMuY3ZTdGF0ZS5lcnJvcihlcnIpO1xyXG4gICAgfSwge3Bhc3NpdmU6IHRydWV9KTtcclxuXHJcbiAgICAvLyBzZXQgc2NyaXB0IHVybFxyXG4gICAgc2NyaXB0LnNyYyA9IHRoaXMuY29uZmlnTW9kdWxlLnNjcmlwdFVybDtcclxuICAgIC8vIGluc2VydCBzY3JpcHQgYXMgZmlyc3Qgc2NyaXB0IHRhZ1xyXG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgIGlmIChub2RlKSB7XHJcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBub2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGdlbmVyYXRlcyBhIG5ldyBzdGF0ZSBvYmplY3RcclxuICAgKiBAcGFyYW0gY2hhbmdlIC0gdGhlIG5ldyBzdGF0ZSBvZiB0aGUgbW9kdWxlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBuZXdTdGF0ZShjaGFuZ2U6ICdsb2FkaW5nJ3wncmVhZHknfCdlcnJvcicpOiBPcGVuQ1ZTdGF0ZSB7XHJcbiAgICBjb25zdCBuZXdTdGF0ZU9iajogT3BlbkNWU3RhdGUgPSB7XHJcbiAgICAgIHJlYWR5OiBmYWxzZSxcclxuICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBmYWxzZSxcclxuICAgICAgc3RhdGU6ICcnXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmtleXMobmV3U3RhdGVPYmopLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgaWYgKGtleSAhPT0gJ3N0YXRlJykge1xyXG4gICAgICAgIGlmIChrZXkgPT09IGNoYW5nZSkge1xyXG4gICAgICAgICAgbmV3U3RhdGVPYmpba2V5XSA9IHRydWU7XHJcbiAgICAgICAgICBuZXdTdGF0ZU9iai5zdGF0ZSA9IGtleTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U3RhdGVPYmpba2V5XSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV3U3RhdGVPYmo7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBnZW5lcmF0ZXMgYSBjb25maWcgbW9kdWxlIGZvciB0aGUgZ2xvYmFsIE1vZHVsZSBvYmplY3RcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2VuZXJhdGVDb25maWdNb2R1bGUob3B0aW9uczogT3BlbkNWQ29uZmlnKTogT3BlbkN2Q29uZmlnTW9kdWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjcmlwdFVybDogb3B0aW9ucy5vcGVuQ1ZEaXJQYXRoID8gYCR7b3B0aW9ucy5vcGVuQ1ZEaXJQYXRofS9vcGVuY3YuanNgIDogYC9hc3NldHMvb3BlbmN2L29wZW5jdi5qc2AsXHJcbiAgICAgIHdhc21CaW5hcnlGaWxlOiAnb3BlbmN2X2pzLndhc20nLFxyXG4gICAgICB1c2luZ1dhc206IHRydWUsXHJcbiAgICAgIG9uUnVudGltZUluaXRpYWxpemVkOiAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnb3BlbkNWIFJlYWR5Jyk7XHJcbiAgICAgICAgICB0aGlzLmN2U3RhdGUubmV4dCh0aGlzLm5ld1N0YXRlKCdyZWFkeScpKTtcclxuICAgICAgICAgIGlmIChvcHRpb25zLnJ1bk9uT3BlbkNWSW5pdCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnJ1bk9uT3BlbkNWSW5pdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGRlc2NyaWJlcyB0aGUgZ2xvYmFsIE1vZHVsZSBvYmplY3QgdGhhdCBpcyB1c2VkIHRvIGluaXRpYXRlIE9wZW5DVi5qc1xyXG4gKi9cclxuaW50ZXJmYWNlIE9wZW5DdkNvbmZpZ01vZHVsZSB7XHJcbiAgc2NyaXB0VXJsOiBzdHJpbmc7XHJcbiAgd2FzbUJpbmFyeUZpbGU6IHN0cmluZztcclxuICB1c2luZ1dhc206IGJvb2xlYW47XHJcbiAgb25SdW50aW1lSW5pdGlhbGl6ZWQ6IEZ1bmN0aW9uO1xyXG59XHJcblxyXG4iXX0=