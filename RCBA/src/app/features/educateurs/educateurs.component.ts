import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../core/services/club.service';
import { TacticalElement, TacticalSessionBlock, Convocation, PlayerEvolutionStat, TeamCategory } from '../../core/models/club.model';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-educateurs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './educateurs.component.html',
  styleUrl: './educateurs.component.css',
})
export class EducateursComponent {
  private readonly clubService = inject(ClubService);
  readonly authService = inject(AuthService);

  readonly clubName = this.clubService.shortName;
  readonly sampleSessions = this.clubService.sampleSessions;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;
  readonly teams = this.clubService.teams;
  readonly convocations = this.clubService.convocations;
  readonly playerStats = this.clubService.playerStats;

  readonly activeTab = signal<'convocations' | 'stats' | 'tactique' | 'video' | 'bibliotheque' | 'documents' | 'planning'>('convocations');

  ngOnInit(): void {
    const user = this.currentUser();
    if (user && user.assignedTeamId && user.assignedTeamId !== 'all') {
      const exists = this.teams().some((t) => t.id === user.assignedTeamId);
      if (exists) {
        this.selectedTeamId.set(user.assignedTeamId);
      }
    }
  }

  // Analyse Vidéo (source coach/video-analysis de l'ancien projet)
  readonly videoAnalysisList = signal([
    {
      id: 'vid-1',
      title: 'Victoire U13 — Demi-finale Départementale',
      event: 'Match officiel U13 vs Cherisy (6-1)',
      date: 'Mai 2026',
      videoUrl: 'videos/victoire-u13.mp4',
      category: 'U13',
      pointsForts: ['Transitions offensives rapides', 'Placement bloc médian', 'Efficacité sur phases arrêtées'],
      pointsAmelioration: ['Relances courtes sous pressing', 'Repli défensif des ailiers'],
    }
  ]);
  readonly selectedVideo = signal<any>(this.videoAnalysisList()[0]);


  // Format du terrain: Demi-terrain, Terrain complet, Zone réduite
  readonly pitchType = signal<'half' | 'full' | 'box'>('half');

  // Mode présentation plein écran (pour projection / démonstration vestiaire)
  readonly isPresentationMode = signal<boolean>(false);

  // Outil actif de sélection
  readonly activeTool = signal<'player' | 'opponent' | 'goalkeeper' | 'ball' | 'cone' | 'goal'>('player');

  // Numéro automatique du prochain joueur
  private playerCounter = 2;
  private opponentCounter = 2;

  // Éléments tactiques placés sur le terrain
  readonly elements = signal<TacticalElement[]>([
    { id: 'gb-1', type: 'goalkeeper', label: 'GB', x: 50, y: 12 },
    { id: 'pl-1', type: 'player', number: 4, label: '4', x: 35, y: 32 },
    { id: 'pl-2', type: 'player', number: 5, label: '5', x: 65, y: 32 },
    { id: 'pl-3', type: 'player', number: 6, label: '6', x: 50, y: 48 },
    { id: 'op-1', type: 'opponent', number: 9, label: '9', x: 50, y: 65 },
    { id: 'op-2', type: 'opponent', number: 10, label: '10', x: 30, y: 70 },
    { id: 'b-1', type: 'ball', x: 50, y: 52 },
    { id: 'c-1', type: 'cone', x: 20, y: 40 },
    { id: 'c-2', type: 'cone', x: 80, y: 40 },
  ]);

  // Blocs constitutifs de la séance (CDC 7.2)
  readonly sessionBlocks = signal<TacticalSessionBlock[]>([
    {
      type: 'accueil',
      title: 'Accueil & Consignes',
      durationMinutes: 10,
      objective: 'Présentation des principes de transition et du plan de jeu',
      elements: [],
    },
    {
      type: 'echauffement',
      title: 'Échauffement avec ballon',
      durationMinutes: 15,
      objective: 'Gammes techniques, motricité, passes courtes',
      elements: [],
    },
    {
      type: 'technique',
      title: 'Atelier Passes & Contrôles orientés',
      durationMinutes: 20,
      objective: 'Fixer la défense, trouver les intervalles',
      elements: [],
    },
    {
      type: 'tactique',
      title: 'Situation 3 contre 2 axe & ailes',
      durationMinutes: 25,
      objective: 'Accélération dans les 30 derniers mètres et finition',
      elements: [],
    },
    {
      type: 'jeu',
      title: 'Opposition dirigée',
      durationMinutes: 15,
      objective: 'Mise en pratique avec temps de possession limité',
      elements: [],
    },
    {
      type: 'bilan',
      title: 'Retour au calme & Bilan',
      durationMinutes: 5,
      objective: 'Hydratation, étirements et débriefing du groupe',
      elements: [],
    },
  ]);

  readonly activeBlockIndex = signal<number>(3); // Par défaut sur l'étape tactique

  readonly totalSessionDuration = computed(() =>
    this.sessionBlocks().reduce((acc, block) => acc + block.durationMinutes, 0)
  );

  // Interaction terrain : clic ou toucher tactile pour placer un élément
  onPitchClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);

    this.addElementAt(x, y);
  }

  addElementAt(x: number, y: number): void {
    const tool = this.activeTool();
    const id = `elem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    let newElement: TacticalElement;
    if (tool === 'player') {
      newElement = { id, type: 'player', number: this.playerCounter, label: `${this.playerCounter}`, x, y };
      this.playerCounter++;
    } else if (tool === 'opponent') {
      newElement = { id, type: 'opponent', number: this.opponentCounter, label: `${this.opponentCounter}`, x, y };
      this.opponentCounter++;
    } else if (tool === 'goalkeeper') {
      newElement = { id, type: 'goalkeeper', label: 'GB', x, y };
    } else if (tool === 'ball') {
      newElement = { id, type: 'ball', x, y };
    } else if (tool === 'goal') {
      newElement = { id, type: 'goal', label: 'BUT', x, y };
    } else {
      newElement = { id, type: 'cone', x, y };
    }

    this.elements.update((items) => [...items, newElement]);
  }

  removeElement(id: string, event: Event): void {
    event.stopPropagation();
    this.elements.update((items) => items.filter((el) => el.id !== id));
  }

  clearPitch(): void {
    this.elements.set([]);
    this.playerCounter = 1;
    this.opponentCounter = 1;
  }

  resetDefaultFormation(): void {
    this.elements.set([
      { id: 'gb-1', type: 'goalkeeper', label: 'GB', x: 50, y: 12 },
      { id: 'pl-1', type: 'player', number: 4, label: '4', x: 35, y: 32 },
      { id: 'pl-2', type: 'player', number: 5, label: '5', x: 65, y: 32 },
      { id: 'pl-3', type: 'player', number: 6, label: '6', x: 50, y: 48 },
      { id: 'op-1', type: 'opponent', number: 9, label: '9', x: 50, y: 65 },
      { id: 'op-2', type: 'opponent', number: 10, label: '10', x: 30, y: 70 },
      { id: 'b-1', type: 'ball', x: 50, y: 52 },
      { id: 'c-1', type: 'cone', x: 20, y: 40 },
      { id: 'c-2', type: 'cone', x: 80, y: 40 },
    ]);
  }

  togglePresentation(): void {
    this.isPresentationMode.update((v) => !v);
  }

  // ==========================================
  // GESTION DES CONVOCATIONS DE MATCH (COACH)
  // ==========================================
  readonly selectedTeamId = signal<string>('u13-d1');
  readonly showConvocationModal = signal<boolean>(false);
  readonly convocationSavedMessage = signal<string | null>(null);

  readonly currentTeam = computed(() => {
    return this.teams().find((t) => t.id === this.selectedTeamId()) ?? this.teams()[0];
  });

  // Joueurs disponibles dans l'équipe sélectionnée avec la règle : prénom seul (ou initiale si homonymes)
  readonly teamRoster = computed(() => {
    const team = this.currentTeam();
    if (!team) return [];

    const assignedLicencies = this.clubService
      .licencies()
      .filter((l) => l.teamId === team.id)
      .map((l) => ({
        id: l.id,
        firstName: l.prenom,
        lastName: l.nom,
        position: l.positionPreferee || 'Joueur',
        photo: l.photo,
      }));

    const raw = assignedLicencies.length > 0 ? assignedLicencies : (team.players || []);

    const nameCounts = new Map<string, number>();
    raw.forEach((p) => {
      const fn = (p.firstName || '').trim().toLowerCase();
      nameCounts.set(fn, (nameCounts.get(fn) || 0) + 1);
    });

    return raw.map((p) => {
      const fn = (p.firstName || '').trim();
      const count = nameCounts.get(fn.toLowerCase()) || 0;
      let displayName = fn;
      if (count > 1 && p.lastName) {
        displayName = `${fn} ${p.lastName.trim().charAt(0).toUpperCase()}.`;
      }

      const stat = this.clubService.getStatsForPlayer(p.id, `${p.firstName} ${p.lastName}`);

      return {
        ...p,
        displayName,
        stat,
      };
    });
  });

  // Convocation courante pour l'équipe sélectionnée
  readonly currentTeamConvocation = computed(() => {
    return this.convocations().find((c) => c.teamId === this.selectedTeamId()) || null;
  });

  // Modèle de formulaire d'édition de convocation
  convocationForm: Partial<Convocation> = {
    opponent: '',
    matchDate: 'Samedi 19 Septembre 2026',
    matchTime: '14h30',
    location: 'Stade Municipal de Bû',
    meetingTime: '13h45',
    meetingPlace: 'Vestiaires Stade de Bû',
    notes: 'Maillots officiels adidas bleus. Protège-tibias et gourde individuelle obligatoires.',
    selectedPlayers: [],
  };

  openConvocationModal(): void {
    const existing = this.currentTeamConvocation();
    const team = this.currentTeam();

    if (existing) {
      this.convocationForm = {
        ...existing,
        selectedPlayers: [...existing.selectedPlayers],
      };
    } else {
      this.convocationForm = {
        id: `conv-${Date.now()}`,
        teamId: team.id,
        teamName: team.name,
        matchDate: 'Samedi 19 Septembre 2026',
        matchTime: '14h30',
        opponent: 'Adversaire du District 28',
        location: team.site || 'Stade Municipal de Bû',
        meetingTime: '13h30',
        meetingPlace: team.site || 'Vestiaires du stade',
        coachName: team.coach,
        coachPhone: '06 12 34 56 78',
        selectedPlayers: this.teamRoster().slice(0, team.format === 'Foot à 11' ? 14 : (team.format === 'Foot à 5' ? 5 : 8)).map((p) => p.displayName),
        absentPlayers: [],
        notes: 'Tenue complète du club, bouteille d\'eau individuelle.',
        published: true,
      };
    }
    this.showConvocationModal.set(true);
  }

  togglePlayerInConvocation(displayName: string): void {
    const list = this.convocationForm.selectedPlayers || [];
    if (list.includes(displayName)) {
      this.convocationForm.selectedPlayers = list.filter((n) => n !== displayName);
    } else {
      this.convocationForm.selectedPlayers = [...list, displayName];
    }
  }

  isPlayerInForm(displayName: string): boolean {
    return (this.convocationForm.selectedPlayers || []).includes(displayName);
  }

  saveConvocation(): void {
    const team = this.currentTeam();
    const conv: Convocation = {
      id: this.convocationForm.id || `conv-${Date.now()}`,
      teamId: team.id,
      teamName: team.name,
      matchDate: this.convocationForm.matchDate || 'Samedi 19 Septembre 2026',
      matchTime: this.convocationForm.matchTime || '14h30',
      opponent: this.convocationForm.opponent || 'Adversaire District 28',
      location: this.convocationForm.location || 'Stade de Bû',
      meetingTime: this.convocationForm.meetingTime || '13h30',
      meetingPlace: this.convocationForm.meetingPlace || 'Vestiaires',
      coachName: this.convocationForm.coachName || team.coach,
      coachPhone: this.convocationForm.coachPhone || '06 00 00 00 00',
      selectedPlayers: this.convocationForm.selectedPlayers || [],
      absentPlayers: this.convocationForm.absentPlayers || [],
      notes: this.convocationForm.notes || '',
      published: true,
    };

    this.clubService.saveConvocation(conv);
    this.showConvocationModal.set(false);
    this.convocationSavedMessage.set(`Convocation de l'équipe ${team.name} publiée avec succès !`);
    setTimeout(() => this.convocationSavedMessage.set(null), 4000);
  }

  // ==========================================
  // STATISTIQUES & ÉVOLUTION JOUEURS (COACH)
  // ==========================================
  readonly selectedPlayerForStat = signal<any | null>(null);
  readonly showStatModal = signal<boolean>(false);
  statEditForm: Partial<PlayerEvolutionStat> = {};

  openStatModal(player: any): void {
    this.selectedPlayerForStat.set(player);
    const existing = player.stat;
    if (existing) {
      this.statEditForm = { ...existing };
    } else {
      this.statEditForm = {
        licencieId: player.id,
        playerName: `${player.firstName} ${player.lastName}`,
        teamId: this.selectedTeamId(),
        matchesPlayed: 3,
        minutesPlayed: 180,
        goals: 1,
        assists: 1,
        yellowCards: 0,
        trainingAttendancePct: 90,
        ratingProgression: 8.0,
        technicalScore: 8,
        tacticalScore: 8,
        physicalScore: 8,
        mindsetScore: 8,
        coachFeedback: 'Bonne attitude générale et travail régulier aux entraînements.',
      };
    }
    this.showStatModal.set(true);
  }

  savePlayerStat(): void {
    if (!this.selectedPlayerForStat()) return;
    const p = this.selectedPlayerForStat();

    const statToSave: PlayerEvolutionStat = {
      id: this.statEditForm.id || `stat-${Date.now()}`,
      licencieId: p.id,
      playerName: `${p.firstName} ${p.lastName}`,
      teamId: this.selectedTeamId(),
      matchesPlayed: Number(this.statEditForm.matchesPlayed) || 0,
      minutesPlayed: Number(this.statEditForm.minutesPlayed) || 0,
      goals: Number(this.statEditForm.goals) || 0,
      assists: Number(this.statEditForm.assists) || 0,
      yellowCards: Number(this.statEditForm.yellowCards) || 0,
      trainingAttendancePct: Number(this.statEditForm.trainingAttendancePct) || 0,
      ratingProgression: Number(this.statEditForm.ratingProgression) || 8.0,
      technicalScore: Number(this.statEditForm.technicalScore) || 8,
      tacticalScore: Number(this.statEditForm.tacticalScore) || 8,
      physicalScore: Number(this.statEditForm.physicalScore) || 8,
      mindsetScore: Number(this.statEditForm.mindsetScore) || 8,
      coachFeedback: this.statEditForm.coachFeedback || '',
      lastUpdated: new Date().toLocaleDateString('fr-FR'),
    };

    this.clubService.savePlayerStats(statToSave);
    this.showStatModal.set(false);
    this.convocationSavedMessage.set(`Statistiques de ${p.displayName} enregistrées avec succès !`);
    setTimeout(() => this.convocationSavedMessage.set(null), 4000);
  }
}
