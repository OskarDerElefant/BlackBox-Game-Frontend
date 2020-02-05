import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Router} from '@angular/router';

/**
 * Service for managing users.
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:9000/BlackboxWeb/';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Gibt true zurück, wenn Login erfolgreich war.
   * @param user
   * User, der sich anmelden möchte.
   */
  public login(user: User): Observable<User> {
    const loginUrl = this.url + 'login?';

    let objectString = JSON.stringify(user);
    objectString = btoa(objectString);

    return this.http.get<User>(loginUrl + objectString);
  }

  /**
   * Die lokal gespeicherten Werte des Nutzers werden gelöscht.
   */
  public logout() {
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('allMessages');
    this.router.navigate(['login']);
  }

  /**
   * Gibt true zurück, wenn Registrierung erfolgreich war.
   * @param user
   * User, der sich registrieren möchte.
   */
  public registerUser(user: User): Observable<any> {
    const registerUrl = this.url + 'register?';

    let objectString = JSON.stringify(user);
    objectString = btoa(objectString);

    return this.http.get<User>(registerUrl + objectString);
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    console.log(user);
    return !(user === null);
  }
}
