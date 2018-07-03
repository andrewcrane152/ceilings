import { Directive, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appStyledSelect]'
})
export class StyledSelectDirective implements AfterViewInit {
  @ViewChild('select') inputChild: ElementRef;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.applyStyles();
  }

  applyStyles() {
    this.setParentDivStyles(this.el.nativeElement);
    this.setDropdownArrow();
    this.setSelectStyles(this.el.nativeElement.getElementsByTagName('select')[0]);
  }

  setParentDivStyles(parentDiv: ElementRef) {
    this.renderer.setStyle(parentDiv, 'position', 'relative');
  }

  setSelectStyles(select: ElementRef) {
    console.log('select:', select);
    this.renderer.setStyle(select, '-webkit-appearance', 'none');
    this.renderer.setStyle(select, '-moz-appearance', 'none');
    this.renderer.setStyle(select, 'appearance', 'none');
    this.renderer.setStyle(select, 'height', '32px');
    this.renderer.setStyle(select, 'width', '260px');
    this.renderer.setStyle(select, 'text-indent', '8px');
    this.renderer.setStyle(select, 'border', '1px solid #cccccc');
    this.renderer.setStyle(select, 'border-radius', '0px');
    this.renderer.setStyle(select, 'background-color', '#ffffff');
  }

  setDropdownArrow() {
    const newSpan = this.renderer.createElement('span');
    this.renderer.setStyle(newSpan, 'cursor', 'pointer');
    this.renderer.setStyle(newSpan, 'height', '32px');
    this.renderer.setStyle(newSpan, 'width', '24px');
    this.renderer.setStyle(newSpan, 'position', 'absolute');
    this.renderer.setStyle(newSpan, 'right', '0px');
    this.renderer.setStyle(newSpan, 'background-url', '/src/assets/icons/tools/arrow.png');
    this.renderer.appendChild(this.el.nativeElement, newSpan);
  }
}
