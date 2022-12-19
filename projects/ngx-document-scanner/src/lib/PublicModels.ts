/**
 * describes a state object for the OpenCV module
 */
import {PointShape} from './PrivateModels';

export interface OpenCVState {
  ready: boolean;
  loading: boolean;
  error: boolean;
  state: string;
}

/**
 * describes an object with width and height properties
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * threshold information for automatically detecting corners
 */
export interface ThresholdInformation {
  thresholdType: 'standard' | 'adaptive_mean' | 'adaptive_gaussian';
  /**
   * Non-zero value assigned to the pixels for which the condition is satisfied
   */
  maxValue?: number;
  /**
   * Size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.
   * Only used with adaptive threshold variants
   */
  blockSize?: number;
  /**
   *  Constant subtracted from the mean or weighted mean (see the details below).
   *  Normally, it is positive but may be zero or negative as well.
   *  Only used with adaptive threshold variants
   */
  c?: number;
  /**
   * threshold value. Only used with standard threshold type.
   */
  thresh?: number;


}

/**
 * describes a configuration object for the editor
 */
export interface DocScannerConfig {
  /**
   * whether filter options are enabled
   */
  filterEnable?: boolean;
  /**
   * max dimensions of output image. if set to zero will not resize the image
   */
  maxImageDimensions?: ImageDimensions;
  /**
   * background color of the main editor div
   */
  editorBackgroundColor?: string;
  /**
   * css properties for the main editor div
   */
  editorDimensions?: { width: string; height: string; };
  /**
   * css that will be added to the main div of the editor component
   */
  extraCss?: { [key: string]: string | number };
  /**
   * material design theme color name
   */
  buttonThemeColor?: 'primary' | 'warn' | 'accent';
  /**
   * icon for the button that completes the editing and emits the edited image
   */
  exportImageIcon?: string;
  /**
   * color of the crop tool (points and connecting lines)
   */
  cropToolColor?: string;
  /**
   * shape of the crop tool points
   */
  cropToolShape?: PointShape;
  /**
   * width and height of the crop tool points
   */
  cropToolDimensions?: ImageDimensions;
  /**
   * weight of the crop tool's connecting lines
   */
  cropToolLineWeight?: number;
  /**
   * max width of the preview pane
   */
  maxPreviewWidth?: number;
  /**
   * config threshold for auto
   */
  thresholdInfo?: ThresholdInformation;
}

/**
 * describes a configuration object for the OpenCV service
 */
export interface OpenCVConfig {
  /**
   * path to the directory containing the OpenCV files, in the form of '/path/to/<opencv directory>'
   * directory must contain the the following files:
   * --<OpenCvDir>
   * ----opencv.js
   * ----opencv_js.wasm
   */
  openCVDirPath?: string;
  /**
   * additional callback that will run when OpenCv has finished loading and parsing
   */
  runOnOpenCVInit?: Function;
}
