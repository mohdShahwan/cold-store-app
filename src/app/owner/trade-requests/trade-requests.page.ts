import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, TradeShiftRequest } from 'src/app/fb.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-trade-requests',
  templateUrl: './trade-requests.page.html',
  styleUrls: ['./trade-requests.page.scss'],
})
export class TradeRequestsPage implements OnInit {

  constructor(
    public fb: FbService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.fb.tradeShiftReqs
      .subscribe(reqs => {
        this.pendingReqs = reqs.filter(req => req.status == 'pending' && req.empApprove);
        this.doneReqs = reqs.filter(req => req.status == 'approved' || req.status == 'rejected');
      }
    );
  }

  pendingReqs: TradeShiftRequest[] = [];
  doneReqs: TradeShiftRequest[] = [];

  async approveTradeRequest(req: TradeShiftRequest){
    const alert = await this.alertCtrl.create({
      header: 'Approve Trade',
      message: `Are you sure you want to approve the trade request from ${req.sender.name} to ${req.slot.employee.name} on ${formatDate(req.slot.date, 'dd/MM/YYYY', 'en-US')} from ${formatDate(req.slot.startTime, 'h:mm a', 'en-US')} to ${formatDate(req.slot.endTime, 'h:mm a', 'en-US')}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            req.ownerApprove = true;
            req.status = 'approved';
            this.fb.updateTradeShiftRequest(req)
              .then(res => {
                this.fb.showToast('Trade request approved successfully', 'success');
              }
            ).catch(err => {
              this.fb.showToast('Error approving trade request', 'danger');
            });
            // Update the slot with the new employee
            req.slot.employee = req.sender;
            this.fb.updateSlot(req.slot);
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
      message: `Are you sure you want to reject the trade request from ${req.sender.name} to ${req.slot.employee.name} on ${formatDate(req.slot.date, 'dd/MM/YYYY', 'en-US')} from ${formatDate(req.slot.startTime, 'h:mm a', 'en-US')} to ${formatDate(req.slot.endTime, 'h:mm a', 'en-US')}?`,
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
