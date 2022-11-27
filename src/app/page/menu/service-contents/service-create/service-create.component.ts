import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serviceContents } from 'src/app/entity/serviceContents';
import { ModalData, nextActionButtonTypeMap } from 'src/app/entity/nextActionButtonType';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { monthMap } from 'src/app/entity/month';
import { nextActionButtonType, nextActionMessageType, nextActionTitleType } from 'src/app/entity/nextActionButtonType';
import { ServiceCreateService } from './service-create.service';
import { NextModalComponent } from 'src/app/page/modal/next-modal/next-modal/next-modal.component';
import { AuthService } from 'src/app/page/auth/auth.service';


@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})


export class ServiceCreateComponent implements OnInit {

  /** 入力中データ情報 */
  inputData: serviceContents =
    { id: '0', useId: '0' ,title: '', price: 0, area: 0, category: 0, bidMethod: 1, explanation: '', bidderId: 0, favoriteFlg:false ,registeredDate: 0, preferredDate: 0, preferredTime: 0, logicalDeleteFlag: 0, imageUrl:'' };

  /** 入札方式選択状態初期値 */
  selected = 1;

  /** 地域情報選択状態初期値 */
  areaSelect = ''

  /** カテゴリー選択状態初期値 */
  categorySelect = '';

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);

  /** カテゴリー */
  categoryData = serchCategoryData

  /** 価格追跡 */
  formPrice = '';
  priceFormDiv = true;

  pricePlace = '価格'

  // submitボタン活性制御
  invalid = true;

  /**  価格フォーム表示フラグ */

  /** 必須フラグ */
  titleDiv = true;
  areaDiv = true;
  categoryDiv = true;
  priceDiv = true;
  explanationDiv = true;
  preferredDateDiv = true;
  timeDiv = true;


  /** エラーフラグ */
  errorFlg = false;
  errorDayFlg = false;

  /** エラーメッセージ */
  errormessage = '';

  errormessageDay = '';

  startDate = 0;

  /** 入札方式 */
  bidMethodData = [
    { id: 1, label: '自分で設定', value: 'yourself', disabled: false },
    { id: 2, label: 'オークション方式', value: 'auction', disabled: false },
    { id: 3, label: '見積り希望', value: 'estimate', disabled: false }
  ]

  /** 希望時間 */
  timeData = [
    { id: '1', select: '1時' }, { id: '2', select: '2時' }, { id: '3', select: '3時' }, { id: '4', select: '4時' }, { id: '5', select: '5時' }, { id: '6', select: '6時' },
    { id: '7', select: '7時' }, { id: '8', select: '8時' }, { id: '9', select: '9時' }, { id: '10', select: '10時' }, { id: '11', select: '11時' }, { id: '12', select: '12時' },
    { id: '13', select: '13時' }, { id: '14', select: '14時' }, { id: '15', select: '15時' }, { id: '16', select: '16時' }, { id: '17', select: '17時' }, { id: '18', select: '18時' },
    { id: '19', select: '19時' }, { id: '20', select: '20時' }, { id: '21', select: '21時' }, { id: '22', select: '22時' }, { id: '23', select: '23時' }, { id: '24', select: '24時' },
  ]

  /**  */
  timeSelect = '';

  constructor(
    private location: Location,
    private service: ServiceCreateService,
    public loginModal: MatDialog,
    private router: Router,
    private auth:AuthService,
  ) { }

  ngOnInit(): void {
    // フォームを初期化する
    this.inputData = { id: '0', useId: '0', title: '', price: 0, area: 0, category: 0, bidMethod: 1, explanation: '', bidderId: 0, favoriteFlg:false, registeredDate: 0, preferredDate: 0, preferredTime: 0, logicalDeleteFlag: 0, imageUrl:'' };
    // ログイン前提のためユーザー情報を取得する。
    // ユーザーIDを設定する
  }



  /**
   *  変更監視
   */
  cangeMonitoring() {
    // タイトル変更監視
    if (_isNil(this.inputData.title)
      || this.inputData.title === '') {
      this.titleDiv = true;
    } else {
      this.titleDiv = false;
    }

    // 地域選択状況変更監視
    if (_isNil(this.inputData.area)
      || this.inputData.area === 0) {
      this.areaDiv = true;
    } else {
      this.areaDiv = false;
    }

    // カテゴリー選択状況変更監視
    if (_isNil(this.inputData.category)
      || this.inputData.category === 0) {
      this.categoryDiv = true;
    } else {
      this.categoryDiv = false;
    }

    // // 価格選択状況変更監視
    // 価格のイベント処理でおこなう


    // 説明選択状況変更監視
    if (_isNil(this.inputData.explanation)
      || this.inputData.explanation === '') {
      this.explanationDiv = true;
    } else {
      this.explanationDiv = false;
    }

    if (!this.titleDiv && !this.areaDiv && !this.categoryDiv
      && !this.priceDiv && !this.explanationDiv && !this.preferredDateDiv
      && !this.timeDiv) {
      // 確定ボタン活性
      this.invalid = false;
    } else {
      // 確定ボタン非活性
      this.invalid = true;
    }

  }

  /** 画面操作イベント */

  /**
   * タイトル変更イベント
   */
  inputTitle() {
    console.log(this.inputData.title);
    this.cangeMonitoring();
  }

  /**
   * 価格変更イベント
   */
  inputPrice() {

    // エラー情報の初期化
    this.priceDiv = true;
    this.errorFlg = false;
    this.errormessage = '';

    // 不要な空白を除去する。
    const tr = this.formPrice.trim();
    // 数値変換
    const numCheck = Number(tr);

    // 半角数値以外変換できないので以下で判定
    if (isNaN(numCheck)) {
      console.log('価格には「半角数値を入力してください」');
      this.formPrice = '';
      this.priceDiv = true;
      this.errorFlg = true;
      this.errormessage = '「半角数値を入力してください」';
    } else {
      console.log('OK');
      if (tr === '0') {
        this.errormessage = '「1円以上で入力してください」';
        this.formPrice = '';
        this.priceDiv = true;
        this.errorFlg = true;
      } else {
        // 少数チェック
        if (Number.isInteger(numCheck)) {
          this.inputData.price = numCheck;
          this.priceDiv = false;
        } else {
          this.errormessage = '「整数で入力してください」';
          this.formPrice = '';
          this.priceDiv = true;
          this.errorFlg = true;
        }
      }
    }


    console.log(this.inputData.price);
    this.cangeMonitoring();
  }

  /**
   * 説明変更イベント
   */
  inputExplanation() {
    console.log(this.inputData.explanation);
    this.cangeMonitoring();
  }

  /**
   * 入札方式選択イベント
   */
  selectBidMethod() {
    // 選択状態を反映する
    this.inputData.bidMethod = this.selected;
    console.log('入札方式選択状態：' + this.selected);

    const selectnum = String(this.selected);
    // 選択状態によって価格のフォーム表示を切り替える
    if (selectnum === '1') {
      this.pricePlace = '価格'
      this.priceFormDiv = true;
      if (this.inputData.price === 0) {
        this.priceDiv = true;
      }
    } else if (selectnum === '2') {
      this.pricePlace = '開始価格'
      this.priceFormDiv = true;
      if (this.inputData.price === 0) {
        this.priceDiv = true;
      }
    } else {
      this.priceFormDiv = false;
      this.priceDiv = false;
      this.errorFlg = false;
    }
    this.cangeMonitoring();
  }

  /**
   * カテゴリー選択時イベント
   */
  selectCategory() {
    console.log(this.categorySelect);
    const selectData = _find(this.categoryData, detail => detail.category === this.categorySelect);
    if (!_isNil(selectData)) {
      this.inputData.category = selectData.id;
    } else {
      this.inputData.category = 0;
    }
    this.cangeMonitoring();
  }

  /**
   * 地域選択イベント
   */
  selectArea() {
    console.log('洗濯中' + this.areaSelect);
    const selectData = _find(this.areaData, detail => detail.prefectures === this.areaSelect);
    if (!_isNil(selectData)) {
      this.inputData.area = selectData.id;
    } else {
      this.inputData.area = 0;
    }
    this.cangeMonitoring();
  }

  /**
   * 希望日入力イベント
   */
  inputPreferredDate(event: MatDatepickerInputEvent<any>) {
    this.errorDayFlg = false;
    this.errormessage = ''
    // 入力不正値の場合は処理終了しデフォルト値のクリア
    if (_isNil(event.value)) {
      if (this.inputData.preferredDate >= 0) {
        this.preferredDateDiv = true;
        this.inputData.preferredDate = 0;
        this.errorDayFlg = true;
        this.errormessageDay = '日付の入力が不正です。'
      }
      return;
    }

    const str = String(event.value);
    const result = str.split(' ');

    // 日付をyyyymmdd形式にする
    const mon = _find(monthMap, month => month.month === result[1]);
    console.log(result[1]);
    console.log(mon);
    // 日付を設定する
    this.inputData.preferredDate = Number(result[3] + mon?.monthNum + result[2]);
    // 必須を非表示
    this.preferredDateDiv = false;

    const dayStr = String(new Date())
    const day = dayStr.split(' ');
    const d = _find(monthMap, month => month.month === day[1]);
    // 今日の日付yyymmdd形式
    const today = Number(day[3] + d?.monthNum + day[2])

    // 本日または過去日指定の場合
    if (this.inputData.preferredDate <= today) {
      this.inputData.preferredDate = 0;
      this.preferredDateDiv = true;
      this.errorDayFlg = true;
      this.errormessageDay = '日付は未来日を設定してください。'
    }
    this.cangeMonitoring();
  }

  /**
   * 希望時間入力イベント
   */
  selectTime() {
    console.log(this.timeSelect);
    const ti = _find(this.timeData, data => data.select === String(this.timeSelect));
    if (_isNil(ti)) {
      this.inputData.preferredTime = 0;
      this.timeDiv = true;
      // 確定ボタン活性
      this.invalid = true;
      return;
    }
    this.inputData.preferredTime = Number(ti.id);
    this.timeDiv = false;
    this.cangeMonitoring();
  }

  /**
   * 確定処理
   */
  getResult() {
    console.log('確定反応')
    console.log(this.inputData);
    this.service.servicePost(
      this.service.converSlipDetail(this.inputData)).subscribe(result => {
      // 登録結果からメッセージを表示する
      if (result === 200) {
        this.next();
      }
    });
  }

  /**
   * 次の作業を選択し選択画面へ遷移する
   *
   */
  private next() {
    const data: ModalData = {
      title: nextActionTitleType.SUCSESSMESSAGE,
      message: nextActionMessageType.NEXTMESSAGE,
      nextActionList: [
        { nextId: nextActionButtonType.TOP, nextAction: nextActionButtonTypeMap[0] },
        { nextId: nextActionButtonType.MYMENU, nextAction: nextActionButtonTypeMap[1] },
        { nextId: nextActionButtonType.SERVICECREATE, nextAction: nextActionButtonTypeMap[2] },
        { nextId: nextActionButtonType.SERVICEDETAEL, nextAction: nextActionButtonTypeMap[3] }
      ],
      resultAction: ''
    }

    const dialogRef = this.loginModal.open(NextModalComponent, {
      width: '50vh',
      height: '50vh',
      data: data
    });
    // 次の操作モーダルを表示
    dialogRef.afterClosed().subscribe(nextAction => {
      console.log(nextAction);
      if (nextAction !== undefined) {
        const linc = this.service.nextNav(nextAction.resultAction);
        if (linc == '99') {
          this.refreshForm();
        } else {
          // モーダル返却値から遷移先へ飛ぶ
          this.router.navigate([linc]);
        }
      }
    });
  }

  onDummy() {
    const data: ModalData = {
      title: nextActionTitleType.SUCSESSMESSAGE,
      message: nextActionMessageType.NEXTMESSAGE,
      nextActionList: [
        { nextId: nextActionButtonType.TOP, nextAction: nextActionButtonTypeMap[0] },
        { nextId: nextActionButtonType.MYMENU, nextAction: nextActionButtonTypeMap[1] },
        { nextId: nextActionButtonType.SERVICECREATE, nextAction: nextActionButtonTypeMap[2] },
        { nextId: nextActionButtonType.SERVICEDETAEL, nextAction: nextActionButtonTypeMap[3] }
      ],
      resultAction: ''
    }

    const dialogRef = this.loginModal.open(NextModalComponent, {
      width: '80vh',
      height: '50vh',
      data: data
    });
    // 次の操作モーダルを表示
    dialogRef.afterClosed().subscribe(nextAction => {
      if (nextAction !== undefined) {
        const linc = this.service.nextNav(nextAction.resultAction);
        if (linc == '99') {
          this.refreshForm();
        } else {
          // モーダル返却値から遷移先へ飛ぶ
          this.router.navigate([linc]);
        }
      }
    });
  }


  onDummy2() {
    this.auth.user$.subscribe(hoge => {
      console.log(hoge);
    })
  }

  /**
   * 入力内容をリセットする
   * @returns
   */
  private refreshForm() {
    this.inputData.id = '0';
    this.inputData.title = '';
    this.inputData.price = 0;
    this.inputData.area = 0;
    this.inputData.category = 0;
    this.inputData.bidMethod = 1;
    this.inputData.explanation = '';
    this.inputData.preferredDate = 0;
    this.inputData.preferredTime = 0;

    this.selected = 1;
    this.formPrice = '';
    this.timeSelect = '';
    this.startDate = 0;
    /** カテゴリー選択状態初期値 */
    this.areaSelect = ''
    this.categorySelect = '';
    // 確定ボタン非活性
    this.invalid = true;
  }



}
