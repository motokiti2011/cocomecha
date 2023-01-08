import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serviceContents, initServiceContent } from 'src/app/entity/serviceContents';
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
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ServiceCreateModalComponent } from 'src/app/page/modal/service-create-modal/service-create-modal.component';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { salesServiceInfo, defaulsalesService } from 'src/app/entity/salesServiceInfo';
import {
  createServiceSelect,
  timeData,
  userWorkArea,
  mechanicWorkArea,
  userTargetVehcle,
  mechanicTargetVehcle,
  userPrice,
  mechanicPrice,
  messageLevel,
  adminUserSelect,
 } from './service-create-option';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})


export class ServiceCreateComponent implements OnInit {

  /** タイトル */
  title = '';

  /** 入力中データ情報 */
  inputData: serviceContents = initServiceContent;

  /** 入札方式選択状態初期値 */
  selected = '1';

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

  /** 価格プレスホルダー */
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

  /** エラーメッセージ日付 */
  errormessageDay = '';
  /** エラーメッセージ日付 */
  startDate = 0;

  /** 作成ユーザー情報 */
  userInfo: user = initUserInfo;

  /** 価格データ */
  priceSelectData: createServiceSelect[] = [];

  /** 価格セレクト */
  priceSelect = '';

  /** 作業場所データ */
  workAreaData: createServiceSelect[] = [];

  /** 作業場所セレクト */
  workAreaSelect = '';

  /** 対象車両 */
  vehcleData: createServiceSelect[] = [];

  /** 作業場所セレクト */
  vehcleSelect = '';

  /** 希望時間データ */
  timeData = timeData;

  /** 希望時間セレクト */
  timeSelect = '';

  /** メッセージレベルデータ */
  msgLvData = messageLevel;

  /** 希望時間セレクト */
  msgLvSelect = '';

  /** 管理ユーザー区分 */
  adminSelectDiv = false;
  /** 管理ユーザーデータ */
  adminUserData = adminUserSelect;
  /** 管理ユーザーセレクト */
  adminSelect = '';
  /** 管理ユーザー名 */
  adminUserName = '';

  constructor(
    private location: Location,
    private service: ServiceCreateService,
    public modal: MatDialog,
    private router: Router,
    private auth:AuthUserService,
    private apiService: ApiSerchService,
    private cognito: CognitoService,
    private activeRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.refreshForm();
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if(authUser == null) {
      alert("ログインが必要です");
      this.location.back();
    } else {
      // ユーザー情報を取得する
    this.apiService.getUser(authUser).subscribe(user => {
      if(user[0] == null) {
        alert("ログインが必要です");
        this.location.back();
        return;
      } else {
        this.userInfo = user[0];
        this.inputData.userId = this.userInfo.userId;
        this.inputData.userName = this.userInfo.userName;
      }
      this.activeRouter.queryParams.subscribe(params => {
        if(params['serviceType'] == '1' || params['serviceType'] == '2' ) {
          if(this.userInfo.mechanicId !== ''
          && this.userInfo.mechanicId !== null ) {
            // メカニックタイプの出品画面表示する
            this.mechenicDisp();
          } else {
            // メカニック未登録の場合
            alert("メカニック登録されていません");
            this.location.back();
            return;
          }
        } else {
          this.serviceSelect();
        }
      });
    });
    }
  }

  /**
   * 画面表示を判定し、選択の必要がある場合モーダルを展開する
   */
  private serviceSelect() {
    if(this.userInfo.mechanicId == null || this.userInfo.mechanicId == '' ) {
      // ユーザー依頼画面への表示
      this.userDisp();
    } else {
      // ユーザー情報にメカニック情報が存在する場合モーダルを開く
      const dialogRef = this.modal.open(ServiceCreateModalComponent, {
        width: '400px',
        height: '450px',
        data: {
          userId: this.userInfo.userId,
          mechanicId: this.userInfo.mechanicId,
          officeId: this.userInfo.officeId,
        }
      });
      // モーダルクローズ後
      dialogRef.afterClosed().subscribe(
        result => {
          console.log('クリエイトモーダル:'+ result)
          if (result !== null
            || result !== '' || result !== undefined ) {
            if(result == '0') {
              this.userDisp();
            } else if(result == '1') {
              this.mechenicDisp();
            } else {
              this.officeDisp();
            }
          } else {
            // 戻るボタン押下時の動き
            this.location.back();
            return;
          }
        }
      );
    }
  }

  /**
   *　ユーザー用画面設定を行う
   */
  private userDisp() {
    // 画面表示設定
    this.title = 'サービスを依頼する'
    this.workAreaData = userWorkArea;
    this.vehcleData = userTargetVehcle;
    this.priceSelectData = userPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.targetService = '0';
    this.adminSelectDiv = false;
    this.adminUserName = this.userInfo.userName;
  }

  /**
   * メカニック用画面表示設定を行う
   */
  private mechenicDisp() {
    // 画面表示設定
    this.title = 'メカニックとしてサービス・商品を出品する'
    this.workAreaData = mechanicWorkArea;
    this.vehcleData = mechanicTargetVehcle;
    this.priceSelectData = mechanicPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.mechanicId = this.userInfo.mechanicId;
    this.inputData.targetService = '2';

  }

  /**
   * 工場用画面表示設定を行う
   */
  private officeDisp() {
    // 画面表示設定
    this.title = '工場としてサービス・商品を出品する'
    this.workAreaData = mechanicWorkArea;
    this.vehcleData = mechanicTargetVehcle;
    this.priceSelectData = mechanicPrice;
    // セレクトボックス初期値設定
    this.workAreaSelect = this.workAreaData[0].id;
    this.categorySelect = this.categoryData[0].id;
    this.vehcleSelect = this.vehcleData[0].id;
    this.priceSelect = this.priceSelectData[0].id;
    this.msgLvSelect = this.msgLvData[0].id;
    // データ設定
    this.inputData.mechanicId = this.userInfo.mechanicId;
    this.inputData.officeId = this.userInfo.officeId;
    this.inputData.targetService = '1';
    this.adminSelectDiv = true;
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
      || this.inputData.category === '0'||this.inputData.category === '' ) {
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

  /************** 画面操作イベント *****************************/
  /**
   * タイトル変更イベント
   */
  inputTitle() {
    console.log(this.inputData.title);
    this.cangeMonitoring();
  }

  /**
   * 作業場所変更イベント
   */
  inputWorkArea() {
    console.log('1workArea:'+this.inputData.workArea);
    console.log('2targetVehcle:'+this.inputData.targetVehcle);
    console.log('3msgLv:'+this.inputData.msgLv);
    console.log('4workArea:'+this.inputData.workArea);
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
    console.log('入札方式選択状態2：' + this.inputData.bidMethod);

    // 選択状態によって価格のフォーム表示を切り替える
    if (this.inputData.bidMethod === '1' || this.inputData.bidMethod === '41') {
      this.pricePlace = '価格'
      this.priceFormDiv = true;
      if (this.inputData.price === 0) {
        this.priceDiv = true;
      }
    } else {
      this.priceFormDiv = false;
      this.priceDiv = false;
      this.errorFlg = false;
    }
    console.log(this.priceFormDiv);
    this.cangeMonitoring();
  }

  /**
   * カテゴリー選択時イベント
   */
  selectCategory() {
    this.cangeMonitoring();
  }

  /**
   * 地域選択イベント
   */
  selectArea() {
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
    const ti = _find(this.timeData, data => data.label === String(this.timeSelect));
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
    // console.log('確定反応')
    console.log(this.inputData);
    // 工場、メカニックとして依頼する場合
    if(this.inputData.targetService !== '0') {
      // サービス商品として更新を行う
      this.service.postSalesService(this.inputData).subscribe(result => {
        // 登録結果からメッセージを表示する
        if (result === 200) {
          alert('POST:OK')
          console.log('POST:OK')
          this.next();
        } else {
          console.log('POST:NG')
          alert('POST:NG')
        }
      });
    } else {
      // 伝票情報の更新を行う
      this.service.postSlip(this.inputData).subscribe(result => {
        // 登録結果からメッセージを表示する
        if (result === 200) {
          alert('POST:OK')
          console.log('POST:OK')
          this.next();
        } else {
          console.log('POST:NG')
          alert('POST:NG')
        }
      });
    }

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

    const dialogRef = this.modal.open(NextModalComponent, {
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

    const dialogRef = this.modal.open(NextModalComponent, {
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
    this.auth.userInfo$.subscribe(hoge => {
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
    this.inputData.category ='0';
    this.inputData.bidMethod = '1';
    this.inputData.explanation = '';
    this.inputData.preferredDate = 0;
    this.inputData.preferredTime = 0;

    this.selected = '1';
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
