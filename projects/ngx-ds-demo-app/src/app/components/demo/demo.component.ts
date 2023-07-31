import {Component, OnInit, ViewChild} from '@angular/core';
import {DocScannerConfig} from '../../../../../ngx-document-scanner/src/lib/PublicModels';
import {NgxDocScannerComponent} from 'ngx-document-scanner';
import {MatSliderChange} from '@angular/material/slider';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  @ViewChild(NgxDocScannerComponent) docScanner: NgxDocScannerComponent;

  thresh = 110;
  overZone = false;
  image: File;
  processing: boolean;
  test: boolean;
  zoom = 1;
  config: DocScannerConfig = {
    editorBackgroundColor: '#fafafa',
    buttonThemeColor: 'primary',
    cropToolColor: '#ff4081',
    cropToolShape: 'rect',
    filterEnable: false,
    cropToolDimensions: {
      width: 16,
      height: 16
    },
    maxPreviewWidth: 500,
    maxPreviewHeight: 700,
    exportImageIcon: 'cloud_download',
    editorDimensions: {
      width: '100%',
      height: 'calc(' + (this.zoom * 100).toString() + '% - 20px)'
    },
    extraCss: {
      position: 'relative',
      top: 0,
      left: 0
    },
    thresholdInfo: {
      thresholdType: 'standard',
      maxValue: 220,
      thresh: 100,
      blockSize: 11,
      c: 5
    },
    useRotatedRectangle: true
  };

  constructor() {
  }

  // ******************* //
  // file input handlers //
  // ******************* //
  dropFile(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.item(0)) {
      const file = event.dataTransfer.files.item(0);
      if (this.isImage(file)) {
        this.loadFile(file);
      } else {
        this.overZone = false;
      }
    }
  }

  loadFile(event: any) {
    this.processing = true;
    this.overZone = false;
    let f: File;
    if (event instanceof File) {
      f = event;
    } else {
      const files = event.target.files;
      f = files[0];
    }
    if (this.isImage(f)) {
      this.image = f;
    }
  }

  isImage(file: File) {
    const types = [
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    return types.findIndex(type => {
      return file ? (type === file.type) : -1;

    }) !== -1;
  }


  // ******************************** //
  // bindings to doc scanner component//
  // ******************************** //
  // resets the file input when the user exits the editor
  exitEditor(message) {
    console.log(message);
    this.image = null;
  }

  // handles the result emitted by the editor
  editResult(result: Blob) {
    console.log(result);
  }

  // handles errors emitted by the component
  onError(err: Error) {
    console.error(err);
  }

  // handles changes in the editor state - is it processing or not
  editorState(processing) {
    this.processing = null;
    this.processing = processing;
  }

  ngOnInit(): void {
    // this.image = readFile('H:\\Customers\\F+W\\Workshop\\Example Docuscan Images\\4 Corners\\Aarron Caldwell 2023-01-1712-13-41.jpg');
  }

  rotate(): void {
    this.docScanner.rotateImage();
  }

  export(): void {
    this.docScanner.exportImage();
  }

  rotateAntiClockwise() {
    this.docScanner.rotateImage(false);
  }

  confirmEdit(): void {
    this.docScanner.doneCrop();
  }

  undo(): void {
    this.docScanner.undo();
  }

  modeIsCrop(): boolean {
    try {
      return this.docScanner.getMode() === 'crop';
    } catch (e) {
      return false;
    }
  }

  onChange($event: MatSliderChange) {
    const conf = {...this.config};
    const tInfo = {...conf.thresholdInfo};
    tInfo.thresh = $event.value;
    conf.thresholdInfo = tInfo;
    this.config = conf;
  }

  zoom_out() {
    if (this.zoom > 0) {
      this.zoom = this.zoom -= 0.25;
    }
    const conf = {...this.config};
    conf.maxPreviewHeight = this.zoom * 700;
    conf.maxPreviewWidth = this.zoom * 500;
    const tInfo = {...conf.thresholdInfo};
    conf.thresholdInfo = tInfo;
    conf.editorDimensions = {
      width: (this.zoom * 100).toString() + '%',
      height: (this.zoom * 100).toString() + '%',
    };
    this.config = conf;

    console.log(this.config);
  }

  zoom_in() {

    if (this.zoom < 2) {
      this.zoom = this.zoom += 0.25;
    }
    const conf = {...this.config};
    conf.maxPreviewWidth = this.zoom * 500;
    conf.maxPreviewHeight = this.zoom * 700;
    const tInfo = {...conf.thresholdInfo};
    conf.thresholdInfo = tInfo;
    conf.editorDimensions = {
      width: (this.zoom * 100).toString() + '%',
      height: (this.zoom * 100).toString() + '%',
    };
    this.config = conf;

    console.log(this.config);
  }
}
