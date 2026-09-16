import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly variant = input<'primary' | 'success' | 'warning' | 'muted'>('primary');
}
