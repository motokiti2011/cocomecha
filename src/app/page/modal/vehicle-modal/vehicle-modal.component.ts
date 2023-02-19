import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userVehicle } from 'src/app/entity/userVehicle';
import { slipVehicle, initSlipVehicle } from 'src/app/entity/slipVehicle';
import {
  makerInfo,
  domesticVehicleMakerData,
  abroadBikeMakerData,
  domesticBikeMakerData,
  abroadVehicleMakerData
} from 'src/app/entity/vehicleDataInfo';


@Component({
  selector: 'app-vehicle-modal',
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})


export class VehicleModalComponent implements OnInit {

  /** タイトル */
  title = '車両選択'
  /** 登録車両 */
  registerVehicle: userVehicle[] = [];
  /** 選択車両 */
  selectVehicle?: userVehicle;
  /** 対象サービス分類 */
  targetService: string = '';
  /** 結果データ */
  resultData: slipVehicle = initSlipVehicle;
  /** ユーザー情報 */
  acsessId: string | null = null;
  /** 車両名 */
  dispVehicleName: string = '';
  /** 車両区分 */
  dispVehicleDiv: string = '0';
  /** 車両区分データ */
  vehicleDivData = [
    { vehicleDiv: '0', value: '車' },
    { vehicleDiv: '1', value: 'バイク' },
    { vehicleDiv: '2', value: 'その他車両' },
    { vehicleDiv: '99', value: 'その他' }
  ];
  /** メーカー */
  dispVehicleMaker: string = '';
  /** メーカーデータ */
  // makerData: string[] = [];
  makerData: any;
  /** 車両形状 */
  dispVehicleForm: string = '';
  /** メーカーデータ */
  formData: string[] = [];
  /** 指定なし区分 */
  unspecifiedDiv = false;


  constructor(
    public _dialogRef: MatDialogRef<VehicleModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: vehicleModalInput
  ) { }

  ngOnInit(): void {
    this.targetService = this.data.targetService;
    // ユーザー依頼の場合
    if (this.data.targetService !== '0') {
      this.acsessId = this.data.acsessId;
      this.makerDataSetting();
      if (this.data.targetVehicle.length != 0) {
        // 初期表示に登録車両情報を表示
        this.registerVehicle = this.data.targetVehicle;
      }
    }
  }


  /**
   * 車両区分選択イベント
   * @param i 
   */
  onSelectVehicleDiv(i: number) {
    console.log(this.vehicleDivData[i]);
    console.log(this.dispVehicleDiv);
  }

  /**
   * 登録車両選択イベント
   */
  onSelectUserVehicle() {
    if (this.selectVehicle) {
      this.setVehicleResultData(this.selectVehicle);
      const data = {
        resultData: this.resultData,
        targetService: this.targetService,
        unspecifiedDiv: this.unspecifiedDiv
      }
      this._dialogRef.close(this.resultData);
    }
  }

  /**
   * 決定ボタン押下イベント
   */
  getResult() {
    this.inputVehicleInfo();
    const data = {
      resultData: this.resultData,
      targetService: this.targetService,
      unspecifiedDiv: this.unspecifiedDiv
    }
    this._dialogRef.close(data);
  }

  /**
   * 指定なしチェック押下時
   */
  onUnspecified() {
    console.log(this.unspecifiedDiv);
  }



  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  /**
   * メーカーセレクト操作時
   */
  onSelectMaker() {

  }

  /**
   * 車両形状操作時
   */
  onSelectForm() {

  }

  /**
   * 車両選択イベント
   */
  onVehicleSelect(id: string) {
    console.log(id);
  }

  keys(obj: Object) {
    return Object.keys(obj);
  }



  /************************************** 内部処理 ************************************/

  /**
   * 選択された車両情報を格納する
   */
  private setVehicleResultData(vehicleInfo: userVehicle) {
    // 車両名、分類、車両区分,カラーのみ伝票情報に格納
    this.resultData.vehicleName = vehicleInfo.vehicleName;
    // 分類番号　ユーザー依頼（車両あり）
    this.resultData.slipVehicleClassDiv = '0';
    this.resultData.vehicleDiv = vehicleInfo.vehicleDiv;
    this.resultData.coler = vehicleInfo.coler;
  }

  /**
   * 入力された車両情報を返却データに格納する
   */
  private inputVehicleInfo() {
    // 名称,車両区分,メーカー,車両形状を入力
    this.resultData.vehicleName = this.dispVehicleName;
    this.resultData.vehicleDiv = this.dispVehicleDiv;
    this.resultData.vehicleMaker = this.dispVehicleMaker;
    this.resultData.vehicleForm = this.dispVehicleForm;
  }

  /**
   * メーカーセレクトデータの設定
   */
  private makerDataSetting() {
    if (this.dispVehicleDiv == '0') {
      this.makerData = {
        '国内メーカー': domesticVehicleMakerData,
        '外国メーカー': abroadVehicleMakerData
      }
    } else if (this.dispVehicleDiv == '1') {
      this.makerData = {
        '国内メーカー': 
          domesticBikeMakerData
        ,
        '外国メーカー': [
          abroadBikeMakerData
        ]
      }
    } else {
      this.makerData = [];
    }

  }




}




/** モーダルインプットデータ */
export interface vehicleModalInput {
  targetVehicle: userVehicle[],
  targetService: string,
  acsessId: string | null
}




