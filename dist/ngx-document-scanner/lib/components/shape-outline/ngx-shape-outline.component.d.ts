import { AfterViewInit } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { ImageDimensions } from '../../PublicModels';
import * as ɵngcc0 from '@angular/core';
export declare class NgxShapeOutlineComponent implements AfterViewInit {
    private limitsService;
    color: string;
    weight: number;
    dimensions: ImageDimensions;
    canvas: any;
    private _points;
    private _sortedPoints;
    constructor(limitsService: LimitsService);
    ngAfterViewInit(): void;
    /**
     * clears the shape canvas
     */
    private clearCanvas;
    /**
     * sorts the array of points according to their clockwise alignment
     */
    private sortPoints;
    /**
     * draws a line between the points according to their order
     */
    private drawShape;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<NgxShapeOutlineComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<NgxShapeOutlineComponent, "ngx-shape-outine", never, { "color": "color"; "weight": "weight"; "dimensions": "dimensions"; }, {}, never, never, false, never>;
}

//# sourceMappingURL=ngx-shape-outline.component.d.ts.map