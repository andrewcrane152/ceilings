import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appStyledButton]'
})
export class StyledButtonDirective implements AfterViewInit {
  // tslint:disable-next-line:no-input-rename
  @Input('appStyledButton')
  buttonType: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'justify-content', 'space-between');
    const button = this.el.nativeElement.getElementsByTagName('button')[0];
    this.renderer.setStyle(button, 'margin', '0px');
    // this.renderer.setStyle(button, 'min-width', '150px');
    this.renderer.setStyle(button, '-webkit-appearance', 'none');
    this.renderer.setStyle(button, '-moz-appearance', 'none');
    this.renderer.setStyle(button, 'appearance', 'none');
    this.renderer.setStyle(button, 'border', '0');
    this.renderer.setStyle(button, 'border-radius', '0px');
    switch (this.buttonType) {
      case 'primary':
        this.stylePrimaryButton(button);
        break;
      case 'primary-right':
        this.stylePrimaryButton(button);
        this.addArrowRight(button);
        break;
      case 'primary-right-large':
        this.stylePrimaryButton(button, 'large');
        this.addArrowRight(button);
        break;
      case 'primary-left':
        this.stylePrimaryButton(button);
        this.addArrowLeft(button);
        break;
      case 'secondary':
        this.styleSecondaryButton(button);
        break;
      case 'secondary-right':
        this.styleSecondaryButton(button);
        this.addArrowRight(button);
        break;
      case 'secondary-left':
        this.styleSecondaryButton(button);
        this.addArrowLeft(button);
        break;
      case 'secondary-left-rotate90':
        this.styleSecondaryButton(button);
        this.addArrowLeft(button, '90');
        break;
      default:
        this.stylePrimaryButton(button);
        break;
    }
  }

  stylePrimaryButton(button, size?) {
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
    this.renderer.setStyle(button, 'line-height', '3.75');
    this.renderer.setStyle(button, 'font-weight', '500');
    this.renderer.setStyle(button, 'text-indent', '8px');
    this.renderer.setStyle(button, 'background-color', '#000');
    this.renderer.setStyle(button, 'border', '2px solid #000');
    this.renderer.setStyle(button, 'color', '#fff');
    if (size === 'large') {
      this.renderer.setStyle(button, 'width', '100%');
      this.renderer.setStyle(button, 'display', 'flex');
      this.renderer.setStyle(button, 'align-items', 'center');
      this.renderer.setStyle(button, 'justify-content', 'space-between');
    }
  }

  styleSecondaryButton(button) {
    this.renderer.setStyle(button, 'background-color', '#fff');
    this.renderer.setStyle(button, 'border', '2px solid #fff');
    this.renderer.setStyle(button, 'line-height', '3.75');
    this.renderer.setStyle(button, 'font-size', '0.9em');
    this.renderer.setStyle(button, 'font-weight', '500');
  }

  addArrowRight(button) {
    const newImg = this.renderer.createElement('img');
    const arrowColor = this.buttonType.includes('primary') ? 'arrow-white' : 'arrow';
    this.renderer.setAttribute(newImg, 'src', `/assets/icons/tools/${arrowColor}.png`);
    this.renderer.setAttribute(newImg, 'alt', `arrow img`);
    this.renderer.setStyle(newImg, 'height', '20px');
    this.renderer.setStyle(newImg, 'width', '20px');
    this.renderer.setStyle(newImg, 'margin-right', '10px');
    this.renderer.setStyle(newImg, 'margin-left', '10px');
    this.renderer.setStyle(newImg, 'padding', '0px');
    this.renderer.appendChild(button, newImg);
  }

  addArrowLeft(button, rotation?) {
    const newImg = this.renderer.createElement('img');
    const arrowColor = this.buttonType.includes('primary') ? 'arrow-white' : 'arrow';
    this.renderer.setAttribute(newImg, 'src', `/assets/icons/tools/${arrowColor}.png`);
    this.renderer.setAttribute(newImg, 'alt', `arrow img`);
    this.renderer.setStyle(newImg, 'height', '20px');
    this.renderer.setStyle(newImg, 'width', '20px');
    this.renderer.setStyle(newImg, 'margin-right', '10px');
    if (!!rotation) {
      this.renderer.setStyle(newImg, 'transform', `rotate(${rotation}deg)`);
      this.renderer.setStyle(newImg, '-webkit-transform', `rotate(${rotation}deg)`);
    }
    this.renderer.appendChild(button, newImg);
    this.renderer.setStyle(button, 'display', 'flex');
    this.renderer.setStyle(button, 'flex-direction', 'row-reverse');
    this.renderer.setStyle(button, 'align-items', 'center');
  }
}
