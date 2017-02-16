import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


import firebase from 'firebase';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {

    // const config = {
    //   apiKey: "AIzaSyALKfevapBOYK202f6k5mPPfMrT1MHDv5A",
    //   authDomain: "bill-tracker-e5746.firebaseapp.com",
    //   databaseURL: "https://bill-tracker-e5746.firebaseio.com",
    //   storageBucket: "bill-tracker-e5746.appspot.com",
    //   messagingSenderId: "508248799540"
    // };
    // firebase.initializeApp(config);
    
    var config = {
      apiKey: "AIzaSyBlUelG70x0N0SNXGmOtegqMed0WXvPBGs",
      authDomain: "angular-firebase-1ce4a.firebaseapp.com",
      databaseURL: "https://angular-firebase-1ce4a.firebaseio.com",
      storageBucket: "angular-firebase-1ce4a.appspot.com",
      messagingSenderId: "393580042152"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged( user => {
      console.log(user);
      if (!user) {
        this.rootPage = LoginPage;
        console.log("There's not a logged in user!");
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
