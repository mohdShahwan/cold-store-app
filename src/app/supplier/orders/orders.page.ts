import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, Order } from 'src/app/fb.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  constructor(
    public fb: FbService,
    private alertCtrl: AlertController
  ) { }

  seg: string = 'pending';
  pendingOrders: Order[] = [];
  ordersHistory: Order[] = [];
  ngOnInit() {
    this.fb.orders.subscribe(orders => {
      this.pendingOrders = orders.filter(order => order.status == 'pending' && order.items[0].supplier.email == this.fb.currentUser.email);
      this.ordersHistory = orders.filter(order => order.status == 'delivered' && order.items[0].supplier.email == this.fb.currentUser.email);
    });
  }

  confirmDelivery(order: Order){
    const alert = this.alertCtrl.create({
      header: 'Confirm Delivery',
      message: 'Are you sure you have delivered this order?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {this.markAsDelivered(order);}
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).then(alert => alert.present());
  }

  markAsDelivered(order: Order){
    order.status = 'delivered';
    this.fb.updateOrder(order);
    // add items to the store if they are not already there, if they are, update the quantity
    order.items.forEach(item => {
      let storeItem = this.fb.allStoreItems.filter(item2 => item2.item.name == item.name)[0];
      storeItem.quantity += item.itemsPerCartoon * (item.noOfCartoons? item.noOfCartoons : 1);
      if (storeItem)
        this.fb.updateStoreItem(storeItem);
      else
        this.fb.addStoreItem(storeItem);
    }
    );
  }

  getStatusColor(color: string){
    switch(color){
      case 'pending':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return 'primary';
    }
  }

}
