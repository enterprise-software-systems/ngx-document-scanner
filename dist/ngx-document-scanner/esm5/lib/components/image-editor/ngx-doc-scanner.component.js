/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/image-editor/ngx-doc-scanner.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter, __generator, __read, __spread } from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxFilterMenuComponent } from '../filter-menu/ngx-filter-menu.component';
import { NgxOpenCVService } from 'ngx-opencv';
var NgxDocScannerComponent = /** @class */ (function () {
    function NgxDocScannerComponent(ngxOpenCv, limitsService, bottomSheet) {
        var _this = this;
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
        function (cvState) {
            _this.cvState = cvState.state;
            _this.ready.emit(cvState.ready);
            if (cvState.error) {
                _this.error.emit(new Error('error loading cv'));
            }
            else if (cvState.loading) {
                _this.processing.emit(true);
            }
            else if (cvState.ready) {
                _this.processing.emit(false);
            }
        }));
        // subscribe to positions of crop tool
        this.limitsService.positions.subscribe((/**
         * @param {?} points
         * @return {?}
         */
        function (points) {
            _this.points = points;
        }));
    }
    Object.defineProperty(NgxDocScannerComponent.prototype, "displayedButtons", {
        /**
         * returns an array of buttons according to the editor mode
         */
        get: /**
         * returns an array of buttons according to the editor mode
         * @return {?}
         */
        function () {
            var _this = this;
            return this.editorButtons.filter((/**
             * @param {?} button
             * @return {?}
             */
            function (button) {
                return button.mode === _this.mode;
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxDocScannerComponent.prototype, "file", {
        // ****** //
        // INPUTS //
        // ****** //
        /**
         * set image for editing
         * @param file - file from form input
         */
        set: 
        // ****** //
        // INPUTS //
        // ****** //
        /**
         * set image for editing
         * @param {?} file - file from form input
         * @return {?}
         */
        function (file) {
            var _this = this;
            if (file) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(true);
                }), 5);
                this.imageLoaded = false;
                this.originalImage = file;
                this.ngxOpenCv.cvState.subscribe((/**
                 * @param {?} cvState
                 * @return {?}
                 */
                function (cvState) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!cvState.ready) return [3 /*break*/, 2];
                                // read file to image & canvas
                                return [4 /*yield*/, this.loadFile(file)];
                            case 1:
                                // read file to image & canvas
                                _a.sent();
                                this.processing.emit(false);
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); }));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.editorButtons = [
            {
                name: 'exit',
                action: (/**
                 * @return {?}
                 */
                function () {
                    _this.exitEditor.emit('canceled');
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
                function () {
                    if (_this.config.filterEnable) {
                        return _this.chooseFilters();
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
        function (button) {
            if (button.name === 'upload') {
                button.icon = _this.options.exportImageIcon;
            }
        }));
        this.maxPreviewWidth = this.options.maxPreviewWidth;
        this.editorStyle = this.options.editorStyle;
    };
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     */
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     * @return {?}
     */
    NgxDocScannerComponent.prototype.exit = 
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     * @return {?}
     */
    function () {
        this.exitEditor.emit('canceled');
    };
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.getMode = /**
     * @return {?}
     */
    function () {
        return this.mode;
    };
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.doneCrop = /**
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mode = 'color';
                        return [4 /*yield*/, this.transform()];
                    case 1:
                        _a.sent();
                        if (!this.config.filterEnable) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.applyFilter(true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.undo = /**
     * @return {?}
     */
    function () {
        this.mode = 'crop';
        this.loadFile(this.originalImage);
    };
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    /**
     * applies the selected filter, and when done emits the resulted image
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.exportImage = /**
     * applies the selected filter, and when done emits the resulted image
     * @private
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.applyFilter(false)];
                    case 1:
                        _a.sent();
                        if (this.options.maxImageDimensions) {
                            this.resize(this.editedImage)
                                .then((/**
                             * @param {?} resizeResult
                             * @return {?}
                             */
                            function (resizeResult) {
                                resizeResult.toBlob((/**
                                 * @param {?} blob
                                 * @return {?}
                                 */
                                function (blob) {
                                    _this.editResult.emit(blob);
                                    _this.processing.emit(false);
                                }), _this.originalImage.type);
                            }));
                        }
                        else {
                            this.editedImage.toBlob((/**
                             * @param {?} blob
                             * @return {?}
                             */
                            function (blob) {
                                _this.editResult.emit(blob);
                                _this.processing.emit(false);
                            }), this.originalImage.type);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     */
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.chooseFilters = /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var data = { filter: this.selectedFilter };
        /** @type {?} */
        var bottomSheetRef = this.bottomSheet.open(NgxFilterMenuComponent, {
            data: data
        });
        bottomSheetRef.afterDismissed().subscribe((/**
         * @return {?}
         */
        function () {
            _this.selectedFilter = data.filter;
            _this.applyFilter(true);
        }));
    };
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     */
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     * @private
     * @param {?} file
     * @return {?}
     */
    NgxDocScannerComponent.prototype.loadFile = 
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     * @private
     * @param {?} file
     * @return {?}
     */
    function (file) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var err_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.processing.emit(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.readImage(file)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        this.error.emit(new Error(err_1));
                        return [3 /*break*/, 4];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.showPreview()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _a.sent();
                        console.error(err_2);
                        this.error.emit(new Error(err_2));
                        return [3 /*break*/, 7];
                    case 7:
                        // set pane limits
                        // show points
                        this.imageLoaded = true;
                        return [4 /*yield*/, this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height })];
                    case 8:
                        _a.sent();
                        setTimeout((/**
                         * @return {?}
                         */
                        function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.detectContours()];
                                    case 1:
                                        _a.sent();
                                        this.processing.emit(false);
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); }), 15);
                        return [2 /*return*/];
                }
            });
        }); }));
    };
    /**
     * read image from File object
     */
    /**
     * read image from File object
     * @private
     * @param {?} file
     * @return {?}
     */
    NgxDocScannerComponent.prototype.readImage = /**
     * read image from File object
     * @private
     * @param {?} file
     * @return {?}
     */
    function (file) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var imageSrc, err_3, img;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, readFile()];
                    case 1:
                        imageSrc = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        reject(err_3);
                        return [3 /*break*/, 3];
                    case 3:
                        img = new Image();
                        img.onload = (/**
                         * @return {?}
                         */
                        function () { return __awaiter(_this, void 0, void 0, function () {
                            var ctx, width, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        // set edited image canvas and dimensions
                                        this.editedImage = (/** @type {?} */ (document.createElement('canvas')));
                                        this.editedImage.width = img.width;
                                        this.editedImage.height = img.height;
                                        ctx = this.editedImage.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        // resize image if larger than max image size
                                        width = img.width > img.height ? img.height : img.width;
                                        if (!(width > this.options.maxImageDimensions.width)) return [3 /*break*/, 2];
                                        _a = this;
                                        return [4 /*yield*/, this.resize(this.editedImage)];
                                    case 1:
                                        _a.editedImage = _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        this.imageDimensions.width = this.editedImage.width;
                                        this.imageDimensions.height = this.editedImage.height;
                                        this.setPreviewPaneDimensions(this.editedImage);
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        img.src = imageSrc;
                        return [2 /*return*/];
                }
            });
        }); }));
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
            function (resolve, reject) {
                /** @type {?} */
                var reader = new FileReader();
                reader.onload = (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    resolve(reader.result);
                });
                reader.onerror = (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    reject(err);
                });
                reader.readAsDataURL(file);
            }));
        }
    };
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     */
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @return {?}
     */
    NgxDocScannerComponent.prototype.rotateImage = 
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                // const dst = new cv.Mat();
                cv.transpose(dst, dst);
                cv.flip(dst, dst, 1);
                cv.imshow(_this.editedImage, dst);
                // src.delete();
                dst.delete();
                // save current preview dimensions and positions
                /** @type {?} */
                var initialPreviewDimensions = { width: 0, height: 0 };
                Object.assign(initialPreviewDimensions, _this.previewDimensions);
                /** @type {?} */
                var initialPositions = Array.from(_this.points);
                // get new dimensions
                // set new preview pane dimensions
                _this.setPreviewPaneDimensions(_this.editedImage);
                // get preview pane resize ratio
                /** @type {?} */
                var previewResizeRatios = {
                    width: _this.previewDimensions.width / initialPreviewDimensions.width,
                    height: _this.previewDimensions.height / initialPreviewDimensions.height
                };
                // set new preview pane dimensions
                _this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
                _this.showPreview().then((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    };
    /**
     * detects the contours of the document and
     **/
    /**
     * detects the contours of the document and
     *
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.detectContours = /**
     * detects the contours of the document and
     *
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                // load the image and compute the ratio of the old height to the new height, clone it, and resize it
                /** @type {?} */
                var processingResizeRatio = 0.5;
                /** @type {?} */
                var src = cv.imread(_this.editedImage);
                /** @type {?} */
                var dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
                /** @type {?} */
                var dsize = new cv.Size(src.rows * processingResizeRatio, src.cols * processingResizeRatio);
                /** @type {?} */
                var ksize = new cv.Size(5, 5);
                // convert the image to grayscale, blur it, and find edges in the image
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
                cv.Canny(src, src, 75, 200);
                // find contours
                if (_this.config.thresholdInfo.thresholdType === 'standard') {
                    cv.threshold(src, src, _this.config.thresholdInfo.thresh, _this.config.thresholdInfo.maxValue, cv.THRESH_BINARY);
                }
                else if (_this.config.thresholdInfo.thresholdType === 'adaptive_mean') {
                    cv.adaptiveThreshold(src, src, _this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, _this.config.thresholdInfo.blockSize, _this.config.thresholdInfo.c);
                }
                else if (_this.config.thresholdInfo.thresholdType === 'adaptive_gaussian') {
                    cv.adaptiveThreshold(src, src, _this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, _this.config.thresholdInfo.blockSize, _this.config.thresholdInfo.c);
                }
                /** @type {?} */
                var contours = new cv.MatVector();
                /** @type {?} */
                var hierarchy = new cv.Mat();
                cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                /** @type {?} */
                var cnt = contours.get(4);
                console.log('----------UNIQUE RECTANGLES FROM ALL CONTOURS----------');
                /** @type {?} */
                var rects = [];
                for (var i = 0; i < contours.size(); i++) {
                    /** @type {?} */
                    var cn = contours.get(i);
                    /** @type {?} */
                    var r = cv.minAreaRect(cn);
                    /** @type {?} */
                    var add = true;
                    if (r.size.height < 50 || r.size.width < 50
                        || r.angle === 90 || r.angle === 180 || r.angle === 0
                        || r.angle === -90 || r.angle === -180) {
                        continue;
                    }
                    for (var j = 0; j < rects.length; j++) {
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
                var rect2 = cv.minAreaRect(cnt);
                for (var i = 0; i < rects.length; i++) {
                    if (rects[i].size.width + rects[i].size.height > rect2.size.width + rect2.size.height
                        && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
                            || rects[i].angle === -90 || rects[i].angle === -180)) {
                        rect2 = rects[i];
                    }
                }
                console.log(rects);
                console.log('---------------------------------------------------------');
                console.log(cnt);
                console.log(rect2);
                /** @type {?} */
                var vertices = cv.RotatedRect.points(rect2);
                for (var i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * _this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * _this.imageResizeRatio;
                }
                console.log(vertices);
                /** @type {?} */
                var rect = cv.boundingRect(src);
                src.delete();
                hierarchy.delete();
                contours.delete();
                // transform the rectangle into a set of points
                Object.keys(rect).forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    rect[key] = rect[key] * _this.imageResizeRatio;
                }));
                /** @type {?} */
                var contourCoordinates;
                if (_this.config.useRotatedRectangle
                    && _this.pointsAreNotTheSame(vertices)) {
                    contourCoordinates = [
                        new PositionChangeData({ x: vertices[0].x, y: vertices[0].y }, ['left', 'top']),
                        new PositionChangeData({ x: vertices[1].x, y: vertices[1].y }, ['right', 'top']),
                        new PositionChangeData({ x: vertices[2].x, y: vertices[2].y }, ['right', 'bottom']),
                        new PositionChangeData({ x: vertices[3].x, y: vertices[3].y }, ['left', 'bottom']),
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
                _this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }), 30);
        }));
    };
    /**
     * @private
     * @param {?} vertices
     * @return {?}
     */
    NgxDocScannerComponent.prototype.pointsAreNotTheSame = /**
     * @private
     * @param {?} vertices
     * @return {?}
     */
    function (vertices) {
        return !(vertices[0].x === vertices[1].x && vertices[1].x === vertices[2].x && vertices[2].x === vertices[3].x &&
            vertices[0].y === vertices[1].y && vertices[1].y === vertices[2].y && vertices[2].y === vertices[3].y);
    };
    /**
     * apply perspective transform
     */
    /**
     * apply perspective transform
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.transform = /**
     * apply perspective transform
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                // create source coordinates matrix
                /** @type {?} */
                var sourceCoordinates = [
                    _this.getPoint(['top', 'left']),
                    _this.getPoint(['top', 'right']),
                    _this.getPoint(['bottom', 'right']),
                    _this.getPoint(['bottom', 'left'])
                ].map((/**
                 * @param {?} point
                 * @return {?}
                 */
                function (point) {
                    return [point.x / _this.imageResizeRatio, point.y / _this.imageResizeRatio];
                }));
                // get max width
                /** @type {?} */
                var bottomWidth = _this.getPoint(['bottom', 'right']).x - _this.getPoint(['bottom', 'left']).x;
                /** @type {?} */
                var topWidth = _this.getPoint(['top', 'right']).x - _this.getPoint(['top', 'left']).x;
                /** @type {?} */
                var maxWidth = Math.max(bottomWidth, topWidth) / _this.imageResizeRatio;
                // get max height
                /** @type {?} */
                var leftHeight = _this.getPoint(['bottom', 'left']).y - _this.getPoint(['top', 'left']).y;
                /** @type {?} */
                var rightHeight = _this.getPoint(['bottom', 'right']).y - _this.getPoint(['top', 'right']).y;
                /** @type {?} */
                var maxHeight = Math.max(leftHeight, rightHeight) / _this.imageResizeRatio;
                // create dest coordinates matrix
                /** @type {?} */
                var destCoordinates = [
                    [0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]
                ];
                // convert to open cv matrix objects
                /** @type {?} */
                var Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat.apply([], __spread(sourceCoordinates)));
                /** @type {?} */
                var Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat.apply([], __spread(destCoordinates)));
                /** @type {?} */
                var transformMatrix = cv.getPerspectiveTransform(Ms, Md);
                // set new image size
                /** @type {?} */
                var dsize = new cv.Size(maxWidth, maxHeight);
                // perform warp
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_CUBIC, cv.BORDER_CONSTANT, new cv.Scalar());
                cv.imshow(_this.editedImage, dst);
                dst.delete();
                Ms.delete();
                Md.delete();
                transformMatrix.delete();
                _this.setPreviewPaneDimensions(_this.editedImage);
                _this.showPreview().then((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    };
    /**
     * applies the selected filter to the image
     * @param preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     */
    /**
     * applies the selected filter to the image
     * @private
     * @param {?} preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     * @return {?}
     */
    NgxDocScannerComponent.prototype.applyFilter = /**
     * applies the selected filter to the image
     * @private
     * @param {?} preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     * @return {?}
     */
    function (preview) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var options, dst;
            var _this = this;
            return __generator(this, function (_a) {
                this.processing.emit(true);
                // default options
                options = {
                    blur: false,
                    th: true,
                    thMode: cv.ADAPTIVE_THRESH_MEAN_C,
                    thMeanCorrection: 10,
                    thBlockSize: 25,
                    thMax: 255,
                    grayScale: true,
                };
                dst = cv.imread(this.editedImage);
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
                function () { return __awaiter(_this, void 0, void 0, function () {
                    var ksize;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (options.grayScale) {
                                    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                                }
                                if (options.blur) {
                                    ksize = new cv.Size(5, 5);
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
                                return [4 /*yield*/, this.showPreview(dst)];
                            case 1:
                                _a.sent();
                                this.processing.emit(false);
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); }), 30);
                return [2 /*return*/];
            });
        }); }));
    };
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     */
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     * @private
     * @param {?} image
     * @return {?}
     */
    NgxDocScannerComponent.prototype.resize = /**
     * resize an image to fit constraints set in options.maxImageDimensions
     * @private
     * @param {?} image
     * @return {?}
     */
    function (image) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var src = cv.imread(image);
                /** @type {?} */
                var currentDimensions = {
                    width: src.size().width,
                    height: src.size().height
                };
                /** @type {?} */
                var resizeDimensions = {
                    width: 0,
                    height: 0
                };
                if (currentDimensions.width > _this.options.maxImageDimensions.width) {
                    resizeDimensions.width = _this.options.maxImageDimensions.width;
                    resizeDimensions.height = _this.options.maxImageDimensions.width / currentDimensions.width * currentDimensions.height;
                    if (resizeDimensions.height > _this.options.maxImageDimensions.height) {
                        resizeDimensions.height = _this.options.maxImageDimensions.height;
                        resizeDimensions.width = _this.options.maxImageDimensions.height / currentDimensions.height * currentDimensions.width;
                    }
                    /** @type {?} */
                    var dsize = new cv.Size(Math.floor(resizeDimensions.width), Math.floor(resizeDimensions.height));
                    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
                    /** @type {?} */
                    var resizeResult = (/** @type {?} */ (document.createElement('canvas')));
                    cv.imshow(resizeResult, src);
                    src.delete();
                    _this.processing.emit(false);
                    resolve(resizeResult);
                }
                else {
                    _this.processing.emit(false);
                    resolve(image);
                }
            }), 30);
        }));
    };
    /**
     * display a preview of the image on the preview canvas
     */
    /**
     * display a preview of the image on the preview canvas
     * @private
     * @param {?=} image
     * @return {?}
     */
    NgxDocScannerComponent.prototype.showPreview = /**
     * display a preview of the image on the preview canvas
     * @private
     * @param {?=} image
     * @return {?}
     */
    function (image) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            /** @type {?} */
            var src;
            if (image) {
                src = image;
            }
            else {
                src = cv.imread(_this.editedImage);
            }
            /** @type {?} */
            var dst = new cv.Mat();
            /** @type {?} */
            var dsize = new cv.Size(0, 0);
            cv.resize(src, dst, dsize, _this.imageResizeRatio, _this.imageResizeRatio, cv.INTER_AREA);
            cv.imshow(_this.previewCanvas.nativeElement, dst);
            src.delete();
            dst.delete();
            resolve();
        }));
    };
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     */
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     * @private
     * @param {?} img
     * @return {?}
     */
    NgxDocScannerComponent.prototype.setPreviewPaneDimensions = 
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     * @private
     * @param {?} img
     * @return {?}
     */
    function (img) {
        // set preview pane dimensions
        this.previewDimensions = this.calculateDimensions(img.width, img.height);
        this.previewCanvas.nativeElement.width = this.previewDimensions.width;
        this.previewCanvas.nativeElement.height = this.previewDimensions.height;
        this.imageResizeRatio = this.previewDimensions.width / img.width;
        this.imageDivStyle = {
            width: this.previewDimensions.width + this.options.cropToolDimensions.width + 'px',
            height: this.previewDimensions.height + this.options.cropToolDimensions.height + 'px',
            'margin-left': "calc((100% - " + (this.previewDimensions.width + 10) + "px) / 2 + " + this.options.cropToolDimensions.width / 2 + "px)",
            'margin-right': "calc((100% - " + (this.previewDimensions.width + 10) + "px) / 2 - " + this.options.cropToolDimensions.width / 2 + "px)",
        };
        this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
    };
    /**
     * calculate dimensions of the preview canvas
     */
    /**
     * calculate dimensions of the preview canvas
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    NgxDocScannerComponent.prototype.calculateDimensions = /**
     * calculate dimensions of the preview canvas
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    function (width, height) {
        /** @type {?} */
        var ratio = width / height;
        /** @type {?} */
        var maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
            this.maxPreviewWidth : this.screenDimensions.width - 40;
        /** @type {?} */
        var maxHeight = this.screenDimensions.height - 240;
        /** @type {?} */
        var calculated = {
            width: maxWidth,
            height: Math.round(maxWidth / ratio),
            ratio: ratio
        };
        if (calculated.height > maxHeight) {
            calculated.height = maxHeight;
            calculated.width = Math.round(maxHeight * ratio);
        }
        return calculated;
    };
    /**
     * returns a point by it's roles
     * @param roles - an array of roles by which the point will be fetched
     */
    /**
     * returns a point by it's roles
     * @private
     * @param {?} roles - an array of roles by which the point will be fetched
     * @return {?}
     */
    NgxDocScannerComponent.prototype.getPoint = /**
     * returns a point by it's roles
     * @private
     * @param {?} roles - an array of roles by which the point will be fetched
     * @return {?}
     */
    function (roles) {
        var _this = this;
        return this.points.find((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return _this.limitsService.compareArray(point.roles, roles);
        }));
    };
    NgxDocScannerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-doc-scanner',
                    template: "<div [ngStyle]=\"editorStyle\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n",
                    styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}.example-h2{margin-left:10px;margin-right:10px}.example-section{display:flex;flex-wrap:wrap;align-content:center;align-items:center}.example-margin{margin:8px}.example-width{max-width:180px;width:100%}.mat-mdc-slider{max-width:300px;width:100%}.mat-mdc-card+.mat-mdc-card{margin-top:8px}.example-result-card h2{margin:0 8px}.example-label-container{display:flex;justify-content:space-between;margin:20px 10px 0;max-width:284px}.example-result-card .example-value-label{font-weight:600}"]
                }] }
    ];
    /** @nocollapse */
    NgxDocScannerComponent.ctorParameters = function () { return [
        { type: NgxOpenCVService },
        { type: LimitsService },
        { type: MatBottomSheet }
    ]; };
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
    return NgxDocScannerComponent;
}());
export { NgxDocScannerComponent };
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
var /**
 * a class for generating configuration objects for the editor
 */
ImageEditorConfig = /** @class */ (function () {
    function ImageEditorConfig(options) {
        var _this = this;
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
        if (options) {
            Object.keys(options).forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                _this[key] = options[key];
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
    return ImageEditorConfig;
}());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxhQUFhLEVBQXVCLGtCQUFrQixFQUFhLE1BQU0sK0JBQStCLENBQUM7QUFDakgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBSWhGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUk1QztJQTRKRSxnQ0FBb0IsU0FBMkIsRUFBVSxhQUE0QixFQUFVLFdBQTJCO1FBQTFILGlCQXVCQztRQXZCbUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtRQXRKMUgsVUFBSyxHQUFHLENBQUMsQ0FBQzs7OztRQThDVixnQkFBVyxHQUFHLEtBQUssQ0FBQzs7OztRQUlwQixTQUFJLEdBQXFCLE1BQU0sQ0FBQzs7OztRQUl4QixtQkFBYyxHQUFHLFNBQVMsQ0FBQzs7OztRQVkzQixvQkFBZSxHQUFvQjtZQUN6QyxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQzs7Ozs7OztRQWdDUSxlQUFVLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7Ozs7UUFJOUQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDOzs7O1FBSTFELFVBQUssR0FB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SUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBdkZELElBdUZDOzs7Ozs7SUFuRkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBMkQ7Ozs7O0lBSTNELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBcUM7Ozs7O0lBSXJDLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQWlEOzs7OztJQUlqRCwrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGEsIFJvbGVzQXJyYXl9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtNYXRCb3R0b21TaGVldH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYm90dG9tLXNoZWV0JztcclxuaW1wb3J0IHtOZ3hGaWx0ZXJNZW51Q29tcG9uZW50fSBmcm9tICcuLi9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHtFZGl0b3JBY3Rpb25CdXR0b24sIFBvaW50T3B0aW9ucywgUG9pbnRTaGFwZX0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbi8vIGltcG9ydCB7Tmd4T3BlbkNWU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmd4LW9wZW5jdi5zZXJ2aWNlJztcclxuaW1wb3J0IHtEb2NTY2FubmVyQ29uZmlnLCBJbWFnZURpbWVuc2lvbnMsIE9wZW5DVlN0YXRlfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5cclxuZGVjbGFyZSB2YXIgY3Y6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRvYy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgdmFsdWUgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAqL1xyXG4gIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgQ09ORklHIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWRpdG9yQnV0dG9uczogQXJyYXk8RWRpdG9yQWN0aW9uQnV0dG9uPjtcclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBnZXQgZGlzcGxheWVkQnV0dG9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvckJ1dHRvbnMuZmlsdGVyKGJ1dHRvbiA9PiB7XHJcbiAgICAgIHJldHVybiBidXR0b24ubW9kZSA9PT0gdGhpcy5tb2RlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgbWF4UHJldmlld1dpZHRoOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXHJcbiAgICovXHJcbiAgaW1hZ2VEaXZTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgZGl2IHN0eWxlXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcblxyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgU1RBVEUgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc3RhdGUgb2Ygb3BlbmN2IGxvYWRpbmdcclxuICAgKi9cclxuICBwcml2YXRlIGN2U3RhdGU6IHN0cmluZztcclxuICAvKipcclxuICAgKiB0cnVlIGFmdGVyIHRoZSBpbWFnZSBpcyBsb2FkZWQgYW5kIHByZXZpZXcgaXMgZGlzcGxheWVkXHJcbiAgICovXHJcbiAgaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIG1vZGU6ICdjcm9wJyB8ICdjb2xvcicgPSAnY3JvcCc7XHJcbiAgLyoqXHJcbiAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRGaWx0ZXIgPSAnZGVmYXVsdCc7XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBPUEVSQVRJT04gVkFSSUFCTEVTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHZpZXdwb3J0IGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAwLFxyXG4gICAgaGVpZ2h0OiAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgKi9cclxuICBwcml2YXRlIG9yaWdpbmFsSW1hZ2U6IEZpbGU7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRlZEltYWdlOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICovXHJcbiAgQFZpZXdDaGlsZCgnUHJldmlld0NhbnZhcycsIHtyZWFkOiBFbGVtZW50UmVmfSkgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzOiBFbGVtZW50UmVmO1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBwcml2YXRlIHBvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRVZFTlQgRU1JVFRFUlMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICAvKipcclxuICAgKiBmaXJlcyBvbiBlZGl0IGNvbXBsZXRpb25cclxuICAgKi9cclxuICBAT3V0cHV0KCkgZWRpdFJlc3VsdDogRXZlbnRFbWl0dGVyPEJsb2I+ID0gbmV3IEV2ZW50RW1pdHRlcjxCbG9iPigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0aGUgbG9hZGluZyBzdGF0dXMgb2YgdGhlIGN2IG1vZHVsZS5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8vIElOUFVUUyAvL1xyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAqIEBwYXJhbSBmaWxlIC0gZmlsZSBmcm9tIGZvcm0gaW5wdXRcclxuICAgKi9cclxuICBASW5wdXQoKSBzZXQgZmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICBpZiAoZmlsZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gZmlsZTtcclxuICAgICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYXN5bmMgKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgICAgICAvLyByZWFkIGZpbGUgdG8gaW1hZ2UgJiBjYW52YXNcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRmlsZShmaWxlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICovXHJcbiAgQElucHV0KCkgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hPcGVuQ3Y6IE5neE9wZW5DVlNlcnZpY2UsIHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSwgcHJpdmF0ZSBib3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQpIHtcclxuICAgIHRoaXMuc2NyZWVuRGltZW5zaW9ucyA9IHtcclxuICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gc3RhdHVzIG9mIGN2IG1vZHVsZVxyXG4gICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgIHRoaXMuY3ZTdGF0ZSA9IGN2U3RhdGUuc3RhdGU7XHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdChjdlN0YXRlLnJlYWR5KTtcclxuICAgICAgaWYgKGN2U3RhdGUuZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKCdlcnJvciBsb2FkaW5nIGN2JykpO1xyXG4gICAgICB9IGVsc2UgaWYgKGN2U3RhdGUubG9hZGluZykge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBwb3NpdGlvbnMgb2YgY3JvcCB0b29sXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25zLnN1YnNjcmliZShwb2ludHMgPT4ge1xyXG4gICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmVkaXRvckJ1dHRvbnMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZXhpdCcsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV4aXRFZGl0b3IuZW1pdCgnY2FuY2VsZWQnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdhcnJvd19iYWNrJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY3JvcCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdyb3RhdGUnLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy5yb3RhdGVJbWFnZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIGljb246ICdyb3RhdGVfcmlnaHQnLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2RvbmVfY3JvcCcsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLmRvbmVDcm9wKCksXHJcbiAgICAgICAgaWNvbjogJ2RvbmUnLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2JhY2snLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy51bmRvKCksXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjb2xvcidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdmaWx0ZXInLFxyXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaG9vc2VGaWx0ZXJzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAncGhvdG9fZmlsdGVyJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiB0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUgPyAnY29sb3InIDogJ2Rpc2FibGVkJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3VwbG9hZCcsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLmV4cG9ydEltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ2Nsb3VkX3VwbG9hZCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBzZXQgb3B0aW9ucyBmcm9tIGNvbmZpZyBvYmplY3RcclxuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBJbWFnZUVkaXRvckNvbmZpZyh0aGlzLmNvbmZpZyk7XHJcbiAgICAvLyBzZXQgZXhwb3J0IGltYWdlIGljb25cclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgIGlmIChidXR0b24ubmFtZSA9PT0gJ3VwbG9hZCcpIHtcclxuICAgICAgICBidXR0b24uaWNvbiA9IHRoaXMub3B0aW9ucy5leHBvcnRJbWFnZUljb247XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld1dpZHRoO1xyXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHRoaXMub3B0aW9ucy5lZGl0b3JTdHlsZTtcclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gZWRpdG9yIGFjdGlvbiBidXR0b25zIG1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG5cclxuICAvKipcclxuICAgKiBlbWl0cyB0aGUgZXhpdEVkaXRvciBldmVudFxyXG4gICAqL1xyXG4gIGV4aXQoKSB7XHJcbiAgICB0aGlzLmV4aXRFZGl0b3IuZW1pdCgnY2FuY2VsZWQnKTtcclxuICB9XHJcblxyXG4gIGdldE1vZGUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLm1vZGU7XHJcbiAgfVxyXG5cclxuICBhc3luYyBkb25lQ3JvcCgpIHtcclxuICAgIHRoaXMubW9kZSA9ICdjb2xvcic7XHJcbiAgICBhd2FpdCB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICBhd2FpdCB0aGlzLmFwcGx5RmlsdGVyKHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdW5kbygpIHtcclxuICAgIHRoaXMubW9kZSA9ICdjcm9wJztcclxuICAgIHRoaXMubG9hZEZpbGUodGhpcy5vcmlnaW5hbEltYWdlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciwgYW5kIHdoZW4gZG9uZSBlbWl0cyB0aGUgcmVzdWx0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGFzeW5jIGV4cG9ydEltYWdlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKVxyXG4gICAgICAudGhlbihyZXNpemVSZXN1bHQgPT4ge1xyXG4gICAgICAgIHJlc2l6ZVJlc3VsdC50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH0sIHRoaXMub3JpZ2luYWxJbWFnZS50eXBlKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVkaXRlZEltYWdlLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfSwgdGhpcy5vcmlnaW5hbEltYWdlLnR5cGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcclxuICAgKi9cclxuICBwcml2YXRlIGNob29zZUZpbHRlcnMoKSB7XHJcbiAgICBjb25zdCBkYXRhID0ge2ZpbHRlcjogdGhpcy5zZWxlY3RlZEZpbHRlcn07XHJcbiAgICBjb25zdCBib3R0b21TaGVldFJlZiA9IHRoaXMuYm90dG9tU2hlZXQub3BlbihOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LCB7XHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pO1xyXG4gICAgYm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gZGF0YS5maWx0ZXI7XHJcbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBGaWxlIElucHV0ICYgT3V0cHV0IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBsb2FkIGltYWdlIGZyb20gaW5wdXQgZmllbGRcclxuICAgKi9cclxuICBwcml2YXRlIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZEltYWdlKGZpbGUpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IHBhbmUgbGltaXRzXHJcbiAgICAgIC8vIHNob3cgcG9pbnRzXHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSB0cnVlO1xyXG4gICAgICBhd2FpdCB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0Q29udG91cnMoKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAxNSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlYWQgaW1hZ2UgZnJvbSBGaWxlIG9iamVjdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZEltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBpbWFnZVNyYztcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpbWFnZVNyYyA9IGF3YWl0IHJlYWRGaWxlKCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBpbWcub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIHNldCBlZGl0ZWQgaW1hZ2UgY2FudmFzIGFuZCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLndpZHRoID0gaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLmVkaXRlZEltYWdlLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgICAgIC8vIHJlc2l6ZSBpbWFnZSBpZiBsYXJnZXIgdGhhbiBtYXggaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gaW1nLndpZHRoID4gaW1nLmhlaWdodCA/IGltZy5oZWlnaHQgOiBpbWcud2lkdGg7XHJcbiAgICAgICAgaWYgKHdpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IGF3YWl0IHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy53aWR0aCA9IHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBpbWcuc3JjID0gaW1hZ2VTcmM7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgZmlsZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlYWRGaWxlKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKGVycikgPT4ge1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBJbWFnZSBQcm9jZXNzaW5nIE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiByb3RhdGUgaW1hZ2UgOTAgZGVncmVlc1xyXG4gICAqL1xyXG4gIHJvdGF0ZUltYWdlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICAvLyBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgICAgY3YudHJhbnNwb3NlKGRzdCwgZHN0KTtcclxuICAgICAgICBjdi5mbGlwKGRzdCwgZHN0LCAxKTtcclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuICAgICAgICAvLyBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIC8vIHNhdmUgY3VycmVudCBwcmV2aWV3IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uc1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyA9IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyk7XHJcbiAgICAgICAgY29uc3QgaW5pdGlhbFBvc2l0aW9ucyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMpO1xyXG4gICAgICAgIC8vIGdldCBuZXcgZGltZW5zaW9uc1xyXG4gICAgICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICAvLyBnZXQgcHJldmlldyBwYW5lIHJlc2l6ZSByYXRpb1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXdSZXNpemVSYXRpb3MgPSB7XHJcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBzZXQgbmV3IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcblxyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgZGV0ZWN0Q29udG91cnMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gbG9hZCB0aGUgaW1hZ2UgYW5kIGNvbXB1dGUgdGhlIHJhdGlvIG9mIHRoZSBvbGQgaGVpZ2h0IHRvIHRoZSBuZXcgaGVpZ2h0LCBjbG9uZSBpdCwgYW5kIHJlc2l6ZSBpdFxyXG4gICAgICAgIGNvbnN0IHByb2Nlc3NpbmdSZXNpemVSYXRpbyA9IDAuNTtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuTWF0Lnplcm9zKHNyYy5yb3dzLCBzcmMuY29scywgY3YuQ1ZfOFVDMyk7XHJcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShzcmMucm93cyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbywgc3JjLmNvbHMgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8pO1xyXG4gICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgLy8gY29udmVydCB0aGUgaW1hZ2UgdG8gZ3JheXNjYWxlLCBibHVyIGl0LCBhbmQgZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2VcclxuICAgICAgICBjdi5jdnRDb2xvcihzcmMsIHNyYywgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICBjdi5HYXVzc2lhbkJsdXIoc3JjLCBzcmMsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgY3YuQ2Fubnkoc3JjLCBzcmMsIDc1LCAyMDApO1xyXG4gICAgICAgIC8vIGZpbmQgY29udG91cnNcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgICAgY3YudGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaCwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9tZWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfZ2F1c3NpYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XHJcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LmZpbmRDb250b3VycyhzcmMsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xyXG4gICAgICAgIGNvbnN0IGNudCA9IGNvbnRvdXJzLmdldCg0KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLVVOSVFVRSBSRUNUQU5HTEVTIEZST00gQUxMIENPTlRPVVJTLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnN0IHJlY3RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgY24gPSBjb250b3Vycy5nZXQoaSk7XHJcbiAgICAgICAgICBjb25zdCByID0gY3YubWluQXJlYVJlY3QoY24pO1xyXG4gICAgICAgICAgbGV0IGFkZCA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoci5zaXplLmhlaWdodCA8IDUwIHx8IHIuc2l6ZS53aWR0aCA8IDUwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IDkwIHx8IHIuYW5nbGUgPT09IDE4MCB8fCByLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IC05MCB8fCByLmFuZ2xlID09PSAtMTgwXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgcmVjdHNbal0uYW5nbGUgPT09IHIuYW5nbGVcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5jZW50ZXIueCA9PT0gci5jZW50ZXIueCAmJiByZWN0c1tqXS5jZW50ZXIueSA9PT0gci5jZW50ZXIueVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLnNpemUud2lkdGggPT09IHIuc2l6ZS53aWR0aCAmJiByZWN0c1tqXS5zaXplLmhlaWdodCA9PT0gci5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgcmVjdHMucHVzaChyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZWN0MiA9IGN2Lm1pbkFyZWFSZWN0KGNudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHJlY3RzW2ldLnNpemUud2lkdGggKyByZWN0c1tpXS5zaXplLmhlaWdodCA+IHJlY3QyLnNpemUud2lkdGggKyByZWN0Mi5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICAmJiAhKHJlY3RzW2ldLmFuZ2xlID09PSA5MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMTgwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgICAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC05MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gLTE4MClcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZWN0MiA9IHJlY3RzW2ldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhyZWN0cyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlY3QyKTtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0Mik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS54ID0gdmVydGljZXNbaV0ueCAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAgIHZlcnRpY2VzW2ldLnkgPSB2ZXJ0aWNlc1tpXS55ICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codmVydGljZXMpO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gY3YuYm91bmRpbmdSZWN0KHNyYyk7XHJcblxyXG4gICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICBoaWVyYXJjaHkuZGVsZXRlKCk7XHJcbiAgICAgICAgY29udG91cnMuZGVsZXRlKCk7XHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRoZSByZWN0YW5nbGUgaW50byBhIHNldCBvZiBwb2ludHNcclxuICAgICAgICBPYmplY3Qua2V5cyhyZWN0KS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICByZWN0W2tleV0gPSByZWN0W2tleV0gKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb250b3VyQ29vcmRpbmF0ZXM7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnVzZVJvdGF0ZWRSZWN0YW5nbGVcclxuICAgICAgICAgICYmIHRoaXMucG9pbnRzQXJlTm90VGhlU2FtZSh2ZXJ0aWNlcylcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMF0ueCwgeTogdmVydGljZXNbMF0ueX0sIFsnbGVmdCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzFdLngsIHk6IHZlcnRpY2VzWzFdLnl9LCBbJ3JpZ2h0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMl0ueCwgeTogdmVydGljZXNbMl0ueX0sIFsncmlnaHQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1szXS54LCB5OiB2ZXJ0aWNlc1szXS55fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0Lnl9LCBbJ2xlZnQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0Lnl9LCBbJ3JpZ2h0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ3JpZ2h0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsnbGVmdCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uUG9pbnRzKGNvbnRvdXJDb29yZGluYXRlcyk7XHJcbiAgICAgICAgLy8gdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEodmVydGljZXNbMF0ueCA9PT0gdmVydGljZXNbMV0ueCAmJiB2ZXJ0aWNlc1sxXS54ID09PSB2ZXJ0aWNlc1syXS54ICYmIHZlcnRpY2VzWzJdLnggPT09IHZlcnRpY2VzWzNdLnggJiZcclxuICAgICAgdmVydGljZXNbMF0ueSA9PT0gdmVydGljZXNbMV0ueSAmJiB2ZXJ0aWNlc1sxXS55ID09PSB2ZXJ0aWNlc1syXS55ICYmIHZlcnRpY2VzWzJdLnkgPT09IHZlcnRpY2VzWzNdLnkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgc291cmNlIGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcclxuICAgICAgICBdLm1hcChwb2ludCA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gW3BvaW50LnggLyB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHBvaW50LnkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW9dO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBnZXQgbWF4IHdpZHRoXHJcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCB0b3BXaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoYm90dG9tV2lkdGgsIHRvcFdpZHRoKSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxyXG4gICAgICAgIGNvbnN0IGxlZnRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS55O1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS55O1xyXG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBjcmVhdGUgZGVzdCBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBkZXN0Q29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIG1heEhlaWdodCAtIDFdLFxyXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXHJcbiAgICAgICAgY29uc3QgTXMgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5zb3VyY2VDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IE1kID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uZGVzdENvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcclxuICAgICAgICAvLyBzZXQgbmV3IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKG1heFdpZHRoLCBtYXhIZWlnaHQpO1xyXG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxyXG4gICAgICAgIGN2LndhcnBQZXJzcGVjdGl2ZShkc3QsIGRzdCwgdHJhbnNmb3JtTWF0cml4LCBkc2l6ZSwgY3YuSU5URVJfQ1VCSUMsIGN2LkJPUkRFUl9DT05TVEFOVCwgbmV3IGN2LlNjYWxhcigpKTtcclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuXHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIE1zLmRlbGV0ZSgpO1xyXG4gICAgICAgIE1kLmRlbGV0ZSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdHJpeC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciB0byB0aGUgaW1hZ2VcclxuICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAqIHdoZW4gZmFsc2UsIHdpbGwgYXBwbHkgdG8gZWRpdGVkSW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGFwcGx5RmlsdGVyKHByZXZpZXc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBibHVyOiBmYWxzZSxcclxuICAgICAgICB0aDogdHJ1ZSxcclxuICAgICAgICB0aE1vZGU6IGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgdGhNZWFuQ29ycmVjdGlvbjogMTAsXHJcbiAgICAgICAgdGhCbG9ja1NpemU6IDI1LFxyXG4gICAgICAgIHRoTWF4OiAyNTUsXHJcbiAgICAgICAgZ3JheVNjYWxlOiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSAnb3JpZ2luYWwnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0ZWRGaWx0ZXIpIHtcclxuICAgICAgICBjYXNlICdvcmlnaW5hbCc6XHJcbiAgICAgICAgICBvcHRpb25zLnRoID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdtYWdpY19jb2xvcic6XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYncyJzpcclxuICAgICAgICAgIG9wdGlvbnMudGhNb2RlID0gY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0M7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIG9wdGlvbnMudGhCbG9ja1NpemUgPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Myc6XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSB0cnVlO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICBjdi5jdnRDb2xvcihkc3QsIGRzdCwgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuYmx1cikge1xyXG4gICAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAgIGN2LkdhdXNzaWFuQmx1cihkc3QsIGRzdCwga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGgpIHtcclxuICAgICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChkc3QsIGRzdCwgb3B0aW9ucy50aE1heCwgb3B0aW9ucy50aE1vZGUsIGN2LlRIUkVTSF9CSU5BUlksIG9wdGlvbnMudGhCbG9ja1NpemUsIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkc3QuY29udmVydFRvKGRzdCwgLTEsIDEsIDYwKTtcclxuICAgICAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxNzAsIDI1NSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJldmlldykge1xyXG4gICAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoZHN0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlc2l6ZSBhbiBpbWFnZSB0byBmaXQgY29uc3RyYWludHMgc2V0IGluIG9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXNpemUoaW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50KTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZChpbWFnZSk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogc3JjLnNpemUoKS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3JjLnNpemUoKS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGN1cnJlbnREaW1lbnNpb25zLndpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGggLyBjdXJyZW50RGltZW5zaW9ucy53aWR0aCAqIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgIGlmIChyZXNpemVEaW1lbnNpb25zLmhlaWdodCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCAvIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCAqIGN1cnJlbnREaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMud2lkdGgpLCBNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0KSk7XHJcbiAgICAgICAgICBjdi5yZXNpemUoc3JjLCBzcmMsIGRzaXplLCAwLCAwLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZVJlc3VsdCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgIGN2Lmltc2hvdyhyZXNpemVSZXN1bHQsIHNyYyk7XHJcbiAgICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc2l6ZVJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgaW1hZ2Ugb24gdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93UHJldmlldyhpbWFnZT86IGFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHNyYztcclxuICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgc3JjID0gaW1hZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZSgwLCAwKTtcclxuICAgICAgY3YucmVzaXplKHNyYywgZHN0LCBkc2l6ZSwgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICBjdi5pbXNob3codGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQsIGRzdCk7XHJcbiAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIFV0aWxpdHkgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBwcmV2aWV3IGNhbnZhcyBkaW1lbnNpb25zIGFjY29yZGluZyB0byB0aGUgY2FudmFzIGVsZW1lbnQgb2YgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRQcmV2aWV3UGFuZURpbWVuc2lvbnMoaW1nOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgLy8gc2V0IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICB0aGlzLnByZXZpZXdEaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGg7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMuaW1hZ2VSZXNpemVSYXRpbyA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmltYWdlRGl2U3R5bGUgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCArICdweCcsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLmhlaWdodCArICdweCcsXHJcbiAgICAgICdtYXJnaW4tbGVmdCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiArICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgICAgJ21hcmdpbi1yaWdodCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiAtICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgIH07XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyByYXRpbzogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgcmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcclxuXHJcbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCA+IHRoaXMubWF4UHJldmlld1dpZHRoID9cclxuICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggLSA0MDtcclxuICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy5oZWlnaHQgLSAyNDA7XHJcbiAgICBjb25zdCBjYWxjdWxhdGVkID0ge1xyXG4gICAgICB3aWR0aDogbWF4V2lkdGgsXHJcbiAgICAgIGhlaWdodDogTWF0aC5yb3VuZChtYXhXaWR0aCAvIHJhdGlvKSxcclxuICAgICAgcmF0aW86IHJhdGlvXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChjYWxjdWxhdGVkLmhlaWdodCA+IG1heEhlaWdodCkge1xyXG4gICAgICBjYWxjdWxhdGVkLmhlaWdodCA9IG1heEhlaWdodDtcclxuICAgICAgY2FsY3VsYXRlZC53aWR0aCA9IE1hdGgucm91bmQobWF4SGVpZ2h0ICogcmF0aW8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhbGN1bGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBvaW50KHJvbGVzOiBSb2xlc0FycmF5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb2ludHMuZmluZChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbWl0c1NlcnZpY2UuY29tcGFyZUFycmF5KHBvaW50LnJvbGVzLCByb2xlcyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhIGNsYXNzIGZvciBnZW5lcmF0aW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmb3IgdGhlIGVkaXRvclxyXG4gKi9cclxuY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAvKipcclxuICAgKiBtYXggZGltZW5zaW9ucyBvZiBvcHV0cHV0IGltYWdlLiBpZiBzZXQgdG8gemVyb1xyXG4gICAqL1xyXG4gIG1heEltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDMwMDAwLFxyXG4gICAgaGVpZ2h0OiAzMDAwMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yQmFja2dyb3VuZENvbG9yID0gJyNmZWZlZmUnO1xyXG4gIC8qKlxyXG4gICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yRGltZW5zaW9uczogeyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgfSA9IHtcclxuICAgIHdpZHRoOiAnMTAwdncnLFxyXG4gICAgaGVpZ2h0OiAnMTAwdmgnXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGV4dHJhQ3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICB0b3A6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogbWF0ZXJpYWwgZGVzaWduIHRoZW1lIGNvbG9yIG5hbWVcclxuICAgKi9cclxuICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JyA9ICdhY2NlbnQnO1xyXG4gIC8qKlxyXG4gICAqIGljb24gZm9yIHRoZSBidXR0b24gdGhhdCBjb21wbGV0ZXMgdGhlIGVkaXRpbmcgYW5kIGVtaXRzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBleHBvcnRJbWFnZUljb24gPSAnY2xvdWRfdXBsb2FkJztcclxuICAvKipcclxuICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xDb2xvciA9ICcjRkYzMzMzJztcclxuICAvKipcclxuICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sLCBjYW4gYmUgZWl0aGVyIGEgcmVjdGFuZ2xlIG9yIGEgY2lyY2xlXHJcbiAgICovXHJcbiAgY3JvcFRvb2xTaGFwZTogUG9pbnRTaGFwZSA9ICdjaXJjbGUnO1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDEwLFxyXG4gICAgaGVpZ2h0OiAxMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHBvaW50IGF0dHJpYnV0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHBvaW50T3B0aW9uczogUG9pbnRPcHRpb25zO1xyXG4gIC8qKlxyXG4gICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgZWRpdG9yIHN0eWxlIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBlZGl0b3JTdHlsZT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogY3JvcCB0b29sIG91dGxpbmUgd2lkdGhcclxuICAgKi9cclxuICBjcm9wVG9vbExpbmVXZWlnaHQgPSAzO1xyXG4gIC8qKlxyXG4gICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld1dpZHRoID0gODAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBEb2NTY2FubmVyQ29uZmlnKSB7XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVkaXRvclN0eWxlID0geydiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5lZGl0b3JCYWNrZ3JvdW5kQ29sb3J9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmVkaXRvckRpbWVuc2lvbnMpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmV4dHJhQ3NzKTtcclxuXHJcbiAgICB0aGlzLnBvaW50T3B0aW9ucyA9IHtcclxuICAgICAgc2hhcGU6IHRoaXMuY3JvcFRvb2xTaGFwZSxcclxuICAgICAgY29sb3I6IHRoaXMuY3JvcFRvb2xDb2xvcixcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wb2ludE9wdGlvbnMsIHRoaXMuY3JvcFRvb2xEaW1lbnNpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==