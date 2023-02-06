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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExpbWl0c1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdEJvdHRvbVNoZWV0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYm90dG9tLXNoZWV0JztcclxuaW1wb3J0IHsgRWRpdG9yQWN0aW9uQnV0dG9uLCBQb2ludE9wdGlvbnMsIFBvaW50U2hhcGUgfSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuaW1wb3J0IHsgRG9jU2Nhbm5lckNvbmZpZywgSW1hZ2VEaW1lbnNpb25zIH0gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHsgTmd4T3BlbkNWU2VydmljZSB9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBOZ3hEb2NTY2FubmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gICAgcHJpdmF0ZSBuZ3hPcGVuQ3Y7XHJcbiAgICBwcml2YXRlIGxpbWl0c1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIGJvdHRvbVNoZWV0O1xyXG4gICAgdmFsdWU6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICogZWRpdG9yIGNvbmZpZyBvYmplY3RcclxuICAgICAqL1xyXG4gICAgb3B0aW9uczogSW1hZ2VFZGl0b3JDb25maWc7XHJcbiAgICAvKipcclxuICAgICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGVkaXRvckJ1dHRvbnM7XHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYW4gYXJyYXkgb2YgYnV0dG9ucyBhY2NvcmRpbmcgdG8gdGhlIGVkaXRvciBtb2RlXHJcbiAgICAgKi9cclxuICAgIGdldCBkaXNwbGF5ZWRCdXR0b25zKCk6IEVkaXRvckFjdGlvbkJ1dHRvbltdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgYXJlYVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG1heFByZXZpZXdXaWR0aDtcclxuICAgIC8qKlxyXG4gICAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIGltYWdlRGl2U3R5bGU6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgZGl2IHN0eWxlXHJcbiAgICAgKi9cclxuICAgIGVkaXRvclN0eWxlOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogc3RhdGUgb2Ygb3BlbmN2IGxvYWRpbmdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjdlN0YXRlO1xyXG4gICAgLyoqXHJcbiAgICAgKiB0cnVlIGFmdGVyIHRoZSBpbWFnZSBpcyBsb2FkZWQgYW5kIHByZXZpZXcgaXMgZGlzcGxheWVkXHJcbiAgICAgKi9cclxuICAgIGltYWdlTG9hZGVkOiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiBlZGl0b3IgbW9kZVxyXG4gICAgICovXHJcbiAgICBtb2RlOiAnY3JvcCcgfCAnY29sb3InO1xyXG4gICAgLyoqXHJcbiAgICAgKiBmaWx0ZXIgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHJldHVybmVkIGJ5IHRoZSBmaWx0ZXIgc2VsZWN0b3IgYm90dG9tIHNoZWV0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRGaWx0ZXI7XHJcbiAgICAvKipcclxuICAgICAqIHZpZXdwb3J0IGRpbWVuc2lvbnNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzY3JlZW5EaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgICAqL1xyXG4gICAgcHJldmlld0RpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogcmF0aW9uIGJldHdlZW4gcHJldmlldyBpbWFnZSBhbmQgb3JpZ2luYWxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9yZXMgdGhlIG9yaWdpbmFsIGltYWdlIGZvciByZXNldCBwdXJwb3Nlc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG9yaWdpbmFsSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZWRpdGVkSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIHN0b3JlcyB0aGUgcHJldmlldyBpbWFnZSBhcyBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhbiBhcnJheSBvZiBwb2ludHMgdXNlZCBieSB0aGUgY3JvcCB0b29sXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcG9pbnRzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICAgKi9cclxuICAgIGV4aXRFZGl0b3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBmaXJlcyBvbiBlZGl0IGNvbXBsZXRpb25cclxuICAgICAqL1xyXG4gICAgZWRpdFJlc3VsdDogRXZlbnRFbWl0dGVyPEJsb2I+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlbWl0cyBlcnJvcnMsIGNhbiBiZSBsaW5rZWQgdG8gYW4gZXJyb3IgaGFuZGxlciBvZiBjaG9pY2VcclxuICAgICAqL1xyXG4gICAgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBlbWl0cyB0aGUgbG9hZGluZyBzdGF0dXMgb2YgdGhlIGN2IG1vZHVsZS5cclxuICAgICAqL1xyXG4gICAgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuICAgIC8qKlxyXG4gICAgICogZW1pdHMgdHJ1ZSB3aGVuIHByb2Nlc3NpbmcgaXMgZG9uZSwgZmFsc2Ugd2hlbiBjb21wbGV0ZWRcclxuICAgICAqL1xyXG4gICAgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcclxuICAgICAqIEBwYXJhbSBmaWxlIC0gZmlsZSBmcm9tIGZvcm0gaW5wdXRcclxuICAgICAqL1xyXG4gICAgc2V0IGZpbGUoZmlsZTogRmlsZSk7XHJcbiAgICAvKipcclxuICAgICAqIGVkaXRvciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBjb25maWc6IERvY1NjYW5uZXJDb25maWc7XHJcbiAgICBjb25zdHJ1Y3RvcihuZ3hPcGVuQ3Y6IE5neE9wZW5DVlNlcnZpY2UsIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UsIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCk7XHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGV4aXQoKTogdm9pZDtcclxuICAgIGdldE1vZGUoKTogc3RyaW5nO1xyXG4gICAgZG9uZUNyb3AoKTogUHJvbWlzZTx2b2lkPjtcclxuICAgIHVuZG8oKTogdm9pZDtcclxuICAgIC8qKlxyXG4gICAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGV4cG9ydEltYWdlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBvcGVuIHRoZSBib3R0b20gc2hlZXQgZm9yIHNlbGVjdGluZyBmaWx0ZXJzLCBhbmQgYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIGluIHByZXZpZXcgbW9kZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNob29zZUZpbHRlcnM7XHJcbiAgICAvKipcclxuICAgICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRGaWxlO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkSW1hZ2U7XHJcbiAgICAvKipcclxuICAgICAqIHJvdGF0ZSBpbWFnZSA5MCBkZWdyZWVzXHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZUltYWdlKGNsb2Nrd2lzZT86IGJvb2xlYW4pOiBQcm9taXNlPHVua25vd24+O1xyXG4gICAgZG91YmxlUm90YXRlKCk6IFByb21pc2U8dW5rbm93bj47XHJcbiAgICByb3RhdGUoY2xvY2t3aXNlPzogYm9vbGVhbik6IHZvaWQ7XHJcbiAgICAvKipcclxuICAgICAqIGRldGVjdHMgdGhlIGNvbnRvdXJzIG9mIHRoZSBkb2N1bWVudCBhbmRcclxuICAgICAqKi9cclxuICAgIHByaXZhdGUgZGV0ZWN0Q29udG91cnM7XHJcbiAgICBpc1RvcChjb29yZGluYXRlOiBhbnksIG90aGVyVmVydGljZXM6IGFueSk6IGJvb2xlYW47XHJcbiAgICBpc0xlZnQoY29vcmRpbmF0ZTogYW55LCBzZWNvbmRDb29yZGluYXRlOiBhbnkpOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBwb2ludHNBcmVOb3RUaGVTYW1lO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhcHBseSBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm07XHJcbiAgICAvKipcclxuICAgICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciB0byB0aGUgaW1hZ2VcclxuICAgICAqIEBwYXJhbSBwcmV2aWV3IC0gd2hlbiB0cnVlLCB3aWxsIG5vdCBhcHBseSB0aGUgZmlsdGVyIHRvIHRoZSBlZGl0ZWQgaW1hZ2UgYnV0IG9ubHkgZGlzcGxheSBhIHByZXZpZXcuXHJcbiAgICAgKiB3aGVuIGZhbHNlLCB3aWxsIGFwcGx5IHRvIGVkaXRlZEltYWdlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXBwbHlGaWx0ZXI7XHJcbiAgICAvKipcclxuICAgICAqIHJlc2l6ZSBhbiBpbWFnZSB0byBmaXQgY29uc3RyYWludHMgc2V0IGluIG9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVzaXplO1xyXG4gICAgLyoqXHJcbiAgICAgKiBkaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgaW1hZ2Ugb24gdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2hvd1ByZXZpZXc7XHJcbiAgICAvKipcclxuICAgICAqIHNldCBwcmV2aWV3IGNhbnZhcyBkaW1lbnNpb25zIGFjY29yZGluZyB0byB0aGUgY2FudmFzIGVsZW1lbnQgb2YgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2V0UHJldmlld1BhbmVEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxjdWxhdGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zO1xyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGEgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAgICogQHBhcmFtIHJvbGVzIC0gYW4gYXJyYXkgb2Ygcm9sZXMgYnkgd2hpY2ggdGhlIHBvaW50IHdpbGwgYmUgZmV0Y2hlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFBvaW50O1xyXG59XHJcbi8qKlxyXG4gKiBhIGNsYXNzIGZvciBnZW5lcmF0aW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmb3IgdGhlIGVkaXRvclxyXG4gKi9cclxuZGVjbGFyZSBjbGFzcyBJbWFnZUVkaXRvckNvbmZpZyBpbXBsZW1lbnRzIERvY1NjYW5uZXJDb25maWcge1xyXG4gICAgLyoqXHJcbiAgICAgKiBtYXggZGltZW5zaW9ucyBvZiBvcHV0cHV0IGltYWdlLiBpZiBzZXQgdG8gemVyb1xyXG4gICAgICovXHJcbiAgICBtYXhJbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICAgKi9cclxuICAgIGVkaXRvckJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAgICovXHJcbiAgICBlZGl0b3JEaW1lbnNpb25zOiB7XHJcbiAgICAgICAgd2lkdGg6IHN0cmluZztcclxuICAgICAgICBoZWlnaHQ6IHN0cmluZztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIGV4dHJhQ3NzOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogbWF0ZXJpYWwgZGVzaWduIHRoZW1lIGNvbG9yIG5hbWVcclxuICAgICAqL1xyXG4gICAgYnV0dG9uVGhlbWVDb2xvcjogJ3ByaW1hcnknIHwgJ3dhcm4nIHwgJ2FjY2VudCc7XHJcbiAgICAvKipcclxuICAgICAqIGljb24gZm9yIHRoZSBidXR0b24gdGhhdCBjb21wbGV0ZXMgdGhlIGVkaXRpbmcgYW5kIGVtaXRzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0SW1hZ2VJY29uOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgICAqL1xyXG4gICAgY3JvcFRvb2xDb2xvcjogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sLCBjYW4gYmUgZWl0aGVyIGEgcmVjdGFuZ2xlIG9yIGEgY2lyY2xlXHJcbiAgICAgKi9cclxuICAgIGNyb3BUb29sU2hhcGU6IFBvaW50U2hhcGU7XHJcbiAgICAvKipcclxuICAgICAqIGRpbWVuc2lvbnMgb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbERpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAgIC8qKlxyXG4gICAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHBvaW50IGF0dHJpYnV0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBwb2ludE9wdGlvbnM6IFBvaW50T3B0aW9ucztcclxuICAgIC8qKlxyXG4gICAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHRoZSBlZGl0b3Igc3R5bGUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBlZGl0b3JTdHlsZT86IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBjcm9wIHRvb2wgb3V0bGluZSB3aWR0aFxyXG4gICAgICovXHJcbiAgICBjcm9wVG9vbExpbmVXZWlnaHQ6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgICAqL1xyXG4gICAgbWF4UHJldmlld1dpZHRoOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBEb2NTY2FubmVyQ29uZmlnKTtcclxufVxyXG5leHBvcnQge307XHJcbiJdfQ==