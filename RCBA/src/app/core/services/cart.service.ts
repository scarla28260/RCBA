import { Injectable, signal, computed } from '@angular/core';
import { BoutiqueItem, CartItem } from '../models/boutique.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  /**
   * État réactif du panier basé sur les Signals Angular
   */
  readonly items = signal<CartItem[]>([]);

  /**
   * Nombre total d'articles dans le panier
   */
  readonly count = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  /**
   * Montant total en euros du panier
   */
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.item.price * item.quantity, 0)
  );

  /**
   * Ajouter un article au panier avec une taille donnée
   */
  addToCart(product: BoutiqueItem, size: string, quantity = 1): void {
    const safeSize = size || (product.availableSizes && product.availableSizes[0]) || 'Unique';
    const current = this.items();
    const existingIndex = current.findIndex(
      (ci) => ci.item.id === product.id && ci.size === safeSize
    );

    if (existingIndex > -1) {
      this.items.update((list) => {
        const copy = [...list];
        copy[existingIndex].quantity += quantity;
        return copy;
      });
    } else {
      this.items.update((list) => [
        ...list,
        { item: product, size: safeSize, quantity },
      ]);
    }
  }

  /**
   * Mettre à jour la quantité d'un article dans le panier
   */
  updateQuantity(index: number, delta: number): void {
    this.items.update((list) => {
      const copy = [...list];
      const target = copy[index];
      if (!target) return list;

      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== index);
      }
      copy[index] = { ...target, quantity: newQty };
      return copy;
    });
  }

  /**
   * Supprimer une ligne du panier
   */
  removeItem(index: number): void {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }

  /**
   * Vider le panier (après commande ou annulation)
   */
  clearCart(): void {
    this.items.set([]);
  }
}
