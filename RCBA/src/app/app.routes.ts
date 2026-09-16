import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'club',
        loadComponent: () =>
          import('./features/club/club.component').then((m) => m.ClubComponent),
      },
      {
        path: 'equipes',
        loadComponent: () =>
          import('./features/equipes/equipes.component').then((m) => m.EquipesComponent),
      },
      {
        path: 'equipes/:id',
        loadComponent: () =>
          import('./features/equipes/equipe-detail/equipe-detail.component').then(
            (m) => m.EquipeDetailComponent
          ),
      },
      {
        path: 'installations',
        loadComponent: () =>
          import('./features/installations/installations.component').then(
            (m) => m.InstallationsComponent
          ),
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./features/agenda/agenda.component').then((m) => m.AgendaComponent),
      },
      {
        path: 'inscriptions',
        loadComponent: () =>
          import('./features/inscriptions/inscriptions.component').then(
            (m) => m.InscriptionsComponent
          ),
      },
      {
        path: 'boutique',
        loadComponent: () =>
          import('./features/boutique/boutique.component').then(
            (m) => m.BoutiqueComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'connexion',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'educateurs',
        loadComponent: () =>
          import('./features/educateurs/educateurs.component').then(
            (m) => m.EducateursComponent
          ),
      },
      {
        path: 'portail-coach',
        redirectTo: 'educateurs',
        pathMatch: 'full',
      },
      {
        path: 'direction',
        loadComponent: () =>
          import('./features/direction/direction.component').then(
            (m) => m.DirectionComponent
          ),
      },
      {
        path: 'portail-direction',
        redirectTo: 'direction',
        pathMatch: 'full',
      },
      {
        path: 'dirigeants',
        loadComponent: () =>
          import('./features/dirigeants/dirigeants.component').then(
            (m) => m.DirigeantsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
