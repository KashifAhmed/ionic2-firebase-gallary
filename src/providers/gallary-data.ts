import { Injectable } from '@angular/core';
import firebase from 'firebase';
//import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx'

/*
  Generated class for the GallaryData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GallaryData {
  gallaryRef: any;
  userProfile: any;
  constructor() {
    // ref path of gallary
    this.gallaryRef = firebase.storage().ref().child('gallaryRef');
    // ref path of user
    this.userProfile = firebase.database().ref('/userProfile');

  }

  /** @desc this method upload image to firebase stoarge
   *  @param imagePath: {string} - path of image where it place
   *  @param imageTitle: {string} - this will set the title of image
   */
  uploadImage(imagePath, imageTitle) {
    return Observable.create(observer => {
      if (imagePath != null) {
        // generate unique number for image
        let uniqueNumber = new Date().getUTCMilliseconds();
        let imageName = 'image' + uniqueNumber + '.png';
        this.gallaryRef.child(imageName)
          .putString(imagePath, 'base64', { contentType: 'image/png' })
          .then((savedPicture) => {
            let imageURL = savedPicture.downloadURL;
            let uid = firebase.auth().currentUser.uid;
            let files = this.userProfile.child(uid).child('files');
            let newObject = {
              url: imageURL,
              label: imageTitle,
              contentType: 'image/png'
            }
            observer.next(newObject);
            // update userProfile with gallary image
            files.push(newObject).then((val) => {
              observer.complete();
              console.log(val);
            })
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })

  }

  uploadFile(base64Url, contentType, fileName) {
    return Observable.create(observer => {
      if (base64Url != null) {
        // generate unique number for image
        let uid = firebase.auth().currentUser.uid;
        let files = this.userProfile.child(uid).child('files');
        let newObject = {
          url: base64Url,
          label: fileName,
          contentType: contentType
        }
        observer.next(newObject);
        // update userProfile with gallary image
        files.push(newObject).then((val) => {
          observer.complete();
          console.log(val);
        })
      }
    })
  }
  fetchImages() {
    let uid = firebase.auth().currentUser.uid,
      imageArray = [];

    // fetching images from user profile & push to array
    return Observable.create(observal => {
      this.userProfile.child(uid).child('files')
        .once('value', (d) => {
          let images = d.val();
          for (let key in images) {
            imageArray.push(images[key]);
          }
        })
      observal.next(imageArray);
      observal.complete();
    });
  }


}
