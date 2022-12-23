import { Component, OnInit } from '@angular/core';
import { FbService } from '../fb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public fb: FbService) { }

  ngOnInit() {
  }

  email: string = '';
  password: string = '';

  loginUser(){
    /* Form validation here */
    this.fb.logIn(this.email, this.password);
  }

}
