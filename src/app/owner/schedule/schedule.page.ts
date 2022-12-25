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

  constructor(public fb: FbService) { }

  ngOnInit() {
  }

  
  
  // populateTimes(){
    //   this.availableTimes = ['6:00', '12:00', '18:00'];
    //   this.fb.slots.subscribe(slots => {
      //     // Get all slots for the selected date
      //     let todaysSlots = slots.filter(slot => {
        //       return formatDate(slot.date, 'dd/MM/yyyy', 'en-US') == formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
        //     });
        //     // Remove all slots that are already assigned to an employee (reserved)
        //     todaysSlots.forEach(slot => {
          //       let index = this.availableTimes.indexOf(slot.startTime);
          //       // If the slot is reserved, remove it from available times
          //       if(index != -1)
  //         this.availableTimes.splice(index, 1);
  //     });
  //   });
  // }

  assModal = false;
  hourValues = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US') + 'T00:00';
  selectedDate: string = '';
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  selectedEmployee: User = {} as User;
  
  assignSlot(){
    // Form validation -> make sure that start time is before end time
    // Check for overlapping shifts
    let overlap = false;
    this.fb.slots.subscribe(slots => {
      let selectedDateSlots = slots.filter(slot => {
        return formatDate(slot.date, 'dd/MM/yyyy', 'en-US') == formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      });
      let overlapping = selectedDateSlots.filter(slot => {
        return (formatDate(this.selectedStartTime, 'hh:mm', 'en-US') >= formatDate(slot.startTime, 'hh:mm', 'en-US') && formatDate(this.selectedStartTime, 'hh:mm', 'en-US') < formatDate(slot.endTime, 'hh:mm', 'en-US')) || (formatDate(this.selectedEndTime, 'hh:mm', 'en-US') > formatDate(slot.startTime, 'hh:mm', 'en-US') && formatDate(this.selectedEndTime, 'hh:mm', 'en-US') <= formatDate(slot.endTime, 'hh:mm', 'en-US'));
      });
      if(overlapping.length > 0){
        overlap = true;
        return;
      }
    });
    if(!overlap){
      this.assModal = false;
      let name = this.selectedEmployee.name;
      let newSlot: Slot = {
        date: this.selectedDate,
        startTime: this.selectedStartTime,
        endTime: this.selectedEndTime,
        employee: this.selectedEmployee
      }
      this.fb.addSlot(newSlot)
      .then(res => {
        this.fb.showToast(`Shift assigned to ${name} successfully`, 'success');
        //this.clearForm();
      });
      
      // Clear form
      this.selectedEmployee = {} as User;
      this.selectedDate = '';
      this.selectedStartTime = '';
      this.selectedEndTime = '';
    }
    else
      this.fb.showToast(`There is a schdule conflict for the selected slot`, 'danger');
  }

  empListModal = false;
}

