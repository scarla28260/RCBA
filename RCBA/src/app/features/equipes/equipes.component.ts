import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';

@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './equipes.component.html',
  styleUrl: './equipes.component.css',
})
export class EquipesComponent {
  private readonly clubService = inject(ClubService);

  readonly teams = this.clubService.teams;
  readonly recentResults = this.clubService.recentResults;

  readonly activePole = signal<'all' | 'ecole-foot' | 'foot-a-11'>('all');

  readonly filteredTeams = computed(() => {
    const pole = this.activePole();
    if (pole === 'all') return this.teams();
    return this.teams().filter((t) => t.pole === pole);
  });

  readonly ecoleFootCount = computed(() => this.teams().filter((t) => t.pole === 'ecole-foot').length);
  readonly foot11Count = computed(() => this.teams().filter((t) => t.pole === 'foot-a-11').length);
}
