import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiGsiSerchService } from '../../service/api-gsi-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { UploadService } from '../../service/upload.service';
import { userVehicle, vehicleNumberPlate, selectEraName, selectColoer } from 'src/app/entity/userVehicle';
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
    // Validators.required,
    // Validators.pattern('[0-9 ]*'),
    // Validators.maxLength(4)
  ]);

  // ナンバー（分類番号）
  vehicleNoClassificationNum = new FormControl('', [
    // Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(3)
  ]);

  // ナンバー（かな）
  vehicleNoKana = new FormControl('', [
    // Validators.required,
    // Validators.pattern('[0-9 ]*'),
    // Validators.maxLength(4)
  ]);

  // ナンバー（一連指定番号）
  vehicleNoSerialNum = new FormControl('', [
    // Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 型式
  modelNo = new FormControl('', [
    Validators.pattern('[a-zA-Z0-9 ]*'),
  ]);

  // 車台番号
  chassisNo = new FormControl('', [
    // Validators.required,
    Validators.pattern('[a-zA-Z0-9 ]*'),
  ]);


  // 指定番号
  designatedNo = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
  ]);

  // 類別区分番号
  classificationNo = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
  ]);

  // 走行距離
  mileage = new FormControl('1', [
    Validators.pattern('[0-9 ]*'),
  ]);

  // // 元号（ID）
  // eraId = new FormControl('1', [
  //   Validators.pattern('[0-9 ]*'),
  // ]);

  // // カラー（ID）
  // colerId = new FormControl('1', [
  //   Validators.pattern('[0-9 ]*'),
  // ]);

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

  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    vehicleNoAreaName: this.vehicleNoAreaName,
    vehicleNoClassificationNum: this.vehicleNoClassificationNum,
    vehicleNoKana: this.vehicleNoKana,
    vehicleNoSerialNum: this.vehicleNoSerialNum,
    modelNo: this.modelNo,
    chassisNo: this.chassisNo,
    designatedNo: this.designatedNo,
    classificationNo: this.classificationNo,
    mileage: this.mileage,
    // eraId: this.eraId,
    // colerId: this.colerId,
    firstRegistrationYear: this.firstRegistrationYear,
    firstRegistrationMonth: this.firstRegistrationMonth,
    inspectionExpirationYear: this.inspectionExpirationYear,
    inspectionExpirationMonth: this.inspectionExpirationMonth,
    inspectionExpirationDay: this.inspectionExpirationDay,

  })

  // 入力データ
  inputData = {
    // 車両名
    vehicleName: '',
    // カラーNo
    colerNo: '',
  }

  /** ユーザー情報　*/
  user: user = initUserInfo;
  /** 車両リスト　*/
  vehicleList: userVehicle[] = [];
  /** 元号セレクト */
  eraData = selectEraName
  eraSelect = '';

  /** カラーセレクト */
  coloerData = selectColoer
  coloerSelect = '';


  constructor(
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private builder: FormBuilder,
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
      chassisNo: this.serChassisNo(),
      designatedClassification: this.designatedClassification(),
      coler: this.coloerSelect,
      colerNo: this.inputData.colerNo,
      mileage: Number(this.mileage.value),
      firstRegistrationDate: this.setFirstRegistrationData(),
      inspectionExpirationDate: this.setInspectionExpirationData(),
      updateUserId: '',
      created: '',
      updated: ''
    }

    console.log(userVehicle);

    this.apiService.postUserVehicle(userVehicle).subscribe(result => {
      if(result === 200) {
        alert('登録OK')
        this.getVehicleList();
      } else {
        alert('登録失敗しました。')
      }

      console.log(result);
    });
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
    return this.eraSelect + '/'
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


  /**
   * 車台番号を設定する
   * @returns
   */
  private serChassisNo(): string[] {
    let result = []
    result[0] = this.modelNo.value;
    result[1] = this.chassisNo.value;
    return result;
  }

  /**
   * 指定類別を設定する
   * @returns
   */
  private designatedClassification(): string {
    return this.designatedNo.value + '/'
      + this.classificationNo.value
  }


}
