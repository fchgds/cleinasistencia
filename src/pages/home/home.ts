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
      {id:1, titulo:"Transforma tu idea en un modelo de negocio exitoso"},
      {id:8, titulo:"Uso de la planificación  y control de la producción en empresas pymes exponiendo el caso de la empresa Atabex S.R.L"},
      {id:23, titulo:"Ponencia Magistral Martes 9:45"},
      {id:14, titulo:"Taller Ventas Para Emprendedores"},
      {id:15,titulo:"Taller Diseño productos para emprendedores"},
      {id:24,titulo:"Ponencia Magistral Martes 14:30"},
      {id:25,titulo:"Caso de Éxito Martes 15:30"},
      {id:26,titulo:"Noche de Naciones"}
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
