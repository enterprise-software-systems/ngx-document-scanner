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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUgsT0FBTyxFQUFDLGFBQWEsRUFBdUIsa0JBQWtCLEVBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUNqSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFJaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBSTVDO0lBMkpFLGdDQUFvQixTQUEyQixFQUFVLGFBQTRCLEVBQVUsV0FBMkI7UUFBMUgsaUJBdUJDO1FBdkJtQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBckoxSCxVQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O1FBOENWLGdCQUFXLEdBQUcsS0FBSyxDQUFDOzs7O1FBSXBCLFNBQUksR0FBcUIsTUFBTSxDQUFDOzs7O1FBSXhCLG1CQUFjLEdBQUcsU0FBUyxDQUFDOzs7O1FBWTNCLG9CQUFlLEdBQW9CO1lBQ3pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDOzs7Ozs7O1FBZ0NRLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQzs7OztRQUk5RCxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7Ozs7UUFJMUQsVUFBSyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDOzs7O1FBSW5ELFVBQUssR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQzs7OztRQUkzRCxlQUFVLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFpQ3hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN0QixLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7WUFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1NBQzNCLENBQUM7UUFFRixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUzs7OztRQUFDLFVBQUMsT0FBb0I7WUFDcEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzFCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVCO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDeEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQSxNQUFNO1lBQzNDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQTNKRCxzQkFBSSxvREFBZ0I7UUFIcEI7O1dBRUc7Ozs7O1FBQ0g7WUFBQSxpQkFJQztZQUhDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNOzs7O1lBQUMsVUFBQSxNQUFNO2dCQUNyQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLElBQUksQ0FBQztZQUNuQyxDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBeUdELHNCQUFhLHdDQUFJO1FBUGpCLFlBQVk7UUFDWixZQUFZO1FBQ1osWUFBWTtRQUNaOzs7V0FHRzs7Ozs7Ozs7OztRQUNILFVBQWtCLElBQVU7WUFBNUIsaUJBZ0JDO1lBZkMsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsVUFBVTs7O2dCQUFDO29CQUNULEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTOzs7O2dCQUM5QixVQUFPLE9BQW9COzs7O3FDQUNyQixPQUFPLENBQUMsS0FBSyxFQUFiLHdCQUFhO2dDQUNmLDhCQUE4QjtnQ0FDOUIscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQTs7Z0NBRHpCLDhCQUE4QjtnQ0FDOUIsU0FBeUIsQ0FBQztnQ0FDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O3FCQUUvQixFQUFDLENBQUM7YUFDTjtRQUNILENBQUM7OztPQUFBOzs7O0lBZ0NELHlDQUFROzs7SUFBUjtRQUFBLGlCQThEQztRQTdEQyxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU07OztnQkFBRTtvQkFDTixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFBO2dCQUNELElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbkIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNOzs7Z0JBQUU7b0JBQ04sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTt3QkFDNUIsT0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7cUJBQzdCO2dCQUNILENBQUMsQ0FBQTtnQkFDRCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVU7YUFDdEQ7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLE9BQU87YUFDZDtTQUNGLENBQUM7UUFFRixpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxNQUFNO1lBQy9CLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDNUM7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUM5QyxDQUFDOzs7OztJQUVELDRDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ25DO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFFbkM7O09BRUc7Ozs7Ozs7O0lBQ0gscUNBQUk7Ozs7Ozs7O0lBQUo7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsd0NBQU87OztJQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFSyx5Q0FBUTs7O0lBQWQ7Ozs7O3dCQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3dCQUNwQixxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzZCQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBeEIsd0JBQXdCO3dCQUMxQixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBNUIsU0FBNEIsQ0FBQzs7Ozs7O0tBRWhDOzs7O0lBRUQscUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDVyw0Q0FBVzs7Ozs7SUFBekI7Ozs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDO3dCQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7NEJBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQ0FDNUIsSUFBSTs7Ozs0QkFBQyxVQUFBLFlBQVk7Z0NBQ2hCLFlBQVksQ0FBQyxNQUFNOzs7O2dDQUFDLFVBQUMsSUFBSTtvQ0FDdkIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUM5QixDQUFDLEdBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDOUIsQ0FBQyxFQUFDLENBQUM7eUJBQ0o7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7OzRCQUFDLFVBQUMsSUFBSTtnQ0FDM0IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQzNCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUM5QixDQUFDLEdBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDN0I7Ozs7O0tBQ0Y7SUFFRDs7T0FFRzs7Ozs7O0lBQ0ssOENBQWE7Ozs7O0lBQXJCO1FBQUEsaUJBVUM7O1lBVE8sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUM7O1lBQ3BDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFDRixjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUzs7O1FBQUM7WUFDeEMsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsQ0FBQyxFQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakM7O09BRUc7Ozs7Ozs7Ozs7SUFDSyx5Q0FBUTs7Ozs7Ozs7OztJQUFoQixVQUFpQixJQUFVO1FBQTNCLGlCQXlCQztRQXhCQyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxVQUFPLE9BQU8sRUFBRSxNQUFNOzs7Ozs7d0JBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O3dCQUV6QixxQkFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzs7Ozt3QkFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozt3QkFHaEMscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzt3QkFBeEIsU0FBd0IsQ0FBQzs7Ozt3QkFFekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFHLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQzs7O3dCQUVsQyxrQkFBa0I7d0JBQ2xCLGNBQWM7d0JBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUE7O3dCQUF4SCxTQUF3SCxDQUFDO3dCQUN6SCxVQUFVOzs7d0JBQUM7Ozs0Q0FDVCxxQkFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dDQUEzQixTQUEyQixDQUFDO3dDQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3Q0FDNUIsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsR0FBRSxFQUFFLENBQUMsQ0FBQzs7OzthQUNSLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRzs7Ozs7OztJQUNLLDBDQUFTOzs7Ozs7SUFBakIsVUFBa0IsSUFBVTtRQUE1QixpQkE0Q0M7UUEzQ0MsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7Ozs7Ozt3QkFHMUIscUJBQU0sUUFBUSxFQUFFLEVBQUE7O3dCQUEzQixRQUFRLEdBQUcsU0FBZ0IsQ0FBQzs7Ozt3QkFFNUIsTUFBTSxDQUFDLEtBQUcsQ0FBQyxDQUFDOzs7d0JBRVIsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO3dCQUN2QixHQUFHLENBQUMsTUFBTTs7O3dCQUFHOzs7Ozt3Q0FDWCx5Q0FBeUM7d0NBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUEsQ0FBQzt3Q0FDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzt3Q0FDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3Q0FDL0IsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzt3Q0FDN0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzt3Q0FFbkIsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUs7NkNBQ3pELENBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFBLEVBQTdDLHdCQUE2Qzt3Q0FDL0MsS0FBQSxJQUFJLENBQUE7d0NBQWUscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUE7O3dDQUF0RCxHQUFLLFdBQVcsR0FBRyxTQUFtQyxDQUFDOzs7d0NBRXpELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO3dDQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzt3Q0FDdEQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3Q0FDaEQsT0FBTyxFQUFFLENBQUM7Ozs7NkJBQ1gsQ0FBQSxDQUFDO3dCQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDOzs7O2FBQ3BCLEVBQUMsQ0FBQzs7Ozs7UUFLSCxTQUFTLFFBQVE7WUFDZixPQUFPLElBQUksT0FBTzs7Ozs7WUFBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOztvQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsTUFBTTs7OztnQkFBRyxVQUFDLEtBQUs7b0JBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPOzs7O2dCQUFHLFVBQUMsR0FBRztvQkFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVELDhCQUE4QjtJQUM5Qiw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCOztPQUVHOzs7Ozs7Ozs7SUFDSCw0Q0FBVzs7Ozs7Ozs7O0lBQVgsVUFBWSxTQUFnQjtRQUE1QixpQkF5Q0M7UUF6Q1csMEJBQUEsRUFBQSxnQkFBZ0I7UUFDMUIsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixVQUFVOzs7WUFBQzs7b0JBQ0gsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQztnQkFDdkMsNEJBQTRCO2dCQUM1QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN0QjtxQkFBTTtvQkFDTCxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO2dCQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakMsZ0JBQWdCO2dCQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7OztvQkFFUCx3QkFBd0IsR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7b0JBQzFELGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDaEQscUJBQXFCO2dCQUNyQixrQ0FBa0M7Z0JBQ2xDLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7OztvQkFFMUMsbUJBQW1CLEdBQUc7b0JBQzFCLEtBQUssRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDLEtBQUs7b0JBQ3BFLE1BQU0sRUFBRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLHdCQUF3QixDQUFDLE1BQU07aUJBQ3hFO2dCQUNELGtDQUFrQztnQkFFbEMsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztpQkFDckc7cUJBQU07b0JBQ0wsS0FBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUN6RztnQkFDRCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSTs7O2dCQUFDO29CQUN0QixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxFQUFDLENBQUM7WUFDTCxDQUFDLEdBQUUsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7UUFFSTs7Ozs7OztJQUNJLCtDQUFjOzs7Ozs7SUFBdEI7UUFBQSxpQkF3S0M7UUF2S0MsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixVQUFVOzs7WUFBQzs7O29CQUVILHFCQUFxQixHQUFHLEdBQUc7O29CQUMzQixHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDOztvQkFDakMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDOztvQkFDbEQsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7O29CQUN2RixLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQy9CLHVFQUF1RTtnQkFDdkUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzFELEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLGdCQUFnQjtnQkFFaEIsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEtBQUssVUFBVSxFQUFFO29CQUMxRCxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ2hIO3FCQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxLQUFLLGVBQWUsRUFBRTtvQkFDdEUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsRUFDMUYsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZGO3FCQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxLQUFLLG1CQUFtQixFQUFFO29CQUMxRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLDBCQUEwQixFQUM5RixFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkY7O29CQUVLLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7O29CQUM3QixTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFO2dCQUM5QixFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O29CQUMzRSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7OztvQkFFaEIsS0FBSyxHQUFHLEVBQUU7Z0JBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUNsQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O3dCQUNwQixDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7O3dCQUN4QixHQUFHLEdBQUcsSUFBSTtvQkFDZCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFOzJCQUN0QyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUM7MkJBQ2xELENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsRUFDdEM7d0JBQ0EsU0FBUztxQkFDVjtvQkFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDckMsSUFDRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLOytCQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7K0JBQ3BFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUNqRjs0QkFDQSxHQUFHLEdBQUcsS0FBSyxDQUFDOzRCQUNaLE1BQU07eUJBQ1A7cUJBQ0Y7b0JBRUQsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDZjtpQkFDRjs7b0JBRUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMsNkNBQTZDO29CQUM3QywwQkFBMEI7b0JBQzFCLHVDQUF1QztvQkFDdkMsb0NBQW9DO29CQUNwQyx5QkFBeUI7b0JBQ3pCLGFBQWE7b0JBQ2IsTUFBTTtvQkFDTixJQUFJO29CQUNKLG9CQUFvQjtvQkFDcEIsY0FBYztvQkFDZCxJQUFJO29CQUNKLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzsyQkFDckYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQzsrQkFDdkUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6Rzt3QkFDQSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNsQjtpQkFDRjs7Ozs7OztvQkFNSyxRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUM3Qyx5QkFBeUI7Z0JBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzFCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3RELFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUM7aUJBQ3ZEOzs7b0JBSUssSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO2dCQUVqQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2xCLCtDQUErQztnQkFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPOzs7O2dCQUFDLFVBQUEsR0FBRztvQkFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2hELENBQUMsRUFBQyxDQUFDOztvQkFFQyxrQkFBa0I7O29CQUVoQixVQUFVLEdBQWUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7O29CQUM5RyxXQUFXLEdBQWUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7O29CQUMvRyxVQUFVLEdBQWUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7O29CQUM5RyxXQUFXLEdBQWUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7O29CQUUvRyxLQUFLLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7O29C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QUFPLEVBQUU7WUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxVQUFBLEdBQUc7Z0JBQzlCLEtBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxFQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYTtZQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDekIsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQXZGRCxJQXVGQzs7Ozs7O0lBbkZDLCtDQUdFOzs7OztJQUlGLGtEQUFrQzs7Ozs7SUFJbEMsNkNBR0U7Ozs7O0lBSUYscUNBSUU7Ozs7O0lBS0YsNkNBQTJEOzs7OztJQUkzRCw0Q0FBaUM7Ozs7O0lBSWpDLDBDQUEwQjs7Ozs7SUFJMUIsMENBQXFDOzs7OztJQUlyQywrQ0FHRTs7Ozs7SUFJRix5Q0FBMkI7Ozs7O0lBSTNCLHdDQUFpRDs7Ozs7SUFJakQsK0NBQXVCOzs7OztJQUl2Qiw0Q0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlLCBQb3NpdGlvbkNoYW5nZURhdGEsIFJvbGVzQXJyYXl9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xpbWl0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHtNYXRCb3R0b21TaGVldH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYm90dG9tLXNoZWV0JztcclxuaW1wb3J0IHtOZ3hGaWx0ZXJNZW51Q29tcG9uZW50fSBmcm9tICcuLi9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHtFZGl0b3JBY3Rpb25CdXR0b24sIFBvaW50T3B0aW9ucywgUG9pbnRTaGFwZX0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XHJcbi8vIGltcG9ydCB7Tmd4T3BlbkNWU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmd4LW9wZW5jdi5zZXJ2aWNlJztcclxuaW1wb3J0IHtEb2NTY2FubmVyQ29uZmlnLCBJbWFnZURpbWVuc2lvbnMsIE9wZW5DVlN0YXRlfSBmcm9tICcuLi8uLi9QdWJsaWNNb2RlbHMnO1xyXG5pbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJ25neC1vcGVuY3YnO1xyXG5cclxuZGVjbGFyZSB2YXIgY3Y6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWRvYy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4RG9jU2Nhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICB2YWx1ZSA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBjb25maWcgb2JqZWN0XHJcbiAgICovXHJcbiAgb3B0aW9uczogSW1hZ2VFZGl0b3JDb25maWc7XHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVESVRPUiBDT05GSUcgLy9cclxuICAvLyAqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgYWN0aW9uIGJ1dHRvbnMgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3Igc2NyZWVuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+O1xyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIGJ1dHRvbnMgYWNjb3JkaW5nIHRvIHRoZSBlZGl0b3IgbW9kZVxyXG4gICAqL1xyXG4gIGdldCBkaXNwbGF5ZWRCdXR0b25zKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yQnV0dG9ucy5maWx0ZXIoYnV0dG9uID0+IHtcclxuICAgICAgcmV0dXJuIGJ1dHRvbi5tb2RlID09PSB0aGlzLm1vZGU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBtYXhQcmV2aWV3V2lkdGg6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBpbWFnZSBjb250YWluZXJcclxuICAgKi9cclxuICBpbWFnZURpdlN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9O1xyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBkaXYgc3R5bGVcclxuICAgKi9cclxuICBlZGl0b3JTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfTtcclxuXHJcbiAgLy8gKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEVESVRPUiBTVEFURSAvL1xyXG4gIC8vICoqKioqKioqKioqKiogLy9cclxuICAvKipcclxuICAgKiBzdGF0ZSBvZiBvcGVuY3YgbG9hZGluZ1xyXG4gICAqL1xyXG4gIHByaXZhdGUgY3ZTdGF0ZTogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIHRydWUgYWZ0ZXIgdGhlIGltYWdlIGlzIGxvYWRlZCBhbmQgcHJldmlldyBpcyBkaXNwbGF5ZWRcclxuICAgKi9cclxuICBpbWFnZUxvYWRlZCA9IGZhbHNlO1xyXG4gIC8qKlxyXG4gICAqIGVkaXRvciBtb2RlXHJcbiAgICovXHJcbiAgbW9kZTogJ2Nyb3AnIHwgJ2NvbG9yJyA9ICdjcm9wJztcclxuICAvKipcclxuICAgKiBmaWx0ZXIgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHJldHVybmVkIGJ5IHRoZSBmaWx0ZXIgc2VsZWN0b3IgYm90dG9tIHNoZWV0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZWxlY3RlZEZpbHRlciA9ICdkZWZhdWx0JztcclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIE9QRVJBVElPTiBWQVJJQUJMRVMgLy9cclxuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogdmlld3BvcnQgZGltZW5zaW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc2NyZWVuRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xyXG4gIC8qKlxyXG4gICAqIGltYWdlIGRpbWVuc2lvbnNcclxuICAgKi9cclxuICBwcml2YXRlIGltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDAsXHJcbiAgICBoZWlnaHQ6IDBcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpZXcgcGFuZVxyXG4gICAqL1xyXG4gIHByZXZpZXdEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XHJcbiAgLyoqXHJcbiAgICogcmF0aW9uIGJldHdlZW4gcHJldmlldyBpbWFnZSBhbmQgb3JpZ2luYWxcclxuICAgKi9cclxuICBwcml2YXRlIGltYWdlUmVzaXplUmF0aW86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIG9yaWdpbmFsIGltYWdlIGZvciByZXNldCBwdXJwb3Nlc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgb3JpZ2luYWxJbWFnZTogRmlsZTtcclxuICAvKipcclxuICAgKiBzdG9yZXMgdGhlIGVkaXRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWRpdGVkSW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIC8qKlxyXG4gICAqIHN0b3JlcyB0aGUgcHJldmlldyBpbWFnZSBhcyBjYW52YXNcclxuICAgKi9cclxuICBAVmlld0NoaWxkKCdQcmV2aWV3Q2FudmFzJywge3JlYWQ6IEVsZW1lbnRSZWZ9KSBwcml2YXRlIHByZXZpZXdDYW52YXM6IEVsZW1lbnRSZWY7XHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgcG9pbnRzIHVzZWQgYnkgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcclxuXHJcbiAgLy8gKioqKioqKioqKioqKiogLy9cclxuICAvLyBFVkVOVCBFTUlUVEVSUyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogb3B0aW9uYWwgYmluZGluZyB0byB0aGUgZXhpdCBidXR0b24gb2YgdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBleGl0RWRpdG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG4gIC8qKlxyXG4gICAqIGZpcmVzIG9uIGVkaXQgY29tcGxldGlvblxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlZGl0UmVzdWx0OiBFdmVudEVtaXR0ZXI8QmxvYj4gPSBuZXcgRXZlbnRFbWl0dGVyPEJsb2I+KCk7XHJcbiAgLyoqXHJcbiAgICogZW1pdHMgZXJyb3JzLCBjYW4gYmUgbGlua2VkIHRvIGFuIGVycm9yIGhhbmRsZXIgb2YgY2hvaWNlXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVycm9yOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBsb2FkaW5nIHN0YXR1cyBvZiB0aGUgY3YgbW9kdWxlLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSByZWFkeTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRydWUgd2hlbiBwcm9jZXNzaW5nIGlzIGRvbmUsIGZhbHNlIHdoZW4gY29tcGxldGVkXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHByb2Nlc3Npbmc6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuXHJcbiAgLy8gKioqKioqIC8vXHJcbiAgLy8gSU5QVVRTIC8vXHJcbiAgLy8gKioqKioqIC8vXHJcbiAgLyoqXHJcbiAgICogc2V0IGltYWdlIGZvciBlZGl0aW5nXHJcbiAgICogQHBhcmFtIGZpbGUgLSBmaWxlIGZyb20gZm9ybSBpbnB1dFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHNldCBmaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgIGlmIChmaWxlKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICB9LCA1KTtcclxuICAgICAgdGhpcy5pbWFnZUxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBmaWxlO1xyXG4gICAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZShcclxuICAgICAgICBhc3luYyAoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcclxuICAgICAgICAgIGlmIChjdlN0YXRlLnJlYWR5KSB7XHJcbiAgICAgICAgICAgIC8vIHJlYWQgZmlsZSB0byBpbWFnZSAmIGNhbnZhc1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRGaWxlKGZpbGUpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBlZGl0b3IgY29uZmlndXJhdGlvbiBvYmplY3RcclxuICAgKi9cclxuICBASW5wdXQoKSBjb25maWc6IERvY1NjYW5uZXJDb25maWc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmd4T3BlbkN2OiBOZ3hPcGVuQ1ZTZXJ2aWNlLCBwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UsIHByaXZhdGUgYm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0KSB7XHJcbiAgICB0aGlzLnNjcmVlbkRpbWVuc2lvbnMgPSB7XHJcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcclxuICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIH07XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIHN0YXR1cyBvZiBjdiBtb2R1bGVcclxuICAgIHRoaXMubmd4T3BlbkN2LmN2U3RhdGUuc3Vic2NyaWJlKChjdlN0YXRlOiBPcGVuQ1ZTdGF0ZSkgPT4ge1xyXG4gICAgICB0aGlzLmN2U3RhdGUgPSBjdlN0YXRlLnN0YXRlO1xyXG4gICAgICB0aGlzLnJlYWR5LmVtaXQoY3ZTdGF0ZS5yZWFkeSk7XHJcbiAgICAgIGlmIChjdlN0YXRlLmVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcignZXJyb3IgbG9hZGluZyBjdicpKTtcclxuICAgICAgfSBlbHNlIGlmIChjdlN0YXRlLmxvYWRpbmcpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgfSBlbHNlIGlmIChjdlN0YXRlLnJlYWR5KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzdWJzY3JpYmUgdG8gcG9zaXRpb25zIG9mIGNyb3AgdG9vbFxyXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnBvc2l0aW9ucy5zdWJzY3JpYmUocG9pbnRzID0+IHtcclxuICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5lZGl0b3JCdXR0b25zID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2V4aXQnLFxyXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5leGl0RWRpdG9yLmVtaXQoJ2NhbmNlbGVkJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpY29uOiAnYXJyb3dfYmFjaycsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogJ2Nyb3AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAncm90YXRlJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMucm90YXRlSW1hZ2UuYmluZCh0aGlzKSxcclxuICAgICAgICBpY29uOiAncm90YXRlX3JpZ2h0JyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY3JvcCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdkb25lX2Nyb3AnLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy5kb25lQ3JvcCgpLFxyXG4gICAgICAgIGljb246ICdkb25lJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY3JvcCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdiYWNrJyxcclxuICAgICAgICBhY3Rpb246IHRoaXMudW5kbygpLFxyXG4gICAgICAgIGljb246ICdhcnJvd19iYWNrJyxcclxuICAgICAgICB0eXBlOiAnZmFiJyxcclxuICAgICAgICBtb2RlOiAnY29sb3InXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZmlsdGVyJyxcclxuICAgICAgICBhY3Rpb246ICgpID0+IHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5maWx0ZXJFbmFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hvb3NlRmlsdGVycygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJ3Bob3RvX2ZpbHRlcicsXHJcbiAgICAgICAgdHlwZTogJ2ZhYicsXHJcbiAgICAgICAgbW9kZTogdGhpcy5jb25maWcuZmlsdGVyRW5hYmxlID8gJ2NvbG9yJyA6ICdkaXNhYmxlZCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICd1cGxvYWQnLFxyXG4gICAgICAgIGFjdGlvbjogdGhpcy5leHBvcnRJbWFnZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIGljb246ICdjbG91ZF91cGxvYWQnLFxyXG4gICAgICAgIHR5cGU6ICdmYWInLFxyXG4gICAgICAgIG1vZGU6ICdjb2xvcidcclxuICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgLy8gc2V0IG9wdGlvbnMgZnJvbSBjb25maWcgb2JqZWN0XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgSW1hZ2VFZGl0b3JDb25maWcodGhpcy5jb25maWcpO1xyXG4gICAgLy8gc2V0IGV4cG9ydCBpbWFnZSBpY29uXHJcbiAgICB0aGlzLmVkaXRvckJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICBpZiAoYnV0dG9uLm5hbWUgPT09ICd1cGxvYWQnKSB7XHJcbiAgICAgICAgYnV0dG9uLmljb24gPSB0aGlzLm9wdGlvbnMuZXhwb3J0SW1hZ2VJY29uO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMubWF4UHJldmlld1dpZHRoID0gdGhpcy5vcHRpb25zLm1heFByZXZpZXdXaWR0aDtcclxuICAgIHRoaXMuZWRpdG9yU3R5bGUgPSB0aGlzLm9wdGlvbnMuZWRpdG9yU3R5bGU7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jb25maWcpIHtcclxuICAgICAgaWYgKGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZS50aHJlc2hvbGRJbmZvLnRocmVzaCAhPT0gY2hhbmdlcy5jb25maWcucHJldmlvdXNWYWx1ZS50aHJlc2hvbGRJbmZvLnRocmVzaCkge1xyXG4gICAgICAgIHRoaXMubG9hZEZpbGUodGhpcy5vcmlnaW5hbEltYWdlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cclxuICAvLyBlZGl0b3IgYWN0aW9uIGJ1dHRvbnMgbWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XHJcbiAgICovXHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvbmVDcm9wKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2NvbG9yJztcclxuICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZmlsdGVyRW5hYmxlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgdGhpcy5tb2RlID0gJ2Nyb3AnO1xyXG4gICAgdGhpcy5sb2FkRmlsZSh0aGlzLm9yaWdpbmFsSW1hZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyLCBhbmQgd2hlbiBkb25lIGVtaXRzIHRoZSByZXN1bHRlZCBpbWFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXN5bmMgZXhwb3J0SW1hZ2UoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmFwcGx5RmlsdGVyKGZhbHNlKTtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zKSB7XHJcbiAgICAgIHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpXHJcbiAgICAgIC50aGVuKHJlc2l6ZVJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmVzaXplUmVzdWx0LnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgfSwgdGhpcy5vcmlnaW5hbEltYWdlLnR5cGUpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWRpdGVkSW1hZ2UudG9CbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICB9LCB0aGlzLm9yaWdpbmFsSW1hZ2UudHlwZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBvcGVuIHRoZSBib3R0b20gc2hlZXQgZm9yIHNlbGVjdGluZyBmaWx0ZXJzLCBhbmQgYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIGluIHByZXZpZXcgbW9kZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2hvb3NlRmlsdGVycygpIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7ZmlsdGVyOiB0aGlzLnNlbGVjdGVkRmlsdGVyfTtcclxuICAgIGNvbnN0IGJvdHRvbVNoZWV0UmVmID0gdGhpcy5ib3R0b21TaGVldC5vcGVuKE5neEZpbHRlck1lbnVDb21wb25lbnQsIHtcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSk7XHJcbiAgICBib3R0b21TaGVldFJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSBkYXRhLmZpbHRlcjtcclxuICAgICAgdGhpcy5hcHBseUZpbHRlcih0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEZpbGUgSW5wdXQgJiBPdXRwdXQgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgbG9hZEZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkSW1hZ2UoZmlsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xyXG4gICAgICB9XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93UHJldmlldygpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBzZXQgcGFuZSBsaW1pdHNcclxuICAgICAgLy8gc2hvdyBwb2ludHNcclxuICAgICAgdGhpcy5pbWFnZUxvYWRlZCA9IHRydWU7XHJcbiAgICAgIGF3YWl0IHRoaXMubGltaXRzU2VydmljZS5zZXRQYW5lRGltZW5zaW9ucyh7d2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGgsIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHR9KTtcclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5kZXRlY3RDb250b3VycygpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDE1KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcmVhZCBpbWFnZSBmcm9tIEZpbGUgb2JqZWN0XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkSW1hZ2UoZmlsZTogRmlsZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IGltYWdlU3JjO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGltYWdlU3JjID0gYXdhaXQgcmVhZEZpbGUoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIGltZy5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gc2V0IGVkaXRlZCBpbWFnZSBjYW52YXMgYW5kIGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGggPSBpbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuZWRpdGVkSW1hZ2UuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgICAgLy8gcmVzaXplIGltYWdlIGlmIGxhcmdlciB0aGFuIG1heCBpbWFnZSBzaXplXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBpbWcud2lkdGggPiBpbWcuaGVpZ2h0ID8gaW1nLmhlaWdodCA6IGltZy53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRlZEltYWdlID0gYXdhaXQgdGhpcy5yZXNpemUodGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLndpZHRoID0gdGhpcy5lZGl0ZWRJbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLmltYWdlRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLmVkaXRlZEltYWdlLmhlaWdodDtcclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICAgIGltZy5zcmMgPSBpbWFnZVNyYztcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBmaWxlIGZyb20gaW5wdXQgZmllbGRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVhZEZpbGUoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoZXJyKSA9PiB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIEltYWdlIFByb2Nlc3NpbmcgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHJvdGF0ZSBpbWFnZSA5MCBkZWdyZWVzXHJcbiAgICovXHJcbiAgcm90YXRlSW1hZ2UoY2xvY2t3aXNlID0gdHJ1ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICAvLyBjb25zdCBkc3QgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgICAgY3YudHJhbnNwb3NlKGRzdCwgZHN0KTtcclxuICAgICAgICBpZiAoY2xvY2t3aXNlKSB7XHJcbiAgICAgICAgICBjdi5mbGlwKGRzdCwgZHN0LCAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY3YuZmxpcChkc3QsIGRzdCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuICAgICAgICAvLyBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIC8vIHNhdmUgY3VycmVudCBwcmV2aWV3IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uc1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucyA9IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyk7XHJcbiAgICAgICAgY29uc3QgaW5pdGlhbFBvc2l0aW9ucyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMpO1xyXG4gICAgICAgIC8vIGdldCBuZXcgZGltZW5zaW9uc1xyXG4gICAgICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLnNldFByZXZpZXdQYW5lRGltZW5zaW9ucyh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICAvLyBnZXQgcHJldmlldyBwYW5lIHJlc2l6ZSByYXRpb1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXdSZXNpemVSYXRpb3MgPSB7XHJcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBzZXQgbmV3IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcblxyXG4gICAgICAgIGlmIChjbG9ja3dpc2UpIHtcclxuICAgICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJvdGF0ZUFudGlDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRldGVjdHMgdGhlIGNvbnRvdXJzIG9mIHRoZSBkb2N1bWVudCBhbmRcclxuICAgKiovXHJcbiAgcHJpdmF0ZSBkZXRlY3RDb250b3VycygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBsb2FkIHRoZSBpbWFnZSBhbmQgY29tcHV0ZSB0aGUgcmF0aW8gb2YgdGhlIG9sZCBoZWlnaHQgdG8gdGhlIG5ldyBoZWlnaHQsIGNsb25lIGl0LCBhbmQgcmVzaXplIGl0XHJcbiAgICAgICAgY29uc3QgcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvID0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcclxuICAgICAgICBjb25zdCBkc3QgPSBjdi5NYXQuemVyb3Moc3JjLnJvd3MsIHNyYy5jb2xzLCBjdi5DVl84VUMzKTtcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKHNyYy5yb3dzICogcHJvY2Vzc2luZ1Jlc2l6ZVJhdGlvLCBzcmMuY29scyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbyk7XHJcbiAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAvLyBjb252ZXJ0IHRoZSBpbWFnZSB0byBncmF5c2NhbGUsIGJsdXIgaXQsIGFuZCBmaW5kIGVkZ2VzIGluIHRoZSBpbWFnZVxyXG4gICAgICAgIGN2LmN2dENvbG9yKHNyYywgc3JjLCBjdi5DT0xPUl9SR0JBMkdSQVksIDApO1xyXG4gICAgICAgIGN2LkdhdXNzaWFuQmx1cihzcmMsIHNyYywga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICBjdi5DYW5ueShzcmMsIHNyYywgNzUsIDIwMCk7XHJcbiAgICAgICAgLy8gZmluZCBjb250b3Vyc1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcudGhyZXNob2xkSW5mby50aHJlc2hvbGRUeXBlID09PSAnc3RhbmRhcmQnKSB7XHJcbiAgICAgICAgICBjdi50aHJlc2hvbGQoc3JjLCBzcmMsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNoLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5USFJFU0hfQklOQVJZKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8udGhyZXNob2xkVHlwZSA9PT0gJ2FkYXB0aXZlX21lYW4nKSB7XHJcbiAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChzcmMsIHNyYywgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5tYXhWYWx1ZSwgY3YuQURBUFRJVkVfVEhSRVNIX01FQU5fQyxcclxuICAgICAgICAgICAgY3YuVEhSRVNIX0JJTkFSWSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5ibG9ja1NpemUsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLnRocmVzaG9sZFR5cGUgPT09ICdhZGFwdGl2ZV9nYXVzc2lhbicpIHtcclxuICAgICAgICAgIGN2LmFkYXB0aXZlVGhyZXNob2xkKHNyYywgc3JjLCB0aGlzLmNvbmZpZy50aHJlc2hvbGRJbmZvLm1heFZhbHVlLCBjdi5BREFQVElWRV9USFJFU0hfR0FVU1NJQU5fQyxcclxuICAgICAgICAgICAgY3YuVEhSRVNIX0JJTkFSWSwgdGhpcy5jb25maWcudGhyZXNob2xkSW5mby5ibG9ja1NpemUsIHRoaXMuY29uZmlnLnRocmVzaG9sZEluZm8uYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb250b3VycyA9IG5ldyBjdi5NYXRWZWN0b3IoKTtcclxuICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgY3YuTWF0KCk7XHJcbiAgICAgICAgY3YuZmluZENvbnRvdXJzKHNyYywgY29udG91cnMsIGhpZXJhcmNoeSwgY3YuUkVUUl9DQ09NUCwgY3YuQ0hBSU5fQVBQUk9YX1NJTVBMRSk7XHJcbiAgICAgICAgY29uc3QgY250ID0gY29udG91cnMuZ2V0KDQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbnRvdXJzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLVVOSVFVRSBSRUNUQU5HTEVTIEZST00gQUxMIENPTlRPVVJTLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnN0IHJlY3RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250b3Vycy5zaXplKCk7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgY24gPSBjb250b3Vycy5nZXQoaSk7XHJcbiAgICAgICAgICBjb25zdCByID0gY3YubWluQXJlYVJlY3QoY24pO1xyXG4gICAgICAgICAgbGV0IGFkZCA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoci5zaXplLmhlaWdodCA8IDUwIHx8IHIuc2l6ZS53aWR0aCA8IDUwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IDkwIHx8IHIuYW5nbGUgPT09IDE4MCB8fCByLmFuZ2xlID09PSAwXHJcbiAgICAgICAgICAgIHx8IHIuYW5nbGUgPT09IC05MCB8fCByLmFuZ2xlID09PSAtMTgwXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgcmVjdHNbal0uYW5nbGUgPT09IHIuYW5nbGVcclxuICAgICAgICAgICAgICAmJiByZWN0c1tqXS5jZW50ZXIueCA9PT0gci5jZW50ZXIueCAmJiByZWN0c1tqXS5jZW50ZXIueSA9PT0gci5jZW50ZXIueVxyXG4gICAgICAgICAgICAgICYmIHJlY3RzW2pdLnNpemUud2lkdGggPT09IHIuc2l6ZS53aWR0aCAmJiByZWN0c1tqXS5zaXplLmhlaWdodCA9PT0gci5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgcmVjdHMucHVzaChyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZWN0MiA9IGN2Lm1pbkFyZWFSZWN0KGNudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgLy8gY29uc3QgdiA9IGN2LlJvdGF0ZWRSZWN0LnBvaW50cyhyZWN0c1tpXSk7XHJcbiAgICAgICAgICAvLyBsZXQgaXNOZWdhdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgLy8gZm9yIChsZXQgaiA9IDA7IGogPCB2Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAvLyAgIGlmICh2W2pdLnggPCAwIHx8IHZbal0ueSA8IDApIHtcclxuICAgICAgICAgIC8vICAgICBpc05lZ2F0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgLy8gaWYgKGlzTmVnYXRpdmUpIHtcclxuICAgICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICBpZiAoKChyZWN0c1tpXS5zaXplLndpZHRoICogcmVjdHNbaV0uc2l6ZS5oZWlnaHQpID4gKHJlY3QyLnNpemUud2lkdGggKiByZWN0Mi5zaXplLmhlaWdodClcclxuICAgICAgICAgICAgJiYgIShyZWN0c1tpXS5hbmdsZSA9PT0gOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IDE4MCB8fCByZWN0c1tpXS5hbmdsZSA9PT0gMFxyXG4gICAgICAgICAgICAgIHx8IHJlY3RzW2ldLmFuZ2xlID09PSAtOTAgfHwgcmVjdHNbaV0uYW5nbGUgPT09IC0xODApICYmICgocmVjdHNbaV0uYW5nbGUgPiA4NSB8fCByZWN0c1tpXS5hbmdsZSA8IDUpKSlcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZWN0MiA9IHJlY3RzW2ldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZWN0cyk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coY250KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZWN0Mik7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBjdi5Sb3RhdGVkUmVjdC5wb2ludHMocmVjdDIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZlcnRpY2VzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgdmVydGljZXNbaV0ueCA9IHZlcnRpY2VzW2ldLnggKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XHJcbiAgICAgICAgICB2ZXJ0aWNlc1tpXS55ID0gdmVydGljZXNbaV0ueSAqIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZlcnRpY2VzKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGN2LmJvdW5kaW5nUmVjdChzcmMpO1xyXG5cclxuICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgaGllcmFyY2h5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGNvbnRvdXJzLmRlbGV0ZSgpO1xyXG4gICAgICAgIC8vIHRyYW5zZm9ybSB0aGUgcmVjdGFuZ2xlIGludG8gYSBzZXQgb2YgcG9pbnRzXHJcbiAgICAgICAgT2JqZWN0LmtleXMocmVjdCkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgcmVjdFtrZXldID0gcmVjdFtrZXldICogdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgY29udG91ckNvb3JkaW5hdGVzO1xyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFJvbGVzOiBSb2xlc0FycmF5ID0gW3RoaXMuaXNUb3AodmVydGljZXNbMF0sIFt2ZXJ0aWNlc1sxXSwgdmVydGljZXNbMl0sIHZlcnRpY2VzWzNdXSkgPyAndG9wJyA6ICdib3R0b20nXTtcclxuICAgICAgICBjb25zdCBzZWNvbmRSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzFdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzJdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3QgdGhpcmRSb2xlczogUm9sZXNBcnJheSA9IFt0aGlzLmlzVG9wKHZlcnRpY2VzWzJdLCBbdmVydGljZXNbMF0sIHZlcnRpY2VzWzFdLCB2ZXJ0aWNlc1szXV0pID8gJ3RvcCcgOiAnYm90dG9tJ107XHJcbiAgICAgICAgY29uc3QgZm91cnRoUm9sZXM6IFJvbGVzQXJyYXkgPSBbdGhpcy5pc1RvcCh2ZXJ0aWNlc1szXSwgW3ZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1syXSwgdmVydGljZXNbMV1dKSA/ICd0b3AnIDogJ2JvdHRvbSddO1xyXG5cclxuICAgICAgICBjb25zdCByb2xlcyA9IFtmaXJzdFJvbGVzLCBzZWNvbmRSb2xlcywgdGhpcmRSb2xlcywgZm91cnRoUm9sZXNdO1xyXG4gICAgICAgIGNvbnN0IHRzID0gW107XHJcbiAgICAgICAgY29uc3QgYnMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHJvbGVzW2ldWzBdID09PSAndG9wJykge1xyXG4gICAgICAgICAgICB0cy5wdXNoKGkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnMucHVzaChpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhicyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTGVmdCh2ZXJ0aWNlc1t0c1swXV0sIHZlcnRpY2VzW3RzWzFdXSkpIHtcclxuICAgICAgICAgIHJvbGVzW3RzWzBdXS5wdXNoKCdsZWZ0Jyk7XHJcbiAgICAgICAgICByb2xlc1t0c1sxXV0ucHVzaCgncmlnaHQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcm9sZXNbdHNbMV1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICByb2xlc1t0c1swXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMZWZ0KHZlcnRpY2VzW2JzWzBdXSwgdmVydGljZXNbYnNbMV1dKSkge1xyXG4gICAgICAgICAgcm9sZXNbYnNbMF1dLnB1c2goJ2xlZnQnKTtcclxuICAgICAgICAgIHJvbGVzW2JzWzFdXS5wdXNoKCdyaWdodCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByb2xlc1tic1sxXV0ucHVzaCgnbGVmdCcpO1xyXG4gICAgICAgICAgcm9sZXNbYnNbMF1dLnB1c2goJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyb2xlcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy51c2VSb3RhdGVkUmVjdGFuZ2xlXHJcbiAgICAgICAgICAmJiB0aGlzLnBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb250b3VyQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHZlcnRpY2VzWzBdLngsIHk6IHZlcnRpY2VzWzBdLnl9LCBmaXJzdFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMV0ueCwgeTogdmVydGljZXNbMV0ueX0sIHNlY29uZFJvbGVzKSxcclxuICAgICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogdmVydGljZXNbMl0ueCwgeTogdmVydGljZXNbMl0ueX0sIHRoaXJkUm9sZXMpLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiB2ZXJ0aWNlc1szXS54LCB5OiB2ZXJ0aWNlc1szXS55fSwgZm91cnRoUm9sZXMpLFxyXG4gICAgICAgICAgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29udG91ckNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueX0sIFsnbGVmdCcsICd0b3AnXSksXHJcbiAgICAgICAgICAgIG5ldyBQb3NpdGlvbkNoYW5nZURhdGEoe3g6IHJlY3QueCArIHJlY3Qud2lkdGgsIHk6IHJlY3QueX0sIFsncmlnaHQnLCAndG9wJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LnggKyByZWN0LndpZHRoLCB5OiByZWN0LnkgKyByZWN0LmhlaWdodH0sIFsncmlnaHQnLCAnYm90dG9tJ10pLFxyXG4gICAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25Qb2ludHMoY29udG91ckNvb3JkaW5hdGVzKTtcclxuICAgICAgICAvLyB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzVG9wKGNvb3JkaW5hdGUsIG90aGVyVmVydGljZXMpOiBib29sZWFuIHtcclxuXHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdGhlclZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChjb29yZGluYXRlLnkgPCBvdGhlclZlcnRpY2VzW2ldLnkpIHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50ID49IDI7XHJcblxyXG4gIH1cclxuXHJcbiAgaXNMZWZ0KGNvb3JkaW5hdGUsIHNlY29uZENvb3JkaW5hdGUpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBjb29yZGluYXRlLnggPCBzZWNvbmRDb29yZGluYXRlLng7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50c0FyZU5vdFRoZVNhbWUodmVydGljZXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEodmVydGljZXNbMF0ueCA9PT0gdmVydGljZXNbMV0ueCAmJiB2ZXJ0aWNlc1sxXS54ID09PSB2ZXJ0aWNlc1syXS54ICYmIHZlcnRpY2VzWzJdLnggPT09IHZlcnRpY2VzWzNdLnggJiZcclxuICAgICAgdmVydGljZXNbMF0ueSA9PT0gdmVydGljZXNbMV0ueSAmJiB2ZXJ0aWNlc1sxXS55ID09PSB2ZXJ0aWNlc1syXS55ICYmIHZlcnRpY2VzWzJdLnkgPT09IHZlcnRpY2VzWzNdLnkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHkgcGVyc3BlY3RpdmUgdHJhbnNmb3JtXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgc291cmNlIGNvb3JkaW5hdGVzIG1hdHJpeFxyXG4gICAgICAgIGNvbnN0IHNvdXJjZUNvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxyXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKSxcclxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWydib3R0b20nLCAncmlnaHQnXSksXHJcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcclxuICAgICAgICBdLm1hcChwb2ludCA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gW3BvaW50LnggLyB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHBvaW50LnkgLyB0aGlzLmltYWdlUmVzaXplUmF0aW9dO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBnZXQgbWF4IHdpZHRoXHJcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcclxuICAgICAgICBjb25zdCB0b3BXaWR0aCA9IHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSkueCAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS54O1xyXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoYm90dG9tV2lkdGgsIHRvcFdpZHRoKSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxyXG4gICAgICAgIGNvbnN0IGxlZnRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueSAtIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAnbGVmdCddKS55O1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKS55IC0gdGhpcy5nZXRQb2ludChbJ3RvcCcsICdyaWdodCddKS55O1xyXG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcclxuICAgICAgICAvLyBjcmVhdGUgZGVzdCBjb29yZGluYXRlcyBtYXRyaXhcclxuICAgICAgICBjb25zdCBkZXN0Q29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICBbbWF4V2lkdGggLSAxLCAwXSxcclxuICAgICAgICAgIFttYXhXaWR0aCAtIDEsIG1heEhlaWdodCAtIDFdLFxyXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXHJcbiAgICAgICAgY29uc3QgTXMgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5zb3VyY2VDb29yZGluYXRlcykpO1xyXG4gICAgICAgIGNvbnN0IE1kID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uZGVzdENvb3JkaW5hdGVzKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcclxuICAgICAgICAvLyBzZXQgbmV3IGltYWdlIHNpemVcclxuICAgICAgICBjb25zdCBkc2l6ZSA9IG5ldyBjdi5TaXplKG1heFdpZHRoLCBtYXhIZWlnaHQpO1xyXG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxyXG4gICAgICAgIGN2LndhcnBQZXJzcGVjdGl2ZShkc3QsIGRzdCwgdHJhbnNmb3JtTWF0cml4LCBkc2l6ZSwgY3YuSU5URVJfQ1VCSUMsIGN2LkJPUkRFUl9DT05TVEFOVCwgbmV3IGN2LlNjYWxhcigpKTtcclxuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcclxuXHJcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIE1zLmRlbGV0ZSgpO1xyXG4gICAgICAgIE1kLmRlbGV0ZSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdHJpeC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XHJcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciB0byB0aGUgaW1hZ2VcclxuICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxyXG4gICAqIHdoZW4gZmFsc2UsIHdpbGwgYXBwbHkgdG8gZWRpdGVkSW1hZ2VcclxuICAgKi9cclxuICBwcml2YXRlIGFwcGx5RmlsdGVyKHByZXZpZXc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xyXG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBibHVyOiBmYWxzZSxcclxuICAgICAgICB0aDogdHJ1ZSxcclxuICAgICAgICB0aE1vZGU6IGN2LkFEQVBUSVZFX1RIUkVTSF9NRUFOX0MsXHJcbiAgICAgICAgdGhNZWFuQ29ycmVjdGlvbjogMTAsXHJcbiAgICAgICAgdGhCbG9ja1NpemU6IDI1LFxyXG4gICAgICAgIHRoTWF4OiAyNTUsXHJcbiAgICAgICAgZ3JheVNjYWxlOiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmZpbHRlckVuYWJsZSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSAnb3JpZ2luYWwnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0ZWRGaWx0ZXIpIHtcclxuICAgICAgICBjYXNlICdvcmlnaW5hbCc6XHJcbiAgICAgICAgICBvcHRpb25zLnRoID0gZmFsc2U7XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgb3B0aW9ucy5ibHVyID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdtYWdpY19jb2xvcic6XHJcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYncyJzpcclxuICAgICAgICAgIG9wdGlvbnMudGhNb2RlID0gY3YuQURBUFRJVkVfVEhSRVNIX0dBVVNTSUFOX0M7XHJcbiAgICAgICAgICBvcHRpb25zLnRoTWVhbkNvcnJlY3Rpb24gPSAxNTtcclxuICAgICAgICAgIG9wdGlvbnMudGhCbG9ja1NpemUgPSAxNTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2J3Myc6XHJcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSB0cnVlO1xyXG4gICAgICAgICAgb3B0aW9ucy50aE1lYW5Db3JyZWN0aW9uID0gMTU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XHJcbiAgICAgICAgICBjdi5jdnRDb2xvcihkc3QsIGRzdCwgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuYmx1cikge1xyXG4gICAgICAgICAgY29uc3Qga3NpemUgPSBuZXcgY3YuU2l6ZSg1LCA1KTtcclxuICAgICAgICAgIGN2LkdhdXNzaWFuQmx1cihkc3QsIGRzdCwga3NpemUsIDAsIDAsIGN2LkJPUkRFUl9ERUZBVUxUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGgpIHtcclxuICAgICAgICAgIGlmIChvcHRpb25zLmdyYXlTY2FsZSkge1xyXG4gICAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChkc3QsIGRzdCwgb3B0aW9ucy50aE1heCwgb3B0aW9ucy50aE1vZGUsIGN2LlRIUkVTSF9CSU5BUlksIG9wdGlvbnMudGhCbG9ja1NpemUsIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkc3QuY29udmVydFRvKGRzdCwgLTEsIDEsIDYwKTtcclxuICAgICAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxNzAsIDI1NSwgY3YuVEhSRVNIX0JJTkFSWSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJldmlldykge1xyXG4gICAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoZHN0KTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCAzMCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlc2l6ZSBhbiBpbWFnZSB0byBmaXQgY29uc3RyYWludHMgc2V0IGluIG9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXNpemUoaW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50KTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IGN2LmltcmVhZChpbWFnZSk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogc3JjLnNpemUoKS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3JjLnNpemUoKS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGN1cnJlbnREaW1lbnNpb25zLndpZHRoID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGg7XHJcbiAgICAgICAgICByZXNpemVEaW1lbnNpb25zLmhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGggLyBjdXJyZW50RGltZW5zaW9ucy53aWR0aCAqIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgIGlmIChyZXNpemVEaW1lbnNpb25zLmhlaWdodCA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMud2lkdGggPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLmhlaWdodCAvIGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCAqIGN1cnJlbnREaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMud2lkdGgpLCBNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0KSk7XHJcbiAgICAgICAgICBjdi5yZXNpemUoc3JjLCBzcmMsIGRzaXplLCAwLCAwLCBjdi5JTlRFUl9BUkVBKTtcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZVJlc3VsdCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgIGN2Lmltc2hvdyhyZXNpemVSZXN1bHQsIHNyYyk7XHJcbiAgICAgICAgICBzcmMuZGVsZXRlKCk7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc2l6ZVJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMzApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgaW1hZ2Ugb24gdGhlIHByZXZpZXcgY2FudmFzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93UHJldmlldyhpbWFnZT86IGFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHNyYztcclxuICAgICAgaWYgKGltYWdlKSB7XHJcbiAgICAgICAgc3JjID0gaW1hZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3JjID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcclxuICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZSgwLCAwKTtcclxuICAgICAgY3YucmVzaXplKHNyYywgZHN0LCBkc2l6ZSwgdGhpcy5pbWFnZVJlc2l6ZVJhdGlvLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIGN2LklOVEVSX0FSRUEpO1xyXG4gICAgICBjdi5pbXNob3codGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQsIGRzdCk7XHJcbiAgICAgIHNyYy5kZWxldGUoKTtcclxuICAgICAgZHN0LmRlbGV0ZSgpO1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8vIFV0aWxpdHkgTWV0aG9kcyAvL1xyXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xyXG4gIC8qKlxyXG4gICAqIHNldCBwcmV2aWV3IGNhbnZhcyBkaW1lbnNpb25zIGFjY29yZGluZyB0byB0aGUgY2FudmFzIGVsZW1lbnQgb2YgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRQcmV2aWV3UGFuZURpbWVuc2lvbnMoaW1nOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgLy8gc2V0IHByZXZpZXcgcGFuZSBkaW1lbnNpb25zXHJcbiAgICB0aGlzLnByZXZpZXdEaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGg7XHJcbiAgICB0aGlzLnByZXZpZXdDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodDtcclxuICAgIHRoaXMuaW1hZ2VSZXNpemVSYXRpbyA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmltYWdlRGl2U3R5bGUgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgdGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCArICdweCcsXHJcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLmhlaWdodCArICdweCcsXHJcbiAgICAgICdtYXJnaW4tbGVmdCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiArICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgICAgJ21hcmdpbi1yaWdodCc6IGBjYWxjKCgxMDAlIC0gJHt0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoICsgMTB9cHgpIC8gMiAtICR7dGhpcy5vcHRpb25zLmNyb3BUb29sRGltZW5zaW9ucy53aWR0aCAvIDJ9cHgpYCxcclxuICAgIH07XHJcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2Uuc2V0UGFuZURpbWVuc2lvbnMoe3dpZHRoOiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoLCBoZWlnaHQ6IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlldyBjYW52YXNcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyByYXRpbzogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgcmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcclxuXHJcbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCA+IHRoaXMubWF4UHJldmlld1dpZHRoID9cclxuICAgICAgdGhpcy5tYXhQcmV2aWV3V2lkdGggOiB0aGlzLnNjcmVlbkRpbWVuc2lvbnMud2lkdGggLSA0MDtcclxuICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy5oZWlnaHQgLSAyNDA7XHJcbiAgICBjb25zdCBjYWxjdWxhdGVkID0ge1xyXG4gICAgICB3aWR0aDogbWF4V2lkdGgsXHJcbiAgICAgIGhlaWdodDogTWF0aC5yb3VuZChtYXhXaWR0aCAvIHJhdGlvKSxcclxuICAgICAgcmF0aW86IHJhdGlvXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChjYWxjdWxhdGVkLmhlaWdodCA+IG1heEhlaWdodCkge1xyXG4gICAgICBjYWxjdWxhdGVkLmhlaWdodCA9IG1heEhlaWdodDtcclxuICAgICAgY2FsY3VsYXRlZC53aWR0aCA9IE1hdGgucm91bmQobWF4SGVpZ2h0ICogcmF0aW8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhbGN1bGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXR1cm5zIGEgcG9pbnQgYnkgaXQncyByb2xlc1xyXG4gICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBvaW50KHJvbGVzOiBSb2xlc0FycmF5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb2ludHMuZmluZChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbWl0c1NlcnZpY2UuY29tcGFyZUFycmF5KHBvaW50LnJvbGVzLCByb2xlcyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhIGNsYXNzIGZvciBnZW5lcmF0aW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmb3IgdGhlIGVkaXRvclxyXG4gKi9cclxuY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcclxuICAvKipcclxuICAgKiBtYXggZGltZW5zaW9ucyBvZiBvcHV0cHV0IGltYWdlLiBpZiBzZXQgdG8gemVyb1xyXG4gICAqL1xyXG4gIG1heEltYWdlRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDMwMDAwLFxyXG4gICAgaGVpZ2h0OiAzMDAwMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yQmFja2dyb3VuZENvbG9yID0gJyNmZWZlZmUnO1xyXG4gIC8qKlxyXG4gICAqIGNzcyBwcm9wZXJ0aWVzIGZvciB0aGUgbWFpbiBlZGl0b3IgZGl2XHJcbiAgICovXHJcbiAgZWRpdG9yRGltZW5zaW9uczogeyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgfSA9IHtcclxuICAgIHdpZHRoOiAnMTAwdncnLFxyXG4gICAgaGVpZ2h0OiAnMTAwdmgnXHJcbiAgfTtcclxuICAvKipcclxuICAgKiBjc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBtYWluIGRpdiBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGV4dHJhQ3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICB0b3A6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogbWF0ZXJpYWwgZGVzaWduIHRoZW1lIGNvbG9yIG5hbWVcclxuICAgKi9cclxuICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeScgfCAnd2FybicgfCAnYWNjZW50JyA9ICdhY2NlbnQnO1xyXG4gIC8qKlxyXG4gICAqIGljb24gZm9yIHRoZSBidXR0b24gdGhhdCBjb21wbGV0ZXMgdGhlIGVkaXRpbmcgYW5kIGVtaXRzIHRoZSBlZGl0ZWQgaW1hZ2VcclxuICAgKi9cclxuICBleHBvcnRJbWFnZUljb24gPSAnY2xvdWRfdXBsb2FkJztcclxuICAvKipcclxuICAgKiBjb2xvciBvZiB0aGUgY3JvcCB0b29sXHJcbiAgICovXHJcbiAgY3JvcFRvb2xDb2xvciA9ICcjRkYzMzMzJztcclxuICAvKipcclxuICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sLCBjYW4gYmUgZWl0aGVyIGEgcmVjdGFuZ2xlIG9yIGEgY2lyY2xlXHJcbiAgICovXHJcbiAgY3JvcFRvb2xTaGFwZTogUG9pbnRTaGFwZSA9ICdjaXJjbGUnO1xyXG4gIC8qKlxyXG4gICAqIGRpbWVuc2lvbnMgb2YgdGhlIGNyb3AgdG9vbFxyXG4gICAqL1xyXG4gIGNyb3BUb29sRGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zID0ge1xyXG4gICAgd2lkdGg6IDEwLFxyXG4gICAgaGVpZ2h0OiAxMFxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHBvaW50IGF0dHJpYnV0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHBvaW50T3B0aW9uczogUG9pbnRPcHRpb25zO1xyXG4gIC8qKlxyXG4gICAqIGFnZ3JlZ2F0aW9uIG9mIHRoZSBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgZWRpdG9yIHN0eWxlIGdlbmVyYXRlZCBieSB0aGUgY2xhc3MgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBlZGl0b3JTdHlsZT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XHJcbiAgLyoqXHJcbiAgICogY3JvcCB0b29sIG91dGxpbmUgd2lkdGhcclxuICAgKi9cclxuICBjcm9wVG9vbExpbmVXZWlnaHQgPSAzO1xyXG4gIC8qKlxyXG4gICAqIG1heGltdW0gc2l6ZSBvZiB0aGUgcHJldmlldyBwYW5lXHJcbiAgICovXHJcbiAgbWF4UHJldmlld1dpZHRoID0gODAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBEb2NTY2FubmVyQ29uZmlnKSB7XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVkaXRvclN0eWxlID0geydiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5lZGl0b3JCYWNrZ3JvdW5kQ29sb3J9O1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmVkaXRvckRpbWVuc2lvbnMpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmV4dHJhQ3NzKTtcclxuXHJcbiAgICB0aGlzLnBvaW50T3B0aW9ucyA9IHtcclxuICAgICAgc2hhcGU6IHRoaXMuY3JvcFRvb2xTaGFwZSxcclxuICAgICAgY29sb3I6IHRoaXMuY3JvcFRvb2xDb2xvcixcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgfTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wb2ludE9wdGlvbnMsIHRoaXMuY3JvcFRvb2xEaW1lbnNpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==