import { Component, inject } from '@angular/core';
import { ClubService } from '../../core/services/club.service';

@Component({
  selector: 'app-installations',
  standalone: true,
  templateUrl: './installations.component.html',
  styleUrl: './installations.component.css',
})
export class InstallationsComponent {
  private readonly clubService = inject(ClubService);

  readonly installations = this.clubService.installations;
}
