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
    getMode(): string;
    doneCrop(): Promise<void>;
    undo(): void;
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
    rotateImage(clockwise?: boolean): Promise<unknown>;
    /**
     * detects the contours of the document and
     **/
    private detectContours;
    isLeft(coordinate: any, otherVertices: any): boolean;
    isTop(coordinate: any, otherVertices: any): boolean;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRCb3R0b21TaGVldCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7IEVkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zLCBQb2ludFNoYXBlIH0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmltcG9ydCB7IERvY1NjYW5uZXJDb25maWcsIEltYWdlRGltZW5zaW9ucyB9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7IE5neE9wZW5DVlNlcnZpY2UgfSBmcm9tICduZ3gtb3BlbmN2JztcclxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBwcml2YXRlIG5neE9wZW5DdjtcclxuICAgIHByaXZhdGUgbGltaXRzU2VydmljZTtcclxuICAgIHByaXZhdGUgYm90dG9tU2hlZXQ7XHJcbiAgICB2YWx1ZTogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBvcHRpb25zOiBJbWFnZUVkaXRvckNvbmZpZztcclxuICAgIC8qKlxyXG4gICAgICogYW4gYXJyYXkgb2YgYWN0aW9uIGJ1dHRvbnMgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3Igc2NyZWVuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZWRpdG9yQnV0dG9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc3BsYXllZEJ1dHRvbnMoKTogRWRpdG9yQWN0aW9uQnV0dG9uW107XHJcbiAgICAvKipcclxuICAgICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWF4UHJldmlld1dpZHRoO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaW1lbnNpb25zIG9mIHRoZSBpbWFnZSBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgaW1hZ2VEaXZTdHlsZToge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBkaXYgc3R5bGVcclxuICAgICAqL1xyXG4gICAgZWRpdG9yU3R5bGU6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdGF0ZSBvZiBvcGVuY3YgbG9hZGluZ1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGN2U3RhdGU7XHJcbiAgICAvKipcclxuICAgICAqIHRydWUgYWZ0ZXIgdGhlIGltYWdlIGlzIGxvYWRlZCBhbmQgcHJldmlldyBpcyBkaXNwbGF5ZWRcclxuICAgICAqL1xyXG4gICAgaW1hZ2VMb2FkZWQ6IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBtb2RlXHJcbiAgICAgKi9cclxuICAgIG1vZGU6ICdjcm9wJyB8ICdjb2xvcic7XHJcbiAgICAvKipcclxuICAgICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZEZpbHRlcjtcclxuICAgIC8qKlxyXG4gICAgICogdmlld3BvcnQgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGltYWdlIGRpbWVuc2lvbnNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAgICovXHJcbiAgICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGltYWdlUmVzaXplUmF0aW87XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3JpZ2luYWxJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTtcclxuICAgIC8qKlxyXG4gICAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHByZXZpZXdDYW52YXM7XHJcbiAgICAvKipcclxuICAgICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwb2ludHM7XHJcbiAgICAvKipcclxuICAgICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgICAqL1xyXG4gICAgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz47XHJcbiAgICAvKipcclxuICAgICAqIGZpcmVzIG9uIGVkaXQgY29tcGxldGlvblxyXG4gICAgICovXHJcbiAgICBlZGl0UmVzdWx0OiBFdmVudEVtaXR0ZXI8QmxvYj47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAgICovXHJcbiAgICBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRoZSBsb2FkaW5nIHN0YXR1cyBvZiB0aGUgY3YgbW9kdWxlLlxyXG4gICAgICovXHJcbiAgICByZWFkeTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcbiAgICAvKipcclxuICAgICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAgICogQHBhcmFtIGZpbGUgLSBmaWxlIGZyb20gZm9ybSBpbnB1dFxyXG4gICAgICovXHJcbiAgICBzZXQgZmlsZShmaWxlOiBGaWxlKTtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuICAgIGNvbnN0cnVjdG9yKG5neE9wZW5DdjogTmd4T3BlbkNWU2VydmljZSwgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSwgYm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0KTtcclxuICAgIG5nT25Jbml0KCk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGV4aXQoKTogdm9pZDtcclxuICAgIGdldE1vZGUoKTogc3RyaW5nO1xyXG4gICAgZG9uZUNyb3AoKTogUHJvbWlzZTx2b2lkPjtcclxuICAgIHVuZG8oKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGV4cG9ydEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBvcGVuIHRoZSBib3R0b20gc2hlZXQgZm9yIHNlbGVjdGluZyBmaWx0ZXJzLCBhbmQgYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIGluIHByZXZpZXcgbW9kZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNob29zZUZpbHRlcnM7XHJcbiAgICAvKipcclxuICAgICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRGaWxlO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIHJvdGF0ZSBpbWFnZSA5MCBkZWdyZWVzXHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZUltYWdlKGNsb2Nrd2lzZT86IGJvb2xlYW4pOiBQcm9taXNlPHVua25vd24+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXHJcbiAgICAgKiovXHJcbiAgICBwcml2YXRlIGRldGVjdENvbnRvdXJzO1xyXG4gICAgaXNMZWZ0KGNvb3JkaW5hdGU6IGFueSwgb3RoZXJWZXJ0aWNlczogYW55KTogYm9vbGVhbjtcclxuICAgIGlzVG9wKGNvb3JkaW5hdGU6IGFueSwgb3RoZXJWZXJ0aWNlczogYW55KTogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgcG9pbnRzQXJlTm90VGhlU2FtZTtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAgICogd2hlbiBmYWxzZSwgd2lsbCBhcHBseSB0byBlZGl0ZWRJbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFwcGx5RmlsdGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc2l6ZTtcclxuICAgIC8qKlxyXG4gICAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNob3dQcmV2aWV3O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgcHJldmlldyBjYW52YXMgZGltZW5zaW9ucyBhY2NvcmRpbmcgdG8gdGhlIGNhbnZhcyBlbGVtZW50IG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQb2ludDtcclxufVxyXG4vKipcclxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmRlY2xhcmUgY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAgIC8qKlxyXG4gICAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3B1dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm9cclxuICAgICAqL1xyXG4gICAgbWF4SW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAgICovXHJcbiAgICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgICAqL1xyXG4gICAgZWRpdG9yRGltZW5zaW9uczoge1xyXG4gICAgICAgIHdpZHRoOiBzdHJpbmc7XHJcbiAgICAgICAgaGVpZ2h0OiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBleHRyYUNzczoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICAgKi9cclxuICAgIGJ1dHRvblRoZW1lQ29sb3I6ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydEltYWdlSWNvbjogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sQ29sb3I6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCwgY2FuIGJlIGVpdGhlciBhIHJlY3RhbmdsZSBvciBhIGNpcmNsZVxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaW1lbnNpb25zIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyBwb2ludCBhdHRyaWJ1dGVzIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgICAvKipcclxuICAgICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgZWRpdG9yIHN0eWxlIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZWRpdG9yU3R5bGU/OiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogY3JvcCB0b29sIG91dGxpbmUgd2lkdGhcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xMaW5lV2VpZ2h0OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICAgKi9cclxuICAgIG1heFByZXZpZXdXaWR0aDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZyk7XHJcbn1cclxuZXhwb3J0IHt9O1xyXG4iXX0=