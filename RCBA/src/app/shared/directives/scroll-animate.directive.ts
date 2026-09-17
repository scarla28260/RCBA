import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private observer: IntersectionObserver | null = null;

  /**
   * Délai d'apparition échelonnée (stagger en ms)
   */
  readonly delay = input<number>(0);

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // État initial : invisible et décalé vers le bas
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(24px)');
    this.renderer.setStyle(element, 'transition', `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${this.delay()}ms`);

    // Configuration de l'Intersection Observer natif
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.renderer.setStyle(element, 'opacity', '1');
              this.renderer.setStyle(element, 'transform', 'translateY(0)');
              this.observer?.unobserve(element);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      this.observer.observe(element);
    } else {
      // Fallback si pas supporté
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'transform', 'translateY(0)');
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
