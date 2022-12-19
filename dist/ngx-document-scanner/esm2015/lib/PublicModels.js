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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGljTW9kZWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvUHVibGljTW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsaUNBS0M7OztJQUpDLDRCQUFlOztJQUNmLDhCQUFpQjs7SUFDakIsNEJBQWU7O0lBQ2YsNEJBQWM7Ozs7OztBQU1oQixxQ0FHQzs7O0lBRkMsZ0NBQWM7O0lBQ2QsaUNBQWU7Ozs7OztBQU1qQiwwQ0F1QkM7OztJQXRCQyw2Q0FBa0U7Ozs7O0lBSWxFLHdDQUFrQjs7Ozs7O0lBS2xCLHlDQUFtQjs7Ozs7OztJQU1uQixpQ0FBVzs7Ozs7SUFJWCxzQ0FBZ0I7Ozs7OztBQVFsQixzQ0EwREM7Ozs7OztJQXREQyx3Q0FBdUI7Ozs7O0lBSXZCLDhDQUFxQzs7Ozs7SUFJckMsaURBQStCOzs7OztJQUkvQiw0Q0FBc0Q7Ozs7O0lBSXRELG9DQUE4Qzs7Ozs7SUFJOUMsNENBQWlEOzs7OztJQUlqRCwyQ0FBeUI7Ozs7O0lBSXpCLHlDQUF1Qjs7Ozs7SUFJdkIseUNBQTJCOzs7OztJQUkzQiw4Q0FBcUM7Ozs7O0lBSXJDLDhDQUE0Qjs7Ozs7SUFJNUIsMkNBQXlCOzs7OztJQUl6Qix5Q0FBcUM7Ozs7O0lBSXJDLCtDQUE4Qjs7Ozs7O0FBT2hDLGtDQWFDOzs7Ozs7Ozs7O0lBTEMscUNBQXVCOzs7OztJQUl2Qix1Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogZGVzY3JpYmVzIGEgc3RhdGUgb2JqZWN0IGZvciB0aGUgT3BlbkNWIG1vZHVsZVxyXG4gKi9cclxuaW1wb3J0IHtQb2ludFNoYXBlfSBmcm9tICcuL1ByaXZhdGVNb2RlbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcGVuQ1ZTdGF0ZSB7XHJcbiAgcmVhZHk6IGJvb2xlYW47XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBlcnJvcjogYm9vbGVhbjtcclxuICBzdGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogZGVzY3JpYmVzIGFuIG9iamVjdCB3aXRoIHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydGllc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJbWFnZURpbWVuc2lvbnMge1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiB0aHJlc2hvbGQgaW5mb3JtYXRpb24gZm9yIGF1dG9tYXRpY2FsbHkgZGV0ZWN0aW5nIGNvcm5lcnNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGhyZXNob2xkSW5mb3JtYXRpb24ge1xyXG4gIHRocmVzaG9sZFR5cGU6ICdzdGFuZGFyZCcgfCAnYWRhcHRpdmVfbWVhbicgfCAnYWRhcHRpdmVfZ2F1c3NpYW4nO1xyXG4gIC8qKlxyXG4gICAqIE5vbi16ZXJvIHZhbHVlIGFzc2lnbmVkIHRvIHRoZSBwaXhlbHMgZm9yIHdoaWNoIHRoZSBjb25kaXRpb24gaXMgc2F0aXNmaWVkXHJcbiAgICovXHJcbiAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogU2l6ZSBvZiBhIHBpeGVsIG5laWdoYm9yaG9vZCB0aGF0IGlzIHVzZWQgdG8gY2FsY3VsYXRlIGEgdGhyZXNob2xkIHZhbHVlIGZvciB0aGUgcGl4ZWw6IDMsIDUsIDcsIGFuZCBzbyBvbi5cclxuICAgKiBPbmx5IHVzZWQgd2l0aCBhZGFwdGl2ZSB0aHJlc2hvbGQgdmFyaWFudHNcclxuICAgKi9cclxuICBibG9ja1NpemU/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogIENvbnN0YW50IHN1YnRyYWN0ZWQgZnJvbSB0aGUgbWVhbiBvciB3ZWlnaHRlZCBtZWFuIChzZWUgdGhlIGRldGFpbHMgYmVsb3cpLlxyXG4gICAqICBOb3JtYWxseSwgaXQgaXMgcG9zaXRpdmUgYnV0IG1heSBiZSB6ZXJvIG9yIG5lZ2F0aXZlIGFzIHdlbGwuXHJcbiAgICogIE9ubHkgdXNlZCB3aXRoIGFkYXB0aXZlIHRocmVzaG9sZCB2YXJpYW50c1xyXG4gICAqL1xyXG4gIGM/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogdGhyZXNob2xkIHZhbHVlLiBPbmx5IHVzZWQgd2l0aCBzdGFuZGFyZCB0aHJlc2hvbGQgdHlwZS5cclxuICAgKi9cclxuICB0aHJlc2g/OiBudW1iZXI7XHJcblxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIGRlc2NyaWJlcyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIERvY1NjYW5uZXJDb25maWcge1xyXG4gIC8qKlxyXG4gICAqIHdoZXRoZXIgZmlsdGVyIG9wdGlvbnMgYXJlIGVuYWJsZWRcclxuICAgKi9cclxuICBmaWx0ZXJFbmFibGU/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIG1heCBkaW1lbnNpb25zIG9mIG91dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm8gd2lsbCBub3QgcmVzaXplIHRoZSBpbWFnZVxyXG4gICAqL1xyXG4gIG1heEltYWdlRGltZW5zaW9ucz86IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JEaW1lbnNpb25zPzogeyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgfTtcclxuICAvKipcclxuICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGV4dHJhQ3NzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAqL1xyXG4gIGJ1dHRvblRoZW1lQ29sb3I/OiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JztcclxuICAvKipcclxuICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgZXhwb3J0SW1hZ2VJY29uPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2wgKHBvaW50cyBhbmQgY29ubmVjdGluZyBsaW5lcylcclxuICAgKi9cclxuICBjcm9wVG9vbENvbG9yPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wgcG9pbnRzXHJcbiAgICovXHJcbiAgY3JvcFRvb2xTaGFwZT86IFBvaW50U2hhcGU7XHJcbiAgLyoqXHJcbiAgICogd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY3JvcCB0b29sIHBvaW50c1xyXG4gICAqL1xyXG4gIGNyb3BUb29sRGltZW5zaW9ucz86IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiB3ZWlnaHQgb2YgdGhlIGNyb3AgdG9vbCdzIGNvbm5lY3RpbmcgbGluZXNcclxuICAgKi9cclxuICBjcm9wVG9vbExpbmVXZWlnaHQ/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogbWF4IHdpZHRoIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3V2lkdGg/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogY29uZmlnIHRocmVzaG9sZCBmb3IgYXV0b1xyXG4gICAqL1xyXG4gIHRocmVzaG9sZEluZm8/OiBUaHJlc2hvbGRJbmZvcm1hdGlvbjtcclxuICAvKipcclxuICAgKiB3aGV0aGVyIHJvdGF0ZWQgcmVjdGFuZ2xlIGlzIHVzZWRcclxuICAgKi9cclxuICB1c2VSb3RhdGVkUmVjdGFuZ2xlPzogYm9vbGVhbjtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkZXNjcmliZXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIE9wZW5DViBzZXJ2aWNlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9wZW5DVkNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogcGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIE9wZW5DViBmaWxlcywgaW4gdGhlIGZvcm0gb2YgJy9wYXRoL3RvLzxvcGVuY3YgZGlyZWN0b3J5PidcclxuICAgKiBkaXJlY3RvcnkgbXVzdCBjb250YWluIHRoZSB0aGUgZm9sbG93aW5nIGZpbGVzOlxyXG4gICAqIC0tPE9wZW5DdkRpcj5cclxuICAgKiAtLS0tb3BlbmN2LmpzXHJcbiAgICogLS0tLW9wZW5jdl9qcy53YXNtXHJcbiAgICovXHJcbiAgb3BlbkNWRGlyUGF0aD86IHN0cmluZztcclxuICAvKipcclxuICAgKiBhZGRpdGlvbmFsIGNhbGxiYWNrIHRoYXQgd2lsbCBydW4gd2hlbiBPcGVuQ3YgaGFzIGZpbmlzaGVkIGxvYWRpbmcgYW5kIHBhcnNpbmdcclxuICAgKi9cclxuICBydW5Pbk9wZW5DVkluaXQ/OiBGdW5jdGlvbjtcclxufVxyXG4iXX0=