import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ReceiptsPage } from "../receipts/receipts";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ExpensesService } from "../../services/expenses";
import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-new-receipt',
  templateUrl: 'new-receipt.html',
})
export class NewReceiptPage {
  public dbList: any;
  public receiptsList: FirebaseListObservable<any[]>
  public receiptName: string;
  public receiptDescription: string;
  public receiptValue: number;
  public receiptWarranty: number;
  public receiptImage: string;
  public receiptDate: number;
  public imageTaken: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public expensesService: ExpensesService,
    public database: AngularFireDatabase,
    public camera: Camera,
    public popoverCtrl: PopoverController
  ) {
  }
  
  ionViewDidEnter() {
    this.clear();
    this.dbList = 'michal1dydo/receiptsItems/';
    this.receiptsList = this.expensesService.getItemsList(this.dbList);
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  clear() {
    this.imageTaken = false;
    this.receiptDescription = null;
    this.receiptImage = null;
    this.receiptName = null;
    this.receiptValue = null;
    this.receiptWarranty = null;
  }

  takePicture() {
    this.expensesService.loaderOn();
    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 700,
      targetHeight: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
      this.expensesService.loaderOff();
    }, (err) => {
      console.log('error');
      this.expensesService.loaderOff();
    });
  }

  getPicture() {
    this.expensesService.loaderOn();
    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 700,
      targetHeight: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
      this.expensesService.loaderOff();
    }, (err) => {
      console.log('error');
      this.expensesService.loaderOff();
    });
  }

  addReceipt() {
    let promise = this.receiptsList.push({
      date: moment().unix(),
      description: this.receiptDescription,
      image: this.receiptImage,
      name: this.receiptName,
      value: Number(this.receiptValue),
      warranty: Number(this.receiptWarranty.toFixed(0))
    });
    promise
      .then(_ => {
        console.log('success');
      })
      .catch(err => {
        console.log(err, 'Something went wrong!');
      });
    this.navCtrl.push(ReceiptsPage);
  }

}
