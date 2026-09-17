// =========================================================================
// RÔLES OFFICIELS RCBA (RBAC STRICT)
// =========================================================================
export enum Role {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  RESPONSABLE_SPORTIF = 'RESPONSABLE_SPORTIF',
  RESPONSABLE_CATEGORIE = 'RESPONSABLE_CATEGORIE',
  EDUCATEUR = 'EDUCATEUR',
  DIRIGEANT = 'DIRIGEANT',
}

// =========================================================================
// RESSOURCES PÉDAGOGIQUES
// =========================================================================
export enum DocumentCategory {
  CHARTE = 'CHARTE',
  FORMULAIRE = 'FORMULAIRE',
  REGLEMENT = 'REGLEMENT',
  CONVOCATION_TEMPLATE = 'CONVOCATION_TEMPLATE',
  GUIDE_PEDAGOGIQUE = 'GUIDE_PEDAGOGIQUE',
}

export enum AgeCategory {
  U6_U7 = 'U6_U7',
  U8_U9 = 'U8_U9',
  U10_U11 = 'U10_U11',
  U12_U13 = 'U12_U13',
  U14_U15 = 'U14_U15',
  U16_U18 = 'U16_U18',
  SENIORS = 'SENIORS',
  VETERANS = 'VETERANS',
}

export enum ExerciseTheme {
  ECHAUFFEMENT = 'ECHAUFFEMENT',
  MOTRICITE_COORDINATION = 'MOTRICITE_COORDINATION',
  CONSERVATION_PROGRESSION = 'CONSERVATION_PROGRESSION',
  FINITION_FRAPPE = 'FINITION_FRAPPE',
  TRANSITION_OFF_DEF = 'TRANSITION_OFF_DEF',
  TRANSITION_DEF_OFF = 'TRANSITION_DEF_OFF',
  DUEL_1V1 = 'DUEL_1V1',
  TACTIQUE_DEFENSIVE = 'TACTIQUE_DEFENSIVE',
  TACTIQUE_OFFENSIVE = 'TACTIQUE_OFFENSIVE',
  GARDIEN_DE_BUT = 'GARDIEN_DE_BUT',
}

// =========================================================================
// CRÉATEUR DE SÉANCES
// =========================================================================
export enum BlockType {
  ACCUEIL = 'ACCUEIL',
  ECHAUFFEMENT = 'ECHAUFFEMENT',
  EXERCICE_TECHNIQUE = 'EXERCICE_TECHNIQUE',
  SITUATION_TACTIQUE = 'SITUATION_TACTIQUE',
  JEU = 'JEU',
  RETOUR_AU_CALME = 'RETOUR_AU_CALME',
  BILAN = 'BILAN',
}

export enum SessionStatus {
  BROUILLON = 'BROUILLON',
  SOUMIS = 'SOUMIS',
  VALIDE = 'VALIDE',
  ARCHIVE = 'ARCHIVE',
}

// =========================================================================
// BOUTIQUE E-COMMERCE
// =========================================================================
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
}
