import { Component, OnInit } from '@angular/core';
import {StatisticService} from '../../services/statistic.service';
import {StatisticUserObject} from '../../models/statistic.user.object';
import {StatisticGameObject} from '../../models/statistic.game.object';

/**
 * Component für Statistikseite. Läd generelle und userbezogene Statistiken.
 */

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  displayedColumns: string[] = ['story', 'userID', 'playedTime', 'visitedNodes', 'numberOfGames'];
  personalDataSource = [];
  generalDataSource = [];
  amountOfPlayers = 2;

  constructor(private statisticService: StatisticService) { }

  /**
   * Läd sofort die relevanten Statistiken.
   */
  ngOnInit() {
    this.generateTestData();
    /*this.setPersonalStatistics();
    this.setGeneralStatistics();*/
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
      console.log(results);
      results.forEach(userStatisticObject => {
        console.log(userStatisticObject.scenarioID + ' ' + userStatisticObject.visitedNodes + ' ' + userStatisticObject.userID + ' ' + userStatisticObject.numberOfGames + ' STATOBJ');
        if (userStatisticObject.scenarioID === 0) {
          userStatisticObject.scenarioName = 'Mord in der Zukunft';
          statisticsOfFistScenario.push(userStatisticObject);
        } else if (userStatisticObject.scenarioID === 1) {
          userStatisticObject.scenarioName = 'Der verlorene Schatz';
          statisticsOfSecondScenario.push(userStatisticObject);
        }
      });
      this.generalDataSource = statisticsOfFistScenario;
      this.generalDataSource = this.generalDataSource.concat(statisticsOfSecondScenario);
    });
  }

  generateTestData() {
    let userStatisticObject = new StatisticUserObject();
    userStatisticObject.userID = 0;
    userStatisticObject.numberOfGames = 4;
    userStatisticObject.visitedNodes = 18;
    userStatisticObject.scenarioName = 'Mord in der Zukunft';
    userStatisticObject.playedTime = 20;
    userStatisticObject.timeUnit = 'Minuten';
    this.generalDataSource.push(userStatisticObject);
    let userStatisticObject2 = new StatisticUserObject();
    userStatisticObject2.userID = 1;
    userStatisticObject2.numberOfGames = 2;
    userStatisticObject2.visitedNodes = 10;
    userStatisticObject2.scenarioName = 'Der verlorene Schatz';
    userStatisticObject2.playedTime = 5;
    userStatisticObject2.timeUnit = 'Minuten';
    this.generalDataSource.push(userStatisticObject2);

    let statistiGameObject = new StatisticGameObject();
    statistiGameObject.userID = 0;
    statistiGameObject.visitedNodes = 10;
    statistiGameObject.gameID = 1;
    statistiGameObject.scenarioName = 'Mord in der Zukunft';
    statistiGameObject.playedTime = 10;
    statistiGameObject.timeUnit = 'Minuten';
    this.personalDataSource.push(statistiGameObject);

    let statistiGameObject2 = new StatisticGameObject();
    statistiGameObject2.userID = 0;
    statistiGameObject2.visitedNodes = 5;
    statistiGameObject2.gameID = 2;
    statistiGameObject2.scenarioName = 'Der verlorene Schatz';
    statistiGameObject2.playedTime = 2;
    statistiGameObject2.timeUnit = 'Minuten';
    this.personalDataSource.push(statistiGameObject2);

    let statistiGameObject3 = new StatisticGameObject();
    statistiGameObject3.userID = 1;
    statistiGameObject3.visitedNodes = 5;
    statistiGameObject3.gameID = 3;
    statistiGameObject3.scenarioName = 'Der verlorene Schatz';
    statistiGameObject3.playedTime = 3;
    statistiGameObject3.timeUnit = 'Minuten';
    this.personalDataSource.push(statistiGameObject3);

    let statistiGameObject4 = new StatisticGameObject();
    statistiGameObject4.userID = 1;
    statistiGameObject4.visitedNodes = 8;
    statistiGameObject4.gameID = 4;
    statistiGameObject4.scenarioName = 'Mord in der Zukunft';
    statistiGameObject4.playedTime = 10;
    statistiGameObject4.timeUnit = 'Minuten';
    this.personalDataSource.push(statistiGameObject4);
  }

}
