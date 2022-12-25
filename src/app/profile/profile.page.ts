import { Component, OnInit } from '@angular/core';
import { FbService } from '../fb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public fb: FbService) { }

  ngOnInit() {
  }

  updateUser() {
    // Check if any field has been touched to enable the update button
    this.fb.updateCurrentUser();
  }

  deleteUser() {
    this.fb.deleteUserFromCollection();
    this.fb.deleteUserFromAuth();
    this.fb.logOut();
  }

}
