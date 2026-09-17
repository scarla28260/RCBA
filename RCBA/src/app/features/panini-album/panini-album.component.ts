import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaniniCardComponent } from '../../shared/components/panini-card/panini-card.component';
import { ClubService } from '../../core/services/club.service';

export interface PaniniPlayer {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  role: string;
  photoUrl?: string;
  number?: number;
  isRare: boolean;
  isGold?: boolean;
}

@Component({
  selector: 'app-panini-album',
  standalone: true,
  imports: [CommonModule, PaniniCardComponent],
  templateUrl: './panini-album.component.html',
  styleUrl: './panini-album.component.css',
})
export class PaniniAlbumComponent {
  private readonly clubService = inject(ClubService);

  readonly activeFilter = signal<'all' | 'gold' | 'rare' | 'jeunes' | 'seniors'>('all');

  // Collection officielle de vignettes Panini (Dirigeants Or + Joueurs Rares & Étoiles du Club)
  readonly players = signal<PaniniPlayer[]>([
    // --- DIRECTION & BUREAU (VIGNETTES DORÉES 👑) ---
    {
      id: 'pan-dir-1',
      firstName: 'Marc',
      lastName: 'WAROQUIER',
      category: 'Direction',
      role: 'Président',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/marc-waroquier__sl3ql0.jpg',
      number: 1,
      isRare: true,
      isGold: true,
    },
    {
      id: 'pan-dir-2',
      firstName: 'Matthieu',
      lastName: 'VITY',
      category: 'Direction',
      role: 'Vice-Président',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/matthieu-vity__qvgoyb.jpg',
      number: 2,
      isRare: true,
      isGold: true,
    },
    {
      id: 'pan-dir-3',
      firstName: 'Vincent',
      lastName: 'GODET',
      category: 'Direction',
      role: 'Secrétaire Général',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/vincent-godet__sl3ql2.jpg',
      number: 3,
      isRare: true,
      isGold: true,
    },
    {
      id: 'pan-dir-4',
      firstName: 'Agnès',
      lastName: 'JUSTIN',
      category: 'Direction & Staff',
      role: 'Entraîneuse Vétérans',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/agnes-justin__rgpzhg.jpg',
      number: 4,
      isRare: true,
      isGold: true,
    },
    {
      id: 'pan-dir-5',
      firstName: 'Guillaume',
      lastName: 'VAUTELIN',
      category: 'Direction & Club',
      role: 'Dirigeant Club',
      photoUrl: 'https://s1.static-footeo.com/uploads/rcba/executives/guillaume-vautelin__rgpzlx.jpg',
      number: 5,
      isRare: true,
      isGold: true,
    },

    // --- JOUEURS, COACHS ET TALENTS DU CLUB (RARES & RÉGULIERS) ---
    {
      id: 'pan-j-1',
      firstName: 'Didier',
      lastName: 'VANDIER',
      category: 'Seniors D3',
      role: 'Entraîneur Seniors',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/didier-vandier__sl56hi.jpg',
      number: 9,
      isRare: true,
      isGold: false,
    },
    {
      id: 'pan-j-2',
      firstName: 'Quentin',
      lastName: 'LE CORRE',
      category: 'Staff & U11',
      role: 'Coach / Capitaine',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/quentin-le-corre__rivjzr.jpg',
      number: 10,
      isRare: true,
      isGold: false,
    },
    {
      id: 'pan-j-3',
      firstName: 'Sylvain',
      lastName: 'PENNETIER',
      category: 'Seniors D3',
      role: 'Adjoint Seniors',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/sylvain-pennetier__rgpzbj.png',
      number: 1,
      isRare: true,
      isGold: false,
    },
    {
      id: 'pan-j-4',
      firstName: 'Pierre',
      lastName: 'MOMPO',
      category: 'U13 / Staff',
      role: 'Éducateur U13',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/pierre-mompo__rgpzif.jpg',
      number: 4,
      isRare: false,
      isGold: false,
    },
    {
      id: 'pan-j-5',
      firstName: 'Kan Nam',
      lastName: 'CHIEV',
      category: 'Vétérans D1',
      role: 'Adjoint Vétérans',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/kan-nam-chiev__rgpzbu.jpg',
      number: 7,
      isRare: true,
      isGold: false,
    },
    {
      id: 'pan-j-6',
      firstName: 'Michel',
      lastName: 'CARRASQUEIRA',
      category: 'Vétérans D3',
      role: 'Adjoint Vétérans',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/michel-carrasqueira__rgpzi7.jpg',
      number: 9,
      isRare: false,
      isGold: false,
    },
    {
      id: 'pan-j-7',
      firstName: 'Laurent',
      lastName: 'DUBOST',
      category: 'U13 Animation',
      role: 'Adjoint U13',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-dubost__rggs3n.jpg',
      number: 5,
      isRare: false,
      isGold: false,
    },
    {
      id: 'pan-j-8',
      firstName: 'Laurent',
      lastName: 'MARIE LUCE',
      category: 'U15 D3',
      role: 'Éducateur U15',
      photoUrl: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-marie-luce__rggs9g.jpg',
      number: 8,
      isRare: false,
      isGold: false,
    },
    {
      id: 'pan-j-9',
      firstName: 'Philippe',
      lastName: 'BARBIER',
      category: 'Staff Jeunes',
      role: 'Coach U15',
      photoUrl: 'https://s3.static-footeo.com/uploads/rcba/executives/philippe-barbier__sl567r.jpg',
      number: 6,
      isRare: true,
      isGold: false,
    },
    {
      id: 'pan-j-10',
      firstName: 'Frédéric',
      lastName: 'NOBRE',
      category: 'U11 & U15',
      role: 'Éducateur U11',
      photoUrl: 'https://s1.static-footeo.com/750/uploads/rcba/executives/frederic__rivn5g.jpg',
      number: 7,
      isRare: false,
      isGold: false,
    },
  ]);

  readonly filteredPlayers = computed(() => {
    const filter = this.activeFilter();
    const all = this.players();
    if (filter === 'gold') return all.filter((p) => p.isGold);
    if (filter === 'rare') return all.filter((p) => p.isRare && !p.isGold);
    if (filter === 'jeunes') return all.filter((p) => p.category.includes('U'));
    if (filter === 'seniors') return all.filter((p) => p.category.includes('Senior') || p.category.includes('Staff'));
    return all;
  });

  setFilter(f: 'all' | 'gold' | 'rare' | 'jeunes' | 'seniors'): void {
    this.activeFilter.set(f);
  }
}
