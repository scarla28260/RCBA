import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'coach' | 'direction' | null;

export interface AuthUser {
  id: string;
  name: string;
  role: 'coach' | 'direction';
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Utilisateur actuellement connecté
  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isCoach = computed(() => this.currentUser()?.role === 'coach' || this.currentUser()?.role === 'direction');
  readonly isDirection = computed(() => this.currentUser()?.role === 'direction');

  // Comptes démo pré-configurés
  private readonly defaultAccounts = [
    {
      identifier: 'admin',
      password: 'rcba2026',
      user: { id: 'admin-master', name: 'Administrateur Général RCBA', role: 'direction' as const, email: 'admin@rcba.fr' },
    },
    {
      identifier: 'admin@rcba.fr',
      password: 'rcba2026',
      user: { id: 'admin-master', name: 'Administrateur Général RCBA', role: 'direction' as const, email: 'admin@rcba.fr' },
    },
    {
      identifier: 'coach@rcba.fr',
      password: 'coach',
      user: { id: 'coach-1', name: 'Éducateur / Coach RCBA', role: 'coach' as const, email: 'coach@rcba.fr' },
    },
    {
      identifier: 'coach',
      password: 'coach',
      user: { id: 'coach-1', name: 'Éducateur / Coach RCBA', role: 'coach' as const, email: 'coach@rcba.fr' },
    },
    {
      identifier: 'direction@rcba.fr',
      password: 'admin',
      user: { id: 'dir-1', name: 'Direction & Bureau RCBA', role: 'direction' as const, email: 'direction@rcba.fr' },
    },
    {
      identifier: 'direction',
      password: 'admin',
      user: { id: 'dir-1', name: 'Direction & Bureau RCBA', role: 'direction' as const, email: 'direction@rcba.fr' },
    },
    {
      identifier: 'admin',
      password: 'admin',
      user: { id: 'admin-master', name: 'Administrateur Général RCBA', role: 'direction' as const, email: 'admin@rcba.fr' },
    },
    {
      identifier: 'president',
      password: 'rcba',
      user: { id: 'pres-1', name: 'Marc WAROQUIER (Président)', role: 'direction' as const, email: 'president@rcba.fr' },
    }
  ];

  login(identifier: string, password: string): { success: boolean; message?: string; role?: UserRole } {
    const trimmedId = identifier.trim().toLowerCase();
    const match = this.defaultAccounts.find(
      (acc) => acc.identifier.toLowerCase() === trimmedId && acc.password === password
    );

    if (match) {
      this.currentUser.set(match.user);
      this.persistUser(match.user);
      return { success: true, role: match.user.role };
    }

    return {
      success: false,
      message: 'Identifiant ou mot de passe incorrect. Essayez les accès démo indiqués.',
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
}
