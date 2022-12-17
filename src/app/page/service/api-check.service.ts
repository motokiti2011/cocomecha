import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiCheckService {

  constructor(
    private http: HttpClient,
  ) { }


  private apiEndPoint: string = environment.EndPoint.apiEmdPointCheck + environment.EndPoint.apiCheckVersion + '/check';

  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public checkSlipPrm(slipNo: string, userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CHECK",
      "Keys": {
        "slipNo": slipNo,
        "userId": userId
      }
    };
    return this.http.post<boolean>(this.apiEndPoint + '/slipmegprmuser', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: boolean) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


}
