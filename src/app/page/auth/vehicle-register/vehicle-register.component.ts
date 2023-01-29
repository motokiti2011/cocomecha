import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiGsiSerchService } from '../../service/api-gsi-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { UploadService } from '../../service/upload.service';
import { userVehicle, vehicleNumberPlate, selectEraName } from 'src/app/entity/userVehicle';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-vehicle-register',
  templateUrl: './vehicle-register.component.html',
  styleUrls: ['./vehicle-register.component.scss']
})
export class VehicleRegisterComponent implements OnInit {

  // ナンバープレートデータ
  numberPleateData: vehicleNumberPlate = {
    areaName: '',
    classificationNum: '',
    kana: '',
    serialNum: ''
  }

  // ナンバー（地域）
  vehicleNoAreaName = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // ナンバー（分類番号）
  vehicleNoClassificationNum = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // ナンバー（かな）
  vehicleNoKana = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // ナンバー（一連指定番号）
  vehicleNoSerialNum = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 元号（ID）
  eraId = new FormControl('1', [
    Validators.pattern('[0-9 ]*'),
  ]);

  // 初年度（年）
  firstRegistrationYear = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 初年度（月）
  firstRegistrationMonth = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);


  // 車検満了日（年）
  inspectionExpirationYear = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 車検満了日（月）
  inspectionExpirationMonth = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 車検満了日（日）
  inspectionExpirationDay = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 入力データ
  inputData = {
    // 車両名
    vehicleName: '',
    // 車両番号
    vehicleNo: this.numberPleateData,
    // 車台番号
    chassisNo: '',
    // 指定番号
    designatedNo: '',
    // 類別区分番号
    classificationNo: '',
    // カラー
    coler: '',
    // カラーNo
    colerNo: '',
    // 走行距離
    mileage: '',
    // 初年度登録日
    firstRegistrationDate: '',
    // 車検満了日
    inspectionExpirationDate: ''
  }
  /** ユーザー情報　*/
  user: user = initUserInfo;
  /** 車両リスト　*/
  vehicleList: userVehicle[] = [];
  /** 元号セレクト */
  eraData = selectEraName
  eraSelect = '1';

  constructor(
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private cognito: CognitoService,
    private location: Location,
    private s3: UploadService,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        this.getVehicleList();
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }

  }


  /**
   * ユーザー登録情報と合わせるボタン押下時イベント
   * @param e
   */
  onSomeUserInfo(e: string) {
    console.log(e);
  }

  /**
   * 登録するボタン押下イベント
   */
  onRegister() {
    this.vehicleResister();
  }

  goBack() {
    this.location.back();
  }


  /************  以下内部処理 ****************/

  /**
   * 車両情報を取得する
   */
  private getVehicleList() {
    this.apiGsiService.serchVehicle(this.user.userId, '0').subscribe(result => {
      this.vehicleList = result;
    });
  }

  /**
   * 車両登録登録
   */
  private vehicleResister() {
    console.log(this.inputData);
    const userVehicle: userVehicle = {
      vehicleId: '',
      userId: this.user.userId,
      vehicleName: this.inputData.vehicleName,
      vehicleNo: this.setVehicleNo(),
      vehicleNoAreaName: this.vehicleNoAreaName.value,
      vehicleNoClassificationNum: this.vehicleNoClassificationNum.value,
      vehicleNoKana: this.vehicleNoKana.value,
      vehicleNoSerialNum: this.vehicleNoSerialNum.value,
      chassisNo: this.inputData.chassisNo,
      designatedClassification: this.inputData.designatedNo,
      coler: this.inputData.coler,
      colerNo: this.inputData.colerNo,
      mileage: Number(this.inputData.mileage),
      firstRegistrationDate: this.setFirstRegistrationData(),
      inspectionExpirationDate: this.setInspectionExpirationData(),
      updateUserId: '',
      created: '',
      updated: ''
    }
    this.apiService.postUserVehicle(userVehicle).subscribe(result => {
      console.log(result);
    })
  }


  /**
   * ナンバーを合体させる
   * @returns 
   */
  private setVehicleNo(): string {
    return this.vehicleNoAreaName.value + '-'
      + this.vehicleNoClassificationNum.value + '-'
      + this.vehicleNoKana.value + '-'
      + this.vehicleNoSerialNum.value;
  }

  /**
   * 初年度年月を合体させる
   * @returns 
   */
  private setFirstRegistrationData(): string {
    return this.eraId.value + '/'
      + this.firstRegistrationYear.value + '/'
      + this.firstRegistrationMonth.value;
  }

  /**
   * 車検満了日を合体させる
   * @returns 
   */
  private setInspectionExpirationData(): string {
    return this.inspectionExpirationYear.value + '/'
      + this.inspectionExpirationMonth.value + '/'
      + this.inspectionExpirationDay.value;
  }



}
