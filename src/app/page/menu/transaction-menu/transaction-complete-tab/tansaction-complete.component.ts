import { Component, OnInit } from '@angular/core';
import { serviceContents } from 'src/app/entity/serviceContents';
import { detailList } from 'src/app/entity/detailList';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { TransactionMenuService } from '../transaction-menu.service';
import { TansactionCompleteService } from './transaction-complete-detail/tansaction-complete.service';
import {
  find as _find,
  cloneDeep as _cloneDeep,
  pull as _pull,
  remove as _remove,
  difference as _difference,
  isNil as _isNil
} from 'lodash';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';

@Component({
  selector: 'app-tansaction-complete',
  templateUrl: './tansaction-complete.component.html',
  styleUrls: ['./tansaction-complete.component.scss']
})
export class TansactionCompleteComponent implements OnInit {

  HEAD = {
    check: '',
    title: 'タイトル',
    contents: '内容',
    area: '地域',
    category: 'カテゴリー',
    price: '価格',
    whet: '期間',
    endDate: '終了日'
  };

  /** 表示用リスト */
  detailList: any = [];

  /** チェックリスト */
  selectionList: any = [];

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

  /** ログインユーザー情報 */
  loginUser: loginUser = { userId: '', userName: '',mechanicId:null, officeId:null };

  selectType = '0';

  constructor(
    private location: Location,
    private router: Router,
    private service: TransactionMenuService,
    private compService: TansactionCompleteService,
    private auth: AuthUserService,
    public modal: MatDialog,

  ) { }

  ngOnInit(): void {
    this.setListSetting();
  }

  /**
   * 表示リストの初期設定を行います。
   */
  private setListSetting() {
    this.auth.userInfo$.subscribe(user => {
      // 未認証の場合前画面へ戻る
      if (user == undefined || user == null || user.userId == '') {
        // ダイアログ表示し前画面へ戻る
        const dialogData: messageDialogData = {
          massage: '情報の取得に失敗しました。もう一度操作してください',
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
          return;
        });
      } else {
        // ユーザー情報を設定する
        this.loginUser = user;
      }
      // データを取得
      this.compService.getTransactionCompSlip(this.loginUser.userId, this.selectType).subscribe(data => {
        this.detailList = this.compService.dispContentsSlip(data)
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
    console.log(this.hedSelection)
    const dispList: detailList[] = _cloneDeep(this.detailList);

    dispList.forEach((content) => {
      // check をすべてヘッダと同じ状態にする
      content.check = this.hedSelection;

      if (this.hedSelection) {
        this.selectionList.push(content.id)
      } else {
        _pull(this.selectionList, content.id)
      }
    });
    this.detailList = dispList;

    // 削除ボタンの制御
    if (this.selectionList.length > 0) {
      this.checkbutton = false;
    } else {
      this.checkbutton = true;
    }

  }

  /** 削除ボタン押下時のイベント */
  deleteCheck() {
    const List: [] = _cloneDeep(this.selectionList);
    const deleteList: detailList[] = []

    List.forEach((select) => {
      // 削除対象を取得する
      if (_find(this.detailList, disp => disp.id === select)) {
        deleteList.push(_find(this.detailList, disp => disp.id === select));
      }
    });

    // 差集合を抽出
    const dispList = _difference(this.detailList, deleteList);
    // 表示リストを書き換える。
    this.detailList = _cloneDeep(dispList);

    // 削除するデータをＡＰＩへ
    /**  */

  }

  /**
   * タイトルクリック時、詳細画面へ遷移する
   * @param content
   */
  contentsDetail(content: serviceContents) {
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: content.id } });
  }

  /**
   *  並び順変更イベント
   *
   */
  changeOrder() {
    console.log(this.selected)
    const order = _find(this.orderMenu, order => order.value === this.selected)

    if (!_isNil(order)) {
      this.detailList = this.service.sortOrderList(this.detailList, order.id);
      console.log(this.detailList);
    }
  }

/**
 * 前画面に戻る
 */
  onReturn() {
    this.location.back();
  }



}
