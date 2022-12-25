import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

/*
  ****** Errors ******
  deleteUserFromCollection
*/

/*
  ****** Users for Testing ******
  User 1 (Owner):
  Email: owner@gmail.com
  Password: owner123

  User 2 (Employee):
  Email: emp@gmail.com
  Password: emp1234

  User 3 (Supplier):
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
  senderSlot: Slot,
  receiverSlot: Slot,
}

export interface Slot {
  id?: string,
  date: string,
  startTime: string,
  endTime: string,
  employee: User,
}

export interface Item{
  id?: string,
  name: string,
  price: number,
  quantity: number,
  supplier: User,
  threshold: number,
}

@Injectable({
  providedIn: 'root'
})

export class FbService {
  public allUsers: User[] = [];
  public employees: User[] = [];
  public currentUser = {} as User;
  public usersCollection: AngularFirestoreCollection<User>;
  public users: Observable<User[]>;

  public slotsCollection: AngularFirestoreCollection<Slot>;
  public slots: Observable<Slot[]>;
  public allSlots: Slot[] = [];

  public allItems: Item[] = [];
  public itemsCollection: AngularFirestoreCollection<Item>;
  public items: Observable<Item[]>;


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
          this.navCtrl.navigateRoot('/owner');
        else if(this.currentUser.userType == 'employee')
          this.navCtrl.navigateRoot('/employee');
        else
          this.navCtrl.navigateRoot('/supplier');
      })
      .catch(err => {
        if(err.code == 'auth/invalid-email' || err.code == 'auth/user-not-found' || err.code == 'auth/wrong-password')
          this.showToast('Invalid email and/or password', 'danger');
        else
          this.showToast(('Error: ' + err.code), 'danger');
      });
  }

  logOut(): Promise<void> {
    this.currentUser = {} as User;
    //this.currentEmployee = {} as Employee;
    this.navCtrl.navigateRoot('/');
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
}