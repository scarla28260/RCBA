import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  identifier = '';
  password = '';
  errorMessage = signal<string>('');
  selectedPortal = signal<'coach' | 'direction'>('coach');

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['target'] === 'direction') {
        this.selectedPortal.set('direction');
        this.identifier = 'direction';
        this.password = 'admin';
      } else {
        this.selectedPortal.set('coach');
        this.identifier = 'coach';
        this.password = 'coach';
      }
    });
  }

  selectPortal(portal: 'coach' | 'direction') {
    this.selectedPortal.set(portal);
    this.errorMessage.set('');
    if (portal === 'coach') {
      this.identifier = 'coach';
      this.password = 'coach';
    } else {
      this.identifier = 'admin';
      this.password = 'rcba2026';
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (!this.identifier || !this.password) {
      this.errorMessage.set('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    const res = this.authService.login(this.identifier, this.password);
    if (res.success) {
      if (res.role === 'direction' || this.selectedPortal() === 'direction') {
        this.router.navigate(['/direction']);
      } else {
        this.router.navigate(['/educateurs']);
      }
    } else {
      this.errorMessage.set(res.message || 'Identifiant ou mot de passe invalide.');
    }
  }

  fillSpecificAccount(identifier: string, password: string, portal: 'coach' | 'direction'): void {
    this.selectedPortal.set(portal);
    this.identifier = identifier;
    this.password = password;
    this.errorMessage.set('');
    this.onSubmit();
  }

  fillQuickAccount(role: 'coach' | 'direction') {
    if (role === 'coach') {
      this.selectedPortal.set('coach');
      this.identifier = 'coach';
      this.password = 'coach';
    } else {
      this.selectedPortal.set('direction');
      this.identifier = 'admin';
      this.password = 'rcba2026';
    }
    this.onSubmit();
  }
}
