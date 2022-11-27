import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { catchError, Observable, of, } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { slipMessageInfo, dispSlipComment, defaltDispSlipComment } from 'src/app/entity/slipMessageInfo';
import { sortBy as _sortBy } from 'lodash';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionMessageService {

  private apiEndPoint: string = 'http://localhost:8080/v1/';

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  /**
   * 伝票情報のメッセージ情報を取得する 
   */
  public getSlipMessage(slipNo: string): Observable<slipMessageInfo[]> {
    return this.http.get<slipMessageInfo[]>(`${this.apiEndPoint + 'slipcomment/slipmessage/getslip/' + slipNo}`);
  }

  /**
   * 
   * @param userName 
   * @param slipNo 
   * @param sendText 
   * @returns 
   */
  public sernderMessage(userId:string, userName: string, slipNo: string, sendId: string, sendText: string): Observable<number> {
    // 伝票情報からマイリスト情報登録用データを生成する

    const comment: slipMessageInfo = {
      commentId: '0',
      slipNo: slipNo,
      displayOrder: '0',
      userId: userId,
      sendUserName: userName,
      comment: sendText,
      sendAdress:sendId,
      logicalDeleteDiv: '0',
      sendDate: String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
    }
    return this.http.post(this.apiEndPoint + 'slipcomment/slipcommentpost', comment, { observe: 'response' })
      .pipe(
        // HTTPステータスコードを戻す
        map((res: HttpResponse<any>) => res.status),
        // エラー時もHTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(err.status))
      );
  }



  /**
   * 画面表示するメッセージ情報を設定する
   * @param comment 
   * @param adminDiv 
   * @param useId 
   * @returns 
   */
  public settingMessage(comment: slipMessageInfo[], adminDiv: boolean, useId: string): dispSlipComment[] {
    let resultList: dispSlipComment[] = [];
    if (adminDiv) {
      // 画面アクセス者が伝票管理者の場合
      resultList = this.adminDispSetting(comment, useId);
    } else {
      // その他ユーザーの場合
      resultList = this.gestDispSetting(comment, useId);
    }
    return resultList;
  }

  /**
   * 管理者メッセージ表示設定を行う。
   * @param comment 
   */
  private adminDispSetting(comment: slipMessageInfo[], userId: string): dispSlipComment[] {
    let resultList: dispSlipComment[] = [];
    comment.forEach(data => {
      // コメントが管理者投稿の場合
      if (data.userId = userId) {
        // (true → 左)
        resultList.push(this.setDispMsg(data, true));
      } else {
        // 管理者以外の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      }
    });
    // 表示順でソートして返却
    return _sortBy(resultList, 'displayOrder');
  }

  /**
   * ゲストアクセス用メッセージ表示設定を行う
   * @param comment 
   * @param userId 
   */
  private gestDispSetting(comment: slipMessageInfo[], userId: string): dispSlipComment[] {
    let resultList: dispSlipComment[] = [];
    // 宛先がゲストか全体メッセージのみを設定する
    comment.forEach(data => {
      if (data.userId == userId) {
        // 自身投稿メッセージの場合(true → 左)
        resultList.push(this.setDispMsg(data, true));
      } else if (data.sendAdress == userId) {
        // 宛先が自身の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      } else if (data.sendAdress == '') {
        // 宛先が全体の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      }
    });
    // 表示順でソートして返却
    return _sortBy(resultList, 'displayOrder');
  }


  /**
   * 表示コメント情報を作成する。
   * @param data 
   * @param position 
   * @returns 
   */
  private setDispMsg(data: slipMessageInfo, position: boolean): dispSlipComment {
    const dispComment: dispSlipComment = {
      // コメントID
      commentId: data.commentId,
      // 表示位置
      position: position,
      // 伝票番号
      slipNo: data.slipNo,
      // 表示順
      displayOrder: data.displayOrder,
      // 投稿ユーザーID
      userId: data.userId,
      // 投稿ユーザー名
      sendUserName: data.sendUserName,
      // コメント
      comment: data.comment,
      // 投稿宛先
      sendAdress: data.sendAdress,
      // 論理削除フラグ
      logicalDeleteDiv: data.logicalDeleteDiv,
      // 投稿日時
      sendDate: data.sendDate
    }
    return dispComment;
  }

  /**
   * ゲストユーザー時の宛先情報設定する
   */
  public sendAdressSetting(): { sendId: string, name: string }[] {
    let returnList: { sendId: string, name: string }[] = [];
    returnList.push({ sendId: '0', name: '伝票管理者宛' });
    returnList.push({ sendId: '', name: '全体' })
    return returnList;
  }

  /**
   * 伝票許可ユーザー情報を取得し宛先リストを生成する
   * @param slipNo 
   */
  public getSendAdress(slipNo: string): Observable<slipMegPrmUser[]> {
    return this.http.get<slipMegPrmUser[]>(`${this.apiEndPoint + 'slipmegprmuser/' + slipNo}`)
  }

  /**
   * 伝票管理者の宛先設定を行う
   * @param userId
   * 
   */
  public setAdminAdress(userId: string, megPrmUser: slipMegPrmUser): { sendId: string, name: string }[] {
    let returnList: { sendId: string, name: string }[] = [];
    returnList.push({ sendId: '0', name: '伝票管理者宛' });
    returnList.push({ sendId: '', name: '全体' })
    megPrmUser.permissionUserList.forEach(user => {
      if (user.parmissionDiv != '1') {
        returnList.push({ sendId: user.userId, name: user.userName });
      }
    });
    return returnList;
  }


}
