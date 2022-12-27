import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, Order } from 'src/app/fb.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  constructor(public alertCtrl:AlertController,public fb: FbService) { }

  showingOrders: Order[] = [];
  favorites: string = 'all';
  ngOnInit() {
    this.updateOrders();
  }

  orderAgain(order: Order){
    order.orderTimes++;
    this.fb.updateOrder(order);
    order.id = undefined;
    const alert = this.alertCtrl.create({
      header: 'Order Again',
      message: 'Are you sure you want to order this item again?',
      buttons: [
        {
          text: 'Order Again',
          handler: () => {
            this.fb.addOrder(order)
            .then(() => {
              this.fb.showToast('Order placed successfully', 'success');
            })
            .catch(err => {
              this.fb.showToast('Error placing order', 'danger');
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).then(alert => alert.present());
  }

  orderModal: boolean = false;
  currentOrder: Order = {} as Order;
  showOrderInfo(order: Order){
    this.orderModal = true;
    this.currentOrder = order;
  }
  closeOrderInfo(){
    this.orderModal = false;
    this.currentOrder = {} as Order;
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

  star: string = 'star-outline';
  toggleFavorite(order: Order){
    order.isFavorite = !order.isFavorite;
    this.fb.updateOrder(order);
  }

  updateOrders(){
    this.fb.orders.subscribe(orders => {
      this.showingOrders = orders
      .filter(order=>{
        if(this.favorites=='favorites')
          return order.isFavorite;
        else
          return true;
      });
      });
  }

  exportModal: boolean = false;
  importModal: boolean = false;
  exportJSON: string = "";
  importJSON: string = "";
  openExportModal(){
    this.exportModal = true;
    this.exportJSON = JSON.stringify(this.fb.allItems);
  }
  openImportModal(){
    this.importModal = true;
  }
  importItems(){
    try{
      let newItems = JSON.parse(this.importJSON);
      for(let item of newItems)
        this.fb.addItem(item);
      this.closeImportModal();
      this.fb.showToast("Items imported successfully", 'success');
    }catch(e){
      console.log(e);
      this.fb.showToast("Invalid JSON", 'danger');
    }
  }
  closeExportModal(){
    this.exportModal = false;
    this.exportJSON = '';
  }
  closeImportModal(){
    this.importModal = false;
    this.importJSON = '';
  }

  newOrder: Order = {} as Order;
  openOrderModal(){

  }
  addOrder(){
  }
  closeOrderModal(){

  }

}
