import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Config} from "./config";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

/*
  Generated class for the AuthService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AsistenciaService {
  public isLogged: boolean;
  public message: string;
  private urlBaseAPI: string;



  constructor(public http: HttpClient) {
    this.urlBaseAPI = Config.urlBaseAPI;
    this.isLogged = false;
  }


  public registrarAsistencia(user,actividad,idadmin): Promise<any>
  {
    return new Promise(resolve => {
      let params: any = { user: user, actividad: actividad, admin:idadmin };
      this.http.post<any>(this.urlBaseAPI + "registrarAsistencia.php",
        params,
        httpOptions
      )
        .subscribe(
          data => {
            if(data['success']){
              resolve(data['success']);
            }else{
              resolve(data['success']);
            }
          },
          err => {
            console.log("Error occured"+err);
          });
    });
  }

}
