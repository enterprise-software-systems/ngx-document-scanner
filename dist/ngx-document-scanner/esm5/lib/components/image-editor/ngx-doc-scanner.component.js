/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/image-editor/ngx-doc-scanner.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __assign, __awaiter, __generator, __read, __spread } from "tslib";
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
        this.maxPreviewHeight = this.options.maxPreviewHeight;
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
            if (!changes.config.previousValue) {
                return;
            }
            if (changes.config.currentValue.thresholdInfo.thresh !== changes.config.previousValue.thresholdInfo.thresh) {
                this.loadFile(this.originalImage);
            }
            /** @type {?} */
            var updatePreview = false;
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
                var obj = __assign({}, this.editorStyle);
                Object.assign(obj, changes.config.currentValue.editorDimensions);
                this.editorStyle = obj;
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
     * @return {?}
     */
    NgxDocScannerComponent.prototype.exportImage = /**
     * applies the selected filter, and when done emits the resulted image
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
                                }), 'image/jpeg', 0.8);
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
                            }), 'image/jpeg', 0.8);
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
                if (!cnt) {
                    _this.processing.emit(false);
                    return;
                }
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
                try {
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
                }
                catch (e) {
                    _this.processing.emit(false);
                    return;
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
        // const maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
        //   this.maxPreviewWidth : this.screenDimensions.width - 40;
        // const maxHeight = this.screenDimensions.height > this.maxPreviewHeight ? this.maxPreviewHeight : this.screenDimensions.height - 240;
        /** @type {?} */
        var maxWidth = this.maxPreviewWidth;
        /** @type {?} */
        var maxHeight = this.maxPreviewHeight;
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
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.getStoyle = /**
     * @return {?}
     */
    function () {
        return this.editorStyle;
    };
    NgxDocScannerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-doc-scanner',
                    template: "<div [ngStyle]=\"getStoyle()\" fxLayout=\"column\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\r\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\">\r\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\r\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\"\r\n                        [weight]=\"options.cropToolLineWeight\"\r\n                        [dimensions]=\"previewDimensions\"></ngx-shape-outine>\r\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: 0}\"\r\n                           [limitRoles]=\"['top', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: 0, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'left']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\"\r\n                           [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\"\r\n                           [limitRoles]=\"['bottom', 'right']\"\r\n                           [container]=\"imageContainer\"></ngx-draggable-point>\r\n    </ng-container>\r\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\"\r\n            style=\"z-index: 5\"></canvas>\r\n  </div>\r\n<!--  <div fxLayout=\"column\" style=\"width: 100vw\">-->\r\n<!--    <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\">-->\r\n<!--      <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">-->\r\n<!--        <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\"-->\r\n<!--                [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--        </button>-->\r\n<!--        <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\"-->\r\n<!--                (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">-->\r\n<!--          <mat-icon>{{button.icon}}</mat-icon>-->\r\n<!--          <span>{{button.text}}}</span>-->\r\n<!--        </button>-->\r\n<!--      </ng-container>-->\r\n<!--    </div>-->\r\n<!--  </div>-->\r\n\r\n</div>\r\n\r\n\r\n",
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
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewHeight = 800;
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
    /**
     * maximum size of the preview pane
     * @type {?}
     */
    ImageEditorConfig.prototype.maxPreviewHeight;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBSTVDO0lBNEpFLGdDQUFvQixTQUEyQixFQUFVLGFBQTRCLEVBQVUsV0FBMkI7UUFBMUgsaUJBdUJDO1FBdkJtQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBdEoxSCxVQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O1FBK0NWLGdCQUFXLEdBQUcsS0FBSyxDQUFDOzs7O1FBSXBCLFNBQUksR0FBcUIsTUFBTSxDQUFDOzs7O1FBSXhCLG1CQUFjLEdBQUcsU0FBUyxDQUFDOzs7O1FBWTNCLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDOzs7Ozs7O1FBZ0NRLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQzs7OztRQUk5RCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7Ozs7UUFJMUQsVUFBSyxH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LFFBQVEsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBNUZELElBNEZDOzs7Ozs7SUF4RkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBMkQ7Ozs7O0lBSTNELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBcUM7Ozs7O0lBSXJDLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQWlEOzs7OztJQUlqRCwrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQjs7Ozs7SUFLdEIsNkNBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhLCBSb2xlc0FycmF5fSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XHJcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2JvdHRvbS1zaGVldCc7XHJcbmltcG9ydCB7Tmd4RmlsdGVyTWVudUNvbXBvbmVudH0gZnJvbSAnLi4vZmlsdGVyLW1lbnUvbmd4LWZpbHRlci1tZW51LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RWRpdG9yQWN0aW9uQnV0dG9uLCBQb2ludE9wdGlvbnMsIFBvaW50U2hhcGV9IGZyb20gJy4uLy4uL1ByaXZhdGVNb2RlbHMnO1xyXG4vLyBpbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25neC1vcGVuY3Yuc2VydmljZSc7XHJcbmltcG9ydCB7RG9jU2Nhbm5lckNvbmZpZywgSW1hZ2VEaW1lbnNpb25zLCBPcGVuQ1ZTdGF0ZX0gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcclxuaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlfSBmcm9tICduZ3gtb3BlbmN2JztcclxuXHJcbmRlY2xhcmUgdmFyIGN2OiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1kb2Mtc2Nhbm5lcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERvY1NjYW5uZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgdmFsdWUgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBlZGl0b3IgY29uZmlnIG9iamVjdFxyXG4gICAqL1xyXG4gIG9wdGlvbnM6IEltYWdlRWRpdG9yQ29uZmlnO1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgQ09ORklHIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWRpdG9yQnV0dG9uczogQXJyYXk8RWRpdG9yQWN0aW9uQnV0dG9uPjtcclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidXR0b25zIGFjY29yZGluZyB0byB0aGUgZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBnZXQgZGlzcGxheWVkQnV0dG9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvckJ1dHRvbnMuZmlsdGVyKGJ1dHRvbiA9PiB7XHJcbiAgICAgIHJldHVybiBidXR0b24ubW9kZSA9PT0gdGhpcy5tb2RlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1heFByZXZpZXdIZWlnaHQ6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBtYXggd2lkdGggb2YgdGhlIHByZXZpZXcgYXJlYVxyXG4gICAqL1xyXG4gIHByaXZhdGUgbWF4UHJldmlld1dpZHRoOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXHJcbiAgICovXHJcbiAgaW1hZ2VEaXZTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgZGl2IHN0eWxlXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcblxyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvLyBFRElUT1IgU1RBVEUgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc3RhdGUgb2Ygb3BlbmN2IGxvYWRpbmdcclxuICAgKi9cclxuICBwcml2YXRlIGN2U3RhdGU6IHN0cmluZztcclxuICAvKipcclxuICAgKiB0cnVlIGFmdGVyIHRoZSBpbWFnZSBpcyBsb2FkZWQgYW5kIHByZXZpZXcgaXMgZGlzcGxheWVkXHJcbiAgICovXHJcbiAgaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAvKipcclxuICAgKiBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIG1vZGU6ICdjcm9wJyB8ICdjb2xvcicgPSAnY3JvcCc7XHJcbiAgLyoqXHJcbiAgICogZmlsdGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCByZXR1cm5lZCBieSB0aGUgZmlsdGVyIHNlbGVjdG9yIGJvdHRvbSBzaGVldFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRGaWx0ZXIgPSAnZGVmYXVsdCc7XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBPUEVSQVRJT04gVkFSSUFCTEVTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHZpZXdwb3J0IGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAwLFxyXG4gICAgaGVpZ2h0OiAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBwcmV2aWV3RGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIHJhdGlvbiBiZXR3ZWVuIHByZXZpZXcgaW1hZ2UgYW5kIG9yaWdpbmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBvcmlnaW5hbCBpbWFnZSBmb3IgcmVzZXQgcHVycG9zZXNcclxuICAgKi9cclxuICBwcml2YXRlIG9yaWdpbmFsSW1hZ2U6IEZpbGU7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRlZEltYWdlOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIHByZXZpZXcgaW1hZ2UgYXMgY2FudmFzXHJcbiAgICovXHJcbiAgQFZpZXdDaGlsZCgnUHJldmlld0NhbnZhcycsIHtyZWFkOiBFbGVtZW50UmVmfSkgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzOiBFbGVtZW50UmVmO1xyXG4gIC8qKlxyXG4gICAqIGFuIGFycmF5IG9mIHBvaW50cyB1c2VkIGJ5IHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBwcml2YXRlIHBvaW50czogQXJyYXk8UG9pbnRQb3NpdGlvbkNoYW5nZT47XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRVZFTlQgRU1JVFRFUlMgLy9cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIG9wdGlvbmFsIGJpbmRpbmcgdG8gdGhlIGV4aXQgYnV0dG9uIG9mIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICAvKipcclxuICAgKiBmaXJlcyBvbiBlZGl0IGNvbXBsZXRpb25cclxuICAgKi9cclxuICBAT3V0cHV0KCkgZWRpdFJlc3VsdDogRXZlbnRFbWl0dGVyPEJsb2I+ID0gbmV3IEV2ZW50RW1pdHRlcjxCbG9iPigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0aGUgbG9hZGluZyBzdGF0dXMgb2YgdGhlIGN2IG1vZHVsZS5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyB0cnVlIHdoZW4gcHJvY2Vzc2luZyBpcyBkb25lLCBmYWxzZSB3aGVuIGNvbXBsZXRlZFxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBwcm9jZXNzaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8vIElOUFVUUyAvL1xyXG4gIC8vICoqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBpbWFnZSBmb3IgZWRpdGluZ1xyXG4gICAqIEBwYXJhbSBmaWxlIC0gZmlsZSBmcm9tIGZvcm0gaW5wdXRcclxuICAgKi9cclxuICBASW5wdXQoKSBzZXQgZmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICBpZiAoZmlsZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gZmlsZTtcclxuICAgICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYXN5bmMgKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgICAgICAvLyByZWFkIGZpbGUgdG8gaW1hZ2UgJiBjYW52YXNcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRmlsZShmaWxlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICovXHJcbiAgQElucHV0KCkgY29uZmlnOiBEb2NTY2FubmVyQ29uZmlnO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neE9wZW5DdjogTmd4T3BlbkNWU2VydmljZSwgcHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlLCBwcml2YXRlIGJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCkge1xyXG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xyXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBzdGF0dXMgb2YgY3YgbW9kdWxlXHJcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgdGhpcy5jdlN0YXRlID0gY3ZTdGF0ZS5zdGF0ZTtcclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KGN2U3RhdGUucmVhZHkpO1xyXG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoJ2Vycm9yIGxvYWRpbmcgY3YnKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3ZTdGF0ZS5yZWFkeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5wb3NpdGlvbnMuc3Vic2NyaWJlKHBvaW50cyA9PiB7XHJcbiAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdleGl0JyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JvdGF0ZScsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnJvdGF0ZUltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ3JvdGF0ZV9yaWdodCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZG9uZV9jcm9wJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZG9uZUNyb3AoKSxcclxuICAgICAgICBpY29uOiAnZG9uZScsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYmFjaycsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLnVuZG8oKSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2ZpbHRlcicsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdwaG90b19maWx0ZXInLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6IHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSA/ICdjb2xvcicgOiAnZGlzYWJsZWQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAndXBsb2FkJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAnY2xvdWRfdXBsb2FkJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIHNldCBvcHRpb25zIGZyb20gY29uZmlnIG9iamVjdFxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IEltYWdlRWRpdG9yQ29uZmlnKHRoaXMuY29uZmlnKTtcclxuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbi5uYW1lID09PSAndXBsb2FkJykge1xyXG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XHJcbiAgICB0aGlzLm1heFByZXZpZXdIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld0hlaWdodDtcclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB0aGlzLm9wdGlvbnMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jb25maWcpIHtcclxuICAgICAgaWYgKCFjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUudGhyZXNob2xkSW5mby50aHJlc2ggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUudGhyZXNob2xkSW5mby50aHJlc2gpIHtcclxuICAgICAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHVwZGF0ZVByZXZpZXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5tYXhQcmV2aWV3V2lkdGggIT09IGNoYW5nZXMuY29uZmlnLnByZXZpb3VzVmFsdWUubWF4UHJldmlld1dpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld0hlaWdodCAhPT0gY2hhbmdlcy5jb25maWcucHJldmlvdXNWYWx1ZS5tYXhQcmV2aWV3SGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5tYXhQcmV2aWV3SGVpZ2h0ID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLm1heFByZXZpZXdIZWlnaHQ7XHJcbiAgICAgICAgdXBkYXRlUHJldmlldyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLmVkaXRvckRpbWVuc2lvbnMpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB7Li4udGhpcy5lZGl0b3JTdHlsZX07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvYmosIGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS5lZGl0b3JEaW1lbnNpb25zKTtcclxuICAgICAgICB0aGlzLmVkaXRvclN0eWxlID0gb2JqO1xyXG4gICAgICAgIHVwZGF0ZVByZXZpZXcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cGRhdGVQcmV2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5kb3VibGVSb3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvbmVDcm9wKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2Nyb3AnO1xyXG4gICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGFzeW5jIGV4cG9ydEltYWdlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucykge1xyXG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKVxyXG4gICAgICAudGhlbihyZXNpemVSZXN1bHQgPT4ge1xyXG4gICAgICAgIHJlc2l6ZVJlc3VsdC50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH0sICdpbWFnZS9qcGVnJywgMC44KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVkaXRlZEltYWdlLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdFJlc3VsdC5lbWl0KGJsb2IpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgfSwgICdpbWFnZS9qcGVnJywgMC44KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIG9wZW4gdGhlIGJvdHRvbSBzaGVldCBmb3Igc2VsZWN0aW5nIGZpbHRlcnMsIGFuZCBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgaW4gcHJldmlldyBtb2RlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjaG9vc2VGaWx0ZXJzKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHtmaWx0ZXI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJ9O1xyXG4gICAgY29uc3QgYm90dG9tU2hlZXRSZWYgPSB0aGlzLmJvdHRvbVNoZWV0Lm9wZW4oTmd4RmlsdGVyTWVudUNvbXBvbmVudCwge1xyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KTtcclxuICAgIGJvdHRvbVNoZWV0UmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IGRhdGEuZmlsdGVyO1xyXG4gICAgICB0aGlzLmFwcGx5RmlsdGVyKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRmlsZSBJbnB1dCAmIE91dHB1dCBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogbG9hZCBpbWFnZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlYWRJbWFnZShmaWxlKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBwYW5lIGxpbWl0c1xyXG4gICAgICAvLyBzaG93IHBvaW50c1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgYXdhaXQgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLmRldGVjdENvbnRvdXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMTUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRJbWFnZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgaW1hZ2VTcmM7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaW1hZ2VTcmMgPSBhd2FpdCByZWFkRmlsZSgpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgaW1nLm9ubG9hZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBzZXQgZWRpdGVkIGltYWdlIGNhbnZhcyBhbmQgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS53aWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLmhlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5lZGl0ZWRJbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgICAgICAvLyByZXNpemUgaW1hZ2UgaWYgbGFyZ2VyIHRoYW4gbWF4IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCB3aWR0aCA9IGltZy53aWR0aCA+IGltZy5oZWlnaHQgPyBpbWcuaGVpZ2h0IDogaW1nLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSBhd2FpdCB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLmVkaXRlZEltYWdlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgICAgaW1nLnNyYyA9IGltYWdlU3JjO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGZpbGUgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZWFkRmlsZSgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIub25lcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gSW1hZ2UgUHJvY2Vzc2luZyBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGltYWdlIDkwIGRlZ3JlZXNcclxuICAgKi9cclxuICByb3RhdGVJbWFnZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUoY2xvY2t3aXNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvdWJsZVJvdGF0ZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnJvdGF0ZSh0cnVlKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJvdGF0ZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAvLyBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICBjdi50cmFuc3Bvc2UoZHN0LCBkc3QpO1xyXG4gICAgaWYgKGNsb2Nrd2lzZSkge1xyXG4gICAgICBjdi5mbGlwKGRzdCwgZHN0LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN2LmZsaXAoZHN0LCBkc3QsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgLy8gc3JjLmRlbGV0ZSgpO1xyXG4gICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgLy8gc2F2ZSBjdXJyZW50IHByZXZpZXcgZGltZW5zaW9ucyBhbmQgcG9zaXRpb25zXHJcbiAgICBjb25zdCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMgPSB7d2lkdGg6IDAsIGhlaWdodDogMH07XHJcbiAgICBPYmplY3QuYXNzaWduKGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyk7XHJcbiAgICBjb25zdCBpbml0aWFsUG9zaXRpb25zID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cyk7XHJcbiAgICAvLyBnZXQgbmV3IGRpbWVuc2lvbnNcclxuICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgLy8gZ2V0IHByZXZpZXcgcGFuZSByZXNpemUgcmF0aW9cclxuICAgIGNvbnN0IHByZXZpZXdSZXNpemVSYXRpb3MgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoIC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0IC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLmhlaWdodFxyXG4gICAgfTtcclxuICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuXHJcbiAgICBpZiAoY2xvY2t3aXNlKSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVBbnRpQ2xvY2t3aXNlKHByZXZpZXdSZXNpemVSYXRpb3MsIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgaW5pdGlhbFBvc2l0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgZGV0ZWN0Q29udG91cnMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gbG9hZCB0aGUgaW1hZ2UgYW5kIGNvbXB1dGUgdGhlIHJhdGlvIG9mIHRoZSBvbGQgaGVpZ2h0IHRvIHRoZSBuZXcgaGVpZ2h0LCBjbG9uZSBpdCwgYW5kIHJlc2l6ZSBpdFxyXG4gICAgICAgIGNvbnN0IHByb2Nlc3NpbmdSZXNpemVSYXRpbyA9IDAuNTtcclxuICAgICAgICBjb25zdCBzcmMgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuTWF0Lnplcm9zKHNyYy5yb3dzLCBzcmMuY29scywgY3YuQ1ZfOFVDMyk7XHJcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShzcmMucm93cyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbywgc3JjLmNvbHMgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8pO1xyXG4gICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XHJcbiAgICAgICAgLy8gY29udmVydCB0aGUgaW1hZ2UgdG8gZ3JheXNjYWxlLCBibHVyIGl0LCBhbmQgZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2VcclxuICAgICAgICBjdi5jdnRDb2xvcihzcmMsIHNyYywgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICBjdi5HYXVzc2lhbkJsdXIoc3JjLCBzcmMsIGtzaXplLCAwLCAwLCBjdi5CT1JERVJfREVGQVVMVCk7XHJcbiAgICAgICAgLy8gY3YuQ2Fubnkoc3JjLCBzcmMsIDc1LCAyMDApO1xyXG4gICAgICAgIC8vIGZpbmQgY29udG91cnNcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgICAgY3YudGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaCwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9tZWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfZ2F1c3NpYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0MsXHJcbiAgICAgICAgICAgIGN2LlRIUkVTSF9CSU5BUlksIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYmxvY2tTaXplLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XHJcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICAgIGN2LmZpbmRDb250b3VycyhzcmMsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xyXG4gICAgICAgIGNvbnN0IGNudCA9IGNvbnRvdXJzLmdldCg0KTtcclxuICAgICAgICBpZiAoIWNudCkge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLVVOSVFVRSBSRUNUQU5HTEVTIEZST00gQUxMIENPTlRPVVJTLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnN0IHJlY3RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgY24gPSBjb250b3Vycy5nZXQoaSk7XHJcbiAgICAgICAgICBjb25zdCByID0gY3YubWluQXJlYVJlY3QoY24pO1xyXG4gICAgICAgICAgbGV0IGFkZCA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoci5zaXplLmhlaWdodCA8IDUwIHx8IHIuc2l6ZS53aWR0aCA8IDUwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IDkwIHx8IHIuYW5nbGUgPT09IDE4MCB8fCByLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IC05MCB8fCByLmFuZ2xlID09PSAtMTgwXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgcmVjdHNbal0uYW5nbGUgPT09IHIuYW5nbGVcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5jZW50ZXIueCA9PT0gci5jZW50ZXIueCAmJiByZWN0c1tqXS5jZW50ZXIueSA9PT0gci5jZW50ZXIueVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLnNpemUud2lkdGggPT09IHIuc2l6ZS53aWR0aCAmJiByZWN0c1tqXS5zaXplLmhlaWdodCA9PT0gci5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgcmVjdHMucHVzaChyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZWN0MiA9IGN2Lm1pbkFyZWFSZWN0KGNudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgLy8gY29uc3QgdiA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0c1tpXSk7XHJcbiAgICAgICAgICAvLyBsZXQgaXNOZWdhdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgLy8gZm9yIChsZXQgaiA9IDA7IGogPCB2Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAvLyAgIGlmICh2W2pdLnggPCAwIHx8IHZbal0ueSA8IDApIHtcclxuICAgICAgICAgIC8vICAgICBpc05lZ2F0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgLy8gaWYgKGlzTmVnYXRpdmUpIHtcclxuICAgICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICBpZiAoKChyZWN0c1tpXS5zaXplLndpZHRoICogcmVjdHNbaV0uc2l6ZS5oZWlnaHQpID4gKHJlY3QyLnNpemUud2lkdGggKiByZWN0Mi5zaXplLmhlaWdodClcclxuICAgICAgICAgICAgJiYgIShyZWN0c1tpXS5hbmdsZSA9PT0gOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IDE4MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMFxyXG4gICAgICAgICAgICAgIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAtOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC0xODApICYmICgocmVjdHNbaV0uYW5nbGUgPiA4NSB8fCByZWN0c1tpXS5hbmdsZSA8IDUpKSlcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZWN0MiA9IHJlY3RzW2ldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZWN0cyk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coY250KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZWN0Mik7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBjdi5Sb3RhdGVkUmVjdC5wb2ludHMocmVjdDIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZlcnRpY2VzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgdmVydGljZXNbaV0ueCA9IHZlcnRpY2VzW2ldLnggKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS55ID0gdmVydGljZXNbaV0ueSAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZlcnRpY2VzKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGN2LmJvdW5kaW5nUmVjdChzcmMpO1xyXG5cclxuICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgaGllcmFyY2h5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGNvbnRvdXJzLmRlbGV0ZSgpO1xyXG4gICAgICAgIC8vIHRyYW5zZm9ybSB0aGUgcmVjdGFuZ2xlIGludG8gYSBzZXQgb2YgcG9pbnRzXHJcbiAgICAgICAgT2JqZWN0LmtleXMocmVjdCkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgcmVjdFtrZXldID0gcmVjdFtrZXldICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgY29udG91ckNvb3JkaW5hdGVzOiBQb3NpdGlvbkNoYW5nZURhdGFbXTtcclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzBdLCBbdmVydGljZXNbMV0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1sxXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IHRoaXJkUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1syXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IGZvdXJ0aFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbM10sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzFdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuXHJcbiAgICAgICAgY29uc3Qgcm9sZXMgPSBbZmlyc3RSb2xlcywgc2Vjb25kUm9sZXMsIHRoaXJkUm9sZXMsIGZvdXJ0aFJvbGVzXTtcclxuICAgICAgICBjb25zdCB0cyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGJzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9sZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChyb2xlc1tpXVswXSA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgdHMucHVzaChpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJzLnB1c2goaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0cyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYnMpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNMZWZ0KHZlcnRpY2VzW3RzWzBdXSwgdmVydGljZXNbdHNbMV1dKSkge1xyXG4gICAgICAgICAgICByb2xlc1t0c1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgICByb2xlc1t0c1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJvbGVzW3RzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgICAgICByb2xlc1t0c1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmlzTGVmdCh2ZXJ0aWNlc1tic1swXV0sIHZlcnRpY2VzW2JzWzFdXSkpIHtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgICAgcm9sZXNbYnNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByb2xlc1tic1sxXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgICByb2xlc1tic1swXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJvbGVzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnVzZVJvdGF0ZWRSZWN0YW5nbGVcclxuICAgICAgICAgICYmIHRoaXMucG9pbnRzQXJlTm90VGhlU2FtZSh2ZXJ0aWNlcylcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMF0ueCwgeTogdmVydGljZXNbMF0ueX0sIGZpcnN0Um9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1sxXS54LCB5OiB2ZXJ0aWNlc1sxXS55fSwgc2Vjb25kUm9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1syXS54LCB5OiB2ZXJ0aWNlc1syXS55fSwgdGhpcmRSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzNdLngsIHk6IHZlcnRpY2VzWzNdLnl9LCBmb3VydGhSb2xlcyksXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCwgeTogcmVjdC55fSwgWydsZWZ0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55fSwgWydyaWdodCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydyaWdodCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ2xlZnQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvblBvaW50cyhjb250b3VyQ29vcmRpbmF0ZXMpO1xyXG4gICAgICAgIC8vIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNUb3AoY29vcmRpbmF0ZSwgb3RoZXJWZXJ0aWNlcyk6IGJvb2xlYW4ge1xyXG5cclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG90aGVyVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGNvb3JkaW5hdGUueSA8IG90aGVyVmVydGljZXNbaV0ueSkge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnQgPj0gMjtcclxuXHJcbiAgfVxyXG5cclxuICBpc0xlZnQoY29vcmRpbmF0ZSwgc2Vjb25kQ29vcmRpbmF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGNvb3JkaW5hdGUueCA8IHNlY29uZENvb3JkaW5hdGUueDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9pbnRzQXJlTm90VGhlU2FtZSh2ZXJ0aWNlczogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISh2ZXJ0aWNlc1swXS54ID09PSB2ZXJ0aWNlc1sxXS54ICYmIHZlcnRpY2VzWzFdLnggPT09IHZlcnRpY2VzWzJdLnggJiYgdmVydGljZXNbMl0ueCA9PT0gdmVydGljZXNbM10ueCAmJlxyXG4gICAgICB2ZXJ0aWNlc1swXS55ID09PSB2ZXJ0aWNlc1sxXS55ICYmIHZlcnRpY2VzWzFdLnkgPT09IHZlcnRpY2VzWzJdLnkgJiYgdmVydGljZXNbMl0ueSA9PT0gdmVydGljZXNbM10ueSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBseSBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1cclxuICAgKi9cclxuICBwcml2YXRlIHRyYW5zZm9ybSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBzb3VyY2UgY29vcmRpbmF0ZXMgbWF0cml4XHJcbiAgICAgICAgY29uc3Qgc291cmNlQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKVxyXG4gICAgICAgIF0ubWFwKHBvaW50ID0+IHtcclxuICAgICAgICAgIHJldHVybiBbcG9pbnQueCAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgcG9pbnQueSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpb107XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBtYXggd2lkdGhcclxuICAgICAgICBjb25zdCBib3R0b21XaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IHRvcFdpZHRoID0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS54IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLng7XHJcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBNYXRoLm1heChib3R0b21XaWR0aCwgdG9wV2lkdGgpIC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIC8vIGdldCBtYXggaGVpZ2h0XHJcbiAgICAgICAgY29uc3QgbGVmdEhlaWdodCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLnk7XHJcbiAgICAgICAgY29uc3QgcmlnaHRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnk7XHJcbiAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gTWF0aC5tYXgobGVmdEhlaWdodCwgcmlnaHRIZWlnaHQpIC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBkZXN0IGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IGRlc3RDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIDBdLFxyXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgbWF4SGVpZ2h0IC0gMV0sXHJcbiAgICAgICAgICBbMCwgbWF4SGVpZ2h0IC0gMV1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyBjb252ZXJ0IHRvIG9wZW4gY3YgbWF0cml4IG9iamVjdHNcclxuICAgICAgICBjb25zdCBNcyA9IGN2Lm1hdEZyb21BcnJheSg0LCAxLCBjdi5DVl8zMkZDMiwgW10uY29uY2F0KC4uLnNvdXJjZUNvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgTWQgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5kZXN0Q29vcmRpbmF0ZXMpKTtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1NYXRyaXggPSBjdi5nZXRQZXJzcGVjdGl2ZVRyYW5zZm9ybShNcywgTWQpO1xyXG4gICAgICAgIC8vIHNldCBuZXcgaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUobWF4V2lkdGgsIG1heEhlaWdodCk7XHJcbiAgICAgICAgLy8gcGVyZm9ybSB3YXJwXHJcbiAgICAgICAgY3Yud2FycFBlcnNwZWN0aXZlKGRzdCwgZHN0LCB0cmFuc2Zvcm1NYXRyaXgsIGRzaXplLCBjdi5JTlRFUl9DVUJJQywgY3YuQk9SREVSX0NPTlNUQU5ULCBuZXcgY3YuU2NhbGFyKCkpO1xyXG4gICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG5cclxuICAgICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgICAgTXMuZGVsZXRlKCk7XHJcbiAgICAgICAgTWQuZGVsZXRlKCk7XHJcbiAgICAgICAgdHJhbnNmb3JtTWF0cml4LmRlbGV0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIHRvIHRoZSBpbWFnZVxyXG4gICAqIEBwYXJhbSBwcmV2aWV3IC0gd2hlbiB0cnVlLCB3aWxsIG5vdCBhcHBseSB0aGUgZmlsdGVyIHRvIHRoZSBlZGl0ZWQgaW1hZ2UgYnV0IG9ubHkgZGlzcGxheSBhIHByZXZpZXcuXHJcbiAgICogd2hlbiBmYWxzZSwgd2lsbCBhcHBseSB0byBlZGl0ZWRJbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXBwbHlGaWx0ZXIocHJldmlldzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGJsdXI6IGZhbHNlLFxyXG4gICAgICAgIHRoOiB0cnVlLFxyXG4gICAgICAgIHRoTW9kZTogY3YuQURBUFRJVkVfVEhSRVNIX01FQU5fQyxcclxuICAgICAgICB0aE1lYW5Db3JyZWN0aW9uOiAxMCxcclxuICAgICAgICB0aEJsb2NrU2l6ZTogMjUsXHJcbiAgICAgICAgdGhNYXg6IDI1NSxcclxuICAgICAgICBncmF5U2NhbGU6IHRydWUsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuXHJcbiAgICAgIGlmICghdGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9ICdvcmlnaW5hbCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXRjaCAodGhpcy5zZWxlY3RlZEZpbHRlcikge1xyXG4gICAgICAgIGNhc2UgJ29yaWdpbmFsJzpcclxuICAgICAgICAgIG9wdGlvbnMudGggPSBmYWxzZTtcclxuICAgICAgICAgIG9wdGlvbnMuZ3JheVNjYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ21hZ2ljX2NvbG9yJzpcclxuICAgICAgICAgIG9wdGlvbnMuZ3JheVNjYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdidzInOlxyXG4gICAgICAgICAgb3B0aW9ucy50aE1vZGUgPSBjdi5BREFQVElWRV9USFJFU0hfR0FVU1NJQU5fQztcclxuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xyXG4gICAgICAgICAgb3B0aW9ucy50aEJsb2NrU2l6ZSA9IDE1O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYnczJzpcclxuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IHRydWU7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAob3B0aW9ucy5ncmF5U2NhbGUpIHtcclxuICAgICAgICAgIGN2LmN2dENvbG9yKGRzdCwgZHN0LCBjdi5DT0xPUl9SR0JBMkdSQVksIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5ibHVyKSB7XHJcbiAgICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xyXG4gICAgICAgICAgY3YuR2F1c3NpYW5CbHVyKGRzdCwgZHN0LCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy50aCkge1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKGRzdCwgZHN0LCBvcHRpb25zLnRoTWF4LCBvcHRpb25zLnRoTW9kZSwgY3YuVEhSRVNIX0JJTkFSWSwgb3B0aW9ucy50aEJsb2NrU2l6ZSwgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRzdC5jb252ZXJ0VG8oZHN0LCAtMSwgMSwgNjApO1xyXG4gICAgICAgICAgICBjdi50aHJlc2hvbGQoZHN0LCBkc3QsIDE3MCwgMjU1LCBjdi5USFJFU0hfQklOQVJZKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcmV2aWV3KSB7XHJcbiAgICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93UHJldmlldyhkc3QpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVzaXplIGFuIGltYWdlIHRvIGZpdCBjb25zdHJhaW50cyBzZXQgaW4gb3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHJlc2l6ZShpbWFnZTogSFRNTENhbnZhc0VsZW1lbnQpOiBQcm9taXNlPEhUTUxDYW52YXNFbGVtZW50PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3JjID0gY3YuaW1yZWFkKGltYWdlKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50RGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiBzcmMuc2l6ZSgpLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBzcmMuc2l6ZSgpLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgcmVzaXplRGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoY3VycmVudERpbWVuc2lvbnMud2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCAvIGN1cnJlbnREaW1lbnNpb25zLndpZHRoICogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgICAgICAgaWYgKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0IC8gY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0ICogY3VycmVudERpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKE1hdGguZmxvb3IocmVzaXplRGltZW5zaW9ucy53aWR0aCksIE1hdGguZmxvb3IocmVzaXplRGltZW5zaW9ucy5oZWlnaHQpKTtcclxuICAgICAgICAgIGN2LnJlc2l6ZShzcmMsIHNyYywgZHNpemUsIDAsIDAsIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICAgICAgY29uc3QgcmVzaXplUmVzdWx0ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgY3YuaW1zaG93KHJlc2l6ZVJlc3VsdCwgc3JjKTtcclxuICAgICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUocmVzaXplUmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBpbWFnZSBvbiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dQcmV2aWV3KGltYWdlPzogYW55KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgc3JjO1xyXG4gICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICBzcmMgPSBpbWFnZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzcmMgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgZHN0ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKDAsIDApO1xyXG4gICAgICBjdi5yZXNpemUoc3JjLCBkc3QsIGRzaXplLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgY3YuSU5URVJfQVJFQSk7XHJcbiAgICAgIGN2Lmltc2hvdyh0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudCwgZHN0KTtcclxuICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gVXRpbGl0eSBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc2V0IHByZXZpZXcgY2FudmFzIGRpbWVuc2lvbnMgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXMgZWxlbWVudCBvZiB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucyhpbWc6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAvLyBzZXQgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgIHRoaXMucHJldmlld0RpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aDtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGltZy53aWR0aDtcclxuICAgIHRoaXMuaW1hZ2VEaXZTdHlsZSA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCArIHRoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ21hcmdpbi1sZWZ0JzogYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyICsgJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgLFxyXG4gICAgICAnbWFyZ2luLXJpZ2h0JzogYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyIC0gJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgLFxyXG4gICAgfTtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5zZXRQYW5lRGltZW5zaW9ucyh7d2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGgsIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHR9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZSBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlRGltZW5zaW9ucyh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXI7IHJhdGlvOiBudW1iZXIgfSB7XHJcbiAgICBjb25zdCByYXRpbyA9IHdpZHRoIC8gaGVpZ2h0O1xyXG5cclxuICAgIC8vIGNvbnN0IG1heFdpZHRoID0gdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoID4gdGhpcy5tYXhQcmV2aWV3V2lkdGggP1xyXG4gICAgLy8gICB0aGlzLm1heFByZXZpZXdXaWR0aCA6IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCAtIDQwO1xyXG4gICAgLy8gY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5zY3JlZW5EaW1lbnNpb25zLmhlaWdodCA+IHRoaXMubWF4UHJldmlld0hlaWdodCA/IHRoaXMubWF4UHJldmlld0hlaWdodCA6IHRoaXMuc2NyZWVuRGltZW5zaW9ucy5oZWlnaHQgLSAyNDA7XHJcbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMubWF4UHJldmlld1dpZHRoO1xyXG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5tYXhQcmV2aWV3SGVpZ2h0O1xyXG4gICAgY29uc3QgY2FsY3VsYXRlZCA9IHtcclxuICAgICAgd2lkdGg6IG1heFdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IE1hdGgucm91bmQobWF4V2lkdGggLyByYXRpbyksXHJcbiAgICAgIHJhdGlvOiByYXRpb1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoY2FsY3VsYXRlZC5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcclxuICAgICAgY2FsY3VsYXRlZC5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbiAgICAgIGNhbGN1bGF0ZWQud2lkdGggPSBNYXRoLnJvdW5kKG1heEhlaWdodCAqIHJhdGlvKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYWxjdWxhdGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJucyBhIHBvaW50IGJ5IGl0J3Mgcm9sZXNcclxuICAgKiBAcGFyYW0gcm9sZXMgLSBhbiBhcnJheSBvZiByb2xlcyBieSB3aGljaCB0aGUgcG9pbnQgd2lsbCBiZSBmZXRjaGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRQb2ludChyb2xlczogUm9sZXNBcnJheSkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzLmZpbmQocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheShwb2ludC5yb2xlcywgcm9sZXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRTdG95bGUoKTogeyBbcDogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcclxuICovXHJcbmNsYXNzIEltYWdlRWRpdG9yQ29uZmlnIGltcGxlbWVudHMgRG9jU2Nhbm5lckNvbmZpZyB7XHJcbiAgLyoqXHJcbiAgICogbWF4IGRpbWVuc2lvbnMgb2Ygb3B1dHB1dCBpbWFnZS4gaWYgc2V0IHRvIHplcm9cclxuICAgKi9cclxuICBtYXhJbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAzMDAwMCxcclxuICAgIGhlaWdodDogMzAwMDBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckJhY2tncm91bmRDb2xvciA9ICcjZmVmZWZlJztcclxuICAvKipcclxuICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxyXG4gICAqL1xyXG4gIGVkaXRvckRpbWVuc2lvbnM6IHsgd2lkdGg6IHN0cmluZzsgaGVpZ2h0OiBzdHJpbmc7IH0gPSB7XHJcbiAgICB3aWR0aDogJzEwMHZ3JyxcclxuICAgIGhlaWdodDogJzEwMHZoJ1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogY3NzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgbWFpbiBkaXYgb2YgdGhlIGVkaXRvciBjb21wb25lbnRcclxuICAgKi9cclxuICBleHRyYUNzczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHtcclxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgdG9wOiAwLFxyXG4gICAgbGVmdDogMFxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXHJcbiAgICovXHJcbiAgYnV0dG9uVGhlbWVDb2xvcjogJ3ByaW1hcnknIHwgJ3dhcm4nIHwgJ2FjY2VudCcgPSAnYWNjZW50JztcclxuICAvKipcclxuICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgZXhwb3J0SW1hZ2VJY29uID0gJ2Nsb3VkX3VwbG9hZCc7XHJcbiAgLyoqXHJcbiAgICogY29sb3Igb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sQ29sb3IgPSAnI0ZGMzMzMyc7XHJcbiAgLyoqXHJcbiAgICogc2hhcGUgb2YgdGhlIGNyb3AgdG9vbCwgY2FuIGJlIGVpdGhlciBhIHJlY3RhbmdsZSBvciBhIGNpcmNsZVxyXG4gICAqL1xyXG4gIGNyb3BUb29sU2hhcGU6IFBvaW50U2hhcGUgPSAnY2lyY2xlJztcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBjcm9wVG9vbERpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcclxuICAgIHdpZHRoOiAxMCxcclxuICAgIGhlaWdodDogMTBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyBwb2ludCBhdHRyaWJ1dGVzIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBwb2ludE9wdGlvbnM6IFBvaW50T3B0aW9ucztcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgdGhlIGVkaXRvciBzdHlsZSBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgZWRpdG9yU3R5bGU/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG4gIC8qKlxyXG4gICAqIGNyb3AgdG9vbCBvdXRsaW5lIHdpZHRoXHJcbiAgICovXHJcbiAgY3JvcFRvb2xMaW5lV2VpZ2h0ID0gMztcclxuICAvKipcclxuICAgKiBtYXhpbXVtIHNpemUgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAqL1xyXG4gIG1heFByZXZpZXdXaWR0aCA9IDgwMDtcclxuXHJcbiAgLyoqXHJcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3SGVpZ2h0ID0gODAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBEb2NTY2FubmVyQ29uZmlnKSB7XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVkaXRvclN0eWxlID0geydiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5lZGl0b3JCYWNrZ3JvdW5kQ29sb3J9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmVkaXRvckRpbWVuc2lvbnMpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmV4dHJhQ3NzKTtcclxuXHJcbiAgICB0aGlzLnBvaW50T3B0aW9ucyA9IHtcclxuICAgICAgc2hhcGU6IHRoaXMuY3JvcFRvb2xTaGFwZSxcclxuICAgICAgY29sb3I6IHRoaXMuY3JvcFRvb2xDb2xvcixcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wb2ludE9wdGlvbnMsIHRoaXMuY3JvcFRvb2xEaW1lbnNpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==