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

interface User {
  id?: string,
  name: string,
  email: string,
  phone: string,
  userType: string,
}

interface Employee {
  id?: string,
  user: User,
  schedule: Schedule,
}

interface Schedule {
  id?: string,
  date: string,
  day: string,
  startTime: string,
  endTime: string,
}

@Injectable({
  providedIn: 'root'
})

export class FbService {
  public allUsers: User[] = [];
  public currentUser = {} as User;
  public users: Observable<User[]>;
  public usersCollection: AngularFirestoreCollection<User>;

  public allEmployees: Employee[] = [];
  public currentEmployee = {} as Employee;
  //public employees: Observable<Employee[]>;

  constructor(private  afs:  AngularFirestore, private  afAuth: AngularFireAuth, private toastCtrl: ToastController, private router: Router, private navCtrl: NavController) { 
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
  
  getUser(id: string): Observable<User | undefined>{
    return this.usersCollection.doc<User>(id).valueChanges().pipe(
      map(user => {
        if(user)
          user.id = id;
        return user
      })
    );
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
        this.showToast(`${user.name} registered successfully`, 'success');
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
        this.showToast('Logged in successfully', 'success');
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
    return this.afAuth.signOut();
  }
}