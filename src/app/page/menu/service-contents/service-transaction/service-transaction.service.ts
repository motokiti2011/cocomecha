import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { find as _find } from 'lodash';
import { slipManegement } from 'src/app/entity/slipManegement';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { user } from 'src/app/entity/user';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {


  constructor(
    private apiService: ApiSerchService,
    private apGsiService: ApiGsiSerchService,
    private apCheckService: ApiCheckService,
    private apiUniqeService: ApiUniqueService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
    if(serviceType !== '0') {
      return this.apiUniqeService.getServiceContents(slipNo);
    }
    return this.apiUniqeService.getSlip(slipNo);
  }

  /**
   * アクセス者情報取得
   * @param userId
   */
  public getSendName(userId: string): Observable<any> {
    return this.apiService.getUser(userId);
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
  public postMessageLevel(slip: slipDetailInfo, messsageLevele: string): Observable<any> {
    let data:slipDetailInfo = slip;
    data.messageOpenLebel = messsageLevele;
    return this.apiService.postSlip(data);
  }

  /**
   * メッセージ許可申請を行う
   */
  public messagePrmReq(userId:string, userName:string, slipNo:string) {
    return this.apiUniqeService.postMessageReq(userId, userName, slipNo);
  }

}
