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
export class AuthService {
  public isLogged: boolean;
  public message: string;
  private urlBaseAPI: string;



  constructor(public http: HttpClient) {
    this.urlBaseAPI = Config.urlBaseAPI;
    this.isLogged = false;
  }


  public loginWithEmail(user): Promise<any>
  {
    return new Promise(resolve => {
      let params: any = { email: user.username, pass: user.password };
      this.http.post<any>(this.urlBaseAPI + "loginadministrator.php",
        params,
        httpOptions
      )
        .subscribe(
          data => {
            if(data['success']){
              this.createSessionLocalStorage(data['id'], data['nombreyapellidoInput']);
              this.isLogged = true;
              resolve(data);
            }else{
              resolve(data['message']);
            }
          },
          err => {
            console.log("Error occured"+err);
          });
    });
  }


  public createSessionLocalStorage(userId: string, userName: string)
  {
    localStorage.setItem('userid', userId);
    localStorage.setItem('username', userName);
  }

}
