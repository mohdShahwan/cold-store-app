import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBluRE_4K2MpRsnCRAitpo7jvHP8rKE28o",
  authDomain: "cold-store-app.firebaseapp.com",
  projectId: "cold-store-app",
  storageBucket: "cold-store-app.appspot.com",
  messagingSenderId: "658910761829",
  appId: "1:658910761829:web:d7d31b624f80cacf2b078c",
  measurementId: "G-CFNLW4SJYZ"
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})

export class AppModule {}



