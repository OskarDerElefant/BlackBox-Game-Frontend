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
   * Läd zu jedem Spiel, welches ein Spieler gespielt hat, die Statistiken. Sortiert nach Szenario.
   */
  setPersonalStatistics() {
    const userID = Number(sessionStorage.getItem('userID'));

    this.personalDataSource = [];
    const statisticsOfFistScenario = [];
    const statisticsOfSecondScenario = [];
    this.statisticService.getUserStatistic(userID).subscribe(
      results => {
        results.forEach(statisticGameObject => {
          if(statisticGameObject.playedTime === null) {
            statisticGameObject.playedTime = 0;
          }
          if(statisticGameObject.gameID === null) {
            statisticGameObject.gameID = 0;
          }
          if (statisticGameObject.scenarioID === 0) {
            statisticsOfFistScenario.push(statisticGameObject);
          } else if (statisticGameObject.scenarioID === 1) {
            statisticsOfSecondScenario.push(statisticGameObject);
          }
        });
      }
    );
    this.personalDataSource = statisticsOfFistScenario;
    this.personalDataSource = this.personalDataSource.concat(statisticsOfSecondScenario);
  }

  /**
   * Setzt die generellen Statistiken.
   * Für jeden Nutzer gibt es jeweils einen Eintrag pro Szenario, wo alle Spiele eines Nutzers eines Szenarios zu einer Statistik zusammengeführt werden.
   */
  setGeneralStatistics() {
    this.generalDataSource = [];
    const statisticsOfFistScenario = [];
    const statisticsOfSecondScenario = [];
    this.statisticService.getGeneralStatistic().subscribe( results => {
      results.forEach(userStatisticObject => {
        console.log(userStatisticObject.scenarioID + ' ' + userStatisticObject.visitedNodes + ' STATOBJ');
        if (userStatisticObject.scenarioID === 0) {
          statisticsOfFistScenario.push(userStatisticObject);
        } else if (userStatisticObject.scenarioID === 1) {
          statisticsOfSecondScenario.push(userStatisticObject);
        }
      });
      this.generalDataSource = statisticsOfFistScenario;
      this.generalDataSource = this.generalDataSource.concat(statisticsOfSecondScenario);
    });
  }

}
