import { Component, OnInit } from '@angular/core';
import { FbService, Slot } from 'src/app/fb.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(
    public fb: FbService,
  ) { }

  slots: Slot[] = [];
  ngOnInit() {
    this.fb.slots.subscribe(slots => {
      this.slots = slots.filter(slot => slot.employee.email == this.fb.currentUser.email);
    });
  }



}
