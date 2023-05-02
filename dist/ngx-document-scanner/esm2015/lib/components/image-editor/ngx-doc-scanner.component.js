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
                /** @type {?} */
                const processingResizeRatio = 0.5;
                /** @type {?} */
                const src = cv.imread(this.editedImage);
                /** @type {?} */
                const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
                /** @type {?} */
                const dsize = new cv.Size(src.rows * processingResizeRatio, src.cols * processingResizeRatio);
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
                }
                /** @type {?} */
                let rect2 = cv.minAreaRect(cnt);
                for (let i = 0; i < rects.length; i++) {
                    // const v = cv.RotatedRect.points(rects[i]);
                    // let isNegative = false;
                    // for (let j = 0; j < v.length; j++) {
                    //   if (v[j].x < 0 || v[j].y < 0) {
                    //     isNegative = true;
                    //     break;
                    //   }
                    // }
                    // if (isNegative) {
                    //   continue;
                    // }
                    if (((rects[i].size.width * rects[i].size.height) > (rect2.size.width * rect2.size.height)
                        && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
                            || rects[i].angle === -90 || rects[i].angle === -180) && ((rects[i].angle > 85 || rects[i].angle < 5)))) {
                        rect2 = rects[i];
                    }
                }
                // console.log(rects);
                //
                // console.log('---------------------------------------------------------');
                // console.log(cnt);
                // console.log(rect2);
                /** @type {?} */
                const vertices = cv.RotatedRect.points(rect2);
                // console.log(vertices);
                for (let i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * this.imageResizeRatio;
                }
                // console.log(vertices);
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
                // console.log(ts);
                // console.log(bs);
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
                // console.log(roles);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBUzVDLE1BQU0sT0FBTyxzQkFBc0I7Ozs7OztJQXVKakMsWUFBb0IsU0FBMkIsRUFBVSxhQUE0QixFQUFVLFdBQTJCO1FBQXRHLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUF0SjFILFVBQUssR0FBRyxDQUFDLENBQUM7Ozs7UUErQ1YsZ0JBQVcsR0FBRyxLQUFLLENBQUM7Ozs7UUFJcEIsU0FBSSxHQUFxQixNQUFNLENBQUM7Ozs7UUFJeEIsbUJBQWMsR0FBRyxTQUFTLENBQUM7Ozs7UUFZM0Isb0JBQWUsR0FBb0I7WUFDekMsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7Ozs7Ozs7UUFnQ1EsZUFBVSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDOzs7O1FBSTlELGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQzs7OztRQUkx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LENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDaEQsQ0FBQyxFQUFDLENBQUM7O29CQUVDLGtCQUFrQjs7c0JBRWhCLFVBQVUsR0FBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7c0JBQzlHLFdBQVcsR0FBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7c0JBQy9HLFVBQVUsR0FBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7c0JBQzlHLFdBQVcsR0FBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7c0JB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QyxFQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDekIsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNGOzs7Ozs7SUF4RkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBMkQ7Ozs7O0lBSTNELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBcUM7Ozs7O0lBSXJDLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQWlEOzs7OztJQUlqRCwrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQjs7Ozs7SUFLdEIsNkNBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhLCBSb2xlc0FycmF5fSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7Tmd4RmlsdGVyTWVudUNvbXBvbmVudH0gZnJvbSAnLi4vZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RWRpdG9yQWN0aW9uQnV0dG9uLCBQb2ludE9wdGlvbnMsIFBvaW50U2hhcGV9IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG4vLyBpbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25neC1vcGVuY3Yuc2VydmljZSc7XHJcbmltcG9ydCB7RG9jU2Nhbm5lckNvbmZpZywgSW1hZ2VEaW1lbnNpb25zLCBPcGVuQ1ZTdGF0ZX0gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlfSBmcm9tICduZ3gtb3BlbmN2JztcclxuXHJcbmRlY2xhcmUgdmFyIGN2OiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1kb2Mtc2Nhbm5lcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERvY1NjYW5uZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgdmFsdWUgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAqL1xyXG4gIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgQ09ORklHIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWRpdG9yQnV0dG9uczogQXJyYXk8RWRpdG9yQWN0aW9uQnV0dG9uPjtcclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBnZXQgZGlzcGxheWVkQnV0dG9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvckJ1dHRvbnMuZmlsdGVyKGJ1dHRvbiA9PiB7XHJcbiAgICAgIHJldHVybiBidXR0b24ubW9kZSA9PT0gdGhpcy5tb2RlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1heFByZXZpZXdIZWlnaHQ6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgbWF4UHJldmlld1dpZHRoOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXHJcbiAgICovXHJcbiAgaW1hZ2VEaXZTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgZGl2IHN0eWxlXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcblxyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgU1RBVEUgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc3RhdGUgb2Ygb3BlbmN2IGxvYWRpbmdcclxuICAgKi9cclxuICBwcml2YXRlIGN2U3RhdGU6IHN0cmluZztcclxuICAvKipcclxuICAgKiB0cnVlIGFmdGVyIHRoZSBpbWFnZSBpcyBsb2FkZWQgYW5kIHByZXZpZXcgaXMgZGlzcGxheWVkXHJcbiAgICovXHJcbiAgaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIG1vZGU6ICdjcm9wJyB8ICdjb2xvcicgPSAnY3JvcCc7XHJcbiAgLyoqXHJcbiAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRGaWx0ZXIgPSAnZGVmYXVsdCc7XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBPUEVSQVRJT04gVkFSSUFCTEVTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHZpZXdwb3J0IGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAwLFxyXG4gICAgaGVpZ2h0OiAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgKi9cclxuICBwcml2YXRlIG9yaWdpbmFsSW1hZ2U6IEZpbGU7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRlZEltYWdlOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICovXHJcbiAgQFZpZXdDaGlsZCgnUHJldmlld0NhbnZhcycsIHtyZWFkOiBFbGVtZW50UmVmfSkgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzOiBFbGVtZW50UmVmO1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBwcml2YXRlIHBvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRVZFTlQgRU1JVFRFUlMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICAvKipcclxuICAgKiBmaXJlcyBvbiBlZGl0IGNvbXBsZXRpb25cclxuICAgKi9cclxuICBAT3V0cHV0KCkgZWRpdFJlc3VsdDogRXZlbnRFbWl0dGVyPEJsb2I+ID0gbmV3IEV2ZW50RW1pdHRlcjxCbG9iPigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0aGUgbG9hZGluZyBzdGF0dXMgb2YgdGhlIGN2IG1vZHVsZS5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8vIElOUFVUUyAvL1xyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAqIEBwYXJhbSBmaWxlIC0gZmlsZSBmcm9tIGZvcm0gaW5wdXRcclxuICAgKi9cclxuICBASW5wdXQoKSBzZXQgZmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICBpZiAoZmlsZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gZmlsZTtcclxuICAgICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYXN5bmMgKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgICAgICAvLyByZWFkIGZpbGUgdG8gaW1hZ2UgJiBjYW52YXNcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRmlsZShmaWxlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICovXHJcbiAgQElucHV0KCkgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neE9wZW5DdjogTmd4T3BlbkNWU2VydmljZSwgcHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlLCBwcml2YXRlIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCkge1xyXG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xyXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBzdGF0dXMgb2YgY3YgbW9kdWxlXHJcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgdGhpcy5jdlN0YXRlID0gY3ZTdGF0ZS5zdGF0ZTtcclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KGN2U3RhdGUucmVhZHkpO1xyXG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoJ2Vycm9yIGxvYWRpbmcgY3YnKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvaW50cyA9PiB7XHJcbiAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdleGl0JyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JvdGF0ZScsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnJvdGF0ZUltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ3JvdGF0ZV9yaWdodCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZG9uZV9jcm9wJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZG9uZUNyb3AoKSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnVuZG8oKSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLm1heFByZXZpZXdIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld0hlaWdodDtcclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB0aGlzLm9wdGlvbnMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jb25maWcpIHtcclxuICAgICAgaWYgKCFjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUudGhyZXNob2xkSW5mby50aHJlc2ggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUudGhyZXNob2xkSW5mby50aHJlc2gpIHtcclxuICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHVwZGF0ZVByZXZpZXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5tYXhQcmV2aWV3V2lkdGggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUubWF4UHJldmlld1dpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld0hlaWdodCAhPT0gY2hhbmdlcy5jb25maWcucHJldmlvdXNWYWx1ZS5tYXhQcmV2aWV3SGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3SGVpZ2h0ID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLm1heFByZXZpZXdIZWlnaHQ7XHJcbiAgICAgICAgdXBkYXRlUHJldmlldyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLmVkaXRvckRpbWVuc2lvbnMpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB7Li4udGhpcy5lZGl0b3JTdHlsZX07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvYmosIGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmVkaXRvclN0eWxlID0gb2JqO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cGRhdGVQcmV2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5kb3VibGVSb3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvbmVDcm9wKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2Nyb3AnO1xyXG4gICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGFzeW5jIGV4cG9ydEltYWdlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKVxyXG4gICAgICAudGhlbihyZXNpemVSZXN1bHQgPT4ge1xyXG4gICAgICAgIHJlc2l6ZVJlc3VsdC50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH0sIHRoaXMub3JpZ2luYWxJbWFnZS50eXBlKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVkaXRlZEltYWdlLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfSwgdGhpcy5vcmlnaW5hbEltYWdlLnR5cGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcclxuICAgKi9cclxuICBwcml2YXRlIGNob29zZUZpbHRlcnMoKSB7XHJcbiAgICBjb25zdCBkYXRhID0ge2ZpbHRlcjogdGhpcy5zZWxlY3RlZEZpbHRlcn07XHJcbiAgICBjb25zdCBib3R0b21TaGVldFJlZiA9IHRoaXMuYm90dG9tU2hlZXQub3BlbihOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LCB7XHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pO1xyXG4gICAgYm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gZGF0YS5maWx0ZXI7XHJcbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBGaWxlIElucHV0ICYgT3V0cHV0IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBsb2FkIGltYWdlIGZyb20gaW5wdXQgZmllbGRcclxuICAgKi9cclxuICBwcml2YXRlIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZEltYWdlKGZpbGUpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IHBhbmUgbGltaXRzXHJcbiAgICAgIC8vIHNob3cgcG9pbnRzXHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSB0cnVlO1xyXG4gICAgICBhd2FpdCB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0Q29udG91cnMoKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAxNSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlYWQgaW1hZ2UgZnJvbSBGaWxlIG9iamVjdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZEltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBpbWFnZVNyYztcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpbWFnZVNyYyA9IGF3YWl0IHJlYWRGaWxlKCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBpbWcub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIHNldCBlZGl0ZWQgaW1hZ2UgY2FudmFzIGFuZCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLndpZHRoID0gaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLmVkaXRlZEltYWdlLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgICAgIC8vIHJlc2l6ZSBpbWFnZSBpZiBsYXJnZXIgdGhhbiBtYXggaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gaW1nLndpZHRoID4gaW1nLmhlaWdodCA/IGltZy5oZWlnaHQgOiBpbWcud2lkdGg7XHJcbiAgICAgICAgaWYgKHdpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IGF3YWl0IHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy53aWR0aCA9IHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBpbWcuc3JjID0gaW1hZ2VTcmM7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgZmlsZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlYWRGaWxlKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKGVycikgPT4ge1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBJbWFnZSBQcm9jZXNzaW5nIE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiByb3RhdGUgaW1hZ2UgOTAgZGVncmVlc1xyXG4gICAqL1xyXG4gIHJvdGF0ZUltYWdlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZShjbG9ja3dpc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZG91YmxlUm90YXRlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucm90YXRlKHRydWUpO1xyXG4gICAgICAgIHRoaXMucm90YXRlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgIC8vIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgIGN2LnRyYW5zcG9zZShkc3QsIGRzdCk7XHJcbiAgICBpZiAoY2xvY2t3aXNlKSB7XHJcbiAgICAgIGN2LmZsaXAoZHN0LCBkc3QsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3YuZmxpcChkc3QsIGRzdCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAvLyBzcmMuZGVsZXRlKCk7XHJcbiAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAvLyBzYXZlIGN1cnJlbnQgcHJldmlldyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbnNcclxuICAgIGNvbnN0IGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyA9IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcclxuICAgIE9iamVjdC5hc3NpZ24oaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCB0aGlzLnByZXZpZXdEaW1lbnNpb25zKTtcclxuICAgIGNvbnN0IGluaXRpYWxQb3NpdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzKTtcclxuICAgIC8vIGdldCBuZXcgZGltZW5zaW9uc1xyXG4gICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAvLyBnZXQgcHJldmlldyBwYW5lIHJlc2l6ZSByYXRpb1xyXG4gICAgY29uc3QgcHJldmlld1Jlc2l6ZVJhdGlvcyA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICB9O1xyXG4gICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG5cclxuICAgIGlmIChjbG9ja3dpc2UpIHtcclxuICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUNsb2Nrd2lzZShwcmV2aWV3UmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUFudGlDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRldGVjdHMgdGhlIGNvbnRvdXJzIG9mIHRoZSBkb2N1bWVudCBhbmRcclxuICAgKiovXHJcbiAgcHJpdmF0ZSBkZXRlY3RDb250b3VycygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBsb2FkIHRoZSBpbWFnZSBhbmQgY29tcHV0ZSB0aGUgcmF0aW8gb2YgdGhlIG9sZCBoZWlnaHQgdG8gdGhlIG5ldyBoZWlnaHQsIGNsb25lIGl0LCBhbmQgcmVzaXplIGl0XHJcbiAgICAgICAgY29uc3QgcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvID0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5NYXQuemVyb3Moc3JjLnJvd3MsIHNyYy5jb2xzLCBjdi5DVl84VUMzKTtcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKHNyYy5yb3dzICogcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvLCBzcmMuY29scyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbyk7XHJcbiAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAvLyBjb252ZXJ0IHRoZSBpbWFnZSB0byBncmF5c2NhbGUsIGJsdXIgaXQsIGFuZCBmaW5kIGVkZ2VzIGluIHRoZSBpbWFnZVxyXG4gICAgICAgIGN2LmN2dENvbG9yKHNyYywgc3JjLCBjdi5DT0xPUl9SR0JBMkdSQVksIDApO1xyXG4gICAgICAgIGN2LkdhdXNzaWFuQmx1cihzcmMsIHNyYywga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICAvLyBjdi5DYW5ueShzcmMsIHNyYywgNzUsIDIwMCk7XHJcbiAgICAgICAgLy8gZmluZCBjb250b3Vyc1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnc3RhbmRhcmQnKSB7XHJcbiAgICAgICAgICBjdi50aHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNoLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5USFJFU0hfQklOQVJZKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ2FkYXB0aXZlX21lYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX01FQU5fQyxcclxuICAgICAgICAgICAgY3YuVEhSRVNIX0JJTkFSWSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5ibG9ja1NpemUsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9nYXVzc2lhbicpIHtcclxuICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5BREFQVElWRV9USFJFU0hfR0FVU1NJQU5fQyxcclxuICAgICAgICAgICAgY3YuVEhSRVNIX0JJTkFSWSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5ibG9ja1NpemUsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb250b3VycyA9IG5ldyBjdi5NYXRWZWN0b3IoKTtcclxuICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgICAgY3YuZmluZENvbnRvdXJzKHNyYywgY29udG91cnMsIGhpZXJhcmNoeSwgY3YuUkVUUl9DQ09NUCwgY3YuQ0hBSU5fQVBQUk9YX1NJTVBMRSk7XHJcbiAgICAgICAgY29uc3QgY250ID0gY29udG91cnMuZ2V0KDQpO1xyXG4gICAgICAgIGlmICghY250KSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tVU5JUVVFIFJFQ1RBTkdMRVMgRlJPTSBBTEwgQ09OVE9VUlMtLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgY29uc3QgcmVjdHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRvdXJzLnNpemUoKTsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBjbiA9IGNvbnRvdXJzLmdldChpKTtcclxuICAgICAgICAgIGNvbnN0IHIgPSBjdi5taW5BcmVhUmVjdChjbik7XHJcbiAgICAgICAgICBsZXQgYWRkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChyLnNpemUuaGVpZ2h0IDwgNTAgfHwgci5zaXplLndpZHRoIDwgNTBcclxuICAgICAgICAgICAgfHwgci5hbmdsZSA9PT0gOTAgfHwgci5hbmdsZSA9PT0gMTgwIHx8IHIuYW5nbGUgPT09IDBcclxuICAgICAgICAgICAgfHwgci5hbmdsZSA9PT0gLTkwIHx8IHIuYW5nbGUgPT09IC0xODBcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlY3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICByZWN0c1tqXS5hbmdsZSA9PT0gci5hbmdsZVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLmNlbnRlci54ID09PSByLmNlbnRlci54ICYmIHJlY3RzW2pdLmNlbnRlci55ID09PSByLmNlbnRlci55XHJcbiAgICAgICAgICAgICAgJiYgcmVjdHNbal0uc2l6ZS53aWR0aCA9PT0gci5zaXplLndpZHRoICYmIHJlY3RzW2pdLnNpemUuaGVpZ2h0ID09PSByLnNpemUuaGVpZ2h0XHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIGFkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICByZWN0cy5wdXNoKHIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlY3QyID0gY3YubWluQXJlYVJlY3QoY250KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAvLyBjb25zdCB2ID0gY3YuUm90YXRlZFJlY3QucG9pbnRzKHJlY3RzW2ldKTtcclxuICAgICAgICAgIC8vIGxldCBpc05lZ2F0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAvLyBmb3IgKGxldCBqID0gMDsgaiA8IHYubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIC8vICAgaWYgKHZbal0ueCA8IDAgfHwgdltqXS55IDwgMCkge1xyXG4gICAgICAgICAgLy8gICAgIGlzTmVnYXRpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAvLyBpZiAoaXNOZWdhdGl2ZSkge1xyXG4gICAgICAgICAgLy8gICBjb250aW51ZTtcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIGlmICgoKHJlY3RzW2ldLnNpemUud2lkdGggKiByZWN0c1tpXS5zaXplLmhlaWdodCkgPiAocmVjdDIuc2l6ZS53aWR0aCAqIHJlY3QyLnNpemUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAmJiAhKHJlY3RzW2ldLmFuZ2xlID09PSA5MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMTgwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgICAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC05MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gLTE4MCkgJiYgKChyZWN0c1tpXS5hbmdsZSA+IDg1IHx8IHJlY3RzW2ldLmFuZ2xlIDwgNSkpKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJlY3QyID0gcmVjdHNbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlY3RzKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlY3QyKTtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0Mik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codmVydGljZXMpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS54ID0gdmVydGljZXNbaV0ueCAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAgIHZlcnRpY2VzW2ldLnkgPSB2ZXJ0aWNlc1tpXS55ICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codmVydGljZXMpO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gY3YuYm91bmRpbmdSZWN0KHNyYyk7XHJcblxyXG4gICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICBoaWVyYXJjaHkuZGVsZXRlKCk7XHJcbiAgICAgICAgY29udG91cnMuZGVsZXRlKCk7XHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRoZSByZWN0YW5nbGUgaW50byBhIHNldCBvZiBwb2ludHNcclxuICAgICAgICBPYmplY3Qua2V5cyhyZWN0KS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICByZWN0W2tleV0gPSByZWN0W2tleV0gKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb250b3VyQ29vcmRpbmF0ZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0Um9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1swXSwgW3ZlcnRpY2VzWzFdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMV0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCB0aGlyZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMl0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCBmb3VydGhSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzNdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1sxXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcblxyXG4gICAgICAgIGNvbnN0IHJvbGVzID0gW2ZpcnN0Um9sZXMsIHNlY29uZFJvbGVzLCB0aGlyZFJvbGVzLCBmb3VydGhSb2xlc107XHJcbiAgICAgICAgY29uc3QgdHMgPSBbXTtcclxuICAgICAgICBjb25zdCBicyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocm9sZXNbaV1bMF0gPT09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIHRzLnB1c2goaSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicy5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codHMpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJzKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzTGVmdCh2ZXJ0aWNlc1t0c1swXV0sIHZlcnRpY2VzW3RzWzFdXSkpIHtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByb2xlc1t0c1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pc0xlZnQodmVydGljZXNbYnNbMF1dLCB2ZXJ0aWNlc1tic1sxXV0pKSB7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMV1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMF1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyb2xlcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy51c2VSb3RhdGVkUmVjdGFuZ2xlXHJcbiAgICAgICAgICAmJiB0aGlzLnBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzBdLngsIHk6IHZlcnRpY2VzWzBdLnl9LCBmaXJzdFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMV0ueCwgeTogdmVydGljZXNbMV0ueX0sIHNlY29uZFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMl0ueCwgeTogdmVydGljZXNbMl0ueX0sIHRoaXJkUm9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1szXS54LCB5OiB2ZXJ0aWNlc1szXS55fSwgZm91cnRoUm9sZXMpLFxyXG4gICAgICAgICAgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29udG91ckNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueX0sIFsnbGVmdCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueX0sIFsncmlnaHQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsncmlnaHQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25Qb2ludHMoY29udG91ckNvb3JkaW5hdGVzKTtcclxuICAgICAgICAvLyB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzVG9wKGNvb3JkaW5hdGUsIG90aGVyVmVydGljZXMpOiBib29sZWFuIHtcclxuXHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdGhlclZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChjb29yZGluYXRlLnkgPCBvdGhlclZlcnRpY2VzW2ldLnkpIHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50ID49IDI7XHJcblxyXG4gIH1cclxuXHJcbiAgaXNMZWZ0KGNvb3JkaW5hdGUsIHNlY29uZENvb3JkaW5hdGUpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBjb29yZGluYXRlLnggPCBzZWNvbmRDb29yZGluYXRlLng7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEodmVydGljZXNbMF0ueCA9PT0gdmVydGljZXNbMV0ueCAmJiB2ZXJ0aWNlc1sxXS54ID09PSB2ZXJ0aWNlc1syXS54ICYmIHZlcnRpY2VzWzJdLnggPT09IHZlcnRpY2VzWzNdLnggJiZcclxuICAgICAgdmVydGljZXNbMF0ueSA9PT0gdmVydGljZXNbMV0ueSAmJiB2ZXJ0aWNlc1sxXS55ID09PSB2ZXJ0aWNlc1syXS55ICYmIHZlcnRpY2VzWzJdLnkgPT09IHZlcnRpY2VzWzNdLnkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgc291cmNlIGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcclxuICAgICAgICBdLm1hcChwb2ludCA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gW3BvaW50LnggLyB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHBvaW50LnkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW9dO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBnZXQgbWF4IHdpZHRoXHJcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCB0b3BXaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoYm90dG9tV2lkdGgsIHRvcFdpZHRoKSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxyXG4gICAgICAgIGNvbnN0IGxlZnRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS55O1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS55O1xyXG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBjcmVhdGUgZGVzdCBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBkZXN0Q29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIG1heEhlaWdodCAtIDFdLFxyXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXHJcbiAgICAgICAgY29uc3QgTXMgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5zb3VyY2VDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IE1kID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uZGVzdENvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcclxuICAgICAgICAvLyBzZXQgbmV3IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKG1heFdpZHRoLCBtYXhIZWlnaHQpO1xyXG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxyXG4gICAgICAgIGN2LndhcnBQZXJzcGVjdGl2ZShkc3QsIGRzdCwgdHJhbnNmb3JtTWF0cml4LCBkc2l6ZSwgY3YuSU5URVJfQ1VCSUMsIGN2LkJPUkRFUl9DT05TVEFOVCwgbmV3IGN2LlNjYWxhcigpKTtcclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuXHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIE1zLmRlbGV0ZSgpO1xyXG4gICAgICAgIE1kLmRlbGV0ZSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdHJpeC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciB0byB0aGUgaW1hZ2VcclxuICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAqIHdoZW4gZmFsc2UsIHdpbGwgYXBwbHkgdG8gZWRpdGVkSW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGFwcGx5RmlsdGVyKHByZXZpZXc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBibHVyOiBmYWxzZSxcclxuICAgICAgICB0aDogdHJ1ZSxcclxuICAgICAgICB0aE1vZGU6IGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgdGhNZWFuQ29ycmVjdGlvbjogMTAsXHJcbiAgICAgICAgdGhCbG9ja1NpemU6IDI1LFxyXG4gICAgICAgIHRoTWF4OiAyNTUsXHJcbiAgICAgICAgZ3JheVNjYWxlOiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSAnb3JpZ2luYWwnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0ZWRGaWx0ZXIpIHtcclxuICAgICAgICBjYXNlICdvcmlnaW5hbCc6XHJcbiAgICAgICAgICBvcHRpb25zLnRoID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdtYWdpY19jb2xvcic6XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYncyJzpcclxuICAgICAgICAgIG9wdGlvbnMudGhNb2RlID0gY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0M7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIG9wdGlvbnMudGhCbG9ja1NpemUgPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Myc6XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSB0cnVlO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICBjdi5jdnRDb2xvcihkc3QsIGRzdCwgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuYmx1cikge1xyXG4gICAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAgIGN2LkdhdXNzaWFuQmx1cihkc3QsIGRzdCwga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGgpIHtcclxuICAgICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChkc3QsIGRzdCwgb3B0aW9ucy50aE1heCwgb3B0aW9ucy50aE1vZGUsIGN2LlRIUkVTSF9CSU5BUlksIG9wdGlvbnMudGhCbG9ja1NpemUsIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkc3QuY29udmVydFRvKGRzdCwgLTEsIDEsIDYwKTtcclxuICAgICAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxNzAsIDI1NSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJldmlldykge1xyXG4gICAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoZHN0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlc2l6ZSBhbiBpbWFnZSB0byBmaXQgY29uc3RyYWludHMgc2V0IGluIG9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXNpemUoaW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50KTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZChpbWFnZSk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogc3JjLnNpemUoKS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3JjLnNpemUoKS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGN1cnJlbnREaW1lbnNpb25zLndpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGggLyBjdXJyZW50RGltZW5zaW9ucy53aWR0aCAqIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgIGlmIChyZXNpemVEaW1lbnNpb25zLmhlaWdodCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCAvIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCAqIGN1cnJlbnREaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMud2lkdGgpLCBNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0KSk7XHJcbiAgICAgICAgICBjdi5yZXNpemUoc3JjLCBzcmMsIGRzaXplLCAwLCAwLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZVJlc3VsdCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgIGN2Lmltc2hvdyhyZXNpemVSZXN1bHQsIHNyYyk7XHJcbiAgICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc2l6ZVJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgaW1hZ2Ugb24gdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93UHJldmlldyhpbWFnZT86IGFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHNyYztcclxuICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgc3JjID0gaW1hZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZSgwLCAwKTtcclxuICAgICAgY3YucmVzaXplKHNyYywgZHN0LCBkc2l6ZSwgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICBjdi5pbXNob3codGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQsIGRzdCk7XHJcbiAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIFV0aWxpdHkgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBwcmV2aWV3IGNhbnZhcyBkaW1lbnNpb25zIGFjY29yZGluZyB0byB0aGUgY2FudmFzIGVsZW1lbnQgb2YgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRQcmV2aWV3UGFuZURpbWVuc2lvbnMoaW1nOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgLy8gc2V0IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICB0aGlzLnByZXZpZXdEaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGg7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMuaW1hZ2VSZXNpemVSYXRpbyA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmltYWdlRGl2U3R5bGUgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCArICdweCcsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLmhlaWdodCArICdweCcsXHJcbiAgICAgICdtYXJnaW4tbGVmdCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiArICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgICAgJ21hcmdpbi1yaWdodCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiAtICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgIH07XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyByYXRpbzogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgcmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcclxuXHJcbiAgICAvLyBjb25zdCBtYXhXaWR0aCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCA+IHRoaXMubWF4UHJldmlld1dpZHRoID9cclxuICAgIC8vICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggLSA0MDtcclxuICAgIC8vIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy5oZWlnaHQgPiB0aGlzLm1heFByZXZpZXdIZWlnaHQgPyB0aGlzLm1heFByZXZpZXdIZWlnaHQgOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMuaGVpZ2h0IC0gMjQwO1xyXG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLm1heFByZXZpZXdXaWR0aDtcclxuICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMubWF4UHJldmlld0hlaWdodDtcclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSB7XHJcbiAgICAgIHdpZHRoOiBtYXhXaWR0aCxcclxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKG1heFdpZHRoIC8gcmF0aW8pLFxyXG4gICAgICByYXRpbzogcmF0aW9cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGNhbGN1bGF0ZWQuaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XHJcbiAgICAgIGNhbGN1bGF0ZWQuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICBjYWxjdWxhdGVkLndpZHRoID0gTWF0aC5yb3VuZChtYXhIZWlnaHQgKiByYXRpbyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FsY3VsYXRlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIHJvbGVzIC0gYW4gYXJyYXkgb2Ygcm9sZXMgYnkgd2hpY2ggdGhlIHBvaW50IHdpbGwgYmUgZmV0Y2hlZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0UG9pbnQocm9sZXM6IFJvbGVzQXJyYXkpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50cy5maW5kKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RveWxlKCk6IHsgW3A6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9IHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvclN0eWxlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGEgY2xhc3MgZm9yIGdlbmVyYXRpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzIGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5jbGFzcyBJbWFnZUVkaXRvckNvbmZpZyBpbXBsZW1lbnRzIERvY1NjYW5uZXJDb25maWcge1xyXG4gIC8qKlxyXG4gICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXHJcbiAgICovXHJcbiAgbWF4SW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMzAwMDAsXHJcbiAgICBoZWlnaHQ6IDMwMDAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZlZmVmZSc7XHJcbiAgLyoqXHJcbiAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JEaW1lbnNpb25zOiB7IHdpZHRoOiBzdHJpbmc7IGhlaWdodDogc3RyaW5nOyB9ID0ge1xyXG4gICAgd2lkdGg6ICcxMDB2dycsXHJcbiAgICBoZWlnaHQ6ICcxMDB2aCdcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZXh0cmFDc3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH0gPSB7XHJcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgIHRvcDogMCxcclxuICAgIGxlZnQ6IDBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAqL1xyXG4gIGJ1dHRvblRoZW1lQ29sb3I6ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnID0gJ2FjY2VudCc7XHJcbiAgLyoqXHJcbiAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGV4cG9ydEltYWdlSWNvbiA9ICdjbG91ZF91cGxvYWQnO1xyXG4gIC8qKlxyXG4gICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBjcm9wVG9vbENvbG9yID0gJyNGRjMzMzMnO1xyXG4gIC8qKlxyXG4gICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wsIGNhbiBiZSBlaXRoZXIgYSByZWN0YW5nbGUgb3IgYSBjaXJjbGVcclxuICAgKi9cclxuICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlID0gJ2NpcmNsZSc7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMTAsXHJcbiAgICBoZWlnaHQ6IDEwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHRoZSBlZGl0b3Igc3R5bGUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBjcm9wIHRvb2wgb3V0bGluZSB3aWR0aFxyXG4gICAqL1xyXG4gIGNyb3BUb29sTGluZVdlaWdodCA9IDM7XHJcbiAgLyoqXHJcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3V2lkdGggPSA4MDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld0hlaWdodCA9IDgwMDtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZykge1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHsnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZWRpdG9yQmFja2dyb3VuZENvbG9yfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5leHRyYUNzcyk7XHJcblxyXG4gICAgdGhpcy5wb2ludE9wdGlvbnMgPSB7XHJcbiAgICAgIHNoYXBlOiB0aGlzLmNyb3BUb29sU2hhcGUsXHJcbiAgICAgIGNvbG9yOiB0aGlzLmNyb3BUb29sQ29sb3IsXHJcbiAgICAgIHdpZHRoOiAwLFxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucG9pbnRPcHRpb25zLCB0aGlzLmNyb3BUb29sRGltZW5zaW9ucyk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=