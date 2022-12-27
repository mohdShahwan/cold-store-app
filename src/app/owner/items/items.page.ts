import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FbService, StoreItem } from 'src/app/fb.service';
/*
,{"id":"CjzuGwZ3QDnWw1dzOCuO","price":0.1,"supplier":{"phone":"36983214","id":"KPm6Wj0aztO4VGrfDuNs","userType":"supplier","name":"Supplier ","email":"sup@gmail.com"},"name":"Bread"},{"id":"JiOlUwJXTXomU8jjfBwl","price":3,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"},"name":"KitKat"},{"id":"VXjDePaoSEmgkkkPhKiy","price":0.4,"supplier":{"id":"KPm6Wj0aztO4VGrfDuNs","userType":"supplier","email":"sup@gmail.com","name":"Supplier ","phone":"36983214"},"name":"Biscuit"},{"id":"hhq91av9aUUYIG4KtX3u","name":"Water","supplier":{"userType":"supplier","id":"KPm6Wj0aztO4VGrfDuNs","phone":"36983214","name":"Supplier ","email":"sup@gmail.com"},"price":1.25}]

[
  {"name":"item1","price":5.25,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"}},
  {"name":"item2","price":5.25,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"}},
  {"name":"item3","price":5.25,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"}},
  {"name":"item4","price":5.25,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"}},
  {"name":"item5","price":5.25,"supplier":{"userType":"supplier","email":"sup@gmail.com","phone":"36983214","name":"Supplier ","id":"KPm6Wj0aztO4VGrfDuNs"}},
}
*/
@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  filterTerm!: string;

  constructor(
    public fb: FbService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

  editStoreItem(item: StoreItem) {
    //this.fb.editStoreItem(item);
  }
  
  selectedItems: StoreItem[] = [];
  // Check if item is selected
  checkItem(sItem: StoreItem) {
    return this.selectedItems.filter(item => sItem == item).length > 0;
  }
  toggleItem(sItem: StoreItem) {
    // if the item is already selected, remove it from the array
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
      this.toggleItem(sItem);
    }
    this.selectedItems = [];
  }

  orderQuantity: number | undefined;
  orderPrice: number | undefined;
  orderMore(){

  }
}
