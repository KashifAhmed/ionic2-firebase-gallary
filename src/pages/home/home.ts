import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { Gallary } from '../gallary/gallary';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = {
    email: null
  };

  constructor(public navCtrl: NavController, public authData: AuthData) {
    console.log(authData);
    
    // authData.fireAuth.getToken()
    //   .then((a,b,c)=>{
    //     console.log(a,b,c);
    //   });
    // this.userProfile.child(newUser.uid).set({
    //       email: email
    //   });
    //authData.userProfile.set('name','Ahmed')
    //console.log("Params Data: ",authData.userProfile.get());
    this.user = authData.fireAuth;
    
  }


  logMeOut() {
    this.authData.logoutUser().then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  goToGallery(){
    this.navCtrl.push(Gallary);
  }

}
