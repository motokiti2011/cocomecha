import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, } from '@angular/common/http';

// import { RequestOptions } from '@angular/http';
import { catchError, Observable, of, } from 'rxjs';
import { slipDetailInfo, defaultSlip } from 'src/app/entity/slipDetailInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { find as _find } from 'lodash';
import { noUndefined } from '@angular/compiler/src/util';
import { slipManegement } from 'src/app/entity/slipManegement';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';


@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {


  constructor(
    private http: HttpClient,
    private apiService: ApiSerchService,
    private apGsiService: ApiGsiSerchService,
    private apCheckService: ApiCheckService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param id
   * @returns
   */
  public getService(slipNo: string): Observable<slipDetailInfo[]> {
    return this.apiService.getSlip(slipNo);
  }

  /**
   * 画面表示する地域名を取得する。
   * @param areaId
   * @returns
   */
  public areaNameSetting(areaId: string): string {
    const areaName = _find(prefecturesCoordinateData, data => data.id == Number(areaId))?.prefectures
    if (areaName === undefined) {
      return '';
    }
    return areaName;
  }

  /**
   * 伝票の管理者判定を行う
   * @param slipId
   * @param userId
   */
  public slipAuthCheck(slipId: string, userId: string): Observable<slipManegement[]> {
    return this.apGsiService.serchSlipAuthCheck(userId);
  }

  /**
   * メッセージ許可済ユーザー情報かを判定する
   * @param slipNo
   * @param userId
   * @returns
   */
  public isSlipUserPermission(slipNo: string, userId: string): Observable<boolean> {
    return this.apCheckService.checkSlipPrm(slipNo, userId);

  }

  /**
   * 伝票情報のメッセージレベルを更新する。
   * @param slipNo
   * @param messsageLevele
   * @returns 更新後伝票情報
   */
  public postMessageLevel(slipNo: string, messsageLevele: string): Observable<any> {
    let data:slipDetailInfo = defaultSlip;
    data.slipNo = slipNo;
    data.messageOpenLebel = messsageLevele;
    return this.apiService.postSlip(data);
    // return this.http.put<slipDetailInfo>(this.apiEndPoint + 'slipdetail/slipmessagelv',data , { observe: 'response' });
  }

  /**
   * メッセージ許可申請を行う
   */
  public messagePrmReq(userId:string, slipNo:string) {
    let data:slipDetailInfo = defaultSlip;
    data.slipNo = slipNo;
    


    // return this.http.put<slipDetailInfo>(this.apiEndPoint + 'slipdetail/slipmessagelv',data , { observe: 'response' });
  }



}
