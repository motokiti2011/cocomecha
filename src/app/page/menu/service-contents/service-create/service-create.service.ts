import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ModalData, nextActionButtonType, nextActionButtonTypeMap } from 'src/app/entity/nextActionButtonType';
import { serviceContents } from 'src/app/entity/serviceContents';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';

@Injectable({
  providedIn: 'root'
})
export class ServiceCreateService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = 'http://localhost:8080/v1/slipdetail/slippost';

  // 伝票情報を更新する
  public servicePost(contents: slipDetailInfo): Observable<number> {
    return this.http.post(this.apiEndPoint, contents, { observe: 'response' }).pipe(
      // HTTPステータスコードを戻す
      map((res: HttpResponse<any>) => res.status),
      // エラー時もHTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }


  public converSlipDetail(content: serviceContents): slipDetailInfo {
    const result: slipDetailInfo = {
      // slipNo: '0',
      // slipAdminUserId: content.useId,
      // slipAdminUserName: '',
      // title: content.title,
      // category: String(content.category),
      // areaNo1: String(content.area),
      // price: String(content.price),
      // bidMethod: String(content.bidMethod),
      // bidderId: '0',
      // bidEndDate: String(content.preferredTime),
      // explanation: content.explanation,
      // displayDiv: '0',
      // preferredDate: String(content.preferredDate),
      // preferredTime: String(content.preferredTime),
      // completionDate: String(content.preferredDate),
      // transactionCompletionDate: '0',
      // deleteDiv: '0',
      // imageUrlList: '',
      // messageOpenLebel: '1'

      // 伝票番号
      slipNo: '0',
      // 削除区分
      deleteDiv: '0',
      // サービスカテゴリー
      category: String(content.category),
      // 伝票管理者ユーザーID
      slipAdminUserId: content.useId,
      // 伝票管理者ユーザー名
      slipAdminUserName: '0',
      // 伝票管理事業所ID
      slipAdminOffice: '0',
      // 伝票管理事業所名
      slipAdminOfficeName: '0',
      // 伝票管理拠点ID
      slipAdminBaseId: '0',
      // 伝票管理拠点名
      slipAdminBaseName: '0',
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
      targetService: '0',
      // 対象車両ID
      targetVehicleId: '0',
      // 対象車両名
      targetVehicleName: '0',
      // 対象車両情報
      targetVehicleInfo: '0',
      // 作業場所情報
      workAreaInfo: '0',
      // 希望日
      preferredDate: String(content.preferredDate),
      // 希望時間
      preferredTime: String(content.preferredTime),
      // 完了日
      completionDate: String(content.preferredDate),
      // 取引完了日
      transactionCompletionDate: '0',
      // 画像URLリスト
      imageUrlList: '0',
      // メッセージ公開レベル
      messageOpenLebel: '1',
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
