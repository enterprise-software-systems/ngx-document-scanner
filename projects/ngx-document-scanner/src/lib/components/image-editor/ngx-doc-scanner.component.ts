import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {LimitsService, PointPositionChange, PositionChangeData, RolesArray} from '../../services/limits.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {NgxFilterMenuComponent} from '../filter-menu/ngx-filter-menu.component';
import {EditorActionButton, PointOptions, PointShape} from '../../PrivateModels';
// import {NgxOpenCVService} from '../../services/ngx-opencv.service';
import {DocScannerConfig, ImageDimensions, OpenCVState} from '../../PublicModels';
import {NgxOpenCVService} from 'ngx-opencv';
import {DomSanitizer} from '@angular/platform-browser';

declare var cv: any;

@Component({
  selector: 'ngx-doc-scanner',
  templateUrl: './ngx-doc-scanner.component.html',
  styleUrls: ['./ngx-doc-scanner.component.scss']
})
export class NgxDocScannerComponent implements OnInit, OnChanges {
  value = 0;

  /**
   * editor config object
   */
  options: ImageEditorConfig;
  // ************* //
  // EDITOR CONFIG //
  // ************* //
  /**
   * an array of action buttons displayed on the editor screen
   */
  private editorButtons: Array<EditorActionButton>;

  /**
   * returns an array of buttons according to the editor mode
   */
  get displayedButtons() {
    return this.editorButtons.filter(button => {
      return button.mode === this.mode;
    });
  }

  private maxPreviewHeight: number;
  /**
   * max width of the preview area
   */
  private maxPreviewWidth: number;
  /**
   * dimensions of the image container
   */
  imageDivStyle: any;
  /**
   * editor div style
   */
  editorStyle: { [key: string]: string | number };

  // ************* //
  // EDITOR STATE //
  // ************* //
  /**
   * state of opencv loading
   */
  private cvState: string;
  /**
   * true after the image is loaded and preview is displayed
   */
  imageLoaded = false;
  /**
   * editor mode
   */
  mode: 'crop' | 'color' = 'crop';
  /**
   * filter selected by the user, returned by the filter selector bottom sheet
   */
  private selectedFilter = 'default';

  // ******************* //
  // OPERATION VARIABLES //
  // ******************* //
  /**
   * viewport dimensions
   */
  private screenDimensions: ImageDimensions;
  /**
   * image dimensions
   */
  private imageDimensions: ImageDimensions = {
    width: 0,
    height: 0
  };
  /**
   * dimensions of the preview pane
   */
  previewDimensions: ImageDimensions;
  /**
   * ration between preview image and original
   */
  private imageResizeRatio: number;
  /**
   * stores the original image for reset purposes
   */
  private originalImage: File;
  /**
   * stores the edited image
   */
  private editedImage: HTMLCanvasElement;
  /**
   * stores the preview image as canvas
   */
  @ViewChild('PreviewCanvas', {read: ElementRef}) private previewCanvas: ElementRef;
  /**
   * an array of points used by the crop tool
   */
  private points: Array<PointPositionChange>;

  // ************** //
  // EVENT EMITTERS //
  // ************** //
  /**
   * optional binding to the exit button of the editor
   */
  @Output() exitEditor: EventEmitter<string> = new EventEmitter<string>();
  /**
   * fires on edit completion
   */
  @Output() editResult: EventEmitter<Blob> = new EventEmitter<Blob>();
  /**
   * emits errors, can be linked to an error handler of choice
   */
  @Output() error: EventEmitter<any> = new EventEmitter<any>();
  /**
   * emits the loading status of the cv module.
   */
  @Output() ready: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * emits true when processing is done, false when completed
   */
  @Output() processing: EventEmitter<boolean> = new EventEmitter<boolean>();

  // ****** //
  // INPUTS //
  // ****** //
  /**
   * set image for editing
   * @param file - file from form input
   */
  @Input() set file(file: File) {
    if (file) {
      setTimeout(() => {
        this.processing.emit(true);
      }, 5);
      this.imageLoaded = false;
      this.originalImage = file;
      this.ngxOpenCv.cvState.subscribe(
        async (cvState: OpenCVState) => {
          if (cvState.ready) {
            // read file to image & canvas
            await this.loadFile(file);
            this.processing.emit(false);
          }
        });
    }
  }

  /**
   * editor configuration object
   */
  @Input() config: DocScannerConfig;

  constructor(private ngxOpenCv: NgxOpenCVService, private limitsService: LimitsService,
              private bottomSheet: MatBottomSheet, private sanitizer: DomSanitizer) {
    this.screenDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // subscribe to status of cv module
    this.ngxOpenCv.cvState.subscribe((cvState: OpenCVState) => {
      this.cvState = cvState.state;
      this.ready.emit(cvState.ready);
      if (cvState.error) {
        this.error.emit(new Error('error loading cv'));
      } else if (cvState.loading) {
        this.processing.emit(true);
      } else if (cvState.ready) {
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

  ngOnChanges(changes: SimpleChanges) {
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
        const obj = {...this.editorStyle};
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

  getMode(): string {
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
    } else {
      this.editedImage.toBlob((blob) => {
        this.editResult.emit(blob);
        this.processing.emit(false);
      }, 'image/jpeg', 0.8);
    }
  }

  /**
   * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
   */
  private chooseFilters() {
    const data = {filter: this.selectedFilter};
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
  private loadFile(file: File) {
    return new Promise(async (resolve, reject) => {
      this.processing.emit(true);
      try {
        await this.readImage(file);
      } catch (err) {
        console.error(err);
        this.error.emit(new Error(err));
      }
      try {
        await this.showPreview();
      } catch (err) {
        console.error(err);
        this.error.emit(new Error(err));
      }
      // set pane limits
      // show points
      this.imageLoaded = true;
      await this.limitsService.setPaneDimensions({width: this.previewDimensions.width, height: this.previewDimensions.height});
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
  private readImage(file: File) {
    return new Promise(async (resolve, reject) => {
      let imageSrc;
      try {
        imageSrc = await readFile();
      } catch (err) {
        reject(err);
      }
      const img = new Image();
      if (this.editedImage) {
        console.log('clearing old edited image...');
        this.editedImage.remove();
      }
      img.onload = async () => {
        // set edited image canvas and dimensions
        this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
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
    } else {
      cv.flip(dst, dst, 0);
    }

    cv.imshow(this.editedImage, dst);
    // src.delete();
    dst.delete();
    // save current preview dimensions and positions
    const initialPreviewDimensions = {width: 0, height: 0};
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
    } else {
      this.limitsService.rotateAntiClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
    }
  }

  /**
   * detects the contours of the document and
   **/
  private detectContours(): Promise<void> {
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
        } else if (this.config.thresholdInfo.thresholdType === 'adaptive_mean') {
          cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_MEAN_C,
            cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
        } else if (this.config.thresholdInfo.thresholdType === 'adaptive_gaussian') {
          cv.adaptiveThreshold(src, src, this.config.thresholdInfo.maxValue, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY, this.config.thresholdInfo.blockSize, this.config.thresholdInfo.c);
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
            || r.angle === -90 || r.angle === -180
          ) {
            continue;
          }

          for (let j = 0; j < rects.length; j++) {
            if (
              rects[j].angle === r.angle
              && rects[j].center.x === r.center.x && rects[j].center.y === r.center.y
              && rects[j].size.width === r.size.width && rects[j].size.height === r.size.height
            ) {
              add = false;
              break;
            }
          }

          if (add) {
            rects.push(r);
          } else {
            try {
              r.delete();
            } catch (e) {
            }
          }
        }

        let rect2 = cv.minAreaRect(cnt);
        for (let i = 0; i < rects.length; i++) {
          if (((rects[i].size.width * rects[i].size.height) > (rect2.size.width * rect2.size.height)
            && !(rects[i].angle === 90 || rects[i].angle === 180 || rects[i].angle === 0
              || rects[i].angle === -90 || rects[i].angle === -180) && ((rects[i].angle > 85 || rects[i].angle < 5)))
          ) {
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

        let contourCoordinates: PositionChangeData[];

        const firstRoles: RolesArray = [this.isTop(vertices[0], [vertices[1], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
        const secondRoles: RolesArray = [this.isTop(vertices[1], [vertices[0], vertices[2], vertices[3]]) ? 'top' : 'bottom'];
        const thirdRoles: RolesArray = [this.isTop(vertices[2], [vertices[0], vertices[1], vertices[3]]) ? 'top' : 'bottom'];
        const fourthRoles: RolesArray = [this.isTop(vertices[3], [vertices[0], vertices[2], vertices[1]]) ? 'top' : 'bottom'];

        const roles = [firstRoles, secondRoles, thirdRoles, fourthRoles];
        const ts = [];
        const bs = [];

        for (let i = 0; i < roles.length; i++) {
          if (roles[i][0] === 'top') {
            ts.push(i);
          } else {
            bs.push(i);
          }
        }

        dst.delete();
        cnt.delete();

        try {
          if (this.isLeft(vertices[ts[0]], vertices[ts[1]])) {
            roles[ts[0]].push('left');
            roles[ts[1]].push('right');
          } else {
            roles[ts[1]].push('right');
            roles[ts[0]].push('left');
          }

          if (this.isLeft(vertices[bs[0]], vertices[bs[1]])) {
            roles[bs[0]].push('left');
            roles[bs[1]].push('right');
          } else {
            roles[bs[1]].push('left');
            roles[bs[0]].push('right');
          }
        } catch (e) {
          this.processing.emit(false);
          return;

        }

        if (this.config.useRotatedRectangle
          && this.pointsAreNotTheSame(vertices)
        ) {
          contourCoordinates = [
            new PositionChangeData({x: vertices[0].x, y: vertices[0].y}, firstRoles),
            new PositionChangeData({x: vertices[1].x, y: vertices[1].y}, secondRoles),
            new PositionChangeData({x: vertices[2].x, y: vertices[2].y}, thirdRoles),
            new PositionChangeData({x: vertices[3].x, y: vertices[3].y}, fourthRoles),
          ];
        } else {
          contourCoordinates = [
            new PositionChangeData({x: rect.x, y: rect.y}, ['left', 'top']),
            new PositionChangeData({x: rect.x + rect.width, y: rect.y}, ['right', 'top']),
            new PositionChangeData({x: rect.x + rect.width, y: rect.y + rect.height}, ['right', 'bottom']),
            new PositionChangeData({x: rect.x, y: rect.y + rect.height}, ['left', 'bottom']),
          ];
        }


        this.limitsService.repositionPoints(contourCoordinates);
        // this.processing.emit(false);
        resolve();
      }, 30);
    });
  }

  isTop(coordinate, otherVertices): boolean {

    let count = 0;
    for (let i = 0; i < otherVertices.length; i++) {
      if (coordinate.y < otherVertices[i].y) {
        count++;
      }
    }

    return count >= 2;

  }

  isLeft(coordinate, secondCoordinate): boolean {
    return coordinate.x < secondCoordinate.x;
  }

  private pointsAreNotTheSame(vertices: any): boolean {
    return !(vertices[0].x === vertices[1].x && vertices[1].x === vertices[2].x && vertices[2].x === vertices[3].x &&
      vertices[0].y === vertices[1].y && vertices[1].y === vertices[2].y && vertices[2].y === vertices[3].y);
  }

  /**
   * apply perspective transform
   */
  private transform(): Promise<void> {
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
  private applyFilter(preview: boolean): Promise<void> {
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
          } else {
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
  private resize(image: HTMLCanvasElement): Promise<HTMLCanvasElement> {
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
          const resizeResult = <HTMLCanvasElement>document.createElement('canvas');
          cv.imshow(resizeResult, src);
          src.delete();
          this.processing.emit(false);
          resolve(resizeResult);
        } else {
          this.processing.emit(false);
          resolve(image);
        }
      }, 30);
    });
  }

  /**
   * display a preview of the image on the preview canvas
   */
  private showPreview(image?: any) {
    return new Promise((resolve, reject) => {
      let src;
      if (image) {
        src = image;
      } else {
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
      } catch (e) {
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
  private setPreviewPaneDimensions(img: HTMLCanvasElement) {
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
    this.limitsService.setPaneDimensions({width: this.previewDimensions.width, height: this.previewDimensions.height});
  }

  /**
   * calculate dimensions of the preview canvas
   */
  private calculateDimensions(width: number, height: number): { width: number; height: number; ratio: number } {
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
  private getPoint(roles: RolesArray) {
    return this.points.find(point => {
      return this.limitsService.compareArray(point.roles, roles);
    });
  }

  getStoyle(): { [p: string]: string | number } {
    return this.editorStyle;
  }
}

/**
 * a class for generating configuration objects for the editor
 */
class ImageEditorConfig implements DocScannerConfig {
  /**
   * max dimensions of oputput image. if set to zero
   */
  maxImageDimensions: ImageDimensions = {
    width: 30000,
    height: 30000
  };
  /**
   * background color of the main editor div
   */
  editorBackgroundColor = '#fefefe';
  /**
   * css properties for the main editor div
   */
  editorDimensions: { width: string; height: string; } = {
    width: '100vw',
    height: '100vh'
  };
  /**
   * css that will be added to the main div of the editor component
   */
  extraCss: { [key: string]: string | number } = {
    position: 'absolute',
    top: 0,
    left: 0
  };

  /**
   * material design theme color name
   */
  buttonThemeColor: 'primary' | 'warn' | 'accent' = 'accent';
  /**
   * icon for the button that completes the editing and emits the edited image
   */
  exportImageIcon = 'cloud_upload';
  /**
   * color of the crop tool
   */
  cropToolColor = '#FF3333';
  /**
   * shape of the crop tool, can be either a rectangle or a circle
   */
  cropToolShape: PointShape = 'circle';
  /**
   * dimensions of the crop tool
   */
  cropToolDimensions: ImageDimensions = {
    width: 10,
    height: 10
  };
  /**
   * aggregation of the properties regarding point attributes generated by the class constructor
   */
  pointOptions: PointOptions;
  /**
   * aggregation of the properties regarding the editor style generated by the class constructor
   */
  editorStyle?: { [key: string]: string | number };
  /**
   * crop tool outline width
   */
  cropToolLineWeight = 3;
  /**
   * maximum size of the preview pane
   */
  maxPreviewWidth = 800;

  /**
   * maximum size of the preview pane
   */
  maxPreviewHeight = 800;

  constructor(options: DocScannerConfig) {
    if (options) {
      Object.keys(options).forEach(key => {
        this[key] = options[key];
      });
    }

    this.editorStyle = {'background-color': this.editorBackgroundColor};
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

