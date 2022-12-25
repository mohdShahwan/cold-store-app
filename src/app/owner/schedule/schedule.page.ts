import { Component, OnInit } from '@angular/core';
import { FbService } from 'src/app/fb.service';
import { User, Slot } from 'src/app/fb.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  currentDate;
  constructor(public fb: FbService) {
    this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
  }

  ngOnInit() {
  }

  selectedEmployee: User = {} as User;
  selectedDate: string = '';
  selectedTime: string = '';
  availableTimes: string[] = [];

  populateTimes(){
    this.availableTimes = ['6:00', '12:00', '18:00'];
    this.fb.slots.subscribe(slots => {
      // Get all slots for the selected date
      let todaysSlots = slots.filter(slot => {
        return formatDate(slot.date, 'dd/MM/yyyy', 'en-US') == formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      });
      // Remove all slots that are already assigned to an employee (reserved)
      todaysSlots.forEach(slot => {
        let index = this.availableTimes.indexOf(slot.startTime);
        // If the slot is reserved, remove it from available times
        if(index != -1)
          this.availableTimes.splice(index, 1);
      });
    });
  }

  assignSlot(){
    this.empScheduleModal = false;
    let newSlot: Slot = {
      date: this.selectedDate,
      day: formatDate(this.selectedDate, 'EEEE', 'en-US'),
      startTime: this.selectedTime,
      employee: this.selectedEmployee
    }
    this.fb.addSlot(newSlot);
    this.fb.showToast('Shift assigned successfully', 'success');
    this.selectedEmployee = {} as User;
    this.selectedDate = '';
    this.selectedTime = '';
    this.availableTimes = [];
  }

  empListModal = false;
  empScheduleModal = false;
  assignShift(emp: User){
    this.selectedEmployee = emp;
    this.empScheduleModal = true;
  }
}
