import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { AuthService } from '../../core/services/auth.service';
import { NavLink } from '../../core/models/club.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly clubService = inject(ClubService);
  readonly authService = inject(AuthService);

  readonly clubName = this.clubService.clubName;
  readonly shortName = this.clubService.shortName;
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly navLinks = signal<NavLink[]>([
    { label: 'ACCUEIL', path: '/', exact: true },
    { label: 'LE CLUB', path: '/club' },
    { label: 'DIRIGEANTS', path: '/dirigeants' },
    { label: 'ÉQUIPES', path: '/equipes' },
    { label: 'CALENDRIER & RÉSULTATS', path: '/agenda' },
    { label: 'INSTALLATIONS', path: '/installations' },
    { label: 'INSCRIPTIONS', path: '/inscriptions' },
    { label: 'BOUTIQUE', path: '/boutique' },
    { label: 'CONTACT', path: '/contact' },
  ]);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
