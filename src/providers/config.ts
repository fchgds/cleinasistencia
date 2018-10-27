import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  static urlBaseAPI: string = 'https://www.clein.org/api/';

  constructor(public http: HttpClient) {
  }


  public static getLoggedUserId(): any {
    let userId = window.localStorage.getItem('userid');
    if (userId == '') {
      return null
    }
    return userId;
  }
}
