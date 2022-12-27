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

  ngOnInit() {
  }

  slecte()
  {
      alert("Order slected")
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
  orderModal: boolean = false;
  openOrderModal(){

  }
  addOrder(){
  }
  closeOrderModal(){

  }

}
