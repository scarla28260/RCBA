import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { Hero3DComponent } from '../../shared/components/hero-3d/hero-3d.component';
import { BentoIllustrationComponent } from '../../shared/components/bento-illustration/bento-illustration.component';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    Hero3DComponent,
    BentoIllustrationComponent,
    ScrollAnimateDirective,
  ],
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


