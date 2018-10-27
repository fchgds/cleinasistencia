import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Subscription} from "rxjs";
import {AsistenciaService} from "../../providers/asistencia-service";
import {HomePage} from "../home/home";

/**
 * Generated class for the ScanQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-qr',
  templateUrl: 'scan-qr.html',
})
export class ScanQrPage {
  private isBackMode: boolean = true;
  private isFlashLightOn: boolean = false;
  private scanSub: Subscription;
  public actividad:String;
  public id_admin:Number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewController: ViewController,
              public qrScanner: QRScanner,
              public toastCtrl: ToastController,
              private asistenciaService: AsistenciaService
  ) {

    this.actividad = navParams.get('actividad');
    this.id_admin = navParams.get('id_admin');
  }




  ionViewWillEnter(){
    this.escaneo();
  }


  escaneo()
{
  this.showCamera();
  // Optionally request the permission early
  this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        console.log('Camera Permission Given');

        // start scanning
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          let usuario=text.substring(5, 8);
          this.presentToast("Registrado el usuario "+usuario);
          this.registrar(usuario);
          console.log(usuario);
          this.hideCamera();
          setTimeout(() => { this.escaneo(); }, 3000);
        });

        // show camera preview
        this.qrScanner.show();

        // wait for user to scan something, then the observable callback will be called

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
        console.log('Camera permission denied');
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
        console.log('Permission denied for this runtime.');
      }
    })
    .catch((e: any) => console.log('Error is', e));
}



  closeModal() {
    this.viewController.dismiss();
  }


  presentToast(text:string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.hideCamera();
  }
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  registrar(user)
  {
    this.asistenciaService.registrarAsistencia(user,this.actividad,this.id_admin);
  }
}
