import { Component, OnInit } from '@angular/core';
import { FbService, Slot, User } from 'src/app/fb.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {

  constructor(
    public fb: FbService,
  ) { }

  ngOnInit() {
  }

  selectedEmp: User = {} as User;
  selectedEmpSlots: Slot[] = [];
  empModal: boolean = false;
  showEmpSch(emp: User){
    this.empModal = true;
    // Set selected employee
    this.selectedEmp = emp;
    // Get employee's schedule slots
    this.selectedEmpSlots = this.fb.allSlots.filter(slot => slot.employee.id == emp.id);
    // Sort slots by date
    this.selectedEmpSlots.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    // Show employee's schedule slots
  }
  hideEmpSch(){
    this.empModal = false;
    this.selectedEmp = {} as User;
    this.selectedEmpSlots = [];
  }

  empInfoModal: boolean = false;
  showEmpInfo(emp: User){
    this.empInfoModal = true;
    // Set selected employee
    this.selectedEmp = emp;
    // Show employee's info

  }
  hideEmpInfo(){
    this.empInfoModal = false;
    this.selectedEmp = {} as User;
  }
  updateUser() {
    // Check if any field has been touched to enable the update button
    this.fb.updateUser(this.selectedEmp);
  }


}
