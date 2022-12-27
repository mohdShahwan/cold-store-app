import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FbService, Order } from 'src/app/fb.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  constructor(public alertCtrl:AlertController,public fb: FbService) { }

  showingOrders: Order[] = [];
  favorites: string = 'all';
  ngOnInit() {
    this.updateOrders();
  }

  orderAgain(order: Order){
    order.orderTimes++;
    this.fb.updateOrder(order);
    order.id = undefined;
    const alert = this.alertCtrl.create({
      header: 'Order Again',
      message: 'Are you sure you want to order this item again?',
      buttons: [
        {
          text: 'Order Again',
          handler: () => {
            this.fb.addOrder(order)
            .then(() => {
              this.fb.showToast('Order placed successfully', 'success');
            })
            .catch(err => {
              this.fb.showToast('Error placing order', 'danger');
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).then(alert => alert.present());
  }

  orderModal: boolean = false;
  currentOrder: Order = {} as Order;
  showOrderInfo(order: Order){
    this.orderModal = true;
    this.currentOrder = order;
  }
  closeOrderInfo(){
    this.orderModal = false;
    this.currentOrder = {} as Order;
  }

  getStatusColor(color: string){
    switch(color){
      case 'pending':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return 'primary';
    }
  }

  star: string = 'star-outline';
  toggleFavorite(order: Order){
    order.isFavorite = !order.isFavorite;
    this.fb.updateOrder(order);
  }

  updateOrders(){
    this.fb.orders.subscribe(orders => {
      this.showingOrders = orders
      .filter(order=>{
        if(this.favorites=='favorites')
          return order.isFavorite;
        else
          return true;
      });
      });
  }

  exportModal: boolean = false;
  importModal: boolean = false;
  exportJSON: string = "";
  importJSON: string = "";
  openExportModal(){
    this.exportModal = true;
    this.exportJSON = JSON.stringify(this.fb.allItems);
  }
  openImportModal(){
    this.importModal = true;
  }
  importItems(){
    try{
      let newItems = JSON.parse(this.importJSON);
      for(let item of newItems)
        this.fb.addItem(item);
      this.closeImportModal();
      this.fb.showToast("Items imported successfully", 'success');
    }catch(e){
      console.log(e);
      this.fb.showToast("Invalid JSON", 'danger');
    }
  }
  closeExportModal(){
    this.exportModal = false;
    this.exportJSON = '';
  }
  closeImportModal(){
    this.importModal = false;
    this.importJSON = '';
  }

  newOrder: Order = {} as Order;
  openOrderModal(){

  }
  addOrder(){
  }
  closeOrderModal(){

  }



//================chart==================

  // ngAfterViewInit() {
  //   this.barChartMethod();
  //   this.doughnutChartMethod();
  //   this.lineChartMethod();
  // }


  // barChartMethod() {
  //   this.barChart = new Chart(this.barCanvas.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
  //       datasets: [{
  //         label: '# of Votes',
  //         data: [200, 50, 30, 15, 20, 34],
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255,99,132,1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }

  // doughnutChartMethod() {
  //   this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
  //       datasets: [{
  //         label: '# of Votes',
  //         data: [50, 29, 15, 10, 7],
  //         backgroundColor: [
  //           'rgba(255, 159, 64, 0.2)',
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)'
  //         ],
  //         hoverBackgroundColor: [
  //           '#FFCE56',
  //           '#FF6384',
  //           '#36A2EB',
  //           '#FFCE56',
  //           '#FF6384'
  //         ]
  //       }]
  //     }
  //   });
  // }

  // lineChartMethod() {
  //   this.lineChart = new Chart(this.lineCanvas.nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
  //       datasets: [
  //         {
  //           label: 'Sell per week',
  //           fill: false,
  //           lineTension: 0.1,
  //           backgroundColor: 'rgba(75,192,192,0.4)',
  //           borderColor: 'rgba(75,192,192,1)',
  //           borderCapStyle: 'butt',
  //           borderDash: [],
  //           borderDashOffset: 0.0,
  //           borderJoinStyle: 'miter',
  //           pointBorderColor: 'rgba(75,192,192,1)',
  //           pointBackgroundColor: '#fff',
  //           pointBorderWidth: 1,
  //           pointHoverRadius: 5,
  //           pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  //           pointHoverBorderColor: 'rgba(220,220,220,1)',
  //           pointHoverBorderWidth: 2,
  //           pointRadius: 1,
  //           pointHitRadius: 10,
  //           data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
  //           spanGaps: false,
  //         }
  //       ]
  //     }
  //   });
  // }

}
