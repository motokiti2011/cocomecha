import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  find as _find,
  cloneDeep as _cloneDeep,
  pull as _pull,
  remove as _remove,
  difference as _difference,
  isNil as _isNil
} from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { dispUserMyList } from 'src/app/entity/userMyList';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { MyListService } from './my-list.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {

  HEAD = {
    readDiv: '既読/未読',
    msgPage: 'メッセージページ',
    adlessMsg: '宛先・メッセージ内容',
    messageDate: '日付',
  };

  /** 表示用リスト */
  detailList: dispUserMyList[] = [];

  // /** チェックリスト */
  // selectionList: any = [];

  /** 一括選択チェック */
  hedSelection: boolean = false;

  /** 削除ボタン活性フラグ */
  checkbutton: boolean = true;

  selected = '';

  orderMenu = [
    { id: 1, value: '残り期間が短い順' },
    { id: 2, value: '残り期間が長い順' },
    { id: 3, value: '価格が安い順' },
    { id: 4, value: '価格が高い順' },
  ];

  /** 取引中件数 */
  transactionCountMsg = '';
  /** メッセージ通知 */
  messageAlert = '';
  /** ログインユーザー情報 */
  loginUser: loginUser = { userId: '', userName: '', mechanicId: null, officeId: null };

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private location: Location,
    private router: Router,
    private mylistservice: MyListService,
    private auth: AuthUserService,
    public modal: MatDialog,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
    this.setListSetting();
  }

  /**
   * 表示リストの初期設定を行います。
   */
  private setListSetting() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.auth.userInfo$.subscribe(user => {
      // ユーザー情報取得できない場合前画面へ戻る
      if (user == undefined || user == null || user.userId == '') {
        // ダイアログ表示(もう一度操作してください）し前画面へ戻る
        const dialogData: messageDialogData = {
          massage: messageDialogMsg.AgainOperation,
          closeFlg: false,
          closeTime: 0,
          btnDispDiv: true
        }
        const dialogRef = this.modal.open(MessageDialogComponent, {
          width: '300px',
          height: '150px',
          data: dialogData
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          // ローディング解除
          this.overlayRef.detach();
          this.onReturn();
          return;
        });
      } else {
        // ユーザー情報を設定する
        this.loginUser = user;
      }
      // データを取得
      this.mylistservice.getMyList(this.loginUser.userId, '0').subscribe(data => {
        console.log(data);
        if (data.length === 0) {
          // data.push(this.mock);
        }
        this.detailList = this.mylistservice.displayFormatdisplayFormat(data);
        // ローディング解除
        this.overlayRef.detach();
      });
    });

  }

  // /**
  //  * チェックボックス選択時イベント
  //  * @param title
  //  * @param check
  //  */
  // deleteSelection(title: String, check: boolean) {

  //   // チェック状態の場合リストに追加
  //   if (check) {
  //     this.selectionList.push(title);
  //   } else {
  //     _pull(this.selectionList, title);
  //   }

  //   // 削除ボタンの制御
  //   if (this.selectionList.length > 0) {
  //     this.checkbutton = false;
  //   } else {
  //     this.checkbutton = true;
  //   }

  // }


  // /**
  //  * 一括選択チェックボックスイベント
  //  */
  // bulkSelection() {
  //   console.log(this.hedSelection)
  //   const dispList: detailList[] = _cloneDeep(this.detailList);

  //   dispList.forEach((content) => {
  //     // check をすべてヘッダと同じ状態にする
  //     content.check = this.hedSelection;

  //     if (this.hedSelection) {
  //       this.selectionList.push(content.id)
  //     } else {
  //       _pull(this.selectionList, content.id)
  //     }
  //   });
  //   this.detailList = dispList;

  //   // 削除ボタンの制御
  //   if (this.selectionList.length > 0) {
  //     this.checkbutton = false;
  //   } else {
  //     this.checkbutton = true;
  //   }

  // }

  // /** 削除ボタン押下時のイベント */
  // deleteCheck() {
  //   const List: [] = _cloneDeep(this.selectionList);
  //   const deleteList: detailList[] = []

  //   List.forEach((select) => {
  //     // 削除対象を取得する
  //     if (_find(this.detailList, disp => disp.id === select)) {
  //       deleteList.push(_find(this.detailList, disp => disp.id === select));
  //     }
  //   });

  //   // 差集合を抽出
  //   const dispList = _difference(this.detailList, deleteList);
  //   // 表示リストを書き換える。
  //   this.detailList = _cloneDeep(dispList);

  //   // 削除するデータをＡＰＩへ
  //   /**  */

  // }

  /**
   * タイトルクリック時、詳細画面へ遷移する
   * @param content
   */
  contentsDetail(content: dispUserMyList) {
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: content.slipNo, searchTargetService: content.serviceType } });
  }

  /**
   *  並び順変更イベント
   *
   */
  changeOrder() {
    //   console.log(this.selected)
    //   const order = _find(this.orderMenu, order => order.value === this.selected)

    //   if (!_isNil(order)) {
    //     this.detailList = this.service.sortOrderList(this.detailList, order.id);
    //     console.log(this.detailList);
    //   }
  }


  /**
   * 前画面に戻る
   */
  onReturn() {
    this.location.back();
  }


}
