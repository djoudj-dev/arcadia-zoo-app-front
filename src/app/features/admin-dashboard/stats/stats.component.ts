// src/app/admin-dashboard/stats/stats.component.ts
import { Component, OnInit } from '@angular/core';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  constructor(public statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getStats();
  }
}
