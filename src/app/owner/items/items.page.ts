import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, Item, Order, User } from 'src/app/fb.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})

export class ItemsPage implements OnInit {

  filterTerm!: string;
  // ionicForm!: FormGroup;
  formBuilder: any;
  isSubmitted = false;

  constructor(
    // public foemBuilder: FormBuilder,
    public fb: FbService,
    private alertCtrl: AlertController,
  ) { }

  showingItems: Item[] = [];
  ngOnInit() {
    this.fb.items.subscribe(items => {
      this.showingItems = items;
      this.showingItems.filter(item => item.supplier == this.selectedSup);
    });

    // this.ionicForm = this.formBuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(2)]],
    //   email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    //   mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    //   password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
    // })
  }
  // get errorControl() {
  //   return this.ionicForm.controls;
  // }
  submitFor()
  {

  }
  // submitForm() {
  //   this.isSubmitted = true;
  //   if (!this.ionicForm.valid) {
  //     console.log('Please provide all the required values!')
  //     return false;
  //   } else {
  //     console.log(this.ionicForm.value)
  //   }
  // }


  editStoreItem(item: Item) {
    //this.fb.editStoreItem(item);
  }
  
  selectedItems: Item[] = [];
  // Check if item is selected
  checkItem(item1: Item) {
    return this.selectedItems.filter(item => item == item1).length > 0;
  }
  // Add or remove item from selectedItems
  toggleItem(item1: Item) {
    // If item is selected, remove it from selectedItems
    if (this.checkItem(item1))
      this.selectedItems = this.selectedItems.filter(item => item != item1);
    // If item is not selected, add it to selectedItems
    else{
      item1.noOfCartoons = 1;
      this.selectedItems.push(item1);
    }
  }


  selectedSup: User = {} as User;
  newOrder: Order = {} as Order;
  orderModal: boolean = false;
  total: number = 0;
  openOrderModal(){
    this.orderModal = true;
    this.updateTotal();
  }
  confirmOrder(){
    this.alertCtrl.create({
      header: 'Confirm Order',
      message: 'Are you sure you want to order these items?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {this.order();}
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }
  order(){
    let order: Order = {
      date: new Date().toString(),
      items: this.selectedItems,
      total: this.total,
      status: 'pending',
      isFavorite: false,
      orderTimes: 1,
    }
    this.fb.addOrder(order)
    .then(() => {
      this.fb.showToast('Order placed successfully', 'success');
    })
    .catch(err => {
      this.fb.showToast('Error placing order', 'danger');
    });
    this.selectedSup = {} as User
    this.selectedItems = [];
    this.closeOrderModal();
  }
  updateTotal(){
    this.total=0;
    this.selectedItems.forEach(item => {
      this.total += item.price * (item.noOfCartoons? item.noOfCartoons : 1);
    });
  }
  closeOrderModal(){
    this.orderModal = false;
  }


  //form validation 

}
