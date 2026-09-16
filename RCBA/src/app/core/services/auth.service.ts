import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'coach' | 'direction' | null;

export interface AuthUser {
  id: string;
  name: string;
  role: 'coach' | 'direction';
  email: string;
  phone?: string;
  assignedTeamId?: string; // ex: 'u13-d1', 'u15-d3', 'seniors-d3', 'veterans-d1'
  assignedTeamName?: string;
  accessGrantedBy?: string;
  active: boolean;
}

export interface UserAccountCredential {
  identifier: string;
  password: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Liste des comptes administrés par la Direction
  private readonly defaultAccounts: UserAccountCredential[] = [
    // === DIRECTION & GOUVERNANCE (Accès complet Direction & Coach) ===
    {
      identifier: 'admin',
      password: 'rcba2026',
      user: {
        id: 'admin-master',
        name: 'Direction Générale RCBA',
        role: 'direction',
        email: 'admin@rcba.fr',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },
    {
      identifier: 'president',
      password: 'rcba',
      user: {
        id: 'pres-1',
        name: 'Marc WAROQUIER (Président)',
        role: 'direction',
        email: 'president@rcba.fr',
        phone: '06 00 00 00 00',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },
    {
      identifier: 'direction',
      password: 'admin',
      user: {
        id: 'dir-1',
        name: 'Comité de Direction RCBA',
        role: 'direction',
        email: 'direction@rcba.fr',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },
    {
      identifier: 'secretaire',
      password: 'rcba',
      user: {
        id: 'sec-1',
        name: 'Vincent GODET (Secrétaire Général)',
        role: 'direction',
        email: 'secretaire@rcba.fr',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },

    // === ÉDUCATEURS & COACHS (Accès individuel nominatif par équipe) ===
    {
      identifier: 'quentin',
      password: 'coach',
      user: {
        id: 'coach-quentin',
        name: 'Quentin LE CORRE',
        role: 'coach',
        email: 'quentin@rcba.fr',
        phone: '06 69 05 18 83',
        assignedTeamId: 'u13-d1',
        assignedTeamName: 'U13 D1 & École de Foot',
        accessGrantedBy: 'Direction Technique',
        active: true,
      },
    },
    {
      identifier: 'lucas',
      password: 'coach',
      user: {
        id: 'coach-lucas',
        name: 'Lucas PETIT',
        role: 'coach',
        email: 'lucas@rcba.fr',
        phone: '06 64 08 64 93',
        assignedTeamId: 'u15-d3',
        assignedTeamName: 'U15 D3 (Foot à 11)',
        accessGrantedBy: 'Direction Technique',
        active: true,
      },
    },
    {
      identifier: 'matthieu',
      password: 'coach',
      user: {
        id: 'coach-matthieu',
        name: 'Matthieu VITY',
        role: 'coach',
        email: 'matthieu@rcba.fr',
        phone: '06 73 46 08 03',
        assignedTeamId: 'seniors-d3',
        assignedTeamName: 'Seniors D3',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },
    {
      identifier: 'guillaume',
      password: 'coach',
      user: {
        id: 'coach-guillaume',
        name: 'Guillaume BARBIER',
        role: 'coach',
        email: 'guillaume@rcba.fr',
        phone: '06 77 54 46 71',
        assignedTeamId: 'veterans-d1',
        assignedTeamName: 'Vétérans (D1 & D3)',
        accessGrantedBy: 'Bureau Directeur',
        active: true,
      },
    },
    {
      identifier: 'gregory',
      password: 'coach',
      user: {
        id: 'coach-gregory',
        name: 'Grégory MARGUERITAT',
        role: 'coach',
        email: 'gregory@rcba.fr',
        phone: '06 47 53 18 36',
        assignedTeamId: 'u13f-district',
        assignedTeamName: 'U13F Féminines',
        accessGrantedBy: 'Pôle Féminin',
        active: true,
      },
    },
    {
      identifier: 'manuel',
      password: 'coach',
      user: {
        id: 'coach-manuel',
        name: 'Manuel FERREIRA',
        role: 'coach',
        email: 'manuel@rcba.fr',
        phone: '06 60 69 05 80',
        assignedTeamId: 'seniors-f-loisir',
        assignedTeamName: 'Seniors Féminines Loisir',
        accessGrantedBy: 'Pôle Féminin',
        active: true,
      },
    },
    {
      identifier: 'coach',
      password: 'coach',
      user: {
        id: 'coach-generic',
        name: 'Éducateur RCBA (Générique)',
        role: 'coach',
        email: 'coach@rcba.fr',
        assignedTeamId: 'all',
        assignedTeamName: 'Toutes Équipes Jeunes & Seniors',
        accessGrantedBy: 'Direction Technique',
        active: true,
      },
    },
  ];

  readonly accountsList = signal<UserAccountCredential[]>(this.getStoredAccounts());

  // Utilisateur actuellement connecté
  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isCoach = computed(() => this.currentUser()?.role === 'coach' || this.currentUser()?.role === 'direction');
  readonly isDirection = computed(() => this.currentUser()?.role === 'direction');

  login(identifier: string, password: string): { success: boolean; message?: string; role?: UserRole; user?: AuthUser } {
    const trimmedId = identifier.trim().toLowerCase();
    const match = this.accountsList().find(
      (acc) => (acc.identifier.toLowerCase() === trimmedId || acc.user.email.toLowerCase() === trimmedId) && acc.password === password
    );

    if (match) {
      if (!match.user.active) {
        return {
          success: false,
          message: 'Ce compte a été suspendu par la Direction du club. Veuillez contacter le secrétariat.',
        };
      }
      this.currentUser.set(match.user);
      this.persistUser(match.user);
      return { success: true, role: match.user.role, user: match.user };
    }

    return {
      success: false,
      message: 'Identifiant ou mot de passe incorrect. Vérifiez vos accès ou rapprochez-vous de la direction.',
    };
  }

  logout(): void {
    this.currentUser.set(null);
    try {
      localStorage.removeItem('rcba_auth_user');
    } catch {
      // Ignorer si localStorage indisponible
    }
  }

  // === Gestion des accès par la Direction ===
  grantAccount(account: UserAccountCredential): void {
    this.accountsList.update((list) => {
      const idx = list.findIndex((a) => a.identifier.toLowerCase() === account.identifier.toLowerCase());
      if (idx >= 0) {
        const updated = [...list];
        updated[idx] = account;
        return updated;
      }
      return [account, ...list];
    });
    this.persistAccounts();
  }

  toggleAccountStatus(identifier: string): void {
    this.accountsList.update((list) =>
      list.map((acc) => {
        if (acc.identifier.toLowerCase() === identifier.toLowerCase()) {
          return {
            ...acc,
            user: { ...acc.user, active: !acc.user.active },
          };
        }
        return acc;
      })
    );
    this.persistAccounts();
  }

  private persistUser(user: AuthUser): void {
    try {
      localStorage.setItem('rcba_auth_user', JSON.stringify(user));
    } catch {
      // Ignorer
    }
  }

  private getStoredUser(): AuthUser | null {
    try {
      const data = localStorage.getItem('rcba_auth_user');
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignorer
    }
    return null;
  }

  private persistAccounts(): void {
    try {
      localStorage.setItem('rcba_accounts_registry', JSON.stringify(this.accountsList()));
    } catch {
      // Ignorer
    }
  }

  private getStoredAccounts(): UserAccountCredential[] {
    try {
      const data = localStorage.getItem('rcba_accounts_registry');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignorer
    }
    return this.defaultAccounts;
  }
}
