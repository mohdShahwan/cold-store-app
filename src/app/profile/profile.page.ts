import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService } from '../fb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public fb: FbService,
    private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
  }

  updateUser() {
    // Check if any field has been touched to enable the update button
    this.fb.updateCurrentUser();
  }

  async deleteUser() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete',
          handler: () => {
            this.fb.deleteUserFromCollection();
            this.fb.deleteUserFromAuth();
            this.fb.logOut();
          }
        }
      ]
    });
    alert.present();
  }

  logOut() {
    this.fb.logOut();
  }

}
