import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubService } from '../../core/services/club.service';
import { StaffMember } from '../../core/models/club.model';

type Category = 'all' | 'direction' | 'bureau' | 'administration' | 'technique' | 'communication';

@Component({
  selector: 'app-dirigeants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dirigeants.component.html',
  styleUrl: './dirigeants.component.css',
})
export class DirigeantsComponent {
  private readonly clubService = inject(ClubService);

  readonly clubName = this.clubService.clubName;
  readonly allStaff = this.clubService.staff;
  readonly activeCategory = signal<Category>('direction');

  readonly categories: { key: Category; label: string; icon: string }[] = [
    { key: 'direction', label: 'Direction & Bureau', icon: '🏛️' },
    { key: 'all', label: 'Tout le Club', icon: '👥' },
    { key: 'bureau', label: 'Bureau Exécutif', icon: '🏆' },
    { key: 'administration', label: 'Administration & CA', icon: '📋' },
    { key: 'technique', label: 'Staff Technique & Éducateurs', icon: '⚽' },
    { key: 'communication', label: 'Communication', icon: '📣' },
  ];

  // Regroupement des personnes uniques avec cumul de toutes leurs fonctions exercées
  readonly uniqueStaff = computed<StaffMember[]>(() => {
    const rawList = this.allStaff();
    const map = new Map<string, StaffMember>();

    for (const member of rawList) {
      // Clé unique normalisée (minuscules, sans accents, sans espaces superflus)
      const cleanFirst = member.firstName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cleanLast = member.lastName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const key = `${cleanFirst}_${cleanLast}`;

      if (!map.has(key)) {
        map.set(key, {
          ...member,
          roles: [member.role],
          categories: [member.category],
        });
      } else {
        const existing = map.get(key)!;
        // Cumul des rôles distincts
        const existingRoles = existing.roles || [existing.role];
        if (!existingRoles.some((r) => r.trim().toLowerCase() === member.role.trim().toLowerCase())) {
          existingRoles.push(member.role);
        }
        existing.roles = existingRoles;
        // Le rôle principal reste le plus prestigieux (bureau > administration > technique > communication)
        const priorityOrder: Record<string, number> = { bureau: 4, administration: 3, technique: 2, communication: 1 };
        if ((priorityOrder[member.category] || 0) > (priorityOrder[existing.category] || 0)) {
          existing.category = member.category;
          existing.role = member.role;
        }

        // Cumul des catégories distinctes
        const existingCats = existing.categories || [existing.category];
        if (!existingCats.includes(member.category)) {
          existingCats.push(member.category);
        }
        existing.categories = existingCats;

        // Préserver photo, téléphone, teamId si manquants
        if (!existing.photo && member.photo) existing.photo = member.photo;
        if (!existing.phone && member.phone) existing.phone = member.phone;
        if (!existing.email && member.email) existing.email = member.email;
        if (!existing.teamId && member.teamId) existing.teamId = member.teamId;
      }
    }

    return Array.from(map.values());
  });

  readonly filteredStaff = computed<StaffMember[]>(() => {
    const cat = this.activeCategory();
    const list = this.uniqueStaff();
    if (cat === 'all') return list;
    if (cat === 'direction') {
      return list.filter((m) => (m.categories || [m.category]).some((c) => c === 'bureau' || c === 'administration'));
    }
    return list.filter((m) => (m.categories || [m.category]).includes(cat));
  });

  readonly totalCount = computed(() => this.uniqueStaff().length);
  readonly bureauCount = computed(() => this.uniqueStaff().filter((m) => (m.categories || [m.category]).includes('bureau')).length);
  readonly directionCount = computed(() => this.uniqueStaff().filter((m) => (m.categories || [m.category]).some((c) => c === 'bureau' || c === 'administration')).length);
  readonly techniqueCount = computed(() => this.uniqueStaff().filter((m) => (m.categories || [m.category]).includes('technique')).length);

  setCategory(cat: Category): void {
    this.activeCategory.set(cat);
  }

  getCategoryCount(cat: Category): number {
    const list = this.uniqueStaff();
    if (cat === 'all') return list.length;
    if (cat === 'direction') {
      return list.filter((m) => (m.categories || [m.category]).some((c) => c === 'bureau' || c === 'administration')).length;
    }
    return list.filter((m) => (m.categories || [m.category]).includes(cat)).length;
  }

  getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      direction: 'Direction',
      bureau: 'Bureau Exécutif',
      administration: 'Administration / CA',
      technique: 'Staff Technique',
      communication: 'Communication',
    };
    return map[category] ?? category;
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      direction: 'var(--rcba-blue)',
      bureau: 'var(--rcba-blue)',
      administration: '#6366f1',
      technique: 'var(--rcba-green)',
      communication: '#f59e0b',
    };
    return map[category] ?? '#6b7280';
  }

  getInitials(member: StaffMember): string {
    return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  }
}
