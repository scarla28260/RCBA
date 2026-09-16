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
  readonly showOrganigramme = signal<boolean>(true);

  readonly categories: { key: Category; label: string; icon: string }[] = [
    { key: 'direction', label: 'Direction & Bureau', icon: '🏛️' },
    { key: 'all', label: 'Tout le Club', icon: '👥' },
    { key: 'bureau', label: 'Bureau Exécutif', icon: '🏆' },
    { key: 'administration', label: 'Administration & CA', icon: '📋' },
    { key: 'technique', label: 'Staff Technique & Éducateurs', icon: '⚽' },
    { key: 'communication', label: 'Communication', icon: '📣' },
  ];

  readonly filteredStaff = computed<StaffMember[]>(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.allStaff();
    if (cat === 'direction') {
      return this.allStaff().filter((m) => m.category === 'bureau' || m.category === 'administration');
    }
    return this.allStaff().filter((m) => m.category === cat);
  });

  readonly totalCount = computed(() => this.allStaff().length);
  readonly bureauCount = computed(() => this.allStaff().filter((m) => m.category === 'bureau').length);
  readonly directionCount = computed(() => this.allStaff().filter((m) => m.category === 'bureau' || m.category === 'administration').length);
  readonly techniqueCount = computed(() => this.allStaff().filter((m) => m.category === 'technique').length);

  setCategory(cat: Category): void {
    this.activeCategory.set(cat);
  }

  getCategoryCount(cat: Category): number {
    if (cat === 'all') return this.allStaff().length;
    if (cat === 'direction') {
      return this.allStaff().filter((m) => m.category === 'bureau' || m.category === 'administration').length;
    }
    return this.allStaff().filter((m) => m.category === cat).length;
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
