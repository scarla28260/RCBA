export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
  isPrivate?: boolean;
}

export interface AlertBanner {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  active: boolean;
  linkText?: string;
  linkUrl?: string;
}

export interface Partner {
  name: string;
  category?: string;
  url?: string;
  logo?: string; // path relative to /public
}

export interface MatchResult {
  category: string;
  teamHome: string;
  teamAway: string;
  scoreHome: number;
  scoreAway: number;
  date: string;
  location?: string;
  isVictory?: boolean;
  footeoUrl?: string;
}

export interface UpcomingMatch {
  id: string;
  category: string;
  competition: string;
  teamHome: string;
  teamAway: string;
  date: string;
  time: string;
  location: string;
  stade: string;
  isHome: boolean;
  convocationTime?: string;
  footeoUrl?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'evenement' | 'tournoi' | 'reunion' | 'stage';
  location: string;
  description: string;
  badge: string;
}

export interface ClubMetric {
  label: string;
  value: string;
  detail: string;
}

export interface Installation {
  id: string;
  name: string;
  commune: 'Bû' | 'Abondant' | 'Serville';
  address: string;
  surface: string;
  features: string[];
  accessPlanUrl?: string;
}

export interface TeamPlayer {
  id: string;
  firstName: string;
  lastName: string;
  number?: number;
  position?: string;
  photo?: string;
}

export interface TeamCategory {
  id: string;
  name: string;
  division: string;
  coach: string;
  assistantCoach?: string;
  trainingSchedule: string;
  site: string;
  ageGroup: string;
  description?: string;
  players?: TeamPlayer[];
  pole?: 'ecole-foot' | 'foot-a-11' | 'foot-feminin'; // Pôles officiels 2026-2027
  format?: 'Foot à 8' | 'Foot à 5' | 'Foot à 11' | 'Baby-Foot';
  birthYears?: string; // ex: '2015 - 2014'
  fee?: number; // ex: 135, 150, 90
  contactPrincipal?: { name: string; phone: string };
  badgeDistrict?: {
    categoryText: string;
    divisionText: string;
    levelSubtext?: string;
    badgeColor: 'red' | 'blue' | 'green'; // Red for U13/U15, Blue for Senior, Green for Veteran
    wins: number;
    draws: number;
    losses: number;
  };
}

export interface PlayerOfMonth {
  type: 'joueur' | 'entraineur';
  firstName: string;
  lastName: string;
  photo?: string;
  teamName: string;
  ageGroup: string;
  description: string;
  stats?: { label: string; value: string }[];
  month: string;
  year: string;
}

export interface TacticalElement {
  id: string;
  type: 'player' | 'goalkeeper' | 'opponent' | 'ball' | 'cone' | 'goal' | 'dummy';
  number?: number;
  label?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
}

export interface TacticalSessionBlock {
  type: 'accueil' | 'echauffement' | 'technique' | 'tactique' | 'jeu' | 'retour_calme' | 'bilan';
  title: string;
  durationMinutes: number;
  objective: string;
  elements: TacticalElement[];
  notes?: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  roles?: string[]; // Toutes les fonctions exercées regroupées
  category: 'bureau' | 'administration' | 'technique' | 'communication';
  categories?: ('bureau' | 'administration' | 'technique' | 'communication')[];
  photo?: string; // URL Footeo ou local
  phone?: string;
  email?: string;
  teamId?: string; // liaison avec l'équipe encadrée
}

export interface ClubHighlight {
  id: string;
  badge: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl?: string;
  linkText?: string;
  linkUrl?: string;
  tags: string[];
}

export interface SocialFeedPost {
  id: string;
  network: 'facebook' | 'instagram' | 'footeo' | 'tiktok';
  author: string;
  handle: string;
  date: string;
  content: string;
  mediaUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  url: string;
  badgeText?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  category: string;
  theme: string;
  totalDurationMinutes: number;
  targetCount: number;
  blocks: TacticalSessionBlock[];
  author: string;
  createdAt: string;
}

export type LicenceStatus = 'validee' | 'en_attente_paiement' | 'certificat_medical_requis' | 'a_renouveler';

export interface Licencie {
  id: string;
  numeroLicence: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  categorieAge: string; // Ex: 'U7', 'U9', 'U11', 'U13', 'U15', 'Seniors', 'Vétérans', 'Dirigeants'
  teamId?: string; // id de l'équipe assignée ou undefined si non assigné
  statutLicence: LicenceStatus;
  cotisationReglee: boolean;
  certificatMedicalValide: boolean;
  packAdidasRemis: boolean;
  telephone: string;
  email: string;
  adresse: string;
  commune: 'Bû' | 'Abondant' | 'Autre';
  dateInscription: string;
  positionPreferee?: string;
  photo?: string;
}

export interface Convocation {
  id: string;
  teamId: string;
  teamName: string;
  matchDate: string;
  matchTime: string;
  opponent: string;
  location: string;
  meetingTime: string;
  meetingPlace: string;
  coachName: string;
  coachPhone: string;
  selectedPlayers: string[]; // noms ou prénoms des joueurs
  absentPlayers: string[];
  notes: string;
  published?: boolean;
}

export interface PlayerEvolutionStat {
  id: string;
  licencieId: string;
  playerName: string;
  teamId: string;
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  trainingAttendancePct: number; // 0 - 100
  ratingProgression: number; // 0 - 10
  technicalScore: number; // 1 - 10
  tacticalScore: number; // 1 - 10
  physicalScore: number; // 1 - 10
  mindsetScore: number; // 1 - 10
  coachFeedback: string;
  lastUpdated: string;
}
