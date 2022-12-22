import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

export interface User {
  id?: string,
  name: string,
  email: string,
  phone: string,
  userType: string,
}

@Injectable({
  providedIn: 'root'
})

export class FbService {
  public users: Observable<User[]>;
  public usersCollection: AngularFirestoreCollection<User>;

  constructor(private  afs:  AngularFirestore, private  afAuth: AngularFireAuth, private toastCtrl: ToastController) { 
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

  getUsers():  Observable<User[]>  {
    return  this.users;
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

  SignUp(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  SignIn(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  SignOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}