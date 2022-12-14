import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';


@Injectable({
  providedIn: 'root'
})
export class ApiGsiSerchService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointGsi + environment.EndPoint.apiGsiVersion + '/serch';


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public serchSlip(serchArea1: string, serchArea2: string, serchCategory: string ): Observable<any> {

    // 引数設定状況によって検索条件を組み合わせる
    if(serchArea1 == '0') {

    }



    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "userId": serchArea1,
        "userValidDiv": '0'
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/userinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipDetailInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



}
