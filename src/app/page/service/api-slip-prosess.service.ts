import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';

@Injectable({
  providedIn: 'root'
})
export class ApiSlipProsessService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointSLIPPROSESS + environment.EndPoint.apiGsiVersion + '/slipprocess';


  /**
   * 取引開始を申し込む
   * @param user
   * @returns
   */
  public sendTransactionReq(slipNo: string, id: string, name:string,  serviceType: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "TRANSACTIONREQUEST",
      "Keys": {
        "slipNo" : slipNo,
        "requestId" : id,
        "requestUserName": name,
        "serviceUserType" : serviceType,
        "requestType" : '0',
        "files" : '',
        "requestStatus" : '0',
        "confirmDiv" : '0',
        "deadline" : '',
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/sendtransactionrequest', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  public approvalTransaction(req: serviceTransactionRequest, adminId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "CONFIRMTRANSACTION",
      "Keys": {
        "slipNo" : req.slipNo,
        "requestId" : req.requestId,
        "requestUserName": req.requestUserName,
        "serviceUserType" : req.serviceUserType,
        "requestType" : req.requestType,
        "files" : req.files,
        "requestStatus" : req.requestStatus,
        "confirmDiv" : req.confirmDiv,
        "deadline" : req.deadline,
        "adminUser": adminId,
        "confirmUser" : req.requestId
      }
    };
    return this.http.post<serviceTransactionRequest>(this.apiEndPoint + '/slipmegprmuser', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: serviceTransactionRequest) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }




}