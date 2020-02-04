import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {StatisticUserObject} from '../models/statistic.user.object';

/**
 * Service for getting statistics either for a specific user or the overall statistics.
 */

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  url = 'http://localhost:9000/';

  constructor(private http: HttpClient) { }

  public getUserStatistic(userID: number): Observable<any> {
    const userStatisticUrl = this.url + 'getUserStatistics?';
    return this.http.get<any>(userStatisticUrl + userID);
  }

  public getGeneralStatistic(): Observable<any> {
    const generalStatisticUrl = this.url + 'getStatistics?';
    return this.http.get<any>(generalStatisticUrl);
  }
}
