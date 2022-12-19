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
     * config threshold for auto
     * @type {?|undefined}
     */
    DocScannerConfig.prototype.thresholdInfo;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGljTW9kZWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvUHVibGljTW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsaUNBS0M7OztJQUpDLDRCQUFlOztJQUNmLDhCQUFpQjs7SUFDakIsNEJBQWU7O0lBQ2YsNEJBQWM7Ozs7OztBQU1oQixxQ0FHQzs7O0lBRkMsZ0NBQWM7O0lBQ2QsaUNBQWU7Ozs7OztBQU1qQiwwQ0F1QkM7OztJQXRCQyw2Q0FBa0U7Ozs7O0lBSWxFLHdDQUFrQjs7Ozs7O0lBS2xCLHlDQUFtQjs7Ozs7OztJQU1uQixpQ0FBVzs7Ozs7SUFJWCxzQ0FBZ0I7Ozs7OztBQVFsQixzQ0FxREM7Ozs7OztJQWpEQyx3Q0FBdUI7Ozs7O0lBSXZCLDhDQUFxQzs7Ozs7SUFJckMsaURBQStCOzs7OztJQUkvQiw0Q0FBc0Q7Ozs7O0lBSXRELG9DQUE4Qzs7Ozs7SUFJOUMsNENBQWlEOzs7OztJQUlqRCwyQ0FBeUI7Ozs7O0lBSXpCLHlDQUF1Qjs7Ozs7SUFJdkIseUNBQTJCOzs7OztJQUkzQiw4Q0FBcUM7Ozs7O0lBSXJDLDhDQUE0Qjs7Ozs7SUFJNUIsMkNBQXlCOzs7OztJQUl6Qix5Q0FBcUM7Ozs7OztBQU12QyxrQ0FhQzs7Ozs7Ozs7OztJQUxDLHFDQUF1Qjs7Ozs7SUFJdkIsdUNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGRlc2NyaWJlcyBhIHN0YXRlIG9iamVjdCBmb3IgdGhlIE9wZW5DViBtb2R1bGVcclxuICovXHJcbmltcG9ydCB7UG9pbnRTaGFwZX0gZnJvbSAnLi9Qcml2YXRlTW9kZWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT3BlbkNWU3RhdGUge1xyXG4gIHJlYWR5OiBib29sZWFuO1xyXG4gIGxvYWRpbmc6IGJvb2xlYW47XHJcbiAgZXJyb3I6IGJvb2xlYW47XHJcbiAgc3RhdGU6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIGRlc2NyaWJlcyBhbiBvYmplY3Qgd2l0aCB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VEaW1lbnNpb25zIHtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogdGhyZXNob2xkIGluZm9ybWF0aW9uIGZvciBhdXRvbWF0aWNhbGx5IGRldGVjdGluZyBjb3JuZXJzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFRocmVzaG9sZEluZm9ybWF0aW9uIHtcclxuICB0aHJlc2hvbGRUeXBlOiAnc3RhbmRhcmQnIHwgJ2FkYXB0aXZlX21lYW4nIHwgJ2FkYXB0aXZlX2dhdXNzaWFuJztcclxuICAvKipcclxuICAgKiBOb24temVybyB2YWx1ZSBhc3NpZ25lZCB0byB0aGUgcGl4ZWxzIGZvciB3aGljaCB0aGUgY29uZGl0aW9uIGlzIHNhdGlzZmllZFxyXG4gICAqL1xyXG4gIG1heFZhbHVlPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIFNpemUgb2YgYSBwaXhlbCBuZWlnaGJvcmhvb2QgdGhhdCBpcyB1c2VkIHRvIGNhbGN1bGF0ZSBhIHRocmVzaG9sZCB2YWx1ZSBmb3IgdGhlIHBpeGVsOiAzLCA1LCA3LCBhbmQgc28gb24uXHJcbiAgICogT25seSB1c2VkIHdpdGggYWRhcHRpdmUgdGhyZXNob2xkIHZhcmlhbnRzXHJcbiAgICovXHJcbiAgYmxvY2tTaXplPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqICBDb25zdGFudCBzdWJ0cmFjdGVkIGZyb20gdGhlIG1lYW4gb3Igd2VpZ2h0ZWQgbWVhbiAoc2VlIHRoZSBkZXRhaWxzIGJlbG93KS5cclxuICAgKiAgTm9ybWFsbHksIGl0IGlzIHBvc2l0aXZlIGJ1dCBtYXkgYmUgemVybyBvciBuZWdhdGl2ZSBhcyB3ZWxsLlxyXG4gICAqICBPbmx5IHVzZWQgd2l0aCBhZGFwdGl2ZSB0aHJlc2hvbGQgdmFyaWFudHNcclxuICAgKi9cclxuICBjPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIHRocmVzaG9sZCB2YWx1ZS4gT25seSB1c2VkIHdpdGggc3RhbmRhcmQgdGhyZXNob2xkIHR5cGUuXHJcbiAgICovXHJcbiAgdGhyZXNoPzogbnVtYmVyO1xyXG5cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkZXNjcmliZXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIGVkaXRvclxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAvKipcclxuICAgKiB3aGV0aGVyIGZpbHRlciBvcHRpb25zIGFyZSBlbmFibGVkXHJcbiAgICovXHJcbiAgZmlsdGVyRW5hYmxlPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBtYXggZGltZW5zaW9ucyBvZiBvdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvIHdpbGwgbm90IHJlc2l6ZSB0aGUgaW1hZ2VcclxuICAgKi9cclxuICBtYXhJbWFnZURpbWVuc2lvbnM/OiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yQmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yRGltZW5zaW9ucz86IHsgd2lkdGg6IHN0cmluZzsgaGVpZ2h0OiBzdHJpbmc7IH07XHJcbiAgLyoqXHJcbiAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgKi9cclxuICBleHRyYUNzcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogbWF0ZXJpYWwgZGVzaWduIHRoZW1lIGNvbG9yIG5hbWVcclxuICAgKi9cclxuICBidXR0b25UaGVtZUNvbG9yPzogJ3ByaW1hcnknIHwgJ3dhcm4nIHwgJ2FjY2VudCc7XHJcbiAgLyoqXHJcbiAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGV4cG9ydEltYWdlSWNvbj86IHN0cmluZztcclxuICAvKipcclxuICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sIChwb2ludHMgYW5kIGNvbm5lY3RpbmcgbGluZXMpXHJcbiAgICovXHJcbiAgY3JvcFRvb2xDb2xvcj86IHN0cmluZztcclxuICAvKipcclxuICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sIHBvaW50c1xyXG4gICAqL1xyXG4gIGNyb3BUb29sU2hhcGU/OiBQb2ludFNoYXBlO1xyXG4gIC8qKlxyXG4gICAqIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNyb3AgdG9vbCBwb2ludHNcclxuICAgKi9cclxuICBjcm9wVG9vbERpbWVuc2lvbnM/OiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogd2VpZ2h0IG9mIHRoZSBjcm9wIHRvb2wncyBjb25uZWN0aW5nIGxpbmVzXHJcbiAgICovXHJcbiAgY3JvcFRvb2xMaW5lV2VpZ2h0PzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld1dpZHRoPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIGNvbmZpZyB0aHJlc2hvbGQgZm9yIGF1dG9cclxuICAgKi9cclxuICB0aHJlc2hvbGRJbmZvPzogVGhyZXNob2xkSW5mb3JtYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkZXNjcmliZXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIE9wZW5DViBzZXJ2aWNlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9wZW5DVkNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogcGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIE9wZW5DViBmaWxlcywgaW4gdGhlIGZvcm0gb2YgJy9wYXRoL3RvLzxvcGVuY3YgZGlyZWN0b3J5PidcclxuICAgKiBkaXJlY3RvcnkgbXVzdCBjb250YWluIHRoZSB0aGUgZm9sbG93aW5nIGZpbGVzOlxyXG4gICAqIC0tPE9wZW5DdkRpcj5cclxuICAgKiAtLS0tb3BlbmN2LmpzXHJcbiAgICogLS0tLW9wZW5jdl9qcy53YXNtXHJcbiAgICovXHJcbiAgb3BlbkNWRGlyUGF0aD86IHN0cmluZztcclxuICAvKipcclxuICAgKiBhZGRpdGlvbmFsIGNhbGxiYWNrIHRoYXQgd2lsbCBydW4gd2hlbiBPcGVuQ3YgaGFzIGZpbmlzaGVkIGxvYWRpbmcgYW5kIHBhcnNpbmdcclxuICAgKi9cclxuICBydW5Pbk9wZW5DVkluaXQ/OiBGdW5jdGlvbjtcclxufVxyXG4iXX0=