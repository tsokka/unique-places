import {Directive, ElementRef, inject, input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(click)': 'hide()',
  },
})
export class TooltipDirective implements OnDestroy {
  private element = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private tooltip: HTMLElement | null = null;

  tooltipText = input('', {alias: 'appTooltip'});

  show() {
    if (!this.tooltipText()) return;

    this.tooltip = this.renderer.createElement('span');
    this.renderer.appendChild(this.tooltip, this.renderer.createText(this.tooltipText()));
    this.renderer.addClass(this.tooltip, 'tooltip');
    this.renderer.appendChild(document.body, this.tooltip);

    const rect = this.element.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltip, 'top', `${rect.bottom + 17}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${rect.left + rect.width / 2 - 153}px`);
  }

  hide() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }

  ngOnDestroy() {
    this.hide();
  }
}
