import { Component } from '@angular/core';
import {NavController, ToastController, ModalController, NavParams} from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  scan : String;
  dia : String;
  hora : String;
  actividadseleccionada: String;
  actividades: Array<{id:number,titulo: string}>;
  id_admin: Number;
  private scanSub: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private modalController: ModalController,
              private qrScanner: QRScanner) {

    this.actividades = [
      {id:11,titulo:"Diseño de layout para el almacen de productos terminados del ingenio azucarero de Imbadura Ecuador"},
      {id:13,titulo:"Propuesta de plataforma de pagina web como modelo de negocio"},
      {id:30,titulo:"Ponencia Magistral Jueves 9:45"},
      {id:16,titulo:"Taller 3P, Filosofía Lean en tus manos"},
      {id:17,titulo:"Taller Design Thinking and Lean Six Sigma"},
      {id:31,titulo:"Ponencia Magistral Jueves 14:30"},
      {id:32,titulo:"Caso de Éxito Jueves 15:30"},
      {id:33,titulo:"Caso de Éxito Jueves 17:00"},
      {id:34,titulo:"Party de Marquesina"}
      ];
    this.id_admin=0;
    this.id_admin = this.navParams.get('id_admin');
  }

  ionViewWillEnter()
  {
    this.id_admin = this.navParams.get('id_admin');
  }


  ionViewWillLeave()
  {

  }

  qrscan()
  {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          console.log('Camera Permission Given');

          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.presentToast(text);
            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning
            this.qrscan();
          });

          this.qrScanner.show();
        } else if (status.denied) {
          console.log('Camera permission denied');
        } else {
          console.log('Permission denied for this runtime.');
        }
      })
      .catch((e: any) => console.log('Error is', e));

    this.showCamera();
  }

  scanOnclick() {
    if(typeof this.id_admin != 'undefined')
    {
      console.log(this.id_admin);
      if(typeof this.actividadseleccionada != 'undefined')
      {
        console.log(this.actividadseleccionada);
    let modal = this.modalController.create('ScanQrPage',{ 'actividad': this.actividadseleccionada, 'id_admin':this.id_admin});
    modal.present();
      }
      else
      {
        this.presentToast("Seleccionar Actividad");
      }
    }
    else
    {
      this.presentToast("Hacer Login de Administrador");
    }
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  listParticipantes() {
    if (typeof this.actividadseleccionada != 'undefined') {
      window.open('https://www.clein.org/admin/asistencia.php?idactividad=' + this.actividadseleccionada);
    }
    else {
      this.presentToast("Seleccionar Actividad");
    }
  }


  login()
  {
    this.navCtrl.push(LoginPage);
  }

  presentToast(text:string) {
    this.scan=text;
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

  isDefined(val) { return typeof val != 'undefined'; }
}
