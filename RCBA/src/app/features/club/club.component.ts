import { Component, signal, inject } from '@angular/core';
import { ClubService } from '../../core/services/club.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-club',
  standalone: true,
  imports: [BadgeComponent],
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

  // Organigrammes officiels saison 2025-2026 (source officielle Footeo RCBA)
  readonly activeOrga = signal<'all' | 'orga1' | 'orga2' | 'orga3'>('all');

  readonly organigrammes = [
    {
      id: 'orga1',
      title: 'Organigramme Général & Conseil d\'Administration',
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
}
