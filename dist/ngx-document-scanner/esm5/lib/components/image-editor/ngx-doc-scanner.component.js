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
            if (changes.config.currentValue.maxPreviewWidth !== changes.config.previousValue.maxPreviewWidth) {
                this.maxPreviewWidth = changes.config.currentValue.maxPreviewWidth;
            }
            if (changes.config.currentValue.extraCss !== changes.config.previousValue.extraCss) {
                Object.assign(this.editorStyle, changes.config.currentValue.extraCss);
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
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                // const dst = new cv.Mat();
                cv.transpose(dst, dst);
                if (clockwise) {
                    cv.flip(dst, dst, 1);
                }
                else {
                    cv.flip(dst, dst, 0);
                }
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
                if (clockwise) {
                    _this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
                }
                else {
                    _this.limitsService.rotateAntiClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBSTVDO0lBMkpFLGdDQUFvQixTQUEyQixFQUFVLGFBQTRCLEVBQVUsV0FBMkI7UUFBMUgsaUJBdUJDO1FBdkJtQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBckoxSCxVQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O1FBOENWLGdCQUFXLEdBQUcsS0FBSyxDQUFDOzs7O1FBSXBCLFNBQUksR0FBcUIsTUFBTSxDQUFDOzs7O1FBSXhCLG1CQUFjLEdBQUcsU0FBUyxDQUFDOzs7O1FBWTNCLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDOzs7Ozs7O1FBZ0NRLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQzs7OztRQUk5RCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7Ozs7UUFJMUQsVUFBSyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDOzs7O1FBSW5ELFVBQUssR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQzs7OztRQUkzRCxlQUFVLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFpQ3hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN0QixLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7WUFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1NBQzNCLENBQUM7UUFFRixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUzs7OztRQUFDLFVBQUMsT0FBb0I7WUFDcEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzFCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVCO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDeEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQSxNQUFNO1lBQzNDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQTNKRCxzQkFBSSxvREFBZ0I7UUFIcEI7O1dBRUc7Ozs7O1FBQ0g7WUFBQSxpQkFJQztZQUhDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNOzs7O1lBQUMsVUFBQSxNQUFNO2dCQUNyQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLElBQUksQ0FBQztZQUNuQyxDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBeUdELHNCQUFhLHdDQUFJO1FBUGpCLFlBQVk7UUFDWixZQUFZO1FBQ1osWUFBWTtRQUNaOzs7V0FHRzs7Ozs7Ozs7OztRQUNILFVBQWtCLElBQVU7WUFBNUIsaUJBZ0JDO1lBZkMsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsVUFBVTs7O2dCQUFDO29CQUNULEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTOzs7O2dCQUM5QixVQUFPLE9BQW9COzs7O3FDQUNyQixPQUFPLENBQUMsS0FBSyxFQUFiLHdCQUFhO2dDQUNmLDhCQUE4QjtnQ0FDOUIscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQTs7Z0NBRHpCLDhCQUE4QjtnQ0FDOUIsU0FBeUIsQ0FBQztnQ0FDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O3FCQUUvQixFQUFDLENBQUM7YUFDTjtRQUNILENBQUM7OztPQUFBOzs7O0lBZ0NELHlDQUFROzs7SUFBUjtRQUFBLGlCQThEQztRQTdEQyxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU07OztnQkFBRTtvQkFDTixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFBO2dCQUNELElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbkIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNOzs7Z0JBQUU7b0JBQ04sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTt3QkFDNUIsT0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7cUJBQzdCO2dCQUNILENBQUMsQ0FBQTtnQkFDRCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVU7YUFDdEQ7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLE9BQU87YUFDZDtTQUNGLENBQUM7UUFFRixpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxNQUFNO1lBQy9CLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDNUM7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUM5QyxDQUFDOzs7OztJQUVELDRDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFO2dCQUNoRyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQzthQUNwRTtZQUNELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtnQkFDbEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFFbkM7O09BRUc7Ozs7Ozs7O0lBQ0gscUNBQUk7Ozs7Ozs7O0lBQUo7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsd0NBQU87OztJQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFSyx5Q0FBUTs7O0lBQWQ7Ozs7O3dCQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3dCQUNwQixxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzZCQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBeEIsd0JBQXdCO3dCQUMxQixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBNUIsU0FBNEIsQ0FBQzs7Ozs7O0tBRWhDOzs7O0lBRUQscUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDVyw0Q0FBVzs7Ozs7SUFBekI7Ozs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDO3dCQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7NEJBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQ0FDNUIsSUFBSTs7Ozs0QkFBQyxVQUFBLFlBQVk7Z0NBQ2hCLFlBQVksQ0FBQyxNQUFNOzs7O2dDQUFDLFVBQUMsSUFBSTtvQ0FDdkIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUM5QixDQUFDLEdBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDOUIsQ0FBQyxFQUFDLENBQUM7eUJBQ0o7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7OzRCQUFDLFVBQUMsSUFBSTtnQ0FDM0IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUM5QixDQUFDLEdBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDN0I7Ozs7O0tBQ0Y7SUFFRDs7T0FFRzs7Ozs7O0lBQ0ssOENBQWE7Ozs7O0lBQXJCO1FBQUEsaUJBVUM7O1lBVE8sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUM7O1lBQ3BDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFDRixjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUzs7O1FBQUM7WUFDeEMsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsQ0FBQyxFQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakM7O09BRUc7Ozs7Ozs7Ozs7SUFDSyx5Q0FBUTs7Ozs7Ozs7OztJQUFoQixVQUFpQixJQUFVO1FBQTNCLGlCQXlCQztRQXhCQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFPLE9BQU8sRUFBRSxNQUFNOzs7Ozs7d0JBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O3dCQUV6QixxQkFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzs7Ozt3QkFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozt3QkFHaEMscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzt3QkFBeEIsU0FBd0IsQ0FBQzs7Ozt3QkFFekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7O3dCQUVsQyxrQkFBa0I7d0JBQ2xCLGNBQWM7d0JBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUE7O3dCQUF4SCxTQUF3SCxDQUFDO3dCQUN6SCxVQUFVOzs7d0JBQUM7Ozs0Q0FDVCxxQkFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dDQUEzQixTQUEyQixDQUFDO3dDQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3Q0FDNUIsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsR0FBRSxFQUFFLENBQUMsQ0FBQzs7OzthQUNSLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRzs7Ozs7OztJQUNLLDBDQUFTOzs7Ozs7SUFBakIsVUFBa0IsSUFBVTtRQUE1QixpQkE0Q0M7UUEzQ0MsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7Ozs7Ozt3QkFHMUIscUJBQU0sUUFBUSxFQUFFLEVBQUE7O3dCQUEzQixRQUFRLEdBQUcsU0FBZ0IsQ0FBQzs7Ozt3QkFFNUIsTUFBTSxDQUFDLEtBQUcsQ0FBQyxDQUFDOzs7d0JBRVIsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO3dCQUN2QixHQUFHLENBQUMsTUFBTTs7O3dCQUFHOzs7Ozt3Q0FDWCx5Q0FBeUM7d0NBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUEsQ0FBQzt3Q0FDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzt3Q0FDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3Q0FDL0IsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzt3Q0FDN0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzt3Q0FFbkIsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUs7NkNBQ3pELENBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFBLEVBQTdDLHdCQUE2Qzt3Q0FDL0MsS0FBQSxJQUFJLENBQUE7d0NBQWUscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUE7O3dDQUF0RCxHQUFLLFdBQVcsR0FBRyxTQUFtQyxDQUFDOzs7d0NBRXpELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO3dDQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzt3Q0FDdEQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3Q0FDaEQsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsQ0FBQSxDQUFDO3dCQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDOzs7O2FBQ3BCLEVBQUMsQ0FBQzs7Ozs7UUFLSCxTQUFTLFFBQVE7WUFDZixPQUFPLElBQUksT0FBTzs7Ozs7WUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOztvQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsTUFBTTs7OztnQkFBRyxVQUFDLEtBQUs7b0JBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPOzs7O2dCQUFHLFVBQUMsR0FBRztvQkFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVELDhCQUE4QjtJQUM5Qiw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCOztPQUVHOzs7Ozs7Ozs7SUFDSCw0Q0FBVzs7Ozs7Ozs7O0lBQVgsVUFBWSxTQUFnQjtRQUE1QixpQkF5Q0M7UUF6Q1csMEJBQUEsRUFBQSxnQkFBZ0I7UUFDMUIsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixVQUFVOzs7WUFBQzs7b0JBQ0gsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQztnQkFDdkMsNEJBQTRCO2dCQUM1QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN0QjtxQkFBTTtvQkFDTCxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO2dCQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakMsZ0JBQWdCO2dCQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7OztvQkFFUCx3QkFBd0IsR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7b0JBQzFELGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDaEQscUJBQXFCO2dCQUNyQixrQ0FBa0M7Z0JBQ2xDLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7OztvQkFFMUMsbUJBQW1CLEdBQUc7b0JBQzFCLEtBQUssRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDLEtBQUs7b0JBQ3BFLE1BQU0sRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLHdCQUF3QixDQUFDLE1BQU07aUJBQ3hFO2dCQUNELGtDQUFrQztnQkFFbEMsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztpQkFDckc7cUJBQU07b0JBQ0wsS0FBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUN6RztnQkFDRCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSTs7O2dCQUFDO29CQUN0QixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxFQUFDLENBQUM7WUFDTCxDQUFDLEdBQUUsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7UUFFSTs7Ozs7OztJQUNJLCtDQUFjOzs7Ozs7SUFBdEI7UUFBQSxpQkF3S0M7UUF2S0MsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixVQUFVOzs7WUFBQzs7O29CQUVILHFCQUFxQixHQUFHLEdBQUc7O29CQUMzQixHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDOztvQkFDakMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDOztvQkFDbEQsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7O29CQUN2RixLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQy9CLHVFQUF1RTtnQkFDdkUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzFELCtCQUErQjtnQkFDL0IsZ0JBQWdCO2dCQUVoQixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsS0FBSyxVQUFVLEVBQUU7b0JBQzFELEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDaEg7cUJBQU0sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEtBQUssZUFBZSxFQUFFO29CQUN0RSxFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixFQUMxRixFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkY7cUJBQU0sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEtBQUssbUJBQW1CLEVBQUU7b0JBQzFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsMEJBQTBCLEVBQzlGLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2Rjs7b0JBRUssUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRTs7b0JBQzdCLFNBQVMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzlCLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7b0JBQzNFLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O29CQUVoQixLQUFLLEdBQUcsRUFBRTtnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTs7d0JBQ2xDLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7d0JBQ3BCLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQzs7d0JBQ3hCLEdBQUcsR0FBRyxJQUFJO29CQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7MkJBQ3RDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQzsyQkFDbEQsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUN0Qzt3QkFDQSxTQUFTO3FCQUNWO29CQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNyQyxJQUNFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUs7K0JBQ3ZCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzsrQkFDcEUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQ2pGOzRCQUNBLEdBQUcsR0FBRyxLQUFLLENBQUM7NEJBQ1osTUFBTTt5QkFDUDtxQkFDRjtvQkFFRCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNmO2lCQUNGOztvQkFFRyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNyQyw2Q0FBNkM7b0JBQzdDLDBCQUEwQjtvQkFDMUIsdUNBQXVDO29CQUN2QyxvQ0FBb0M7b0JBQ3BDLHlCQUF5QjtvQkFDekIsYUFBYTtvQkFDYixNQUFNO29CQUNOLElBQUk7b0JBQ0osb0JBQW9CO29CQUNwQixjQUFjO29CQUNkLElBQUk7b0JBQ0osSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzJCQUNyRixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDOytCQUN2RSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pHO3dCQUNBLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2xCO2lCQUNGOzs7Ozs7O29CQU1LLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLHlCQUF5QjtnQkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDdkQ7OztvQkFJSyxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7Z0JBRWpDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsK0NBQStDO2dCQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU87Ozs7Z0JBQUMsVUFBQSxHQUFHO29CQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDaEQsQ0FBQyxFQUFDLENBQUM7O29CQUVDLGtCQUFrQjs7b0JBRWhCLFVBQVUsR0FBZSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7b0JBQzlHLFdBQVcsR0FBZSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7b0JBQy9HLFVBQVUsR0FBZSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7b0JBQzlHLFdBQVcsR0FBZSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzs7b0JBRS9HLEtBQUssR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQzs7b0JBQzFELEVBQUUsR0FBRyxFQUFFOztvQkFDUCxFQUFFLEdBQUcsRUFBRTtnQkFFYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFO3dCQUN6QixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNaO3lCQUFNO3dCQUNMLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ1o7aUJBQ0Y7Z0JBRUQsbUJBQW1CO2dCQUNuQixtQkFBbUI7Z0JBRW5CLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzVCO3FCQUFNO29CQUNMLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzNCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzNCO2dCQUVELElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzVCO3FCQUFNO29CQUNMLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzVCO2dCQUVELHNCQUFzQjtnQkFFdEIsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQjt1QkFDOUIsS0FBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxFQUNyQztvQkFDQSxrQkFBa0IsR0FBRzt3QkFDbkIsSUFBSSxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsVUFBVSxDQUFDO3dCQUN4RSxJQUFJLGtCQUFrQixDQUFDLEVBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxXQUFXLENBQUM7d0JBQ3pFLElBQUksa0JBQWtCLENBQUMsRUFBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLFVBQVUsQ0FBQzt3QkFDeEUsSUFBSSxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsV0FBVyxDQUFDO3FCQUMxRSxDQUFDO2lCQUNIO3FCQUFNO29CQUNMLGtCQUFrQixHQUFHO3dCQUNuQixJQUFJLGtCQUFrQixDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDL0QsSUFBSSxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDN0UsSUFBSSxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUM5RixJQUFJLGtCQUFrQixDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNqRixDQUFDO2lCQUNIO2dCQUdELEtBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDeEQsK0JBQStCO2dCQUMvQixPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBRUQsc0NBQUs7Ozs7O0lBQUwsVUFBTSxVQUFVLEVBQUUsYUFBYTs7WUFFekIsS0FBSyxHQUFHLENBQUM7UUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckMsS0FBSyxFQUFFLENBQUM7YUFDVDtTQUNGO1FBRUQsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBRXBCLENBQUM7Ozs7OztJQUVELHVDQUFNOzs7OztJQUFOLFVBQU8sVUFBVSxFQUFFLGdCQUFnQjtRQUNqQyxPQUFPLFVBQVUsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7OztJQUVPLG9EQUFtQjs7Ozs7SUFBM0IsVUFBNEIsUUFBYTtRQUN2QyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNLLDBDQUFTOzs7OztJQUFqQjtRQUFBLGlCQXNEQztRQXJEQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLFVBQVU7OztZQUFDOztvQkFDSCxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDOzs7b0JBR2pDLGlCQUFpQixHQUFHO29CQUN4QixLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUM5QixLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMvQixLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNsQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUNsQyxDQUFDLEdBQUc7Ozs7Z0JBQUMsVUFBQSxLQUFLO29CQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM1RSxDQUFDLEVBQUM7OztvQkFHSSxXQUFXLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7b0JBQ3hGLFFBQVEsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztvQkFDL0UsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEtBQUksQ0FBQyxnQkFBZ0I7OztvQkFFbEUsVUFBVSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUNuRixXQUFXLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7b0JBQ3RGLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsR0FBRyxLQUFJLENBQUMsZ0JBQWdCOzs7b0JBRXJFLGVBQWUsR0FBRztvQkFDdEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNOLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2pCLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUM3QixDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjs7O29CQUdLLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsTUFBTSxPQUFULEVBQUUsV0FBVyxpQkFBaUIsR0FBRTs7b0JBQ3hFLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsTUFBTSxPQUFULEVBQUUsV0FBVyxlQUFlLEdBQUU7O29CQUN0RSxlQUFlLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7OztvQkFFcEQsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUM5QyxlQUFlO2dCQUNmLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRWpDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ1osRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNaLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFekIsS0FBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDaEQsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUk7OztnQkFBQztvQkFDdEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUMsRUFBQyxDQUFDO1lBQ0wsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFDSyw0Q0FBVzs7Ozs7OztJQUFuQixVQUFvQixPQUFnQjtRQUFwQyxpQkErREM7UUE5REMsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7OztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O2dCQUVyQixPQUFPLEdBQUc7b0JBQ2QsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsRUFBRSxFQUFFLElBQUk7b0JBQ1IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0I7b0JBQ2pDLGdCQUFnQixFQUFFLEVBQUU7b0JBQ3BCLFdBQVcsRUFBRSxFQUFFO29CQUNmLEtBQUssRUFBRSxHQUFHO29CQUNWLFNBQVMsRUFBRSxJQUFJO2lCQUNoQjtnQkFDSyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUV2QyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7b0JBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDO2lCQUNsQztnQkFFRCxRQUFRLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQzNCLEtBQUssVUFBVTt3QkFDYixPQUFPLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQzt3QkFDbkIsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7d0JBQzFCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO3dCQUNyQixNQUFNO29CQUNSLEtBQUssYUFBYTt3QkFDaEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7d0JBQzFCLE1BQU07b0JBQ1IsS0FBSyxLQUFLO3dCQUNSLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUFDO3dCQUMvQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO3dCQUM5QixPQUFPLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzt3QkFDekIsTUFBTTtvQkFDUixLQUFLLEtBQUs7d0JBQ1IsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ3BCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7d0JBQzlCLE1BQU07aUJBQ1Q7Z0JBRUQsVUFBVTs7O2dCQUFDOzs7OztnQ0FDVCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7b0NBQ3JCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUM5QztnQ0FDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0NBQ1YsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29DQUMvQixFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lDQUMzRDtnQ0FDRCxJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7b0NBQ2QsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO3dDQUNyQixFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FDQUNoSTt5Q0FBTTt3Q0FDTCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztxQ0FDcEQ7aUNBQ0Y7Z0NBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQ0FDWixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7aUNBQ2xDO2dDQUNELHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUE7O2dDQUEzQixTQUEyQixDQUFDO2dDQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDNUIsT0FBTyxFQUFFLENBQUM7Ozs7cUJBQ1gsR0FBRSxFQUFFLENBQUMsQ0FBQzs7O2FBQ1IsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHOzs7Ozs7O0lBQ0ssdUNBQU07Ozs7OztJQUFkLFVBQWUsS0FBd0I7UUFBdkMsaUJBaUNDO1FBaENDLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsVUFBVTs7O1lBQUM7O29CQUNILEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs7b0JBQ3RCLGlCQUFpQixHQUFHO29CQUN4QixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUs7b0JBQ3ZCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTTtpQkFDMUI7O29CQUNLLGdCQUFnQixHQUFHO29CQUN2QixLQUFLLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUsQ0FBQztpQkFDVjtnQkFDRCxJQUFJLGlCQUFpQixDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtvQkFDbkUsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDO29CQUMvRCxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztvQkFDckgsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7d0JBQ3BFLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzt3QkFDakUsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7cUJBQ3RIOzt3QkFDSyxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDbEcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7d0JBQzFDLFlBQVksR0FBRyxtQkFBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBQTtvQkFDeEUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDYixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN2QjtxQkFBTTtvQkFDTCxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNoQjtZQUNILENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHOzs7Ozs7O0lBQ0ssNENBQVc7Ozs7OztJQUFuQixVQUFvQixLQUFXO1FBQS9CLGlCQWdCQztRQWZDLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07O2dCQUM3QixHQUFHO1lBQ1AsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsR0FBRyxHQUFHLEtBQUssQ0FBQzthQUNiO2lCQUFNO2dCQUNMLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNuQzs7Z0JBQ0ssR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRTs7Z0JBQ2xCLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hGLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDakQsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLHFCQUFxQjtJQUNyQjs7T0FFRzs7Ozs7Ozs7OztJQUNLLHlEQUF3Qjs7Ozs7Ozs7OztJQUFoQyxVQUFpQyxHQUFzQjtRQUNyRCw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztRQUN0RSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztRQUN4RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsSUFBSTtZQUNsRixNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFJO1lBQ3JGLGFBQWEsRUFBRSxtQkFBZ0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxFQUFFLG1CQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBSztZQUMzSCxjQUFjLEVBQUUsbUJBQWdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsRUFBRSxtQkFBYSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssR0FBRyxDQUFDLFFBQUs7U0FDN0gsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDckgsQ0FBQztJQUVEOztPQUVHOzs7Ozs7OztJQUNLLG9EQUFtQjs7Ozs7OztJQUEzQixVQUE0QixLQUFhLEVBQUUsTUFBYzs7WUFDakQsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNOztZQUV0QixRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxFQUFFOztZQUNuRCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxHQUFHOztZQUM5QyxVQUFVLEdBQUc7WUFDakIsS0FBSyxFQUFFLFFBQVE7WUFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3BDLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFFRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO1lBQ2pDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDbEQ7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0sseUNBQVE7Ozs7OztJQUFoQixVQUFpQixLQUFpQjtRQUFsQyxpQkFJQztRQUhDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJOzs7O1FBQUMsVUFBQSxLQUFLO1lBQzNCLE9BQU8sS0FBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXYzQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLDR3RkFBK0M7O2lCQUVoRDs7OztnQkFSTyxnQkFBZ0I7Z0JBTmhCLGFBQWE7Z0JBQ2IsY0FBYzs7O2dDQXdHbkIsU0FBUyxTQUFDLGVBQWUsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUM7NkJBWTdDLE1BQU07NkJBSU4sTUFBTTt3QkFJTixNQUFNO3dCQUlOLE1BQU07NkJBSU4sTUFBTTt1QkFTTixLQUFLO3lCQXFCTCxLQUFLOztJQSt0QlIsNkJBQUM7Q0FBQSxBQXgzQkQsSUF3M0JDO1NBbjNCWSxzQkFBc0I7OztJQUNqQyx1Q0FBVTs7Ozs7SUFLVix5Q0FBMkI7Ozs7OztJQU8zQiwrQ0FBaUQ7Ozs7OztJQWNqRCxpREFBZ0M7Ozs7O0lBSWhDLCtDQUFrRDs7Ozs7SUFJbEQsNkNBQWdEOzs7Ozs7SUFRaEQseUNBQXdCOzs7OztJQUl4Qiw2Q0FBb0I7Ozs7O0lBSXBCLHNDQUFnQzs7Ozs7O0lBSWhDLGdEQUFtQzs7Ozs7O0lBUW5DLGtEQUEwQzs7Ozs7O0lBSTFDLGlEQUdFOzs7OztJQUlGLG1EQUFtQzs7Ozs7O0lBSW5DLGtEQUFpQzs7Ozs7O0lBSWpDLCtDQUE0Qjs7Ozs7O0lBSTVCLDZDQUF1Qzs7Ozs7O0lBSXZDLCtDQUFrRjs7Ozs7O0lBSWxGLHdDQUEyQzs7Ozs7SUFRM0MsNENBQXdFOzs7OztJQUl4RSw0Q0FBb0U7Ozs7O0lBSXBFLHVDQUE2RDs7Ozs7SUFJN0QsdUNBQXFFOzs7OztJQUlyRSw0Q0FBMEU7Ozs7O0lBOEIxRSx3Q0FBa0M7Ozs7O0lBRXRCLDJDQUFtQzs7Ozs7SUFBRSwrQ0FBb0M7Ozs7O0lBQUUsNkNBQW1DOzs7OztBQWt1QjVIOzs7O0lBb0VFLDJCQUFZLE9BQXlCO1FBQXJDLGlCQWtCQzs7OztRQWxGRCx1QkFBa0IsR0FBb0I7WUFDcEMsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsS0FBSztTQUNkLENBQUM7Ozs7UUFJRiwwQkFBcUIsR0FBRyxTQUFTLENBQUM7Ozs7UUFJbEMscUJBQWdCLEdBQXVDO1lBQ3JELEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLE9BQU87U0FDaEIsQ0FBQzs7OztRQUlGLGFBQVEsR0FBdUM7WUFDN0MsUUFBUSxFQUFFLFVBQVU7WUFDcEIsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7Ozs7UUFLRixxQkFBZ0IsR0FBa0MsUUFBUSxDQUFDOzs7O1FBSTNELG9CQUFlLEdBQUcsY0FBYyxDQUFDOzs7O1FBSWpDLGtCQUFhLEdBQUcsU0FBUyxDQUFDOzs7O1FBSTFCLGtCQUFhLEdBQWUsUUFBUSxDQUFDOzs7O1FBSXJDLHVCQUFrQixHQUFvQjtZQUNwQyxLQUFLLEVBQUUsRUFBRTtZQUNULE1BQU0sRUFBRSxFQUFFO1NBQ1gsQ0FBQzs7OztRQVlGLHVCQUFrQixHQUFHLENBQUMsQ0FBQzs7OztRQUl2QixvQkFBZSxHQUFHLEdBQUcsQ0FBQztRQUdwQixJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsR0FBRztnQkFDOUIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBQyxDQUFDO1FBQ3BFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBdkZELElBdUZDOzs7Ozs7SUFuRkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBMkQ7Ozs7O0lBSTNELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBcUM7Ozs7O0lBSXJDLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQWlEOzs7OztJQUlqRCwrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0xpbWl0c1NlcnZpY2UsIFBvaW50UG9zaXRpb25DaGFuZ2UsIFBvc2l0aW9uQ2hhbmdlRGF0YSwgUm9sZXNBcnJheX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGltaXRzLnNlcnZpY2UnO1xyXG5pbXBvcnQge01hdEJvdHRvbVNoZWV0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xyXG5pbXBvcnQge05neEZpbHRlck1lbnVDb21wb25lbnR9IGZyb20gJy4uL2ZpbHRlci1tZW51L25neC1maWx0ZXItbWVudS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0VkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zLCBQb2ludFNoYXBlfSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcclxuLy8gaW1wb3J0IHtOZ3hPcGVuQ1ZTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uZ3gtb3BlbmN2LnNlcnZpY2UnO1xyXG5pbXBvcnQge0RvY1NjYW5uZXJDb25maWcsIEltYWdlRGltZW5zaW9ucywgT3BlbkNWU3RhdGV9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XHJcbmltcG9ydCB7Tmd4T3BlbkNWU2VydmljZX0gZnJvbSAnbmd4LW9wZW5jdic7XHJcblxyXG5kZWNsYXJlIHZhciBjdjogYW55O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZG9jLXNjYW5uZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEb2NTY2FubmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIHZhbHVlID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGNvbmZpZyBvYmplY3RcclxuICAgKi9cclxuICBvcHRpb25zOiBJbWFnZUVkaXRvckNvbmZpZztcclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIENPTkZJRyAvL1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBhY3Rpb24gYnV0dG9ucyBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciBzY3JlZW5cclxuICAgKi9cclxuICBwcml2YXRlIGVkaXRvckJ1dHRvbnM6IEFycmF5PEVkaXRvckFjdGlvbkJ1dHRvbj47XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgYnV0dG9ucyBhY2NvcmRpbmcgdG8gdGhlIGVkaXRvciBtb2RlXHJcbiAgICovXHJcbiAgZ2V0IGRpc3BsYXllZEJ1dHRvbnMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JCdXR0b25zLmZpbHRlcihidXR0b24gPT4ge1xyXG4gICAgICByZXR1cm4gYnV0dG9uLm1vZGUgPT09IHRoaXMubW9kZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbWF4IHdpZHRoIG9mIHRoZSBwcmV2aWV3IGFyZWFcclxuICAgKi9cclxuICBwcml2YXRlIG1heFByZXZpZXdXaWR0aDogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGltYWdlRGl2U3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGRpdiBzdHlsZVxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRURJVE9SIFNUQVRFIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjdlN0YXRlOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogdHJ1ZSBhZnRlciB0aGUgaW1hZ2UgaXMgbG9hZGVkIGFuZCBwcmV2aWV3IGlzIGRpc3BsYXllZFxyXG4gICAqL1xyXG4gIGltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIG1vZGVcclxuICAgKi9cclxuICBtb2RlOiAnY3JvcCcgfCAnY29sb3InID0gJ2Nyb3AnO1xyXG4gIC8qKlxyXG4gICAqIGZpbHRlciBzZWxlY3RlZCBieSB0aGUgdXNlciwgcmV0dXJuZWQgYnkgdGhlIGZpbHRlciBzZWxlY3RvciBib3R0b20gc2hlZXRcclxuICAgKi9cclxuICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyID0gJ2RlZmF1bHQnO1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gT1BFUkFUSU9OIFZBUklBQkxFUyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzY3JlZW5EaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogaW1hZ2UgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMCxcclxuICAgIGhlaWdodDogMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgcHJldmlld0RpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcclxuICAvKipcclxuICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW1hZ2VSZXNpemVSYXRpbzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgb3JpZ2luYWwgaW1hZ2UgZm9yIHJlc2V0IHB1cnBvc2VzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlOiBGaWxlO1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgZWRpdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0ZWRJbWFnZTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgLyoqXHJcbiAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xyXG4gICAqL1xyXG4gIEBWaWV3Q2hpbGQoJ1ByZXZpZXdDYW52YXMnLCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgcHJldmlld0NhbnZhczogRWxlbWVudFJlZjtcclxuICAvKipcclxuICAgKiBhbiBhcnJheSBvZiBwb2ludHMgdXNlZCBieSB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xyXG5cclxuICAvLyAqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVWRU5UIEVNSVRURVJTIC8vXHJcbiAgLy8gKioqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGV4aXRFZGl0b3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqXHJcbiAgICogZmlyZXMgb24gZWRpdCBjb21wbGV0aW9uXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcclxuICAvKipcclxuICAgKiBlbWl0cyBlcnJvcnMsIGNhbiBiZSBsaW5rZWQgdG8gYW4gZXJyb3IgaGFuZGxlciBvZiBjaG9pY2VcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHJlYWR5OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdHJ1ZSB3aGVuIHByb2Nlc3NpbmcgaXMgZG9uZSwgZmFsc2Ugd2hlbiBjb21wbGV0ZWRcclxuICAgKi9cclxuICBAT3V0cHV0KCkgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICAvLyAqKioqKiogLy9cclxuICAvLyBJTlBVVFMgLy9cclxuICAvLyAqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcclxuICAgKiBAcGFyYW0gZmlsZSAtIGZpbGUgZnJvbSBmb3JtIGlucHV0XHJcbiAgICovXHJcbiAgQElucHV0KCkgc2V0IGZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgaWYgKGZpbGUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGZpbGU7XHJcbiAgICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKFxyXG4gICAgICAgIGFzeW5jIChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICAgICAgLy8gcmVhZCBmaWxlIHRvIGltYWdlICYgY2FudmFzXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZEZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hPcGVuQ3Y6IE5neE9wZW5DVlNlcnZpY2UsIHByaXZhdGUgbGltaXRzU2VydmljZTogTGltaXRzU2VydmljZSwgcHJpdmF0ZSBib3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQpIHtcclxuICAgIHRoaXMuc2NyZWVuRGltZW5zaW9ucyA9IHtcclxuICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gc3RhdHVzIG9mIGN2IG1vZHVsZVxyXG4gICAgdGhpcy5uZ3hPcGVuQ3YuY3ZTdGF0ZS5zdWJzY3JpYmUoKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XHJcbiAgICAgIHRoaXMuY3ZTdGF0ZSA9IGN2U3RhdGUuc3RhdGU7XHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdChjdlN0YXRlLnJlYWR5KTtcclxuICAgICAgaWYgKGN2U3RhdGUuZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKCdlcnJvciBsb2FkaW5nIGN2JykpO1xyXG4gICAgICB9IGVsc2UgaWYgKGN2U3RhdGUubG9hZGluZykge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKGN2U3RhdGUucmVhZHkpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBwb3NpdGlvbnMgb2YgY3JvcCB0b29sXHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25zLnN1YnNjcmliZShwb2ludHMgPT4ge1xyXG4gICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmVkaXRvckJ1dHRvbnMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZXhpdCcsXHJcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV4aXRFZGl0b3IuZW1pdCgnY2FuY2VsZWQnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb246ICdhcnJvd19iYWNrJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY3JvcCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdyb3RhdGUnLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy5yb3RhdGVJbWFnZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIGljb246ICdyb3RhdGVfcmlnaHQnLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2RvbmVfY3JvcCcsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLmRvbmVDcm9wKCksXHJcbiAgICAgICAgaWNvbjogJ2RvbmUnLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjcm9wJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2JhY2snLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy51bmRvKCksXHJcbiAgICAgICAgaWNvbjogJ2Fycm93X2JhY2snLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjb2xvcidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdmaWx0ZXInLFxyXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaG9vc2VGaWx0ZXJzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAncGhvdG9fZmlsdGVyJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiB0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUgPyAnY29sb3InIDogJ2Rpc2FibGVkJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3VwbG9hZCcsXHJcbiAgICAgICAgYWN0aW9uOiB0aGlzLmV4cG9ydEltYWdlLmJpbmQodGhpcyksXHJcbiAgICAgICAgaWNvbjogJ2Nsb3VkX3VwbG9hZCcsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2NvbG9yJ1xyXG4gICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBzZXQgb3B0aW9ucyBmcm9tIGNvbmZpZyBvYmplY3RcclxuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBJbWFnZUVkaXRvckNvbmZpZyh0aGlzLmNvbmZpZyk7XHJcbiAgICAvLyBzZXQgZXhwb3J0IGltYWdlIGljb25cclxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgIGlmIChidXR0b24ubmFtZSA9PT0gJ3VwbG9hZCcpIHtcclxuICAgICAgICBidXR0b24uaWNvbiA9IHRoaXMub3B0aW9ucy5leHBvcnRJbWFnZUljb247XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggPSB0aGlzLm9wdGlvbnMubWF4UHJldmlld1dpZHRoO1xyXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHRoaXMub3B0aW9ucy5lZGl0b3JTdHlsZTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChjaGFuZ2VzLmNvbmZpZykge1xyXG4gICAgICBpZiAoY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLnRocmVzaG9sZEluZm8udGhyZXNoICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLnRocmVzaG9sZEluZm8udGhyZXNoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUubWF4UHJldmlld1dpZHRoICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLm1heFByZXZpZXdXaWR0aCkge1xyXG4gICAgICAgIHRoaXMubWF4UHJldmlld1dpZHRoID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLm1heFByZXZpZXdXaWR0aDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlLmV4dHJhQ3NzICE9PSBjaGFuZ2VzLmNvbmZpZy5wcmV2aW91c1ZhbHVlLmV4dHJhQ3NzKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUuZXh0cmFDc3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIGVkaXRvciBhY3Rpb24gYnV0dG9ucyBtZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuXHJcbiAgLyoqXHJcbiAgICogZW1pdHMgdGhlIGV4aXRFZGl0b3IgZXZlbnRcclxuICAgKi9cclxuICBleGl0KCkge1xyXG4gICAgdGhpcy5leGl0RWRpdG9yLmVtaXQoJ2NhbmNlbGVkJyk7XHJcbiAgfVxyXG5cclxuICBnZXRNb2RlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5tb2RlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZG9uZUNyb3AoKSB7XHJcbiAgICB0aGlzLm1vZGUgPSAnY29sb3InO1xyXG4gICAgYXdhaXQgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcih0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICB0aGlzLm1vZGUgPSAnY3JvcCc7XHJcbiAgICB0aGlzLmxvYWRGaWxlKHRoaXMub3JpZ2luYWxJbWFnZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIsIGFuZCB3aGVuIGRvbmUgZW1pdHMgdGhlIHJlc3VsdGVkIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhc3luYyBleHBvcnRJbWFnZSgpIHtcclxuICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIoZmFsc2UpO1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMpIHtcclxuICAgICAgdGhpcy5yZXNpemUodGhpcy5lZGl0ZWRJbWFnZSlcclxuICAgICAgLnRoZW4ocmVzaXplUmVzdWx0ID0+IHtcclxuICAgICAgICByZXNpemVSZXN1bHQudG9CbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRSZXN1bHQuZW1pdChibG9iKTtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICB9LCB0aGlzLm9yaWdpbmFsSW1hZ2UudHlwZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lZGl0ZWRJbWFnZS50b0Jsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICB0aGlzLmVkaXRSZXN1bHQuZW1pdChibG9iKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgIH0sIHRoaXMub3JpZ2luYWxJbWFnZS50eXBlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIG9wZW4gdGhlIGJvdHRvbSBzaGVldCBmb3Igc2VsZWN0aW5nIGZpbHRlcnMsIGFuZCBhcHBsaWVzIHRoZSBzZWxlY3RlZCBmaWx0ZXIgaW4gcHJldmlldyBtb2RlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjaG9vc2VGaWx0ZXJzKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHtmaWx0ZXI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJ9O1xyXG4gICAgY29uc3QgYm90dG9tU2hlZXRSZWYgPSB0aGlzLmJvdHRvbVNoZWV0Lm9wZW4oTmd4RmlsdGVyTWVudUNvbXBvbmVudCwge1xyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KTtcclxuICAgIGJvdHRvbVNoZWV0UmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IGRhdGEuZmlsdGVyO1xyXG4gICAgICB0aGlzLmFwcGx5RmlsdGVyKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gRmlsZSBJbnB1dCAmIE91dHB1dCBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogbG9hZCBpbWFnZSBmcm9tIGlucHV0IGZpZWxkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlYWRJbWFnZShmaWxlKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChuZXcgRXJyb3IoZXJyKSk7XHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dQcmV2aWV3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBwYW5lIGxpbWl0c1xyXG4gICAgICAvLyBzaG93IHBvaW50c1xyXG4gICAgICB0aGlzLmltYWdlTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgYXdhaXQgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xyXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLmRldGVjdENvbnRvdXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgMTUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkIGltYWdlIGZyb20gRmlsZSBvYmplY3RcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRJbWFnZShmaWxlOiBGaWxlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgaW1hZ2VTcmM7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaW1hZ2VTcmMgPSBhd2FpdCByZWFkRmlsZSgpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgaW1nLm9ubG9hZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBzZXQgZWRpdGVkIGltYWdlIGNhbnZhcyBhbmQgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS53aWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlLmhlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5lZGl0ZWRJbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgICAgICAvLyByZXNpemUgaW1hZ2UgaWYgbGFyZ2VyIHRoYW4gbWF4IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCB3aWR0aCA9IGltZy53aWR0aCA+IGltZy5oZWlnaHQgPyBpbWcuaGVpZ2h0IDogaW1nLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UgPSBhd2FpdCB0aGlzLnJlc2l6ZSh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLmVkaXRlZEltYWdlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgICAgaW1nLnNyYyA9IGltYWdlU3JjO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGZpbGUgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZWFkRmlsZSgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIub25lcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gSW1hZ2UgUHJvY2Vzc2luZyBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogcm90YXRlIGltYWdlIDkwIGRlZ3JlZXNcclxuICAgKi9cclxuICByb3RhdGVJbWFnZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIC8vIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgICBjdi50cmFuc3Bvc2UoZHN0LCBkc3QpO1xyXG4gICAgICAgIGlmIChjbG9ja3dpc2UpIHtcclxuICAgICAgICAgIGN2LmZsaXAoZHN0LCBkc3QsIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjdi5mbGlwKGRzdCwgZHN0LCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG4gICAgICAgIC8vIHNyYy5kZWxldGUoKTtcclxuICAgICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgICAgLy8gc2F2ZSBjdXJyZW50IHByZXZpZXcgZGltZW5zaW9ucyBhbmQgcG9zaXRpb25zXHJcbiAgICAgICAgY29uc3QgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zID0ge3dpZHRoOiAwLCBoZWlnaHQ6IDB9O1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCB0aGlzLnByZXZpZXdEaW1lbnNpb25zKTtcclxuICAgICAgICBjb25zdCBpbml0aWFsUG9zaXRpb25zID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cyk7XHJcbiAgICAgICAgLy8gZ2V0IG5ldyBkaW1lbnNpb25zXHJcbiAgICAgICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIC8vIGdldCBwcmV2aWV3IHBhbmUgcmVzaXplIHJhdGlvXHJcbiAgICAgICAgY29uc3QgcHJldmlld1Jlc2l6ZVJhdGlvcyA9IHtcclxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoIC8gaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuXHJcbiAgICAgICAgaWYgKGNsb2Nrd2lzZSkge1xyXG4gICAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUNsb2Nrd2lzZShwcmV2aWV3UmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2Uucm90YXRlQW50aUNsb2Nrd2lzZShwcmV2aWV3UmVzaXplUmF0aW9zLCBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMsIGluaXRpYWxQb3NpdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGV0ZWN0cyB0aGUgY29udG91cnMgb2YgdGhlIGRvY3VtZW50IGFuZFxyXG4gICAqKi9cclxuICBwcml2YXRlIGRldGVjdENvbnRvdXJzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIGxvYWQgdGhlIGltYWdlIGFuZCBjb21wdXRlIHRoZSByYXRpbyBvZiB0aGUgb2xkIGhlaWdodCB0byB0aGUgbmV3IGhlaWdodCwgY2xvbmUgaXQsIGFuZCByZXNpemUgaXRcclxuICAgICAgICBjb25zdCBwcm9jZXNzaW5nUmVzaXplUmF0aW8gPSAwLjU7XHJcbiAgICAgICAgY29uc3Qgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2Lk1hdC56ZXJvcyhzcmMucm93cywgc3JjLmNvbHMsIGN2LkNWXzhVQzMpO1xyXG4gICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoc3JjLnJvd3MgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8sIHNyYy5jb2xzICogcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvKTtcclxuICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGltYWdlIHRvIGdyYXlzY2FsZSwgYmx1ciBpdCwgYW5kIGZpbmQgZWRnZXMgaW4gdGhlIGltYWdlXHJcbiAgICAgICAgY3YuY3Z0Q29sb3Ioc3JjLCBzcmMsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XHJcbiAgICAgICAgY3YuR2F1c3NpYW5CbHVyKHNyYywgc3JjLCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xyXG4gICAgICAgIC8vIGN2LkNhbm55KHNyYywgc3JjLCA3NSwgMjAwKTtcclxuICAgICAgICAvLyBmaW5kIGNvbnRvdXJzXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICAgIGN2LnRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2gsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LlRIUkVTSF9CSU5BUlkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnYWRhcHRpdmVfbWVhbicpIHtcclxuICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxyXG4gICAgICAgICAgICBjdi5USFJFU0hfQklOQVJZLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmJsb2NrU2l6ZSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5jKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ2FkYXB0aXZlX2dhdXNzaWFuJykge1xyXG4gICAgICAgICAgY3YuYWRhcHRpdmVUaHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8ubWF4VmFsdWUsIGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DLFxyXG4gICAgICAgICAgICBjdi5USFJFU0hfQklOQVJZLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLmJsb2NrU2l6ZSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRvdXJzID0gbmV3IGN2Lk1hdFZlY3RvcigpO1xyXG4gICAgICAgIGNvbnN0IGhpZXJhcmNoeSA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgICBjdi5maW5kQ29udG91cnMoc3JjLCBjb250b3VycywgaGllcmFyY2h5LCBjdi5SRVRSX0NDT01QLCBjdi5DSEFJTl9BUFBST1hfU0lNUExFKTtcclxuICAgICAgICBjb25zdCBjbnQgPSBjb250b3Vycy5nZXQoNCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29udG91cnMpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tVU5JUVVFIFJFQ1RBTkdMRVMgRlJPTSBBTEwgQ09OVE9VUlMtLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgY29uc3QgcmVjdHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRvdXJzLnNpemUoKTsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBjbiA9IGNvbnRvdXJzLmdldChpKTtcclxuICAgICAgICAgIGNvbnN0IHIgPSBjdi5taW5BcmVhUmVjdChjbik7XHJcbiAgICAgICAgICBsZXQgYWRkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChyLnNpemUuaGVpZ2h0IDwgNTAgfHwgci5zaXplLndpZHRoIDwgNTBcclxuICAgICAgICAgICAgfHwgci5hbmdsZSA9PT0gOTAgfHwgci5hbmdsZSA9PT0gMTgwIHx8IHIuYW5nbGUgPT09IDBcclxuICAgICAgICAgICAgfHwgci5hbmdsZSA9PT0gLTkwIHx8IHIuYW5nbGUgPT09IC0xODBcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlY3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICByZWN0c1tqXS5hbmdsZSA9PT0gci5hbmdsZVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLmNlbnRlci54ID09PSByLmNlbnRlci54ICYmIHJlY3RzW2pdLmNlbnRlci55ID09PSByLmNlbnRlci55XHJcbiAgICAgICAgICAgICAgJiYgcmVjdHNbal0uc2l6ZS53aWR0aCA9PT0gci5zaXplLndpZHRoICYmIHJlY3RzW2pdLnNpemUuaGVpZ2h0ID09PSByLnNpemUuaGVpZ2h0XHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIGFkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICByZWN0cy5wdXNoKHIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlY3QyID0gY3YubWluQXJlYVJlY3QoY250KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAvLyBjb25zdCB2ID0gY3YuUm90YXRlZFJlY3QucG9pbnRzKHJlY3RzW2ldKTtcclxuICAgICAgICAgIC8vIGxldCBpc05lZ2F0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAvLyBmb3IgKGxldCBqID0gMDsgaiA8IHYubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIC8vICAgaWYgKHZbal0ueCA8IDAgfHwgdltqXS55IDwgMCkge1xyXG4gICAgICAgICAgLy8gICAgIGlzTmVnYXRpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAvLyBpZiAoaXNOZWdhdGl2ZSkge1xyXG4gICAgICAgICAgLy8gICBjb250aW51ZTtcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIGlmICgoKHJlY3RzW2ldLnNpemUud2lkdGggKiByZWN0c1tpXS5zaXplLmhlaWdodCkgPiAocmVjdDIuc2l6ZS53aWR0aCAqIHJlY3QyLnNpemUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAmJiAhKHJlY3RzW2ldLmFuZ2xlID09PSA5MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMTgwIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgICAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC05MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gLTE4MCkgJiYgKChyZWN0c1tpXS5hbmdsZSA+IDg1IHx8IHJlY3RzW2ldLmFuZ2xlIDwgNSkpKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJlY3QyID0gcmVjdHNbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlY3RzKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlY3QyKTtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0Mik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codmVydGljZXMpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS54ID0gdmVydGljZXNbaV0ueCAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAgIHZlcnRpY2VzW2ldLnkgPSB2ZXJ0aWNlc1tpXS55ICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codmVydGljZXMpO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gY3YuYm91bmRpbmdSZWN0KHNyYyk7XHJcblxyXG4gICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICBoaWVyYXJjaHkuZGVsZXRlKCk7XHJcbiAgICAgICAgY29udG91cnMuZGVsZXRlKCk7XHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRoZSByZWN0YW5nbGUgaW50byBhIHNldCBvZiBwb2ludHNcclxuICAgICAgICBPYmplY3Qua2V5cyhyZWN0KS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICByZWN0W2tleV0gPSByZWN0W2tleV0gKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb250b3VyQ29vcmRpbmF0ZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0Um9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1swXSwgW3ZlcnRpY2VzWzFdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbM11dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMV0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCB0aGlyZFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMl0sIFt2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCBmb3VydGhSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzNdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1sxXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcblxyXG4gICAgICAgIGNvbnN0IHJvbGVzID0gW2ZpcnN0Um9sZXMsIHNlY29uZFJvbGVzLCB0aGlyZFJvbGVzLCBmb3VydGhSb2xlc107XHJcbiAgICAgICAgY29uc3QgdHMgPSBbXTtcclxuICAgICAgICBjb25zdCBicyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocm9sZXNbaV1bMF0gPT09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIHRzLnB1c2goaSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicy5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codHMpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMZWZ0KHZlcnRpY2VzW3RzWzBdXSwgdmVydGljZXNbdHNbMV1dKSkge1xyXG4gICAgICAgICAgcm9sZXNbdHNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgIHJvbGVzW3RzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByb2xlc1t0c1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICAgIHJvbGVzW3RzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xlZnQodmVydGljZXNbYnNbMF1dLCB2ZXJ0aWNlc1tic1sxXV0pKSB7XHJcbiAgICAgICAgICByb2xlc1tic1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgcm9sZXNbYnNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJvbGVzW2JzWzFdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICByb2xlc1tic1swXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJvbGVzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnVzZVJvdGF0ZWRSZWN0YW5nbGVcclxuICAgICAgICAgICYmIHRoaXMucG9pbnRzQXJlTm90VGhlU2FtZSh2ZXJ0aWNlcylcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnRvdXJDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMF0ueCwgeTogdmVydGljZXNbMF0ueX0sIGZpcnN0Um9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1sxXS54LCB5OiB2ZXJ0aWNlc1sxXS55fSwgc2Vjb25kUm9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1syXS54LCB5OiB2ZXJ0aWNlc1syXS55fSwgdGhpcmRSb2xlcyksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzNdLngsIHk6IHZlcnRpY2VzWzNdLnl9LCBmb3VydGhSb2xlcyksXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCwgeTogcmVjdC55fSwgWydsZWZ0JywgJ3RvcCddKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55fSwgWydyaWdodCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydyaWdodCcsICdib3R0b20nXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ2xlZnQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvblBvaW50cyhjb250b3VyQ29vcmRpbmF0ZXMpO1xyXG4gICAgICAgIC8vIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNUb3AoY29vcmRpbmF0ZSwgb3RoZXJWZXJ0aWNlcyk6IGJvb2xlYW4ge1xyXG5cclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG90aGVyVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGNvb3JkaW5hdGUueSA8IG90aGVyVmVydGljZXNbaV0ueSkge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnQgPj0gMjtcclxuXHJcbiAgfVxyXG5cclxuICBpc0xlZnQoY29vcmRpbmF0ZSwgc2Vjb25kQ29vcmRpbmF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGNvb3JkaW5hdGUueCA8IHNlY29uZENvb3JkaW5hdGUueDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9pbnRzQXJlTm90VGhlU2FtZSh2ZXJ0aWNlczogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISh2ZXJ0aWNlc1swXS54ID09PSB2ZXJ0aWNlc1sxXS54ICYmIHZlcnRpY2VzWzFdLnggPT09IHZlcnRpY2VzWzJdLnggJiYgdmVydGljZXNbMl0ueCA9PT0gdmVydGljZXNbM10ueCAmJlxyXG4gICAgICB2ZXJ0aWNlc1swXS55ID09PSB2ZXJ0aWNlc1sxXS55ICYmIHZlcnRpY2VzWzFdLnkgPT09IHZlcnRpY2VzWzJdLnkgJiYgdmVydGljZXNbMl0ueSA9PT0gdmVydGljZXNbM10ueSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBseSBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1cclxuICAgKi9cclxuICBwcml2YXRlIHRyYW5zZm9ybSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBzb3VyY2UgY29vcmRpbmF0ZXMgbWF0cml4XHJcbiAgICAgICAgY29uc3Qgc291cmNlQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKVxyXG4gICAgICAgIF0ubWFwKHBvaW50ID0+IHtcclxuICAgICAgICAgIHJldHVybiBbcG9pbnQueCAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgcG9pbnQueSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpb107XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBtYXggd2lkdGhcclxuICAgICAgICBjb25zdCBib3R0b21XaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IHRvcFdpZHRoID0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS54IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLng7XHJcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBNYXRoLm1heChib3R0b21XaWR0aCwgdG9wV2lkdGgpIC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIC8vIGdldCBtYXggaGVpZ2h0XHJcbiAgICAgICAgY29uc3QgbGVmdEhlaWdodCA9IHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAnbGVmdCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLnk7XHJcbiAgICAgICAgY29uc3QgcmlnaHRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnk7XHJcbiAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gTWF0aC5tYXgobGVmdEhlaWdodCwgcmlnaHRIZWlnaHQpIC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBkZXN0IGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IGRlc3RDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIDBdLFxyXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgbWF4SGVpZ2h0IC0gMV0sXHJcbiAgICAgICAgICBbMCwgbWF4SGVpZ2h0IC0gMV1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyBjb252ZXJ0IHRvIG9wZW4gY3YgbWF0cml4IG9iamVjdHNcclxuICAgICAgICBjb25zdCBNcyA9IGN2Lm1hdEZyb21BcnJheSg0LCAxLCBjdi5DVl8zMkZDMiwgW10uY29uY2F0KC4uLnNvdXJjZUNvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgTWQgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5kZXN0Q29vcmRpbmF0ZXMpKTtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1NYXRyaXggPSBjdi5nZXRQZXJzcGVjdGl2ZVRyYW5zZm9ybShNcywgTWQpO1xyXG4gICAgICAgIC8vIHNldCBuZXcgaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUobWF4V2lkdGgsIG1heEhlaWdodCk7XHJcbiAgICAgICAgLy8gcGVyZm9ybSB3YXJwXHJcbiAgICAgICAgY3Yud2FycFBlcnNwZWN0aXZlKGRzdCwgZHN0LCB0cmFuc2Zvcm1NYXRyaXgsIGRzaXplLCBjdi5JTlRFUl9DVUJJQywgY3YuQk9SREVSX0NPTlNUQU5ULCBuZXcgY3YuU2NhbGFyKCkpO1xyXG4gICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xyXG5cclxuICAgICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgICAgTXMuZGVsZXRlKCk7XHJcbiAgICAgICAgTWQuZGVsZXRlKCk7XHJcbiAgICAgICAgdHJhbnNmb3JtTWF0cml4LmRlbGV0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIHRvIHRoZSBpbWFnZVxyXG4gICAqIEBwYXJhbSBwcmV2aWV3IC0gd2hlbiB0cnVlLCB3aWxsIG5vdCBhcHBseSB0aGUgZmlsdGVyIHRvIHRoZSBlZGl0ZWQgaW1hZ2UgYnV0IG9ubHkgZGlzcGxheSBhIHByZXZpZXcuXHJcbiAgICogd2hlbiBmYWxzZSwgd2lsbCBhcHBseSB0byBlZGl0ZWRJbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXBwbHlGaWx0ZXIocHJldmlldzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGJsdXI6IGZhbHNlLFxyXG4gICAgICAgIHRoOiB0cnVlLFxyXG4gICAgICAgIHRoTW9kZTogY3YuQURBUFRJVkVfVEhSRVNIX01FQU5fQyxcclxuICAgICAgICB0aE1lYW5Db3JyZWN0aW9uOiAxMCxcclxuICAgICAgICB0aEJsb2NrU2l6ZTogMjUsXHJcbiAgICAgICAgdGhNYXg6IDI1NSxcclxuICAgICAgICBncmF5U2NhbGU6IHRydWUsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuXHJcbiAgICAgIGlmICghdGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9ICdvcmlnaW5hbCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXRjaCAodGhpcy5zZWxlY3RlZEZpbHRlcikge1xyXG4gICAgICAgIGNhc2UgJ29yaWdpbmFsJzpcclxuICAgICAgICAgIG9wdGlvbnMudGggPSBmYWxzZTtcclxuICAgICAgICAgIG9wdGlvbnMuZ3JheVNjYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ21hZ2ljX2NvbG9yJzpcclxuICAgICAgICAgIG9wdGlvbnMuZ3JheVNjYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdidzInOlxyXG4gICAgICAgICAgb3B0aW9ucy50aE1vZGUgPSBjdi5BREFQVElWRV9USFJFU0hfR0FVU1NJQU5fQztcclxuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xyXG4gICAgICAgICAgb3B0aW9ucy50aEJsb2NrU2l6ZSA9IDE1O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYnczJzpcclxuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IHRydWU7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAob3B0aW9ucy5ncmF5U2NhbGUpIHtcclxuICAgICAgICAgIGN2LmN2dENvbG9yKGRzdCwgZHN0LCBjdi5DT0xPUl9SR0JBMkdSQVksIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5ibHVyKSB7XHJcbiAgICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xyXG4gICAgICAgICAgY3YuR2F1c3NpYW5CbHVyKGRzdCwgZHN0LCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy50aCkge1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKGRzdCwgZHN0LCBvcHRpb25zLnRoTWF4LCBvcHRpb25zLnRoTW9kZSwgY3YuVEhSRVNIX0JJTkFSWSwgb3B0aW9ucy50aEJsb2NrU2l6ZSwgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRzdC5jb252ZXJ0VG8oZHN0LCAtMSwgMSwgNjApO1xyXG4gICAgICAgICAgICBjdi50aHJlc2hvbGQoZHN0LCBkc3QsIDE3MCwgMjU1LCBjdi5USFJFU0hfQklOQVJZKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcmV2aWV3KSB7XHJcbiAgICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93UHJldmlldyhkc3QpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVzaXplIGFuIGltYWdlIHRvIGZpdCBjb25zdHJhaW50cyBzZXQgaW4gb3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIHJlc2l6ZShpbWFnZTogSFRNTENhbnZhc0VsZW1lbnQpOiBQcm9taXNlPEhUTUxDYW52YXNFbGVtZW50PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3JjID0gY3YuaW1yZWFkKGltYWdlKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50RGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiBzcmMuc2l6ZSgpLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBzcmMuc2l6ZSgpLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgcmVzaXplRGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoY3VycmVudERpbWVuc2lvbnMud2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aDtcclxuICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCAvIGN1cnJlbnREaW1lbnNpb25zLndpZHRoICogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgICAgICAgaWYgKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0IC8gY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0ICogY3VycmVudERpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKE1hdGguZmxvb3IocmVzaXplRGltZW5zaW9ucy53aWR0aCksIE1hdGguZmxvb3IocmVzaXplRGltZW5zaW9ucy5oZWlnaHQpKTtcclxuICAgICAgICAgIGN2LnJlc2l6ZShzcmMsIHNyYywgZHNpemUsIDAsIDAsIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICAgICAgY29uc3QgcmVzaXplUmVzdWx0ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgY3YuaW1zaG93KHJlc2l6ZVJlc3VsdCwgc3JjKTtcclxuICAgICAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUocmVzaXplUmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBpbWFnZSBvbiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dQcmV2aWV3KGltYWdlPzogYW55KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgc3JjO1xyXG4gICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICBzcmMgPSBpbWFnZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzcmMgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgZHN0ID0gbmV3IGN2Lk1hdCgpO1xyXG4gICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKDAsIDApO1xyXG4gICAgICBjdi5yZXNpemUoc3JjLCBkc3QsIGRzaXplLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgY3YuSU5URVJfQVJFQSk7XHJcbiAgICAgIGN2Lmltc2hvdyh0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudCwgZHN0KTtcclxuICAgICAgc3JjLmRlbGV0ZSgpO1xyXG4gICAgICBkc3QuZGVsZXRlKCk7XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLy8gVXRpbGl0eSBNZXRob2RzIC8vXHJcbiAgLy8gKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc2V0IHByZXZpZXcgY2FudmFzIGRpbWVuc2lvbnMgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXMgZWxlbWVudCBvZiB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIHNldFByZXZpZXdQYW5lRGltZW5zaW9ucyhpbWc6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAvLyBzZXQgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgIHRoaXMucHJldmlld0RpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aDtcclxuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gICAgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvID0gdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGltZy53aWR0aDtcclxuICAgIHRoaXMuaW1hZ2VEaXZTdHlsZSA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoICsgJ3B4JyxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCArIHRoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ21hcmdpbi1sZWZ0JzogYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyICsgJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgLFxyXG4gICAgICAnbWFyZ2luLXJpZ2h0JzogYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyIC0gJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgLFxyXG4gICAgfTtcclxuICAgIHRoaXMubGltaXRzU2VydmljZS5zZXRQYW5lRGltZW5zaW9ucyh7d2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGgsIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHR9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZSBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IGNhbnZhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY3VsYXRlRGltZW5zaW9ucyh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXI7IHJhdGlvOiBudW1iZXIgfSB7XHJcbiAgICBjb25zdCByYXRpbyA9IHdpZHRoIC8gaGVpZ2h0O1xyXG5cclxuICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoID4gdGhpcy5tYXhQcmV2aWV3V2lkdGggP1xyXG4gICAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA6IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCAtIDQwO1xyXG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5zY3JlZW5EaW1lbnNpb25zLmhlaWdodCAtIDI0MDtcclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSB7XHJcbiAgICAgIHdpZHRoOiBtYXhXaWR0aCxcclxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKG1heFdpZHRoIC8gcmF0aW8pLFxyXG4gICAgICByYXRpbzogcmF0aW9cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGNhbGN1bGF0ZWQuaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XHJcbiAgICAgIGNhbGN1bGF0ZWQuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICBjYWxjdWxhdGVkLndpZHRoID0gTWF0aC5yb3VuZChtYXhIZWlnaHQgKiByYXRpbyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FsY3VsYXRlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBwb2ludCBieSBpdCdzIHJvbGVzXHJcbiAgICogQHBhcmFtIHJvbGVzIC0gYW4gYXJyYXkgb2Ygcm9sZXMgYnkgd2hpY2ggdGhlIHBvaW50IHdpbGwgYmUgZmV0Y2hlZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0UG9pbnQocm9sZXM6IFJvbGVzQXJyYXkpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50cy5maW5kKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGEgY2xhc3MgZm9yIGdlbmVyYXRpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzIGZvciB0aGUgZWRpdG9yXHJcbiAqL1xyXG5jbGFzcyBJbWFnZUVkaXRvckNvbmZpZyBpbXBsZW1lbnRzIERvY1NjYW5uZXJDb25maWcge1xyXG4gIC8qKlxyXG4gICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXHJcbiAgICovXHJcbiAgbWF4SW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMzAwMDAsXHJcbiAgICBoZWlnaHQ6IDMwMDAwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZlZmVmZSc7XHJcbiAgLyoqXHJcbiAgICogY3NzIHByb3BlcnRpZXMgZm9yIHRoZSBtYWluIGVkaXRvciBkaXZcclxuICAgKi9cclxuICBlZGl0b3JEaW1lbnNpb25zOiB7IHdpZHRoOiBzdHJpbmc7IGhlaWdodDogc3RyaW5nOyB9ID0ge1xyXG4gICAgd2lkdGg6ICcxMDB2dycsXHJcbiAgICBoZWlnaHQ6ICcxMDB2aCdcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZXh0cmFDc3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH0gPSB7XHJcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgIHRvcDogMCxcclxuICAgIGxlZnQ6IDBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBtYXRlcmlhbCBkZXNpZ24gdGhlbWUgY29sb3IgbmFtZVxyXG4gICAqL1xyXG4gIGJ1dHRvblRoZW1lQ29sb3I6ICdwcmltYXJ5JyB8ICd3YXJuJyB8ICdhY2NlbnQnID0gJ2FjY2VudCc7XHJcbiAgLyoqXHJcbiAgICogaWNvbiBmb3IgdGhlIGJ1dHRvbiB0aGF0IGNvbXBsZXRlcyB0aGUgZWRpdGluZyBhbmQgZW1pdHMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIGV4cG9ydEltYWdlSWNvbiA9ICdjbG91ZF91cGxvYWQnO1xyXG4gIC8qKlxyXG4gICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2xcclxuICAgKi9cclxuICBjcm9wVG9vbENvbG9yID0gJyNGRjMzMzMnO1xyXG4gIC8qKlxyXG4gICAqIHNoYXBlIG9mIHRoZSBjcm9wIHRvb2wsIGNhbiBiZSBlaXRoZXIgYSByZWN0YW5nbGUgb3IgYSBjaXJjbGVcclxuICAgKi9cclxuICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlID0gJ2NpcmNsZSc7XHJcbiAgLyoqXHJcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XHJcbiAgICB3aWR0aDogMTAsXHJcbiAgICBoZWlnaHQ6IDEwXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgcG9pbnQgYXR0cmlidXRlcyBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHRoZSBlZGl0b3Igc3R5bGUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGVkaXRvclN0eWxlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuICAvKipcclxuICAgKiBjcm9wIHRvb2wgb3V0bGluZSB3aWR0aFxyXG4gICAqL1xyXG4gIGNyb3BUb29sTGluZVdlaWdodCA9IDM7XHJcbiAgLyoqXHJcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcclxuICAgKi9cclxuICBtYXhQcmV2aWV3V2lkdGggPSA4MDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IERvY1NjYW5uZXJDb25maWcpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB7J2JhY2tncm91bmQtY29sb3InOiB0aGlzLmVkaXRvckJhY2tncm91bmRDb2xvcn07XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZWRpdG9yRGltZW5zaW9ucyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdG9yU3R5bGUsIHRoaXMuZXh0cmFDc3MpO1xyXG5cclxuICAgIHRoaXMucG9pbnRPcHRpb25zID0ge1xyXG4gICAgICBzaGFwZTogdGhpcy5jcm9wVG9vbFNoYXBlLFxyXG4gICAgICBjb2xvcjogdGhpcy5jcm9wVG9vbENvbG9yLFxyXG4gICAgICB3aWR0aDogMCxcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnBvaW50T3B0aW9ucywgdGhpcy5jcm9wVG9vbERpbWVuc2lvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuIl19