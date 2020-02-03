import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';

/**
 * Service for managing users.
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:8090/api/user/';

  constructor(private http: HttpClient) { }

  /**
   * Gibt true zurück, wenn Login erfolgreich war.
   * @param user
   * User, der sich anmelden möchte.
   */
  public login(user: User) {
    const loginUrl = this.url + 'login';
    let succesfullLogin;
    sessionStorage.setItem('email', user.email);
    /*this.http.get<boolean>(loginUrl).subscribe(
      data => {
        succesfullLogin = data;
        if(succesfullLogin) {
          sessionStorage.setItem('email', user.email);
          return true;
        } else {
          return false;
        }
      }
    );*/
  }

  /**
   * Gibt true zurück, wenn Logout erfolgreich war.
   * @param user
   * User, der sich abmelden möchte.
   */
  public logout(user: User) {
    const logoutUrl = this.url + 'logout';
    let succesfullLogout;
    sessionStorage.removeItem('email');
    /*this.http.get<boolean>(logoutUrl).subscribe(
      data => {
        succesfullLogout = data;
        if(succesfullLogout) {
          sessionStorage.removeItem('email');
          return true;
        } else {
          return false;
        }
      }
    );*/
  }

  /**
   * Gibt true zurück, wenn Registrierung erfolgreich war.
   * @param user
   * User, der sich registrieren möchte.
   */
  public registerUser(user: User) {
    const registerUrl = this.url + 'registerUser';
    let succesfullregisterd;
    this.http.get<boolean>(registerUrl).subscribe(
      data => {
        succesfullregisterd = data;
        if(succesfullregisterd) {
          sessionStorage.setItem('email', user.email);
          return true;
        } else {
          return false;
        }
      }
    );
  }
}
