import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
import { NgxFilterMenuComponent } from '../filter-menu/ngx-filter-menu.component';
import { NgxOpenCVService } from 'ngx-opencv';
import * as i0 from "@angular/core";
import * as i1 from "ngx-opencv";
import * as i2 from "../../services/limits.service";
import * as i3 from "@angular/material/bottom-sheet";
import * as i4 from "@angular/platform-browser";
import * as i5 from "@angular/flex-layout/flex";
import * as i6 from "@angular/flex-layout/extended";
import * as i7 from "@angular/common";
import * as i8 from "../draggable-point/ngx-draggable-point.component";
import * as i9 from "../shape-outline/ngx-shape-outline.component";
export class NgxDocScannerComponent {
    /**
     * returns an array of buttons according to the editor mode
     */
    get displayedButtons() {
        return this.editorButtons.filter(button => {
            return button.mode === this.mode;
        });
    }
    // ****** //
    // INPUTS //
    // ****** //
    /**
     * set image for editing
     * @param file - file from form input
     */
    set file(file) {
        if (file) {
            setTimeout(() => {
                this.processing.emit(true);
            }, 5);
            this.imageLoaded = false;
            this.originalImage = file;
            this.ngxOpenCv.cvState.subscribe(async (cvState) => {
                if (cvState.ready) {
                    // read file to image & canvas
                    await this.loadFile(file);
                    this.processing.emit(false);
                }
            });
        }
    }
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
        this.ngxOpenCv.cvState.subscribe((cvState) => {
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
        });
        // subscribe to positions of crop tool
        this.limitsService.positions.subscribe(points => {
            this.points = points;
        });
    }
    ngOnInit() {
        this.editorButtons = [
            {
                name: 'exit',
                action: () => {
                    this.exitEditor.emit('canceled');
                },
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
                action: () => {
                    if (this.config.filterEnable) {
                        return this.chooseFilters();
                    }
                },
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
        this.editorButtons.forEach(button => {
            if (button.name === 'upload') {
                button.icon = this.options.exportImageIcon;
            }
        });
        this.maxPreviewWidth = this.options.maxPreviewWidth;
        this.maxPreviewHeight = this.options.maxPreviewHeight;
        this.editorStyle = this.options.editorStyle;
    }
    ngOnChanges(changes) {
        if (changes.config) {
            if (!changes.config.previousValue) {
                return;
            }
            if (changes.config.currentValue.thresholdInfo.thresh !== changes.config.previousValue.thresholdInfo.thresh) {
                this.loadFile(this.originalImage);
            }
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
                const obj = { ...this.editorStyle };
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
     */
    exit() {
        this.exitEditor.emit('canceled');
    }
    getMode() {
        return this.mode;
    }
    async doneCrop() {
        this.mode = 'color';
        await this.transform();
        if (this.config.filterEnable) {
            await this.applyFilter(true);
        }
    }
    undo() {
        this.mode = 'crop';
        this.loadFile(this.originalImage);
    }
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    async exportImage() {
        await this.applyFilter(false);
        if (this.options.maxImageDimensions) {
            this.resize(this.editedImage)
                .then(resizeResult => {
                resizeResult.toBlob((blob) => {
                    this.editResult.emit(blob);
                    this.processing.emit(false);
                }, 'image/jpeg', 0.8);
            });
        }
        else {
            this.editedImage.toBlob((blob) => {
                this.editResult.emit(blob);
                this.processing.emit(false);
            }, 'image/jpeg', 0.8);
        }
    }
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     */
    chooseFilters() {
        const data = { filter: this.selectedFilter };
        const bottomSheetRef = this.bottomSheet.open(NgxFilterMenuComponent, {
            data: data
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
            this.selectedFilter = data.filter;
            this.applyFilter(true);
        });
    }
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     */
    loadFile(file) {
        return new Promise(async (resolve, reject) => {
            this.processing.emit(true);
            try {
                await this.readImage(file);
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            try {
                await this.showPreview();
            }
            catch (err) {
                console.error(err);
                this.error.emit(new Error(err));
            }
            // set pane limits
            // show points
            this.imageLoaded = true;
            await this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
            setTimeout(async () => {
                await this.detectContours();
                this.processing.emit(false);
                resolve(false);
            }, 15);
        });
    }
    /**
     * read image from File object
     */
    readImage(file) {
        return new Promise(async (resolve, reject) => {
            let imageSrc;
            try {
                imageSrc = await readFile();
            }
            catch (err) {
                reject(err);
            }
            const img = new Image();
            if (this.editedImage) {
                console.log('clearing old edited image...');
                this.editedImage.remove();
            }
            img.onload = async () => {
                // set edited image canvas and dimensions
                this.editedImage = document.createElement('canvas');
                this.editedImage.width = img.width;
                this.editedImage.height = img.height;
                const ctx = this.editedImage.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // resize image if larger than max image size
                const width = img.width > img.height ? img.height : img.width;
                if (width > this.options.maxImageDimensions.width) {
                    this.editedImage = await this.resize(this.editedImage);
                }
                this.imageDimensions.width = this.editedImage.width;
                this.imageDimensions.height = this.editedImage.height;
                this.setPreviewPaneDimensions(this.editedImage);
                resolve(true);
            };
            img.src = imageSrc;
        });
        /**
         * read file from input field
         */
        function readFile() {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve(reader.result);
                };
                reader.onerror = (err) => {
                    reject(err);
                };
                reader.readAsDataURL(file);
            });
        }
    }
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     */
    rotateImage(clockwise = true) {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                this.rotate(clockwise);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve(true);
                });
            }, 30);
        });
    }
    doubleRotate() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                this.rotate(true);
                this.rotate(false);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve(true);
                });
            }, 30);
        });
    }
    rotate(clockwise = true) {
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
        const initialPreviewDimensions = { width: 0, height: 0 };
        Object.assign(initialPreviewDimensions, this.previewDimensions);
        const initialPositions = Array.from(this.points);
        // get new dimensions
        // set new preview pane dimensions
        this.setPreviewPaneDimensions(this.editedImage);
        // get preview pane resize ratio
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
     **/
    detectContours() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                // load the image and compute the ratio of the old height to the new height, clone it, and resize it
                // const processingResizeRatio = 0.5;
                const src = cv.imread(this.editedImage);
                const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
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
                const contours = new cv.MatVector();
                const hierarchy = new cv.Mat();
                cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                const cnt = contours.get(4);
                if (!cnt) {
                    this.processing.emit(false);
                    return;
                }
                // console.log('----------UNIQUE RECTANGLES FROM ALL CONTOURS----------');
                const rects = [];
                for (let i = 0; i < contours.size(); i++) {
                    const cn = contours.get(i);
                    const r = cv.minAreaRect(cn);
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
                let rect2 = cv.minAreaRect(cnt);
                for (let i = 0; i < rects.length; i++) {
                    if (((rects[i].size.width * rects[i].size.height) > (rect2.size.width * rect2.size.height)
                        && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
                            || rects[i].angle === -90 || rects[i].angle === -180) && ((rects[i].angle > 85 || rects[i].angle < 5)))) {
                        rect2 = rects[i];
                    }
                }
                const vertices = cv.RotatedRect.points(rect2);
                for (let i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * this.imageResizeRatio;
                }
                const rect = cv.boundingRect(src);
                src.delete();
                hierarchy.delete();
                contours.delete();
                // transform the rectangle into a set of points
                Object.keys(rect).forEach(key => {
                    rect[key] = rect[key] * this.imageResizeRatio;
                });
                let contourCoordinates;
                const firstRoles = [this.isTop(vertices[0], [vertices[1], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                const secondRoles = [this.isTop(vertices[1], [vertices[0], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                const thirdRoles = [this.isTop(vertices[2], [vertices[0], vertices[1], vertices[3]]) ? 'top' : 'bottom'];
                const fourthRoles = [this.isTop(vertices[3], [vertices[0], vertices[2], vertices[1]]) ? 'top' : 'bottom'];
                const roles = [firstRoles, secondRoles, thirdRoles, fourthRoles];
                const ts = [];
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
            }, 30);
        });
    }
    isTop(coordinate, otherVertices) {
        let count = 0;
        for (let i = 0; i < otherVertices.length; i++) {
            if (coordinate.y < otherVertices[i].y) {
                count++;
            }
        }
        return count >= 2;
    }
    isLeft(coordinate, secondCoordinate) {
        return coordinate.x < secondCoordinate.x;
    }
    pointsAreNotTheSame(vertices) {
        return !(vertices[0].x === vertices[1].x && vertices[1].x === vertices[2].x && vertices[2].x === vertices[3].x &&
            vertices[0].y === vertices[1].y && vertices[1].y === vertices[2].y && vertices[2].y === vertices[3].y);
    }
    /**
     * apply perspective transform
     */
    transform() {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                const dst = cv.imread(this.editedImage);
                // create source coordinates matrix
                const sourceCoordinates = [
                    this.getPoint(['top', 'left']),
                    this.getPoint(['top', 'right']),
                    this.getPoint(['bottom', 'right']),
                    this.getPoint(['bottom', 'left'])
                ].map(point => {
                    return [point.x / this.imageResizeRatio, point.y / this.imageResizeRatio];
                });
                // get max width
                const bottomWidth = this.getPoint(['bottom', 'right']).x - this.getPoint(['bottom', 'left']).x;
                const topWidth = this.getPoint(['top', 'right']).x - this.getPoint(['top', 'left']).x;
                const maxWidth = Math.max(bottomWidth, topWidth) / this.imageResizeRatio;
                // get max height
                const leftHeight = this.getPoint(['bottom', 'left']).y - this.getPoint(['top', 'left']).y;
                const rightHeight = this.getPoint(['bottom', 'right']).y - this.getPoint(['top', 'right']).y;
                const maxHeight = Math.max(leftHeight, rightHeight) / this.imageResizeRatio;
                // create dest coordinates matrix
                const destCoordinates = [
                    [0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]
                ];
                // convert to open cv matrix objects
                const Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...sourceCoordinates));
                const Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...destCoordinates));
                const transformMatrix = cv.getPerspectiveTransform(Ms, Md);
                // set new image size
                const dsize = new cv.Size(maxWidth, maxHeight);
                // perform warp
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_CUBIC, cv.BORDER_CONSTANT, new cv.Scalar());
                cv.imshow(this.editedImage, dst);
                dst.delete();
                Ms.delete();
                Md.delete();
                transformMatrix.delete();
                this.setPreviewPaneDimensions(this.editedImage);
                this.showPreview().then(() => {
                    this.processing.emit(false);
                    resolve();
                });
            }, 30);
        });
    }
    /**
     * applies the selected filter to the image
     * @param preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     */
    applyFilter(preview) {
        return new Promise(async (resolve, reject) => {
            this.processing.emit(true);
            // default options
            const options = {
                blur: false,
                th: true,
                thMode: cv.ADAPTIVE_THRESH_MEAN_C,
                thMeanCorrection: 10,
                thBlockSize: 25,
                thMax: 255,
                grayScale: true,
            };
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
            setTimeout(async () => {
                if (options.grayScale) {
                    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                }
                if (options.blur) {
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
                await this.showPreview(dst);
                this.processing.emit(false);
                resolve();
            }, 30);
        });
    }
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     */
    resize(image) {
        return new Promise((resolve, reject) => {
            this.processing.emit(true);
            setTimeout(() => {
                const src = cv.imread(image);
                const currentDimensions = {
                    width: src.size().width,
                    height: src.size().height
                };
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
                    const dsize = new cv.Size(Math.floor(resizeDimensions.width), Math.floor(resizeDimensions.height));
                    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
                    const resizeResult = document.createElement('canvas');
                    cv.imshow(resizeResult, src);
                    src.delete();
                    this.processing.emit(false);
                    resolve(resizeResult);
                }
                else {
                    this.processing.emit(false);
                    resolve(image);
                }
            }, 30);
        });
    }
    /**
     * display a preview of the image on the preview canvas
     */
    showPreview(image) {
        return new Promise((resolve, reject) => {
            let src;
            if (image) {
                src = image;
            }
            else {
                src = cv.imread(this.editedImage);
            }
            const dst = new cv.Mat();
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
            resolve(image);
        });
    }
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
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
     */
    calculateDimensions(width, height) {
        const ratio = width / height;
        // const maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
        //   this.maxPreviewWidth : this.screenDimensions.width - 40;
        // const maxHeight = this.screenDimensions.height > this.maxPreviewHeight ? this.maxPreviewHeight : this.screenDimensions.height - 240;
        const maxWidth = this.maxPreviewWidth;
        const maxHeight = this.maxPreviewHeight;
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
     * @param roles - an array of roles by which the point will be fetched
     */
    getPoint(roles) {
        return this.points.find(point => {
            return this.limitsService.compareArray(point.roles, roles);
        });
    }
    getStoyle() {
        return this.editorStyle;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocScannerComponent, deps: [{ token: i1.NgxOpenCVService }, { token: i2.LimitsService }, { token: i3.MatBottomSheet }, { token: i4.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxDocScannerComponent, selector: "ngx-doc-scanner", inputs: { file: "file", config: "config" }, outputs: { exitEditor: "exitEditor", editResult: "editResult", error: "error", ready: "ready", processing: "processing" }, viewQueries: [{ propertyName: "previewCanvas", first: true, predicate: ["PreviewCanvas"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n", styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}\n"], dependencies: [{ kind: "directive", type: i5.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { kind: "directive", type: i5.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { kind: "directive", type: i6.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { kind: "directive", type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i8.NgxDraggablePointComponent, selector: "ngx-draggable-point", inputs: ["width", "height", "color", "shape", "pointOptions", "limitRoles", "startPosition", "container", "_currentPosition"] }, { kind: "component", type: i9.NgxShapeOutlineComponent, selector: "ngx-shape-outine", inputs: ["color", "weight", "dimensions"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxDocScannerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-doc-scanner', template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n", styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgxOpenCVService }, { type: i2.LimitsService }, { type: i3.MatBottomSheet }, { type: i4.DomSanitizer }]; }, propDecorators: { previewCanvas: [{
                type: ViewChild,
                args: ['PreviewCanvas', { read: ElementRef }]
            }], exitEditor: [{
                type: Output
            }], editResult: [{
                type: Output
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], processing: [{
                type: Output
            }], file: [{
                type: Input
            }], config: [{
                type: Input
            }] } });
/**
 * a class for generating configuration objects for the editor
 */
class ImageEditorConfig {
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
            Object.keys(options).forEach(key => {
                this[key] = options[key];
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kb2N1bWVudC1zY2FubmVyL3NyYy9saWIvY29tcG9uZW50cy9pbWFnZS1lZGl0b3Ivbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kb2N1bWVudC1zY2FubmVyL3NyYy9saWIvY29tcG9uZW50cy9pbWFnZS1lZGl0b3Ivbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBaUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNoRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHekQsT0FBTyxFQUFFLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWMsTUFBTSwrQkFBK0IsQ0FBQztBQUNuSCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxZQUFZLENBQUM7Ozs7Ozs7Ozs7O0FBUzlDLE1BQU0sT0FBTyxzQkFBc0I7SUFlakM7O09BRUc7SUFDSCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQW1HRCxZQUFZO0lBQ1osWUFBWTtJQUNaLFlBQVk7SUFDWjs7O09BR0c7SUFDSCxJQUFhLElBQUksQ0FBQyxJQUFVO1FBQzFCLElBQUksSUFBSSxFQUFFO1lBQ1IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQzlCLEtBQUssRUFBRSxPQUFvQixFQUFFLEVBQUU7Z0JBQzdCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtvQkFDakIsOEJBQThCO29CQUM5QixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM3QjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDSCxDQUFDO0lBT0QsWUFBb0IsU0FBMkIsRUFBVSxhQUE0QixFQUNqRSxXQUEyQixFQUFVLFNBQXVCO1FBRDVELGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDakUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBYztRQXZKaEYsVUFBSyxHQUFHLENBQUMsQ0FBQztRQTRDVjs7V0FFRztRQUNILGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCOztXQUVHO1FBQ0gsU0FBSSxHQUFxQixNQUFNLENBQUM7UUFDaEM7O1dBRUc7UUFDSyxtQkFBYyxHQUFHLFNBQVMsQ0FBQztRQVNuQzs7V0FFRztRQUNLLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDO1FBMEJGLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsb0JBQW9CO1FBQ3BCOztXQUVHO1FBQ08sZUFBVSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3hFOztXQUVHO1FBQ08sZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ3BFOztXQUVHO1FBQ08sVUFBSyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzdEOztXQUVHO1FBQ08sVUFBSyxHQUEwQixJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ3JFOztXQUVHO1FBQ08sZUFBVSxHQUEwQixJQUFJLFlBQVksRUFBVyxDQUFDO1FBa0N4RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdEIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztTQUMzQixDQUFDO1FBRUYsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQW9CLEVBQUUsRUFBRTtZQUN4RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNuQjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsR0FBRyxFQUFFO29CQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUNELElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbkIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsR0FBRyxFQUFFO29CQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7d0JBQzVCLE9BQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO3FCQUM3QjtnQkFDSCxDQUFDO2dCQUNELElBQUksRUFBRSxjQUFjO2dCQUNwQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVTthQUN0RDtZQUNEO2dCQUNFLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ25DLElBQUksRUFBRSxjQUFjO2dCQUNwQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsT0FBTzthQUNkO1NBQ0YsQ0FBQztRQUVGLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELHdCQUF3QjtRQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO2FBQzVDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO1FBQ3BELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDOUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUNqQyxPQUFPO2FBQ1I7WUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtnQkFDMUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbkM7WUFDRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFO2dCQUNoRyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztnQkFDbkUsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN0QjtZQUNELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2xHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDckUsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN0QjtZQUNELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2xHLE1BQU0sR0FBRyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUN2QixhQUFhLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUNyQjtTQUNGO0lBQ0gsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFDbkMsbUNBQW1DO0lBRW5DOztPQUVHO0lBQ0gsSUFBSTtRQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDNUIsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsV0FBVztRQUNmLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixDQUFDLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ssYUFBYTtRQUNuQixNQUFNLElBQUksR0FBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFDLENBQUM7UUFDM0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDbkUsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsaUNBQWlDO0lBQ2pDLGlDQUFpQztJQUNqQzs7T0FFRztJQUNLLFFBQVEsQ0FBQyxJQUFVO1FBQ3pCLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUMzQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJO2dCQUNGLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDakM7WUFDRCxJQUFJO2dCQUNGLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzFCO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUNELGtCQUFrQjtZQUNsQixjQUFjO1lBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQ3pILFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDcEIsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxTQUFTLENBQUMsSUFBVTtRQUMxQixPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxRQUFRLENBQUM7WUFDYixJQUFJO2dCQUNGLFFBQVEsR0FBRyxNQUFNLFFBQVEsRUFBRSxDQUFDO2FBQzdCO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2I7WUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzNCO1lBQ0QsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDdEIseUNBQXlDO2dCQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6Qiw2Q0FBNkM7Z0JBQzdDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDOUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7b0JBQ2pELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUN0RCxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEIsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFFSDs7V0FFRztRQUNILFNBQVMsUUFBUTtZQUNmLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekIsQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCLDhCQUE4QjtJQUM5Qjs7T0FFRztJQUNILFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSTtRQUMxQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUk7UUFDckIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsNEJBQTRCO1FBQzVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksU0FBUyxFQUFFO1lBQ2IsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDTCxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFFRCxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakMsZ0JBQWdCO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLGdEQUFnRDtRQUNoRCxNQUFNLHdCQUF3QixHQUFHLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRSxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELHFCQUFxQjtRQUNyQixrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRCxnQ0FBZ0M7UUFDaEMsTUFBTSxtQkFBbUIsR0FBRztZQUMxQixLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyx3QkFBd0IsQ0FBQyxLQUFLO1lBQ3BFLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLHdCQUF3QixDQUFDLE1BQU07U0FDeEUsQ0FBQztRQUNGLGtDQUFrQztRQUVsQyxJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDckc7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUN6RztJQUNILENBQUM7SUFFRDs7UUFFSTtJQUNJLGNBQWM7UUFDcEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLG9HQUFvRztnQkFDcEcscUNBQXFDO2dCQUNyQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsdUVBQXVFO2dCQUN2RSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDMUQsK0JBQStCO2dCQUMvQixnQkFBZ0I7Z0JBRWhCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBRTtvQkFDMUQsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoSDtxQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsS0FBSyxlQUFlLEVBQUU7b0JBQ3RFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsc0JBQXNCLEVBQzFGLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2RjtxQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsS0FBSyxtQkFBbUIsRUFBRTtvQkFDMUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQywwQkFBMEIsRUFDOUYsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZGO2dCQUVELE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNqRixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixPQUFPO2lCQUNSO2dCQUNELDBFQUEwRTtnQkFDMUUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN4QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7b0JBQ2YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTsyQkFDdEMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDOzJCQUNsRCxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQ3RDO3dCQUNBLFNBQVM7cUJBQ1Y7b0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3JDLElBQ0UsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSzsrQkFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOytCQUNwRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDakY7NEJBQ0EsR0FBRyxHQUFHLEtBQUssQ0FBQzs0QkFDWixNQUFNO3lCQUNQO3FCQUNGO29CQUVELElBQUksR0FBRyxFQUFFO3dCQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2Y7eUJBQU07d0JBQ0wsSUFBSTs0QkFDRixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7eUJBQ1o7d0JBQUMsT0FBTyxDQUFDLEVBQUU7eUJBQ1g7cUJBQ0Y7aUJBQ0Y7Z0JBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzsyQkFDckYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQzsrQkFDdkUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6Rzt3QkFDQSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNsQjtpQkFDRjtnQkFDRCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDdkQ7Z0JBRUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFbEMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNiLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNsQiwrQ0FBK0M7Z0JBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDaEQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxrQkFBd0MsQ0FBQztnQkFFN0MsTUFBTSxVQUFVLEdBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckgsTUFBTSxXQUFXLEdBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEgsTUFBTSxVQUFVLEdBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckgsTUFBTSxXQUFXLEdBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdEgsTUFBTSxLQUFLLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDakUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNkLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFFZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMs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LENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLFlBQVksR0FBRztZQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3pCLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdEJvdHRvbVNoZWV0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYm90dG9tLXNoZWV0JztcclxuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEVkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zLCBQb2ludFNoYXBlIH0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbmltcG9ydCB7IERvY1NjYW5uZXJDb25maWcsIEltYWdlRGltZW5zaW9ucywgT3BlbkNWU3RhdGUgfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQgeyBMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGEsIFJvbGVzQXJyYXkgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE5neEZpbHRlck1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4T3BlbkNWU2VydmljZSB9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5cclxuZGVjbGFyZSB2YXIgY3Y6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRvYy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICB2YWx1ZSA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWcgb2JqZWN0XHJcbiAgICovXHJcbiAgb3B0aW9uczogSW1hZ2VFZGl0b3JDb25maWc7XHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVESVRPUiBDT05GSUcgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgYWN0aW9uIGJ1dHRvbnMgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3Igc2NyZWVuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+O1xyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIGJ1dHRvbnMgYWNjb3JkaW5nIHRvIHRoZSBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIGdldCBkaXNwbGF5ZWRCdXR0b25zKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yQnV0dG9ucy5maWx0ZXIoYnV0dG9uID0+IHtcclxuICAgICAgcmV0dXJuIGJ1dHRvbi5tb2RlID09PSB0aGlzLm1vZGU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF4UHJldmlld0hlaWdodDogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBtYXhQcmV2aWV3V2lkdGg6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBpbWFnZSBjb250YWluZXJcclxuICAgKi9cclxuICBpbWFnZURpdlN0eWxlOiBhbnk7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIFNUQVRFIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjdlN0YXRlOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAqL1xyXG4gIGltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBtb2RlOiAnY3JvcCcgfCAnY29sb3InID0gJ2Nyb3AnO1xyXG4gIC8qKlxyXG4gICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgKi9cclxuICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyID0gJ2RlZmF1bHQnO1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gT1BFUkFUSU9OIFZBUklBQkxFUyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzY3JlZW5EaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMCxcclxuICAgIGhlaWdodDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgcHJldmlld0RpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlOiBGaWxlO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAqL1xyXG4gIEBWaWV3Q2hpbGQoJ1ByZXZpZXdDYW52YXMnLCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgcHJldmlld0NhbnZhczogRWxlbWVudFJlZjtcclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBwb2ludHMgdXNlZCBieSB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVWRU5UIEVNSVRURVJTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGV4aXRFZGl0b3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqXHJcbiAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyBlcnJvcnMsIGNhbiBiZSBsaW5rZWQgdG8gYW4gZXJyb3IgaGFuZGxlciBvZiBjaG9pY2VcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdHJ1ZSB3aGVuIHByb2Nlc3NpbmcgaXMgZG9uZSwgZmFsc2Ugd2hlbiBjb21wbGV0ZWRcclxuICAgKi9cclxuICBAT3V0cHV0KCkgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICAvLyAqKioqKiogLy9cclxuICAvLyBJTlBVVFMgLy9cclxuICAvLyAqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcclxuICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICovXHJcbiAgQElucHV0KCkgc2V0IGZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgaWYgKGZpbGUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGZpbGU7XHJcbiAgICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKFxyXG4gICAgICAgIGFzeW5jIChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICAgICAgLy8gcmVhZCBmaWxlIHRvIGltYWdlICYgY2FudmFzXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZEZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hPcGVuQ3Y6IE5neE9wZW5DVlNlcnZpY2UsIHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCwgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xyXG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xyXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBzdGF0dXMgb2YgY3YgbW9kdWxlXHJcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgdGhpcy5jdlN0YXRlID0gY3ZTdGF0ZS5zdGF0ZTtcclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KGN2U3RhdGUucmVhZHkpO1xyXG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoJ2Vycm9yIGxvYWRpbmcgY3YnKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvaW50cyA9PiB7XHJcbiAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdleGl0JyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JvdGF0ZScsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnJvdGF0ZUltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ3JvdGF0ZV9yaWdodCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZG9uZV9jcm9wJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZG9uZUNyb3AoKSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnVuZG8oKSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLm1heFByZXZpZXdIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld0hlaWdodDtcclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB0aGlzLm9wdGlvbnMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jb25maWcpIHtcclxuICAgICAgaWYgKCFjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUudGhyZXNob2xkSW5mby50aHJlc2ggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUudGhyZXNob2xkSW5mby50aHJlc2gpIHtcclxuICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHVwZGF0ZVByZXZpZXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5tYXhQcmV2aWV3V2lkdGggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUubWF4UHJldmlld1dpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld0hlaWdodCAhPT0gY2hhbmdlcy5jb25maWcucHJldmlvdXNWYWx1ZS5tYXhQcmV2aWV3SGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3SGVpZ2h0ID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLm1heFByZXZpZXdIZWlnaHQ7XHJcbiAgICAgICAgdXBkYXRlUHJldmlldyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLmVkaXRvckRpbWVuc2lvbnMpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB7Li4udGhpcy5lZGl0b3JTdHlsZX07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvYmosIGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmVkaXRvclN0eWxlID0gb2JqO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cGRhdGVQcmV2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5kb3VibGVSb3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvbmVDcm9wKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2Nyb3AnO1xyXG4gICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGFzeW5jIGV4cG9ydEltYWdlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKVxyXG4gICAgICAudGhlbihyZXNpemVSZXN1bHQgPT4ge1xyXG4gICAgICAgIHJlc2l6ZVJlc3VsdC50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH0sICdpbWFnZS9qcGVnJywgMC44KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVkaXRlZEltYWdlLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfSwgJ2ltYWdlL2pwZWcnLCAwLjgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcclxuICAgKi9cclxuICBwcml2YXRlIGNob29zZUZpbHRlcnMoKSB7XHJcbiAgICBjb25zdCBkYXRhID0ge2ZpbHRlcjogdGhpcy5zZWxlY3RlZEZpbHRlcn07XHJcbiAgICBjb25zdCBib3R0b21TaGVldFJlZiA9IHRoaXMuYm90dG9tU2hlZXQub3BlbihOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LCB7XHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pO1xyXG4gICAgYm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gZGF0YS5maWx0ZXI7XHJcbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBGaWxlIElucHV0ICYgT3V0cHV0IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBsb2FkIGltYWdlIGZyb20gaW5wdXQgZmllbGRcclxuICAgKi9cclxuICBwcml2YXRlIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZEltYWdlKGZpbGUpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IHBhbmUgbGltaXRzXHJcbiAgICAgIC8vIHNob3cgcG9pbnRzXHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSB0cnVlO1xyXG4gICAgICBhd2FpdCB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0Q29udG91cnMoKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgIH0sIDE1KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVhZCBpbWFnZSBmcm9tIEZpbGUgb2JqZWN0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkSW1hZ2UoZmlsZTogRmlsZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IGltYWdlU3JjO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGltYWdlU3JjID0gYXdhaXQgcmVhZEZpbGUoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIGlmICh0aGlzLmVkaXRlZEltYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NsZWFyaW5nIG9sZCBlZGl0ZWQgaW1hZ2UuLi4nKTtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGltZy5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gc2V0IGVkaXRlZCBpbWFnZSBjYW52YXMgYW5kIGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGggPSBpbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuZWRpdGVkSW1hZ2UuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgICAgLy8gcmVzaXplIGltYWdlIGlmIGxhcmdlciB0aGFuIG1heCBpbWFnZSBzaXplXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBpbWcud2lkdGggPiBpbWcuaGVpZ2h0ID8gaW1nLmhlaWdodCA6IGltZy53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gYXdhaXQgdGhpcy5yZXNpemUodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLndpZHRoID0gdGhpcy5lZGl0ZWRJbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLmVkaXRlZEltYWdlLmhlaWdodDtcclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICB9O1xyXG4gICAgICBpbWcuc3JjID0gaW1hZ2VTcmM7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgZmlsZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlYWRGaWxlKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKGVycikgPT4ge1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBJbWFnZSBQcm9jZXNzaW5nIE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiByb3RhdGUgaW1hZ2UgOTAgZGVncmVlc1xyXG4gICAqL1xyXG4gIHJvdGF0ZUltYWdlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZShjbG9ja3dpc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvdWJsZVJvdGF0ZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZSh0cnVlKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByb3RhdGUoY2xvY2t3aXNlID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgLy8gY29uc3QgZHN0ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgY3YudHJhbnNwb3NlKGRzdCwgZHN0KTtcclxuICAgIGlmIChjbG9ja3dpc2UpIHtcclxuICAgICAgY3YuZmxpcChkc3QsIGRzdCwgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdi5mbGlwKGRzdCwgZHN0LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuICAgIC8vIHNyYy5kZWxldGUoKTtcclxuICAgIGRzdC5kZWxldGUoKTtcclxuICAgIC8vIHNhdmUgY3VycmVudCBwcmV2aWV3IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uc1xyXG4gICAgY29uc3QgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zID0ge3dpZHRoOiAwLCBoZWlnaHQ6IDB9O1xyXG4gICAgT2JqZWN0LmFzc2lnbihpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIHRoaXMucHJldmlld0RpbWVuc2lvbnMpO1xyXG4gICAgY29uc3QgaW5pdGlhbFBvc2l0aW9ucyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMpO1xyXG4gICAgLy8gZ2V0IG5ldyBkaW1lbnNpb25zXHJcbiAgICAvLyBzZXQgbmV3IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgIC8vIGdldCBwcmV2aWV3IHBhbmUgcmVzaXplIHJhdGlvXHJcbiAgICBjb25zdCBwcmV2aWV3UmVzaXplUmF0aW9zID0ge1xyXG4gICAgICB3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy5oZWlnaHRcclxuICAgIH07XHJcbiAgICAvLyBzZXQgbmV3IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcblxyXG4gICAgaWYgKGNsb2Nrd2lzZSkge1xyXG4gICAgICB0aGlzLmxpbWl0c1NlcnZpY2Uucm90YXRlQ2xvY2t3aXNlKHByZXZpZXdSZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxpbWl0c1NlcnZpY2Uucm90YXRlQW50aUNsb2Nrd2lzZShwcmV2aWV3UmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGV0ZWN0cyB0aGUgY29udG91cnMgb2YgdGhlIGRvY3VtZW50IGFuZFxyXG4gICAqKi9cclxuICBwcml2YXRlIGRldGVjdENvbnRvdXJzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIGxvYWQgdGhlIGltYWdlIGFuZCBjb21wdXRlIHRoZSByYXRpbyBvZiB0aGUgb2xkIGhlaWdodCB0byB0aGUgbmV3IGhlaWdodCwgY2xvbmUgaXQsIGFuZCByZXNpemUgaXRcclxuICAgICAgICAvLyBjb25zdCBwcm9jZXNzaW5nUmVzaXplUmF0aW8gPSAwLjU7XHJcbiAgICAgICAgY29uc3Qgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2Lk1hdC56ZXJvcyhzcmMucm93cywgc3JjLmNvbHMsIGN2LkNWXzhVQzMpO1xyXG4gICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgLy8gY29udmVydCB0aGUgaW1hZ2UgdG8gZ3JheXNjYWxlLCBibHVyIGl0LCBhbmQgZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2VcclxuICAgICAgICBjdi5jdnRDb2xvcihzcmMsIHNyYywgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICBjdi5HYXVzc2lhbkJsdXIoc3JjLCBzcmMsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgLy8gY3YuQ2Fubnkoc3JjLCBzcmMsIDc1LCAyMDApO1xyXG4gICAgICAgIC8vIGZpbmQgY29udG91cnNcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgICAgY3YudGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaCwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9tZWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfZ2F1c3NpYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XHJcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LmZpbmRDb250b3VycyhzcmMsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xyXG4gICAgICAgIGNvbnN0IGNudCA9IGNvbnRvdXJzLmdldCg0KTtcclxuICAgICAgICBpZiAoIWNudCkge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLVVOSVFVRSBSRUNUQU5HTEVTIEZST00gQUxMIENPTlRPVVJTLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnN0IHJlY3RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgY24gPSBjb250b3Vycy5nZXQoaSk7XHJcbiAgICAgICAgICBjb25zdCByID0gY3YubWluQXJlYVJlY3QoY24pO1xyXG4gICAgICAgICAgbGV0IGFkZCA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoci5zaXplLmhlaWdodCA8IDUwIHx8IHIuc2l6ZS53aWR0aCA8IDUwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IDkwIHx8IHIuYW5nbGUgPT09IDE4MCB8fCByLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IC05MCB8fCByLmFuZ2xlID09PSAtMTgwXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgcmVjdHNbal0uYW5nbGUgPT09IHIuYW5nbGVcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5jZW50ZXIueCA9PT0gci5jZW50ZXIueCAmJiByZWN0c1tqXS5jZW50ZXIueSA9PT0gci5jZW50ZXIueVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLnNpemUud2lkdGggPT09IHIuc2l6ZS53aWR0aCAmJiByZWN0c1tqXS5zaXplLmhlaWdodCA9PT0gci5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgcmVjdHMucHVzaChyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgci5kZWxldGUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVjdDIgPSBjdi5taW5BcmVhUmVjdChjbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmICgoKHJlY3RzW2ldLnNpemUud2lkdGggKiByZWN0c1tpXS5zaXplLmhlaWdodCkgPiAocmVjdDIuc2l6ZS53aWR0aCAqIHJlY3QyLnNpemUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAmJiAhKHJlY3RzW2ldLmFuZ2xlID09PSA5MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMTgwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgICAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC05MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gLTE4MCkgJiYgKChyZWN0c1tpXS5hbmdsZSA+IDg1IHx8IHJlY3RzW2ldLmFuZ2xlIDwgNSkpKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJlY3QyID0gcmVjdHNbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gY3YuUm90YXRlZFJlY3QucG9pbnRzKHJlY3QyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgdmVydGljZXNbaV0ueCA9IHZlcnRpY2VzW2ldLnggKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS55ID0gdmVydGljZXNbaV0ueSAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBjdi5ib3VuZGluZ1JlY3Qoc3JjKTtcclxuXHJcbiAgICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgIGhpZXJhcmNoeS5kZWxldGUoKTtcclxuICAgICAgICBjb250b3Vycy5kZWxldGUoKTtcclxuICAgICAgICAvLyB0cmFuc2Zvcm0gdGhlIHJlY3RhbmdsZSBpbnRvIGEgc2V0IG9mIHBvaW50c1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHJlY3QpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIHJlY3Rba2V5XSA9IHJlY3Rba2V5XSAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRvdXJDb29yZGluYXRlczogUG9zaXRpb25DaGFuZ2VEYXRhW107XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0Um9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1swXSwgW3ZlcnRpY2VzWzFdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMV0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCB0aGlyZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMl0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCBmb3VydGhSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzNdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1sxXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcblxyXG4gICAgICAgIGNvbnN0IHJvbGVzID0gW2ZpcnN0Um9sZXMsIHNlY29uZFJvbGVzLCB0aGlyZFJvbGVzLCBmb3VydGhSb2xlc107XHJcbiAgICAgICAgY29uc3QgdHMgPSBbXTtcclxuICAgICAgICBjb25zdCBicyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocm9sZXNbaV1bMF0gPT09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIHRzLnB1c2goaSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicy5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIGNudC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzTGVmdCh2ZXJ0aWNlc1t0c1swXV0sIHZlcnRpY2VzW3RzWzFdXSkpIHtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByb2xlc1t0c1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pc0xlZnQodmVydGljZXNbYnNbMF1dLCB2ZXJ0aWNlc1tic1sxXV0pKSB7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICAgIHJvbGVzW2JzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMV1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMF1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy51c2VSb3RhdGVkUmVjdGFuZ2xlXHJcbiAgICAgICAgICAmJiB0aGlzLnBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzBdLngsIHk6IHZlcnRpY2VzWzBdLnl9LCBmaXJzdFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMV0ueCwgeTogdmVydGljZXNbMV0ueX0sIHNlY29uZFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMl0ueCwgeTogdmVydGljZXNbMl0ueX0sIHRoaXJkUm9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1szXS54LCB5OiB2ZXJ0aWNlc1szXS55fSwgZm91cnRoUm9sZXMpLFxyXG4gICAgICAgICAgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29udG91ckNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueX0sIFsnbGVmdCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueX0sIFsncmlnaHQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsncmlnaHQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25Qb2ludHMoY29udG91ckNvb3JkaW5hdGVzKTtcclxuICAgICAgICAvLyB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzVG9wKGNvb3JkaW5hdGUsIG90aGVyVmVydGljZXMpOiBib29sZWFuIHtcclxuXHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdGhlclZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChjb29yZGluYXRlLnkgPCBvdGhlclZlcnRpY2VzW2ldLnkpIHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50ID49IDI7XHJcblxyXG4gIH1cclxuXHJcbiAgaXNMZWZ0KGNvb3JkaW5hdGUsIHNlY29uZENvb3JkaW5hdGUpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBjb29yZGluYXRlLnggPCBzZWNvbmRDb29yZGluYXRlLng7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEodmVydGljZXNbMF0ueCA9PT0gdmVydGljZXNbMV0ueCAmJiB2ZXJ0aWNlc1sxXS54ID09PSB2ZXJ0aWNlc1syXS54ICYmIHZlcnRpY2VzWzJdLnggPT09IHZlcnRpY2VzWzNdLnggJiZcclxuICAgICAgdmVydGljZXNbMF0ueSA9PT0gdmVydGljZXNbMV0ueSAmJiB2ZXJ0aWNlc1sxXS55ID09PSB2ZXJ0aWNlc1syXS55ICYmIHZlcnRpY2VzWzJdLnkgPT09IHZlcnRpY2VzWzNdLnkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgc291cmNlIGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcclxuICAgICAgICBdLm1hcChwb2ludCA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gW3BvaW50LnggLyB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHBvaW50LnkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW9dO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBnZXQgbWF4IHdpZHRoXHJcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCB0b3BXaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoYm90dG9tV2lkdGgsIHRvcFdpZHRoKSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxyXG4gICAgICAgIGNvbnN0IGxlZnRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS55O1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS55O1xyXG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBjcmVhdGUgZGVzdCBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBkZXN0Q29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIG1heEhlaWdodCAtIDFdLFxyXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXHJcbiAgICAgICAgY29uc3QgTXMgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5zb3VyY2VDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IE1kID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uZGVzdENvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcclxuICAgICAgICAvLyBzZXQgbmV3IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKG1heFdpZHRoLCBtYXhIZWlnaHQpO1xyXG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxyXG4gICAgICAgIGN2LndhcnBQZXJzcGVjdGl2ZShkc3QsIGRzdCwgdHJhbnNmb3JtTWF0cml4LCBkc2l6ZSwgY3YuSU5URVJfQ1VCSUMsIGN2LkJPUkRFUl9DT05TVEFOVCwgbmV3IGN2LlNjYWxhcigpKTtcclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuXHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIE1zLmRlbGV0ZSgpO1xyXG4gICAgICAgIE1kLmRlbGV0ZSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdHJpeC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciB0byB0aGUgaW1hZ2VcclxuICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAqIHdoZW4gZmFsc2UsIHdpbGwgYXBwbHkgdG8gZWRpdGVkSW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGFwcGx5RmlsdGVyKHByZXZpZXc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBibHVyOiBmYWxzZSxcclxuICAgICAgICB0aDogdHJ1ZSxcclxuICAgICAgICB0aE1vZGU6IGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgdGhNZWFuQ29ycmVjdGlvbjogMTAsXHJcbiAgICAgICAgdGhCbG9ja1NpemU6IDI1LFxyXG4gICAgICAgIHRoTWF4OiAyNTUsXHJcbiAgICAgICAgZ3JheVNjYWxlOiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSAnb3JpZ2luYWwnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0ZWRGaWx0ZXIpIHtcclxuICAgICAgICBjYXNlICdvcmlnaW5hbCc6XHJcbiAgICAgICAgICBvcHRpb25zLnRoID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdtYWdpY19jb2xvcic6XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYncyJzpcclxuICAgICAgICAgIG9wdGlvbnMudGhNb2RlID0gY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0M7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIG9wdGlvbnMudGhCbG9ja1NpemUgPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Myc6XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSB0cnVlO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICBjdi5jdnRDb2xvcihkc3QsIGRzdCwgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuYmx1cikge1xyXG4gICAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAgIGN2LkdhdXNzaWFuQmx1cihkc3QsIGRzdCwga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGgpIHtcclxuICAgICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChkc3QsIGRzdCwgb3B0aW9ucy50aE1heCwgb3B0aW9ucy50aE1vZGUsIGN2LlRIUkVTSF9CSU5BUlksIG9wdGlvbnMudGhCbG9ja1NpemUsIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkc3QuY29udmVydFRvKGRzdCwgLTEsIDEsIDYwKTtcclxuICAgICAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxNzAsIDI1NSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJldmlldykge1xyXG4gICAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoZHN0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlc2l6ZSBhbiBpbWFnZSB0byBmaXQgY29uc3RyYWludHMgc2V0IGluIG9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXNpemUoaW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50KTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZChpbWFnZSk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogc3JjLnNpemUoKS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3JjLnNpemUoKS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGN1cnJlbnREaW1lbnNpb25zLndpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGggLyBjdXJyZW50RGltZW5zaW9ucy53aWR0aCAqIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgIGlmIChyZXNpemVEaW1lbnNpb25zLmhlaWdodCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCAvIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCAqIGN1cnJlbnREaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMud2lkdGgpLCBNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0KSk7XHJcbiAgICAgICAgICBjdi5yZXNpemUoc3JjLCBzcmMsIGRzaXplLCAwLCAwLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZVJlc3VsdCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgIGN2Lmltc2hvdyhyZXNpemVSZXN1bHQsIHNyYyk7XHJcbiAgICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc2l6ZVJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgaW1hZ2Ugb24gdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93UHJldmlldyhpbWFnZT86IGFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHNyYztcclxuICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgc3JjID0gaW1hZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZSgwLCAwKTtcclxuICAgICAgY3YucmVzaXplKHNyYywgZHN0LCBkc2l6ZSwgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICBjdi5pbXNob3codGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQsIGRzdCk7XHJcbiAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgaW1hZ2UuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIH1cclxuICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIFV0aWxpdHkgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBwcmV2aWV3IGNhbnZhcyBkaW1lbnNpb25zIGFjY29yZGluZyB0byB0aGUgY2FudmFzIGVsZW1lbnQgb2YgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRQcmV2aWV3UGFuZURpbWVuc2lvbnMoaW1nOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgLy8gc2V0IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICB0aGlzLnByZXZpZXdEaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGg7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMuaW1hZ2VSZXNpemVSYXRpbyA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmltYWdlRGl2U3R5bGUgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCArICdweCcsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLmhlaWdodCArICdweCcsXHJcbiAgICAgICdtYXJnaW4tbGVmdCc6IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZShgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgKyAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWApLFxyXG4gICAgICAnbWFyZ2luLXJpZ2h0JzogdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiAtICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCksXHJcbiAgICB9O1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgcmF0aW86IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XHJcblxyXG4gICAgLy8gY29uc3QgbWF4V2lkdGggPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggPiB0aGlzLm1heFByZXZpZXdXaWR0aCA/XHJcbiAgICAvLyAgIHRoaXMubWF4UHJldmlld1dpZHRoIDogdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoIC0gNDA7XHJcbiAgICAvLyBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMuaGVpZ2h0ID4gdGhpcy5tYXhQcmV2aWV3SGVpZ2h0ID8gdGhpcy5tYXhQcmV2aWV3SGVpZ2h0IDogdGhpcy5zY3JlZW5EaW1lbnNpb25zLmhlaWdodCAtIDI0MDtcclxuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLm1heFByZXZpZXdIZWlnaHQ7XHJcbiAgICBjb25zdCBjYWxjdWxhdGVkID0ge1xyXG4gICAgICB3aWR0aDogbWF4V2lkdGgsXHJcbiAgICAgIGhlaWdodDogTWF0aC5yb3VuZChtYXhXaWR0aCAvIHJhdGlvKSxcclxuICAgICAgcmF0aW86IHJhdGlvXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChjYWxjdWxhdGVkLmhlaWdodCA+IG1heEhlaWdodCkge1xyXG4gICAgICBjYWxjdWxhdGVkLmhlaWdodCA9IG1heEhlaWdodDtcclxuICAgICAgY2FsY3VsYXRlZC53aWR0aCA9IE1hdGgucm91bmQobWF4SGVpZ2h0ICogcmF0aW8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhbGN1bGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBvaW50KHJvbGVzOiBSb2xlc0FycmF5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb2ludHMuZmluZChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbWl0c1NlcnZpY2UuY29tcGFyZUFycmF5KHBvaW50LnJvbGVzLCByb2xlcyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFN0b3lsZSgpOiB7IFtwOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSB7XHJcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JTdHlsZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhIGNsYXNzIGZvciBnZW5lcmF0aW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmb3IgdGhlIGVkaXRvclxyXG4gKi9cclxuY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAvKipcclxuICAgKiBtYXggZGltZW5zaW9ucyBvZiBvcHV0cHV0IGltYWdlLiBpZiBzZXQgdG8gemVyb1xyXG4gICAqL1xyXG4gIG1heEltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDMwMDAwLFxyXG4gICAgaGVpZ2h0OiAzMDAwMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yQmFja2dyb3VuZENvbG9yID0gJyNmZWZlZmUnO1xyXG4gIC8qKlxyXG4gICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yRGltZW5zaW9uczogeyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgfSA9IHtcclxuICAgIHdpZHRoOiAnMTAwdncnLFxyXG4gICAgaGVpZ2h0OiAnMTAwdmgnXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGV4dHJhQ3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICB0b3A6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogbWF0ZXJpYWwgZGVzaWduIHRoZW1lIGNvbG9yIG5hbWVcclxuICAgKi9cclxuICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JyA9ICdhY2NlbnQnO1xyXG4gIC8qKlxyXG4gICAqIGljb24gZm9yIHRoZSBidXR0b24gdGhhdCBjb21wbGV0ZXMgdGhlIGVkaXRpbmcgYW5kIGVtaXRzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBleHBvcnRJbWFnZUljb24gPSAnY2xvdWRfdXBsb2FkJztcclxuICAvKipcclxuICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xDb2xvciA9ICcjRkYzMzMzJztcclxuICAvKipcclxuICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sLCBjYW4gYmUgZWl0aGVyIGEgcmVjdGFuZ2xlIG9yIGEgY2lyY2xlXHJcbiAgICovXHJcbiAgY3JvcFRvb2xTaGFwZTogUG9pbnRTaGFwZSA9ICdjaXJjbGUnO1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDEwLFxyXG4gICAgaGVpZ2h0OiAxMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHBvaW50IGF0dHJpYnV0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHBvaW50T3B0aW9uczogUG9pbnRPcHRpb25zO1xyXG4gIC8qKlxyXG4gICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgZWRpdG9yIHN0eWxlIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBlZGl0b3JTdHlsZT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogY3JvcCB0b29sIG91dGxpbmUgd2lkdGhcclxuICAgKi9cclxuICBjcm9wVG9vbExpbmVXZWlnaHQgPSAzO1xyXG4gIC8qKlxyXG4gICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld1dpZHRoID0gODAwO1xyXG5cclxuICAvKipcclxuICAgKiBtYXhpbXVtIHNpemUgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAqL1xyXG4gIG1heFByZXZpZXdIZWlnaHQgPSA4MDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IERvY1NjYW5uZXJDb25maWcpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB7J2JhY2tncm91bmQtY29sb3InOiB0aGlzLmVkaXRvckJhY2tncm91bmRDb2xvcn07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZWRpdG9yRGltZW5zaW9ucyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZXh0cmFDc3MpO1xyXG5cclxuICAgIHRoaXMucG9pbnRPcHRpb25zID0ge1xyXG4gICAgICBzaGFwZTogdGhpcy5jcm9wVG9vbFNoYXBlLFxyXG4gICAgICBjb2xvcjogdGhpcy5jcm9wVG9vbENvbG9yLFxyXG4gICAgICB3aWR0aDogMCxcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnBvaW50T3B0aW9ucywgdGhpcy5jcm9wVG9vbERpbWVuc2lvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuIiwiPGRpdiBbbmdTdHlsZV09XCJnZXRTdG95bGUoKVwiIGZ4TGF5b3V0PVwiY29sdW1uXCIgZnhMYXlvdXRBbGlnbj1cInNwYWNlLWFyb3VuZFwiIHN0eWxlPVwiZGlyZWN0aW9uOiBsdHIgIWltcG9ydGFudFwiPlxyXG4gIDxkaXYgI2ltYWdlQ29udGFpbmVyIFtuZ1N0eWxlXT1cImltYWdlRGl2U3R5bGVcIiBzdHlsZT1cIm1hcmdpbjogYXV0bztcIj5cclxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpbWFnZUxvYWRlZCAmJiBtb2RlID09PSAnY3JvcCdcIj5cclxuICAgICAgPG5neC1zaGFwZS1vdXRpbmUgI3NoYXBlT3V0bGluZSBbY29sb3JdPVwib3B0aW9ucy5jcm9wVG9vbENvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3dlaWdodF09XCJvcHRpb25zLmNyb3BUb29sTGluZVdlaWdodFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtkaW1lbnNpb25zXT1cInByZXZpZXdEaW1lbnNpb25zXCI+PC9uZ3gtc2hhcGUtb3V0aW5lPlxyXG4gICAgICA8bmd4LWRyYWdnYWJsZS1wb2ludCAjdG9wTGVmdCBbcG9pbnRPcHRpb25zXT1cIm9wdGlvbnMucG9pbnRPcHRpb25zXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0UG9zaXRpb25dPVwie3g6IDAsIHk6IDB9XCIgW2xpbWl0Um9sZXNdPVwiWyd0b3AnLCAnbGVmdCddXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW2NvbnRhaW5lcl09XCJpbWFnZUNvbnRhaW5lclwiPjwvbmd4LWRyYWdnYWJsZS1wb2ludD5cclxuICAgICAgPG5neC1kcmFnZ2FibGUtcG9pbnQgI3RvcFJpZ2h0IFtwb2ludE9wdGlvbnNdPVwib3B0aW9ucy5wb2ludE9wdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRQb3NpdGlvbl09XCJ7eDogcHJldmlld0RpbWVuc2lvbnMud2lkdGgsIHk6IDB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xpbWl0Um9sZXNdPVwiWyd0b3AnLCAncmlnaHQnXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjb250YWluZXJdPVwiaW1hZ2VDb250YWluZXJcIj48L25neC1kcmFnZ2FibGUtcG9pbnQ+XHJcbiAgICAgIDxuZ3gtZHJhZ2dhYmxlLXBvaW50ICNib3R0b21MZWZ0IFtwb2ludE9wdGlvbnNdPVwib3B0aW9ucy5wb2ludE9wdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRQb3NpdGlvbl09XCJ7eDogMCwgeTogcHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsaW1pdFJvbGVzXT1cIlsnYm90dG9tJywgJ2xlZnQnXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjb250YWluZXJdPVwiaW1hZ2VDb250YWluZXJcIj48L25neC1kcmFnZ2FibGUtcG9pbnQ+XHJcbiAgICAgIDxuZ3gtZHJhZ2dhYmxlLXBvaW50ICNib3R0b21SaWdodCBbcG9pbnRPcHRpb25zXT1cIm9wdGlvbnMucG9pbnRPcHRpb25zXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0UG9zaXRpb25dPVwie3g6IHByZXZpZXdEaW1lbnNpb25zLndpZHRoLCB5OiBwcmV2aWV3RGltZW5zaW9ucy5oZWlnaHR9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xpbWl0Um9sZXNdPVwiWydib3R0b20nLCAncmlnaHQnXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjb250YWluZXJdPVwiaW1hZ2VDb250YWluZXJcIj48L25neC1kcmFnZ2FibGUtcG9pbnQ+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDxjYW52YXMgI1ByZXZpZXdDYW52YXMgW25nU3R5bGVdPVwieydtYXgtd2lkdGgnOiBvcHRpb25zLm1heFByZXZpZXdXaWR0aH1cIlxyXG4gICAgICAgICAgICBzdHlsZT1cInotaW5kZXg6IDVcIj48L2NhbnZhcz5cclxuICA8L2Rpdj5cclxuPCEtLSAgPGRpdiBmeExheW91dD1cImNvbHVtblwiIHN0eWxlPVwid2lkdGg6IDEwMHZ3XCI+LS0+XHJcbjwhLS0gICAgPGRpdiBjbGFzcz1cImVkaXRvci1hY3Rpb25zXCIgZnhMYXlvdXQ9XCJyb3dcIiBmeExheW91dEFsaWduPVwic3BhY2UtYXJvdW5kXCI+LS0+XHJcbjwhLS0gICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBidXR0b24gb2YgZGlzcGxheWVkQnV0dG9uc1wiIFtuZ1N3aXRjaF09XCJidXR0b24udHlwZVwiPi0tPlxyXG48IS0tICAgICAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiAqbmdTd2l0Y2hDYXNlPVwiJ2ZhYidcIiBbbmFtZV09XCJidXR0b24ubmFtZVwiIChjbGljayk9XCJidXR0b24uYWN0aW9uKClcIi0tPlxyXG48IS0tICAgICAgICAgICAgICAgIFtjb2xvcl09XCJvcHRpb25zLmJ1dHRvblRoZW1lQ29sb3JcIj4tLT5cclxuPCEtLSAgICAgICAgICA8bWF0LWljb24+e3tidXR0b24uaWNvbn19PC9tYXQtaWNvbj4tLT5cclxuPCEtLSAgICAgICAgPC9idXR0b24+LS0+XHJcbjwhLS0gICAgICAgIDxidXR0b24gbWF0LXJhaXNlZC1idXR0b24gKm5nU3dpdGNoQ2FzZT1cIididXR0b24nXCIgW25hbWVdPVwiYnV0dG9uLm5hbWVcIi0tPlxyXG48IS0tICAgICAgICAgICAgICAgIChjbGljayk9XCJidXR0b24uYWN0aW9uKClcIiBbY29sb3JdPVwib3B0aW9ucy5idXR0b25UaGVtZUNvbG9yXCI+LS0+XHJcbjwhLS0gICAgICAgICAgPG1hdC1pY29uPnt7YnV0dG9uLmljb259fTwvbWF0LWljb24+LS0+XHJcbjwhLS0gICAgICAgICAgPHNwYW4+e3tidXR0b24udGV4dH19fTwvc3Bhbj4tLT5cclxuPCEtLSAgICAgICAgPC9idXR0b24+LS0+XHJcbjwhLS0gICAgICA8L25nLWNvbnRhaW5lcj4tLT5cclxuPCEtLSAgICA8L2Rpdj4tLT5cclxuPCEtLSAgPC9kaXY+LS0+XHJcblxyXG48L2Rpdj5cclxuXHJcblxyXG4iXX0=