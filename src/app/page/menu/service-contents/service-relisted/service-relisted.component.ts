import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiSlipProsessService } from 'src/app/page/service/api-slip-prosess.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user } from 'src/app/entity/user';
import { serviceContents, initServiceContent } from 'src/app/entity/serviceContents';
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
} from '../service-create/service-create-option';

import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serchCategoryData } from 'src/app/entity/serchCategory';

import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

/**
 * 再出品コンポーネント
 */
@Component({
  selector: 'app-service-relisted',
  templateUrl: './service-relisted.component.html',
  styleUrls: ['./service-relisted.component.scss']
})
export class ServiceRelistedComponent implements OnInit {

  /** タイトル */
  title = '';
  /** 再出品伝票 */
  relistedService: serviceContents = initServiceContent;
  /** 作成ユーザー情報 */
  userInfo?: user;


  /** 入力中データ情報 */
  inputData: serviceContents = initServiceContent;
  /** 入札方式選択状態初期値 */
  selected = '1';
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** カテゴリー選択状態初期値 */
  categorySelect = '1';
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
  /** イメージ */
  img: any = []
  /** ファイルリスト */
  fileList: any[] = []
  /** locationリスト */
  locationList: string[] = [];





  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private overlay: Overlay,
    private location: Location,
    private activeRouter: ActivatedRoute,
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private apiSlipService: ApiSlipProsessService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if (authUser == null) {
      alert("ログインが必要です");
      this.location.back();
    } else {
      // ユーザー情報を取得する
      this.apiService.getUser(authUser).subscribe(user => {
        if (user[0] == null) {
          // ローディング解除
          this.overlayRef.detach();
          alert("ログインが必要です");
          this.location.back();
          return;
        } else {
          this.userInfo = user[0];
        }
        // サービスタイプ取得
        this.activeRouter.queryParams.subscribe(params => {
          // 再出品対象の伝票情報を取得
          const serviceType = params['serviceType'];
          const slipNo = params['slipNo'];
          this.apiSlipService.getrelistedService(serviceType, slipNo).subscribe(result => {
            console.log(result);
            // 伝票情報取得
            this.relistedService = result[0] 
          });
        });
      });
    }
    // ローディング解除
    this.overlayRef.detach();
  }


  inputTitle() {

  }

  inputPrice() {

  }

  selectBidMethod() {

  }


  inputExplanation() {

  }

  inputPreferredDate(event: any) {
  }


  selectTime() {

  }


  inputWorkArea() {

  }


  onChangeDragAreaInput(event: any) {

  }


  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const files = event.target.files[0];
  }


  dragOver(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
  }
  drop(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
    if (event.dataTransfer == null) {
      return;
    }
    const file = event.dataTransfer.files;
    this.fileList.push(file[0])
    const fileList = Object.entries(file).map(f => f[1]);
    console.log(fileList);

    fileList.forEach(f => {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        this.img.push(reader.result);
      };
    });
  }

  getResult() {

  }



}
