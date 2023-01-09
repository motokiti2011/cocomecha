import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user, initUserInfo} from 'src/app/entity/user';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { UploadService } from 'src/app/page/service/upload.service';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.scss']
})
export class EditUserInfoComponent implements OnInit {

  inputData = {
    userName: '',
    mailAdress: '',
    TelNo1: '',
    TelNo2: '',
    areaNo1: '',
    areaNo2: '',
    adress: '',
    postCode: '',
    introduction: '',
  }


  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  /** ユーザー情報 */
  user:user = initUserInfo;

  imageFile: any = null;

  constructor(
    private location: Location,
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private router: Router,
    private s3: UploadService,
  ) { }


  ngOnInit(): void {
    const user = this.cognito.initAuthenticated();
      if(user == null) {
        alert("ログインが必要です")
        this.location.back();
        return;
      }
      console.log(user);
      this.setDispDate(user);
  }


  /**
   * 設定値を加工し返却
   * @param parm
   */
  private isSerParm(parm: string| null, subject: string): string {
    if(parm != null && parm != '') {
      return parm;
    }
    return '';
  }

  /**
   * 地域選択イベント
   */
  selectArea() {

  }

/**
 * アップロードファイル選択時イベント
 * @param event
 */
  onInputChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.imageFile = file;
  }



  /**
   * 登録ボタン押下イベント
   */
  onResister() {
    this.inputCheck();
    console.log(this.user);
    if(this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.userResister();
    }

    // this.apiService.postUser(this.user).subscribe(result => {
    //   console.log(result);
    // });

  }

  inputCheck() {
    this.user.userName = this.inputData.userName;
    this.user.mailAdress = this.inputData.mailAdress;
    this.user.TelNo1 = this.inputData.TelNo1;
    this.user.TelNo2 = this.inputData.TelNo2;
    this.user.areaNo1 = this.inputData.areaNo1;
    this.user.areaNo2 = this.inputData.areaNo2;
    this.user.adress = this.inputData.adress;
    this.user.profileImageUrl = ''; // 仮
    this.user.postCode = this.inputData.postCode;
    this.user.introduction = this.inputData.introduction;

  }


  /************  以下内部処理 ****************/

  /**
   * 表示データを設定する
   * @param userId
   */
  private setDispDate(userId: string) {
    this.apiService.getUser(userId).subscribe(data => {
      if(data[0]) {
        this.user = data[0];
        this.inputData.userName = this.user.userName;
        this.inputData.mailAdress = this.user.mailAdress;
        this.inputData.TelNo1 = this.isSerParm(this.user.TelNo1,'tel');
        this.inputData.TelNo2 = this.isSerParm(this.user.TelNo2,'tel');
        this.inputData.areaNo1 = this.isSerParm(this.user.areaNo1,'area1');
        this.inputData.areaNo2 = this.isSerParm(this.user.areaNo2,'area2');
        this.inputData.adress = this.isSerParm(this.user.adress,'adress');
        this.inputData.postCode = this.isSerParm(this.user.postCode,'postCode');
      } else {
        alert('データが取得できませんでした。再度アクセスしてください')
        this.location.back();
      }
    });
  }




  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        this.user.profileImageUrl = data.Location;
        this.userResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * ユーザー情報を登録する
   */
  private userResister() {
    console.log(this.inputData);
    if(_isNil(this.inputData.userName) || this.inputData.userName == ''
    || _isNil(this.inputData.areaNo1) || this.inputData.areaNo1 == ''
    || _isNil(this.inputData.mailAdress) || this.inputData.mailAdress == '') {
      alert('必須項目です。');
    } else {
      this.user.userValidDiv = '0';
      this.user.corporationDiv = '0';
      this.user.userName = this.inputData.userName;
      this.user.mailAdress = this.inputData.mailAdress;
      this.user.TelNo1 = this.inputData.TelNo1;
      this.user.areaNo1 = this.inputData.areaNo1;
      this.user.areaNo2 = this.inputData.areaNo2;
      this.user.adress = this.inputData.adress;
      this.user.profileImageUrl = ''; // 仮
      this.user.postCode = this.inputData.postCode;
      this.user.introduction = this.inputData.introduction;

      this.apiService.postUser(this.user).subscribe(result => {
        if(result == undefined) {
          // TODO
          alert('失敗');
        }
        this.router.navigate(["/main_menu"])
      });
    }
  }


}
