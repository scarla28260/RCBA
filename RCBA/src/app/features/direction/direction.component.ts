import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../core/services/club.service';

import { Licencie, LicenceStatus, TeamCategory, Convocation } from '../../core/models/club.model';

interface DirectionTask {
  id: string;
  title: string;
  assignedTo: string;
  deadline: string;
  priority: 'haute' | 'normale' | 'basse';
  status: 'en_cours' | 'a_faire' | 'termine';
  pole: 'bureau' | 'sportif' | 'animation' | 'finances';
}

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './direction.component.html',
  styleUrl: './direction.component.css',
})
export class DirectionComponent {
  readonly clubService = inject(ClubService);
  readonly authService = inject(AuthService);

  readonly clubName = this.clubService.clubName;
  readonly shortName = this.clubService.shortName;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isDirection = this.authService.isDirection;
  readonly currentUser = this.authService.currentUser;
  readonly fffNumber = this.clubService.affiliationFff;
  readonly allStaff = this.clubService.staff;
  readonly metrics = this.clubService.metrics;
  readonly partners = this.clubService.partners;
  readonly installations = this.clubService.installations;

  // Active Tab: Tableau de bord, Convocations, Licences, Buvette, Minibus, Finances, Tâches, Documents, Studio, et Gestion des Accès
  readonly activeTab = signal<'dashboard' | 'licences' | 'buvette' | 'minibus' | 'finances' | 'convocations' | 'taches' | 'documents' | 'studio' | 'acces'>('dashboard');

  // Gestion des Comptes & Attributions Nominatives
  readonly newAccountForm = {
    identifier: '',
    password: '',
    name: '',
    role: 'coach' as 'coach' | 'direction',
    email: '',
    phone: '',
    assignedTeamName: '',
    accessGrantedBy: 'Bureau Directeur',
  };
  readonly accountActionFeedback = signal<string | null>(null);

  createAccount(): void {
    if (!this.newAccountForm.identifier || !this.newAccountForm.password || !this.newAccountForm.name) {
      this.accountActionFeedback.set('Veuillez renseigner au minimum l\'identifiant, le mot de passe et le nom.');
      setTimeout(() => this.accountActionFeedback.set(null), 3500);
      return;
    }

    this.authService.grantAccount({
      identifier: this.newAccountForm.identifier.trim().toLowerCase(),
      password: this.newAccountForm.password,
      user: {
        id: `user-${Date.now()}`,
        name: this.newAccountForm.name.trim(),
        role: this.newAccountForm.role,
        email: this.newAccountForm.email.trim() || `${this.newAccountForm.identifier.trim().toLowerCase()}@rcba.fr`,
        phone: this.newAccountForm.phone.trim() || undefined,
        assignedTeamName: this.newAccountForm.assignedTeamName.trim() || undefined,
        accessGrantedBy: this.newAccountForm.accessGrantedBy || 'Bureau Directeur',
        active: true,
      },
    });

    this.accountActionFeedback.set(`Accès accordé avec succès pour ${this.newAccountForm.name} (${this.newAccountForm.identifier}) !`);
    setTimeout(() => this.accountActionFeedback.set(null), 4000);

    this.newAccountForm.identifier = '';
    this.newAccountForm.password = '';
    this.newAccountForm.name = '';
    this.newAccountForm.email = '';
    this.newAccountForm.phone = '';
    this.newAccountForm.assignedTeamName = '';
  }

  toggleAccount(identifier: string): void {
    this.authService.toggleAccountStatus(identifier);
    this.accountActionFeedback.set(`Statut du compte ${identifier} mis à jour.`);
    setTimeout(() => this.accountActionFeedback.set(null), 3000);
  }

  // Studio Visuel Match & Réseaux Sociaux (Portage de direction/studio du projet original)
  readonly studioTheme = signal<'match' | 'resultat' | 'annonce'>('match');
  readonly studioMatchOpponent = signal<string>('DREUX A PORTU');
  readonly studioMatchDate = signal<string>('DIMANCHE 20 SEPTEMBRE');
  readonly studioMatchTime = signal<string>('15H00');
  readonly studioMatchScoreHome = signal<string>('4');
  readonly studioMatchScoreAway = signal<string>('0');
  readonly studioMatchComp = signal<string>('CHAMPIONNAT D3 DISTRICT');
  readonly studioMatchLieu = signal<string>('STADE DE BÛ');

  printStudio(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }



  // Filtre convocations
  readonly selectedTeamFilter = signal<string>('all');

  // Stats clés Bureau
  readonly bureauMembers = computed(() => this.allStaff().filter((m) => m.category === 'bureau'));
  readonly caMembers = computed(() => this.allStaff().filter((m) => m.category === 'administration'));
  readonly coachesCount = computed(() => this.allStaff().filter((m) => m.category === 'technique').length);

  // Convocations des équipes (partagées avec le portail Coach et les fiches équipes)
  readonly convocations = this.clubService.convocations;

  // Suivi des Tâches & Projets du Conseil d'Administration
  readonly tasks = signal<DirectionTask[]>([
    {
      id: 't-1',
      title: 'Renouvellement dossier Label Jeunes FFF Espoir & Féminin',
      assignedTo: 'Philippe BARBIER / Vincent GODET',
      deadline: '15 Octobre 2026',
      priority: 'haute',
      status: 'en_cours',
      pole: 'sportif',
    },
    {
      id: 't-2',
      title: 'Transmission des commandes packs équipements adidas (Les 3S Sports)',
      assignedTo: 'Vanessa DESSIRIER / Matthieu VITY',
      deadline: '28 Septembre 2026',
      priority: 'haute',
      status: 'en_cours',
      pole: 'bureau',
    },
    {
      id: 't-3',
      title: 'Dépôt demande de subvention municipale Bû & Abondant 2027',
      assignedTo: 'Marc WAROQUIER / Ghislaine VITY',
      deadline: '15 Novembre 2026',
      priority: 'normale',
      status: 'a_faire',
      pole: 'finances',
    },
    {
      id: 't-4',
      title: 'Organisation du Tournoi Fillon Technologie Cup 2027',
      assignedTo: 'Quentin LE CORRE / Nicolas HIBLOT',
      deadline: '15 Décembre 2026',
      priority: 'normale',
      status: 'en_cours',
      pole: 'animation',
    },
    {
      id: 't-5',
      title: 'Contrôle homologation éclairage & vestiaires Stade de Bû',
      assignedTo: 'Guillaume VAUTELIN',
      deadline: '30 Septembre 2026',
      priority: 'normale',
      status: 'termine',
      pole: 'bureau',
    },
  ]);

  // Liste des licences récapitulative
  readonly licencesSummary = [
    { categorie: 'Baby Foot & U7 (Éveil)', effectif: 42, cotisTotal: '5 040 €', dossierComplets: '95%', packDistribue: '40/42' },
    { categorie: 'U8 - U9 (Foot à 5)', effectif: 38, cotisTotal: '4 940 €', dossierComplets: '92%', packDistribue: '35/38' },
    { categorie: 'U10 - U11 (Foot à 8)', effectif: 35, cotisTotal: '4 900 €', dossierComplets: '97%', packDistribue: '35/35' },
    { categorie: 'U12 - U13 (Foot à 8)', effectif: 32, cotisTotal: '4 480 €', dossierComplets: '100%', packDistribue: '32/32' },
    { categorie: 'U14 - U15 (Foot à 11)', effectif: 28, cotisTotal: '4 200 €', dossierComplets: '93%', packDistribue: '26/28' },
    { categorie: 'U15F (École Féminine)', effectif: 18, cotisTotal: '2 520 €', dossierComplets: '100%', packDistribue: '18/18' },
    { categorie: 'Seniors D3', effectif: 30, cotisTotal: '5 400 €', dossierComplets: '90%', packDistribue: '28/30' },
    { categorie: 'Vétérans 1 & 2', effectif: 36, cotisTotal: '4 680 €', dossierComplets: '94%', packDistribue: '34/36' },
    { categorie: 'Dirigeants & Bénévoles', effectif: 30, cotisTotal: 'Gratuit', dossierComplets: '100%', packDistribue: '30/30' },
  ];

  // Nouveaux formulaires rapides
  newNotice = { title: '', target: 'all', content: '' };
  noticeSuccess = signal<boolean>(false);

  postNotice(): void {
    if (!this.newNotice.title || !this.newNotice.content) return;
    this.noticeSuccess.set(true);
    setTimeout(() => {
      this.noticeSuccess.set(false);
      this.newNotice = { title: '', target: 'all', content: '' };
    }, 3000);
  }

  getFilteredConvocations() {
    const filter = this.selectedTeamFilter();
    if (filter === 'all') return this.convocations();
    return this.convocations().filter((c) => c.teamId === filter);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'haute': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'normale': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'termine': return 'bg-emerald-500 text-white';
      case 'en_cours': return 'bg-blue-600 text-white';
      default: return 'bg-slate-200 text-slate-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'termine': return 'Terminé';
      case 'en_cours': return 'En cours';
      default: return 'À faire';
    }
  }

  // ========================================================
  // GESTION COMPLÈTE DU REGISTRE DES LICENCIÉS & DES ÉQUIPES
  // ========================================================
  readonly allLicencies = this.clubService.licencies;
  readonly allTeams = this.clubService.teams;

  // Filtres de recherche des licenciés
  readonly licenceSearch = signal<string>('');
  readonly licenceCategoryFilter = signal<string>('all');
  readonly licenceTeamFilter = signal<string>('all');
  readonly licenceStatusFilter = signal<string>('all');

  // Licencié sélectionné pour voir sa fiche détaillée ou modal d'assignation
  readonly selectedLicencie = signal<Licencie | null>(null);
  readonly showAssignModal = signal<boolean>(false);
  readonly selectedTeamForAssignment = signal<string>('');
  readonly assignmentSuccessMsg = signal<string | null>(null);

  // Modal d'ajout d'un nouveau licencié
  readonly showAddLicencieModal = signal<boolean>(false);
  newLicencieForm = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M' as 'M' | 'F',
    categorieAge: 'U11',
    teamId: '',
    statutLicence: 'validee' as LicenceStatus,
    cotisationReglee: true,
    certificatMedicalValide: true,
    packAdidasRemis: true,
    telephone: '',
    email: '',
    adresse: '',
    commune: 'Bû' as 'Bû' | 'Abondant' | 'Autre',
    positionPreferee: '',
  };

  // Liste filtrée des licenciés avec recherche textuelle
  readonly filteredLicencies = computed(() => {
    const query = this.licenceSearch().toLowerCase().trim();
    const cat = this.licenceCategoryFilter();
    const team = this.licenceTeamFilter();
    const status = this.licenceStatusFilter();

    return this.allLicencies().filter((l) => {
      // Recherche nom, prénom, numéro de licence
      const matchQuery =
        !query ||
        l.nom.toLowerCase().includes(query) ||
        l.prenom.toLowerCase().includes(query) ||
        l.numeroLicence.includes(query) ||
        (l.email && l.email.toLowerCase().includes(query));

      // Filtre catégorie
      const matchCat = cat === 'all' || l.categorieAge === cat;

      // Filtre équipe
      const matchTeam =
        team === 'all' ||
        (team === 'unassigned' && !l.teamId) ||
        l.teamId === team;

      // Filtre statut licence
      const matchStatus = status === 'all' || l.statutLicence === status;

      return matchQuery && matchCat && matchTeam && matchStatus;
    });
  });

  // Statistiques calculées en temps réel sur les licenciés
  readonly totalLicenciesCount = computed(() => this.allLicencies().length);
  readonly assignedLicenciesCount = computed(() => this.allLicencies().filter((l) => !!l.teamId).length);
  readonly unassignedLicenciesCount = computed(() => this.allLicencies().filter((l) => !l.teamId).length);
  readonly validLicenciesCount = computed(() => this.allLicencies().filter((l) => l.statutLicence === 'validee').length);

  /**
   * Ouvre la fiche d'un licencié
   */
  openLicencieDetails(licencie: Licencie): void {
    this.selectedLicencie.set(licencie);
    this.selectedTeamForAssignment.set(licencie.teamId || '');
  }

  /**
   * Ferme la fiche d'un licencié
   */
  closeLicencieDetails(): void {
    this.selectedLicencie.set(null);
  }

  /**
   * Trouve le nom lisible d'une équipe à partir de son ID
   */
  getTeamName(teamId: string | undefined): string {
    if (!teamId) return 'Non assigné(e)';
    const team = this.allTeams().find((t) => t.id === teamId);
    return team ? team.name : teamId;
  }

  /**
   * Assigne le licencié en cours à une équipe choisie
   */
  assignSelectedLicencieToTeam(newTeamId: string): void {
    const current = this.selectedLicencie();
    if (!current) return;

    this.clubService.assignPlayerToTeam(current.id, newTeamId || undefined);

    // Mettre à jour la sélection locale
    const updated = this.allLicencies().find((l) => l.id === current.id);
    if (updated) {
      this.selectedLicencie.set(updated);
      this.selectedTeamForAssignment.set(updated.teamId || '');
    }

    const teamLabel = newTeamId ? this.getTeamName(newTeamId) : 'Aucune équipe (en réserve)';
    this.assignmentSuccessMsg.set(`${current.prenom} ${current.nom} a bien été assigné(e) à l'équipe : ${teamLabel}`);
    setTimeout(() => {
      this.assignmentSuccessMsg.set(null);
    }, 4000);
  }

  /**
   * Mise à jour du numéro de licence FFF
   */
  updateLicencieNumero(licencieId: string, newNumero: string): void {
    const trimmed = (newNumero || '').trim();
    this.clubService.updateLicencie(licencieId, {
      numeroLicence: trimmed,
      statutLicence: trimmed.length > 0 ? 'validee' : 'a_renouveler',
    });

    const updated = this.allLicencies().find((l) => l.id === licencieId);
    if (updated && this.selectedLicencie()?.id === licencieId) {
      this.selectedLicencie.set(updated);
    }
  }

  /**
   * Importation d'une photo pour la fiche du licencié (fichier local converti en base64 DataURL)
   */
  onPlayerPhotoSelected(event: Event, licencieId: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const photoUrl = reader.result as string;
      this.clubService.updateLicencie(licencieId, { photo: photoUrl });
      const updated = this.allLicencies().find((l) => l.id === licencieId);
      if (updated && this.selectedLicencie()?.id === licencieId) {
        this.selectedLicencie.set(updated);
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * Suppression de la photo du joueur
   */
  removePlayerPhoto(licencieId: string): void {
    this.clubService.updateLicencie(licencieId, { photo: undefined });
    const updated = this.allLicencies().find((l) => l.id === licencieId);
    if (updated && this.selectedLicencie()?.id === licencieId) {
      this.selectedLicencie.set(updated);
    }
  }

  /**
   * Changement rapide de statut (ex: validation médicale, règlement cotisation, remise du pack adidas)
   */
  toggleCotisation(licencie: Licencie): void {
    this.clubService.updateLicencie(licencie.id, {
      cotisationReglee: !licencie.cotisationReglee,
      statutLicence: !licencie.cotisationReglee && licencie.certificatMedicalValide ? 'validee' : 'en_attente_paiement',
    });
    if (this.selectedLicencie()?.id === licencie.id) {
      this.selectedLicencie.set(this.allLicencies().find((l) => l.id === licencie.id) || null);
    }
  }

  toggleCertificat(licencie: Licencie): void {
    this.clubService.updateLicencie(licencie.id, {
      certificatMedicalValide: !licencie.certificatMedicalValide,
      statutLicence: !licencie.certificatMedicalValide && licencie.cotisationReglee ? 'validee' : 'certificat_medical_requis',
    });
    if (this.selectedLicencie()?.id === licencie.id) {
      this.selectedLicencie.set(this.allLicencies().find((l) => l.id === licencie.id) || null);
    }
  }

  togglePackAdidas(licencie: Licencie): void {
    this.clubService.updateLicencie(licencie.id, {
      packAdidasRemis: !licencie.packAdidasRemis,
    });
    if (this.selectedLicencie()?.id === licencie.id) {
      this.selectedLicencie.set(this.allLicencies().find((l) => l.id === licencie.id) || null);
    }
  }

  /**
   * Créer un nouveau licencié
   */
  saveNewLicencie(): void {
    if (!this.newLicencieForm.nom || !this.newLicencieForm.prenom) return;

    this.clubService.addLicencie({
      nom: this.newLicencieForm.nom.toUpperCase(),
      prenom: this.newLicencieForm.prenom,
      dateNaissance: this.newLicencieForm.dateNaissance || '01/01/2014',
      sexe: this.newLicencieForm.sexe,
      categorieAge: this.newLicencieForm.categorieAge,
      teamId: this.newLicencieForm.teamId || undefined,
      statutLicence: this.newLicencieForm.statutLicence,
      cotisationReglee: this.newLicencieForm.cotisationReglee,
      certificatMedicalValide: this.newLicencieForm.certificatMedicalValide,
      packAdidasRemis: this.newLicencieForm.packAdidasRemis,
      telephone: this.newLicencieForm.telephone || '06 00 00 00 00',
      email: this.newLicencieForm.email || 'contact@rcba.club',
      adresse: this.newLicencieForm.adresse || 'Bû / Abondant',
      commune: this.newLicencieForm.commune,
      positionPreferee: this.newLicencieForm.positionPreferee || 'Joueur',
    });

    this.showAddLicencieModal.set(false);
    this.assignmentSuccessMsg.set(`Nouveau licencié ${this.newLicencieForm.prenom} ${this.newLicencieForm.nom} enregistré avec succès !`);
    setTimeout(() => this.assignmentSuccessMsg.set(null), 4000);

    // Reset
    this.newLicencieForm = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: 'M',
      categorieAge: 'U11',
      teamId: '',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '',
      email: '',
      adresse: '',
      commune: 'Bû',
      positionPreferee: '',
    };
  }

  /**
   * Supprimer définitivement un joueur / licencié
   */
  deleteLicencie(licencie: Licencie): void {
    const confirmation = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement le joueur ${licencie.prenom} ${licencie.nom} (Licence n° ${licencie.numeroLicence}) du registre du club et de ses équipes ?`
    );
    if (!confirmation) return;

    this.clubService.deleteLicencie(licencie.id);

    // Si la fiche était ouverte, on la ferme
    if (this.selectedLicencie()?.id === licencie.id) {
      this.closeLicencieDetails();
    }

    this.assignmentSuccessMsg.set(`Le joueur ${licencie.prenom} ${licencie.nom} a été supprimé avec succès.`);
    setTimeout(() => this.assignmentSuccessMsg.set(null), 4000);
  }

  getLicenceBadgeClass(status: LicenceStatus): string {
    switch (status) {
      case 'validee': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'en_attente_paiement': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'certificat_medical_requis': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'a_renouveler': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getLicenceBadgeLabel(status: LicenceStatus): string {
    switch (status) {
      case 'validee': return '✓ Licence Validée';
      case 'en_attente_paiement': return '⏳ En attente paiement';
      case 'certificat_medical_requis': return '⚠️ Certificat requis';
      case 'a_renouveler': return '🔄 À renouveler';
      default: return status;
    }
  }

  // =========================================================================
  // GESTION DE LA BUVETTE OFFICIELLE DU CLUB (STADE DE BÛ & ABONDANT)
  // =========================================================================
  readonly buvetteCash = signal<number>(485.50); // Fond de caisse et recettes
  readonly buvetteStock = signal<{ id: string; name: string; category: string; stock: number; minStock: number; unitPrice: number; priceSell: number }[]>([
    { id: 'b-1', name: 'Café / Thé chaud', category: 'Boissons chaudes', stock: 120, minStock: 30, unitPrice: 0.25, priceSell: 1.00 },
    { id: 'b-2', name: 'Chocolat chaud', category: 'Boissons chaudes', stock: 65, minStock: 20, unitPrice: 0.35, priceSell: 1.50 },
    { id: 'b-3', name: 'Eau Minérale 50cl', category: 'Boissons fraîches', stock: 96, minStock: 24, unitPrice: 0.30, priceSell: 1.00 },
    { id: 'b-4', name: 'Canettes Soda (Coca, Ice Tea, Orangina)', category: 'Boissons fraîches', stock: 140, minStock: 36, unitPrice: 0.65, priceSell: 2.00 },
    { id: 'b-5', name: 'Bière Pression / Bouteille (Licence Débit)', category: 'Boissons fraîches', stock: 85, minStock: 24, unitPrice: 0.90, priceSell: 2.50 },
    { id: 'b-6', name: 'Frites fraîches (Portion)', category: 'Snacking', stock: 45, minStock: 15, unitPrice: 0.70, priceSell: 2.50 },
    { id: 'b-7', name: 'Saucisses / Merguez grillées', category: 'Snacking', stock: 60, minStock: 20, unitPrice: 0.95, priceSell: 3.50 },
    { id: 'b-8', name: 'Sandwich Jambon-Beurre / Fromage', category: 'Snacking', stock: 35, minStock: 10, unitPrice: 1.10, priceSell: 3.00 },
    { id: 'b-9', name: 'Barres chocolatées & Bonbons', category: 'Confiserie', stock: 110, minStock: 25, unitPrice: 0.40, priceSell: 1.20 },
    { id: 'b-10', name: 'Gâteaux maison des parents', category: 'Confiserie', stock: 25, minStock: 10, unitPrice: 0.00, priceSell: 1.00 },
  ]);

  // Permanences Buvette pour les week-ends de match
  readonly buvettePlanning = signal<{ id: string; date: string; site: string; match: string; responsables: string[]; status: 'confirme' | 'a_pourvoir' }[]>([
    {
      id: 'p-1',
      date: 'Samedi 19 Septembre 2026 (13h30 - 18h00)',
      site: 'Stade d\'Abondant',
      match: 'Plateau Festi-Foot U9 & Critérium U11',
      responsables: ['Vanessa DESSIRIER', 'Parent bénévole U9 (M. Leroy)'],
      status: 'confirme',
    },
    {
      id: 'p-2',
      date: 'Dimanche 20 Septembre 2026 (09h00 - 12h30)',
      site: 'Stade d\'Abondant',
      match: 'Championnat D1 Vétérans (RCBA 1 vs Dreux)',
      responsables: ['Didier VANDIER', 'Marc WAROQUIER'],
      status: 'confirme',
    },
    {
      id: 'p-3',
      date: 'Dimanche 20 Septembre 2026 (14h00 - 18h30)',
      site: 'Stade Municipal de Bû',
      match: 'Championnat D3 Seniors (RCBA vs FC Maintenon 2)',
      responsables: ['Quentin LE CORRE', 'Bénévole à désigner'],
      status: 'a_pourvoir',
    },
    {
      id: 'p-4',
      date: 'Mercredi 23 Septembre 2026 (14h00 - 17h30)',
      site: 'Stade Municipal de Bû',
      match: 'Goûter École de Foot U7-U9-U11',
      responsables: ['Ghislaine VITY', 'Commission Jeunes'],
      status: 'confirme',
    },
  ]);

  // Modal et formulaire d'ajout / édition de produit buvette
  readonly showAddBuvetteProductModal = signal<boolean>(false);
  readonly editingBuvetteProductId = signal<string | null>(null);

  buvetteProductForm = {
    name: '',
    category: 'Boissons fraîches',
    stock: 24,
    minStock: 12,
    unitPrice: 0.50, // Prix d'achat
    priceSell: 2.00, // Prix de vente
  };

  // Valeur totale du stock et marge potentielle
  readonly buvetteStockTotalValue = computed(() => {
    return this.buvetteStock().reduce((acc, p) => acc + (p.stock * p.unitPrice), 0);
  });

  readonly buvettePotentialRevenue = computed(() => {
    return this.buvetteStock().reduce((acc, p) => acc + (p.stock * p.priceSell), 0);
  });

  readonly buvettePotentialMargin = computed(() => {
    return this.buvettePotentialRevenue() - this.buvetteStockTotalValue();
  });

  openAddBuvetteProductModal(productToEdit?: any): void {
    if (productToEdit) {
      this.editingBuvetteProductId.set(productToEdit.id);
      this.buvetteProductForm = {
        name: productToEdit.name,
        category: productToEdit.category,
        stock: productToEdit.stock,
        minStock: productToEdit.minStock,
        unitPrice: productToEdit.unitPrice,
        priceSell: productToEdit.priceSell,
      };
    } else {
      this.editingBuvetteProductId.set(null);
      this.buvetteProductForm = {
        name: '',
        category: 'Boissons fraîches',
        stock: 24,
        minStock: 12,
        unitPrice: 0.50,
        priceSell: 2.00,
      };
    }
    this.showAddBuvetteProductModal.set(true);
  }

  saveBuvetteProduct(): void {
    if (!this.buvetteProductForm.name.trim()) return;

    const editId = this.editingBuvetteProductId();
    if (editId) {
      // Modification du produit
      this.buvetteStock.update((list) =>
        list.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: this.buvetteProductForm.name,
                category: this.buvetteProductForm.category,
                stock: Number(this.buvetteProductForm.stock) || 0,
                minStock: Number(this.buvetteProductForm.minStock) || 0,
                unitPrice: Number(this.buvetteProductForm.unitPrice) || 0,
                priceSell: Number(this.buvetteProductForm.priceSell) || 0,
              }
            : item
        )
      );
    } else {
      // Ajout nouveau produit
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: this.buvetteProductForm.name,
        category: this.buvetteProductForm.category,
        stock: Number(this.buvetteProductForm.stock) || 0,
        minStock: Number(this.buvetteProductForm.minStock) || 0,
        unitPrice: Number(this.buvetteProductForm.unitPrice) || 0,
        priceSell: Number(this.buvetteProductForm.priceSell) || 0,
      };
      this.buvetteStock.update((list) => [newProduct, ...list]);
    }

    this.showAddBuvetteProductModal.set(false);
  }

  deleteBuvetteProduct(productId: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit de la buvette ?')) {
      this.buvetteStock.update((list) => list.filter((p) => p.id !== productId));
    }
  }

  // Actions d'ajustement rapide de stock
  adjustStock(itemId: string, delta: number): void {
    this.buvetteStock.update((items) =>
      items.map((i) => (i.id === itemId ? { ...i, stock: Math.max(0, i.stock + delta) } : i))
    );
  }

  // Enregistrement d'une vente / encaissement buvette
  recordBuvetteSale(amount: number): void {
    this.buvetteCash.update((c) => +(c + amount).toFixed(2));
  }

  // =========================================================================
  // GESTION DU MINI-BUS 9 PLACES PARTAGÉ AVEC LE CLUB DE BADMINTON D'ANET
  // =========================================================================
  readonly minibusInfo = {
    immatriculation: 'FW-842-RC (Renault Trafic Grand Confort 9 Places)',
    propriete: 'Convention de Co-propriété & Gestion Partagée : RCBA Football (50%) & Club de Badminton d\'Anet (50%)',
    lieuStationnement: 'Parking sécurisé Gymnase / Complexe Sportif d\'Anet & Stades de Bû',
    kilometrage: '78 450 km',
    carburant: 'Diesel (Carte carburant Total inter-clubs)',
    prochaineRevision: '15 Novembre 2026 (Garage d\'Anet)',
    assurance: 'Contrat flotte multi-associations - Assistance 24/7',
    contactBadminton: 'Frédéric DUVAL (Président Badminton Club d\'Anet - 06 88 77 66 55)',
  };

  // Réservations et créneaux d'utilisation du Mini-Bus partagé
  readonly minibusReservations = signal<{
    id: string;
    club: 'RCBA' | 'Badminton Anet';
    dateDebut: string;
    dateFin: string;
    destination: string;
    motif: string;
    chauffeur: string;
    kilometresPrevu: number;
    statut: 'confirme' | 'en_attente' | 'termine';
  }[]>([
    {
      id: 'mb-1',
      club: 'RCBA',
      dateDebut: 'Samedi 19 Septembre 2026 (13h00)',
      dateFin: 'Samedi 19 Septembre 2026 (18h30)',
      destination: 'Nogent-le-Roi (Stade Municipal)',
      motif: 'Déplacement Championnat D3 - Équipe U15',
      chauffeur: 'Laurent MARIE LUCE (Permis B valide)',
      kilometresPrevu: 45,
      statut: 'confirme',
    },
    {
      id: 'mb-2',
      club: 'Badminton Anet',
      dateDebut: 'Dimanche 20 Septembre 2026 (07h30)',
      dateFin: 'Dimanche 20 Septembre 2026 (19h00)',
      destination: 'Chartres (Halle des Sports)',
      motif: 'Tournoi Régional Badminton Simples & Doubles',
      chauffeur: 'Benoît LEMAITRE (Badminton Club Anet)',
      kilometresPrevu: 110,
      statut: 'confirme',
    },
    {
      id: 'mb-3',
      club: 'RCBA',
      dateDebut: 'Mercredi 23 Septembre 2026 (13h30)',
      dateFin: 'Mercredi 23 Septembre 2026 (18h00)',
      destination: 'Navette inter-sites Bû & Abondant',
      motif: 'Transport des enfants de l\'école de foot Bû -> Abondant',
      chauffeur: 'Quentin LE CORRE',
      kilometresPrevu: 20,
      statut: 'confirme',
    },
    {
      id: 'mb-4',
      club: 'Badminton Anet',
      dateDebut: 'Samedi 26 Septembre 2026 (08h00)',
      dateFin: 'Samedi 26 Septembre 2026 (18h00)',
      destination: 'Évreux (Gymnase Jean Moulin)',
      motif: 'Interclubs Régionale 2 Badminton',
      chauffeur: 'Sophie GAUTHIER (Badminton Club Anet)',
      kilometresPrevu: 85,
      statut: 'confirme',
    },
    {
      id: 'mb-5',
      club: 'RCBA',
      dateDebut: 'Dimanche 27 Septembre 2026 (13h00)',
      dateFin: 'Dimanche 27 Septembre 2026 (18h30)',
      destination: 'Châteaudun',
      motif: 'Déplacement Coupe Eure-et-Loir Seniors D3',
      chauffeur: 'Didier VANDIER',
      kilometresPrevu: 140,
      statut: 'confirme',
    },
  ]);

  // Formulaire pour réserver le minibus
  readonly showMinibusModal = signal<boolean>(false);
  newMinibusForm = {
    club: 'RCBA' as 'RCBA' | 'Badminton Anet',
    dateDebut: '',
    dateFin: '',
    destination: '',
    motif: '',
    chauffeur: '',
    kilometresPrevu: 50,
  };

  saveMinibusReservation(): void {
    if (!this.newMinibusForm.destination || !this.newMinibusForm.chauffeur || !this.newMinibusForm.dateDebut) return;

    this.minibusReservations.update((list) => [
      {
        id: `mb-${Date.now()}`,
        club: this.newMinibusForm.club,
        dateDebut: this.newMinibusForm.dateDebut,
        dateFin: this.newMinibusForm.dateFin || this.newMinibusForm.dateDebut,
        destination: this.newMinibusForm.destination,
        motif: this.newMinibusForm.motif || 'Déplacement club',
        chauffeur: this.newMinibusForm.chauffeur,
        kilometresPrevu: this.newMinibusForm.kilometresPrevu || 40,
        statut: 'confirme',
      },
      ...list,
    ]);

    this.showMinibusModal.set(false);
    this.assignmentSuccessMsg.set(`Créneau mini-bus réservé avec succès pour ${this.newMinibusForm.destination} !`);
    setTimeout(() => this.assignmentSuccessMsg.set(null), 4000);

    // Reset
    this.newMinibusForm = {
      club: 'RCBA',
      dateDebut: '',
      dateFin: '',
      destination: '',
      motif: '',
      chauffeur: '',
      kilometresPrevu: 50,
    };
  }
}
