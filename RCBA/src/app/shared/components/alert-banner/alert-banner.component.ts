import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../../core/services/club.service';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.css',
})
export class AlertBannerComponent {
  private readonly clubService = inject(ClubService);

  readonly alert = this.clubService.activeAlert;

  dismiss(): void {
    this.clubService.dismissAlert();
  }
}
