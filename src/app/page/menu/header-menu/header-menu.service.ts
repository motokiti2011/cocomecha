import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { credentials } from 'src/app//entity/credentials';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { loginUser } from 'src/app/entity/loginUser';

@Injectable({
  providedIn: 'root'
})
export class HeaderMenuService {

  authenticated = false;

  constructor(private http: HttpClient) {
  }

  /**
   * ログイン処理
   * @param credentials 
   * @returns 
   */
  authenticate(credentials: credentials): Observable<any> {
    const headers = new HttpHeaders(credentials ? {
      authorization: btoa(credentials.mailaddress + ':' + credentials.password)
    } : {});

    return this.http.get('http://localhost:8080/v1/login', { headers: headers });

  }

  // authenticate(credentials: credentials, callback :any) {

  //   const headers = new HttpHeaders(credentials ? {
  //     authorization: 'Basic ' + btoa(credentials.loginid + ':' + credentials.password)
  //   } : {});

  //   this.http.get('http://localhost:8080/v1/login', { headers: headers }).subscribe(response => {
  //     if (response) {
  //       console.log(response)
  //   // if (response['name']) {
  //       this.authenticated = true;
  //     } else {
  //       this.authenticated = false;
  //     }
  //     return callback && callback();
  //   });

  // }

}
