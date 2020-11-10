import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import interact from 'interactjs';

interface SvgData {
  width: number;
  height: number;
  items: Polygon[];
}

interface Polygon {
  id: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  points: string[]
}

@Component({
  selector: 'app-spacing-plugin',
  templateUrl: './spacing-plugin.component.html',
  styleUrls: ['./spacing-plugin.component.scss']
})

export class SpacingPluginComponent implements OnInit {

  @Input() svgWidth: number;
  @Input() svgHeight: number;

  @Input() adjustMargin: string;
  @Output() adjustMarginChange = new EventEmitter();

  @Input() adjustPadding: string;
  @Output() adjustPaddingChange = new EventEmitter();

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

  svgData: SvgData;
  tempNormalColor: string;

  tempAdjustMargin: string;
  tempAdjustPadding: string;

  ngOnInit(): void {
    this.initStyle()
  }

  ngAfterViewInit(): void {
    const divs: any[] = this.elementRef.nativeElement.querySelectorAll('polygon');    
    divs.forEach((div: any) => {
      this.initDrag(div);
    });
  }

  initDrag(div:HTMLElement): void {
    const elementControl = interact(div);
    const that = this;
    const padding = that.tempAdjustPadding ? that.tempAdjustPadding.split(' ') : that.adjustPadding.split(' ');
    elementControl.draggable({
      listeners: {
        start() {
          that.tempAdjustMargin = that.adjustMargin;
          that.tempAdjustPadding = that.adjustPadding;
        },
        move(event) {
          const { y0, client, target } = event;
          switch (target.id) {
            case 'spacing-polygon:'+1:
              let paddingTop = Number(padding[0].split('px')[0]);
              paddingTop = paddingTop + (client.y - y0);
              if (paddingTop < 0) paddingTop = 0;
              padding[0] = paddingTop + 'px';
              that.adjustPadding = padding.join(' ');
              that.adjustPaddingChange.emit(that.adjustPadding);
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
    const width = this.svgWidth;
    const height = this.svgHeight;
    // 内部矩形宽高
    const innerWidth = width / 3;
    const innerHeight = height / 3;
    const innerLeft = (width - innerWidth) / 2;
    const innerTop = (height - innerHeight) / 2;
    // 上下梯形高度
    const topTrapezoiHeight = innerTop / 2;
    // 左右梯形高度
    const leftTrapezoiHeight = innerLeft / 2;
    
    // 中间矩形
    const centerPolygon:Polygon = {
      id: 0,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 0,
      points: [
        `${innerLeft},${innerTop}`,
        `${innerLeft + innerWidth},${innerTop}`,
        `${innerLeft + innerWidth},${innerHeight + innerTop}`,
        `${innerLeft},${innerHeight + innerTop}`,
        `${innerLeft},${innerTop}`
      ]
    }

    // 上 内边距 梯形
    const topPaddingPolygon:Polygon = {
      id: 1,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        `${leftTrapezoiHeight},${topTrapezoiHeight}`,
        `${innerLeft + innerWidth + leftTrapezoiHeight},${topTrapezoiHeight}`,
        centerPolygon.points[1],
        centerPolygon.points[0],
        `${leftTrapezoiHeight},${topTrapezoiHeight}`
      ]
    }

    // 上 外边距 梯形
    const topMarginPolygon:Polygon = {
      id: 2,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        `${0},${0}`,
        `${width},${0}`,
        topPaddingPolygon.points[1],
        topPaddingPolygon.points[0],
        `${0},${0}`
      ]
    }

    // 下 内边距 梯形
    const bottomPaddingPolygon:Polygon = {
      id: 3,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        centerPolygon.points[3],
        centerPolygon.points[2],
        `${innerLeft + innerWidth + leftTrapezoiHeight},${innerHeight + innerTop + topTrapezoiHeight}`,
        `${leftTrapezoiHeight},${innerHeight + innerTop + topTrapezoiHeight}`,
        centerPolygon.points[3]
      ]
    }

    // 下 外边距 梯形
    const bottomMarginPolygon:Polygon = {
      id: 4,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        bottomPaddingPolygon.points[3],
        bottomPaddingPolygon.points[2],
        `${width},${height}`,
        `${0},${height}`,
        bottomPaddingPolygon.points[3]
      ]
    }

    // 左 内边距 梯形
    const leftPaddingPolygon:Polygon = {
      id: 5,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        topPaddingPolygon.points[0],
        centerPolygon.points[0],
        centerPolygon.points[3],
        bottomPaddingPolygon.points[3],
        topPaddingPolygon.points[0],
      ]
    }
    
    // 左 外边距 梯形
    const leftMarginPolygon:Polygon = {
      id: 6,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        topMarginPolygon.points[0],
        leftPaddingPolygon.points[0],
        leftPaddingPolygon.points[3],
        bottomMarginPolygon.points[3],
        topMarginPolygon.points[0],
      ]
    }

    // 右 内边距 梯形
    const rightPaddingPolygon:Polygon = {
      id: 7,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        centerPolygon.points[1],
        topPaddingPolygon.points[1],
        bottomPaddingPolygon.points[2],
        centerPolygon.points[2],
        centerPolygon.points[1],
      ]
    }

    // 右 外边距 梯形
    const rigthMarginPolygon:Polygon = {
      id: 8,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      points: [
        topMarginPolygon.points[2],
        topMarginPolygon.points[1],
        bottomMarginPolygon.points[2],
        bottomMarginPolygon.points[1],
        topMarginPolygon.points[2],
      ]
    }

    this.svgData = {
      width: width,
      height: height,
      items: [
        centerPolygon,
        topPaddingPolygon,
        topMarginPolygon,
        bottomPaddingPolygon,
        bottomMarginPolygon,
        leftPaddingPolygon,
        leftMarginPolygon,
        rightPaddingPolygon,
        rigthMarginPolygon
      ]
    }
  }

  mouseenter(item: Polygon): void {
    if (item.id === 0) return;
    this.tempNormalColor = item.fill;
    item.fill = 'ghostwhite';
  }

  mouseleave(item: Polygon): void {
    if (item.id === 0) return;
    item.fill = this.tempNormalColor;
  }

  mousedown(item: Polygon): void {
    if (item.id === 0) return;
    item.fill = 'gainsboro';
  }

  mouseup(item: Polygon): void {
    if (item.id === 0) return;
    item.fill = 'ghostwhite';
  }
}
