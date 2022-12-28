import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, Slot, TradeShiftRequest } from 'src/app/fb.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-shift-trade',
  templateUrl: './shift-trade.page.html',
  styleUrls: ['./shift-trade.page.scss'],
})
export class ShiftTradePage implements OnInit {

  constructor(
    public fb: FbService,
    private alertCtrl: AlertController,
    ) { }
    
    ngOnInit() {
      this.fb.slots
        .subscribe(slots => {
          // remove slot if the employee is the current user
          this.tradeSlots = slots.filter(slot => slot.employee.id != this.fb.currentUser.id);
          // remove slot if it exists in the trade shift requests
          this.tradeSlots = this.tradeSlots.filter(slot => !this.fb.shiftReqs.find(req => req.slot.id == slot.id));
        });
      
      this.fb.tradeShiftReqs
        .subscribe(reqs => {
          // get all requests where the current user is the sender and the receiver or the owner has not approved
          this.pendingSentReqs = reqs.filter(req => req.sender.id == this.fb.currentUser.id && (!req.empApprove || !req.ownerApprove) && req.status == 'pending');
          // get all requests where the current user is the receiver and the sender or the owner has not approved
          this.pendingComingReqs = reqs.filter(req => req.receiver.id == this.fb.currentUser.id && !req.empApprove && req.status == 'pending');
        });
    }

    segment: string = 'available';
    
    
  tradeSlots: Slot[] = [];
  pendingSentReqs: TradeShiftRequest[] = [];
  pendingComingReqs: TradeShiftRequest[] = [];


  async requestTradeSlot(slot: Slot){
    const alert = await this.alertCtrl.create({
      header: 'Request Trade',
      message: `Are you sure you want to request a trade for ${slot.employee.name} on ${formatDate(slot.date, 'dd/MM/YYYY', 'en-US')} from ${formatDate(slot.startTime, 'h:mm a', 'en-US')} to ${formatDate(slot.endTime, 'h:mm a', 'en-US')}?`,
      buttons: [
       {
        text: 'Yes',
        handler: () => {
          this.fb.addTradeShiftRequest({
            sender: this.fb.currentUser,
            receiver: slot.employee,
            slot: slot,
            empApprove: false,
            ownerApprove: false,
            status: 'pending'
          });
        }
      },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
      ]
    });
    alert.present();
    
  }

  async approveTradeRequest(req: TradeShiftRequest){
    const alert = await this.alertCtrl.create({
      header: 'Approve Trade',
      message: `Are you sure you want to approve the trade request from ${req.sender.name} on ${formatDate(req.slot.date, 'dd/MM/YYYY', 'en-US')} from ${formatDate(req.slot.startTime, 'h:mm a', 'en-US')} to ${formatDate(req.slot.endTime, 'h:mm a', 'en-US')}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            req.empApprove = true;
            this.fb.updateTradeShiftRequest(req)
              .then(res => {
                this.fb.showToast('Trade request approved successfully', 'success');
              }
            ).catch(err => {
              this.fb.showToast('Error approving trade request', 'danger');
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
      ]
    });
    alert.present();
  }

  async rejectTradeRequest(req: TradeShiftRequest){
    const alert = await this.alertCtrl.create({
      header: 'Reject Trade',
      message: `Are you sure you want to reject the trade request for ${req.sender.name} on ${formatDate(req.slot.date, 'dd/MM/YYYY', 'en-US')} from ${formatDate(req.slot.startTime, 'h:mm a', 'en-US')} to ${formatDate(req.slot.endTime, 'h:mm a', 'en-US')}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            req.status = 'rejected';
            this.fb.updateTradeShiftRequest(req)
              .then(res => {
                this.fb.showToast('Trade request rejected successfully', 'success');
              }
            ).catch(err => {
              this.fb.showToast('Error rejecting trade request', 'danger');
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
      ]
    });
    alert.present();
  }


}
