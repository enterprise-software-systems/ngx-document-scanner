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
    /**
     * @param {?} changes
     * @return {?}
     */
    NgxDocScannerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.config) {
            if (changes.config.currentValue.thresholdInfo.thresh !== changes.config.previousValue.thresholdInfo.thresh) {
                this.loadFile(this.originalImage);
            }
            /** @type {?} */
            var updatePreview = false;
            if (changes.config.currentValue.maxPreviewWidth !== changes.config.previousValue.maxPreviewWidth) {
                this.maxPreviewWidth = changes.config.currentValue.maxPreviewWidth;
                updatePreview = true;
            }
            if (changes.config.currentValue.extraCss !== changes.config.previousValue.extraCss) {
                Object.assign(this.editorStyle, changes.config.currentValue.extraCss);
                updatePreview = true;
            }
            if (updatePreview) {
                this.doubleRotate();
            }
        }
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
     * @param {?=} clockwise
     * @return {?}
     */
    NgxDocScannerComponent.prototype.rotateImage = 
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @param {?=} clockwise
     * @return {?}
     */
    function (clockwise) {
        var _this = this;
        if (clockwise === void 0) { clockwise = true; }
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
                _this.rotate(clockwise);
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
     * @return {?}
     */
    NgxDocScannerComponent.prototype.doubleRotate = /**
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
                _this.rotate(true);
                _this.rotate(false);
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
     * @param {?=} clockwise
     * @return {?}
     */
    NgxDocScannerComponent.prototype.rotate = /**
     * @param {?=} clockwise
     * @return {?}
     */
    function (clockwise) {
        if (clockwise === void 0) { clockwise = true; }
        /** @type {?} */
        var dst = cv.imread(this.editedImage);
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
        var initialPreviewDimensions = { width: 0, height: 0 };
        Object.assign(initialPreviewDimensions, this.previewDimensions);
        /** @type {?} */
        var initialPositions = Array.from(this.points);
        // get new dimensions
        // set new preview pane dimensions
        this.setPreviewPaneDimensions(this.editedImage);
        // get preview pane resize ratio
        /** @type {?} */
        var previewResizeRatios = {
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
                // cv.Canny(src, src, 75, 200);
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
                console.log(contours);
                // console.log('----------UNIQUE RECTANGLES FROM ALL CONTOURS----------');
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
                var vertices = cv.RotatedRect.points(rect2);
                // console.log(vertices);
                for (var i = 0; i < 4; i++) {
                    vertices[i].x = vertices[i].x * _this.imageResizeRatio;
                    vertices[i].y = vertices[i].y * _this.imageResizeRatio;
                }
                // console.log(vertices);
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
                /** @type {?} */
                var firstRoles = [_this.isTop(vertices[0], [vertices[1], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                var secondRoles = [_this.isTop(vertices[1], [vertices[0], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                var thirdRoles = [_this.isTop(vertices[2], [vertices[0], vertices[1], vertices[3]]) ? 'top' : 'bottom'];
                /** @type {?} */
                var fourthRoles = [_this.isTop(vertices[3], [vertices[0], vertices[2], vertices[1]]) ? 'top' : 'bottom'];
                /** @type {?} */
                var roles = [firstRoles, secondRoles, thirdRoles, fourthRoles];
                /** @type {?} */
                var ts = [];
                /** @type {?} */
                var bs = [];
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i][0] === 'top') {
                        ts.push(i);
                    }
                    else {
                        bs.push(i);
                    }
                }
                // console.log(ts);
                // console.log(bs);
                if (_this.isLeft(vertices[ts[0]], vertices[ts[1]])) {
                    roles[ts[0]].push('left');
                    roles[ts[1]].push('right');
                }
                else {
                    roles[ts[1]].push('right');
                    roles[ts[0]].push('left');
                }
                if (_this.isLeft(vertices[bs[0]], vertices[bs[1]])) {
                    roles[bs[0]].push('left');
                    roles[bs[1]].push('right');
                }
                else {
                    roles[bs[1]].push('left');
                    roles[bs[0]].push('right');
                }
                // console.log(roles);
                if (_this.config.useRotatedRectangle
                    && _this.pointsAreNotTheSame(vertices)) {
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
                _this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }), 30);
        }));
    };
    /**
     * @param {?} coordinate
     * @param {?} otherVertices
     * @return {?}
     */
    NgxDocScannerComponent.prototype.isTop = /**
     * @param {?} coordinate
     * @param {?} otherVertices
     * @return {?}
     */
    function (coordinate, otherVertices) {
        /** @type {?} */
        var count = 0;
        for (var i = 0; i < otherVertices.length; i++) {
            if (coordinate.y < otherVertices[i].y) {
                count++;
            }
        }
        return count >= 2;
    };
    /**
     * @param {?} coordinate
     * @param {?} secondCoordinate
     * @return {?}
     */
    NgxDocScannerComponent.prototype.isLeft = /**
     * @param {?} coordinate
     * @param {?} secondCoordinate
     * @return {?}
     */
    function (coordinate, secondCoordinate) {
        return coordinate.x < secondCoordinate.x;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBSTVDO0lBMkpFLGdDQUFvQixTQUEyQixFQUFVLGFBQTRCLEVBQVUsV0FBMkI7UUFBMUgsaUJBdUJDO1FBdkJtQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBckoxSCxVQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O1FBOENWLGdCQUFXLEdBQUcsS0FBSyxDQUFDOzs7O1FBSXBCLFNBQUksR0FBcUIsTUFBTSxDQUFDOzs7O1FBSXhCLG1CQUFjLEdBQUcsU0FBUyxDQUFDOzs7O1FBWTNCLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDOzs7Ozs7O1FBZ0NRLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQzs7OztRQUk5RCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7Ozs7UUFJMUQsVUFBSyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDOzs7O1FBSW5ELFVBQUssR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQzs7OztRQUkzRCxlQUFVLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFpQ3hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN0QixLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7WUFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1NBQzNCLENBQUM7UUFFRixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUzs7OztRQUFDLFVBQUMsT0FBb0I7WUFDcEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzFCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVCO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDeEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQSxNQUFNO1lBQzNDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQTNKRCxzQkFBSSxvREFBZ0I7UUFIcEI7O1dBRUc7Ozs7O1FBQ0g7WUFBQSxpQkFJQztZQUhDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNOzs7O1lBQUMsVUFBQSxNQUFNO2dCQUNyQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLElBQUksQ0FBQztZQUNuQyxDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBeUdELHNCQUFhLHdDQUFJO1FBUGpCLFlBQVk7UUFDWixZQUFZO1FBQ1osWUFBWTtRQUNaOzs7V0FHRzs7Ozs7Ozs7OztRQUNILFVBQWtCLElBQVU7WUFBNUIsaUJBZ0JDO1lBZkMsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsVUFBVTs7O2dCQUFDO29CQUNULEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTOzs7O2dCQUM5QixVQUFPLE9BQW9COzs7O3FDQUNyQixPQUFPLENBQUMsS0FBSyxFQUFiLHdCQUFhO2dDQUNmLDhCQUE4QjtnQ0FDOUIscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQTs7Z0NBRHpCLDhCQUE4QjtnQ0FDOUIsU0FBeUIsQ0FBQztnQ0FDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O3FCQUUvQixFQUFDLENBQUM7YUFDTjtRQUNILENBQUM7OztPQUFBOzs7O0lBZ0NELHlDQUFROzs7SUFBUjtRQUFBLGlCQThEQztRQTdEQyxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU07OztnQkFBRTtvQkFDTixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFBO2dCQUNELElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbkIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNOzs7Z0JBQUU7b0JBQ04sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTt3QkFDNUIsT0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7cUJBQzdCO2dCQUNILENBQUMsQ0FBQTtnQkFDRCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVU7YUFDdEQ7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLE9BQU87YUFDZDtTQUNGLENBQUM7UUFFRixpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxNQUFNO1lBQy9CLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDNUM7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUM5QyxDQUFDOzs7OztJQUVELDRDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ25DOztnQkFDRyxhQUFhLEdBQUcsS0FBSztZQUN6QixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUU7Z0JBQ2hHLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO2dCQUNuRSxhQUFhLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO2dCQUNsRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RFLGFBQWEsR0FBRyxJQUFJLENBQUM7YUFDdEI7WUFDRCxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3JCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFFbkM7O09BRUc7Ozs7Ozs7O0lBQ0gscUNBQUk7Ozs7Ozs7O0lBQUo7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsd0NBQU87OztJQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFSyx5Q0FBUTs7O0lBQWQ7Ozs7O3dCQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3dCQUNwQixxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzZCQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBeEIsd0JBQXdCO3dCQUMxQixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBNUIsU0FBNEIsQ0FBQzs7Ozs7O0tBRWhDOzs7O0lBRUQscUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDVyw0Q0FBVzs7Ozs7SUFBekI7Ozs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDO3dCQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7NEJBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQ0FDNUIsSUFBSTs7Ozs0QkFBQyxVQUFBLFlBQVk7Z0NBQ2hCLFlBQVksQ0FBQyxNQUFNOzs7O2dDQUFDLFVBQUMsSUFBSTtvQ0FDdkIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUM5QixDQUFDLEdBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDOUIsQ0FBQyxFQUFDLENBQUM7eUJBQ0o7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7OzRCQUFDLFVBQUMsSUFBSTtnQ0FDM0IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUM5QixDQUFDLEdBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDN0I7Ozs7O0tBQ0Y7SUFFRDs7T0FFRzs7Ozs7O0lBQ0ssOENBQWE7Ozs7O0lBQXJCO1FBQUEsaUJBVUM7O1lBVE8sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUM7O1lBQ3BDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFDRixjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUzs7O1FBQUM7WUFDeEMsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsQ0FBQyxFQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakM7O09BRUc7Ozs7Ozs7Ozs7SUFDSyx5Q0FBUTs7Ozs7Ozs7OztJQUFoQixVQUFpQixJQUFVO1FBQTNCLGlCQXlCQztRQXhCQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFPLE9BQU8sRUFBRSxNQUFNOzs7Ozs7d0JBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O3dCQUV6QixxQkFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzs7Ozt3QkFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozt3QkFHaEMscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzt3QkFBeEIsU0FBd0IsQ0FBQzs7Ozt3QkFFekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7O3dCQUVsQyxrQkFBa0I7d0JBQ2xCLGNBQWM7d0JBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUE7O3dCQUF4SCxTQUF3SCxDQUFDO3dCQUN6SCxVQUFVOzs7d0JBQUM7Ozs0Q0FDVCxxQkFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dDQUEzQixTQUEyQixDQUFDO3dDQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3Q0FDNUIsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsR0FBRSxFQUFFLENBQUMsQ0FBQzs7OzthQUNSLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRzs7Ozs7OztJQUNLLDBDQUFTOzs7Ozs7SUFBakIsVUFBa0IsSUFBVTtRQUE1QixpQkE0Q0M7UUEzQ0MsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7Ozs7Ozt3QkFHMUIscUJBQU0sUUFBUSxFQUFFLEVBQUE7O3dCQUEzQixRQUFRLEdBQUcsU0FBZ0IsQ0FBQzs7Ozt3QkFFNUIsTUFBTSxDQUFDLEtBQUcsQ0FBQyxDQUFDOzs7d0JBRVIsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO3dCQUN2QixHQUFHLENBQUMsTUFBTTs7O3dCQUFHOzs7Ozt3Q0FDWCx5Q0FBeUM7d0NBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUEsQ0FBQzt3Q0FDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzt3Q0FDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3Q0FDL0IsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzt3Q0FDN0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzt3Q0FFbkIsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUs7NkNBQ3pELENBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFBLEVBQTdDLHdCQUE2Qzt3Q0FDL0MsS0FBQSxJQUFJLENBQUE7d0NBQWUscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUE7O3dDQUF0RCxHQUFLLFdBQVcsR0FBRyxTQUFtQyxDQUFDOzs7d0NBRXpELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO3dDQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzt3Q0FDdEQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3Q0FDaEQsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsQ0FBQSxDQUFDO3dCQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDOzs7O2FBQ3BCLEVBQUMsQ0FBQzs7Ozs7UUFLSCxTQUFTLFFBQVE7WUFDZixPQUFPLElBQUksT0FBTzs7Ozs7WUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOztvQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsTUFBTTs7OztnQkFBRyxVQUFDLEtBQUs7b0JBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPOzs7O2dCQUFHLFVBQUMsR0FBRztvQkFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVELDhCQUE4QjtJQUM5Qiw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCOztPQUVHOzs7Ozs7Ozs7SUFDSCw0Q0FBVzs7Ozs7Ozs7O0lBQVgsVUFBWSxTQUFnQjtRQUE1QixpQkFZQztRQVpXLDBCQUFBLEVBQUEsZ0JBQWdCO1FBQzFCLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsVUFBVTs7O1lBQUM7Z0JBQ1QsS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFdkIsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUk7OztnQkFBQztvQkFDdEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUMsRUFBQyxDQUFDO1lBQ0wsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsNkNBQVk7OztJQUFaO1FBQUEsaUJBWUM7UUFYQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLFVBQVU7OztZQUFDO2dCQUNULEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJOzs7Z0JBQUM7b0JBQ3RCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLEVBQUMsQ0FBQztZQUNMLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCx1Q0FBTTs7OztJQUFOLFVBQU8sU0FBZ0I7UUFBaEIsMEJBQUEsRUFBQSxnQkFBZ0I7O1lBQ2YsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN2Qyw0QkFBNEI7UUFDNUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxTQUFTLEVBQUU7WUFDYixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN0QjtRQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqQyxnQkFBZ0I7UUFDaEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7WUFFUCx3QkFBd0IsR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztRQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztZQUMxRCxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDaEQscUJBQXFCO1FBQ3JCLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7WUFFMUMsbUJBQW1CLEdBQUc7WUFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsd0JBQXdCLENBQUMsS0FBSztZQUNwRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyx3QkFBd0IsQ0FBQyxNQUFNO1NBQ3hFO1FBQ0Qsa0NBQWtDO1FBRWxDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUNyRzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pHO0lBQ0gsQ0FBQztJQUVEOztRQUVJOzs7Ozs7O0lBQ0ksK0NBQWM7Ozs7OztJQUF0QjtRQUFBLGlCQXdLQztRQXZLQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLFVBQVU7OztZQUFDOzs7b0JBRUgscUJBQXFCLEdBQUcsR0FBRzs7b0JBQzNCLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUM7O29CQUNqQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7O29CQUNsRCxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQzs7b0JBQ3ZGLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0IsdUVBQXVFO2dCQUN2RSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDMUQsK0JBQStCO2dCQUMvQixnQkFBZ0I7Z0JBRWhCLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBRTtvQkFDMUQsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoSDtxQkFBTSxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsS0FBSyxlQUFlLEVBQUU7b0JBQ3RFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsc0JBQXNCLEVBQzFGLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2RjtxQkFBTSxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsS0FBSyxtQkFBbUIsRUFBRTtvQkFDMUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQywwQkFBMEIsRUFDOUYsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZGOztvQkFFSyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFOztvQkFDN0IsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztvQkFDM0UsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7b0JBRWhCLEtBQUssR0FBRyxFQUFFO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFOzt3QkFDbEMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzt3QkFDcEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDOzt3QkFDeEIsR0FBRyxHQUFHLElBQUk7b0JBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTsyQkFDdEMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDOzJCQUNsRCxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQ3RDO3dCQUNBLFNBQVM7cUJBQ1Y7b0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3JDLElBQ0UsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSzsrQkFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOytCQUNwRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDakY7NEJBQ0EsR0FBRyxHQUFHLEtBQUssQ0FBQzs0QkFDWixNQUFNO3lCQUNQO3FCQUNGO29CQUVELElBQUksR0FBRyxFQUFFO3dCQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2Y7aUJBQ0Y7O29CQUVHLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztnQkFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JDLDZDQUE2QztvQkFDN0MsMEJBQTBCO29CQUMxQix1Q0FBdUM7b0JBQ3ZDLG9DQUFvQztvQkFDcEMseUJBQXlCO29CQUN6QixhQUFhO29CQUNiLE1BQU07b0JBQ04sSUFBSTtvQkFDSixvQkFBb0I7b0JBQ3BCLGNBQWM7b0JBQ2QsSUFBSTtvQkFDSixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7MkJBQ3JGLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUM7K0JBQ3ZFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekc7d0JBQ0EsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbEI7aUJBQ0Y7Ozs7Ozs7b0JBTUssUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDN0MseUJBQXlCO2dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMxQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDO29CQUN0RCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDO2lCQUN2RDs7O29CQUlLLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQztnQkFFakMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNiLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNsQiwrQ0FBK0M7Z0JBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTzs7OztnQkFBQyxVQUFBLEdBQUc7b0JBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUNoRCxDQUFDLEVBQUMsQ0FBQzs7b0JBRUMsa0JBQWtCOztvQkFFaEIsVUFBVSxHQUFlLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztvQkFDOUcsV0FBVyxHQUFlLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztvQkFDL0csVUFBVSxHQUFlLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztvQkFDOUcsV0FBVyxHQUFlLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztvQkFFL0csS0FBSyxHQUFHLENBQUMsVUFB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b3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhLCBSb2xlc0FycmF5fSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7Tmd4RmlsdGVyTWVudUNvbXBvbmVudH0gZnJvbSAnLi4vZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RWRpdG9yQWN0aW9uQnV0dG9uLCBQb2ludE9wdGlvbnMsIFBvaW50U2hhcGV9IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG4vLyBpbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25neC1vcGVuY3Yuc2VydmljZSc7XHJcbmltcG9ydCB7RG9jU2Nhbm5lckNvbmZpZywgSW1hZ2VEaW1lbnNpb25zLCBPcGVuQ1ZTdGF0ZX0gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlfSBmcm9tICduZ3gtb3BlbmN2JztcclxuXHJcbmRlY2xhcmUgdmFyIGN2OiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1kb2Mtc2Nhbm5lcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERvY1NjYW5uZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgdmFsdWUgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAqL1xyXG4gIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgQ09ORklHIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWRpdG9yQnV0dG9uczogQXJyYXk8RWRpdG9yQWN0aW9uQnV0dG9uPjtcclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBnZXQgZGlzcGxheWVkQnV0dG9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvckJ1dHRvbnMuZmlsdGVyKGJ1dHRvbiA9PiB7XHJcbiAgICAgIHJldHVybiBidXR0b24ubW9kZSA9PT0gdGhpcy5tb2RlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgbWF4UHJldmlld1dpZHRoOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXHJcbiAgICovXHJcbiAgaW1hZ2VEaXZTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgZGl2IHN0eWxlXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcblxyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgU1RBVEUgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc3RhdGUgb2Ygb3BlbmN2IGxvYWRpbmdcclxuICAgKi9cclxuICBwcml2YXRlIGN2U3RhdGU6IHN0cmluZztcclxuICAvKipcclxuICAgKiB0cnVlIGFmdGVyIHRoZSBpbWFnZSBpcyBsb2FkZWQgYW5kIHByZXZpZXcgaXMgZGlzcGxheWVkXHJcbiAgICovXHJcbiAgaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIG1vZGU6ICdjcm9wJyB8ICdjb2xvcicgPSAnY3JvcCc7XHJcbiAgLyoqXHJcbiAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRGaWx0ZXIgPSAnZGVmYXVsdCc7XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBPUEVSQVRJT04gVkFSSUFCTEVTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHZpZXdwb3J0IGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAwLFxyXG4gICAgaGVpZ2h0OiAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgKi9cclxuICBwcml2YXRlIG9yaWdpbmFsSW1hZ2U6IEZpbGU7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRlZEltYWdlOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICovXHJcbiAgQFZpZXdDaGlsZCgnUHJldmlld0NhbnZhcycsIHtyZWFkOiBFbGVtZW50UmVmfSkgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzOiBFbGVtZW50UmVmO1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBwcml2YXRlIHBvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRVZFTlQgRU1JVFRFUlMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICAvKipcclxuICAgKiBmaXJlcyBvbiBlZGl0IGNvbXBsZXRpb25cclxuICAgKi9cclxuICBAT3V0cHV0KCkgZWRpdFJlc3VsdDogRXZlbnRFbWl0dGVyPEJsb2I+ID0gbmV3IEV2ZW50RW1pdHRlcjxCbG9iPigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0aGUgbG9hZGluZyBzdGF0dXMgb2YgdGhlIGN2IG1vZHVsZS5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8vIElOUFVUUyAvL1xyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAqIEBwYXJhbSBmaWxlIC0gZmlsZSBmcm9tIGZvcm0gaW5wdXRcclxuICAgKi9cclxuICBASW5wdXQoKSBzZXQgZmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICBpZiAoZmlsZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gZmlsZTtcclxuICAgICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYXN5bmMgKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgICAgICAvLyByZWFkIGZpbGUgdG8gaW1hZ2UgJiBjYW52YXNcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRmlsZShmaWxlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICovXHJcbiAgQElucHV0KCkgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neE9wZW5DdjogTmd4T3BlbkNWU2VydmljZSwgcHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlLCBwcml2YXRlIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCkge1xyXG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xyXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBzdGF0dXMgb2YgY3YgbW9kdWxlXHJcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgdGhpcy5jdlN0YXRlID0gY3ZTdGF0ZS5zdGF0ZTtcclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KGN2U3RhdGUucmVhZHkpO1xyXG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoJ2Vycm9yIGxvYWRpbmcgY3YnKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvaW50cyA9PiB7XHJcbiAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdleGl0JyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JvdGF0ZScsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnJvdGF0ZUltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ3JvdGF0ZV9yaWdodCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZG9uZV9jcm9wJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZG9uZUNyb3AoKSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnVuZG8oKSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLmVkaXRvclN0eWxlID0gdGhpcy5vcHRpb25zLmVkaXRvclN0eWxlO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMuY29uZmlnKSB7XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUudGhyZXNob2xkSW5mby50aHJlc2ggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUudGhyZXNob2xkSW5mby50aHJlc2gpIHtcclxuICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHVwZGF0ZVByZXZpZXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5tYXhQcmV2aWV3V2lkdGggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUubWF4UHJldmlld1dpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUuZXh0cmFDc3MgIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUuZXh0cmFDc3MpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5leHRyYUNzcyk7XHJcbiAgICAgICAgdXBkYXRlUHJldmlldyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVwZGF0ZVByZXZpZXcpIHtcclxuICAgICAgICB0aGlzLmRvdWJsZVJvdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIGVkaXRvciBhY3Rpb24gYnV0dG9ucyBtZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuXHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGV4aXRFZGl0b3IgZXZlbnRcclxuICAgKi9cclxuICBleGl0KCkge1xyXG4gICAgdGhpcy5leGl0RWRpdG9yLmVtaXQoJ2NhbmNlbGVkJyk7XHJcbiAgfVxyXG5cclxuICBnZXRNb2RlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5tb2RlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZG9uZUNyb3AoKSB7XHJcbiAgICB0aGlzLm1vZGUgPSAnY29sb3InO1xyXG4gICAgYXdhaXQgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcih0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICB0aGlzLm1vZGUgPSAnY3JvcCc7XHJcbiAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIsIGFuZCB3aGVuIGRvbmUgZW1pdHMgdGhlIHJlc3VsdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhc3luYyBleHBvcnRJbWFnZSgpIHtcclxuICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIoZmFsc2UpO1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMpIHtcclxuICAgICAgdGhpcy5yZXNpemUodGhpcy5lZGl0ZWRJbWFnZSlcclxuICAgICAgLnRoZW4ocmVzaXplUmVzdWx0ID0+IHtcclxuICAgICAgICByZXNpemVSZXN1bHQudG9CbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRSZXN1bHQuZW1pdChibG9iKTtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICB9LCB0aGlzLm9yaWdpbmFsSW1hZ2UudHlwZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lZGl0ZWRJbWFnZS50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICB0aGlzLmVkaXRSZXN1bHQuZW1pdChibG9iKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgIH0sIHRoaXMub3JpZ2luYWxJbWFnZS50eXBlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIG9wZW4gdGhlIGJvdHRvbSBzaGVldCBmb3Igc2VsZWN0aW5nIGZpbHRlcnMsIGFuZCBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgaW4gcHJldmlldyBtb2RlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjaG9vc2VGaWx0ZXJzKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHtmaWx0ZXI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJ9O1xyXG4gICAgY29uc3QgYm90dG9tU2hlZXRSZWYgPSB0aGlzLmJvdHRvbVNoZWV0Lm9wZW4oTmd4RmlsdGVyTWVudUNvbXBvbmVudCwge1xyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KTtcclxuICAgIGJvdHRvbVNoZWV0UmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IGRhdGEuZmlsdGVyO1xyXG4gICAgICB0aGlzLmFwcGx5RmlsdGVyKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRmlsZSBJbnB1dCAmIE91dHB1dCBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogbG9hZCBpbWFnZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlYWRJbWFnZShmaWxlKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBwYW5lIGxpbWl0c1xyXG4gICAgICAvLyBzaG93IHBvaW50c1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgYXdhaXQgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLmRldGVjdENvbnRvdXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMTUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRJbWFnZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgaW1hZ2VTcmM7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaW1hZ2VTcmMgPSBhd2FpdCByZWFkRmlsZSgpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgaW1nLm9ubG9hZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBzZXQgZWRpdGVkIGltYWdlIGNhbnZhcyBhbmQgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS53aWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLmhlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5lZGl0ZWRJbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgICAgICAvLyByZXNpemUgaW1hZ2UgaWYgbGFyZ2VyIHRoYW4gbWF4IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCB3aWR0aCA9IGltZy53aWR0aCA+IGltZy5oZWlnaHQgPyBpbWcuaGVpZ2h0IDogaW1nLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSBhd2FpdCB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLmVkaXRlZEltYWdlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgICAgaW1nLnNyYyA9IGltYWdlU3JjO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGZpbGUgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZWFkRmlsZSgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIub25lcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gSW1hZ2UgUHJvY2Vzc2luZyBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGltYWdlIDkwIGRlZ3JlZXNcclxuICAgKi9cclxuICByb3RhdGVJbWFnZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUoY2xvY2t3aXNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvdWJsZVJvdGF0ZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZSh0cnVlKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJvdGF0ZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAvLyBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICBjdi50cmFuc3Bvc2UoZHN0LCBkc3QpO1xyXG4gICAgaWYgKGNsb2Nrd2lzZSkge1xyXG4gICAgICBjdi5mbGlwKGRzdCwgZHN0LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN2LmZsaXAoZHN0LCBkc3QsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgLy8gc3JjLmRlbGV0ZSgpO1xyXG4gICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgLy8gc2F2ZSBjdXJyZW50IHByZXZpZXcgZGltZW5zaW9ucyBhbmQgcG9zaXRpb25zXHJcbiAgICBjb25zdCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgPSB7d2lkdGg6IDAsIGhlaWdodDogMH07XHJcbiAgICBPYmplY3QuYXNzaWduKGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyk7XHJcbiAgICBjb25zdCBpbml0aWFsUG9zaXRpb25zID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cyk7XHJcbiAgICAvLyBnZXQgbmV3IGRpbWVuc2lvbnNcclxuICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgLy8gZ2V0IHByZXZpZXcgcGFuZSByZXNpemUgcmF0aW9cclxuICAgIGNvbnN0IHByZXZpZXdSZXNpemVSYXRpb3MgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoIC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodFxyXG4gICAgfTtcclxuICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuXHJcbiAgICBpZiAoY2xvY2t3aXNlKSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVBbnRpQ2xvY2t3aXNlKHByZXZpZXdSZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgZGV0ZWN0Q29udG91cnMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gbG9hZCB0aGUgaW1hZ2UgYW5kIGNvbXB1dGUgdGhlIHJhdGlvIG9mIHRoZSBvbGQgaGVpZ2h0IHRvIHRoZSBuZXcgaGVpZ2h0LCBjbG9uZSBpdCwgYW5kIHJlc2l6ZSBpdFxyXG4gICAgICAgIGNvbnN0IHByb2Nlc3NpbmdSZXNpemVSYXRpbyA9IDAuNTtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuTWF0Lnplcm9zKHNyYy5yb3dzLCBzcmMuY29scywgY3YuQ1ZfOFVDMyk7XHJcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShzcmMucm93cyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbywgc3JjLmNvbHMgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8pO1xyXG4gICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgLy8gY29udmVydCB0aGUgaW1hZ2UgdG8gZ3JheXNjYWxlLCBibHVyIGl0LCBhbmQgZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2VcclxuICAgICAgICBjdi5jdnRDb2xvcihzcmMsIHNyYywgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICBjdi5HYXVzc2lhbkJsdXIoc3JjLCBzcmMsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgLy8gY3YuQ2Fubnkoc3JjLCBzcmMsIDc1LCAyMDApO1xyXG4gICAgICAgIC8vIGZpbmQgY29udG91cnNcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgICAgY3YudGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaCwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9tZWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfZ2F1c3NpYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XHJcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LmZpbmRDb250b3VycyhzcmMsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xyXG4gICAgICAgIGNvbnN0IGNudCA9IGNvbnRvdXJzLmdldCg0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb250b3Vycyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS1VTklRVUUgUkVDVEFOR0xFUyBGUk9NIEFMTCBDT05UT1VSUy0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zdCByZWN0cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udG91cnMuc2l6ZSgpOyBpKyspIHtcclxuICAgICAgICAgIGNvbnN0IGNuID0gY29udG91cnMuZ2V0KGkpO1xyXG4gICAgICAgICAgY29uc3QgciA9IGN2Lm1pbkFyZWFSZWN0KGNuKTtcclxuICAgICAgICAgIGxldCBhZGQgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHIuc2l6ZS5oZWlnaHQgPCA1MCB8fCByLnNpemUud2lkdGggPCA1MFxyXG4gICAgICAgICAgICB8fCByLmFuZ2xlID09PSA5MCB8fCByLmFuZ2xlID09PSAxODAgfHwgci5hbmdsZSA9PT0gMFxyXG4gICAgICAgICAgICB8fCByLmFuZ2xlID09PSAtOTAgfHwgci5hbmdsZSA9PT0gLTE4MFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVjdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIHJlY3RzW2pdLmFuZ2xlID09PSByLmFuZ2xlXHJcbiAgICAgICAgICAgICAgJiYgcmVjdHNbal0uY2VudGVyLnggPT09IHIuY2VudGVyLnggJiYgcmVjdHNbal0uY2VudGVyLnkgPT09IHIuY2VudGVyLnlcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5zaXplLndpZHRoID09PSByLnNpemUud2lkdGggJiYgcmVjdHNbal0uc2l6ZS5oZWlnaHQgPT09IHIuc2l6ZS5oZWlnaHRcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgIHJlY3RzLnB1c2gocik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVjdDIgPSBjdi5taW5BcmVhUmVjdChjbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIC8vIGNvbnN0IHYgPSBjdi5Sb3RhdGVkUmVjdC5wb2ludHMocmVjdHNbaV0pO1xyXG4gICAgICAgICAgLy8gbGV0IGlzTmVnYXRpdmUgPSBmYWxzZTtcclxuICAgICAgICAgIC8vIGZvciAobGV0IGogPSAwOyBqIDwgdi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgLy8gICBpZiAodltqXS54IDwgMCB8fCB2W2pdLnkgPCAwKSB7XHJcbiAgICAgICAgICAvLyAgICAgaXNOZWdhdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIC8vIGlmIChpc05lZ2F0aXZlKSB7XHJcbiAgICAgICAgICAvLyAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgaWYgKCgocmVjdHNbaV0uc2l6ZS53aWR0aCAqIHJlY3RzW2ldLnNpemUuaGVpZ2h0KSA+IChyZWN0Mi5zaXplLndpZHRoICogcmVjdDIuc2l6ZS5oZWlnaHQpXHJcbiAgICAgICAgICAgICYmICEocmVjdHNbaV0uYW5nbGUgPT09IDkwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAxODAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IDBcclxuICAgICAgICAgICAgICB8fCByZWN0c1tpXS5hbmdsZSA9PT0gLTkwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAtMTgwKSAmJiAoKHJlY3RzW2ldLmFuZ2xlID4gODUgfHwgcmVjdHNbaV0uYW5nbGUgPCA1KSkpXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgcmVjdDIgPSByZWN0c1tpXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVjdHMpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVjdDIpO1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gY3YuUm90YXRlZFJlY3QucG9pbnRzKHJlY3QyKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh2ZXJ0aWNlcyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgIHZlcnRpY2VzW2ldLnggPSB2ZXJ0aWNlc1tpXS54ICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgICAgdmVydGljZXNbaV0ueSA9IHZlcnRpY2VzW2ldLnkgKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh2ZXJ0aWNlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBjdi5ib3VuZGluZ1JlY3Qoc3JjKTtcclxuXHJcbiAgICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgIGhpZXJhcmNoeS5kZWxldGUoKTtcclxuICAgICAgICBjb250b3Vycy5kZWxldGUoKTtcclxuICAgICAgICAvLyB0cmFuc2Zvcm0gdGhlIHJlY3RhbmdsZSBpbnRvIGEgc2V0IG9mIHBvaW50c1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHJlY3QpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIHJlY3Rba2V5XSA9IHJlY3Rba2V5XSAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRvdXJDb29yZGluYXRlcztcclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzBdLCBbdmVydGljZXNbMV0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1sxXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IHRoaXJkUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1syXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IGZvdXJ0aFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbM10sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzFdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuXHJcbiAgICAgICAgY29uc3Qgcm9sZXMgPSBbZmlyc3RSb2xlcywgc2Vjb25kUm9sZXMsIHRoaXJkUm9sZXMsIGZvdXJ0aFJvbGVzXTtcclxuICAgICAgICBjb25zdCB0cyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGJzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9sZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChyb2xlc1tpXVswXSA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgdHMucHVzaChpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJzLnB1c2goaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0cyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYnMpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xlZnQodmVydGljZXNbdHNbMF1dLCB2ZXJ0aWNlc1t0c1sxXV0pKSB7XHJcbiAgICAgICAgICByb2xlc1t0c1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgcm9sZXNbdHNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJvbGVzW3RzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTGVmdCh2ZXJ0aWNlc1tic1swXV0sIHZlcnRpY2VzW2JzWzFdXSkpIHtcclxuICAgICAgICAgIHJvbGVzW2JzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICByb2xlc1tic1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcm9sZXNbYnNbMV1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgIHJvbGVzW2JzWzBdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocm9sZXMpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcudXNlUm90YXRlZFJlY3RhbmdsZVxyXG4gICAgICAgICAgJiYgdGhpcy5wb2ludHNBcmVOb3RUaGVTYW1lKHZlcnRpY2VzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29udG91ckNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1swXS54LCB5OiB2ZXJ0aWNlc1swXS55fSwgZmlyc3RSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzFdLngsIHk6IHZlcnRpY2VzWzFdLnl9LCBzZWNvbmRSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzJdLngsIHk6IHZlcnRpY2VzWzJdLnl9LCB0aGlyZFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbM10ueCwgeTogdmVydGljZXNbM10ueX0sIGZvdXJ0aFJvbGVzKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0Lnl9LCBbJ2xlZnQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0Lnl9LCBbJ3JpZ2h0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ3JpZ2h0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54LCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsnbGVmdCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yZXBvc2l0aW9uUG9pbnRzKGNvbnRvdXJDb29yZGluYXRlcyk7XHJcbiAgICAgICAgLy8gdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc1RvcChjb29yZGluYXRlLCBvdGhlclZlcnRpY2VzKTogYm9vbGVhbiB7XHJcblxyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3RoZXJWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoY29vcmRpbmF0ZS55IDwgb3RoZXJWZXJ0aWNlc1tpXS55KSB7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudCA+PSAyO1xyXG5cclxuICB9XHJcblxyXG4gIGlzTGVmdChjb29yZGluYXRlLCBzZWNvbmRDb29yZGluYXRlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gY29vcmRpbmF0ZS54IDwgc2Vjb25kQ29vcmRpbmF0ZS54O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludHNBcmVOb3RUaGVTYW1lKHZlcnRpY2VzOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhKHZlcnRpY2VzWzBdLnggPT09IHZlcnRpY2VzWzFdLnggJiYgdmVydGljZXNbMV0ueCA9PT0gdmVydGljZXNbMl0ueCAmJiB2ZXJ0aWNlc1syXS54ID09PSB2ZXJ0aWNlc1szXS54ICYmXHJcbiAgICAgIHZlcnRpY2VzWzBdLnkgPT09IHZlcnRpY2VzWzFdLnkgJiYgdmVydGljZXNbMV0ueSA9PT0gdmVydGljZXNbMl0ueSAmJiB2ZXJ0aWNlc1syXS55ID09PSB2ZXJ0aWNlc1szXS55KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGx5IHBlcnNwZWN0aXZlIHRyYW5zZm9ybVxyXG4gICAqL1xyXG4gIHByaXZhdGUgdHJhbnNmb3JtKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHNvdXJjZSBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBzb3VyY2VDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pXHJcbiAgICAgICAgXS5tYXAocG9pbnQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIFtwb2ludC54IC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCBwb2ludC55IC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IG1heCB3aWR0aFxyXG4gICAgICAgIGNvbnN0IGJvdHRvbVdpZHRoID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS54IC0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pLng7XHJcbiAgICAgICAgY29uc3QgdG9wV2lkdGggPSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IE1hdGgubWF4KGJvdHRvbVdpZHRoLCB0b3BXaWR0aCkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgLy8gZ2V0IG1heCBoZWlnaHRcclxuICAgICAgICBjb25zdCBsZWZ0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueTtcclxuICAgICAgICBjb25zdCByaWdodEhlaWdodCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueTtcclxuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSBNYXRoLm1heChsZWZ0SGVpZ2h0LCByaWdodEhlaWdodCkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgLy8gY3JlYXRlIGRlc3QgY29vcmRpbmF0ZXMgbWF0cml4XHJcbiAgICAgICAgY29uc3QgZGVzdENvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCBtYXhIZWlnaHQgLSAxXSxcclxuICAgICAgICAgIFswLCBtYXhIZWlnaHQgLSAxXVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gb3BlbiBjdiBtYXRyaXggb2JqZWN0c1xyXG4gICAgICAgIGNvbnN0IE1zID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uc291cmNlQ29vcmRpbmF0ZXMpKTtcclxuICAgICAgICBjb25zdCBNZCA9IGN2Lm1hdEZyb21BcnJheSg0LCAxLCBjdi5DVl8zMkZDMiwgW10uY29uY2F0KC4uLmRlc3RDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybU1hdHJpeCA9IGN2LmdldFBlcnNwZWN0aXZlVHJhbnNmb3JtKE1zLCBNZCk7XHJcbiAgICAgICAgLy8gc2V0IG5ldyBpbWFnZSBzaXplXHJcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShtYXhXaWR0aCwgbWF4SGVpZ2h0KTtcclxuICAgICAgICAvLyBwZXJmb3JtIHdhcnBcclxuICAgICAgICBjdi53YXJwUGVyc3BlY3RpdmUoZHN0LCBkc3QsIHRyYW5zZm9ybU1hdHJpeCwgZHNpemUsIGN2LklOVEVSX0NVQklDLCBjdi5CT1JERVJfQ09OU1RBTlQsIG5ldyBjdi5TY2FsYXIoKSk7XHJcbiAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcblxyXG4gICAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgICBNcy5kZWxldGUoKTtcclxuICAgICAgICBNZC5kZWxldGUoKTtcclxuICAgICAgICB0cmFuc2Zvcm1NYXRyaXguZGVsZXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHRoaXMuc2hvd1ByZXZpZXcoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdG8gdGhlIGltYWdlXHJcbiAgICogQHBhcmFtIHByZXZpZXcgLSB3aGVuIHRydWUsIHdpbGwgbm90IGFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIGVkaXRlZCBpbWFnZSBidXQgb25seSBkaXNwbGF5IGEgcHJldmlldy5cclxuICAgKiB3aGVuIGZhbHNlLCB3aWxsIGFwcGx5IHRvIGVkaXRlZEltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhcHBseUZpbHRlcihwcmV2aWV3OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgLy8gZGVmYXVsdCBvcHRpb25zXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmx1cjogZmFsc2UsXHJcbiAgICAgICAgdGg6IHRydWUsXHJcbiAgICAgICAgdGhNb2RlOiBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxyXG4gICAgICAgIHRoTWVhbkNvcnJlY3Rpb246IDEwLFxyXG4gICAgICAgIHRoQmxvY2tTaXplOiAyNSxcclxuICAgICAgICB0aE1heDogMjU1LFxyXG4gICAgICAgIGdyYXlTY2FsZTogdHJ1ZSxcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gJ29yaWdpbmFsJztcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGVkRmlsdGVyKSB7XHJcbiAgICAgICAgY2FzZSAnb3JpZ2luYWwnOlxyXG4gICAgICAgICAgb3B0aW9ucy50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbWFnaWNfY29sb3InOlxyXG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Mic6XHJcbiAgICAgICAgICBvcHRpb25zLnRoTW9kZSA9IGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBvcHRpb25zLnRoQmxvY2tTaXplID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdidzMnOlxyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gdHJ1ZTtcclxuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgY3YuY3Z0Q29sb3IoZHN0LCBkc3QsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmJsdXIpIHtcclxuICAgICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgICBjdi5HYXVzc2lhbkJsdXIoZHN0LCBkc3QsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnRoKSB7XHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5ncmF5U2NhbGUpIHtcclxuICAgICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoZHN0LCBkc3QsIG9wdGlvbnMudGhNYXgsIG9wdGlvbnMudGhNb2RlLCBjdi5USFJFU0hfQklOQVJZLCBvcHRpb25zLnRoQmxvY2tTaXplLCBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHN0LmNvbnZlcnRUbyhkc3QsIC0xLCAxLCA2MCk7XHJcbiAgICAgICAgICAgIGN2LnRocmVzaG9sZChkc3QsIGRzdCwgMTcwLCAyNTUsIGN2LlRIUkVTSF9CSU5BUlkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByZXZpZXcpIHtcclxuICAgICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KGRzdCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemUgYW4gaW1hZ2UgdG8gZml0IGNvbnN0cmFpbnRzIHNldCBpbiBvcHRpb25zLm1heEltYWdlRGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVzaXplKGltYWdlOiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTENhbnZhc0VsZW1lbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQoaW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IHNyYy5zaXplKCkud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IHNyYy5zaXplKCkuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZXNpemVEaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjdXJyZW50RGltZW5zaW9ucy53aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoIC8gY3VycmVudERpbWVuc2lvbnMud2lkdGggKiBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICBpZiAocmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQgLyBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQgKiBjdXJyZW50RGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLndpZHRoKSwgTWF0aC5mbG9vcihyZXNpemVEaW1lbnNpb25zLmhlaWdodCkpO1xyXG4gICAgICAgICAgY3YucmVzaXplKHNyYywgc3JjLCBkc2l6ZSwgMCwgMCwgY3YuSU5URVJfQVJFQSk7XHJcbiAgICAgICAgICBjb25zdCByZXNpemVSZXN1bHQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICBjdi5pbXNob3cocmVzaXplUmVzdWx0LCBzcmMpO1xyXG4gICAgICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXNpemVSZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIGltYWdlIG9uIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc2hvd1ByZXZpZXcoaW1hZ2U/OiBhbnkpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBzcmM7XHJcbiAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgIHNyYyA9IGltYWdlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoMCwgMCk7XHJcbiAgICAgIGN2LnJlc2l6ZShzcmMsIGRzdCwgZHNpemUsIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgY3YuaW1zaG93KHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LCBkc3QpO1xyXG4gICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgIGRzdC5kZWxldGUoKTtcclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKiogLy9cclxuICAvLyBVdGlsaXR5IE1ldGhvZHMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgcHJldmlldyBjYW52YXMgZGltZW5zaW9ucyBhY2NvcmRpbmcgdG8gdGhlIGNhbnZhcyBlbGVtZW50IG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKGltZzogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgIC8vIHNldCBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyA9IHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucyhpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG4gICAgdGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoO1xyXG4gICAgdGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICB0aGlzLmltYWdlUmVzaXplUmF0aW8gPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoIC8gaW1nLndpZHRoO1xyXG4gICAgdGhpcy5pbWFnZURpdlN0eWxlID0ge1xyXG4gICAgICB3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIHRoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggKyAncHgnLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0ICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy5oZWlnaHQgKyAncHgnLFxyXG4gICAgICAnbWFyZ2luLWxlZnQnOiBgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgKyAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWAsXHJcbiAgICAgICdtYXJnaW4tcmlnaHQnOiBgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgLSAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWAsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgcmF0aW86IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XHJcblxyXG4gICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggPiB0aGlzLm1heFByZXZpZXdXaWR0aCA/XHJcbiAgICAgIHRoaXMubWF4UHJldmlld1dpZHRoIDogdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoIC0gNDA7XHJcbiAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLnNjcmVlbkRpbWVuc2lvbnMuaGVpZ2h0IC0gMjQwO1xyXG4gICAgY29uc3QgY2FsY3VsYXRlZCA9IHtcclxuICAgICAgd2lkdGg6IG1heFdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IE1hdGgucm91bmQobWF4V2lkdGggLyByYXRpbyksXHJcbiAgICAgIHJhdGlvOiByYXRpb1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoY2FsY3VsYXRlZC5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcclxuICAgICAgY2FsY3VsYXRlZC5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbiAgICAgIGNhbGN1bGF0ZWQud2lkdGggPSBNYXRoLnJvdW5kKG1heEhlaWdodCAqIHJhdGlvKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYWxjdWxhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgKiBAcGFyYW0gcm9sZXMgLSBhbiBhcnJheSBvZiByb2xlcyBieSB3aGljaCB0aGUgcG9pbnQgd2lsbCBiZSBmZXRjaGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRQb2ludChyb2xlczogUm9sZXNBcnJheSkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzLmZpbmQocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheShwb2ludC5yb2xlcywgcm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmNsYXNzIEltYWdlRWRpdG9yQ29uZmlnIGltcGxlbWVudHMgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3B1dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm9cclxuICAgKi9cclxuICBtYXhJbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAzMDAwMCxcclxuICAgIGhlaWdodDogMzAwMDBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckJhY2tncm91bmRDb2xvciA9ICcjZmVmZWZlJztcclxuICAvKipcclxuICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckRpbWVuc2lvbnM6IHsgd2lkdGg6IHN0cmluZzsgaGVpZ2h0OiBzdHJpbmc7IH0gPSB7XHJcbiAgICB3aWR0aDogJzEwMHZ3JyxcclxuICAgIGhlaWdodDogJzEwMHZoJ1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgKi9cclxuICBleHRyYUNzczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHtcclxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgdG9wOiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICovXHJcbiAgYnV0dG9uVGhlbWVDb2xvcjogJ3ByaW1hcnknIHwgJ3dhcm4nIHwgJ2FjY2VudCcgPSAnYWNjZW50JztcclxuICAvKipcclxuICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgZXhwb3J0SW1hZ2VJY29uID0gJ2Nsb3VkX3VwbG9hZCc7XHJcbiAgLyoqXHJcbiAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sQ29sb3IgPSAnI0ZGMzMzMyc7XHJcbiAgLyoqXHJcbiAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCwgY2FuIGJlIGVpdGhlciBhIHJlY3RhbmdsZSBvciBhIGNpcmNsZVxyXG4gICAqL1xyXG4gIGNyb3BUb29sU2hhcGU6IFBvaW50U2hhcGUgPSAnY2lyY2xlJztcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBjcm9wVG9vbERpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAxMCxcclxuICAgIGhlaWdodDogMTBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyBwb2ludCBhdHRyaWJ1dGVzIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBwb2ludE9wdGlvbnM6IFBvaW50T3B0aW9ucztcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgdGhlIGVkaXRvciBzdHlsZSBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG4gIC8qKlxyXG4gICAqIGNyb3AgdG9vbCBvdXRsaW5lIHdpZHRoXHJcbiAgICovXHJcbiAgY3JvcFRvb2xMaW5lV2VpZ2h0ID0gMztcclxuICAvKipcclxuICAgKiBtYXhpbXVtIHNpemUgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAqL1xyXG4gIG1heFByZXZpZXdXaWR0aCA9IDgwMDtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogRG9jU2Nhbm5lckNvbmZpZykge1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHsnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZWRpdG9yQmFja2dyb3VuZENvbG9yfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5leHRyYUNzcyk7XHJcblxyXG4gICAgdGhpcy5wb2ludE9wdGlvbnMgPSB7XHJcbiAgICAgIHNoYXBlOiB0aGlzLmNyb3BUb29sU2hhcGUsXHJcbiAgICAgIGNvbG9yOiB0aGlzLmNyb3BUb29sQ29sb3IsXHJcbiAgICAgIHdpZHRoOiAwLFxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIH07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucG9pbnRPcHRpb25zLCB0aGlzLmNyb3BUb29sRGltZW5zaW9ucyk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=