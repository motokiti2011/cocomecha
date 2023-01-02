import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { nextActionButtonType } from 'src/app/entity/nextActionButtonType';
import { serviceContents } from 'src/app/entity/serviceContents';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCreateService {

  constructor(
    private apiUniqueService: ApiUniqueService,
  ) { }

  // 伝票情報を更新する
  public postSlip(contents: serviceContents): Observable<number> {

    const data = this.converSlipDetail(contents)
    return this.apiUniqueService.initPostSlip(data);
  }

  /**
   * 販売サービス情報を更新する
   * @param contents
   * @returns
   */
  public postSalesService(contents: serviceContents): Observable<number> {
    const data = this.converSalesService(contents);
    return this.apiUniqueService.initPostSalesService(data);
  }

  /**
   * 伝票情報の更新情報を作成する
   * @param content
   * @returns
   */
  public converSlipDetail(content: serviceContents): slipDetailInfo {
    const result: slipDetailInfo = {
      // 伝票番号
      slipNo: '0',
      // 削除区分
      deleteDiv: '0',
      // サービスカテゴリー
      category: String(content.category),
      // 伝票管理者ユーザーID
      slipAdminUserId: content.userId,
      // 伝票管理者ユーザー名
      slipAdminUserName: '',
      // 管理者区分
      adminDiv: '0',
      // タイトル
      title: content.title,
      // サービス地域1
      areaNo1: String(content.area),
      // サービス地域2
      areaNo2: '0',
      // 価格
      price: String(content.price),
      // 入札方式
      bidMethod: String(content.bidMethod),
      // 入札者ID
      bidderId: '0',
      // 入札終了日
      bidEndDate: String(content.preferredTime),
      // 説明
      explanation: content.explanation,
      // 表示区分
      displayDiv: '0',
      // 工程ステータス
      processStatus: '0',
      // 対象サービス内容
      targetService: content.targetService,
      // 対象車両ID
      targetVehicleId: content.targetVehcle,
      // 対象車両名
      targetVehicleName: '',
      // 対象車両情報
      targetVehicleInfo: '0',
      // 作業場所情報
      workAreaInfo: content.workArea,
      // 希望日
      preferredDate: String(content.preferredDate),
      // 希望時間
      preferredTime: String(content.preferredTime),
      // 完了日
      completionDate: String(content.preferredDate),
      // 取引完了日
      transactionCompletionDate: '0',
      // サムネイルURL
      thumbnailUrl: '',
      // 画像URLリスト
      imageUrlList: [],
      // メッセージ公開レベル
      messageOpenLebel: content.msgLv,
      // 更新ユーザーID
      updateUserId: '0',
      // 登録年月日
      created: '0',
      // 更新日時
      updated: '0'
    }
    return result;
  }



  /**
   * 販売サービス情報の更新情報を作成する
   * @param content
   * @returns
   */
  public converSalesService(content: serviceContents): salesServiceInfo {
    const result: salesServiceInfo = {
      // 伝票番号
      slipNo: '0',
      // 削除区分
      deleteDiv: '0',
      // サービスカテゴリー
      category: String(content.category),
      // 伝票管理者ユーザーID
      slipAdminUserId: content.userId,
      // 伝票管理者ユーザー名
      slipAdminUserName: '',
      // 伝票管理事業所ID
      slipAdminOfficeId: '0',
      // 伝票管理事業所名
      slipAdminOfficeName: '',
      // 伝票管理拠点ID
      slipAdminMechanicId: '0',
      // 伝票管理拠点名
      slipAdminMechanicName: '',
      // 管理者区分
      adminDiv: '0',
      // タイトル
      title: content.title,
      // サービス地域1
      areaNo1: String(content.area),
      // サービス地域2
      areaNo2: '0',
      // 価格
      price: String(content.price),
      // 入札方式
      bidMethod: String(content.bidMethod),
      // 入札者ID
      bidderId: '0',
      // 入札終了日
      bidEndDate: String(content.preferredTime),
      // 説明
      explanation: content.explanation,
      // 表示区分
      displayDiv: '0',
      // 工程ステータス
      processStatus: '0',
      // 対象サービス内容
      targetService: content.targetService,
      // 対象車両ID
      targetVehicleId: content.targetVehcle,
      // 対象車両名
      targetVehicleName: '',
      // 対象車両情報
      targetVehicleInfo: '0',
      // 作業場所情報
      workAreaInfo: content.workArea,
      // 希望日
      preferredDate: String(content.preferredDate),
      // 希望時間
      preferredTime: String(content.preferredTime),
      // 完了日
      completionDate: String(content.preferredDate),
      // 取引完了日
      transactionCompletionDate: '0',
      // サムネイルURL
      thumbnailUrl: '',
      // 画像URLリスト
      imageUrlList: [],
      // メッセージ公開レベル
      messageOpenLebel: content.msgLv,
      // 更新ユーザーID
      updateUserId: '0',
      // 登録年月日
      created: '0',
      // 更新日時
      updated: '0'
    }
    return result;
  }






  /**
   * 遷移ルートを返却する
   * @param next
   * @returns
   */
  public nextNav(next: string): string {
    let nextLinc = '';
    if (next == nextActionButtonType.TOP) {
      nextLinc = 'main_menu';
    } else if (next == nextActionButtonType.MYMENU) {
      nextLinc = 'transaction_menu';
    } else if (next == nextActionButtonType.SERVICECREATE) {
      nextLinc = '99';
    } else if (next == nextActionButtonType.SERVICEDETAEL) {
      nextLinc = 'main_menu';
    }
    return nextLinc;
  }




}
