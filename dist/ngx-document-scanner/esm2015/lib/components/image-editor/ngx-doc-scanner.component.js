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
import { DomSanitizer } from '@angular/platform-browser';
export class NgxDocScannerComponent {
    /**
     * @param {?} ngxOpenCv
     * @param {?} limitsService
     * @param {?} bottomSheet
     * @param {?} sanitizer
     */
    constructor(ngxOpenCv, limitsService, bottomSheet, sanitizer) {
        this.ngxOpenCv = ngxOpenCv;
        this.limitsService = limitsService;
        this.bottomSheet = bottomSheet;
        this.sanitizer = sanitizer;
        this.value = 0;
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
                action: this.doneCrop(),
                icon: 'done',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'back',
                action: this.undo(),
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
        this.maxPreviewHeight = this.options.maxPreviewHeight;
        this.editorStyle = this.options.editorStyle;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.config) {
            if (!changes.config.previousValue) {
                return;
            }
            if (changes.config.currentValue.thresholdInfo.thresh !== changes.config.previousValue.thresholdInfo.thresh) {
                this.loadFile(this.originalImage);
            }
            /** @type {?} */
            let updatePreview = false;
            if (changes.config.currentValue.maxPreviewWidth !== changes.config.previousValue.maxPreviewWidth) {
                this.maxPreviewWidth = changes.config.currentValue.maxPreviewWidth;
                updatePreview = true;
            }
            if (changes.config.currentValue.maxPreviewHeight !== changes.config.previousValue.maxPreviewHeight) {
                this.maxPreviewHeight = changes.config.currentValue.maxPreviewHeight;
                updatePreview = true;
            }
            if (changes.config.currentValue.editorDimensions !== changes.config.previousValue.editorDimensions) {
                /** @type {?} */
                const obj = Object.assign({}, this.editorStyle);
                Object.assign(obj, changes.config.currentValue.editorDimensions);
                this.editorStyle = obj;
                updatePreview = true;
            }
            if (updatePreview) {
                this.doubleRotate();
            }
        }
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
     * @return {?}
     */
    getMode() {
        return this.mode;
    }
    /**
     * @return {?}
     */
    doneCrop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mode = 'color';
            yield this.transform();
            if (this.config.filterEnable) {
                yield this.applyFilter(true);
            }
        });
    }
    /**
     * @return {?}
     */
    undo() {
        this.mode = 'crop';
        this.loadFile(this.originalImage);
    }
    /**
     * applies the selected filter, and when done emits the resulted image
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
                    }), 'image/jpeg', 0.8);
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
                }), 'image/jpeg', 0.8);
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
            if (this.editedImage) {
                console.log('clearing old edited image...');
                this.editedImage.remove();
            }
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
     * @param {?=} clockwise
     * @return {?}
     */
    rotateImage(clockwise = true) {
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
                this.rotate(clockwise);
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
     * @return {?}
     */
    doubleRotate() {
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
                this.rotate(true);
                this.rotate(false);
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
     * @param {?=} clockwise
     * @return {?}
     */
    rotate(clockwise = true) {
        /** @type {?} */
        const dst = cv.imread(this.editedImage);
        // const dst = new cv.Mat();
        cv.transpose(dst, dst);
        if (clockwise) {
            cv.flip(dst, dst, 1);
        }
        else {
            cv.flip(dst, dst, 0);
        }
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
        if (clockwise) {
            this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
        }
        else {
            this.limitsService.rotateAntiClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
        }
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
                // const processingResizeRatio = 0.5;
                /** @type {?} */
                const src = cv.imread(this.editedImage);
                /** @type {?} */
                const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
                /** @type {?} */
                const ksize = new cv.Size(5, 5);
                // convert the image to grayscale, blur it, and find edges in the image
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
                // cv.Canny(src, src, 75, 200);
                // find contours
                if (this.config.thresholdInfo.thresholdType === 'standard') {
                    cv.threshold(src, src, this.config.thresholdInfo.thresh, this.config.thresholdInfo.maxValue, cv.THRESH_BINARY);
                }
                else if (this.config.thresholdInfo.thresholdType === 'adaptive_mean') {
                    cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
                }
                else if (this.config.thresholdInfo.thresholdType === 'adaptive_gaussian') {
                    cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
                }
                /** @type {?} */
                const contours = new cv.MatVector();
                /** @type {?} */
                const hierarchy = new cv.Mat();
                cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                /** @type {?} */
                const cnt = contours.get(4);
                if (!cnt) {
                    this.processing.emit(false);
                    return;
                }
                // console.log('----------UNIQUE RECTANGLES FROM ALL CONTOURS----------');
                /** @type {?} */
                const rects = [];
                for (let i = 0; i < contours.size(); i++) {
                    /** @type {?} */
                    const cn = contours.get(i);
                    /** @type {?} */
                    const r = cv.minAreaRect(cn);
                    /** @type {?} */
                    let add = true;
                    if (r.size.height < 50 || r.size.width < 50
                        || r.angle === 90 || r.angle === 180 || r.angle === 0
                        || r.angle === -90 || r.angle === -180) {
                        continue;
                    }
                    for (let j = 0; j < rects.length; j++) {
                        if (rects[j].angle === r.angle
                            && rects[j].center.x === r.center.x && rects[j].center.y === r.center.y
                            && rects[j].size.width === r.size.width && rects[j].size.height === r.size.height) {
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        rects.push(r);
                    }
                    else {
                        try {
                            r.delete();
                        }
                        catch (e) {
                        }
                    }
                }
                /** @type {?} */
                let rect2 = cv.minAreaRect(cnt);
                for (let i = 0; i < rects.length; i++) {
                    if (((rects[i].size.width * rects[i].size.height) > (rect2.size.width * rect2.size.height)
                        && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
                            || rects[i].angle === -90 || rects[i].angle === -180) && ((rects[i].angle > 85 || rects[i].angle < 5)))) {
                        rect2 = rects[i];
                    }
                }
                /** @type {?} */
                const vertices = cv.RotatedRect.points(rect2);
                for (let i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * this.imageResizeRatio;
                }
                /** @type {?} */
                const rect = cv.boundingRect(src);
                src.delete();
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
                let contourCoordinates;
                /** @type {?} */
                const firstRoles = [this.isTop(vertices[0], [vertices[1], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                const secondRoles = [this.isTop(vertices[1], [vertices[0], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                const thirdRoles = [this.isTop(vertices[2], [vertices[0], vertices[1], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                const fourthRoles = [this.isTop(vertices[3], [vertices[0], vertices[2], vertices[1]]) ? 'top' : 'bottom'];
                /** @type {?} */
                const roles = [firstRoles, secondRoles, thirdRoles, fourthRoles];
                /** @type {?} */
                const ts = [];
                /** @type {?} */
                const bs = [];
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i][0] === 'top') {
                        ts.push(i);
                    }
                    else {
                        bs.push(i);
                    }
                }
                dst.delete();
                cnt.delete();
                try {
                    if (this.isLeft(vertices[ts[0]], vertices[ts[1]])) {
                        roles[ts[0]].push('left');
                        roles[ts[1]].push('right');
                    }
                    else {
                        roles[ts[1]].push('right');
                        roles[ts[0]].push('left');
                    }
                    if (this.isLeft(vertices[bs[0]], vertices[bs[1]])) {
                        roles[bs[0]].push('left');
                        roles[bs[1]].push('right');
                    }
                    else {
                        roles[bs[1]].push('left');
                        roles[bs[0]].push('right');
                    }
                }
                catch (e) {
                    this.processing.emit(false);
                    return;
                }
                if (this.config.useRotatedRectangle
                    && this.pointsAreNotTheSame(vertices)) {
                    contourCoordinates = [
                        new PositionChangeData({ x: vertices[0].x, y: vertices[0].y }, firstRoles),
                        new PositionChangeData({ x: vertices[1].x, y: vertices[1].y }, secondRoles),
                        new PositionChangeData({ x: vertices[2].x, y: vertices[2].y }, thirdRoles),
                        new PositionChangeData({ x: vertices[3].x, y: vertices[3].y }, fourthRoles),
                    ];
                }
                else {
                    contourCoordinates = [
                        new PositionChangeData({ x: rect.x, y: rect.y }, ['left', 'top']),
                        new PositionChangeData({ x: rect.x + rect.width, y: rect.y }, ['right', 'top']),
                        new PositionChangeData({ x: rect.x + rect.width, y: rect.y + rect.height }, ['right', 'bottom']),
                        new PositionChangeData({ x: rect.x, y: rect.y + rect.height }, ['left', 'bottom']),
                    ];
                }
                this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }), 30);
        }));
    }
    /**
     * @param {?} coordinate
     * @param {?} otherVertices
     * @return {?}
     */
    isTop(coordinate, otherVertices) {
        /** @type {?} */
        let count = 0;
        for (let i = 0; i < otherVertices.length; i++) {
            if (coordinate.y < otherVertices[i].y) {
                count++;
            }
        }
        return count >= 2;
    }
    /**
     * @param {?} coordinate
     * @param {?} secondCoordinate
     * @return {?}
     */
    isLeft(coordinate, secondCoordinate) {
        return coordinate.x < secondCoordinate.x;
    }
    /**
     * @private
     * @param {?} vertices
     * @return {?}
     */
    pointsAreNotTheSame(vertices) {
        return !(vertices[0].x === vertices[1].x && vertices[1].x === vertices[2].x && vertices[2].x === vertices[3].x &&
            vertices[0].y === vertices[1].y && vertices[1].y === vertices[2].y && vertices[2].y === vertices[3].y);
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
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_CUBIC, cv.BORDER_CONSTANT, new cv.Scalar());
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
            try {
                if (image) {
                    image.delete();
                }
            }
            catch (e) {
            }
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
            'margin-left': this.sanitizer.bypassSecurityTrustStyle(`calc((100% - ${this.previewDimensions.width + 10}px) / 2 + ${this.options.cropToolDimensions.width / 2}px)`),
            'margin-right': this.sanitizer.bypassSecurityTrustStyle(`calc((100% - ${this.previewDimensions.width + 10}px) / 2 - ${this.options.cropToolDimensions.width / 2}px)`),
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
        // const maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
        //   this.maxPreviewWidth : this.screenDimensions.width - 40;
        // const maxHeight = this.screenDimensions.height > this.maxPreviewHeight ? this.maxPreviewHeight : this.screenDimensions.height - 240;
        /** @type {?} */
        const maxWidth = this.maxPreviewWidth;
        /** @type {?} */
        const maxHeight = this.maxPreviewHeight;
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
    /**
     * @return {?}
     */
    getStoyle() {
        return this.editorStyle;
    }
}
NgxDocScannerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-doc-scanner',
                template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n",
                styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}"]
            }] }
];
/** @nocollapse */
NgxDocScannerComponent.ctorParameters = () => [
    { type: NgxOpenCVService },
    { type: LimitsService },
    { type: MatBottomSheet },
    { type: DomSanitizer }
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
    /** @type {?} */
    NgxDocScannerComponent.prototype.value;
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
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.maxPreviewHeight;
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
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.sanitizer;
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
            width: 30000,
            height: 30000
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
        this.cropToolColor = '#FF3333';
        /**
         * shape of the crop tool, can be either a rectangle or a circle
         */
        this.cropToolShape = 'circle';
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
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewHeight = 800;
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
    /**
     * maximum size of the preview pane
     * @type {?}
     */
    ImageEditorConfig.prototype.maxPreviewHeight;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQVN2RCxNQUFNLE9BQU8sc0JBQXNCOzs7Ozs7O0lBdUpqQyxZQUFvQixTQUEyQixFQUFVLGFBQTRCLEVBQ2pFLFdBQTJCLEVBQVUsU0FBdUI7UUFENUQsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUNqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBdkpoRixVQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O1FBK0NWLGdCQUFXLEdBQUcsS0FBSyxDQUFDOzs7O1FBSXBCLFNBQUksR0FBcUIsTUFBTSxDQUFDOzs7O1FBSXhCLG1CQUFjLEdBQUcsU0FBUyxDQUFDOzs7O1FBWTNCLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDOzs7Ozs7O1FB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RyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUNoRCxDQUFDLEVBQUMsQ0FBQzs7b0JBRUMsa0JBQXdDOztzQkFFdEMsVUFBVSxHQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztzQkFDOUcsV0FBVyxHQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztzQkFDL0csVUFBVSxHQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztzQkFDOUcsV0FBVyxHQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztzQkFFL0csS0FBSyxHQUFHLENBQUMs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bnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhLCBSb2xlc0FycmF5fSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7Tmd4RmlsdGVyTWVudUNvbXBvbmVudH0gZnJvbSAnLi4vZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RWRpdG9yQWN0aW9uQnV0dG9uLCBQb2ludE9wdGlvbnMsIFBvaW50U2hhcGV9IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG4vLyBpbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25neC1vcGVuY3Yuc2VydmljZSc7XHJcbmltcG9ydCB7RG9jU2Nhbm5lckNvbmZpZywgSW1hZ2VEaW1lbnNpb25zLCBPcGVuQ1ZTdGF0ZX0gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlfSBmcm9tICduZ3gtb3BlbmN2JztcclxuaW1wb3J0IHtEb21TYW5pdGl6ZXJ9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5cclxuZGVjbGFyZSB2YXIgY3Y6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRvYy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICB2YWx1ZSA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWcgb2JqZWN0XHJcbiAgICovXHJcbiAgb3B0aW9uczogSW1hZ2VFZGl0b3JDb25maWc7XHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVESVRPUiBDT05GSUcgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgYWN0aW9uIGJ1dHRvbnMgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3Igc2NyZWVuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+O1xyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIGJ1dHRvbnMgYWNjb3JkaW5nIHRvIHRoZSBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIGdldCBkaXNwbGF5ZWRCdXR0b25zKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yQnV0dG9ucy5maWx0ZXIoYnV0dG9uID0+IHtcclxuICAgICAgcmV0dXJuIGJ1dHRvbi5tb2RlID09PSB0aGlzLm1vZGU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF4UHJldmlld0hlaWdodDogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBtYXhQcmV2aWV3V2lkdGg6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBpbWFnZSBjb250YWluZXJcclxuICAgKi9cclxuICBpbWFnZURpdlN0eWxlOiBhbnk7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIFNUQVRFIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjdlN0YXRlOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAqL1xyXG4gIGltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBtb2RlOiAnY3JvcCcgfCAnY29sb3InID0gJ2Nyb3AnO1xyXG4gIC8qKlxyXG4gICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgKi9cclxuICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyID0gJ2RlZmF1bHQnO1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gT1BFUkFUSU9OIFZBUklBQkxFUyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzY3JlZW5EaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMCxcclxuICAgIGhlaWdodDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgcHJldmlld0RpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlOiBGaWxlO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAqL1xyXG4gIEBWaWV3Q2hpbGQoJ1ByZXZpZXdDYW52YXMnLCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgcHJldmlld0NhbnZhczogRWxlbWVudFJlZjtcclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBwb2ludHMgdXNlZCBieSB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVWRU5UIEVNSVRURVJTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGV4aXRFZGl0b3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqXHJcbiAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyBlcnJvcnMsIGNhbiBiZSBsaW5rZWQgdG8gYW4gZXJyb3IgaGFuZGxlciBvZiBjaG9pY2VcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdHJ1ZSB3aGVuIHByb2Nlc3NpbmcgaXMgZG9uZSwgZmFsc2Ugd2hlbiBjb21wbGV0ZWRcclxuICAgKi9cclxuICBAT3V0cHV0KCkgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICAvLyAqKioqKiogLy9cclxuICAvLyBJTlBVVFMgLy9cclxuICAvLyAqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcclxuICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICovXHJcbiAgQElucHV0KCkgc2V0IGZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgaWYgKGZpbGUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGZpbGU7XHJcbiAgICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKFxyXG4gICAgICAgIGFzeW5jIChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICAgICAgLy8gcmVhZCBmaWxlIHRvIGltYWdlICYgY2FudmFzXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZEZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hPcGVuQ3Y6IE5neE9wZW5DVlNlcnZpY2UsIHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCwgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xyXG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xyXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBzdGF0dXMgb2YgY3YgbW9kdWxlXHJcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgdGhpcy5jdlN0YXRlID0gY3ZTdGF0ZS5zdGF0ZTtcclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KGN2U3RhdGUucmVhZHkpO1xyXG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoJ2Vycm9yIGxvYWRpbmcgY3YnKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvaW50cyA9PiB7XHJcbiAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdleGl0JyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JvdGF0ZScsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnJvdGF0ZUltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ3JvdGF0ZV9yaWdodCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZG9uZV9jcm9wJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZG9uZUNyb3AoKSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnVuZG8oKSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLm1heFByZXZpZXdIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld0hlaWdodDtcclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB0aGlzLm9wdGlvbnMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jb25maWcpIHtcclxuICAgICAgaWYgKCFjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUudGhyZXNob2xkSW5mby50aHJlc2ggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUudGhyZXNob2xkSW5mby50aHJlc2gpIHtcclxuICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHVwZGF0ZVByZXZpZXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5tYXhQcmV2aWV3V2lkdGggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUubWF4UHJldmlld1dpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld0hlaWdodCAhPT0gY2hhbmdlcy5jb25maWcucHJldmlvdXNWYWx1ZS5tYXhQcmV2aWV3SGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3SGVpZ2h0ID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLm1heFByZXZpZXdIZWlnaHQ7XHJcbiAgICAgICAgdXBkYXRlUHJldmlldyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLmVkaXRvckRpbWVuc2lvbnMpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB7Li4udGhpcy5lZGl0b3JTdHlsZX07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvYmosIGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmVkaXRvclN0eWxlID0gb2JqO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cGRhdGVQcmV2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5kb3VibGVSb3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvbmVDcm9wKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2Nyb3AnO1xyXG4gICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGFzeW5jIGV4cG9ydEltYWdlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKVxyXG4gICAgICAudGhlbihyZXNpemVSZXN1bHQgPT4ge1xyXG4gICAgICAgIHJlc2l6ZVJlc3VsdC50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH0sICdpbWFnZS9qcGVnJywgMC44KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVkaXRlZEltYWdlLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfSwgJ2ltYWdlL2pwZWcnLCAwLjgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcclxuICAgKi9cclxuICBwcml2YXRlIGNob29zZUZpbHRlcnMoKSB7XHJcbiAgICBjb25zdCBkYXRhID0ge2ZpbHRlcjogdGhpcy5zZWxlY3RlZEZpbHRlcn07XHJcbiAgICBjb25zdCBib3R0b21TaGVldFJlZiA9IHRoaXMuYm90dG9tU2hlZXQub3BlbihOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LCB7XHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pO1xyXG4gICAgYm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gZGF0YS5maWx0ZXI7XHJcbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBGaWxlIElucHV0ICYgT3V0cHV0IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBsb2FkIGltYWdlIGZyb20gaW5wdXQgZmllbGRcclxuICAgKi9cclxuICBwcml2YXRlIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZEltYWdlKGZpbGUpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IHBhbmUgbGltaXRzXHJcbiAgICAgIC8vIHNob3cgcG9pbnRzXHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSB0cnVlO1xyXG4gICAgICBhd2FpdCB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0Q29udG91cnMoKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAxNSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlYWQgaW1hZ2UgZnJvbSBGaWxlIG9iamVjdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZEltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBpbWFnZVNyYztcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpbWFnZVNyYyA9IGF3YWl0IHJlYWRGaWxlKCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBpZiAodGhpcy5lZGl0ZWRJbWFnZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbGVhcmluZyBvbGQgZWRpdGVkIGltYWdlLi4uJyk7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgICBpbWcub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIHNldCBlZGl0ZWQgaW1hZ2UgY2FudmFzIGFuZCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLndpZHRoID0gaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLmVkaXRlZEltYWdlLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgICAgIC8vIHJlc2l6ZSBpbWFnZSBpZiBsYXJnZXIgdGhhbiBtYXggaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gaW1nLndpZHRoID4gaW1nLmhlaWdodCA/IGltZy5oZWlnaHQgOiBpbWcud2lkdGg7XHJcbiAgICAgICAgaWYgKHdpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IGF3YWl0IHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy53aWR0aCA9IHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBpbWcuc3JjID0gaW1hZ2VTcmM7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgZmlsZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlYWRGaWxlKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKGVycikgPT4ge1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBJbWFnZSBQcm9jZXNzaW5nIE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiByb3RhdGUgaW1hZ2UgOTAgZGVncmVlc1xyXG4gICAqL1xyXG4gIHJvdGF0ZUltYWdlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZShjbG9ja3dpc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZG91YmxlUm90YXRlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucm90YXRlKHRydWUpO1xyXG4gICAgICAgIHRoaXMucm90YXRlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgIC8vIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgIGN2LnRyYW5zcG9zZShkc3QsIGRzdCk7XHJcbiAgICBpZiAoY2xvY2t3aXNlKSB7XHJcbiAgICAgIGN2LmZsaXAoZHN0LCBkc3QsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3YuZmxpcChkc3QsIGRzdCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAvLyBzcmMuZGVsZXRlKCk7XHJcbiAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAvLyBzYXZlIGN1cnJlbnQgcHJldmlldyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbnNcclxuICAgIGNvbnN0IGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyA9IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcclxuICAgIE9iamVjdC5hc3NpZ24oaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCB0aGlzLnByZXZpZXdEaW1lbnNpb25zKTtcclxuICAgIGNvbnN0IGluaXRpYWxQb3NpdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzKTtcclxuICAgIC8vIGdldCBuZXcgZGltZW5zaW9uc1xyXG4gICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAvLyBnZXQgcHJldmlldyBwYW5lIHJlc2l6ZSByYXRpb1xyXG4gICAgY29uc3QgcHJldmlld1Jlc2l6ZVJhdGlvcyA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICB9O1xyXG4gICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG5cclxuICAgIGlmIChjbG9ja3dpc2UpIHtcclxuICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUNsb2Nrd2lzZShwcmV2aWV3UmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUFudGlDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRldGVjdHMgdGhlIGNvbnRvdXJzIG9mIHRoZSBkb2N1bWVudCBhbmRcclxuICAgKiovXHJcbiAgcHJpdmF0ZSBkZXRlY3RDb250b3VycygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBsb2FkIHRoZSBpbWFnZSBhbmQgY29tcHV0ZSB0aGUgcmF0aW8gb2YgdGhlIG9sZCBoZWlnaHQgdG8gdGhlIG5ldyBoZWlnaHQsIGNsb25lIGl0LCBhbmQgcmVzaXplIGl0XHJcbiAgICAgICAgLy8gY29uc3QgcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvID0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5NYXQuemVyb3Moc3JjLnJvd3MsIHNyYy5jb2xzLCBjdi5DVl84VUMzKTtcclxuICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGltYWdlIHRvIGdyYXlzY2FsZSwgYmx1ciBpdCwgYW5kIGZpbmQgZWRnZXMgaW4gdGhlIGltYWdlXHJcbiAgICAgICAgY3YuY3Z0Q29sb3Ioc3JjLCBzcmMsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgY3YuR2F1c3NpYW5CbHVyKHNyYywgc3JjLCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xyXG4gICAgICAgIC8vIGN2LkNhbm55KHNyYywgc3JjLCA3NSwgMjAwKTtcclxuICAgICAgICAvLyBmaW5kIGNvbnRvdXJzXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICAgIGN2LnRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2gsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LlRIUkVTSF9CSU5BUlkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfbWVhbicpIHtcclxuICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxyXG4gICAgICAgICAgICBjdi5USFJFU0hfQklOQVJZLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmJsb2NrU2l6ZSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5jKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ2FkYXB0aXZlX2dhdXNzaWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DLFxyXG4gICAgICAgICAgICBjdi5USFJFU0hfQklOQVJZLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmJsb2NrU2l6ZSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRvdXJzID0gbmV3IGN2Lk1hdFZlY3RvcigpO1xyXG4gICAgICAgIGNvbnN0IGhpZXJhcmNoeSA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgICBjdi5maW5kQ29udG91cnMoc3JjLCBjb250b3VycywgaGllcmFyY2h5LCBjdi5SRVRSX0NDT01QLCBjdi5DSEFJTl9BUFBST1hfU0lNUExFKTtcclxuICAgICAgICBjb25zdCBjbnQgPSBjb250b3Vycy5nZXQoNCk7XHJcbiAgICAgICAgaWYgKCFjbnQpIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS1VTklRVUUgUkVDVEFOR0xFUyBGUk9NIEFMTCBDT05UT1VSUy0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zdCByZWN0cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udG91cnMuc2l6ZSgpOyBpKyspIHtcclxuICAgICAgICAgIGNvbnN0IGNuID0gY29udG91cnMuZ2V0KGkpO1xyXG4gICAgICAgICAgY29uc3QgciA9IGN2Lm1pbkFyZWFSZWN0KGNuKTtcclxuICAgICAgICAgIGxldCBhZGQgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHIuc2l6ZS5oZWlnaHQgPCA1MCB8fCByLnNpemUud2lkdGggPCA1MFxyXG4gICAgICAgICAgICB8fCByLmFuZ2xlID09PSA5MCB8fCByLmFuZ2xlID09PSAxODAgfHwgci5hbmdsZSA9PT0gMFxyXG4gICAgICAgICAgICB8fCByLmFuZ2xlID09PSAtOTAgfHwgci5hbmdsZSA9PT0gLTE4MFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVjdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIHJlY3RzW2pdLmFuZ2xlID09PSByLmFuZ2xlXHJcbiAgICAgICAgICAgICAgJiYgcmVjdHNbal0uY2VudGVyLnggPT09IHIuY2VudGVyLnggJiYgcmVjdHNbal0uY2VudGVyLnkgPT09IHIuY2VudGVyLnlcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5zaXplLndpZHRoID09PSByLnNpemUud2lkdGggJiYgcmVjdHNbal0uc2l6ZS5oZWlnaHQgPT09IHIuc2l6ZS5oZWlnaHRcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgIHJlY3RzLnB1c2gocik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIHIuZGVsZXRlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlY3QyID0gY3YubWluQXJlYVJlY3QoY250KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoKChyZWN0c1tpXS5zaXplLndpZHRoICogcmVjdHNbaV0uc2l6ZS5oZWlnaHQpID4gKHJlY3QyLnNpemUud2lkdGggKiByZWN0Mi5zaXplLmhlaWdodClcclxuICAgICAgICAgICAgJiYgIShyZWN0c1tpXS5hbmdsZSA9PT0gOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IDE4MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMFxyXG4gICAgICAgICAgICAgIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAtOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC0xODApICYmICgocmVjdHNbaV0uYW5nbGUgPiA4NSB8fCByZWN0c1tpXS5hbmdsZSA8IDUpKSlcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZWN0MiA9IHJlY3RzW2ldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0Mik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgIHZlcnRpY2VzW2ldLnggPSB2ZXJ0aWNlc1tpXS54ICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgICAgdmVydGljZXNbaV0ueSA9IHZlcnRpY2VzW2ldLnkgKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gY3YuYm91bmRpbmdSZWN0KHNyYyk7XHJcblxyXG4gICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICBoaWVyYXJjaHkuZGVsZXRlKCk7XHJcbiAgICAgICAgY29udG91cnMuZGVsZXRlKCk7XHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRoZSByZWN0YW5nbGUgaW50byBhIHNldCBvZiBwb2ludHNcclxuICAgICAgICBPYmplY3Qua2V5cyhyZWN0KS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICByZWN0W2tleV0gPSByZWN0W2tleV0gKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb250b3VyQ29vcmRpbmF0ZXM6IFBvc2l0aW9uQ2hhbmdlRGF0YVtdO1xyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMF0sIFt2ZXJ0aWNlc1sxXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCBzZWNvbmRSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzFdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3QgdGhpcmRSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzJdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzFdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3QgZm91cnRoUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1szXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbMV1dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG5cclxuICAgICAgICBjb25zdCByb2xlcyA9IFtmaXJzdFJvbGVzLCBzZWNvbmRSb2xlcywgdGhpcmRSb2xlcywgZm91cnRoUm9sZXNdO1xyXG4gICAgICAgIGNvbnN0IHRzID0gW107XHJcbiAgICAgICAgY29uc3QgYnMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHJvbGVzW2ldWzBdID09PSAndG9wJykge1xyXG4gICAgICAgICAgICB0cy5wdXNoKGkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnMucHVzaChpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgICBjbnQuZGVsZXRlKCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0xlZnQodmVydGljZXNbdHNbMF1dLCB2ZXJ0aWNlc1t0c1sxXV0pKSB7XHJcbiAgICAgICAgICAgIHJvbGVzW3RzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICAgIHJvbGVzW3RzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICAgIHJvbGVzW3RzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNMZWZ0KHZlcnRpY2VzW2JzWzBdXSwgdmVydGljZXNbYnNbMV1dKSkge1xyXG4gICAgICAgICAgICByb2xlc1tic1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgICByb2xlc1tic1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzFdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzBdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcudXNlUm90YXRlZFJlY3RhbmdsZVxyXG4gICAgICAgICAgJiYgdGhpcy5wb2ludHNBcmVOb3RUaGVTYW1lKHZlcnRpY2VzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29udG91ckNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1swXS54LCB5OiB2ZXJ0aWNlc1swXS55fSwgZmlyc3RSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzFdLngsIHk6IHZlcnRpY2VzWzFdLnl9LCBzZWNvbmRSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzJdLngsIHk6IHZlcnRpY2VzWzJdLnl9LCB0aGlyZFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbM10ueCwgeTogdmVydGljZXNbM10ueX0sIGZvdXJ0aFJvbGVzKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0Lnl9LCBbJ2xlZnQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0Lnl9LCBbJ3JpZ2h0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ3JpZ2h0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsnbGVmdCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uUG9pbnRzKGNvbnRvdXJDb29yZGluYXRlcyk7XHJcbiAgICAgICAgLy8gdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc1RvcChjb29yZGluYXRlLCBvdGhlclZlcnRpY2VzKTogYm9vbGVhbiB7XHJcblxyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3RoZXJWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoY29vcmRpbmF0ZS55IDwgb3RoZXJWZXJ0aWNlc1tpXS55KSB7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudCA+PSAyO1xyXG5cclxuICB9XHJcblxyXG4gIGlzTGVmdChjb29yZGluYXRlLCBzZWNvbmRDb29yZGluYXRlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gY29vcmRpbmF0ZS54IDwgc2Vjb25kQ29vcmRpbmF0ZS54O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludHNBcmVOb3RUaGVTYW1lKHZlcnRpY2VzOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhKHZlcnRpY2VzWzBdLnggPT09IHZlcnRpY2VzWzFdLnggJiYgdmVydGljZXNbMV0ueCA9PT0gdmVydGljZXNbMl0ueCAmJiB2ZXJ0aWNlc1syXS54ID09PSB2ZXJ0aWNlc1szXS54ICYmXHJcbiAgICAgIHZlcnRpY2VzWzBdLnkgPT09IHZlcnRpY2VzWzFdLnkgJiYgdmVydGljZXNbMV0ueSA9PT0gdmVydGljZXNbMl0ueSAmJiB2ZXJ0aWNlc1syXS55ID09PSB2ZXJ0aWNlc1szXS55KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGx5IHBlcnNwZWN0aXZlIHRyYW5zZm9ybVxyXG4gICAqL1xyXG4gIHByaXZhdGUgdHJhbnNmb3JtKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHNvdXJjZSBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBzb3VyY2VDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pXHJcbiAgICAgICAgXS5tYXAocG9pbnQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIFtwb2ludC54IC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCBwb2ludC55IC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IG1heCB3aWR0aFxyXG4gICAgICAgIGNvbnN0IGJvdHRvbVdpZHRoID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS54IC0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pLng7XHJcbiAgICAgICAgY29uc3QgdG9wV2lkdGggPSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IE1hdGgubWF4KGJvdHRvbVdpZHRoLCB0b3BXaWR0aCkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgLy8gZ2V0IG1heCBoZWlnaHRcclxuICAgICAgICBjb25zdCBsZWZ0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueTtcclxuICAgICAgICBjb25zdCByaWdodEhlaWdodCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueTtcclxuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSBNYXRoLm1heChsZWZ0SGVpZ2h0LCByaWdodEhlaWdodCkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgLy8gY3JlYXRlIGRlc3QgY29vcmRpbmF0ZXMgbWF0cml4XHJcbiAgICAgICAgY29uc3QgZGVzdENvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCBtYXhIZWlnaHQgLSAxXSxcclxuICAgICAgICAgIFswLCBtYXhIZWlnaHQgLSAxXVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gb3BlbiBjdiBtYXRyaXggb2JqZWN0c1xyXG4gICAgICAgIGNvbnN0IE1zID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uc291cmNlQ29vcmRpbmF0ZXMpKTtcclxuICAgICAgICBjb25zdCBNZCA9IGN2Lm1hdEZyb21BcnJheSg0LCAxLCBjdi5DVl8zMkZDMiwgW10uY29uY2F0KC4uLmRlc3RDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybU1hdHJpeCA9IGN2LmdldFBlcnNwZWN0aXZlVHJhbnNmb3JtKE1zLCBNZCk7XHJcbiAgICAgICAgLy8gc2V0IG5ldyBpbWFnZSBzaXplXHJcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShtYXhXaWR0aCwgbWF4SGVpZ2h0KTtcclxuICAgICAgICAvLyBwZXJmb3JtIHdhcnBcclxuICAgICAgICBjdi53YXJwUGVyc3BlY3RpdmUoZHN0LCBkc3QsIHRyYW5zZm9ybU1hdHJpeCwgZHNpemUsIGN2LklOVEVSX0NVQklDLCBjdi5CT1JERVJfQ09OU1RBTlQsIG5ldyBjdi5TY2FsYXIoKSk7XHJcbiAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcblxyXG4gICAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgICBNcy5kZWxldGUoKTtcclxuICAgICAgICBNZC5kZWxldGUoKTtcclxuICAgICAgICB0cmFuc2Zvcm1NYXRyaXguZGVsZXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHRoaXMuc2hvd1ByZXZpZXcoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICogQHBhcmFtIHByZXZpZXcgLSB3aGVuIHRydWUsIHdpbGwgbm90IGFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIGVkaXRlZCBpbWFnZSBidXQgb25seSBkaXNwbGF5IGEgcHJldmlldy5cclxuICAgKiB3aGVuIGZhbHNlLCB3aWxsIGFwcGx5IHRvIGVkaXRlZEltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhcHBseUZpbHRlcihwcmV2aWV3OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgLy8gZGVmYXVsdCBvcHRpb25zXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmx1cjogZmFsc2UsXHJcbiAgICAgICAgdGg6IHRydWUsXHJcbiAgICAgICAgdGhNb2RlOiBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxyXG4gICAgICAgIHRoTWVhbkNvcnJlY3Rpb246IDEwLFxyXG4gICAgICAgIHRoQmxvY2tTaXplOiAyNSxcclxuICAgICAgICB0aE1heDogMjU1LFxyXG4gICAgICAgIGdyYXlTY2FsZTogdHJ1ZSxcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gJ29yaWdpbmFsJztcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGVkRmlsdGVyKSB7XHJcbiAgICAgICAgY2FzZSAnb3JpZ2luYWwnOlxyXG4gICAgICAgICAgb3B0aW9ucy50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbWFnaWNfY29sb3InOlxyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Mic6XHJcbiAgICAgICAgICBvcHRpb25zLnRoTW9kZSA9IGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBvcHRpb25zLnRoQmxvY2tTaXplID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdidzMnOlxyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gdHJ1ZTtcclxuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgY3YuY3Z0Q29sb3IoZHN0LCBkc3QsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmJsdXIpIHtcclxuICAgICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgICBjdi5HYXVzc2lhbkJsdXIoZHN0LCBkc3QsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnRoKSB7XHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5ncmF5U2NhbGUpIHtcclxuICAgICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoZHN0LCBkc3QsIG9wdGlvbnMudGhNYXgsIG9wdGlvbnMudGhNb2RlLCBjdi5USFJFU0hfQklOQVJZLCBvcHRpb25zLnRoQmxvY2tTaXplLCBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHN0LmNvbnZlcnRUbyhkc3QsIC0xLCAxLCA2MCk7XHJcbiAgICAgICAgICAgIGN2LnRocmVzaG9sZChkc3QsIGRzdCwgMTcwLCAyNTUsIGN2LlRIUkVTSF9CSU5BUlkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByZXZpZXcpIHtcclxuICAgICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KGRzdCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVzaXplKGltYWdlOiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTENhbnZhc0VsZW1lbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQoaW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IHNyYy5zaXplKCkud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IHNyYy5zaXplKCkuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZXNpemVEaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjdXJyZW50RGltZW5zaW9ucy53aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoIC8gY3VycmVudERpbWVuc2lvbnMud2lkdGggKiBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICBpZiAocmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQgLyBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQgKiBjdXJyZW50RGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLndpZHRoKSwgTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLmhlaWdodCkpO1xyXG4gICAgICAgICAgY3YucmVzaXplKHNyYywgc3JjLCBkc2l6ZSwgMCwgMCwgY3YuSU5URVJfQVJFQSk7XHJcbiAgICAgICAgICBjb25zdCByZXNpemVSZXN1bHQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICBjdi5pbXNob3cocmVzaXplUmVzdWx0LCBzcmMpO1xyXG4gICAgICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXNpemVSZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc2hvd1ByZXZpZXcoaW1hZ2U/OiBhbnkpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBzcmM7XHJcbiAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgIHNyYyA9IGltYWdlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoMCwgMCk7XHJcbiAgICAgIGN2LnJlc2l6ZShzcmMsIGRzdCwgZHNpemUsIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgY3YuaW1zaG93KHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LCBkc3QpO1xyXG4gICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgIGltYWdlLmRlbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB9XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gVXRpbGl0eSBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc2V0IHByZXZpZXcgY2FudmFzIGRpbWVuc2lvbnMgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXMgZWxlbWVudCBvZiB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucyhpbWc6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAvLyBzZXQgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgIHRoaXMucHJldmlld0RpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aDtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGltZy53aWR0aDtcclxuICAgIHRoaXMuaW1hZ2VEaXZTdHlsZSA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCArIHRoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ21hcmdpbi1sZWZ0JzogdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiArICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCksXHJcbiAgICAgICdtYXJnaW4tcmlnaHQnOiB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUoYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyIC0gJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgKSxcclxuICAgIH07XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyByYXRpbzogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgcmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcclxuXHJcbiAgICAvLyBjb25zdCBtYXhXaWR0aCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCA+IHRoaXMubWF4UHJldmlld1dpZHRoID9cclxuICAgIC8vICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggLSA0MDtcclxuICAgIC8vIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy5oZWlnaHQgPiB0aGlzLm1heFByZXZpZXdIZWlnaHQgPyB0aGlzLm1heFByZXZpZXdIZWlnaHQgOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMuaGVpZ2h0IC0gMjQwO1xyXG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLm1heFByZXZpZXdXaWR0aDtcclxuICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMubWF4UHJldmlld0hlaWdodDtcclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSB7XHJcbiAgICAgIHdpZHRoOiBtYXhXaWR0aCxcclxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKG1heFdpZHRoIC8gcmF0aW8pLFxyXG4gICAgICByYXRpbzogcmF0aW9cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGNhbGN1bGF0ZWQuaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XHJcbiAgICAgIGNhbGN1bGF0ZWQuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICBjYWxjdWxhdGVkLndpZHRoID0gTWF0aC5yb3VuZChtYXhIZWlnaHQgKiByYXRpbyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FsY3VsYXRlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIHJvbGVzIC0gYW4gYXJyYXkgb2Ygcm9sZXMgYnkgd2hpY2ggdGhlIHBvaW50IHdpbGwgYmUgZmV0Y2hlZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0UG9pbnQocm9sZXM6IFJvbGVzQXJyYXkpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50cy5maW5kKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RveWxlKCk6IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9IHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvclN0eWxlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGEgY2xhc3MgZm9yIGdlbmVyYXRpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzIGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5jbGFzcyBJbWFnZUVkaXRvckNvbmZpZyBpbXBsZW1lbnRzIERvY1NjYW5uZXJDb25maWcge1xyXG4gIC8qKlxyXG4gICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXHJcbiAgICovXHJcbiAgbWF4SW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMzAwMDAsXHJcbiAgICBoZWlnaHQ6IDMwMDAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZlZmVmZSc7XHJcbiAgLyoqXHJcbiAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JEaW1lbnNpb25zOiB7IHdpZHRoOiBzdHJpbmc7IGhlaWdodDogc3RyaW5nOyB9ID0ge1xyXG4gICAgd2lkdGg6ICcxMDB2dycsXHJcbiAgICBoZWlnaHQ6ICcxMDB2aCdcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZXh0cmFDc3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH0gPSB7XHJcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgIHRvcDogMCxcclxuICAgIGxlZnQ6IDBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAqL1xyXG4gIGJ1dHRvblRoZW1lQ29sb3I6ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnID0gJ2FjY2VudCc7XHJcbiAgLyoqXHJcbiAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGV4cG9ydEltYWdlSWNvbiA9ICdjbG91ZF91cGxvYWQnO1xyXG4gIC8qKlxyXG4gICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBjcm9wVG9vbENvbG9yID0gJyNGRjMzMzMnO1xyXG4gIC8qKlxyXG4gICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wsIGNhbiBiZSBlaXRoZXIgYSByZWN0YW5nbGUgb3IgYSBjaXJjbGVcclxuICAgKi9cclxuICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlID0gJ2NpcmNsZSc7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMTAsXHJcbiAgICBoZWlnaHQ6IDEwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHRoZSBlZGl0b3Igc3R5bGUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBjcm9wIHRvb2wgb3V0bGluZSB3aWR0aFxyXG4gICAqL1xyXG4gIGNyb3BUb29sTGluZVdlaWdodCA9IDM7XHJcbiAgLyoqXHJcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3V2lkdGggPSA4MDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld0hlaWdodCA9IDgwMDtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZykge1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHsnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZWRpdG9yQmFja2dyb3VuZENvbG9yfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5leHRyYUNzcyk7XHJcblxyXG4gICAgdGhpcy5wb2ludE9wdGlvbnMgPSB7XHJcbiAgICAgIHNoYXBlOiB0aGlzLmNyb3BUb29sU2hhcGUsXHJcbiAgICAgIGNvbG9yOiB0aGlzLmNyb3BUb29sQ29sb3IsXHJcbiAgICAgIHdpZHRoOiAwLFxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucG9pbnRPcHRpb25zLCB0aGlzLmNyb3BUb29sRGltZW5zaW9ucyk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=