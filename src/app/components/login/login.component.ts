import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {StoryService} from '../../services/story.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  username = '';

  isRegisterdClicked = false;

  constructor(private userService: UserService, private storyService: StoryService, private router: Router) {
  }

  ngOnInit() {
  }

  /**
   * User wird eingeloggt. UserID und unsername werden im session storage gespeichert.
   * Wenn User eingeloggt ist wird geprüft, ob er noch ein offenes Spiel hat.
   * Wenn er ein offenes Spiel hat, wird er direkt zum Chat weitergeleitet.
   * Wenn er kein offenes Spiel hat, wird er zum Menü weitergeleitet.
   */
  login() {
    const user = new User();
    user.email = this.email;
    user.password = this.password;
    this.userService.login(user).subscribe(result => {
      console.log(result);
      if (result.username !== 'null') {
        sessionStorage.setItem('userID', String(result.userID));
        sessionStorage.setItem('username', result.username);
        this.storyService.restartCurrentGame(Number(result.userID)).subscribe( hasGame => {
          console.log(hasGame);
          if(hasGame) {
            this.router.navigate(['/chat']);
          } else {
            this.router.navigate(['']);
          }
        });
      }
    });
  }

  /**
   * Nutzer wird registriert und gleichzeitig eingeloggt.
   */
  register() {
    const user = new User();
    user.email = this.email;
    user.password = this.password;
    user.username = this.username;
    this.userService.registerUser(user).subscribe(result => {
      console.log(result);
      if (result.username !== 'null') {
        sessionStorage.setItem('userID', String(result.userID));
        sessionStorage.setItem('username', result.username);
        this.storyService.restartCurrentGame(Number(result.userID)).subscribe(hasGame => {
          if (hasGame) {
            this.router.navigate(['/chat']);
          } else {
            this.router.navigate(['']);
          }
        });
      }
    });
  }

  /**
   * Wenn der Nutzer sich registrieren möchte wird durch das Setzen der Variable auf true die Möglichkeit freigeschaltet.
   */
  selectRegister() {
    this.isRegisterdClicked = true;
  }
}
