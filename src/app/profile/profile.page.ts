import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService } from '../fb.service';
import { Chart } from 'chart.js';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('barCanvas') private barCanvas: ElementRef = new ElementRef(null);
  barChart: any;
  productNames: string[] = [];
  productQuantities: number[] = [];


  constructor(
    public fb: FbService,
    private alertCtrl: AlertController,
  ) {
    this.productNames = this.fb.allItems.map((item) => item.name);
    this.productQuantities = this.fb.allItems.map((item) => item.noOfCartoons as number * item.itemsPerCartoon as number);
    console.log(this.productQuantities);

  }

  ngOnInit() {
  }

<<<<<<< HEAD
  ngAfterViewInit() {
    this.barChartMethod();
  }

  updateUser() {
=======
  async updateUser() {
>>>>>>> UI
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

  // Chart code
  barChartMethod() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.productNames,
        datasets: [{
          label: 'Number of Products',
          data: this.productQuantities,
          backgroundColor: [
            'rgba(141,198,217,0.69)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(22,255,255,0.4)',
            'rgba(12,16,229,0.37)',
            'rgba(206,16,204,0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxis: {
            beginAtZero: true,
          }
        }


      }
    });
  }
}
