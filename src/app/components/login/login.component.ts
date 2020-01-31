import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  username: string = '';

  isRegisterdClicked = false;
  formGroup: FormGroup;


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(userService: UserService) { }

  ngOnInit() {
  }

  login() {
    let user = new User();
    user.email = this.email;
    user.password = this.password;
    //this.
  }

  selectRegister() {
    this.isRegisterdClicked = true;
  }

  register() {
    let user = new User();
    user.email = this.email;
    user.password = this.password;
    user.username = this.username;
  }
}
