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
    telNo1_1: '',
    telNo1_2: '',
    telNo1_3: '',
    // TelNo2: '',
    areaNo1: '',
    areaNo2: '',
    adress: '',
    postCode1: '',
    postCode2: '',
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
    this.user.TelNo1 = this.setTelNo();
    // this.user.TelNo2 = this.inputData.TelNo2;
    this.user.areaNo1 = this.inputData.areaNo1;
    this.user.areaNo2 = this.inputData.areaNo2;
    this.user.adress = this.inputData.adress;
    this.user.profileImageUrl = ''; // 仮
    this.user.postCode = this.setPostCode();
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
        let telNo = {tel1: '' ,tel2: '' ,tel3: '' }
        if(this.user.TelNo1) {
          telNo = this.splitTelNo(this.user.TelNo1);
        }
        let postCode = {post1: '' ,post2: ''}
        if(this.user.postCode) {
          postCode = this.splitPostCode(this.user.postCode);
        }
        

        this.inputData.userName = this.user.userName;
        this.inputData.mailAdress = this.user.mailAdress;
        this.inputData.telNo1_1 = telNo.tel1;
        this.inputData.telNo1_2 = telNo.tel2;
        this.inputData.telNo1_3 = telNo.tel3;
        this.inputData.areaNo1 = this.isSerParm(this.user.areaNo1,'area1');
        this.inputData.areaNo2 = this.isSerParm(this.user.areaNo2,'area2');
        this.inputData.adress = this.isSerParm(this.user.adress,'adress');
        this.inputData.postCode1 = postCode.post1;
        this.inputData.postCode2 = postCode.post2;
      } else {
        alert('データが取得できませんでした。再度アクセスしてください')
        this.location.back();
      }
    });
  }


  /******************    後日formサービスに移行予定   **********************/
  /**
   * 電話番号を分割する
   * @param telNo 
   * @returns 
   */
  private splitTelNo(telNo: string) : {tel1: string ,tel2: string ,tel3: string } {
    const spritTelNo = telNo.split('-');
    const result = {tel1: spritTelNo[0] ,tel2: spritTelNo[1] ,tel3: spritTelNo[2] }
    return result;
  }

  /**
   * 入力値から登録データ電話番号を作成する
   * @returns 
   */
  private setTelNo(): string {
    return this.inputData.telNo1_1 + '-'
     + this.inputData.telNo1_2 + '-'
     + this.inputData.telNo1_3;     
  }


  /**
   * 電話番号を分割する
   * @param telNo 
   * @returns 
   */
  private splitPostCode(postCode: string) : {post1: string ,post2: string} {
    const spritTelNo = postCode.split('-');
    const result = {post1: spritTelNo[0] ,post2: spritTelNo[1] }
    return result;
  }


  /**
   * 入力値から登録データ電話番号を作成する
   * @returns 
   */
  private setPostCode(): string {
    return this.inputData.postCode1
    + '-' + this.inputData.postCode2;
  }
  /******************    後日formサービスに移行予定   **********************/

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
      this.user.TelNo1 = this.setTelNo();
      this.user.areaNo1 = this.inputData.areaNo1;
      this.user.areaNo2 = this.inputData.areaNo2;
      this.user.adress = this.inputData.adress;
      this.user.profileImageUrl = ''; // 仮
      this.user.postCode = this.setPostCode();
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
