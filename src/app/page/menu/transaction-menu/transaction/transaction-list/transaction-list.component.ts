import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionMenuService } from '../../transaction-menu.service';
import { TransactionListService } from './transaction-list.service';
import {
  find as _find,
  cloneDeep as _cloneDeep,
  pull as _pull,
  remove as _remove,
  difference as _difference,
  isNil as _isNil
} from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import {dispTransactionContents } from 'src/app/entity/transactionContents';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';
import { transactionSlip } from 'src/app/entity/transactionSlip';


@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  HEAD = {
    check: '',
    title: 'タイトル',
    relation: '関係性',
    adminName: '管理者名',
    completionScheduledDate: '完了予定日',
  };

  /** 表示用リスト */
  detailList: transactionSlip[] = [];

  /** チェックリスト */
  selectionList: any = [];

  /** 一括選択チェック */
  hedSelection: boolean = false;

  /** 削除ボタン活性フラグ */
  checkbutton: boolean = true;


  // 並び順選択
  selected = '';

  orderMenu = [
    { id: 1, value: '残り期間が短い順' },
    { id: 2, value: '残り期間が長い順' },
    { id: 3, value: '価格が安い順' },
    { id: 4, value: '価格が高い順' },
  ];

  /** ログインユーザー情報 */
  loginUser: loginUser = { userId: '', userName: '', mechanicId: null, officeId: null };

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private location: Location,
    private router: Router,
    private service: TransactionListService,
    private Menuservice: TransactionMenuService,
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
    this.loading = true;
    this.auth.userInfo$.subscribe(user => {
      // ユーザー情報取得できない場合前画面へ戻る
      if (user == undefined || user == null || user.userId == '') {
        // ダイアログ表示（もう一度操作してください）し前画面へ戻る
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
          this.onReturn();
          // ローディング解除
          this.overlayRef.detach();
          this.loading = false;
          return;
        });
      } else {
        // ユーザー情報を設定する
        this.loginUser = user;
      }
      // データを取得
      this.service.getTransactionSlip(this.loginUser.userId, '0').subscribe(data => {
        this.detailList = this.service.dispContentsSlip(data)
        // this.detailList = data;
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
      });
    });
  }


  /**
   * チェックボックス選択時イベント
   * @param title
   * @param check
   */
  deleteSelection(title: String, check: boolean) {

    // チェック状態の場合リストに追加
    if (check) {
      this.selectionList.push(title);
    } else {
      _pull(this.selectionList, title);
    }

    // 削除ボタンの制御
    if (this.selectionList.length > 0) {
      this.checkbutton = false;
    } else {
      this.checkbutton = true;
    }

  }


  /**
   * 一括選択チェックボックスイベント
   */
  bulkSelection() {
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

  }

  /** 削除ボタン押下時のイベント */
  deleteCheck() {
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

  }

  /**
   * タイトルクリック時、詳細画面へ遷移する
   * @param content
   */
  contentsDetail(slipId: string) {
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: slipId } });
  }

  /**
    *  並び順変更イベント
    *
    */
  changeOrder() {
    console.log(this.selected)
    // const order = _find(this.orderMenu, order => order.value === this.selected)

    // if (!_isNil(order)) {
    //   this.detailList = this.service.sortOrderList(this.detailList, order.id);
    //   console.log(this.detailList);
    // }
  }

  /**
   * 前画面に戻る
   */
  onReturn() {
    this.location.back();
  }


}
