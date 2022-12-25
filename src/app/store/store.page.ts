import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FbService } from '../fb.service';
import { CartModulePage } from './cart-module/cart-module.page';

/*export interface Product {
  id:     number;
  name:   string;
  price:  number;
  amount: number;
}*/

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
  
  cart = [];
  items = [];
  cartItemcount = BehaviorSubject<number>;

  message = 'This modal example uses the modalController to present and dismiss modals.';

  constructor(private fb: FbService, private modalCtrl: ModalController) { }

  ngOnInit() {
   // this.items =this.fb.getProudect(); 
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CartModulePage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
  
}
