/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/image-editor/ngx-doc-scanner.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter } from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxFilterMenuComponent } from '../filter-menu/ngx-filter-menu.component';
import { NgxOpenCVService } from 'ngx-opencv';
export class NgxDocScannerComponent {
    /**
     * @param {?} ngxOpenCv
     * @param {?} limitsService
     * @param {?} bottomSheet
     */
    constructor(ngxOpenCv, limitsService, bottomSheet) {
        this.ngxOpenCv = ngxOpenCv;
        this.limitsService = limitsService;
        this.bottomSheet = bottomSheet;
        /**
         * true after the image is loaded and preview is displayed
         */
        this.imageLoaded = false;
        /**
         * editor mode
         */
        this.mode = 'crop';
        /**
         * filter selected by the user, returned by the filter selector bottom sheet
         */
        this.selectedFilter = 'default';
        /**
         * image dimensions
         */
        this.imageDimensions = {
            width: 0,
            height: 0
        };
        // ************** //
        // EVENT EMITTERS //
        // ************** //
        /**
         * optional binding to the exit button of the editor
         */
        this.exitEditor = new EventEmitter();
        /**
         * fires on edit completion
         */
        this.editResult = new EventEmitter();
        /**
         * emits errors, can be linked to an error handler of choice
         */
        this.error = new EventEmitter();
        /**
         * emits the loading status of the cv module.
         */
        this.ready = new EventEmitter();
        /**
         * emits true when processing is done, false when completed
         */
        this.processing = new EventEmitter();
        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        // subscribe to status of cv module
        this.ngxOpenCv.cvState.subscribe((/**
         * @param {?} cvState
         * @return {?}
         */
        (cvState) => {
            this.cvState = cvState.state;
            this.ready.emit(cvState.ready);
            if (cvState.error) {
                this.error.emit(new Error('error loading cv'));
            }
            else if (cvState.loading) {
                this.processing.emit(true);
            }
            else if (cvState.ready) {
                this.processing.emit(false);
            }
        }));
        // subscribe to positions of crop tool
        this.limitsService.positions.subscribe((/**
         * @param {?} points
         * @return {?}
         */
        points => {
            this.points = points;
        }));
    }
    /**
     * returns an array of buttons according to the editor mode
     * @return {?}
     */
    get displayedButtons() {
        return this.editorButtons.filter((/**
         * @param {?} button
         * @return {?}
         */
        button => {
            return button.mode === this.mode;
        }));
    }
    // ****** //
    // INPUTS //
    // ****** //
    /**
     * set image for editing
     * @param {?} file - file from form input
     * @return {?}
     */
    set file(file) {
        if (file) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.processing.emit(true);
            }), 5);
            this.imageLoaded = false;
            this.originalImage = file;
            this.ngxOpenCv.cvState.subscribe((/**
             * @param {?} cvState
             * @return {?}
             */
            (cvState) => __awaiter(this, void 0, void 0, function* () {
                if (cvState.ready) {
                    // read file to image & canvas
                    yield this.loadFile(file);
                    this.processing.emit(false);
                }
            })));
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.editorButtons = [
            {
                name: 'exit',
                action: (/**
                 * @return {?}
                 */
                () => {
                    this.exitEditor.emit('canceled');
                }),
                icon: 'arrow_back',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'rotate',
                action: this.rotateImage.bind(this),
                icon: 'rotate_right',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'done_crop',
                action: (/**
                 * @return {?}
                 */
                () => __awaiter(this, void 0, void 0, function* () {
                    this.mode = 'color';
                    yield this.transform();
                    if (this.config.filterEnable) {
                        yield this.applyFilter(true);
                    }
                })),
                icon: 'done',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'back',
                action: (/**
                 * @return {?}
                 */
                () => {
                    this.mode = 'crop';
                    this.loadFile(this.originalImage);
                }),
                icon: 'arrow_back',
                type: 'fab',
                mode: 'color'
            },
            {
                name: 'filter',
                action: (/**
                 * @return {?}
                 */
                () => {
                    if (this.config.filterEnable) {
                        return this.chooseFilters();
                    }
                }),
                icon: 'photo_filter',
                type: 'fab',
                mode: this.config.filterEnable ? 'color' : 'disabled'
            },
            {
                name: 'upload',
                action: this.exportImage.bind(this),
                icon: 'cloud_upload',
                type: 'fab',
                mode: 'color'
            },
        ];
        // set options from config object
        this.options = new ImageEditorConfig(this.config);
        // set export image icon
        this.editorButtons.forEach((/**
         * @param {?} button
         * @return {?}
         */
        button => {
            if (button.name === 'upload') {
                button.icon = this.options.exportImageIcon;
            }
        }));
        this.maxPreviewWidth = this.options.maxPreviewWidth;
        this.editorStyle = this.options.editorStyle;
    }
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     * @return {?}
     */
    exit() {
        this.exitEditor.emit('canceled');
    }
    /**
     * applies the selected filter, and when done emits the resulted image
     * @private
     * @return {?}
     */
    exportImage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.applyFilter(false);
            if (this.options.maxImageDimensions) {
                this.resize(this.editedImage)
                    .then((/**
                 * @param {?} resizeResult
                 * @return {?}
                 */
                resizeResult => {
                    resizeResult.toBlob((/**
                     * @param {?} blob
                     * @return {?}
                     */
                    (blob) => {
                        this.editResult.emit(blob);
                        this.processing.emit(false);
                    }), this.originalImage.type);
                }));
            }
            else {
                this.editedImage.toBlob((/**
                 * @param {?} blob
                 * @return {?}
                 */
                (blob) => {
                    this.editResult.emit(blob);
                    this.processing.emit(false);
                }), this.originalImage.type);
            }
        });
    }
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     * @private
     * @return {?}
     */
    chooseFilters() {
        /** @type {?} */
        const data = { filter: this.selectedFilter };
        /** @type {?} */
        const bottomSheetRef = this.bottomSheet.open(NgxFilterMenuComponent, {
            data: data
        });
        bottomSheetRef.afterDismissed().subscribe((/**
         * @return {?}
         */
        () => {
            this.selectedFilter = data.filter;
            this.applyFilter(true);
        }));
    }
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     * @private
     * @param {?} file
     * @return {?}
     */
    loadFile(file) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.processing.emit(true);
            try {
                yield this.readImage(file);
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            try {
                yield this.showPreview();
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            // set pane limits
            // show points
            this.imageLoaded = true;
            yield this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
            setTimeout((/**
             * @return {?}
             */
            () => __awaiter(this, void 0, void 0, function* () {
                yield this.detectContours();
                this.processing.emit(false);
                resolve();
            })), 15);
        })));
    }
    /**
     * read image from File object
     * @private
     * @param {?} file
     * @return {?}
     */
    readImage(file) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            let imageSrc;
            try {
                imageSrc = yield readFile();
            }
            catch (err) {
                reject(err);
            }
            /** @type {?} */
            const img = new Image();
            img.onload = (/**
             * @return {?}
             */
            () => __awaiter(this, void 0, void 0, function* () {
                // set edited image canvas and dimensions
                this.editedImage = (/** @type {?} */ (document.createElement('canvas')));
                this.editedImage.width = img.width;
                this.editedImage.height = img.height;
                /** @type {?} */
                const ctx = this.editedImage.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // resize image if larger than max image size
                /** @type {?} */
                const width = img.width > img.height ? img.height : img.width;
                if (width > this.options.maxImageDimensions.width) {
                    this.editedImage = yield this.resize(this.editedImage);
                }
                this.imageDimensions.width = this.editedImage.width;
                this.imageDimensions.height = this.editedImage.height;
                this.setPreviewPaneDimensions(this.editedImage);
                resolve();
            }));
            img.src = imageSrc;
        })));
        /**
         * read file from input field
         * @return {?}
         */
        function readFile() {
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            (resolve, reject) => {
                /** @type {?} */
                const reader = new FileReader();
                reader.onload = (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    resolve(reader.result);
                });
                reader.onerror = (/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    reject(err);
                });
                reader.readAsDataURL(file);
            }));
        }
    }
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @private
     * @return {?}
     */
    rotateImage() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const dst = cv.imread(this.editedImage);
                // const dst = new cv.Mat();
                cv.transpose(dst, dst);
                cv.flip(dst, dst, 1);
                cv.imshow(this.editedImage, dst);
                // src.delete();
                dst.delete();
                // save current preview dimensions and positions
                /** @type {?} */
                const initialPreviewDimensions = { width: 0, height: 0 };
                Object.assign(initialPreviewDimensions, this.previewDimensions);
                /** @type {?} */
                const initialPositions = Array.from(this.points);
                // get new dimensions
                // set new preview pane dimensions
                this.setPreviewPaneDimensions(this.editedImage);
                // get preview pane resize ratio
                /** @type {?} */
                const previewResizeRatios = {
                    width: this.previewDimensions.width / initialPreviewDimensions.width,
                    height: this.previewDimensions.height / initialPreviewDimensions.height
                };
                // set new preview pane dimensions
                this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
                this.showPreview().then((/**
                 * @return {?}
                 */
                () => {
                    this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    }
    /**
     * detects the contours of the document and
     *
     * @private
     * @return {?}
     */
    detectContours() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            () => {
                // load the image and compute the ratio of the old height to the new height, clone it, and resize it
                /** @type {?} */
                const processingResizeRatio = 0.5;
                /** @type {?} */
                const dst = cv.imread(this.editedImage);
                /** @type {?} */
                const dsize = new cv.Size(dst.rows * processingResizeRatio, dst.cols * processingResizeRatio);
                /** @type {?} */
                const ksize = new cv.Size(5, 5);
                // convert the image to grayscale, blur it, and find edges in the image
                cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
                cv.Canny(dst, dst, 75, 200);
                // find contours
                cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
                /** @type {?} */
                const contours = new cv.MatVector();
                /** @type {?} */
                const hierarchy = new cv.Mat();
                cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                /** @type {?} */
                const rect = cv.boundingRect(dst);
                dst.delete();
                hierarchy.delete();
                contours.delete();
                // transform the rectangle into a set of points
                Object.keys(rect).forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => {
                    rect[key] = rect[key] * this.imageResizeRatio;
                }));
                /** @type {?} */
                const contourCoordinates = [
                    new PositionChangeData({ x: rect.x, y: rect.y }, ['left', 'top']),
                    new PositionChangeData({ x: rect.x + rect.width, y: rect.y }, ['right', 'top']),
                    new PositionChangeData({ x: rect.x + rect.width, y: rect.y + rect.height }, ['right', 'bottom']),
                    new PositionChangeData({ x: rect.x, y: rect.y + rect.height }, ['left', 'bottom']),
                ];
                this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }), 30);
        }));
    }
    /**
     * apply perspective transform
     * @private
     * @return {?}
     */
    transform() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const dst = cv.imread(this.editedImage);
                // create source coordinates matrix
                /** @type {?} */
                const sourceCoordinates = [
                    this.getPoint(['top', 'left']),
                    this.getPoint(['top', 'right']),
                    this.getPoint(['bottom', 'right']),
                    this.getPoint(['bottom', 'left'])
                ].map((/**
                 * @param {?} point
                 * @return {?}
                 */
                point => {
                    return [point.x / this.imageResizeRatio, point.y / this.imageResizeRatio];
                }));
                // get max width
                /** @type {?} */
                const bottomWidth = this.getPoint(['bottom', 'right']).x - this.getPoint(['bottom', 'left']).x;
                /** @type {?} */
                const topWidth = this.getPoint(['top', 'right']).x - this.getPoint(['top', 'left']).x;
                /** @type {?} */
                const maxWidth = Math.max(bottomWidth, topWidth) / this.imageResizeRatio;
                // get max height
                /** @type {?} */
                const leftHeight = this.getPoint(['bottom', 'left']).y - this.getPoint(['top', 'left']).y;
                /** @type {?} */
                const rightHeight = this.getPoint(['bottom', 'right']).y - this.getPoint(['top', 'right']).y;
                /** @type {?} */
                const maxHeight = Math.max(leftHeight, rightHeight) / this.imageResizeRatio;
                // create dest coordinates matrix
                /** @type {?} */
                const destCoordinates = [
                    [0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]
                ];
                // convert to open cv matrix objects
                /** @type {?} */
                const Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...sourceCoordinates));
                /** @type {?} */
                const Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...destCoordinates));
                /** @type {?} */
                const transformMatrix = cv.getPerspectiveTransform(Ms, Md);
                // set new image size
                /** @type {?} */
                const dsize = new cv.Size(maxWidth, maxHeight);
                // perform warp
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
                cv.imshow(this.editedImage, dst);
                dst.delete();
                Ms.delete();
                Md.delete();
                transformMatrix.delete();
                this.setPreviewPaneDimensions(this.editedImage);
                this.showPreview().then((/**
                 * @return {?}
                 */
                () => {
                    this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    }
    /**
     * applies the selected filter to the image
     * @private
     * @param {?} preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     * @return {?}
     */
    applyFilter(preview) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.processing.emit(true);
            // default options
            /** @type {?} */
            const options = {
                blur: false,
                th: true,
                thMode: cv.ADAPTIVE_THRESH_MEAN_C,
                thMeanCorrection: 10,
                thBlockSize: 25,
                thMax: 255,
                grayScale: true,
            };
            /** @type {?} */
            const dst = cv.imread(this.editedImage);
            if (!this.config.filterEnable) {
                this.selectedFilter = 'original';
            }
            switch (this.selectedFilter) {
                case 'original':
                    options.th = false;
                    options.grayScale = false;
                    options.blur = false;
                    break;
                case 'magic_color':
                    options.grayScale = false;
                    break;
                case 'bw2':
                    options.thMode = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
                    options.thMeanCorrection = 15;
                    options.thBlockSize = 15;
                    break;
                case 'bw3':
                    options.blur = true;
                    options.thMeanCorrection = 15;
                    break;
            }
            setTimeout((/**
             * @return {?}
             */
            () => __awaiter(this, void 0, void 0, function* () {
                if (options.grayScale) {
                    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                }
                if (options.blur) {
                    /** @type {?} */
                    const ksize = new cv.Size(5, 5);
                    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
                }
                if (options.th) {
                    if (options.grayScale) {
                        cv.adaptiveThreshold(dst, dst, options.thMax, options.thMode, cv.THRESH_BINARY, options.thBlockSize, options.thMeanCorrection);
                    }
                    else {
                        dst.convertTo(dst, -1, 1, 60);
                        cv.threshold(dst, dst, 170, 255, cv.THRESH_BINARY);
                    }
                }
                if (!preview) {
                    cv.imshow(this.editedImage, dst);
                }
                yield this.showPreview(dst);
                this.processing.emit(false);
                resolve();
            })), 30);
        })));
    }
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     * @private
     * @param {?} image
     * @return {?}
     */
    resize(image) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const src = cv.imread(image);
                /** @type {?} */
                const currentDimensions = {
                    width: src.size().width,
                    height: src.size().height
                };
                /** @type {?} */
                const resizeDimensions = {
                    width: 0,
                    height: 0
                };
                if (currentDimensions.width > this.options.maxImageDimensions.width) {
                    resizeDimensions.width = this.options.maxImageDimensions.width;
                    resizeDimensions.height = this.options.maxImageDimensions.width / currentDimensions.width * currentDimensions.height;
                    if (resizeDimensions.height > this.options.maxImageDimensions.height) {
                        resizeDimensions.height = this.options.maxImageDimensions.height;
                        resizeDimensions.width = this.options.maxImageDimensions.height / currentDimensions.height * currentDimensions.width;
                    }
                    /** @type {?} */
                    const dsize = new cv.Size(Math.floor(resizeDimensions.width), Math.floor(resizeDimensions.height));
                    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
                    /** @type {?} */
                    const resizeResult = (/** @type {?} */ (document.createElement('canvas')));
                    cv.imshow(resizeResult, src);
                    src.delete();
                    this.processing.emit(false);
                    resolve(resizeResult);
                }
                else {
                    this.processing.emit(false);
                    resolve(image);
                }
            }), 30);
        }));
    }
    /**
     * display a preview of the image on the preview canvas
     * @private
     * @param {?=} image
     * @return {?}
     */
    showPreview(image) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            /** @type {?} */
            let src;
            if (image) {
                src = image;
            }
            else {
                src = cv.imread(this.editedImage);
            }
            /** @type {?} */
            const dst = new cv.Mat();
            /** @type {?} */
            const dsize = new cv.Size(0, 0);
            cv.resize(src, dst, dsize, this.imageResizeRatio, this.imageResizeRatio, cv.INTER_AREA);
            cv.imshow(this.previewCanvas.nativeElement, dst);
            src.delete();
            dst.delete();
            resolve();
        }));
    }
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     * @private
     * @param {?} img
     * @return {?}
     */
    setPreviewPaneDimensions(img) {
        // set preview pane dimensions
        this.previewDimensions = this.calculateDimensions(img.width, img.height);
        this.previewCanvas.nativeElement.width = this.previewDimensions.width;
        this.previewCanvas.nativeElement.height = this.previewDimensions.height;
        this.imageResizeRatio = this.previewDimensions.width / img.width;
        this.imageDivStyle = {
            width: this.previewDimensions.width + this.options.cropToolDimensions.width + 'px',
            height: this.previewDimensions.height + this.options.cropToolDimensions.height + 'px',
            'margin-left': `calc((100% - ${this.previewDimensions.width + 10}px) / 2 + ${this.options.cropToolDimensions.width / 2}px)`,
            'margin-right': `calc((100% - ${this.previewDimensions.width + 10}px) / 2 - ${this.options.cropToolDimensions.width / 2}px)`,
        };
        this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
    }
    /**
     * calculate dimensions of the preview canvas
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    calculateDimensions(width, height) {
        /** @type {?} */
        const ratio = width / height;
        /** @type {?} */
        const maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
            this.maxPreviewWidth : this.screenDimensions.width - 40;
        /** @type {?} */
        const maxHeight = this.screenDimensions.height - 240;
        /** @type {?} */
        const calculated = {
            width: maxWidth,
            height: Math.round(maxWidth / ratio),
            ratio: ratio
        };
        if (calculated.height > maxHeight) {
            calculated.height = maxHeight;
            calculated.width = Math.round(maxHeight * ratio);
        }
        return calculated;
    }
    /**
     * returns a point by it's roles
     * @private
     * @param {?} roles - an array of roles by which the point will be fetched
     * @return {?}
     */
    getPoint(roles) {
        return this.points.find((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            return this.limitsService.compareArray(point.roles, roles);
        }));
    }
}
NgxDocScannerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-doc-scanner',
                template: "<div [ngStyle]=\"editorStyle\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\" >\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\" [weight]=\"options.cropToolLineWeight\" [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\" [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: previewDimensions.width, y: 0}\" [limitRoles]=\"['top', 'right']\" [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: 0, y: previewDimensions.height}\" [limitRoles]=\"['bottom', 'left']\" [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\" [limitRoles]=\"['bottom', 'right']\" [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\" style=\"z-index: 5\" ></canvas>\r\n  </div>\r\n  <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\" style=\"position: absolute; bottom: 0; width: 100vw\">\r\n    <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">\r\n      <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">\r\n        <mat-icon>{{button.icon}}</mat-icon>\r\n      </button>\r\n      <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\" (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">\r\n        <mat-icon>{{button.icon}}</mat-icon>\r\n        <span>{{button.text}}}</span>\r\n      </button>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n\r\n\r\n",
                styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}"]
            }] }
];
/** @nocollapse */
NgxDocScannerComponent.ctorParameters = () => [
    { type: NgxOpenCVService },
    { type: LimitsService },
    { type: MatBottomSheet }
];
NgxDocScannerComponent.propDecorators = {
    previewCanvas: [{ type: ViewChild, args: ['PreviewCanvas', { read: ElementRef },] }],
    exitEditor: [{ type: Output }],
    editResult: [{ type: Output }],
    error: [{ type: Output }],
    ready: [{ type: Output }],
    processing: [{ type: Output }],
    file: [{ type: Input }],
    config: [{ type: Input }]
};
if (false) {
    /**
     * editor config object
     * @type {?}
     */
    NgxDocScannerComponent.prototype.options;
    /**
     * an array of action buttons displayed on the editor screen
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.editorButtons;
    /**
     * max width of the preview area
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.maxPreviewWidth;
    /**
     * dimensions of the image container
     * @type {?}
     */
    NgxDocScannerComponent.prototype.imageDivStyle;
    /**
     * editor div style
     * @type {?}
     */
    NgxDocScannerComponent.prototype.editorStyle;
    /**
     * state of opencv loading
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.cvState;
    /**
     * true after the image is loaded and preview is displayed
     * @type {?}
     */
    NgxDocScannerComponent.prototype.imageLoaded;
    /**
     * editor mode
     * @type {?}
     */
    NgxDocScannerComponent.prototype.mode;
    /**
     * filter selected by the user, returned by the filter selector bottom sheet
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.selectedFilter;
    /**
     * viewport dimensions
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.screenDimensions;
    /**
     * image dimensions
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.imageDimensions;
    /**
     * dimensions of the preview pane
     * @type {?}
     */
    NgxDocScannerComponent.prototype.previewDimensions;
    /**
     * ration between preview image and original
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.imageResizeRatio;
    /**
     * stores the original image for reset purposes
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.originalImage;
    /**
     * stores the edited image
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.editedImage;
    /**
     * stores the preview image as canvas
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.previewCanvas;
    /**
     * an array of points used by the crop tool
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.points;
    /**
     * optional binding to the exit button of the editor
     * @type {?}
     */
    NgxDocScannerComponent.prototype.exitEditor;
    /**
     * fires on edit completion
     * @type {?}
     */
    NgxDocScannerComponent.prototype.editResult;
    /**
     * emits errors, can be linked to an error handler of choice
     * @type {?}
     */
    NgxDocScannerComponent.prototype.error;
    /**
     * emits the loading status of the cv module.
     * @type {?}
     */
    NgxDocScannerComponent.prototype.ready;
    /**
     * emits true when processing is done, false when completed
     * @type {?}
     */
    NgxDocScannerComponent.prototype.processing;
    /**
     * editor configuration object
     * @type {?}
     */
    NgxDocScannerComponent.prototype.config;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.ngxOpenCv;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.limitsService;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.bottomSheet;
}
/**
 * a class for generating configuration objects for the editor
 */
class ImageEditorConfig {
    /**
     * @param {?} options
     */
    constructor(options) {
        /**
         * max dimensions of oputput image. if set to zero
         */
        this.maxImageDimensions = {
            width: 800,
            height: 1200
        };
        /**
         * background color of the main editor div
         */
        this.editorBackgroundColor = '#fefefe';
        /**
         * css properties for the main editor div
         */
        this.editorDimensions = {
            width: '100vw',
            height: '100vh'
        };
        /**
         * css that will be added to the main div of the editor component
         */
        this.extraCss = {
            position: 'absolute',
            top: 0,
            left: 0
        };
        /**
         * material design theme color name
         */
        this.buttonThemeColor = 'accent';
        /**
         * icon for the button that completes the editing and emits the edited image
         */
        this.exportImageIcon = 'cloud_upload';
        /**
         * color of the crop tool
         */
        this.cropToolColor = '#3cabe2';
        /**
         * shape of the crop tool, can be either a rectangle or a circle
         */
        this.cropToolShape = 'rect';
        /**
         * dimensions of the crop tool
         */
        this.cropToolDimensions = {
            width: 10,
            height: 10
        };
        /**
         * crop tool outline width
         */
        this.cropToolLineWeight = 3;
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewWidth = 800;
        if (options) {
            Object.keys(options).forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => {
                this[key] = options[key];
            }));
        }
        this.editorStyle = { 'background-color': this.editorBackgroundColor };
        Object.assign(this.editorStyle, this.editorDimensions);
        Object.assign(this.editorStyle, this.extraCss);
        this.pointOptions = {
            shape: this.cropToolShape,
            color: this.cropToolColor,
            width: 0,
            height: 0
        };
        Object.assign(this.pointOptions, this.cropToolDimensions);
    }
}
if (false) {
    /**
     * max dimensions of oputput image. if set to zero
     * @type {?}
     */
    ImageEditorConfig.prototype.maxImageDimensions;
    /**
     * background color of the main editor div
     * @type {?}
     */
    ImageEditorConfig.prototype.editorBackgroundColor;
    /**
     * css properties for the main editor div
     * @type {?}
     */
    ImageEditorConfig.prototype.editorDimensions;
    /**
     * css that will be added to the main div of the editor component
     * @type {?}
     */
    ImageEditorConfig.prototype.extraCss;
    /**
     * material design theme color name
     * @type {?}
     */
    ImageEditorConfig.prototype.buttonThemeColor;
    /**
     * icon for the button that completes the editing and emits the edited image
     * @type {?}
     */
    ImageEditorConfig.prototype.exportImageIcon;
    /**
     * color of the crop tool
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolColor;
    /**
     * shape of the crop tool, can be either a rectangle or a circle
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolShape;
    /**
     * dimensions of the crop tool
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolDimensions;
    /**
     * aggregation of the properties regarding point attributes generated by the class constructor
     * @type {?}
     */
    ImageEditorConfig.prototype.pointOptions;
    /**
     * aggregation of the properties regarding the editor style generated by the class constructor
     * @type {?}
     */
    ImageEditorConfig.prototype.editorStyle;
    /**
     * crop tool outline width
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolLineWeight;
    /**
     * maximum size of the preview pane
     * @type {?}
     */
    ImageEditorConfig.prototype.maxPreviewWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxhQUFhLEVBQXVCLGtCQUFrQixFQUFhLE1BQU0sK0JBQStCLENBQUM7QUFDakgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBSWhGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQVM1QyxNQUFNLE9BQU8sc0JBQXNCOzs7Ozs7SUFxSmpDLFlBQW9CLFNBQTJCLEVBQVUsYUFBNEIsRUFBVSxXQUEyQjtRQUF0RyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCOzs7O1FBeEcxSCxnQkFBVyxHQUFHLEtBQUssQ0FBQzs7OztRQUlwQixTQUFJLEdBQXFCLE1BQU0sQ0FBQzs7OztRQUl4QixtQkFBYyxHQUFHLFNBQVMsQ0FBQzs7OztRQVkzQixvQkFBZSxHQUFvQjtZQUN6QyxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQzs7Ozs7OztRQWdDUSxlQUFVLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7Ozs7UUFJOUQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDOzs7O1FBSTFELFVBQUssR0FBc0IsSUFBSSxZQUFZLEVBQU8s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QUFDO1FBR3BCLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPOzs7O1lBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxFQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDekIsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNGOzs7Ozs7SUFuRkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBMkQ7Ozs7O0lBSTNELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBbUM7Ozs7O0lBSW5DLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQWlEOzs7OztJQUlqRCwrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGEsIFJvbGVzQXJyYXl9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtNYXRCb3R0b21TaGVldH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYm90dG9tLXNoZWV0JztcclxuaW1wb3J0IHtOZ3hGaWx0ZXJNZW51Q29tcG9uZW50fSBmcm9tICcuLi9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHtFZGl0b3JBY3Rpb25CdXR0b24sIFBvaW50T3B0aW9ucywgUG9pbnRTaGFwZX0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbi8vIGltcG9ydCB7Tmd4T3BlbkNWU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmd4LW9wZW5jdi5zZXJ2aWNlJztcclxuaW1wb3J0IHtEb2NTY2FubmVyQ29uZmlnLCBJbWFnZURpbWVuc2lvbnMsIE9wZW5DVlN0YXRlfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5cclxuZGVjbGFyZSB2YXIgY3Y6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRvYy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZyBvYmplY3RcclxuICAgKi9cclxuICBvcHRpb25zOiBJbWFnZUVkaXRvckNvbmZpZztcclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIENPTkZJRyAvL1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBhY3Rpb24gYnV0dG9ucyBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciBzY3JlZW5cclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRvckJ1dHRvbnM6IEFycmF5PEVkaXRvckFjdGlvbkJ1dHRvbj47XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgYnV0dG9ucyBhY2NvcmRpbmcgdG8gdGhlIGVkaXRvciBtb2RlXHJcbiAgICovXHJcbiAgZ2V0IGRpc3BsYXllZEJ1dHRvbnMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JCdXR0b25zLmZpbHRlcihidXR0b24gPT4ge1xyXG4gICAgICByZXR1cm4gYnV0dG9uLm1vZGUgPT09IHRoaXMubW9kZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbWF4IHdpZHRoIG9mIHRoZSBwcmV2aWV3IGFyZWFcclxuICAgKi9cclxuICBwcml2YXRlIG1heFByZXZpZXdXaWR0aDogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGltYWdlRGl2U3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIFNUQVRFIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjdlN0YXRlOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAqL1xyXG4gIGltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBtb2RlOiAnY3JvcCcgfCAnY29sb3InID0gJ2Nyb3AnO1xyXG4gIC8qKlxyXG4gICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgKi9cclxuICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyID0gJ2RlZmF1bHQnO1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gT1BFUkFUSU9OIFZBUklBQkxFUyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzY3JlZW5EaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMCxcclxuICAgIGhlaWdodDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgcHJldmlld0RpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlOiBGaWxlO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAqL1xyXG4gIEBWaWV3Q2hpbGQoJ1ByZXZpZXdDYW52YXMnLCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgcHJldmlld0NhbnZhczogRWxlbWVudFJlZjtcclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBwb2ludHMgdXNlZCBieSB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVWRU5UIEVNSVRURVJTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGV4aXRFZGl0b3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqXHJcbiAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyBlcnJvcnMsIGNhbiBiZSBsaW5rZWQgdG8gYW4gZXJyb3IgaGFuZGxlciBvZiBjaG9pY2VcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdHJ1ZSB3aGVuIHByb2Nlc3NpbmcgaXMgZG9uZSwgZmFsc2Ugd2hlbiBjb21wbGV0ZWRcclxuICAgKi9cclxuICBAT3V0cHV0KCkgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICAvLyAqKioqKiogLy9cclxuICAvLyBJTlBVVFMgLy9cclxuICAvLyAqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcclxuICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICovXHJcbiAgQElucHV0KCkgc2V0IGZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgaWYgKGZpbGUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGZpbGU7XHJcbiAgICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKFxyXG4gICAgICAgIGFzeW5jIChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICAgICAgLy8gcmVhZCBmaWxlIHRvIGltYWdlICYgY2FudmFzXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZEZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmd4T3BlbkN2OiBOZ3hPcGVuQ1ZTZXJ2aWNlLCBwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UsIHByaXZhdGUgYm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0KSB7XHJcbiAgICB0aGlzLnNjcmVlbkRpbWVuc2lvbnMgPSB7XHJcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcclxuICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIH07XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHN0YXR1cyBvZiBjdiBtb2R1bGVcclxuICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICB0aGlzLmN2U3RhdGUgPSBjdlN0YXRlLnN0YXRlO1xyXG4gICAgICB0aGlzLnJlYWR5LmVtaXQoY3ZTdGF0ZS5yZWFkeSk7XHJcbiAgICAgIGlmIChjdlN0YXRlLmVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcignZXJyb3IgbG9hZGluZyBjdicpKTtcclxuICAgICAgfSBlbHNlIGlmIChjdlN0YXRlLmxvYWRpbmcpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSBlbHNlIGlmIChjdlN0YXRlLnJlYWR5KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gcG9zaXRpb25zIG9mIGNyb3AgdG9vbFxyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9ucy5zdWJzY3JpYmUocG9pbnRzID0+IHtcclxuICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2V4aXQnLFxyXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5leGl0RWRpdG9yLmVtaXQoJ2NhbmNlbGVkJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAncm90YXRlJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMucm90YXRlSW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAncm90YXRlX3JpZ2h0JyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY3JvcCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdkb25lX2Nyb3AnLFxyXG4gICAgICAgIGFjdGlvbjogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgICAgICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm1vZGUgPSAnY3JvcCc7XHJcbiAgICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLmVkaXRvclN0eWxlID0gdGhpcy5vcHRpb25zLmVkaXRvclN0eWxlO1xyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXN5bmMgZXhwb3J0SW1hZ2UoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmFwcGx5RmlsdGVyKGZhbHNlKTtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICAgIHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpXHJcbiAgICAgIC50aGVuKHJlc2l6ZVJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmVzaXplUmVzdWx0LnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgfSwgdGhpcy5vcmlnaW5hbEltYWdlLnR5cGUpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWRpdGVkSW1hZ2UudG9CbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICB9LCB0aGlzLm9yaWdpbmFsSW1hZ2UudHlwZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBvcGVuIHRoZSBib3R0b20gc2hlZXQgZm9yIHNlbGVjdGluZyBmaWx0ZXJzLCBhbmQgYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIGluIHByZXZpZXcgbW9kZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2hvb3NlRmlsdGVycygpIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7ZmlsdGVyOiB0aGlzLnNlbGVjdGVkRmlsdGVyfTtcclxuICAgIGNvbnN0IGJvdHRvbVNoZWV0UmVmID0gdGhpcy5ib3R0b21TaGVldC5vcGVuKE5neEZpbHRlck1lbnVDb21wb25lbnQsIHtcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSk7XHJcbiAgICBib3R0b21TaGVldFJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSBkYXRhLmZpbHRlcjtcclxuICAgICAgdGhpcy5hcHBseUZpbHRlcih0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEZpbGUgSW5wdXQgJiBPdXRwdXQgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgbG9hZEZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkSW1hZ2UoZmlsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xyXG4gICAgICB9XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93UHJldmlldygpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBzZXQgcGFuZSBsaW1pdHNcclxuICAgICAgLy8gc2hvdyBwb2ludHNcclxuICAgICAgdGhpcy5pbWFnZUxvYWRlZCA9IHRydWU7XHJcbiAgICAgIGF3YWl0IHRoaXMubGltaXRzU2VydmljZS5zZXRQYW5lRGltZW5zaW9ucyh7d2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGgsIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHR9KTtcclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5kZXRlY3RDb250b3VycygpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDE1KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVhZCBpbWFnZSBmcm9tIEZpbGUgb2JqZWN0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkSW1hZ2UoZmlsZTogRmlsZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IGltYWdlU3JjO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGltYWdlU3JjID0gYXdhaXQgcmVhZEZpbGUoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIGltZy5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gc2V0IGVkaXRlZCBpbWFnZSBjYW52YXMgYW5kIGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGggPSBpbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuZWRpdGVkSW1hZ2UuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgICAgLy8gcmVzaXplIGltYWdlIGlmIGxhcmdlciB0aGFuIG1heCBpbWFnZSBzaXplXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBpbWcud2lkdGggPiBpbWcuaGVpZ2h0ID8gaW1nLmhlaWdodCA6IGltZy53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gYXdhaXQgdGhpcy5yZXNpemUodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLndpZHRoID0gdGhpcy5lZGl0ZWRJbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLmVkaXRlZEltYWdlLmhlaWdodDtcclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICAgIGltZy5zcmMgPSBpbWFnZVNyYztcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBmaWxlIGZyb20gaW5wdXQgZmllbGRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVhZEZpbGUoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoZXJyKSA9PiB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEltYWdlIFByb2Nlc3NpbmcgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHJvdGF0ZSBpbWFnZSA5MCBkZWdyZWVzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByb3RhdGVJbWFnZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgLy8gY29uc3QgZHN0ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LnRyYW5zcG9zZShkc3QsIGRzdCk7XHJcbiAgICAgICAgY3YuZmxpcChkc3QsIGRzdCwgMSk7XHJcbiAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAgICAgLy8gc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgICAvLyBzYXZlIGN1cnJlbnQgcHJldmlldyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbnNcclxuICAgICAgICBjb25zdCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgPSB7d2lkdGg6IDAsIGhlaWdodDogMH07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIHRoaXMucHJldmlld0RpbWVuc2lvbnMpO1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxQb3NpdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzKTtcclxuICAgICAgICAvLyBnZXQgbmV3IGRpbWVuc2lvbnNcclxuICAgICAgICAvLyBzZXQgbmV3IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgLy8gZ2V0IHByZXZpZXcgcGFuZSByZXNpemUgcmF0aW9cclxuICAgICAgICBjb25zdCBwcmV2aWV3UmVzaXplUmF0aW9zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG5cclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2Uucm90YXRlQ2xvY2t3aXNlKHByZXZpZXdSZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGV0ZWN0cyB0aGUgY29udG91cnMgb2YgdGhlIGRvY3VtZW50IGFuZFxyXG4gICAqKi9cclxuICBwcml2YXRlIGRldGVjdENvbnRvdXJzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIGxvYWQgdGhlIGltYWdlIGFuZCBjb21wdXRlIHRoZSByYXRpbyBvZiB0aGUgb2xkIGhlaWdodCB0byB0aGUgbmV3IGhlaWdodCwgY2xvbmUgaXQsIGFuZCByZXNpemUgaXRcclxuICAgICAgICBjb25zdCBwcm9jZXNzaW5nUmVzaXplUmF0aW8gPSAwLjU7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoZHN0LnJvd3MgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8sIGRzdC5jb2xzICogcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvKTtcclxuICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGltYWdlIHRvIGdyYXlzY2FsZSwgYmx1ciBpdCwgYW5kIGZpbmQgZWRnZXMgaW4gdGhlIGltYWdlXHJcbiAgICAgICAgY3YuY3Z0Q29sb3IoZHN0LCBkc3QsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgY3YuR2F1c3NpYW5CbHVyKGRzdCwgZHN0LCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xyXG4gICAgICAgIGN2LkNhbm55KGRzdCwgZHN0LCA3NSwgMjAwKTtcclxuICAgICAgICAvLyBmaW5kIGNvbnRvdXJzXHJcbiAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxMjAsIDIwMCwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XHJcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LmZpbmRDb250b3Vycyhkc3QsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBjdi5ib3VuZGluZ1JlY3QoZHN0KTtcclxuICAgICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgICAgaGllcmFyY2h5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGNvbnRvdXJzLmRlbGV0ZSgpO1xyXG4gICAgICAgIC8vIHRyYW5zZm9ybSB0aGUgcmVjdGFuZ2xlIGludG8gYSBzZXQgb2YgcG9pbnRzXHJcbiAgICAgICAgT2JqZWN0LmtleXMocmVjdCkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgcmVjdFtrZXldID0gcmVjdFtrZXldICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueX0sIFsnbGVmdCcsICd0b3AnXSksXHJcbiAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0Lnl9LCBbJ3JpZ2h0JywgJ3RvcCddKSxcclxuICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydyaWdodCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvblBvaW50cyhjb250b3VyQ29vcmRpbmF0ZXMpO1xyXG4gICAgICAgIC8vIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgc291cmNlIGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcclxuICAgICAgICBdLm1hcChwb2ludCA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gW3BvaW50LnggLyB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHBvaW50LnkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW9dO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBnZXQgbWF4IHdpZHRoXHJcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCB0b3BXaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoYm90dG9tV2lkdGgsIHRvcFdpZHRoKSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxyXG4gICAgICAgIGNvbnN0IGxlZnRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS55O1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS55O1xyXG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBjcmVhdGUgZGVzdCBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBkZXN0Q29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIG1heEhlaWdodCAtIDFdLFxyXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXHJcbiAgICAgICAgY29uc3QgTXMgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5zb3VyY2VDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IE1kID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uZGVzdENvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcclxuICAgICAgICAvLyBzZXQgbmV3IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKG1heFdpZHRoLCBtYXhIZWlnaHQpO1xyXG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxyXG4gICAgICAgIGN2LndhcnBQZXJzcGVjdGl2ZShkc3QsIGRzdCwgdHJhbnNmb3JtTWF0cml4LCBkc2l6ZSwgY3YuSU5URVJfTElORUFSLCBjdi5CT1JERVJfQ09OU1RBTlQsIG5ldyBjdi5TY2FsYXIoKSk7XHJcbiAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcblxyXG4gICAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgICBNcy5kZWxldGUoKTtcclxuICAgICAgICBNZC5kZWxldGUoKTtcclxuICAgICAgICB0cmFuc2Zvcm1NYXRyaXguZGVsZXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHRoaXMuc2hvd1ByZXZpZXcoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICogQHBhcmFtIHByZXZpZXcgLSB3aGVuIHRydWUsIHdpbGwgbm90IGFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIGVkaXRlZCBpbWFnZSBidXQgb25seSBkaXNwbGF5IGEgcHJldmlldy5cclxuICAgKiB3aGVuIGZhbHNlLCB3aWxsIGFwcGx5IHRvIGVkaXRlZEltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhcHBseUZpbHRlcihwcmV2aWV3OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgLy8gZGVmYXVsdCBvcHRpb25zXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmx1cjogZmFsc2UsXHJcbiAgICAgICAgdGg6IHRydWUsXHJcbiAgICAgICAgdGhNb2RlOiBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxyXG4gICAgICAgIHRoTWVhbkNvcnJlY3Rpb246IDEwLFxyXG4gICAgICAgIHRoQmxvY2tTaXplOiAyNSxcclxuICAgICAgICB0aE1heDogMjU1LFxyXG4gICAgICAgIGdyYXlTY2FsZTogdHJ1ZSxcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gJ29yaWdpbmFsJztcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGVkRmlsdGVyKSB7XHJcbiAgICAgICAgY2FzZSAnb3JpZ2luYWwnOlxyXG4gICAgICAgICAgb3B0aW9ucy50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbWFnaWNfY29sb3InOlxyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Mic6XHJcbiAgICAgICAgICBvcHRpb25zLnRoTW9kZSA9IGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBvcHRpb25zLnRoQmxvY2tTaXplID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdidzMnOlxyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gdHJ1ZTtcclxuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgY3YuY3Z0Q29sb3IoZHN0LCBkc3QsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmJsdXIpIHtcclxuICAgICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgICBjdi5HYXVzc2lhbkJsdXIoZHN0LCBkc3QsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnRoKSB7XHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5ncmF5U2NhbGUpIHtcclxuICAgICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoZHN0LCBkc3QsIG9wdGlvbnMudGhNYXgsIG9wdGlvbnMudGhNb2RlLCBjdi5USFJFU0hfQklOQVJZLCBvcHRpb25zLnRoQmxvY2tTaXplLCBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHN0LmNvbnZlcnRUbyhkc3QsIC0xLCAxLCA2MCk7XHJcbiAgICAgICAgICAgIGN2LnRocmVzaG9sZChkc3QsIGRzdCwgMTcwLCAyNTUsIGN2LlRIUkVTSF9CSU5BUlkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByZXZpZXcpIHtcclxuICAgICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KGRzdCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVzaXplKGltYWdlOiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTENhbnZhc0VsZW1lbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQoaW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IHNyYy5zaXplKCkud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IHNyYy5zaXplKCkuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZXNpemVEaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjdXJyZW50RGltZW5zaW9ucy53aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoIC8gY3VycmVudERpbWVuc2lvbnMud2lkdGggKiBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICBpZiAocmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQgLyBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQgKiBjdXJyZW50RGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLndpZHRoKSwgTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLmhlaWdodCkpO1xyXG4gICAgICAgICAgY3YucmVzaXplKHNyYywgc3JjLCBkc2l6ZSwgMCwgMCwgY3YuSU5URVJfQVJFQSk7XHJcbiAgICAgICAgICBjb25zdCByZXNpemVSZXN1bHQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICBjdi5pbXNob3cocmVzaXplUmVzdWx0LCBzcmMpO1xyXG4gICAgICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXNpemVSZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc2hvd1ByZXZpZXcoaW1hZ2U/OiBhbnkpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBzcmM7XHJcbiAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgIHNyYyA9IGltYWdlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoMCwgMCk7XHJcbiAgICAgIGN2LnJlc2l6ZShzcmMsIGRzdCwgZHNpemUsIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgY3YuaW1zaG93KHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LCBkc3QpO1xyXG4gICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKiogLy9cclxuICAvLyBVdGlsaXR5IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgcHJldmlldyBjYW52YXMgZGltZW5zaW9ucyBhY2NvcmRpbmcgdG8gdGhlIGNhbnZhcyBlbGVtZW50IG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKGltZzogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgIC8vIHNldCBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyA9IHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucyhpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG4gICAgdGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgdGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICB0aGlzLmltYWdlUmVzaXplUmF0aW8gPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoIC8gaW1nLndpZHRoO1xyXG4gICAgdGhpcy5pbWFnZURpdlN0eWxlID0ge1xyXG4gICAgICB3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIHRoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggKyAncHgnLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0ICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy5oZWlnaHQgKyAncHgnLFxyXG4gICAgICAnbWFyZ2luLWxlZnQnOiBgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgKyAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWAsXHJcbiAgICAgICdtYXJnaW4tcmlnaHQnOiBgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgLSAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWAsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgcmF0aW86IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XHJcblxyXG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggPiB0aGlzLm1heFByZXZpZXdXaWR0aCA/XHJcbiAgICAgIHRoaXMubWF4UHJldmlld1dpZHRoIDogdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoIC0gNDA7XHJcbiAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMuaGVpZ2h0IC0gMjQwO1xyXG4gICAgY29uc3QgY2FsY3VsYXRlZCA9IHtcclxuICAgICAgd2lkdGg6IG1heFdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IE1hdGgucm91bmQobWF4V2lkdGggLyByYXRpbyksXHJcbiAgICAgIHJhdGlvOiByYXRpb1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoY2FsY3VsYXRlZC5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcclxuICAgICAgY2FsY3VsYXRlZC5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbiAgICAgIGNhbGN1bGF0ZWQud2lkdGggPSBNYXRoLnJvdW5kKG1heEhlaWdodCAqIHJhdGlvKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYWxjdWxhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgKiBAcGFyYW0gcm9sZXMgLSBhbiBhcnJheSBvZiByb2xlcyBieSB3aGljaCB0aGUgcG9pbnQgd2lsbCBiZSBmZXRjaGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRQb2ludChyb2xlczogUm9sZXNBcnJheSkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzLmZpbmQocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheShwb2ludC5yb2xlcywgcm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmNsYXNzIEltYWdlRWRpdG9yQ29uZmlnIGltcGxlbWVudHMgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3B1dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm9cclxuICAgKi9cclxuICBtYXhJbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiA4MDAsXHJcbiAgICBoZWlnaHQ6IDEyMDBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckJhY2tncm91bmRDb2xvciA9ICcjZmVmZWZlJztcclxuICAvKipcclxuICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckRpbWVuc2lvbnM6IHsgd2lkdGg6IHN0cmluZzsgaGVpZ2h0OiBzdHJpbmc7IH0gPSB7XHJcbiAgICB3aWR0aDogJzEwMHZ3JyxcclxuICAgIGhlaWdodDogJzEwMHZoJ1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgKi9cclxuICBleHRyYUNzczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHtcclxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgdG9wOiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICovXHJcbiAgYnV0dG9uVGhlbWVDb2xvcjogJ3ByaW1hcnknIHwgJ3dhcm4nIHwgJ2FjY2VudCcgPSAnYWNjZW50JztcclxuICAvKipcclxuICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgZXhwb3J0SW1hZ2VJY29uID0gJ2Nsb3VkX3VwbG9hZCc7XHJcbiAgLyoqXHJcbiAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sQ29sb3IgPSAnIzNjYWJlMic7XHJcbiAgLyoqXHJcbiAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCwgY2FuIGJlIGVpdGhlciBhIHJlY3RhbmdsZSBvciBhIGNpcmNsZVxyXG4gICAqL1xyXG4gIGNyb3BUb29sU2hhcGU6IFBvaW50U2hhcGUgPSAncmVjdCc7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMTAsXHJcbiAgICBoZWlnaHQ6IDEwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHRoZSBlZGl0b3Igc3R5bGUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBjcm9wIHRvb2wgb3V0bGluZSB3aWR0aFxyXG4gICAqL1xyXG4gIGNyb3BUb29sTGluZVdlaWdodCA9IDM7XHJcbiAgLyoqXHJcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3V2lkdGggPSA4MDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IERvY1NjYW5uZXJDb25maWcpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB7J2JhY2tncm91bmQtY29sb3InOiB0aGlzLmVkaXRvckJhY2tncm91bmRDb2xvcn07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZWRpdG9yRGltZW5zaW9ucyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZXh0cmFDc3MpO1xyXG5cclxuICAgIHRoaXMucG9pbnRPcHRpb25zID0ge1xyXG4gICAgICBzaGFwZTogdGhpcy5jcm9wVG9vbFNoYXBlLFxyXG4gICAgICBjb2xvcjogdGhpcy5jcm9wVG9vbENvbG9yLFxyXG4gICAgICB3aWR0aDogMCxcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnBvaW50T3B0aW9ucywgdGhpcy5jcm9wVG9vbERpbWVuc2lvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuIl19