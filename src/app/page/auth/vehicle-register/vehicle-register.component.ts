import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { officeInfo, employee, baseInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { user, initUserInfo } from 'src/app/entity/user';
import { UploadService } from '../../service/upload.service';
import { userVehicle } from 'src/app/entity/userVehicle';

@Component({
  selector: 'app-vehicle-register',
  templateUrl: './vehicle-register.component.html',
  styleUrls: ['./vehicle-register.component.scss']
})
export class VehicleRegisterComponent implements OnInit {

  // 入力データ
  inputData = {
    // 車両名
    vehicleName: '',
    // 車両番号
    vehicleNo: '',
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
    firstRegistrationDate:  '',
    // 車検満了日
    inspectionExpirationDate: ''
  }

  user: user = initUserInfo;

  vehicleList:userVehicle[] = [];



  constructor(
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private cognito: CognitoService,
    private location: Location,
    private s3: UploadService,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if(authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
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
  onSomeUserInfo(e:string) {
    console.log(e);
  }

  /**
   * 登録するボタン押下イベント
   */
  onRegister() {
    console.log(this.inputData)
  }

  goBack() {
    this.location.back();
  }


  /************  以下内部処理 ****************/


  /**
   * 車両登録登録
   */
  private vehicleResister() {
 
  }




}
