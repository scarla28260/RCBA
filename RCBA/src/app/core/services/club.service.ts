import { Injectable, signal, computed } from '@angular/core';
import {
  MatchResult,
  UpcomingMatch,
  ClubEvent,
  Partner,
  ClubMetric,
  AlertBanner,
  Installation,
  TeamCategory,
  TrainingSession,
  StaffMember,
  PlayerOfMonth,
  Licencie,
  Convocation,
  PlayerEvolutionStat,
} from '../models/club.model';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  // Identité officielle du club selon Cahier des Charges
  readonly clubName = signal('Racing Club Bû Abondant');
  readonly shortName = signal('RCBA');
  readonly affiliationFff = signal('528340');
  readonly foundingYear = signal('2020');
  readonly territories = signal(['Bû', 'Abondant']);

  // Couleurs officielles du club (Bleu Roi & Vert)
  readonly brandColors = signal({
    bluePrimary: '#101d69',
    blueRoyal: '#1f39cf',
    greenPrimary: '#21ad1c',
    greenVivid: '#25cf1f',
    white: '#ffffff',
  });

  // 6.2 Bandeau d'alerte pour informations urgentes (Météo, arrêtés, fermetures terrains)
  readonly activeAlert = signal<AlertBanner | null>({
    id: 'alerte-terrains-1',
    title: 'Info Terrains & Intempéries',
    message: 'Tous les entraînements du mercredi se déroulent sur les terrains de Bû et Abondant selon le planning normal.',
    type: 'info',
    active: true,
    linkText: 'Consulter le planning',
    linkUrl: '/agenda',
  });

  // Métriques du club
  readonly metrics = signal<ClubMetric[]>([
    { label: 'Licenciés', value: '280+', detail: 'De Baby Foot à Vétérans' },
    { label: 'Pôles Sportifs', value: '2 Sites', detail: 'Bû & Abondant' },
    { label: 'Labels FFF', value: '2', detail: 'Espoir & Féminin' },
    { label: 'Équipes Engagées', value: '5', detail: 'District 28 — Saison 2026-2027' },
  ]);

  // 6.1 Installations (3 sites officiels : Bû, Abondant, Serville)
  readonly installations = signal<Installation[]>([
    {
      id: 'bu',
      name: 'Stade Municipal de Bû',
      commune: 'Bû',
      address: 'Route de Marchezais, 28410 Bû',
      surface: 'Terrain pelouse naturelle & installations éclairées',
      features: ['Tribune couverte', 'Vestiaires officiels', 'Club house & Buvette', 'Parking gratuit'],
    },
    {
      id: 'abondant',
      name: 'Stade d\'Abondant',
      commune: 'Abondant',
      address: 'Rue du Stade, 28410 Abondant',
      surface: 'Terrain herbe grand jeu & espace foot d\'animation',
      features: ['Vestiaires joueurs & arbitres', 'Buvette week-end', 'Espace jeune footballeur'],
    },
  ]);

  // 6.1 Équipes & Catégories — Source officielle : rcba.footeo.com & Structure FFF (Saison 2026-2027)
  // L'ÉCOLE DE FOOTBALL regroupe toutes les équipes du Foot à 8 et du Foot à 5 (Baby, U7, U9, U11, U13)
  // Le FOOT À 11 regroupe les équipes de compétition sur grand terrain (U15, Seniors, Vétérans)
  readonly teams = signal<TeamCategory[]>([
    // ==========================================
    // PÔLE ÉCOLE DE FOOTBALL — FOOT À 8 & FOOT D'ANIMATION
    // ==========================================
    {
      id: 'u13-d1',
      name: 'R.C.B.A. - U13',
      division: 'D1 District 28',
      coach: 'Pierre MOMPO',
      assistantCoach: 'Laurent DUBOST',
      trainingSchedule: 'Mercredi (17h30) & Vendredi (17h30)',
      site: 'Stade de Bû',
      ageGroup: 'U12 - U13 (11-12 ans)',
      pole: 'ecole-foot',
      format: 'Foot à 8',
      description: "L'équipe U13 du RCBA dispute le championnat de Division 1 du District 28 en Foot à 8. Point d'orgue de l'école de football, cette catégorie prépare la transition vers le grand terrain avec des éducateurs diplômés.",
      players: [
        { id: 'p1', firstName: 'Loïs', lastName: 'DUPONT', number: 10, position: 'Milieu offensif' },
        { id: 'p2', firstName: 'Arthur', lastName: 'LEGRAND', number: 7, position: 'Attaquant' },
        { id: 'p3', firstName: 'Mathis', lastName: 'MOREL', number: 4, position: 'Défenseur central' },
        { id: 'p4', firstName: 'Noé', lastName: 'BERNARD', number: 1, position: 'Gardien de but' },
        { id: 'p5', firstName: 'Lucas', lastName: 'PETIT', number: 6, position: 'Milieu défensif' },
        { id: 'p6', firstName: 'Enzo', lastName: 'GIRARD', number: 9, position: 'Avant-centre' },
        { id: 'p7', firstName: 'Yanis', lastName: 'ROUX', number: 2, position: 'Défenseur latéral' },
        { id: 'p8', firstName: 'Gabin', lastName: 'FOURNIER', number: 11, position: 'Ailier gauche' },
      ],
    },
    {
      id: 'u11-foot8',
      name: 'R.C.B.A. - U11',
      division: 'Critérium & Plateaux District',
      coach: 'Frédéric NOBRE',
      assistantCoach: 'Franck GONZALES',
      trainingSchedule: 'Mercredi (15h30 - 17h00) & Samedi matin',
      site: "Stade d'Abondant",
      ageGroup: 'U10 - U11 (9-10 ans)',
      pole: 'ecole-foot',
      format: 'Foot à 8',
      description: "Les U11 évoluent en Foot à 8 sur demi-terrain selon les règles FFF. Cette catégorie clé de l'École de Foot renforce les principes tactiques collectifs, le jeu combiné et le respect des postes.",
    },
    {
      id: 'u9-animation',
      name: 'R.C.B.A. - U9 / U8',
      division: 'Plateaux Festi-Foot District 28',
      coach: 'Quentin LE CORRE',
      assistantCoach: 'Romain BERGER',
      trainingSchedule: 'Mercredi (14h00 - 15h30) & Samedi matin',
      site: "Stade d'Abondant",
      ageGroup: 'U8 - U9 (7-8 ans)',
      pole: 'ecole-foot',
      format: 'Foot à 5',
      description: "Apprentissage des bases du jeu en Foot à 5. Ateliers de motricité, conduite de balle, jeux réduits et plateaux Festi-Foot le samedi matin dans un esprit d'amusement et de camaraderie.",
    },
    {
      id: 'u7-babyfoot',
      name: 'R.C.B.A. - U7 & Baby Foot',
      division: 'Éveil & Découverte Ludique',
      coach: 'Philippe BARBIER',
      assistantCoach: 'Quentin LE CORRE',
      trainingSchedule: 'Mercredi après-midi (14h00 - 15h00)',
      site: "Stade d'Abondant",
      ageGroup: 'Baby & U6-U7 (4-6 ans)',
      pole: 'ecole-foot',
      format: 'Baby-Foot',
      description: "Le premier contact avec le ballon rond ! Séance hebdomadaire axée sur l'éveil corporel, la coordination, la socialisation et le plaisir du jeu sans esprit de compétition. Labellisé Espoir FFF.",
    },

    // ==========================================
    // PÔLE FOOT À 11 — COMPÉTITION GRAND TERRAIN
    // ==========================================
    {
      id: 'u15-d3',
      name: 'R.C.B.A. - U15',
      division: 'D3 District 28',
      coach: 'Laurent MARIE LUCE',
      assistantCoach: 'Frédéric NOBRE',
      trainingSchedule: 'Mercredi & Vendredi (17h30 - 19h00)',
      site: 'Stade de Bû',
      ageGroup: 'U14 - U15 (13-14 ans)',
      pole: 'foot-a-11',
      format: 'Foot à 11',
      description: "Première catégorie sur grand terrain (Foot à 11). Les U15 abordent les exigences physiques, tactiques et réglementaires du football à 11 sous la conduite d'éducateurs expérimentés.",
    },
    {
      id: 'seniors-d3',
      name: 'R.C.B.A. - Seniors',
      division: 'D3 District 28',
      coach: 'Didier VANDIER',
      assistantCoach: 'Sylvain PENNETIER',
      trainingSchedule: 'Mardi & Jeudi soir (20h00)',
      site: 'Stade de Bû',
      ageGroup: 'Seniors (+18 ans)',
      pole: 'foot-a-11',
      format: 'Foot à 11',
      description: "L'équipe Senior première du RCBA évolue en Division 3 du District 28 en Foot à 11. Porte-étendard sportif du club, elle réunit compétitivité, cohésion et esprit club chaque dimanche après-midi.",
    },
    {
      id: 'veterans-d1',
      name: 'R.C.B.A. - Vétérans 1',
      division: 'D1 District 28',
      coach: 'Agnès JUSTIN',
      assistantCoach: 'Kan Nam CHIEV',
      trainingSchedule: 'Jeudi soir (19h30)',
      site: "Stade d'Abondant",
      ageGroup: 'Vétérans (+35 ans)',
      pole: 'foot-a-11',
      format: 'Foot à 11',
      description: "Engagés au plus haut niveau départemental (Division 1 Foot à 11), les Vétérans 1 allient passion du jeu, longévité sportive et transmission des valeurs du club le dimanche matin.",
    },
    {
      id: 'veterans-d3',
      name: 'R.C.B.A. - Vétérans 2',
      division: 'D3 District 28',
      coach: 'Michel CARRASQUEIRA',
      trainingSchedule: 'Jeudi soir (19h30)',
      site: "Stade d'Abondant",
      ageGroup: 'Vétérans (+35 ans)',
      pole: 'foot-a-11',
      format: 'Foot à 11',
      description: "Les Vétérans 2 évoluent en Division 3 Foot à 11. Une équipe chaleureuse et soudée où le plaisir de se retrouver et la passion du football restent intacts.",
    },
  ]);

  // Joueur & Entraîneur du Mois — Rubrique Accueil
  readonly playerOfMonth = signal<PlayerOfMonth>({
    type: 'joueur',
    firstName: 'Loïs',
    lastName: 'DUPONT',
    photo: undefined,
    teamName: 'R.C.B.A. - U13',
    ageGroup: 'U13 (11-12 ans)',
    description:
      'Loïs s\'est distingué lors du match amical face à U.S. MLE Olivet avec une prestation remarquée au milieu de terrain. Sa vision du jeu, sa technique et son engagement en font un joueur exemplaire pour ses coéquipiers.',
    stats: [
      { label: 'Matchs joués', value: '3' },
      { label: 'Buts', value: '2' },
      { label: 'Passes décisives', value: '1' },
    ],
    month: 'Septembre',
    year: '2026',
  });

  readonly coachOfMonth = signal<PlayerOfMonth>({
    type: 'entraineur',
    firstName: 'Pierre',
    lastName: 'MOMPO',
    photo: 'https://s3.static-footeo.com/uploads/rcba/executives/pierre-mompo__rgpzif.jpg',
    teamName: 'R.C.B.A. - U13',
    ageGroup: 'U13 (11-12 ans)',
    description:
      'Pierre encadre les U13 avec une pédagogie remarquable. Son approche ludique et technique permet aux jeunes joueurs de progresser rapidement tout en restant passionnés par le football.',
    stats: [
      { label: 'Séances animées', value: '8' },
      { label: 'Résultat équipe', value: '1V - 0D' },
      { label: 'Diplôme', value: 'UEFA B' },
    ],
    month: 'Septembre',
    year: '2026',
  });

  // Résultats récents réels — Source : rcba.footeo.com (Saison 2026-2027)
  readonly recentResults = signal<MatchResult[]>([
    {
      category: 'U13 — D1 District (Amical)',
      teamHome: 'U.S. MLE Olivet',
      teamAway: 'RCBA - U13',
      scoreHome: 1,
      scoreAway: 1,
      date: '09 Sep. 2026',
      location: 'Terrain adverse',
      isVictory: undefined,
    },
    {
      category: 'Vétéran — D1 District',
      teamHome: 'RCBA - Vétéran',
      teamAway: 'AUNEAU ENT SP',
      scoreHome: 1,
      scoreAway: 5,
      date: '06 Sep. 2026',
      location: 'Stade d\'Abondant',
      isVictory: false,
    },
    {
      category: 'Senior — Coupe de France',
      teamHome: 'RCBA - Senior',
      teamAway: 'NOGENT LE ROI',
      scoreHome: 1,
      scoreAway: 5,
      date: '23 Août 2026',
      location: 'Stade de Bû',
      isVictory: false,
    },
    {
      category: 'Senior — D3 District',
      teamHome: 'VILLEMEUX AS 2',
      teamAway: 'RCBA - Senior',
      scoreHome: 4,
      scoreAway: 4,
      date: '31 Mai 2026',
      location: 'Terrain adverse',
      isVictory: undefined,
    },
  ]);

  // Matchs à venir / Convocations du week-end
  readonly upcomingMatches = signal<UpcomingMatch[]>([
    {
      id: 'match-u13-1',
      category: 'U13',
      competition: 'D1 District 28 — Journée 1',
      teamHome: 'RCBA - U13',
      teamAway: 'DREUX FC 2',
      date: 'Samedi 19 Septembre 2026',
      time: '14h30',
      location: 'Bû',
      stade: 'Stade Municipal de Bû',
      isHome: true,
      convocationTime: '13h30 au stade',
    },
    {
      id: 'match-seniors-1',
      category: 'Seniors',
      competition: 'D3 District 28 — Journée 2',
      teamHome: 'ANET FC',
      teamAway: 'RCBA - Senior',
      date: 'Dimanche 20 Septembre 2026',
      time: '15h00',
      location: 'Anet',
      stade: 'Stade Municipal d\'Anet',
      isHome: false,
      convocationTime: '13h45 à Bû (covoiturage)',
    },
    {
      id: 'match-veterans-1',
      category: 'Vétérans',
      competition: 'D1 District 28 — Journée 2',
      teamHome: 'RCBA - Vétéran 1',
      teamAway: 'EPERNON ES',
      date: 'Dimanche 20 Septembre 2026',
      time: '10h00',
      location: 'Abondant',
      stade: 'Stade d\'Abondant',
      isHome: true,
      convocationTime: '09h00 aux vestiaires',
    },
    {
      id: 'match-u15-1',
      category: 'U15',
      competition: 'D3 District 28 — Journée 1',
      teamHome: 'LUCÉ AMICALE 3',
      teamAway: 'RCBA - U15',
      date: 'Samedi 19 Septembre 2026',
      time: '15h30',
      location: 'Lucé',
      stade: 'Stade Jean Boudrie, Lucé',
      isHome: false,
      convocationTime: '14h00 à Bû',
    },
    {
      id: 'match-ecole-foot-1',
      category: 'École de Foot',
      competition: 'Plateau d\'Automne U7 / U9',
      teamHome: 'Plateau multi-équipes',
      teamAway: 'RCBA & Invités',
      date: 'Samedi 19 Septembre 2026',
      time: '10h00',
      location: 'Abondant',
      stade: 'Stade d\'Abondant',
      isHome: true,
      convocationTime: '09h30 accueil des équipes',
    },
  ]);

  // Événements du club & Dates clés
  readonly clubEvents = signal<ClubEvent[]>([
    {
      id: 'evt-1',
      title: 'Journée d\'Accueil & Remise des Équipements',
      date: 'Samedi 26 Septembre 2026',
      time: '10h00 - 17h00',
      category: 'evenement',
      location: 'Club House, Stade de Bû',
      description: 'Distribution des packs licenciés, flocages personnalisés avec Les 3S Sports, buvette conviviale et accueil des nouvelles familles.',
      badge: 'Vie du Club',
    },
    {
      id: 'evt-2',
      title: 'Assemblée Générale Ordinaire',
      date: 'Vendredi 9 Octobre 2026',
      time: '19h30',
      category: 'reunion',
      location: 'Salle polyvalente d\'Abondant',
      description: 'Bilan moral et financier de la saison, renouvellement partiel du bureau et présentation des ambitions pour les labels FFF.',
      badge: 'Institutionnel',
    },
    {
      id: 'evt-3',
      title: 'Stage Football Vacances de la Toussaint',
      date: 'Du 19 au 23 Octobre 2026',
      time: '09h00 - 17h00',
      category: 'stage',
      location: 'Stade de Bû & Gymnase',
      description: 'Stage perfectionnement technique ouvert aux licenciés et non-licenciés (U6 à U13), encadré par des éducateurs diplômés d\'État.',
      badge: 'Stage Jeunes',
    },
    {
      id: 'evt-4',
      title: 'Tournoi National U11/U13 — Fillon Technologie Cup',
      date: 'Samedi 1er & Dimanche 2 Mai 2027',
      time: '09h00 - 18h00',
      category: 'tournoi',
      location: 'Stades de Bû & Abondant',
      description: 'Grand tournoi annuel rassemblant 32 équipes de plusieurs régions de France. Buvette, restauration et animations sur place.',
      badge: 'Tournoi Annuel',
    },
  ]);

  // 6.1 Partenaires officiels
  readonly partners = signal<Partner[]>([
    { name: 'Fillon Technologie', category: 'Partenaire Majeur', logo: '/images/Partenaires/Fillon Technologies.png' },
    { name: 'Les 3S Sports', category: 'Équipementier Officiel', logo: '/images/Partenaires/Les 3S sport.png' },
    { name: 'Hiblot.com', category: 'Conseil & Digital', logo: '/images/Partenaires/HIBLOT.COM.png' },
    { name: 'Garage CMA - Renault', category: 'Automobile & Mobilité', logo: '/images/Partenaires/Groupe CMA - Renault.png' },
    { name: "O'Plateau", category: 'Restauration Conviviale', logo: '/images/Partenaires/OuPlateau.png' },
    { name: 'ALF', category: 'Partenaire Local', logo: '/images/Partenaires/Alf.png' },
    { name: 'Garage AURIAU', category: 'Automobile', logo: '/images/Partenaires/Garage Auriau.png' },
    { name: "Générale d'Optique Dreux", category: 'Optique', logo: '/images/Partenaires/Gunural duoptique - DREUX.png' },
    { name: 'Crédit Agricole', category: 'Partenaire Bancaire', logo: '/images/Partenaires/Credit Agricole.png' },
    { name: 'Progreen', category: 'Espaces & Environnement', logo: '/images/Partenaires/Pro Green.png' },
  ]);

  // 6.4 Dirigeants & Staff Officiel — Source Organigramme Général 2025-2026 & Site Officiel
  readonly staff = signal<StaffMember[]>([
    // === 1. BUREAU EXÉCUTIF & PRÉSIDENCE ===
    {
      id: 'marc-waroquier',
      firstName: 'Marc',
      lastName: 'WAROQUIER',
      role: 'Président',
      category: 'bureau',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/marc-waroquier__sl3ql0.jpg',
    },
    {
      id: 'matthieu-vity',
      firstName: 'Matthieu',
      lastName: 'VITY',
      role: 'Vice-Président',
      category: 'bureau',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/matthieu-vity__qvgoyb.jpg',
    },
    {
      id: 'vincent-godet',
      firstName: 'Vincent',
      lastName: 'GODET',
      role: 'Secrétaire Général',
      category: 'bureau',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/vincent-godet__sl3ql2.jpg',
    },

    // === 2. COMITÉ DIRECTEUR & ADMINISTRATION ===
    {
      id: 'ghislaine-vity',
      firstName: 'Ghislaine',
      lastName: 'VITY',
      role: 'Responsable Administratif & Buvette',
      category: 'administration',
    },
    {
      id: 'vanessa-ameline',
      firstName: 'Vanessa',
      lastName: 'AMELINE',
      role: "Membre du Conseil d'Administration / Secrétaire Adjointe",
      category: 'administration',
    },
    {
      id: 'vanessa-dessirier',
      firstName: 'Vanessa',
      lastName: 'DESSIRIER',
      role: 'Responsable Partenariat & Sponsoring',
      category: 'administration',
    },
    {
      id: 'quentin-le-corre',
      firstName: 'Quentin',
      lastName: 'LE CORRE',
      role: 'Responsable Animation & École de Foot',
      category: 'administration',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/quentin-le-corre__rivjzr.jpg',
    },
    {
      id: 'philippe-barbier',
      firstName: 'Philippe',
      lastName: 'BARBIER',
      role: 'Responsable Technique Foot à 11 & Jeunes',
      category: 'administration',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/philippe-barbier__sl567r.jpg',
    },
    {
      id: 'yannick-cavadaski',
      firstName: 'Yannick',
      lastName: 'CAVADASKI',
      role: 'Responsable Foot Féminin',
      category: 'administration',
    },
    {
      id: 'guillaume-vautelin',
      firstName: 'Guillaume',
      lastName: 'VAUTELIN',
      role: 'Dirigeant Club',
      category: 'administration',
      photo: 'https://s1.static-footeo.com/uploads/rcba/executives/guillaume-vautelin__rgpzlx.jpg',
    },
    {
      id: 'guillaume-berger',
      firstName: 'Guillaume',
      lastName: 'BERGER',
      role: 'Dirigeant Club',
      category: 'administration',
    },
    {
      id: 'mikael-masson',
      firstName: 'Mikaël',
      lastName: 'MASSON',
      role: 'Dirigeant Club',
      category: 'administration',
    },
    {
      id: 'romain-gauthier',
      firstName: 'Romain',
      lastName: 'GAUTHIER',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },
    {
      id: 'sebastien-petaccia',
      firstName: 'Sébastien',
      lastName: 'PETACCIA',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },
    {
      id: 'dylan-dejour',
      firstName: 'Dylan',
      lastName: 'DEJOUR',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },
    {
      id: 'alexis-balland',
      firstName: 'Alexis',
      lastName: 'BALLAND',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },
    {
      id: 'alyx-barbe',
      firstName: 'Alyx',
      lastName: 'BARBE',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },
    {
      id: 'mehdi-belaskri',
      firstName: 'Mehdi',
      lastName: 'BELASKRI',
      role: 'Dirigeant & Éducateur',
      category: 'administration',
    },

    // === 3. PÔLE COMMUNICATION ===
    {
      id: 'nicolas-hiblot',
      firstName: 'Nicolas',
      lastName: 'HIBLOT',
      role: 'Responsable Communication',
      category: 'communication',
    },
    {
      id: 'sabine-coipeau',
      firstName: 'Sabine',
      lastName: 'COIPEAU',
      role: 'Membre Pôle Communication & Trésorière Adjointe',
      category: 'communication',
    },
    {
      id: 'florence-raclot',
      firstName: 'Florence',
      lastName: 'RACLOT',
      role: 'Membre Pôle Communication',
      category: 'communication',
    },
    {
      id: 'sebastien-guillaumin',
      firstName: 'Sébastien',
      lastName: 'GUILLAUMIN',
      role: 'Membre Pôle Communication',
      category: 'communication',
    },

    // === 4. ENCADREMENT SPORTIF & TECHNIQUE ===
    {
      id: 'didier-vandier',
      firstName: 'Didier',
      lastName: 'VANDIER',
      role: 'Entraîneur Principal Seniors D3',
      category: 'technique',
      teamId: 'seniors-d3',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/didier-vandier__sl56hi.jpg',
    },
    {
      id: 'sylvain-pennetier',
      firstName: 'Sylvain',
      lastName: 'PENNETIER',
      role: 'Entraîneur Adjoint Seniors D3',
      category: 'technique',
      teamId: 'seniors-d3',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/sylvain-pennetier__rgpzbj.png',
    },
    {
      id: 'benjamin-harache',
      firstName: 'Benjamin',
      lastName: 'HARACHE',
      role: 'Entraîneur & Service Civique',
      category: 'technique',
    },
    {
      id: 'mael-bourdin',
      firstName: 'Maël',
      lastName: 'BOURDIN',
      role: 'Apprentissage BMF',
      category: 'technique',
    },
    {
      id: 'mickael-dessirier-giroudot',
      firstName: 'Mickaël',
      lastName: 'DESSIRIER-GIROUDOT',
      role: 'Entraîneur des Gardiens',
      category: 'technique',
      photo: 'https://s2.static-footeo.com/750/uploads/rcba/executives/mickael-dessirier-giroudot__rivhse.jpg',
    },
    {
      id: 'agnes-justin',
      firstName: 'Agnès',
      lastName: 'JUSTIN',
      role: 'Entraîneuse Adjointe Vétérans',
      category: 'technique',
      teamId: 'veterans-d1',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/agnes-justin__rgpzhg.jpg',
    },
    {
      id: 'kan-nam-chiev',
      firstName: 'Kan Nam',
      lastName: 'CHIEV',
      role: 'Entraîneur Adjoint Vétérans D1',
      category: 'technique',
      teamId: 'veterans-d1',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/kan-nam-chiev__rgpzbu.jpg',
    },
    {
      id: 'michel-carrasqueira',
      firstName: 'Michel',
      lastName: 'CARRASQUEIRA',
      role: 'Entraîneur Adjoint Vétérans D3',
      category: 'technique',
      teamId: 'veterans-d3',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/michel-carrasqueira__rgpzi7.jpg',
    },
    {
      id: 'pierre-mompo',
      firstName: 'Pierre',
      lastName: 'MOMPO',
      role: 'Éducateur Principal U13 D1',
      category: 'technique',
      teamId: 'u13-d1',
      photo: 'https://s3.static-footeo.com/uploads/rcba/executives/pierre-mompo__rgpzif.jpg',
    },
    {
      id: 'laurent-dubost',
      firstName: 'Laurent',
      lastName: 'DUBOST',
      role: 'Éducateur Adjoint U13',
      category: 'technique',
      teamId: 'u13-d1',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-dubost__rggs3n.jpg',
    },
    {
      id: 'laurent-marie-luce',
      firstName: 'Laurent',
      lastName: 'MARIE LUCE',
      role: 'Éducateur Principal U15 D3',
      category: 'technique',
      teamId: 'u15-d3',
      photo: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-marie-luce__rggs9g.jpg',
    },
    {
      id: 'frederic-nobre',
      firstName: 'Frédéric',
      lastName: 'NOBRE',
      role: 'Éducateur U11 & Adjoint U15',
      category: 'technique',
      teamId: 'u11-foot8',
      photo: 'https://s1.static-footeo.com/750/uploads/rcba/executives/frederic__rivn5g.jpg',
    },
    {
      id: 'franck-gonzales',
      firstName: 'Franck',
      lastName: 'GONZALES',
      role: 'Éducateur Adjoint U11',
      category: 'technique',
      teamId: 'u11-foot8',
    },
    {
      id: 'romain-berger',
      firstName: 'Romain',
      lastName: 'BERGER',
      role: 'Éducateur U9 Animation',
      category: 'technique',
      teamId: 'u9-animation',
    },
    {
      id: 'leny-waroquier',
      firstName: 'Lény',
      lastName: 'WAROQUIER',
      role: 'Éducateur Jeunes',
      category: 'technique',
      photo: '/images/staff/leny-waroquier.png',
    },
    {
      id: 'sebastien-barbou',
      firstName: 'Sébastien',
      lastName: 'BARBOU',
      role: 'Éducateur Jeunes',
      category: 'technique',
    },
    {
      id: 'sebastien-moutault',
      firstName: 'Sébastien',
      lastName: 'MOUTAULT',
      role: 'Éducateur Jeunes',
      category: 'technique',
    },
    {
      id: 'stephane-joubert',
      firstName: 'Stéphane',
      lastName: 'JOUBERT',
      role: 'Éducateur Jeunes',
      category: 'technique',
    },

    // === 5. BÉNÉVOLES ACTIFS & SOUTIEN CLUB ===
    {
      id: 'cecile-boutigny',
      firstName: 'Cécile',
      lastName: 'BOUTIGNY',
      role: 'Bénévole Logistique & Événements',
      category: 'administration',
    },
    {
      id: 'david-plu',
      firstName: 'David',
      lastName: 'PLU',
      role: 'Bénévole & Soutien Matchs',
      category: 'administration',
    },
    {
      id: 'fabrice-rouchard',
      firstName: 'Fabrice',
      lastName: 'ROUCHARD',
      role: 'Bénévole & Soutien Terrains',
      category: 'administration',
    },
    {
      id: 'gregory-margueritat',
      firstName: 'Grégory',
      lastName: 'MARGUERITAT',
      role: 'Bénévole & Logistique',
      category: 'administration',
    },
    {
      id: 'jean-claude-waroquier',
      firstName: 'Jean-Claude',
      lastName: 'WAROQUIER',
      role: 'Bénévole Historique Club',
      category: 'administration',
    },
    {
      id: 'pascal-legendre',
      firstName: 'Pascal',
      lastName: 'LEGENDRE',
      role: 'Bénévole & Arbitrage Bénévole',
      category: 'administration',
    },
  ]);

  // 7.2 Éducateurs : Bibliothèque de séances et module tactique
  readonly sampleSessions = signal<TrainingSession[]>([
    {
      id: 'session-1',
      title: 'Transition Offensive & Finition Rapide',
      category: 'U18 / Seniors',
      theme: 'Attaque Rapide & Contre-Attaque',
      totalDurationMinutes: 90,
      targetCount: 16,
      author: 'Benjamin HARACHE',
      createdAt: 'Septembre 2026',
      blocks: [
        {
          type: 'accueil',
          title: 'Accueil & Présentation des Objectifs',
          durationMinutes: 10,
          objective: 'Cadrage de la séance et explication des principes de transition',
          elements: [],
        },
        {
          type: 'echauffement',
          title: 'Échauffement avec Ballon en Losange',
          durationMinutes: 15,
          objective: 'Passes et va, coordination motrice, mise en route articulaire',
          elements: [
            { id: 'e1', type: 'cone', x: 20, y: 20 },
            { id: 'e2', type: 'cone', x: 40, y: 20 },
            { id: 'e3', type: 'player', number: 8, x: 20, y: 25 },
            { id: 'e4', type: 'ball', x: 22, y: 25 },
          ],
        },
        {
          type: 'technique',
          title: 'Circuit de passes rythmées & Appui-Soutien',
          durationMinutes: 20,
          objective: 'Qualité du contrôle orienté et du dosage de passe',
          elements: [],
        },
        {
          type: 'tactique',
          title: 'Situation 3 contre 2 avec transition défense-attaque',
          durationMinutes: 25,
          objective: 'Fixer dans l\'axe, renverser ou finir rapidement',
          elements: [
            { id: 'p1', type: 'goalkeeper', label: 'GB', x: 50, y: 10 },
            { id: 'p2', type: 'player', number: 4, x: 40, y: 30 },
            { id: 'p3', type: 'player', number: 5, x: 60, y: 30 },
            { id: 'p4', type: 'opponent', number: 9, x: 50, y: 45 },
            { id: 'p5', type: 'opponent', number: 10, x: 35, y: 50 },
            { id: 'p6', type: 'opponent', number: 11, x: 65, y: 50 },
            { id: 'b1', type: 'ball', x: 50, y: 48 },
          ],
        },
        {
          type: 'jeu',
          title: 'Opposition dirigée terrain réduit',
          durationMinutes: 15,
          objective: 'Application des transitions en situation réelle',
          elements: [],
        },
        {
          type: 'bilan',
          title: 'Retour au calme & Débriefing',
          durationMinutes: 5,
          objective: 'Étirements légers et validation des acquis',
          elements: [],
        },
      ],
    },
  ]);

  dismissAlert(): void {
    this.activeAlert.set(null);
  }

  // ==========================================
  // GESTION DES LICENCIÉS ET DES ÉQUIPES (PORTAIL DIRECTION)
  // ==========================================
  readonly licencies = signal<Licencie[]>([
    {
      id: 'lic-1',
      numeroLicence: '2548901234',
      nom: 'DUPONT',
      prenom: 'Loïs',
      dateNaissance: '14/05/2014',
      sexe: 'M',
      categorieAge: 'U13',
      teamId: 'u13-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 11 22 33 44',
      email: 'famille.dupont@orange.fr',
      adresse: '12 Rue de Marchezais',
      commune: 'Bû',
      dateInscription: '15/07/2026',
      positionPreferee: 'Milieu offensif',
    },
    {
      id: 'lic-2',
      numeroLicence: '2548901235',
      nom: 'LEGRAND',
      prenom: 'Arthur',
      dateNaissance: '02/11/2014',
      sexe: 'M',
      categorieAge: 'U13',
      teamId: 'u13-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 22 33 44 55',
      email: 'legrand.jean@gmail.com',
      adresse: '4 Allée des Chênes',
      commune: 'Abondant',
      dateInscription: '20/07/2026',
      positionPreferee: 'Attaquant',
    },
    {
      id: 'lic-3',
      numeroLicence: '2548901236',
      nom: 'MOREL',
      prenom: 'Mathis',
      dateNaissance: '19/03/2013',
      sexe: 'M',
      categorieAge: 'U13',
      teamId: 'u13-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 33 44 55 66',
      email: 'morel.sylvie@free.fr',
      adresse: '8 Rue du Stade',
      commune: 'Bû',
      dateInscription: '18/07/2026',
      positionPreferee: 'Défenseur central',
    },
    {
      id: 'lic-4',
      numeroLicence: '2548901237',
      nom: 'BERNARD',
      prenom: 'Noé',
      dateNaissance: '08/09/2014',
      sexe: 'M',
      categorieAge: 'U13',
      teamId: 'u13-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 44 55 66 77',
      email: 'bernard.noe@sfr.fr',
      adresse: '15 Rue de Dreux',
      commune: 'Bû',
      dateInscription: '05/08/2026',
      positionPreferee: 'Gardien de but',
    },
    {
      id: 'lic-5',
      numeroLicence: '2548901238',
      nom: 'PETIT',
      prenom: 'Lucas',
      dateNaissance: '22/01/2014',
      sexe: 'M',
      categorieAge: 'U13',
      teamId: 'u13-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 55 66 77 88',
      email: 'famille.petit@gmail.com',
      adresse: '7 Route d\'Houdan',
      commune: 'Abondant',
      dateInscription: '12/07/2026',
      positionPreferee: 'Milieu défensif',
    },
    {
      id: 'lic-6',
      numeroLicence: '2548902001',
      nom: 'MARTIN',
      prenom: 'Hugo',
      dateNaissance: '12/04/2015',
      sexe: 'M',
      categorieAge: 'U11',
      teamId: 'u11-foot8',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 67 89 01 23',
      email: 'martin.hugo@orange.fr',
      adresse: '3 Place de l\'Église',
      commune: 'Bû',
      dateInscription: '14/08/2026',
      positionPreferee: 'Milieu de terrain',
    },
    {
      id: 'lic-7',
      numeroLicence: '2548902002',
      nom: 'GARCIA',
      prenom: 'Enzo',
      dateNaissance: '30/08/2015',
      sexe: 'M',
      categorieAge: 'U11',
      teamId: 'u11-foot8',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: false,
      telephone: '06 78 90 12 34',
      email: 'garcia.famille@outlook.fr',
      adresse: '21 Rue de la Mairie',
      commune: 'Abondant',
      dateInscription: '01/09/2026',
      positionPreferee: 'Attaquant',
    },
    {
      id: 'lic-8',
      numeroLicence: '2548902003',
      nom: 'ROUSSEL',
      prenom: 'Léo',
      dateNaissance: '17/12/2015',
      sexe: 'M',
      categorieAge: 'U11',
      teamId: undefined, // Non assigné à une équipe pour démonstration
      statutLicence: 'en_attente_paiement',
      cotisationReglee: false,
      certificatMedicalValide: true,
      packAdidasRemis: false,
      telephone: '06 89 01 23 45',
      email: 'roussel.leo@free.fr',
      adresse: '5 Chemin des Vignes',
      commune: 'Bû',
      dateInscription: '04/09/2026',
      positionPreferee: 'Défenseur',
    },
    {
      id: 'lic-9',
      numeroLicence: '2548903001',
      nom: 'LUCAS',
      prenom: 'Gabin',
      dateNaissance: '15/06/2017',
      sexe: 'M',
      categorieAge: 'U9',
      teamId: 'u9-animation',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 12 98 76 54',
      email: 'lucas.gabin@laposte.net',
      adresse: '18 Rue du Château',
      commune: 'Abondant',
      dateInscription: '25/08/2026',
      positionPreferee: 'Attaquant',
    },
    {
      id: 'lic-10',
      numeroLicence: '2548903002',
      nom: 'FAURE',
      prenom: 'Timéo',
      dateNaissance: '09/02/2018',
      sexe: 'M',
      categorieAge: 'U9',
      teamId: undefined, // Non assigné
      statutLicence: 'certificat_medical_requis',
      cotisationReglee: true,
      certificatMedicalValide: false,
      packAdidasRemis: false,
      telephone: '06 23 45 67 89',
      email: 'faure.famille@gmail.com',
      adresse: '9 Rue des Prés',
      commune: 'Bû',
      dateInscription: '02/09/2026',
      positionPreferee: 'Polivalent',
    },
    {
      id: 'lic-11',
      numeroLicence: '2548904001',
      nom: 'MERCIER',
      prenom: 'Sacha',
      dateNaissance: '20/09/2020',
      sexe: 'M',
      categorieAge: 'U7',
      teamId: 'u7-babyfoot',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 34 56 78 90',
      email: 'mercier.sacha@orange.fr',
      adresse: '2 Rue Verte',
      commune: 'Bû',
      dateInscription: '10/08/2026',
      positionPreferee: 'Éveil ludique',
    },
    {
      id: 'lic-12',
      numeroLicence: '2548905001',
      nom: 'VANDIER',
      prenom: 'Thomas',
      dateNaissance: '12/03/2000',
      sexe: 'M',
      categorieAge: 'Seniors',
      teamId: 'seniors-d3',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 45 67 89 01',
      email: 'thomas.vandier@rcba.club',
      adresse: '10 Rue de la Paix',
      commune: 'Bû',
      dateInscription: '01/07/2026',
      positionPreferee: 'Milieu relayeur',
    },
    {
      id: 'lic-13',
      numeroLicence: '2548905002',
      nom: 'MORIN',
      prenom: 'Alexandre',
      dateNaissance: '25/07/1998',
      sexe: 'M',
      categorieAge: 'Seniors',
      teamId: 'seniors-d3',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 56 78 90 12',
      email: 'alex.morin@gmail.com',
      adresse: '14 Rue de Marchezais',
      commune: 'Bû',
      dateInscription: '03/07/2026',
      positionPreferee: 'Défenseur central',
    },
    {
      id: 'lic-14',
      numeroLicence: '2548905003',
      nom: 'RENAULT',
      prenom: 'Julien',
      dateNaissance: '11/11/2001',
      sexe: 'M',
      categorieAge: 'Seniors',
      teamId: undefined, // Non assigné
      statutLicence: 'a_renouveler',
      cotisationReglee: false,
      certificatMedicalValide: false,
      packAdidasRemis: false,
      telephone: '06 67 89 12 34',
      email: 'julien.renault@orange.fr',
      adresse: '8 Rue des Fleurs',
      commune: 'Abondant',
      dateInscription: '10/09/2026',
      positionPreferee: 'Attaquant',
    },
    {
      id: 'lic-15',
      numeroLicence: '2548906001',
      nom: 'NOBRE',
      prenom: 'Alexis',
      dateNaissance: '14/06/2011',
      sexe: 'M',
      categorieAge: 'U15',
      teamId: 'u15-d3',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 78 91 23 45',
      email: 'nobre.famille@free.fr',
      adresse: '6 Route d\'Anet',
      commune: 'Abondant',
      dateInscription: '15/07/2026',
      positionPreferee: 'Ailier droit',
    },
    {
      id: 'lic-16',
      numeroLicence: '2548906002',
      nom: 'MARIE LUCE',
      prenom: 'Kylian',
      dateNaissance: '03/01/2012',
      sexe: 'M',
      categorieAge: 'U15',
      teamId: 'u15-d3',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 89 12 34 56',
      email: 'marieluce.laurent@rcba.club',
      adresse: '22 Rue du Moulin',
      commune: 'Bû',
      dateInscription: '10/07/2026',
      positionPreferee: 'Attaquant',
    },
    {
      id: 'lic-17',
      numeroLicence: '2548907001',
      nom: 'JUSTIN',
      prenom: 'Agnès',
      dateNaissance: '08/04/1982',
      sexe: 'F',
      categorieAge: 'Vétérans',
      teamId: 'veterans-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 90 12 34 57',
      email: 'agnes.justin@rcba.club',
      adresse: '17 Rue de Bû',
      commune: 'Abondant',
      dateInscription: '01/07/2026',
      positionPreferee: 'Gardienne / Coach',
    },
    {
      id: 'lic-18',
      numeroLicence: '2548907002',
      nom: 'CHIEV',
      prenom: 'Kan Nam',
      dateNaissance: '19/08/1980',
      sexe: 'M',
      categorieAge: 'Vétérans',
      teamId: 'veterans-d1',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 01 23 45 68',
      email: 'kannam.chiev@rcba.club',
      adresse: '31 Rue de Paris',
      commune: 'Abondant',
      dateInscription: '05/07/2026',
      positionPreferee: 'Défenseur',
    },
    {
      id: 'lic-19',
      numeroLicence: '2548907003',
      nom: 'CARRASQUEIRA',
      prenom: 'Michel',
      dateNaissance: '04/10/1975',
      sexe: 'M',
      categorieAge: 'Vétérans',
      teamId: 'veterans-d3',
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 12 34 56 79',
      email: 'michel.carrasqueira@rcba.club',
      adresse: '12 Rue des Vergers',
      commune: 'Abondant',
      dateInscription: '02/07/2026',
      positionPreferee: 'Milieu de terrain',
    },
    {
      id: 'lic-20',
      numeroLicence: '2548908001',
      nom: 'GIRARD',
      prenom: 'Camille',
      dateNaissance: '18/05/2012',
      sexe: 'F',
      categorieAge: 'U15F',
      teamId: undefined, // Non assignée
      statutLicence: 'validee',
      cotisationReglee: true,
      certificatMedicalValide: true,
      packAdidasRemis: true,
      telephone: '06 23 45 67 90',
      email: 'famille.girard@gmail.com',
      adresse: '5 Impasse des Lilas',
      commune: 'Bû',
      dateInscription: '20/08/2026',
      positionPreferee: 'Milieu offensive',
    },
  ]);

  /**
   * Assigner ou réaffecter un licencié dans une équipe spécifique
   */
  assignPlayerToTeam(licencieId: string, teamId: string | undefined): void {
    this.licencies.update((list) =>
      list.map((item) => {
        if (item.id === licencieId) {
          return { ...item, teamId: teamId || undefined };
        }
        return item;
      })
    );

    // Mettre également à jour la liste des joueurs dans l'équipe correspondante si applicable
    const updatedLicencie = this.licencies().find((l) => l.id === licencieId);
    if (!updatedLicencie) return;

    this.teams.update((teamList) =>
      teamList.map((t) => {
        let currentPlayers = t.players ? [...t.players] : [];
        // Si l'équipe est l'ancienne équipe, on retire le joueur
        currentPlayers = currentPlayers.filter((p) => p.id !== licencieId);

        // Si l'équipe est la nouvelle équipe assignée, on ajoute le joueur
        if (teamId && t.id === teamId) {
          currentPlayers.push({
            id: updatedLicencie.id,
            firstName: updatedLicencie.prenom,
            lastName: updatedLicencie.nom,
            position: updatedLicencie.positionPreferee || 'Joueur',
          });
        }

        return { ...t, players: currentPlayers };
      })
    );
  }

  /**
   * Mettre à jour les statuts de gestion de la licence (Validation, Paiement, Certificat, Pack)
   */
  updateLicencie(licencieId: string, updates: Partial<Licencie>): void {
    this.licencies.update((list) =>
      list.map((item) => (item.id === licencieId ? { ...item, ...updates } : item))
    );
  }

  /**
   * Ajouter un nouveau licencié au registre du club
   */
  addLicencie(newLicencie: Omit<Licencie, 'id' | 'numeroLicence' | 'dateInscription'>): void {
    const randomFff = Math.floor(2548900000 + Math.random() * 99999).toString();
    const newEntry: Licencie = {
      ...newLicencie,
      id: `lic-${Date.now()}`,
      numeroLicence: randomFff,
      dateInscription: new Date().toLocaleDateString('fr-FR'),
    };
    this.licencies.update((list) => [newEntry, ...list]);

    if (newEntry.teamId) {
      this.assignPlayerToTeam(newEntry.id, newEntry.teamId);
    }
  }

  // ==========================================
  // CONVOCATIONS OFFICIELLES (COACH & DIRECTION & ÉQUIPES)
  // ==========================================
  readonly convocations = signal<Convocation[]>([
    {
      id: 'conv-1',
      teamId: 'seniors-d3',
      teamName: 'Seniors - D3 District',
      matchDate: 'Dimanche 20 Septembre 2026',
      matchTime: '15h00',
      opponent: 'FC Maintenon 2',
      location: 'Stade Municipal de Bû',
      meetingTime: '13h45',
      meetingPlace: 'Vestiaires Stade de Bû',
      coachName: 'Didier VANDIER',
      coachPhone: '06 12 34 56 78',
      selectedPlayers: [
        'Thomas D.', 'Alexandre M.', 'Julien R.', 'Romain G.',
        'Mikael M.', 'Benjamin H.', 'Lucas B.', 'Kévin P.',
        'Nicolas H.', 'Dylan D.', 'Antoine V.', 'Clément F.',
        'Maxime T.', 'Mathieu L.'
      ],
      absentPlayers: ['Sylvain P. (Suspendu)', 'Frédéric B. (Blessé)'],
      notes: 'Maillots officiels adidas bleus. Prévoir protège-tibias obligatoires et gourde individuelle.',
      published: true,
    },
    {
      id: 'conv-2',
      teamId: 'u15-d3',
      teamName: 'U15 - D3 District (Foot à 11)',
      matchDate: 'Samedi 19 Septembre 2026',
      matchTime: '15h00',
      opponent: 'A.S. Nogent-le-Roi',
      location: 'Extérieur (Stade de Nogent)',
      meetingTime: '13h30',
      meetingPlace: "Parking Salle des Fêtes d'Abondant (Covoiturage)",
      coachName: 'Laurent MARIE LUCE',
      coachPhone: '06 23 45 67 89',
      selectedPlayers: [
        'Enzo B.', 'Mathéo D.', 'Nathan P.', 'Léo R.',
        'Hugo S.', 'Gabin V.', 'Jules T.', 'Sacha M.',
        'Valentin G.', 'Arthur C.', 'Raphaël L.', 'Noah K.',
        'Yanis H.', 'Maxence E.'
      ],
      absentPlayers: ['Paul N. (Raisons familiales)'],
      notes: 'Départ covoiturage impératif à 13h45. Pièces d\'identité ou licences dématérialisées Footclubs.',
      published: true,
    },
    {
      id: 'conv-3',
      teamId: 'u13-d1',
      teamName: 'U13 - D1 District (Foot à 8)',
      matchDate: 'Samedi 19 Septembre 2026',
      matchTime: '14h00',
      opponent: 'Amicale Épernon',
      location: 'Stade Municipal de Bû',
      meetingTime: '13h15',
      meetingPlace: 'Stade de Bû',
      coachName: 'Pierre MOMPO',
      coachPhone: '06 34 56 78 90',
      selectedPlayers: [
        'Loïs DUPONT', 'Arthur LEGRAND', 'Mathis MOREL', 'Noé BERNARD',
        'Lucas PETIT', 'Enzo GIRARD', 'Yanis ROUX', 'Gabin FOURNIER',
      ],
      absentPlayers: ['Tom R. (Blessé)', 'Evan M. (Non retenu)'],
      notes: 'Rendez-vous vestiaire 1. Buvette assurée par les parents bénévoles.',
      published: true,
    },
    {
      id: 'conv-4',
      teamId: 'veterans-d1',
      teamName: 'Vétérans 1 - D1 District',
      matchDate: 'Dimanche 20 Septembre 2026',
      matchTime: '10h00',
      opponent: 'FC Dreux Vétérans',
      location: "Stade d'Abondant",
      meetingTime: '09h00',
      meetingPlace: "Vestiaires d'Abondant",
      coachName: 'Agnès JUSTIN',
      coachPhone: '06 45 67 89 01',
      selectedPlayers: [
        'Kan Nam C.', 'Michel C.', 'Laurent D.', 'Guillaume B.',
        'Sébastien P.', 'David M.', 'Frédéric N.', 'Marc W.',
        'Matthieu V.', 'Vincent G.', 'Philippe B.', 'Franck G.'
      ],
      absentPlayers: [],
      notes: 'Collation d\'après-match conviviale offerte par le club.',
      published: true,
    },
  ]);

  /**
   * Enregistrer ou mettre à jour une convocation de match
   */
  saveConvocation(convocation: Convocation): void {
    this.convocations.update((list) => {
      const index = list.findIndex((c) => c.id === convocation.id);
      if (index >= 0) {
        const updated = [...list];
        updated[index] = convocation;
        return updated;
      }
      return [convocation, ...list];
    });
  }

  // ==========================================
  // STATISTIQUES & ÉVOLUTION DES JOUEURS (CDC COACH)
  // ==========================================
  readonly playerStats = signal<PlayerEvolutionStat[]>([
    {
      id: 'stat-p1',
      licencieId: 'p1',
      playerName: 'Loïs DUPONT',
      teamId: 'u13-d1',
      matchesPlayed: 4,
      minutesPlayed: 240,
      goals: 5,
      assists: 4,
      yellowCards: 0,
      trainingAttendancePct: 95,
      ratingProgression: 8.8,
      technicalScore: 9,
      tacticalScore: 8,
      physicalScore: 8,
      mindsetScore: 9,
      coachFeedback: 'Excellente vision de jeu et grand sens du collectif. Progression constante sur le pied gauche.',
      lastUpdated: '14/09/2026',
    },
    {
      id: 'stat-p2',
      licencieId: 'p2',
      playerName: 'Arthur LEGRAND',
      teamId: 'u13-d1',
      matchesPlayed: 4,
      minutesPlayed: 220,
      goals: 6,
      assists: 2,
      yellowCards: 0,
      trainingAttendancePct: 90,
      ratingProgression: 8.5,
      technicalScore: 8,
      tacticalScore: 8,
      physicalScore: 9,
      mindsetScore: 8,
      coachFeedback: 'Tranchant devant le but. Doit continuer à travailler son replacement défensif à la perte.',
      lastUpdated: '14/09/2026',
    },
    {
      id: 'stat-p3',
      licencieId: 'p3',
      playerName: 'Mathis MOREL',
      teamId: 'u13-d1',
      matchesPlayed: 4,
      minutesPlayed: 240,
      goals: 1,
      assists: 1,
      yellowCards: 1,
      trainingAttendancePct: 100,
      ratingProgression: 8.7,
      technicalScore: 8,
      tacticalScore: 9,
      physicalScore: 8,
      mindsetScore: 10,
      coachFeedback: 'Pilier défensif, très solide dans les duels aériens et exemplaire dans le leadership.',
      lastUpdated: '14/09/2026',
    },
    {
      id: 'stat-p4',
      licencieId: 'p4',
      playerName: 'Noé BERNARD',
      teamId: 'u13-d1',
      matchesPlayed: 4,
      minutesPlayed: 240,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      trainingAttendancePct: 95,
      ratingProgression: 8.4,
      technicalScore: 8,
      tacticalScore: 8,
      physicalScore: 8,
      mindsetScore: 9,
      coachFeedback: 'Très bons réflexes sur sa ligne. Progrès visibles sur les relances rapides au pied.',
      lastUpdated: '14/09/2026',
    },
    {
      id: 'stat-p5',
      licencieId: 'p5',
      playerName: 'Lucas PETIT',
      teamId: 'u13-d1',
      matchesPlayed: 3,
      minutesPlayed: 180,
      goals: 1,
      assists: 2,
      yellowCards: 0,
      trainingAttendancePct: 85,
      ratingProgression: 7.9,
      technicalScore: 7,
      tacticalScore: 8,
      physicalScore: 8,
      mindsetScore: 8,
      coachFeedback: 'Gros volume de jeu au milieu. Bon impact physique et belle régularité.',
      lastUpdated: '12/09/2026',
    },
    {
      id: 'stat-p6',
      licencieId: 'p6',
      playerName: 'Enzo GIRARD',
      teamId: 'u13-d1',
      matchesPlayed: 4,
      minutesPlayed: 210,
      goals: 4,
      assists: 1,
      yellowCards: 0,
      trainingAttendancePct: 90,
      ratingProgression: 8.2,
      technicalScore: 8,
      tacticalScore: 7,
      physicalScore: 9,
      mindsetScore: 8,
      coachFeedback: 'Attaquant puissant et généreux dans les efforts. Bonne entente avec les milieux.',
      lastUpdated: '14/09/2026',
    },
    {
      id: 'stat-lic-1',
      licencieId: 'lic-1',
      playerName: 'Antoine MARTIN',
      teamId: 'seniors-d3',
      matchesPlayed: 3,
      minutesPlayed: 270,
      goals: 2,
      assists: 1,
      yellowCards: 1,
      trainingAttendancePct: 88,
      ratingProgression: 8.0,
      technicalScore: 8,
      tacticalScore: 8,
      physicalScore: 8,
      mindsetScore: 8,
      coachFeedback: 'Très investi dans le projet de jeu Senior. Bonnes relances axiales.',
      lastUpdated: '14/09/2026',
    },
  ]);

  /**
   * Enregistrer ou mettre à jour les statistiques d'un joueur
   */
  savePlayerStats(stat: PlayerEvolutionStat): void {
    this.playerStats.update((list) => {
      const index = list.findIndex(
        (s) => s.id === stat.id || (s.licencieId && s.licencieId === stat.licencieId)
      );
      if (index >= 0) {
        const updated = [...list];
        updated[index] = { ...stat, lastUpdated: new Date().toLocaleDateString('fr-FR') };
        return updated;
      }
      return [
        { ...stat, id: `stat-${Date.now()}`, lastUpdated: new Date().toLocaleDateString('fr-FR') },
        ...list,
      ];
    });
  }

  /**
   * Récupérer les stats pour un joueur spécifique
   */
  getStatsForPlayer(licencieOrPlayerId: string, playerName?: string): PlayerEvolutionStat | undefined {
    return this.playerStats().find((s) => {
      if (s.licencieId === licencieOrPlayerId || s.id === licencieOrPlayerId) return true;
      if (playerName && s.playerName.toLowerCase() === playerName.toLowerCase()) return true;
      return false;
    });
  }
}

