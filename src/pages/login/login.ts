import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {LoadingController, NavController, ToastController} from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import {HomePage} from "../home/home";


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public authService : AuthService,
              public loadingController: LoadingController,

  ) {
    this.login.username="";
    this.login.password="";
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let loading = this.loadingController.create({ content: 'Ingresando' });
      loading.present();
      this.authService.loginWithEmail(this.login).then(data => {
        if (data.success == true) {
          this.authService.isLogged = true;
          loading.dismiss();
          this.presentToast("Login Correcto");
          setTimeout(() => { this.navCtrl.push(HomePage, {'id_admin':data.data[0].admin_id}); }, 2000);

        } else {
          loading.dismiss();
          this.presentToast("Error en Usuario o Contraseña");
          setTimeout(() => {
            console.log(data);
            }, 2000);
        }
      }).catch(err => {
        loading.dismiss();
        this.presentToast("Error en Comunicación");
        setTimeout(() => {
          console.log(err);
        }, 2000);
      });
    }
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
}
