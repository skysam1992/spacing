import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import interact from 'interactjs';

export interface SpacesProperty {
  topMargin: number,
  rightMargin: number,
  bottomMargin: number,
  leftMargin: number,
  topPadding: number,
  rightPadding: number,
  bottomPadding: number,
  leftPadding: number
}

interface SvgData {
  width: number;
  height: number;
  polygons: PolygonData[];
  inputs: InputData[];
}

interface PolygonData {
  id: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  points: string[]
}

interface InputData {
  width: string;
  height: string;
  left: string;
  top: string;
  value: string;
}

@Component({
  selector: 'app-spacing-plugin',
  templateUrl: './spacing-plugin.component.html',
  styleUrls: ['./spacing-plugin.component.scss']
})

export class SpacingPluginComponent implements OnInit {

  @Input() svgWidth: number = 400;
  @Input() svgHeight: number = 200;

  @Input() adjustData: SpacesProperty;
  @Output() adjustDataChange = new EventEmitter();

  svgData: SvgData;
  tempNormalColor: string;
  selectedColor: string = 'gainsboro';
  highlightColor: string = 'ghostwhite';

  polygonStroke = 'black';
  polygonStrokeWidth = 1;
  polygonFill = {
    centerFill: 'red',
    topPaddingFill: 'blue',
    rightPaddingFill: 'blue',
    bottomPaddingFill: 'blue',
    leftPaddingFill: 'blue',
    topMarginFill: 'green',
    rightMarginFill: 'green',
    bottomMarginFill: 'green',
    leftMarginFill: 'green'
  }

  // 记录原始数值用于重置
  originalAdjustData: SpacesProperty;

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.initStyle();
    this.originalAdjustData = JSON.parse(JSON.stringify(this.adjustData));
  }

  ngAfterViewInit(): void {
    const divs: HTMLElement[] = this.elementRef.nativeElement.querySelectorAll('polygon');    
    divs.forEach((div: any) => {
      this.initDrag(div);
    });
  }

  initDrag(div:HTMLElement): void {
    const elementControl = interact(div);
    const that = this;
    const sensitivity = 1;
    elementControl.draggable({
      listeners: {
        move(event) {
          const {target, delta } = event;
          switch (target.id) {
            case 'spacing-polygon:1': // topPadding
              if (delta.y > 0) {
                that.adjustData.topPadding += sensitivity;
              } else {
                if (that.adjustData.topPadding > 0) {
                  that.adjustData.topPadding -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:2': // topMargin
              if (delta.y > 0) {
                that.adjustData.topMargin += sensitivity;
              } else {
                if (that.adjustData.topMargin > 0) {
                  that.adjustData.topMargin -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:3': // bottomPadding
              if (delta.y > 0) {
                that.adjustData.bottomPadding += sensitivity;
              } else {
                if (that.adjustData.bottomPadding > 0) {
                  that.adjustData.bottomPadding -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:4': // bottomMargin
              if (delta.y > 0) {
                that.adjustData.bottomMargin += sensitivity;
              } else {
                if (that.adjustData.bottomMargin > 0) {
                  that.adjustData.bottomMargin -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:5': // leftPadding
              if (delta.x > 0) {
                that.adjustData.leftPadding += sensitivity;
              } else {
                if (that.adjustData.leftPadding > 0) {
                  that.adjustData.leftPadding -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:6': // leftMargin
              if (delta.x > 0) {
                that.adjustData.leftMargin += sensitivity;
              } else {
                if (that.adjustData.leftMargin > 0) {
                  that.adjustData.leftMargin -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:7': // rightPadding
              if (delta.x > 0) {
                that.adjustData.rightPadding += sensitivity;
              } else {
                if (that.adjustData.rightPadding > 0) {
                  that.adjustData.rightPadding -= sensitivity;
                }
              }
              break;
            case 'spacing-polygon:8': // rightMargin
              if (delta.x > 0) {
                that.adjustData.rightMargin += sensitivity;
              } else {
                if (that.adjustData.rightMargin > 0) {
                  that.adjustData.rightMargin -= sensitivity;
                }
              }
              break;
            default:
              break;
          }
        }
      }
    })
  }

  initStyle(): void {
    // svg 宽高
    const width: number = this.svgWidth;
    const height: number = this.svgHeight;
    // 内部矩形宽高
    const innerWidth: number = width / 3;
    const innerHeight: number = height / 3;
    const innerLeft: number = (width - innerWidth) / 2;
    const innerTop: number = (height - innerHeight) / 2;
    // 上下梯形高度
    const topTrapezoiHeight: number = innerTop / 2;
    // 左右梯形高度
    const leftTrapezoiHeight: number = innerLeft / 2;

    // 输入框的宽高（输入框会有 上下1padding 左右2padding 2边框 所以真实宽度为设置的宽度加8 高度加6 参与计算时需注意）
    const inputWidth: number = 30;
    const inputHeight: number = 10;
    
    const polygonFill = this.polygonFill;
    const stroke = this.polygonStroke;
    const strokeWidth = this.polygonStrokeWidth

    // 点连接顺序 左上->右上->右下->左下->左上
    // 中间矩形
    const centerPolygon:PolygonData = {
      id: 0,
      fill: polygonFill.centerFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        `${innerLeft},${innerTop}`,
        `${innerLeft + innerWidth},${innerTop}`,
        `${innerLeft + innerWidth},${innerHeight + innerTop}`,
        `${innerLeft},${innerHeight + innerTop}`,
        `${innerLeft},${innerTop}`
      ]
    }

    // 上 内边距 梯形
    const topPaddingPolygon:PolygonData = {
      id: 1,
      fill: polygonFill.topPaddingFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        `${leftTrapezoiHeight},${topTrapezoiHeight}`,
        `${innerLeft + innerWidth + leftTrapezoiHeight},${topTrapezoiHeight}`,
        centerPolygon.points[1],
        centerPolygon.points[0],
        `${leftTrapezoiHeight},${topTrapezoiHeight}`
      ]
    }
  
    // 上 内边距 输入框
    const topPaddingInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${(width - (inputWidth + 8)) / 2}px`,
      top: `${topTrapezoiHeight + (topTrapezoiHeight - (inputHeight + 6)) / 2}px`,
      value: 'topPadding'
    }

    // 上 外边距 梯形
    const topMarginPolygon:PolygonData = {
      id: 2,
      fill: polygonFill.topMarginFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        `${0},${0}`,
        `${width},${0}`,
        topPaddingPolygon.points[1],
        topPaddingPolygon.points[0],
        `${0},${0}`
      ]
    }

    // 上 外边距 输入框
    const topMarginInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${(width - (inputWidth + 8)) / 2}px`,
      top: `${(topTrapezoiHeight - (inputHeight + 6)) / 2}px`,
      value: 'topMargin'
    }

    // 下 内边距 梯形
    const bottomPaddingPolygon:PolygonData = {
      id: 3,
      fill: polygonFill.bottomPaddingFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        centerPolygon.points[3],
        centerPolygon.points[2],
        `${innerLeft + innerWidth + leftTrapezoiHeight},${innerHeight + innerTop + topTrapezoiHeight}`,
        `${leftTrapezoiHeight},${innerHeight + innerTop + topTrapezoiHeight}`,
        centerPolygon.points[3]
      ]
    }

    // 下 内边距 输入框
    const bottomPaddingInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${(width - (inputWidth + 8)) / 2}px`,
      top: `${innerHeight + innerTop + (topTrapezoiHeight - (inputHeight + 6)) / 2}px`,
      value: 'bottomPadding'
    }

    // 下 外边距 梯形
    const bottomMarginPolygon:PolygonData = {
      id: 4,
      fill: polygonFill.bottomMarginFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        bottomPaddingPolygon.points[3],
        bottomPaddingPolygon.points[2],
        `${width},${height}`,
        `${0},${height}`,
        bottomPaddingPolygon.points[3]
      ]
    }

    // 下 外边距 输入框
    const bottomMarginInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${(width - (inputWidth + 8)) / 2}px`,
      top: `${innerHeight + innerTop + topTrapezoiHeight + (topTrapezoiHeight - (inputHeight + 6)) / 2}px`,
      value: 'bottomMargin'
    }

    // 左 内边距 梯形
    const leftPaddingPolygon:PolygonData = {
      id: 5,
      fill: polygonFill.leftPaddingFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        topPaddingPolygon.points[0],
        centerPolygon.points[0],
        centerPolygon.points[3],
        bottomPaddingPolygon.points[3],
        topPaddingPolygon.points[0],
      ]
    }

    // 左 内边距 输入框
    const leftPaddingInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${leftTrapezoiHeight + (leftTrapezoiHeight - (inputWidth + 8)) / 2}px`,
      top: `${(height - (inputHeight + 6)) / 2}px`,
      value: 'leftPadding'
    }
    
    // 左 外边距 梯形
    const leftMarginPolygon:PolygonData = {
      id: 6,
      fill: polygonFill.leftMarginFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        topMarginPolygon.points[0],
        leftPaddingPolygon.points[0],
        leftPaddingPolygon.points[3],
        bottomMarginPolygon.points[3],
        topMarginPolygon.points[0],
      ]
    }

    // 左 外边距 输入框
    const leftMarginInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${(leftTrapezoiHeight - (inputWidth + 8)) / 2}px`,
      top: `${(height - (inputHeight + 6)) / 2}px`,
      value: 'leftMargin'
    }

    // 右 内边距 梯形
    const rightPaddingPolygon:PolygonData = {
      id: 7,
      fill: polygonFill.rightPaddingFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        centerPolygon.points[1],
        topPaddingPolygon.points[1],
        bottomPaddingPolygon.points[2],
        centerPolygon.points[2],
        centerPolygon.points[1],
      ]
    }

    // 右 内边距 输入框
    const rightPaddingInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${innerLeft + innerWidth + (leftTrapezoiHeight - (inputWidth + 8)) / 2}px`,
      top: `${(height - (inputHeight + 6)) / 2}px`,
      value: 'rightPadding'
    }

    // 右 外边距 梯形
    const rigthMarginPolygon:PolygonData = {
      id: 8,
      fill: polygonFill.rightMarginFill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      points: [
        topMarginPolygon.points[2],
        topMarginPolygon.points[1],
        bottomMarginPolygon.points[2],
        bottomMarginPolygon.points[1],
        topMarginPolygon.points[2],
      ]
    }

    // 右 外边距 输入框
    const rightMarginInput:InputData = {
      width: `${inputWidth}px`,
      height: `${inputHeight}px`,
      left: `${innerLeft + innerWidth + leftTrapezoiHeight + (leftTrapezoiHeight - (inputWidth + 8)) / 2}px`,
      top: `${(height - (inputHeight + 6)) / 2}px`,
      value: 'rightMargin'
    }

    this.svgData = {
      width: width,
      height: height,
      polygons: [
        centerPolygon,
        topPaddingPolygon,
        topMarginPolygon,
        bottomPaddingPolygon,
        bottomMarginPolygon,
        leftPaddingPolygon,
        leftMarginPolygon,
        rightPaddingPolygon,
        rigthMarginPolygon
      ],
      inputs: [
        topPaddingInput,
        topMarginInput,
        bottomPaddingInput,
        bottomMarginInput,
        leftPaddingInput,
        leftMarginInput,
        rightPaddingInput,
        rightMarginInput
      ]
    }
  }

  mouseenter(item: PolygonData): void {
    if (item.id === 0) return;
    this.tempNormalColor = item.fill;
    item.fill = this.highlightColor;
  }

  mouseleave(item: PolygonData): void {
    if (item.id === 0) return;
    item.fill = this.tempNormalColor;
  }

  mousedown(item: PolygonData): void {
    if (item.id === 0) return;
    item.fill = this.selectedColor;
  }

  mouseup(item: PolygonData): void {
    if (item.id === 0) return;
    item.fill = this.highlightColor;
  }

  reset(): void {
    this.adjustData = JSON.parse(JSON.stringify(this.originalAdjustData));
    this.adjustDataChange.emit(this.adjustData);
  }
}
