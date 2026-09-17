import { Component, input, signal, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BoutiqueItem } from '../../../core/models/boutique.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-boutique-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './boutique-card.component.html',
  styleUrl: './boutique-card.component.css',
})
export class BoutiqueCardComponent implements OnInit {
  private readonly cartService = inject(CartService);

  /**
   * Propriétés en entrée sous forme d'Angular Signals input()
   */
  readonly product = input.required<BoutiqueItem>();
  readonly isFeatured = input<boolean>(false);

  /**
   * Signal d'état local : taille actuellement sélectionnée par l'utilisateur
   */
  readonly selectedSize = signal<string>('');

  /**
   * Feedback visuel temporaire après ajout au panier
   */
  readonly justAdded = signal<boolean>(false);

  ngOnInit(): void {
    const sizes = this.product().availableSizes;
    if (sizes && sizes.length > 0) {
      this.selectedSize.set(sizes[0]);
    }
  }

  /**
   * Changer la taille sélectionnée
   */
  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  /**
   * Ajouter l'article sélectionné au panier sans recharger la page
   */
  addToCart(): void {
    const p = this.product();
    const size = this.selectedSize() || (p.availableSizes && p.availableSizes[0]) || 'Unique';
    this.cartService.addToCart(p, size, 1);

    // Animation de validation
    this.justAdded.set(true);
    setTimeout(() => {
      this.justAdded.set(false);
    }, 1800);
  }
}
