import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FbService } from '../fb.service';

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
  filterTerm!: string;
  cart = [];
  items = [];
  cartItemcount = BehaviorSubject<number>;

  message = 'This modal example uses the modalController to present and dismiss modals.';
  animateCSS: any;

  constructor(public fb: FbService, private modalCtrl: ModalController) { }

  ngOnInit() {
   // this.items =this.fb.getProudect(); 
  }

  
  
}
