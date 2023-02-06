import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EditorActionButton, PointOptions, PointShape } from '../../PrivateModels';
import { DocScannerConfig, ImageDimensions } from '../../PublicModels';
import { NgxOpenCVService } from 'ngx-opencv';
import * as ɵngcc0 from '@angular/core';
export declare class NgxDocScannerComponent implements OnInit, OnChanges {
    private ngxOpenCv;
    private limitsService;
    private bottomSheet;
    value: number;
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
    private maxPreviewHeight;
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
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * emits the exitEditor event
     */
    exit(): void;
    getMode(): string;
    doneCrop(): Promise<void>;
    undo(): void;
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    exportImage(): Promise<void>;
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
    rotateImage(clockwise?: boolean): Promise<unknown>;
    doubleRotate(): Promise<unknown>;
    rotate(clockwise?: boolean): void;
    /**
     * detects the contours of the document and
     **/
    private detectContours;
    isTop(coordinate: any, otherVertices: any): boolean;
    isLeft(coordinate: any, secondCoordinate: any): boolean;
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
    getStoyle(): {
        [p: string]: string | number;
    };
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
    /**
     * maximum size of the preview pane
     */
    maxPreviewHeight: number;
    constructor(options: DocScannerConfig);
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IEVkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zLCBQb2ludFNoYXBlIH0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmltcG9ydCB7IERvY1NjYW5uZXJDb25maWcsIEltYWdlRGltZW5zaW9ucyB9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7IE5neE9wZW5DVlNlcnZpY2UgfSBmcm9tICduZ3gtb3BlbmN2JztcclxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICAgIHByaXZhdGUgbmd4T3BlbkN2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdHNTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBib3R0b21TaGVldDtcclxuICAgIHZhbHVlOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBjb25maWcgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhbiBhcnJheSBvZiBhY3Rpb24gYnV0dG9ucyBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciBzY3JlZW5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIGJ1dHRvbnMgYWNjb3JkaW5nIHRvIHRoZSBlZGl0b3IgbW9kZVxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzcGxheWVkQnV0dG9ucygpOiBFZGl0b3JBY3Rpb25CdXR0b25bXTtcclxuICAgIHByaXZhdGUgbWF4UHJldmlld0hlaWdodDtcclxuICAgIC8qKlxyXG4gICAgICogbWF4IHdpZHRoIG9mIHRoZSBwcmV2aWV3IGFyZWFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBtYXhQcmV2aWV3V2lkdGg7XHJcbiAgICAvKipcclxuICAgICAqIGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBpbWFnZURpdlN0eWxlOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAgICovXHJcbiAgICBlZGl0b3JTdHlsZToge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3ZTdGF0ZTtcclxuICAgIC8qKlxyXG4gICAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAgICovXHJcbiAgICBpbWFnZUxvYWRlZDogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIG1vZGVcclxuICAgICAqL1xyXG4gICAgbW9kZTogJ2Nyb3AnIHwgJ2NvbG9yJztcclxuICAgIC8qKlxyXG4gICAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2NyZWVuRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGltYWdlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICAgKi9cclxuICAgIHByZXZpZXdEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbztcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGVkaXRlZEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcHJldmlld0NhbnZhcztcclxuICAgIC8qKlxyXG4gICAgICogYW4gYXJyYXkgb2YgcG9pbnRzIHVzZWQgYnkgdGhlIGNyb3AgdG9vbFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHBvaW50cztcclxuICAgIC8qKlxyXG4gICAgICogb3B0aW9uYWwgYmluZGluZyB0byB0aGUgZXhpdCBidXR0b24gb2YgdGhlIGVkaXRvclxyXG4gICAgICovXHJcbiAgICBleGl0RWRpdG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPjtcclxuICAgIC8qKlxyXG4gICAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICAgKi9cclxuICAgIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPjtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgZXJyb3JzLCBjYW4gYmUgbGlua2VkIHRvIGFuIGVycm9yIGhhbmRsZXIgb2YgY2hvaWNlXHJcbiAgICAgKi9cclxuICAgIGVycm9yOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICAgKi9cclxuICAgIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRydWUgd2hlbiBwcm9jZXNzaW5nIGlzIGRvbmUsIGZhbHNlIHdoZW4gY29tcGxldGVkXHJcbiAgICAgKi9cclxuICAgIHByb2Nlc3Npbmc6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IGltYWdlIGZvciBlZGl0aW5nXHJcbiAgICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICAgKi9cclxuICAgIHNldCBmaWxlKGZpbGU6IEZpbGUpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgY29uZmlndXJhdGlvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG4gICAgY29uc3RydWN0b3Iobmd4T3BlbkN2OiBOZ3hPcGVuQ1ZTZXJ2aWNlLCBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlLCBib3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQpO1xyXG4gICAgbmdPbkluaXQoKTogdm9pZDtcclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBlbWl0cyB0aGUgZXhpdEVkaXRvciBldmVudFxyXG4gICAgICovXHJcbiAgICBleGl0KCk6IHZvaWQ7XHJcbiAgICBnZXRNb2RlKCk6IHN0cmluZztcclxuICAgIGRvbmVDcm9wKCk6IFByb21pc2U8dm9pZD47XHJcbiAgICB1bmRvKCk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciwgYW5kIHdoZW4gZG9uZSBlbWl0cyB0aGUgcmVzdWx0ZWQgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0SW1hZ2UoKTogUHJvbWlzZTx2b2lkPjtcclxuICAgIC8qKlxyXG4gICAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjaG9vc2VGaWx0ZXJzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBsb2FkIGltYWdlIGZyb20gaW5wdXQgZmllbGRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkRmlsZTtcclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBpbWFnZSBmcm9tIEZpbGUgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiByb3RhdGUgaW1hZ2UgOTAgZGVncmVlc1xyXG4gICAgICovXHJcbiAgICByb3RhdGVJbWFnZShjbG9ja3dpc2U/OiBib29sZWFuKTogUHJvbWlzZTx1bmtub3duPjtcclxuICAgIGRvdWJsZVJvdGF0ZSgpOiBQcm9taXNlPHVua25vd24+O1xyXG4gICAgcm90YXRlKGNsb2Nrd2lzZT86IGJvb2xlYW4pOiB2b2lkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXHJcbiAgICAgKiovXHJcbiAgICBwcml2YXRlIGRldGVjdENvbnRvdXJzO1xyXG4gICAgaXNUb3AoY29vcmRpbmF0ZTogYW55LCBvdGhlclZlcnRpY2VzOiBhbnkpOiBib29sZWFuO1xyXG4gICAgaXNMZWZ0KGNvb3JkaW5hdGU6IGFueSwgc2Vjb25kQ29vcmRpbmF0ZTogYW55KTogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgcG9pbnRzQXJlTm90VGhlU2FtZTtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAgICogd2hlbiBmYWxzZSwgd2lsbCBhcHBseSB0byBlZGl0ZWRJbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFwcGx5RmlsdGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc2l6ZTtcclxuICAgIC8qKlxyXG4gICAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNob3dQcmV2aWV3O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgcHJldmlldyBjYW52YXMgZGltZW5zaW9ucyBhY2NvcmRpbmcgdG8gdGhlIGNhbnZhcyBlbGVtZW50IG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQb2ludDtcclxuICAgIGdldFN0b3lsZSgpOiB7XHJcbiAgICAgICAgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIGEgY2xhc3MgZm9yIGdlbmVyYXRpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzIGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5kZWNsYXJlIGNsYXNzIEltYWdlRWRpdG9yQ29uZmlnIGltcGxlbWVudHMgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgICAvKipcclxuICAgICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXHJcbiAgICAgKi9cclxuICAgIG1heEltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgICAqL1xyXG4gICAgZWRpdG9yQmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICAgKi9cclxuICAgIGVkaXRvckRpbWVuc2lvbnM6IHtcclxuICAgICAgICB3aWR0aDogc3RyaW5nO1xyXG4gICAgICAgIGhlaWdodDogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgZXh0cmFDc3M6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAgICovXHJcbiAgICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JztcclxuICAgIC8qKlxyXG4gICAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBleHBvcnRJbWFnZUljb246IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbENvbG9yOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wsIGNhbiBiZSBlaXRoZXIgYSByZWN0YW5nbGUgb3IgYSBjaXJjbGVcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xTaGFwZTogUG9pbnRTaGFwZTtcclxuICAgIC8qKlxyXG4gICAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIHBvaW50T3B0aW9uczogUG9pbnRPcHRpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgdGhlIGVkaXRvciBzdHlsZSBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGVkaXRvclN0eWxlPzoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGNyb3AgdG9vbCBvdXRsaW5lIHdpZHRoXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sTGluZVdlaWdodDogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXhpbXVtIHNpemUgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAgICovXHJcbiAgICBtYXhQcmV2aWV3V2lkdGg6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgICAqL1xyXG4gICAgbWF4UHJldmlld0hlaWdodDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZyk7XHJcbn1cclxuZXhwb3J0IHt9O1xyXG4iXX0=