import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
  private users: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private  afs:  AngularFirestore, private  afAuth: AngularFireAuth) { 
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

  addUser(user:  User):  Promise<DocumentReference>  {
    return  this.usersCollection.add(user); 
}

  SignUp(newUser:  User, newEmail: string, newPassword: string): Promise<any> {
    this.addUser(newUser);
    return this.afAuth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  SignIn(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  SignOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}