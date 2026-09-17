import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueItem } from '../../core/models/boutique.model';
import { CartService } from '../../core/services/cart.service';
import { BoutiqueCardComponent } from '../../shared/components/boutique-card/boutique-card.component';

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, BoutiqueCardComponent],
  templateUrl: './boutique.component.html',
  styleUrl: './boutique.component.css',
})
export class BoutiqueComponent {
  private readonly cartService = inject(CartService);

  // Panier réactif via le service
  readonly cart = this.cartService.items;
  readonly cartTotal = this.cartService.total;
  readonly cartCount = this.cartService.count;
  // Liste officielle des articles officiels du club (adidas & équipementier Les 3S Sports)
  readonly articles = signal<BoutiqueItem[]>([
    {
      id: 'maillot-domicile',
      name: 'Maillot Officiel Match Domicile',
      category: 'tenue',
      price: 35,
      brand: 'adidas Tiro 24',
      badge: 'Best-Seller',
      description: 'Maillot officiel de match du Racing Club Bû Abondant aux couleurs Bleu Roi et Vert avec blason officiel brodé et flocage club.',
      image: '/images/boutique/maillot-domicile.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'short-match',
      name: 'Short Officiel adidas Match',
      category: 'tenue',
      price: 22,
      brand: 'adidas Tiro 24',
      description: 'Short respirant Aeroready avec taille élastique et cordon de serrage. Blason RCBA sur la cuisse droite.',
      image: '/images/boutique/kit-home.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'sweat-entrainement',
      name: 'Sweat 1/4 Zip Entraînement',
      category: 'entrainement',
      price: 45,
      brand: 'adidas Entrada',
      badge: 'Indispensable',
      description: 'Haut d\'échauffement demi-zip chaud et isolant pour les séances du mercredi et les déplacements en soirée.',
      image: '/images/boutique/pack-training.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'pantalon-survet',
      name: 'Pantalon de Survêtement Fuseau',
      category: 'entrainement',
      price: 38,
      brand: 'adidas Tiro',
      description: 'Coupe slim fuselée avec zips aux chevilles facilitant le passage par-dessus les chaussures à crampons.',
      image: '/images/boutique/pack-training.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'veste-coach-pluie',
      name: 'Veste Coupe-Vent Imperméable All-Weather',
      category: 'veste',
      price: 52,
      brand: 'adidas Core',
      description: 'Veste déperlante avec capuche intégrée pour affronter la pluie et le vent sur les bancs de touche.',
      image: '/images/boutique/jacket-tactical.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'doudoune-hiver',
      name: 'Doudoune Parka Hivernale RCBA',
      category: 'veste',
      price: 79,
      brand: 'adidas Stadium',
      badge: 'Chaleur Max',
      description: 'Manteau long grand froid rembourré avec poches doublées polaire et logo brodé au cœur.',
      image: '/images/boutique/veste-softshell.png',
      availableSizes: ['6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    {
      id: 'chaussettes-match',
      name: 'Chaussettes de Match Hautes',
      category: 'tenue',
      price: 12,
      brand: 'adidas Milano',
      description: 'Paire de chaussettes montantes anatomiques avec maintien de la cheville et de la voûte plantaire.',
      image: '/images/boutique/kit-home.png',
      availableSizes: ['27-30 (Enfant)', '31-34 (Enfant)', '35-38 (Junior)', '39-42 (Adulte)', '43-46 (Adulte)'],
    },
    {
      id: 'sac-sport',
      name: 'Sac de Sport Compartiment Crampons',
      category: 'accessoire',
      price: 34,
      brand: 'adidas Tiro Bag',
      description: 'Grand sac à bandoulière matelassée avec fond rigide imperméable et compartiment ventilé pour chaussures sales.',
      image: '/images/boutique/sac-sport.png',
      availableSizes: ['Taille Unique (M - 40L)', 'Grand Format (L - 60L)'],
    },
    {
      id: 'bonnet-echarpe',
      name: 'Pack Hivernal : Bonnet & Écharpe Supporters',
      category: 'accessoire',
      price: 20,
      brand: 'RCBA Club',
      badge: 'Supporter',
      description: 'L\'ensemble chaud officiel en tricot aux couleurs du club pour soutenir nos équipes le week-end.',
      image: '/images/boutique/accessories.png',
      availableSizes: ['Taille Unique Enfant', 'Taille Unique Adulte'],
    },
    {
      id: 'gourde-club',
      name: 'Gourde Isotherme 750ml Sans BPA',
      category: 'accessoire',
      price: 10,
      brand: 'RCBA Club',
      description: 'Gourde individuelle réutilisable avec bouchon sport étanche personnalisable avec le prénom du joueur.',
      image: '/images/boutique/accessories.png',
      availableSizes: ['750 ml'],
    },
  ]);

  // Filtre de catégorie
  readonly selectedCategory = signal<string>('all');

  // Sélection par article (taille et quantité choisies par l'utilisateur pour chaque produit)
  readonly itemSelections = signal<Record<string, { size: string; quantity: number }>>({
    'maillot-domicile': { size: '10 ans', quantity: 1 },
    'short-match': { size: '10 ans', quantity: 1 },
    'sweat-entrainement': { size: '12 ans', quantity: 1 },
    'pantalon-survet': { size: '10 ans', quantity: 1 },
    'veste-coach-pluie': { size: 'M', quantity: 1 },
    'doudoune-hiver': { size: 'L', quantity: 1 },
    'chaussettes-match': { size: '35-38 (Junior)', quantity: 1 },
    'sac-sport': { size: 'Taille Unique (M - 40L)', quantity: 1 },
    'bonnet-echarpe': { size: 'Taille Unique Adulte', quantity: 1 },
    'gourde-club': { size: '750 ml', quantity: 1 },
  });

  readonly orderSuccess = signal<boolean>(false);

  // Formulaire d'information commande
  customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    teamCategory: 'École de Foot (U6 à U13)',
    notes: '',
  };

  // Liste filtrée
  readonly filteredArticles = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.articles();
    return this.articles().filter((a) => a.category === cat);
  });

  // Supprimer du panier
  removeFromCart(index: number): void {
    this.cartService.removeItem(index);
  }

  // Validation commande
  submitOrder(): void {
    if (this.cart().length === 0) return;
    this.orderSuccess.set(true);
    this.cartService.clearCart();
    setTimeout(() => {
      this.orderSuccess.set(false);
      this.customer = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        teamCategory: 'École de Foot (U6 à U13)',
        notes: '',
      };
    }, 6000);
  }
}
