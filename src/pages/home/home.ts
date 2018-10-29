import { Component } from '@angular/core';
import {NavController, ToastController, ModalController, NavParams} from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import {AsistenciaService} from "../../providers/asistencia-service";
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
              private asistenciaService: AsistenciaService,
              private qrScanner: QRScanner) {

    this.actividades = [
      {id:21, titulo:"Rally Integración"},
      {id:22, titulo:"Inauguración"},
      {id:23, titulo:"Apertura"},
      {id:1, titulo:"Transforma tu idea en un modelo de negocio exitoso"},
      {id:2,titulo:"Aplicación del concepto de gamificación en el sistema de gestión de relación con los clientes CRM para la pequeña y mediana empresa PYME."},
      {id:3,titulo:"Sistematización de la Inteligencia competitiva en las telecomunicaciones"},
      {id:4,titulo:"Habia una vez start up's….lejos de silicon valley"},
      {id:5,titulo:"Redes neuronales artificales para el pronostico de la demanda."}
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

  test()
  {
    this.asistenciaService.registrarAsistencia(314,this.actividadseleccionada,this.id_admin);
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
