import { AfterViewInit } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
import { XYPosition } from '../../PrivateModels';
import * as ɵngcc0 from '@angular/core';
export declare class NgxDraggablePointComponent implements AfterViewInit {
    private limitsService;
    width: number;
    height: number;
    color: string;
    shape: 'rect' | 'circle';
    pointOptions: 'rect' | 'circle';
    limitRoles: Array<'left' | 'right' | 'top' | 'bottom'>;
    startPosition: XYPosition;
    container: HTMLElement;
    private _currentPosition;
    hover: boolean;
    clicking: boolean;
    position: XYPosition;
    private _paneDimensions;
    resetPosition: XYPosition;
    constructor(limitsService: LimitsService);
    ngAfterViewInit(): void;
    mouseUp(event: any): void;
    /**
     * returns a css style object for the point
     */
    pointStyle(): {
        width: string;
        height: string;
        'background-color': string;
        'border-radius': string | number;
        position: string;
    };
    hoverPointStyle(): {
        cursor: string;
        'background-color': string;
        width: string;
        height: string;
        'border-radius': string | number;
        position: string;
    };
    clickingPointStyle(): {
        cursor: string;
        'background-color': string;
        width: string;
        height: string;
        'border-radius': string | number;
        position: string;
    };
    getStyle(): {
        width: string;
        height: string;
        'background-color': string;
        'border-radius': string | number;
        position: string;
    };
    /**
     * registers a position change on the limits service, and adjusts position if necessary
     * @param position - the current position of the point
     */
    positionChange(position: XYPosition): void;
    /**
     * adjusts the position of the point after a limit exception
     */
    private adjustPosition;
    /**
     * called on movement end, checks if last position exceeded the limits ad adjusts
     */
    movementEnd(position: XYPosition): void;
    /**
     * calculates the initial positions of the point by it's roles
     * @param dimensions - dimensions of the pane in which the point is located
     */
    private getInitialPosition;
    /**
     * repositions the point after an external reposition event
     * @param positions - an array of all points on the pane
     */
    private externalReposition;
    /**
     * returns a new point position if the movement exceeded the pane limit
     */
    private enforcePaneLimits;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<NgxDraggablePointComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<NgxDraggablePointComponent, "ngx-draggable-point", never, { "width": "width"; "height": "height"; "color": "color"; "shape": "shape"; "pointOptions": "pointOptions"; "_currentPosition": "_currentPosition"; "limitRoles": "limitRoles"; "startPosition": "startPosition"; "container": "container"; }, {}, never, never, false, never>;
}

//# sourceMappingURL=ngx-draggable-point.component.d.ts.map