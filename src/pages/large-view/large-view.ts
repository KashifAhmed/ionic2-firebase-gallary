import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the LargeView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-large-view',
  templateUrl: 'large-view.html'
})
export class LargeView {

  item: any;
  constructor(public navCtrl: NavController, private params: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello LargeView Page');
    this.item = this.params.get('data');
    console.log(this.item);
  }

}
