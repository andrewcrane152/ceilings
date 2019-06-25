import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appStyledSelect]'
})
export class StyledSelectDirective implements AfterViewInit {
  @Input()
  width: string;

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
    this.renderer.setStyle(select, '-webkit-appearance', 'none');
    this.renderer.setStyle(select, '-moz-appearance', 'none');
    this.renderer.setStyle(select, 'appearance', 'none');
    this.renderer.setStyle(select, 'height', '32px');
    this.renderer.setStyle(select, 'width', `${this.width}px`);
    this.renderer.setStyle(select, 'text-indent', '8px');
    this.renderer.setStyle(select, 'border', '1px solid #cccccc');
    this.renderer.setStyle(select, 'border-radius', '0px');
    this.renderer.setStyle(select, 'background-color', '#ffffff');
  }

  setDropdownArrow() {
    const newSpan = this.renderer.createElement('span');
    this.renderer.setStyle(newSpan, 'cursor', 'pointer');
    this.renderer.setStyle(newSpan, 'height', '14px');
    this.renderer.setStyle(newSpan, 'width', '14px');
    this.renderer.setStyle(newSpan, 'position', 'absolute');
    this.renderer.setStyle(newSpan, 'right', '12px');
    this.renderer.setStyle(newSpan, 'top', '2px');
    this.renderer.setStyle(newSpan, 'background', 'url("/assets/icons/tools/down-chevron.png") no-repeat top left');
    this.renderer.setStyle(newSpan, 'background-size', 'contain');
    this.renderer.appendChild(this.el.nativeElement, newSpan);
  }
}
