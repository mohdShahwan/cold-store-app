import { Component, OnInit } from '@angular/core';
import { FbService } from 'src/app/fb.service';

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

}
