import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';

/**
 * Service for getting statistics either for a specific user or the overall statistics.
 */

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) { }

  public getUserStatistic(user: User): Observable<any> {
    return this.http.get('http://localhost:9000/');
  }

  public getStatistic(): Observable<any> {
    return null;
  }
}
