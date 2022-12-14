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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTGltaXRzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWF0Qm90dG9tU2hlZXQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xyXG5pbXBvcnQgeyBFZGl0b3JBY3Rpb25CdXR0b24sIFBvaW50T3B0aW9ucywgUG9pbnRTaGFwZSB9IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG5pbXBvcnQgeyBEb2NTY2FubmVyQ29uZmlnLCBJbWFnZURpbWVuc2lvbnMgfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQgeyBOZ3hPcGVuQ1ZTZXJ2aWNlIH0gZnJvbSAnbmd4LW9wZW5jdic7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE5neERvY1NjYW5uZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgcHJpdmF0ZSBuZ3hPcGVuQ3Y7XHJcbiAgICBwcml2YXRlIGxpbWl0c1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIGJvdHRvbVNoZWV0O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBvcHRpb25zOiBJbWFnZUVkaXRvckNvbmZpZztcclxuICAgIC8qKlxyXG4gICAgICogYW4gYXJyYXkgb2YgYWN0aW9uIGJ1dHRvbnMgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3Igc2NyZWVuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZWRpdG9yQnV0dG9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc3BsYXllZEJ1dHRvbnMoKTogRWRpdG9yQWN0aW9uQnV0dG9uW107XHJcbiAgICAvKipcclxuICAgICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWF4UHJldmlld1dpZHRoO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaW1lbnNpb25zIG9mIHRoZSBpbWFnZSBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgaW1hZ2VEaXZTdHlsZToge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBkaXYgc3R5bGVcclxuICAgICAqL1xyXG4gICAgZWRpdG9yU3R5bGU6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdGF0ZSBvZiBvcGVuY3YgbG9hZGluZ1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGN2U3RhdGU7XHJcbiAgICAvKipcclxuICAgICAqIHRydWUgYWZ0ZXIgdGhlIGltYWdlIGlzIGxvYWRlZCBhbmQgcHJldmlldyBpcyBkaXNwbGF5ZWRcclxuICAgICAqL1xyXG4gICAgaW1hZ2VMb2FkZWQ6IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBtb2RlXHJcbiAgICAgKi9cclxuICAgIG1vZGU6ICdjcm9wJyB8ICdjb2xvcic7XHJcbiAgICAvKipcclxuICAgICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZEZpbHRlcjtcclxuICAgIC8qKlxyXG4gICAgICogdmlld3BvcnQgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGltYWdlIGRpbWVuc2lvbnNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAgICovXHJcbiAgICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGltYWdlUmVzaXplUmF0aW87XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3JpZ2luYWxJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHByZXZpZXdDYW52YXM7XHJcbiAgICAvKipcclxuICAgICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwb2ludHM7XHJcbiAgICAvKipcclxuICAgICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgICAqL1xyXG4gICAgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz47XHJcbiAgICAvKipcclxuICAgICAqIGZpcmVzIG9uIGVkaXQgY29tcGxldGlvblxyXG4gICAgICovXHJcbiAgICBlZGl0UmVzdWx0OiBFdmVudEVtaXR0ZXI8QmxvYj47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAgICovXHJcbiAgICBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRoZSBsb2FkaW5nIHN0YXR1cyBvZiB0aGUgY3YgbW9kdWxlLlxyXG4gICAgICovXHJcbiAgICByZWFkeTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcbiAgICAvKipcclxuICAgICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAgICogQHBhcmFtIGZpbGUgLSBmaWxlIGZyb20gZm9ybSBpbnB1dFxyXG4gICAgICovXHJcbiAgICBzZXQgZmlsZShmaWxlOiBGaWxlKTtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuICAgIGNvbnN0cnVjdG9yKG5neE9wZW5DdjogTmd4T3BlbkNWU2VydmljZSwgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSwgYm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0KTtcclxuICAgIG5nT25Jbml0KCk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGV4aXQoKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGV4cG9ydEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBvcGVuIHRoZSBib3R0b20gc2hlZXQgZm9yIHNlbGVjdGluZyBmaWx0ZXJzLCBhbmQgYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIGluIHByZXZpZXcgbW9kZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNob29zZUZpbHRlcnM7XHJcbiAgICAvKipcclxuICAgICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRGaWxlO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIHJvdGF0ZSBpbWFnZSA5MCBkZWdyZWVzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcm90YXRlSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIGRldGVjdHMgdGhlIGNvbnRvdXJzIG9mIHRoZSBkb2N1bWVudCBhbmRcclxuICAgICAqKi9cclxuICAgIHByaXZhdGUgZGV0ZWN0Q29udG91cnM7XHJcbiAgICAvKipcclxuICAgICAqIGFwcGx5IHBlcnNwZWN0aXZlIHRyYW5zZm9ybVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIHRvIHRoZSBpbWFnZVxyXG4gICAgICogQHBhcmFtIHByZXZpZXcgLSB3aGVuIHRydWUsIHdpbGwgbm90IGFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIGVkaXRlZCBpbWFnZSBidXQgb25seSBkaXNwbGF5IGEgcHJldmlldy5cclxuICAgICAqIHdoZW4gZmFsc2UsIHdpbGwgYXBwbHkgdG8gZWRpdGVkSW1hZ2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhcHBseUZpbHRlcjtcclxuICAgIC8qKlxyXG4gICAgICogcmVzaXplIGFuIGltYWdlIHRvIGZpdCBjb25zdHJhaW50cyBzZXQgaW4gb3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNpemU7XHJcbiAgICAvKipcclxuICAgICAqIGRpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBpbWFnZSBvbiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzaG93UHJldmlldztcclxuICAgIC8qKlxyXG4gICAgICogc2V0IHByZXZpZXcgY2FudmFzIGRpbWVuc2lvbnMgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXMgZWxlbWVudCBvZiB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXRQcmV2aWV3UGFuZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGNhbGN1bGF0ZSBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICAgKiBAcGFyYW0gcm9sZXMgLSBhbiBhcnJheSBvZiByb2xlcyBieSB3aGljaCB0aGUgcG9pbnQgd2lsbCBiZSBmZXRjaGVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0UG9pbnQ7XHJcbn1cclxuLyoqXHJcbiAqIGEgY2xhc3MgZm9yIGdlbmVyYXRpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzIGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5kZWNsYXJlIGNsYXNzIEltYWdlRWRpdG9yQ29uZmlnIGltcGxlbWVudHMgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgICAvKipcclxuICAgICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXHJcbiAgICAgKi9cclxuICAgIG1heEltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgICAqL1xyXG4gICAgZWRpdG9yQmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICAgKi9cclxuICAgIGVkaXRvckRpbWVuc2lvbnM6IHtcclxuICAgICAgICB3aWR0aDogc3RyaW5nO1xyXG4gICAgICAgIGhlaWdodDogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgZXh0cmFDc3M6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAgICovXHJcbiAgICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JztcclxuICAgIC8qKlxyXG4gICAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBleHBvcnRJbWFnZUljb246IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbENvbG9yOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wsIGNhbiBiZSBlaXRoZXIgYSByZWN0YW5nbGUgb3IgYSBjaXJjbGVcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xTaGFwZTogUG9pbnRTaGFwZTtcclxuICAgIC8qKlxyXG4gICAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIHBvaW50T3B0aW9uczogUG9pbnRPcHRpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgdGhlIGVkaXRvciBzdHlsZSBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGVkaXRvclN0eWxlPzoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGNyb3AgdG9vbCBvdXRsaW5lIHdpZHRoXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sTGluZVdlaWdodDogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXhpbXVtIHNpemUgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAgICovXHJcbiAgICBtYXhQcmV2aWV3V2lkdGg6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IERvY1NjYW5uZXJDb25maWcpO1xyXG59XHJcbmV4cG9ydCB7fTtcclxuIl19