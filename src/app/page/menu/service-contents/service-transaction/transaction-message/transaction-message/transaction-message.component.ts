import { Component, Input, OnInit } from '@angular/core';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { TransactionMessageService } from './transaction-message.service';
import { dispSlipComment } from 'src/app/entity/slipMessageInfo';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { isNil as _isNil, find as _find } from 'lodash';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
  /** 管理者区分 */
  adminDiv = false;
  /** サービスID */
  serviceId = '';
  /** アクセスユーザー */
  acceseUser = '';


  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  /** 伝票番号 */
  @Input() dispSlipId: string = '';
  /** 管理者ユーザーフラグ */
  @Input() adminUserDiv: boolean = false;
  /** アクセスユーザー情報 */
  @Input() acsessUser = { userId: '', userName: '' };

  constructor(
    private auth: AuthUserService,
    private service: TransactionMessageService,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 表示処理
   * @param serviceId
   * @param acceseUser
   */
  onShow(serviceId:string, acceseUser: string) {
    this.dispDiv = true;
    this.serviceId = serviceId;
    this.acceseUser = acceseUser;
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    // 伝票メッセージ情報を取得
    this.service.getSlipMessage(serviceId).subscribe(data => {
      console.log(data);
      this.service.checkAdminSlip(serviceId, acceseUser).subscribe(check => {
        this.adminDiv = check
        this.setDispMessage();
      });
    });
    this.setAdress();
  }

  /**
   * 表示メッセージを作成する
   */
  private setDispMessage() {
    this.service.getSlipMessage(this.serviceId).subscribe(data => {
        if(this.acceseUser) {
          this.dispMessageList = this.service.adminDispSetting(data, this.acceseUser)
        } else {
          this.dispMessageList = this.service.gestDispSetting(data, this.acceseUser)
        }
        console.log(this.dispMessageList);
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
    });
  }

  /**
   * メッセージ非表示設定
   */
  onHidden() {
    this.privateMessage = 'メッセージは非表示となってます。'
    this.dispDiv = false;
  }

  /**
   * 宛先情報を設定する
   */
  private setAdress() {
    if (!this.adminUserDiv) {
      this.adressData = this.service.sendAdressSetting();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    }
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.service.getSendAdress(this.dispSlipId).subscribe(data => {
      this.adressData = this.service.setAdminAdress(this.acsessUser.userId, data[0]);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
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
          if (data.ResponseMetadata.HTTPStatusCode === 200) {
            // 連続投稿防止のためメッセージ初期化
            this.sernderMessage = '';
            this.isDisabled = true;
            // 再読み込みを実施
            this.setDispMessage();
          } else {
            console.log('メッセージ登録失敗です。')
          }
        });
    }


  }

}
