import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly clubService = inject(ClubService);

  readonly clubName = this.clubService.clubName;
  readonly shortName = this.clubService.shortName;
  readonly partners = this.clubService.partners;
  readonly currentYear = signal<number>(new Date().getFullYear());
}
