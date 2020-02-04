import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {StatisticUserObject} from '../models/statistic.user.object';
import {StatisticGameObject} from '../models/statistic.game.object';

/**
 * Service for getting statistics either for a specific user or the overall statistics.
 */

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  url = 'http://localhost:9000/BlackboxWeb/';

  constructor(private http: HttpClient) { }

  public getUserStatistic(userID: number): Observable<StatisticGameObject[]> {
    const userStatisticUrl = this.url + 'getUserStatistics?';
    const params = 'userID=' + userID;
    return this.http.get<StatisticGameObject[]>(userStatisticUrl + params);
  }

  public getGeneralStatistic(): Observable<StatisticUserObject[]> {
    const generalStatisticUrl = this.url + 'getStatistics?';
    return this.http.get<StatisticUserObject[]>(generalStatisticUrl);
  }
}
