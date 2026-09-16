import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly clubService = inject(ClubService);

  readonly clubName = this.clubService.clubName;
  readonly shortName = this.clubService.shortName;
  readonly metrics = this.clubService.metrics;
  readonly recentResults = this.clubService.recentResults;
  readonly playerOfMonth = this.clubService.playerOfMonth;
  readonly coachOfMonth = this.clubService.coachOfMonth;
  readonly partners = this.clubService.partners;
  readonly clubHighlights = this.clubService.clubHighlights;
  readonly socialFeed = this.clubService.socialFeed;
}


