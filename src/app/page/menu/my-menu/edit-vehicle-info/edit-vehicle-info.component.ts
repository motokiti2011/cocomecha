import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { userVehicle, vehicleNumberPlate, selectEraName, selectColoer } from 'src/app/entity/userVehicle';

@Component({
  selector: 'app-edit-vehicle-info',
  templateUrl: './edit-vehicle-info.component.html',
  styleUrls: ['./edit-vehicle-info.component.scss']
})
export class EditVehicleInfoComponent implements OnInit {

  /** ユーザー情報　*/
  user: user = initUserInfo;
  /** 車両リスト　*/
  vehicleList?: userVehicle;


  // ナンバープレートデータ
  numberPleateData: vehicleNumberPlate = {
    areaName: '',
    classificationNum: '',
    kana: '',
    serialNum: ''
  }


  // 車両名
  vehicleName = new FormControl('', [
    Validators.required,
    // Validators.pattern('[0-9 ]*'),
    // Validators.maxLength(4)
  ]);

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

  /** 元号セレクト */
  eraData = selectEraName
  eraSelect = '';

  /** カラーセレクト */
  coloerData = selectColoer
  coloerSelect = '';

  constructor(
    private apiService: ApiSerchService,
    private builder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognito: CognitoService,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        this.activatedRoute.queryParams.subscribe(params => {
          const vehicleId = params['vehicleId'];
        this.getVehicleInfo(vehicleId);
        });
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }
  }


  /**
   * 登録ボタン押下イベント
   */
  onRegister() {
    console.log(this.vehicleList)
  }


  /**
   * 車両情報を取得する
   */
  private getVehicleInfo(vehicleId: string ) {
    this.apiService.getUserVehicle(vehicleId).subscribe(result => {
      this.vehicleList = result[0];
      this.setDispData();
    });
  }

  /**
   * 取得データを表示用に加工格納する
   */
  private setDispData() {
    // 車名
    this.vehicleName.setValue(this.vehicleList?.vehicleName);
    // ナンバー
    this.vehicleNoAreaName.setValue(this.vehicleList?.vehicleNoAreaName);
    this.vehicleNoClassificationNum.setValue(this.vehicleList?.vehicleNoClassificationNum);
    this.vehicleNoKana.setValue(this.vehicleList?.vehicleNoKana);
    this.vehicleNoSerialNum.setValue(this.vehicleList?.vehicleNoSerialNum);

    // 車台番号
    if(this.vehicleList?.chassisNo) {
      this.modelNo.setValue(this.vehicleList?.chassisNo[0]);
      this.chassisNo.setValue(this.vehicleList?.chassisNo[1]);
    }
    // 指定類別
    if(this.vehicleList?.designatedClassification) {
      const designated = this.vehicleList.designatedClassification.split('/');
      this.designatedNo.setValue(designated[0]);
      this.classificationNo.setValue(designated[1]);
    }

    // カラー
    if(this.vehicleList?.coler) {
      this.coloerSelect = this.vehicleList?.coler;
    }
    // 走行距離
    this.mileage.setValue(this.vehicleList?.mileage);
    // 初年度登録日
    const firstRegistration = this.setFirstRegistration();
    if(firstRegistration.length != 0) {
      this.eraSelect = firstRegistration[0];
      this.firstRegistrationYear.setValue(firstRegistration[1]);
      this.firstRegistrationMonth.setValue(firstRegistration[2]);
    }
    // 車検満了日
    const inspectionExpiration = this.setInspectionExpiration();
    if(inspectionExpiration.length != 0) {
      this.inspectionExpirationYear.setValue(inspectionExpiration[0]);
      this.inspectionExpirationMonth.setValue(inspectionExpiration[1]);
      this.inspectionExpirationDay.setValue(inspectionExpiration[2]);
    }


  }


  /**
   * 初年度登録日を分割する
   * @returns
   */
  private setFirstRegistration(): string[] {
    let result:string[] = [];
    if(this.vehicleList?.firstRegistrationDate) {
      result = this.vehicleList?.firstRegistrationDate.split('/');
    }
    return result;
  }

  /**
   * 車検満了日を分割する
   * @returns
   */
  private setInspectionExpiration(): string[] {
    let result:string[] = [];
    if(this.vehicleList?.inspectionExpirationDate) {
      result = this.vehicleList?.inspectionExpirationDate.split('/');
    }
    return result;
  }

}
