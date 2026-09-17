import {
  Component,
  input,
  ElementRef,
  viewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bento-illustration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bento-illustration-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#070B14]/70 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300 hover:border-[#00FF66]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,255,102,0.15)] min-h-[300px]">
      
      <!-- Image d'arrière-plan avec effet de Parallax au scroll & mix-blend-mode -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          #parallaxImg
          [src]="imageUrl()"
          [alt]="title()"
          class="w-full h-[130%] object-cover object-center absolute -top-[15%] transition-transform duration-100 ease-out opacity-25 group-hover:opacity-40 filter contrast-125"
          [style.mix-blend-mode]="blendMode()"
          [style.transform]="'translateY(' + parallaxOffset + 'px)'"
        />
        <!-- Dégradé protecteur pour garantir la lisibilité du texte -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent"></div>
      </div>

      <!-- Header de la carte Bento -->
      <div class="relative z-10 space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[#00FF66]/15 border border-[#00FF66]/30 px-3 py-0.5 text-[10px] font-black uppercase font-sport text-[#00FF66] tracking-wider">
            {{ tag() }}
          </span>
          @if (date()) {
            <span class="text-[11px] font-mono font-bold text-slate-400">
              {{ date() }}
            </span>
          }
        </div>

        <h3 class="text-2xl sm:text-3xl font-black uppercase italic tracking-tight font-display text-white group-hover:text-[#00FF66] transition-colors leading-tight drop-shadow-md">
          {{ title() }}
        </h3>
      </div>

      <!-- Contenu et Description -->
      <div class="relative z-10 mt-4 space-y-4">
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {{ description() }}
        </p>

        @if (ctaText()) {
          <div>
            <a
              [href]="ctaLink() || '#'"
              class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00FF66] group-hover:underline font-sport"
            >
              <span>{{ ctaText() }}</span>
              <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
})
export class BentoIllustrationComponent {
  readonly imageUrl = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tag = input<string>('TEMPS FORT RCBA');
  readonly date = input<string | undefined>(undefined);
  readonly ctaText = input<string | undefined>(undefined);
  readonly ctaLink = input<string | undefined>(undefined);
  readonly blendMode = input<'luminosity' | 'overlay' | 'screen' | 'color-dodge'>('luminosity');

  parallaxOffset = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY || window.pageYOffset;
    // Parallax léger : défilement à 8% de la vitesse du scroll
    this.parallaxOffset = (scrollY % 1000) * -0.08;
  }
}
