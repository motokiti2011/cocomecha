import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { user, initUserInfo } from 'src/app/entity/user';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';

import { AuthUserService } from '../authUser.service';
import { ApiSerchService } from '../../service/api-serch.service';
import { UploadService } from '../../service/upload.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  // ユーザー情報
  user: user = initUserInfo;

  inputData = {
    userId: '',
    userName: '',
    mailAdress: '',
    TelNo1: '',
    areaNo1: '',
    areaNo2: '',
    adress: '',
    postCode: '',
    introduction: '',
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  imageFile: any = null;

  constructor(
    private location: Location,
    private auth: AuthUserService,
    private apiService: ApiSerchService,
    private router: Router,
    private s3: UploadService,
  ) { }

  ngOnInit(): void {
    this.auth.userInfo$.subscribe(user => {
      if(user == null) {
        alert("ログインが必要です")
        this.location.back();
        return;
      }
      this.inputData.userId = user.userId;

    });
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  show() {
    console.log(1);
  }


  selectArea() {
    console.log('県名選択：' + this.inputData.areaNo1);
    const selectData = _find(this.areaData, detail => detail.prefectures === this.inputData.areaNo1);
    if (!_isNil(selectData)) {
      // this.inputData.areaNo1 = String(selectData.id);
      this.user.areaNo1 = String(selectData.id);
    } else {
      // this.inputData.areaNo1 = '0';
    }
    console.log('実態値：' + this.user.areaNo1);
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
   * 登録ボタン押下時イベント
   */
  onResister() {
    if(this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.userResister();
    }
  }


  /************  以下内部処理 ****************/

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
    if(_isNil(this.inputData.userId) || this.inputData.userId == ''
    || _isNil(this.inputData.userName) || this.inputData.userName == ''
    || _isNil(this.inputData.areaNo1) || this.inputData.areaNo1 == ''
    || _isNil(this.inputData.mailAdress) || this.inputData.mailAdress == '') {
      alert('必須項目です。');
    } else {
      this.user.userId = this.inputData.userId;
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
