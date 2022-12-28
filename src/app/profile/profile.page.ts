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

  async updateUser() {
    // Check if any field has been touched to enable the update button
    const alert = await this.alertCtrl.create({
      header: 'Update Account',
      message: 'Are you sure you want to update your account?',
      buttons: [
        {
          text: 'Update',
          handler: () => {this.fb.updateCurrentUser();}
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }
      ]
    });
    alert.present();
    
  }

  async deleteUser() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.fb.deleteUserFromCollection();
            this.fb.deleteUserFromAuth();
            this.fb.logOut();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
      ]
    });
    alert.present();
  }

  logOut() {
    this.fb.logOut();
  }

}
