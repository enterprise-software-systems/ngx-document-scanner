import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EditorActionButton, PointOptions, PointShape } from '../../PrivateModels';
import { DocScannerConfig, ImageDimensions } from '../../PublicModels';
import { NgxOpenCVService } from 'ngx-opencv';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class NgxDocScannerComponent implements OnInit, OnChanges {
    private ngxOpenCv;
    private limitsService;
    private bottomSheet;
    private sanitizer;
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
    imageDivStyle: any;
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
    constructor(ngxOpenCv: NgxOpenCVService, limitsService: LimitsService, bottomSheet: MatBottomSheet, sanitizer: DomSanitizer);
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
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxDocScannerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxDocScannerComponent, "ngx-doc-scanner", never, { "file": "file"; "config": "config"; }, { "exitEditor": "exitEditor"; "editResult": "editResult"; "error": "error"; "ready": "ready"; "processing": "processing"; }, never, never, false, never>;
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
