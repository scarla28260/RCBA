import { Component } from '@angular/core';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './inscriptions.component.html',
  styleUrl: './inscriptions.component.css',
})
export class InscriptionsComponent {}
