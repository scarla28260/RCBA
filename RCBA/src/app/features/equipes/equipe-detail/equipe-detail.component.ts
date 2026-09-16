import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ClubService } from '../../../core/services/club.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-equipe-detail',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  templateUrl: './equipe-detail.component.html',
  styleUrl: './equipe-detail.component.css',
})
export class EquipeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly clubService = inject(ClubService);

  private readonly teamId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? ''))
  );

  readonly team = computed(() => {
    const id = this.teamId();
    return this.clubService.teams().find((t) => t.id === id) ?? null;
  });

  readonly staffForTeam = computed(() => {
    const team = this.team();
    if (!team) return [];
    return this.clubService.staff().filter(
      (s) =>
        s.teamId === team.id ||
        (s.category === 'technique' &&
          (team.coach.includes(s.lastName) || team.coach.includes(s.firstName) ||
           (team.assistantCoach && (team.assistantCoach.includes(s.lastName) || team.assistantCoach.includes(s.firstName)))))
    );
  });

  readonly playersForTeam = computed(() => {
    const team = this.team();
    if (!team) return [];

    // Récupérer les licenciés affectés à cette équipe depuis le registre Direction
    const assignedFromLicencies = this.clubService
      .licencies()
      .filter((l) => l.teamId === team.id)
      .map((l, index) => ({
        id: l.id,
        firstName: l.prenom,
        lastName: l.nom,
        number: (index + 1),
        position: l.positionPreferee || 'Joueur',
        photo: l.photo,
      }));

    const rawPlayers = assignedFromLicencies.length > 0 ? assignedFromLicencies : (team.players || []);

    // Compter les occurrences de chaque prénom dans cette équipe
    const firstNameCounts = new Map<string, number>();
    rawPlayers.forEach((p) => {
      const fn = (p.firstName || '').trim().toLowerCase();
      firstNameCounts.set(fn, (firstNameCounts.get(fn) || 0) + 1);
    });

    // Formater le displayName : uniquement le prénom, ou "Prénom N." si plusieurs joueurs partagent le même prénom
    return rawPlayers.map((player) => {
      const fn = (player.firstName || '').trim();
      const fnKey = fn.toLowerCase();
      const count = firstNameCounts.get(fnKey) || 0;
      let displayName = fn;

      if (count > 1 && player.lastName) {
        const initial = player.lastName.trim().charAt(0).toUpperCase();
        displayName = `${fn} ${initial}.`;
      }

      // Stats du joueur
      const stats = this.clubService.getStatsForPlayer(player.id, `${player.firstName} ${player.lastName}`);

      return {
        ...player,
        displayName,
        stats,
      };
    });
  });

  // Convocation officielle publiée pour cette équipe
  readonly activeConvocation = computed(() => {
    const team = this.team();
    if (!team) return null;
    return this.clubService.convocations().find((c) => c.teamId === team.id && c.published !== false) || null;
  });

  // Est-ce que le joueur est sélectionné dans la convocation active ?
  isPlayerSelected(player: { firstName: string; lastName: string; displayName: string }): boolean {
    const conv = this.activeConvocation();
    if (!conv || !conv.selectedPlayers) return false;
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const shortName = player.displayName.toLowerCase();
    return conv.selectedPlayers.some((pName) => {
      const pLower = pName.toLowerCase();
      return (
        pLower.includes(player.firstName.toLowerCase()) ||
        fullName.includes(pLower) ||
        pLower === shortName
      );
    });
  }

  readonly recentMatchesForTeam = computed(() => {
    const team = this.team();
    if (!team) return [];
    // Filter results by team name keyword
    const keyword = team.ageGroup.split(' ')[0]; // e.g. "U13", "Senior", "Vétérans"
    return this.clubService.recentResults().filter(
      (r) => r.category.toLowerCase().includes(keyword.toLowerCase()) ||
             r.teamHome.toLowerCase().includes('rcba') ||
             r.teamAway.toLowerCase().includes('rcba')
    ).slice(0, 4);
  });

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      bureau: '#101d69',
      administration: '#6366f1',
      technique: '#21ad1c',
      communication: '#f59e0b',
    };
    return map[category] ?? '#6b7280';
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  }
}
