import { Component, OnInit } from '@angular/core';
import { FbService } from '../fb.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

constructor(private fb: FbService) { }

  ngOnInit() {
  }

  fName: string = '';
  lName: string = '';
  email: string = '';
  phone: string = '';
  password1: string = '';
  password2: string = '';
  userType: string = '';
  
  registerUser(){
    /* Form validation here */

    let newUser = {
      name: this.fName + ' ' + this.lName,
      email: this.email,
      phone: this.phone,
      userType: this.userType
    }
    if(this.password1 == this.password2){
      this.fb.register(newUser, this.email, this.password1)
      .then(res => {
        this.fb.showToast(`${newUser.name} registered successfully`, 'success');
        this.fb.logIn(this.email, this.password1);
      })
    }
  }

}
