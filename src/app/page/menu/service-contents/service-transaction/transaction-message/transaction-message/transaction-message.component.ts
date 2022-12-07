import { Component, Input, OnInit } from '@angular/core';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { TransactionMessageService } from './transaction-message.service';
import { dispSlipComment } from 'src/app/entity/slipMessageInfo';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { isNil as _isNil, find as _find } from 'lodash';

@Component({
  selector: 'app-transaction-message',
  templateUrl: './transaction-message.component.html',
  styleUrls: ['./transaction-message.component.scss']
})
export class TransactionMessageComponent implements OnInit {

  /** メッセージ公開レベル */
  dispDiv = false;
  /** 非公開時メッセージ */
  privateMessage = 'このメッセージは非公開となってます';
  /** 投稿メッセージ */
  sernderMessage = '';
  /** 投稿ボタン活性フラグ */
  isDisabled = true;
  /** 伝票メッセージリスト */
  dispMessageList: dispSlipComment[] = [];
  /** 宛先選択状態初期値 */
  adressSelect = '';
  /** 宛先選択情報 */
  adressData: { sendId: string, name: string }[] = [];
  /** 宛先情報 */
  adressId: string = '';
  /** 伝票番号 */
  @Input() dispSlipId: string = '';
  /** 管理者ユーザーフラグ */
  @Input() adminUserDiv: boolean = false;
  /** アクセスユーザー情報 */
  @Input() acsessUser = { userId: '', userName: '' };

  constructor(
    private auth: AuthUserService,
    private service: TransactionMessageService,
  ) { }

  ngOnInit(): void {
    // 認証ユーザー情報取得
    this.auth.user$.subscribe(userOrNull => {
      if (userOrNull == null || userOrNull == undefined) {
        // 以降のデータ取得処理を行わない
        return;
      }
      console.log(this.dispSlipId);
      // 伝票情報取得不正の場合
      if (this.dispSlipId == undefined || this.dispSlipId == null) {
        this.privateMessage = 'データ取得に失敗しました。'
        this.dispDiv = false;
      } else {
        this.dispDiv = true;
        // 伝票メッセージ情報を取得
        this.service.getSlipMessage(this.dispSlipId).subscribe(data => {
          console.log(data);
          // 表示内容を設定する
          this.dispMessageList = this.service.settingMessage(
            data, this.adminUserDiv, this.acsessUser.userId)
          console.log(this.dispMessageList);
        });
        this.setAdress();
      }
    });
  }


  /**
   * 宛先情報を設定する
   */
  private setAdress() {
    if (!this.adminUserDiv) {
      this.adressData = this.service.sendAdressSetting();
      return;
    }
    this.service.getSendAdress(this.dispSlipId).subscribe(data => {
      this.adressData = this.service.setAdminAdress(this.acsessUser.userId, data[0]);
    })
  }

  /**
   *　宛先変更イベント 
   */
  selectAdress() {
    console.log(this.adressSelect)
    const adress = _find(this.adressData, data => data.sendId == this.adressSelect)
    if (adress != undefined) {
      this.adressId = adress.sendId;
    }
  }

  /**
   * 送信メッセージイベント
   */
  sendMessage() {
    if (this.sernderMessage != '') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * 送信メッセージイベント
   */
  onSendMessage() {
    if (_isNil(this.sernderMessage) || this.sernderMessage == '') {
      // 空文字の場合登録しない
      return;
    }
    if (this.acsessUser.userId == '') {
      return;
    }
    if (!_isNil(this.acsessUser.userId)) {
      this.service.sernderMessage(
        this.acsessUser.userId,
        this.acsessUser.userName,
        this.dispSlipId,
        this.adressId,
        this.sernderMessage)
        .subscribe(data => {
          if (data === 200) {
            // 連続投稿防止のためメッセージ初期化
            this.sernderMessage = '';
            this.isDisabled = true;
            // 再読み込みを実施
            this.ngOnInit();
          } else {
            console.log('メッセージ登録失敗です。')
          }
        });
    }


  }

}
