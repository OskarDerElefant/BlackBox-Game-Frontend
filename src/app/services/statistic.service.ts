import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {StatisticObject} from '../models/statistic.object';

/**
 * Service for getting statistics either for a specific user or the overall statistics.
 */

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) { }

  public getUserStatistic(user: User): Observable<StatisticObject> {
    return this.http.get<StatisticObject>('http://localhost:9000/');
  }

  public getGeneralStatistic(): Observable<any> {

    return null;
  }
}
