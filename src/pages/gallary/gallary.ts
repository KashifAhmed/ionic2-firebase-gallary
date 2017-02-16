import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { Camera, ImagePicker, FileChooser, File } from 'ionic-native';

import { LargeView } from '../large-view/large-view';

import { GallaryData } from '../../providers/gallary-data';
/*
  Generated class for the Gallary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gallary',
  templateUrl: 'gallary.html'
})
export class Gallary {
  images: any;
  askImageName: any;
  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private gallaryDataService: GallaryData) { }

  ionViewDidLoad() {
    console.log('Hello Gallary Page');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    // fetching images from firebase storage
    this.gallaryDataService.fetchImages()
      .subscribe(images => {
        this.images = images;
        loader.dismiss();
      });

  }

  uploadImageFromGallery() {
    let options = {
      maximumImagesCount: 1,
      width: 500,
      height: 500,
      quality: 90
    };
    let imagedata = {};
    ImagePicker.getPictures(options).then((results) => {
      let imageurl = results[0],
        loader = this.loadingCtrl.create({
          content: "Please wait...",
        });
      // prompt ask image lable
      this.labelPrompt((obj) => {
        // if image has any title then go to save image
        if (obj.title.length > 0) {
          loader.present();
          // convert image to base64
          this.getDataUri(imageurl, (base64) => {
            // upload base46image to firebase storage
            this.gallaryDataService.uploadImage(base64, obj.title)
              .subscribe(data => {
                this.images.push(data);
                loader.dismiss();
              });
          });
        }
      });
    }, (err) => {
      // Handle error 
      console.log(err);
    });
  }

  uploadNewPicture() {
    let option = {
      quality: 95,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    };

    Camera.getPicture(option).then((imageData) => {
      let image = imageData,
        loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
      // prompt ask image lable
      this.labelPrompt((data) => {
        console.log("label prompt :", data);
        // if image has any title then go to save image
        if (data.title.length > 0) {
          loader.present();
          // upload base46image to firebase storage
          this.gallaryDataService.uploadImage(image, data.title)
            .subscribe(data => {
              this.images.push(data);
              loader.dismiss();
            });
        }
      })

    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  uploadFile() {
    let contentType,
      fileName,
      directoryPath,
      loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
    FileChooser.open()
      .then(uri => {
        this.labelPrompt((data) => {
          loader.present();
          window['FilePath'].resolveNativePath(uri, (d) => {
            console.log(d);
            directoryPath = d.slice(0, d.lastIndexOf('/'));
            fileName = d.slice(d.lastIndexOf('/') + 1, d.length);
            File.resolveLocalFilesystemUrl(uri)
              .then((d) => {
                console.log(d.name);
                //fileName = d.name;
                d['file']((meta) => {
                  console.log(meta.type);
                  contentType = meta.type;
                  console.log(fileName);
                  File.readAsDataURL(directoryPath, fileName)
                    .then((base64) => {
                      console.log(base64);
                      this.gallaryDataService.uploadFile(base64, contentType,data.title)
                        .subscribe((response) => {
                          this.images.push(response);
                          loader.dismiss();
                          console.log(response);
                        }, (error) => {
                          console.log(error);
                        })
                    });
                })
              });
          })
        })





      })
  }

  /** @desc this method convert image to base64 
   *  @param url : {string} - path of image
   *  @param callback - response after convert base64
   */
  getDataUri(url, callback) {
    // var image = new Image();

    // image.onload = function () {
    //   var canvas = document.createElement('canvas');
    //   canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    //   canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

    //   canvas.getContext('2d').drawImage(this, 0, 0);

    //   // Get raw image data
    //   callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

    //   // ... or get as Data URI
    //   callback(canvas.toDataURL('image/png'));
    // };

    // image.src = url;
  }

  labelPrompt(callBack) {
    // alert template
    let askImageLabel = this.alertCtrl.create({
      title: 'Image Lable',
      message: "Enter a name for this new image you're so keen on adding",
      inputs: [{ name: 'title', placeholder: 'Title' }],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Save',
          handler: data => {
            console.log('image name: ', data);
          }
        }
      ]
    });
    // when alert dismiss / hide
    askImageLabel.onDidDismiss((data) => {
      callBack(data);
    })
    askImageLabel.present();
  }

  addImageActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add image in your album',
      buttons: [
        {
          text: 'Open Gallary',
          handler: () => {
            this.uploadImageFromGallery();
          }
        }, {
          text: 'Take Photo',
          handler: () => {
            this.uploadNewPicture();
          }
        }, 
        // {
        //   text: 'Upload File',
        //   handler: () => {
        //     this.uploadFile();
        //   }
        // }, 
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openImage(item) {
    this.navCtrl.push(LargeView, {
      data: item
    });
  }
}
