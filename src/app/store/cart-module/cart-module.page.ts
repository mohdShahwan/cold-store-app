import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FbService, Item } from 'src/app/fb.service';

@Component({
  selector: 'app-cart-module',
  templateUrl: './cart-module.page.html',
  styleUrls: ['./cart-module.page.scss'],
})
export class CartModulePage implements OnInit {
  name: string | undefined;
  cart: Item[] = [];
  constructor(private modalCtrl: ModalController, private fb: FbService, public alertCtrl:AlertController) { }

  ngOnInit() {
    this.cart =this.fb.getCart()
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.quantity, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async checkout() {
    // Perfom PayPal or Stripe checkout process

    let alert = await this.alertCtrl.create({
      header: 'Thanks for your Order!',
      message: 'We will deliver your food as soon as possible',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.modalCtrl.dismiss();
    });
  }
}
