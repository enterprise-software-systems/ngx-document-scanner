import { EventEmitter, OnInit } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EditorActionButton, PointOptions, PointShape } from '../../PrivateModels';
import { DocScannerConfig, ImageDimensions } from '../../PublicModels';
import { NgxOpenCVService } from 'ngx-opencv';
import * as ɵngcc0 from '@angular/core';
export declare class NgxDocScannerComponent implements OnInit {
    private ngxOpenCv;
    private limitsService;
    private bottomSheet;
    /**
     * editor config object
     */
    options: ImageEditorConfig;
    /**
     * an array of action buttons displayed on the editor screen
     */
    private editorButtons;
    /**
     * returns an array of buttons according to the editor mode
     */
    get displayedButtons(): EditorActionButton[];
    /**
     * max width of the preview area
     */
    private maxPreviewWidth;
    /**
     * dimensions of the image container
     */
    imageDivStyle: {
        [key: string]: string | number;
    };
    /**
     * editor div style
     */
    editorStyle: {
        [key: string]: string | number;
    };
    /**
     * state of opencv loading
     */
    private cvState;
    /**
     * true after the image is loaded and preview is displayed
     */
    imageLoaded: boolean;
    /**
     * editor mode
     */
    mode: 'crop' | 'color';
    /**
     * filter selected by the user, returned by the filter selector bottom sheet
     */
    private selectedFilter;
    /**
     * viewport dimensions
     */
    private screenDimensions;
    /**
     * image dimensions
     */
    private imageDimensions;
    /**
     * dimensions of the preview pane
     */
    previewDimensions: ImageDimensions;
    /**
     * ration between preview image and original
     */
    private imageResizeRatio;
    /**
     * stores the original image for reset purposes
     */
    private originalImage;
    /**
     * stores the edited image
     */
    private editedImage;
    /**
     * stores the preview image as canvas
     */
    private previewCanvas;
    /**
     * an array of points used by the crop tool
     */
    private points;
    /**
     * optional binding to the exit button of the editor
     */
    exitEditor: EventEmitter<string>;
    /**
     * fires on edit completion
     */
    editResult: EventEmitter<Blob>;
    /**
     * emits errors, can be linked to an error handler of choice
     */
    error: EventEmitter<any>;
    /**
     * emits the loading status of the cv module.
     */
    ready: EventEmitter<boolean>;
    /**
     * emits true when processing is done, false when completed
     */
    processing: EventEmitter<boolean>;
    /**
     * set image for editing
     * @param file - file from form input
     */
    set file(file: File);
    /**
     * editor configuration object
     */
    config: DocScannerConfig;
    constructor(ngxOpenCv: NgxOpenCVService, limitsService: LimitsService, bottomSheet: MatBottomSheet);
    ngOnInit(): void;
    /**
     * emits the exitEditor event
     */
    exit(): void;
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    private exportImage;
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     */
    private chooseFilters;
    /**
     * load image from input field
     */
    private loadFile;
    /**
     * read image from File object
     */
    private readImage;
    /**
     * rotate image 90 degrees
     */
    private rotateImage;
    /**
     * detects the contours of the document and
     **/
    private detectContours;
    private pointsAreNotTheSame;
    /**
     * apply perspective transform
     */
    private transform;
    /**
     * applies the selected filter to the image
     * @param preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     */
    private applyFilter;
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     */
    private resize;
    /**
     * display a preview of the image on the preview canvas
     */
    private showPreview;
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     */
    private setPreviewPaneDimensions;
    /**
     * calculate dimensions of the preview canvas
     */
    private calculateDimensions;
    /**
     * returns a point by it's roles
     * @param roles - an array of roles by which the point will be fetched
     */
    private getPoint;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgxDocScannerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgxDocScannerComponent, "ngx-doc-scanner", never, { "file": "file"; "config": "config"; }, { "exitEditor": "exitEditor"; "editResult": "editResult"; "error": "error"; "ready": "ready"; "processing": "processing"; }, never, never>;
}
/**
 * a class for generating configuration objects for the editor
 */
declare class ImageEditorConfig implements DocScannerConfig {
    /**
     * max dimensions of oputput image. if set to zero
     */
    maxImageDimensions: ImageDimensions;
    /**
     * background color of the main editor div
     */
    editorBackgroundColor: string;
    /**
     * css properties for the main editor div
     */
    editorDimensions: {
        width: string;
        height: string;
    };
    /**
     * css that will be added to the main div of the editor component
     */
    extraCss: {
        [key: string]: string | number;
    };
    /**
     * material design theme color name
     */
    buttonThemeColor: 'primary' | 'warn' | 'accent';
    /**
     * icon for the button that completes the editing and emits the edited image
     */
    exportImageIcon: string;
    /**
     * color of the crop tool
     */
    cropToolColor: string;
    /**
     * shape of the crop tool, can be either a rectangle or a circle
     */
    cropToolShape: PointShape;
    /**
     * dimensions of the crop tool
     */
    cropToolDimensions: ImageDimensions;
    /**
     * aggregation of the properties regarding point attributes generated by the class constructor
     */
    pointOptions: PointOptions;
    /**
     * aggregation of the properties regarding the editor style generated by the class constructor
     */
    editorStyle?: {
        [key: string]: string | number;
    };
    /**
     * crop tool outline width
     */
    cropToolLineWeight: number;
    /**
     * maximum size of the preview pane
     */
    maxPreviewWidth: number;
    constructor(options: DocScannerConfig);
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IEVkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zLCBQb2ludFNoYXBlIH0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmltcG9ydCB7IERvY1NjYW5uZXJDb25maWcsIEltYWdlRGltZW5zaW9ucyB9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7IE5neE9wZW5DVlNlcnZpY2UgfSBmcm9tICduZ3gtb3BlbmN2JztcclxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBwcml2YXRlIG5neE9wZW5DdjtcclxuICAgIHByaXZhdGUgbGltaXRzU2VydmljZTtcclxuICAgIHByaXZhdGUgYm90dG9tU2hlZXQ7XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBjb25maWcgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhbiBhcnJheSBvZiBhY3Rpb24gYnV0dG9ucyBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciBzY3JlZW5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIGJ1dHRvbnMgYWNjb3JkaW5nIHRvIHRoZSBlZGl0b3IgbW9kZVxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzcGxheWVkQnV0dG9ucygpOiBFZGl0b3JBY3Rpb25CdXR0b25bXTtcclxuICAgIC8qKlxyXG4gICAgICogbWF4IHdpZHRoIG9mIHRoZSBwcmV2aWV3IGFyZWFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBtYXhQcmV2aWV3V2lkdGg7XHJcbiAgICAvKipcclxuICAgICAqIGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBpbWFnZURpdlN0eWxlOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAgICovXHJcbiAgICBlZGl0b3JTdHlsZToge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3ZTdGF0ZTtcclxuICAgIC8qKlxyXG4gICAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAgICovXHJcbiAgICBpbWFnZUxvYWRlZDogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIG1vZGVcclxuICAgICAqL1xyXG4gICAgbW9kZTogJ2Nyb3AnIHwgJ2NvbG9yJztcclxuICAgIC8qKlxyXG4gICAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2NyZWVuRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGltYWdlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICAgKi9cclxuICAgIHByZXZpZXdEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbztcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGVkaXRlZEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcHJldmlld0NhbnZhcztcclxuICAgIC8qKlxyXG4gICAgICogYW4gYXJyYXkgb2YgcG9pbnRzIHVzZWQgYnkgdGhlIGNyb3AgdG9vbFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHBvaW50cztcclxuICAgIC8qKlxyXG4gICAgICogb3B0aW9uYWwgYmluZGluZyB0byB0aGUgZXhpdCBidXR0b24gb2YgdGhlIGVkaXRvclxyXG4gICAgICovXHJcbiAgICBleGl0RWRpdG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPjtcclxuICAgIC8qKlxyXG4gICAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICAgKi9cclxuICAgIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPjtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgZXJyb3JzLCBjYW4gYmUgbGlua2VkIHRvIGFuIGVycm9yIGhhbmRsZXIgb2YgY2hvaWNlXHJcbiAgICAgKi9cclxuICAgIGVycm9yOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICAgKi9cclxuICAgIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRydWUgd2hlbiBwcm9jZXNzaW5nIGlzIGRvbmUsIGZhbHNlIHdoZW4gY29tcGxldGVkXHJcbiAgICAgKi9cclxuICAgIHByb2Nlc3Npbmc6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IGltYWdlIGZvciBlZGl0aW5nXHJcbiAgICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICAgKi9cclxuICAgIHNldCBmaWxlKGZpbGU6IEZpbGUpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgY29uZmlndXJhdGlvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG4gICAgY29uc3RydWN0b3Iobmd4T3BlbkN2OiBOZ3hPcGVuQ1ZTZXJ2aWNlLCBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlLCBib3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQpO1xyXG4gICAgbmdPbkluaXQoKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgdGhlIGV4aXRFZGl0b3IgZXZlbnRcclxuICAgICAqL1xyXG4gICAgZXhpdCgpOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIsIGFuZCB3aGVuIGRvbmUgZW1pdHMgdGhlIHJlc3VsdGVkIGltYWdlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZXhwb3J0SW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIG9wZW4gdGhlIGJvdHRvbSBzaGVldCBmb3Igc2VsZWN0aW5nIGZpbHRlcnMsIGFuZCBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgaW4gcHJldmlldyBtb2RlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2hvb3NlRmlsdGVycztcclxuICAgIC8qKlxyXG4gICAgICogbG9hZCBpbWFnZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZEZpbGU7XHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgaW1hZ2UgZnJvbSBGaWxlIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogcm90YXRlIGltYWdlIDkwIGRlZ3JlZXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByb3RhdGVJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogZGV0ZWN0cyB0aGUgY29udG91cnMgb2YgdGhlIGRvY3VtZW50IGFuZFxyXG4gICAgICoqL1xyXG4gICAgcHJpdmF0ZSBkZXRlY3RDb250b3VycztcclxuICAgIHByaXZhdGUgcG9pbnRzQXJlTm90VGhlU2FtZTtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAgICogd2hlbiBmYWxzZSwgd2lsbCBhcHBseSB0byBlZGl0ZWRJbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFwcGx5RmlsdGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc2l6ZTtcclxuICAgIC8qKlxyXG4gICAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNob3dQcmV2aWV3O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgcHJldmlldyBjYW52YXMgZGltZW5zaW9ucyBhY2NvcmRpbmcgdG8gdGhlIGNhbnZhcyBlbGVtZW50IG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQb2ludDtcclxufVxyXG4vKipcclxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmRlY2xhcmUgY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAgIC8qKlxyXG4gICAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3B1dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm9cclxuICAgICAqL1xyXG4gICAgbWF4SW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAgICovXHJcbiAgICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgICAqL1xyXG4gICAgZWRpdG9yRGltZW5zaW9uczoge1xyXG4gICAgICAgIHdpZHRoOiBzdHJpbmc7XHJcbiAgICAgICAgaGVpZ2h0OiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBleHRyYUNzczoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICAgKi9cclxuICAgIGJ1dHRvblRoZW1lQ29sb3I6ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydEltYWdlSWNvbjogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sQ29sb3I6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCwgY2FuIGJlIGVpdGhlciBhIHJlY3RhbmdsZSBvciBhIGNpcmNsZVxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaW1lbnNpb25zIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyBwb2ludCBhdHRyaWJ1dGVzIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgZWRpdG9yIHN0eWxlIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZWRpdG9yU3R5bGU/OiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogY3JvcCB0b29sIG91dGxpbmUgd2lkdGhcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xMaW5lV2VpZ2h0OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICAgKi9cclxuICAgIG1heFByZXZpZXdXaWR0aDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZyk7XHJcbn1cclxuZXhwb3J0IHt9O1xyXG4iXX0=