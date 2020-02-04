import { Component, OnInit } from '@angular/core';
import {StatisticService} from '../../services/statistic.service';
import {StatisticUserObject} from '../../models/statistic.user.object';

/**
 * Component für Statistikseite. Läd generelle und userbezogene Statistiken.
 */

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  displayedColumns: string[] = ['story', 'playedTime', 'visitedNodes', 'numberOfGames'];
  personalDataSource = [];
  generalDataSource = [];

  constructor(private statisticService: StatisticService) { }

  /**
   * Läd sofort die relevanten Statistiken.
   */
  ngOnInit() {
    this.setPersonalStatistics();
    this.setGeneralStatistics();
  }

  /**
   * Setzt die persönlichen Statistiken.
   */
  setPersonalStatistics() {
    const userID = Number(sessionStorage.getItem('userID'));
    this.statisticService.getUserStatistic(userID).subscribe(
      data => {
        this.personalDataSource = data;
      }
    );
    let s = new StatisticUserObject();
    s.numberOfGames = 1;
    s.playedTime= 10;
    s.userID = 10;
    s.visitedNodes = 20;
    s.timeUnit = 'Minuten';
    this.personalDataSource = [];
    this.personalDataSource.push(s);
  }

  /**
   * Setzt die generellen Statistiken.
   */
  setGeneralStatistics() {
    let s = new StatisticUserObject();
    s.numberOfGames = 1;
    s.playedTime = 10;
    s.userID = 10;
    s.visitedNodes = 20;
    s.timeUnit = 'Minuten';
    this.generalDataSource = [];
    this.generalDataSource.push(s);

  }

}
