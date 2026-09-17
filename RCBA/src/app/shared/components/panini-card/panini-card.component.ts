import { Component, input, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-panini-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './panini-card.component.html',
  styleUrl: './panini-card.component.css',
})
export class PaniniCardComponent {
  /**
   * Entrées basées sur les Angular Signals (input())
   */
  readonly photoUrl = input<string | undefined>(undefined);
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  readonly category = input<string>('U11');
  readonly role = input<string>('Joueur');
  readonly isRare = input<boolean>(false);
  readonly isGold = input<boolean>(false); // Mode vignette dorée (Direction / Légende)
  readonly number = input<number | undefined>(undefined);

  /**
   * Initiales si pas de photo
   */
  readonly initials = computed(() => {
    const fn = (this.firstName() || '').trim();
    const ln = (this.lastName() || '').trim();
    const firstChar = fn.length > 0 ? fn[0] : '';
    const lastChar = ln.length > 0 ? ln[0] : '';
    return `${firstChar}${lastChar}`.toUpperCase() || 'RC';
  });

  /**
   * Couleurs du badge de catégorie
   */
  readonly categoryBadgeBg = computed(() => {
    const cat = (this.category() || '').toLowerCase();
    if (cat.includes('direction') || cat.includes('bureau')) return 'bg-amber-400 text-slate-900 border-amber-300';
    if (cat.includes('senior')) return 'bg-blue-600 text-white border-blue-400';
    if (cat.includes('veteran') || cat.includes('vétéran')) return 'bg-emerald-600 text-white border-emerald-400';
    if (cat.includes('feminin') || cat.includes('féminin') || cat.includes('f')) return 'bg-fuchsia-600 text-white border-fuchsia-400';
    return 'bg-[#21ad1c] text-white border-emerald-300';
  });
}
