import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { Hero3DComponent } from '../../shared/components/hero-3d/hero-3d.component';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [BadgeComponent, RouterLink, Hero3DComponent],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent {
  private readonly clubService = inject(ClubService);

  readonly recentResults = this.clubService.recentResults;
  readonly upcomingMatches = this.clubService.upcomingMatches;
  readonly clubEvents = this.clubService.clubEvents;
  readonly activeAlert = this.clubService.activeAlert;
  readonly teams = this.clubService.teams;

  // Filtre catégorie pour les matchs
  readonly selectedCategory = signal<string>('all');

  // Filtre d'onglet actif : 'matchs' | 'planning' | 'evenements'
  readonly activeSection = signal<'matchs' | 'planning' | 'evenements'>('matchs');

  readonly filteredMatches = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.upcomingMatches();
    return this.upcomingMatches().filter((m) => m.category.toLowerCase().includes(cat.toLowerCase()));
  });

  readonly categories = [
    { key: 'all', label: 'Toutes les équipes' },
    { key: 'seniors', label: 'Seniors' },
    { key: 'veterans', label: 'Vétérans' },
    { key: 'u15', label: 'U15' },
    { key: 'u13', label: 'U13' },
    { key: 'ecole', label: 'École de Foot' },
  ];

  setCategory(key: string): void {
    this.selectedCategory.set(key);
  }
}
