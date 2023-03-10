import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs-compat';

/*
  ****** Errors ******
  deleteUserFromCollection
*/

/*
  ****** Users for Testing ******
  Owners:
  Email: owner@gmail.com
  Password: owner123

  Employees:
  Email: emp@gmail.com
  Password: emp1234
  Email: emp1@gmail.com
  Password: emp1234

  Suppliers:
  Email: sup@gmail.com
  Password: sup1234
*/

export interface User {
  id?: string,
  name: string,
  email: string,
  phone: string,
  userType: string,
  // employeeSchedule?: Slot[],
  // employeeTradeShiftRequests?: TradeShiftRequest[],
}

export interface TradeShiftRequest {
  id?: string,
  sender: User,
  receiver: User,
  slot: Slot,
  empApprove: boolean,
  ownerApprove: boolean,
  status: string,
}

export interface Slot {
  id?: string,
  date: string,
  startTime: string,
  endTime: string,
  employee: User,
}

export interface StoreItem{
  id?: string,
  item: Item,
  quantity: number,
  threshold: number,
}

/*
  Sample Store items
  { item: allItems[0], quantity: 10, threshold: 5 },
  { item: allItems[1], quantity: 20, threshold: 2 },

*/

export interface Item{
  id?: string,
  name: string,
  itemsPerCartoon: number,
  price: number,
  supplier: User,
  noOfCartoons?: number,
}

export interface Order{
  id?: string,
  date: string,
  items: Item[],
  total: number,
  status: string,
  isFavorite: boolean,
  orderTimes: number,
}

@Injectable({
  providedIn: 'root'
})

export class FbService {
  public allUsers: User[] = [];
  public employees: User[] = [];
  public suppliers: User[] = [];
  public currentUser = {} as User;
  public usersCollection: AngularFirestoreCollection<User>;
  public users: Observable<User[]>;

  public slotsCollection: AngularFirestoreCollection<Slot>;
  public slots: Observable<Slot[]>;
  public allSlots: Slot[] = [];

  public allItems: Item[] = [];
  public itemsCollection: AngularFirestoreCollection<Item>;
  public items: Observable<Item[]>;

  public shiftReqs: TradeShiftRequest[] = [];
  public tradeShiftReqsCollection: AngularFirestoreCollection<TradeShiftRequest>;
  public tradeShiftReqs: Observable<TradeShiftRequest[]>;

  public allStoreItems: StoreItem[] = [];
  public storeItemsCollection: AngularFirestoreCollection<StoreItem>;
  public storeItems: Observable<StoreItem[]>;

  public allOrders: Order[] = [];
  public ordersCollection: AngularFirestoreCollection<Order>;
  public orders: Observable<Order[]>;


private cart = [];
private cartItemCount = new BehaviorSubject(0);

  constructor(private  afs:  AngularFirestore, private  afAuth: AngularFireAuth, private toastCtrl: ToastController, private router: Router, private navCtrl: NavController) {
    // Users Collection
    this.usersCollection = this.afs.collection<User>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return  {  id,  ...data  };
        });
      })
    );
    this.users.subscribe(users => {this.allUsers = users;});
    // Employees from users collection
    this.users.subscribe(users => {this.employees = users.filter(user => user.userType == 'employee');});
    // Suppliers from users collection
    this.users.subscribe(users => {this.suppliers = users.filter(user => user.userType == 'supplier');});

    // Items Collection
    this.itemsCollection = this.afs.collection<Item>('items');
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return  {  id,  ...data  };
        });
      })
    );
    this.items.subscribe(items => {this.allItems = items;});

    // Slots Collection
    this.slotsCollection = this.afs.collection<Slot>('slots');
    this.slots = this.slotsCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return  {  id,  ...data  };
        });
      })
    );
    this.slots.subscribe(slots => {this.allSlots = slots;});

    // Trade Shift Requests Collection
    this.tradeShiftReqsCollection = this.afs.collection<TradeShiftRequest>('tradeShiftRequests');
    this.tradeShiftReqs = this.tradeShiftReqsCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return  {  id,  ...data  };
        });
      })
    );
    this.tradeShiftReqs.subscribe(reqs => {this.shiftReqs = reqs;});

    // Store Items Collection
    this.storeItemsCollection = this.afs.collection<StoreItem>('storeItems');
    this.storeItems = this.storeItemsCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return {  id,  ...data  };
        });
      })
    );
    this.storeItems.subscribe(items => {this.allStoreItems = items;});

    // Orders Collection
    this.ordersCollection = this.afs.collection<Order>('orders');
    this.orders = this.ordersCollection.snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a  =>  {
          const  data  =  a.payload.doc.data();
          const  id  =  a.payload.doc.id;
          return {  id,  ...data  };
        });
      })
    );
    this.orders.subscribe(order => this.allOrders = order);
  }

  async showToast(message: string, color: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    });
    await toast.present();
  }

  addUser(user:  User):  Promise<DocumentReference>  {
    return this.usersCollection.add(user);
  }

  addSlot(slot: Slot): Promise<DocumentReference> {
    return this.slotsCollection.add(slot);
  }

  addTradeShiftRequest(tradeShiftRequest: TradeShiftRequest): Promise<DocumentReference> {
    return this.tradeShiftReqsCollection.add(tradeShiftRequest);
  }

  addItem(item: Item): Promise<DocumentReference> {
    return this.itemsCollection.add(item);
  }

  addStoreItem(storeItem: StoreItem): Promise<DocumentReference> {
    return this.storeItemsCollection.add(storeItem);
  }

  addOrder(order: Order): Promise<DocumentReference> {
    return this.ordersCollection.add(order);
  }

  getUser(id: string): Observable<User | undefined>{
    return this.usersCollection.doc<User>(id).valueChanges().pipe(
      map(user => {
        if(user)
          user.id = id;
        return user
      })
    );
  }

  updateCurrentUser(): Promise<any> {
    return this.usersCollection.doc(this.currentUser.id).update(this.currentUser)
      .then(() => {
        this.showToast('Profile updated successfully', 'success');
      }).catch(err => {
        this.showToast('Error updating profile', 'danger');
      }
    );
  }

  updateUser(user: User): Promise<any> {
    return this.usersCollection.doc(user.id).update(user);
  }

  updateTradeShiftRequest(tradeShiftRequest: TradeShiftRequest): Promise<any> {
    return this.tradeShiftReqsCollection.doc(tradeShiftRequest.id).update(tradeShiftRequest);
  }

  updateSlot(slot: Slot): Promise<any> {
    return this.slotsCollection.doc(slot.id).update(slot);
  }

  updateStoreItem(storeItem: StoreItem): Promise<any> {
    return this.storeItemsCollection.doc(storeItem.id).update(storeItem);
  }

  updateOrder(order: Order): Promise<any> {
    return this.ordersCollection.doc(order.id).update(order);
  }

  register(user: User, newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(newEmail, newPassword)
      .then(res => {
        this.addUser({
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType
        });
      }).catch(err => {
        if(err.code == 'auth/email-already-in-use')
          this.showToast('Email already in use', 'danger');
        else if(err.code == 'auth/invalid-email')
          this.showToast('Invalid email', 'danger');
        else if(err.code == 'auth/weak-password')
          this.showToast('Password too weak', 'danger');
        else
          this.showToast(('Error: ' + err.code), 'danger');
      });
  }

  logIn(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(newEmail, newPassword)
      .then(res => {
        this.allUsers.find(user => {
          if(user.email == newEmail)
            this.currentUser = user;
        });
        // Navigate to the suitable page according to the user type
        if(this.currentUser.userType == 'owner')
          this.navCtrl.navigateForward('/owner');
        else if(this.currentUser.userType == 'employee')
          this.navCtrl.navigateForward('/employee');
        else
          this.navCtrl.navigateForward('/supplier');
        this.showToast('Logged in successfully', 'success');
      })
      .catch(err => {
        if(err.code == 'auth/invalid-email' || err.code == 'auth/user-not-found' || err.code == 'auth/wrong-password')
          this.showToast('Invalid email and/or password', 'danger');
        else
          this.showToast(('Error: ' + err.code), 'danger');
      });
  }

  logOut(): Promise<void> {
    this.navCtrl.navigateBack('/');
    //this.currentEmployee = {} as Employee;
    this.currentUser = {} as User;
    return this.afAuth.signOut();
  }

  deleteUserFromAuth(): Promise<any> {
    return this.afAuth.currentUser.then(user => {
      if(user)
        user.delete();
    });
  }

  deleteUserFromCollection(): Promise<void> {
    return this.usersCollection.doc(this.currentUser.id).delete()
      .then(() => {
        console.log('User deleted from collection successfully');
      })
      .catch(err => {
        console.log('Error: ' + err.code);
      });
      // .then(() => {
      //   this.showToast('User deleted successfully', 'success');
      // })
      // .catch(err => {
      //   this.showToast(('Error: ' + err.code), 'danger');
      // });
  }

/* ============== NOT WORKING!!!!!! ===============
addProduct(item: any) {
  let added = false;
  for (let p of this.cart) {
    if (p.id === item.id) {
      p.quantity += 1;
      added = true;
      break;
    }
  }
  if (!added) {
    item.amount = 1;
    this.cart.push(item);
  }
  this.cartItemCount.next(this.cartItemCount.value + 1);
}

decreaseProduct(item: any) {
  for (let [index, p] of this.cart.entries()) {
    if (p.id === item.id) {
      p.quantity -= 1;
      if (p.quantity == 0) {
        this.cart.splice(index, 1);
      }
    }
  }
  this.cartItemCount.next(this.cartItemCount.value - 1);
}

removeProduct(item: any) {
  for (let [index, p] of this.cart.entries()) {
    if (p.id === item.id) {
      this.cartItemCount.next(this.cartItemCount.value - p.quantity);
      this.cart.splice(index, 1);
    }
  }
}
*/


}
