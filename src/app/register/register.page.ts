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
    if(this.password1 == this.password2){
      this.fb.SignUp(this.email, this.password1).then(res => {
        this.fb.addUser({
          name: this.fName + ' ' + this.lName,
          email: this.email,
          phone: this.phone,
          userType: this.userType
        });
        this.fb.showToast('User created successfully', 'success');
      }).catch(err => {
        if(err.code == 'auth/email-already-in-use')
          this.fb.showToast('Email already in use', 'danger');
        else if(err.code == 'auth/invalid-email')
          this.fb.showToast('Invalid email', 'danger');
        else if(err.code == 'auth/weak-password')
          this.fb.showToast('Password too weak', 'danger');
        else
          this.fb.showToast(('Error: ' + err.code), 'danger');
      });
    }
  }

}
