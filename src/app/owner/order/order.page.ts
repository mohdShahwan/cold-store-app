import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService } from 'src/app/fb.service';

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

}
