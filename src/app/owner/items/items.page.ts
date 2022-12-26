import { Component, OnInit } from '@angular/core';
import { FbService, StoreItem } from 'src/app/fb.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  constructor(
    public fb: FbService,
  ) { }

  ngOnInit() {
  }

  editStoreItem(item: StoreItem) {
    //this.fb.editStoreItem(item);
  }
  
  selectedItems: StoreItem[] = [];
  checkItem(sItem: StoreItem) {
    return this.selectedItems.filter(item => sItem == item).length > 0;
  }
  toggleItem(sItem: StoreItem) {
    if (this.checkItem(sItem)) {
      this.selectedItems = this.selectedItems.filter(item => item != sItem);
    } else {
      this.selectedItems.push(sItem);
    }
  }

  currentStoreItem: StoreItem = {} as StoreItem;
  orderModal: boolean = false;
  openOrderModal(sItem: StoreItem){
    this.currentStoreItem = sItem;
    this.orderModal = true;
  }
  closeOrderModal(){
    this.orderModal = false;
    this.currentStoreItem = {} as StoreItem;
  }

  newThreshold: number = 0;
  updateSlots(){
    for(let sItem of this.selectedItems){
      sItem.threshold = this.newThreshold;
      this.fb.updateStoreItem(sItem);
    }
  }

  orderQuantity: number | undefined;
  orderPrice: number | undefined;
  orderMore(){

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
}
