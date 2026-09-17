import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { Hero3DComponent } from '../../shared/components/hero-3d/hero-3d.component';

@Component({
  selector: 'app-club',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, Hero3DComponent],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css',
})
export class ClubComponent {
  private readonly clubService = inject(ClubService);

  readonly clubName = this.clubService.clubName;
  readonly shortName = this.clubService.shortName;
  readonly affiliationFff = this.clubService.affiliationFff;
  readonly foundingYear = this.clubService.foundingYear;
  readonly territories = this.clubService.territories;
  readonly partners = this.clubService.partners;

  // Active section tab: organigramme, histoire, horaires, tarifs, charte, arbitres
  readonly activeTab = signal<'organigramme' | 'histoire' | 'horaires' | 'tarifs' | 'charte' | 'arbitres'>('organigramme');

  // Organigrammes officiels saison 2025-2026 (source officielle Footeo RCBA)
  readonly activeOrga = signal<'all' | 'orga1' | 'orga2' | 'orga3'>('all');

  readonly organigrammes = [
    {
      id: 'orga1',
      title: "Organigramme Général & Conseil d'Administration",
      subtitle: 'Bureau Directeur, Présidence & Responsables de Pôles',
      image: 'orga1.png',
    },
    {
      id: 'orga2',
      title: 'Organigramme Technique & Sportif',
      subtitle: 'Responsables de catégories, Éducateurs & Entraîneurs',
      image: 'orga2.png',
    },
    {
      id: 'orga3',
      title: 'Commissions, Bénévolat & Animation',
      subtitle: 'Événements, Sponsoring, Buvette & Communication',
      image: 'orga3.png',
    },
  ];

  // Horaires des entraînements (source club-info.json du projet original)
  readonly horaires = [
    { category: 'U7 / U9 (École de Foot)', days: 'Mercredi', time: '14h00 - 15h30', venue: 'Abondant' },
    { category: 'U11 (Foot Animation)', days: 'Lundi / Mercredi', time: '18h00 - 19h30', venue: 'Bû' },
    { category: 'U13 (Foot à 8)', days: 'Mardi / Jeudi', time: '18h00 - 19h30', venue: 'Bû' },
    { category: 'U15 (Foot à 11)', days: 'Mercredi / Vendredi', time: '18h30 - 20h00', venue: 'Abondant' },
    { category: 'Seniors (D3)', days: 'Mardi / Vendredi', time: '20h00 - 21h30', venue: 'Bû' },
    { category: 'Vétérans (D1 & D3)', days: 'Jeudi', time: '20h00 - 21h30', venue: 'Bû' },
  ];

  // Grille des cotisations & packs licences (source club-info.json du projet original)
  readonly cotisations = [
    { category: 'U6 à U9', price: 140, includes: 'Licence FFF + Pack Équipement adidas (Short, Chaussettes, Maillot entraînement)' },
    { category: 'U10 à U13', price: 150, includes: 'Licence FFF + Pack Équipement adidas complet' },
    { category: 'U15 à U18', price: 160, includes: 'Licence FFF + Pack Équipement officiel adidas' },
    { category: 'Seniors / Vétérans', price: 180, includes: 'Licence FFF + Pack Équipement de match & entraînement' },
    { category: 'Dirigeants & Éducateurs', price: 50, includes: 'Licence officielle FFF + Vêtement officiel club' },
  ];

  // Valeurs & Charte d'engagement (source club-info.json du projet original)
  readonly values = [
    {
      title: 'Respect',
      desc: "Considération envers chacun : arbitres, adversaires, éducateurs, coéquipiers et bénévoles.",
      icon: '🛡️',
    },
    {
      title: 'Sérieux & Assiduité',
      desc: "Respecter ses engagements, être à l'heure aux séances et donner le meilleur sur le terrain.",
      icon: '🎯',
    },
    {
      title: 'Convivialité',
      desc: "Favoriser les échanges, l'esprit de famille et la bonne humeur sur et en dehors du terrain.",
      icon: '🤝',
    },
    {
      title: 'Engagement',
      desc: "Participer activement à la vie du club et défendre fièrement les couleurs bleu et vert.",
      icon: '🔥',
    },
    {
      title: 'Performance & Plaisir',
      desc: "Allier progression individuelle et collective tout en conservant le plaisir du jeu.",
      icon: '⭐',
    },
  ];

  readonly commitments = [
    { title: 'Politesse', desc: 'Je reste poli(e) avec tout le monde (dire bonjour, respect des encadrants).' },
    { title: 'Ponctualité', desc: "Je suis à l'heure aux séances et matchs et je préviens mon éducateur en cas d'absence." },
    { title: "Respect de l'Autre", desc: 'Je respecte coéquipiers, éducateurs, adversaires et le corps arbitral.' },
    { title: 'Implication', desc: 'Je participe à la vie du club et je donne un coup de main avec plaisir.' },
    { title: 'Propreté', desc: 'Je laisse les vestiaires, gourdes et terrains propres après chaque séance.' },
    { title: 'Ambassadeur RCBA', desc: 'Mon comportement reflète les valeurs de notre club partout où je me déplace.' },
  ];

  // Corps arbitral officiel (source arbitres/page.tsx du projet original)
  readonly arbitres = [
    {
      name: 'Leny WAROQUIER',
      role: 'Arbitre Officiel de Ligue / District',
      photo: '/images/staff/leny-waroquier.png',
      experience: 'Arbitre club officiel représentant le RCBA sur les terrains officiels de la région.',
      badge: 'Arbitre Officiel FFF',
    },
  ];
}
