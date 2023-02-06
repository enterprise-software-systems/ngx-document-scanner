/**
 * @fileoverview added by tsickle
 * Generated from: lib/PublicModels.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function OpenCVState() { }
if (false) {
    /** @type {?} */
    OpenCVState.prototype.ready;
    /** @type {?} */
    OpenCVState.prototype.loading;
    /** @type {?} */
    OpenCVState.prototype.error;
    /** @type {?} */
    OpenCVState.prototype.state;
}
/**
 * describes an object with width and height properties
 * @record
 */
export function ImageDimensions() { }
if (false) {
    /** @type {?} */
    ImageDimensions.prototype.width;
    /** @type {?} */
    ImageDimensions.prototype.height;
}
/**
 * threshold information for automatically detecting corners
 * @record
 */
export function ThresholdInformation() { }
if (false) {
    /** @type {?} */
    ThresholdInformation.prototype.thresholdType;
    /**
     * Non-zero value assigned to the pixels for which the condition is satisfied
     * @type {?|undefined}
     */
    ThresholdInformation.prototype.maxValue;
    /**
     * Size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.
     * Only used with adaptive threshold variants
     * @type {?|undefined}
     */
    ThresholdInformation.prototype.blockSize;
    /**
     *  Constant subtracted from the mean or weighted mean (see the details below).
     *  Normally, it is positive but may be zero or negative as well.
     *  Only used with adaptive threshold variants
     * @type {?|undefined}
     */
    ThresholdInformation.prototype.c;
    /**
     * threshold value. Only used with standard threshold type.
     * @type {?|undefined}
     */
    ThresholdInformation.prototype.thresh;
}
/**
 * describes a configuration object for the editor
 * @record
 */
export function DocScannerConfig() { }
if (false) {
    /**
     * whether filter options are enabled
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.filterEnable;
    /**
     * max dimensions of output image. if set to zero will not resize the image
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.maxImageDimensions;
    /**
     * background color of the main editor div
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.editorBackgroundColor;
    /**
     * css properties for the main editor div
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.editorDimensions;
    /**
     * css that will be added to the main div of the editor component
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.extraCss;
    /**
     * material design theme color name
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.buttonThemeColor;
    /**
     * icon for the button that completes the editing and emits the edited image
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.exportImageIcon;
    /**
     * color of the crop tool (points and connecting lines)
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.cropToolColor;
    /**
     * shape of the crop tool points
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.cropToolShape;
    /**
     * width and height of the crop tool points
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.cropToolDimensions;
    /**
     * weight of the crop tool's connecting lines
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.cropToolLineWeight;
    /**
     * max width of the preview pane
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.maxPreviewWidth;
    /**
     * max height of the preview pane
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.maxPreviewHeight;
    /**
     * config threshold for auto
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.thresholdInfo;
    /**
     * whether rotated rectangle is used
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.useRotatedRectangle;
}
/**
 * describes a configuration object for the OpenCV service
 * @record
 */
export function OpenCVConfig() { }
if (false) {
    /**
     * path to the directory containing the OpenCV files, in the form of '/path/to/<opencv directory>'
     * directory must contain the the following files:
     * --<OpenCvDir>
     * ----opencv.js
     * ----opencv_js.wasm
     * @type {?|undefined}
     */
    OpenCVConfig.prototype.openCVDirPath;
    /**
     * additional callback that will run when OpenCv has finished loading and parsing
     * @type {?|undefined}
     */
    OpenCVConfig.prototype.runOnOpenCVInit;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGljTW9kZWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvUHVibGljTW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsaUNBS0M7OztJQUpDLDRCQUFlOztJQUNmLDhCQUFpQjs7SUFDakIsNEJBQWU7O0lBQ2YsNEJBQWM7Ozs7OztBQU1oQixxQ0FHQzs7O0lBRkMsZ0NBQWM7O0lBQ2QsaUNBQWU7Ozs7OztBQU1qQiwwQ0F1QkM7OztJQXRCQyw2Q0FBa0U7Ozs7O0lBSWxFLHdDQUFrQjs7Ozs7O0lBS2xCLHlDQUFtQjs7Ozs7OztJQU1uQixpQ0FBVzs7Ozs7SUFJWCxzQ0FBZ0I7Ozs7OztBQVFsQixzQ0E4REM7Ozs7OztJQTFEQyx3Q0FBdUI7Ozs7O0lBSXZCLDhDQUFxQzs7Ozs7SUFJckMsaURBQStCOzs7OztJQUkvQiw0Q0FBc0Q7Ozs7O0lBSXRELG9DQUE4Qzs7Ozs7SUFJOUMsNENBQWlEOzs7OztJQUlqRCwyQ0FBeUI7Ozs7O0lBSXpCLHlDQUF1Qjs7Ozs7SUFJdkIseUNBQTJCOzs7OztJQUkzQiw4Q0FBcUM7Ozs7O0lBSXJDLDhDQUE0Qjs7Ozs7SUFJNUIsMkNBQXlCOzs7OztJQUl6Qiw0Q0FBMEI7Ozs7O0lBSTFCLHlDQUFxQzs7Ozs7SUFJckMsK0NBQThCOzs7Ozs7QUFPaEMsa0NBYUM7Ozs7Ozs7Ozs7SUFMQyxxQ0FBdUI7Ozs7O0lBSXZCLHVDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBkZXNjcmliZXMgYSBzdGF0ZSBvYmplY3QgZm9yIHRoZSBPcGVuQ1YgbW9kdWxlXHJcbiAqL1xyXG5pbXBvcnQge1BvaW50U2hhcGV9IGZyb20gJy4vUHJpdmF0ZU1vZGVscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wZW5DVlN0YXRlIHtcclxuICByZWFkeTogYm9vbGVhbjtcclxuICBsb2FkaW5nOiBib29sZWFuO1xyXG4gIGVycm9yOiBib29sZWFuO1xyXG4gIHN0YXRlOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkZXNjcmliZXMgYW4gb2JqZWN0IHdpdGggd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0aWVzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlRGltZW5zaW9ucyB7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIHRocmVzaG9sZCBpbmZvcm1hdGlvbiBmb3IgYXV0b21hdGljYWxseSBkZXRlY3RpbmcgY29ybmVyc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBUaHJlc2hvbGRJbmZvcm1hdGlvbiB7XHJcbiAgdGhyZXNob2xkVHlwZTogJ3N0YW5kYXJkJyB8ICdhZGFwdGl2ZV9tZWFuJyB8ICdhZGFwdGl2ZV9nYXVzc2lhbic7XHJcbiAgLyoqXHJcbiAgICogTm9uLXplcm8gdmFsdWUgYXNzaWduZWQgdG8gdGhlIHBpeGVscyBmb3Igd2hpY2ggdGhlIGNvbmRpdGlvbiBpcyBzYXRpc2ZpZWRcclxuICAgKi9cclxuICBtYXhWYWx1ZT86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBTaXplIG9mIGEgcGl4ZWwgbmVpZ2hib3Job29kIHRoYXQgaXMgdXNlZCB0byBjYWxjdWxhdGUgYSB0aHJlc2hvbGQgdmFsdWUgZm9yIHRoZSBwaXhlbDogMywgNSwgNywgYW5kIHNvIG9uLlxyXG4gICAqIE9ubHkgdXNlZCB3aXRoIGFkYXB0aXZlIHRocmVzaG9sZCB2YXJpYW50c1xyXG4gICAqL1xyXG4gIGJsb2NrU2l6ZT86IG51bWJlcjtcclxuICAvKipcclxuICAgKiAgQ29uc3RhbnQgc3VidHJhY3RlZCBmcm9tIHRoZSBtZWFuIG9yIHdlaWdodGVkIG1lYW4gKHNlZSB0aGUgZGV0YWlscyBiZWxvdykuXHJcbiAgICogIE5vcm1hbGx5LCBpdCBpcyBwb3NpdGl2ZSBidXQgbWF5IGJlIHplcm8gb3IgbmVnYXRpdmUgYXMgd2VsbC5cclxuICAgKiAgT25seSB1c2VkIHdpdGggYWRhcHRpdmUgdGhyZXNob2xkIHZhcmlhbnRzXHJcbiAgICovXHJcbiAgYz86IG51bWJlcjtcclxuICAvKipcclxuICAgKiB0aHJlc2hvbGQgdmFsdWUuIE9ubHkgdXNlZCB3aXRoIHN0YW5kYXJkIHRocmVzaG9sZCB0eXBlLlxyXG4gICAqL1xyXG4gIHRocmVzaD86IG51bWJlcjtcclxuXHJcblxyXG59XHJcblxyXG4vKipcclxuICogZGVzY3JpYmVzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogd2hldGhlciBmaWx0ZXIgb3B0aW9ucyBhcmUgZW5hYmxlZFxyXG4gICAqL1xyXG4gIGZpbHRlckVuYWJsZT86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3V0cHV0IGltYWdlLiBpZiBzZXQgdG8gemVybyB3aWxsIG5vdCByZXNpemUgdGhlIGltYWdlXHJcbiAgICovXHJcbiAgbWF4SW1hZ2VEaW1lbnNpb25zPzogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAvKipcclxuICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckRpbWVuc2lvbnM/OiB7IHdpZHRoOiBzdHJpbmc7IGhlaWdodDogc3RyaW5nOyB9O1xyXG4gIC8qKlxyXG4gICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZXh0cmFDc3M/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG4gIC8qKlxyXG4gICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICovXHJcbiAgYnV0dG9uVGhlbWVDb2xvcj86ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnO1xyXG4gIC8qKlxyXG4gICAqIGljb24gZm9yIHRoZSBidXR0b24gdGhhdCBjb21wbGV0ZXMgdGhlIGVkaXRpbmcgYW5kIGVtaXRzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBleHBvcnRJbWFnZUljb24/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbCAocG9pbnRzIGFuZCBjb25uZWN0aW5nIGxpbmVzKVxyXG4gICAqL1xyXG4gIGNyb3BUb29sQ29sb3I/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCBwb2ludHNcclxuICAgKi9cclxuICBjcm9wVG9vbFNoYXBlPzogUG9pbnRTaGFwZTtcclxuICAvKipcclxuICAgKiB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjcm9wIHRvb2wgcG9pbnRzXHJcbiAgICovXHJcbiAgY3JvcFRvb2xEaW1lbnNpb25zPzogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIHdlaWdodCBvZiB0aGUgY3JvcCB0b29sJ3MgY29ubmVjdGluZyBsaW5lc1xyXG4gICAqL1xyXG4gIGNyb3BUb29sTGluZVdlaWdodD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAqL1xyXG4gIG1heFByZXZpZXdXaWR0aD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBtYXggaGVpZ2h0IG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3SGVpZ2h0PzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIGNvbmZpZyB0aHJlc2hvbGQgZm9yIGF1dG9cclxuICAgKi9cclxuICB0aHJlc2hvbGRJbmZvPzogVGhyZXNob2xkSW5mb3JtYXRpb247XHJcbiAgLyoqXHJcbiAgICogd2hldGhlciByb3RhdGVkIHJlY3RhbmdsZSBpcyB1c2VkXHJcbiAgICovXHJcbiAgdXNlUm90YXRlZFJlY3RhbmdsZT86IGJvb2xlYW47XHJcblxyXG59XHJcblxyXG4vKipcclxuICogZGVzY3JpYmVzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBPcGVuQ1Ygc2VydmljZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPcGVuQ1ZDb25maWcge1xyXG4gIC8qKlxyXG4gICAqIHBhdGggdG8gdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBPcGVuQ1YgZmlsZXMsIGluIHRoZSBmb3JtIG9mICcvcGF0aC90by88b3BlbmN2IGRpcmVjdG9yeT4nXHJcbiAgICogZGlyZWN0b3J5IG11c3QgY29udGFpbiB0aGUgdGhlIGZvbGxvd2luZyBmaWxlczpcclxuICAgKiAtLTxPcGVuQ3ZEaXI+XHJcbiAgICogLS0tLW9wZW5jdi5qc1xyXG4gICAqIC0tLS1vcGVuY3ZfanMud2FzbVxyXG4gICAqL1xyXG4gIG9wZW5DVkRpclBhdGg/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogYWRkaXRpb25hbCBjYWxsYmFjayB0aGF0IHdpbGwgcnVuIHdoZW4gT3BlbkN2IGhhcyBmaW5pc2hlZCBsb2FkaW5nIGFuZCBwYXJzaW5nXHJcbiAgICovXHJcbiAgcnVuT25PcGVuQ1ZJbml0PzogRnVuY3Rpb247XHJcbn1cclxuIl19