import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { FormService } from 'src/app/page/service/form.service';
import { user, initUserInfo } from 'src/app/entity/user';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash'
import { UploadService } from 'src/app/page/service/upload.service';
import { postCodeInfo, postCodeInfoData } from 'src/app/entity/postCodeInfo';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.scss']
})
export class EditUserInfoComponent implements OnInit {

  /** フォームコントロール */
  name = new FormControl('名前', [
    Validators.required
  ]);

  mail = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  telNo1 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  telNo2 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  telNo3 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  postCode1 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(3)
  ]);

  postCode2 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    name: this.name,
    mail: this.mail,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
    postCode1: this.postCode1,
    postCode2: this.postCode2
  })

  /** その他インプットデータ */
  inputData = {
    areaNo1: '',
    areaNo2: '',
    adress: '',
    introduction: '',
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  /** ユーザー情報 */
  user: user = initUserInfo;

  imageFile: any = null;

  constructor(
    private location: Location,
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private router: Router,
    private s3: UploadService,
    private builder: FormBuilder,
    private form: FormService,
  ) { }


  ngOnInit(): void {
    const user = this.cognito.initAuthenticated();
    if (user == null) {
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
  private isSerParm(parm: string | null, subject: string): string {
    if (parm != null && parm != '') {
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
   * 郵便番号入力時イベント
   */
  onPostCodeSerch() {
    const post1 = this.postCode1.value.replace(/\s+/g, '');
    const post2 = this.postCode2.value.replace(/\s+/g, '');
    const post = post1 + post2;
    // 郵便番号1,2の入力が行われた場合に郵便番号から地域検索を行う
    if(post1 != '' && post2 != '' ) {
      const postCodeConectData = _find(postCodeInfoData, data => data.postCode == post)
      if(postCodeConectData) {
        // 地域1(都道府県名)
        this.areaSelect = postCodeConectData.prefecturesCode;
        this.inputData.areaNo1 = postCodeConectData.prefecturesCode;
        // 地域2(市町村)
        this.inputData.areaNo2 = postCodeConectData.municipality;
        // 地域3(その他)
        this.inputData.adress = postCodeConectData.townArea;
      }
    }
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
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.userResister();
    }
  }

  inputCheck() {
    this.user.userName = this.name.value;
    this.user.mailAdress = this.mail.value;
    this.user.TelNo1 = this.form.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value);
    // this.user.TelNo2 = this.inputData.TelNo2;
    this.user.areaNo1 = this.inputData.areaNo1;
    this.user.areaNo2 = this.inputData.areaNo2;
    this.user.adress = this.inputData.adress;
    this.user.profileImageUrl = ''; // 仮
    this.user.postCode = this.form.setPostCode(this.postCode1.value, this.postCode2.value);
    this.user.introduction = this.inputData.introduction;

  }


  /************  以下内部処理 ****************/

  /**
   * 表示データを設定する
   * @param userId
   */
  private setDispDate(userId: string) {
    this.apiService.getUser(userId).subscribe(data => {
      if (data[0]) {
        this.user = data[0];
        let telNo = { tel1: '', tel2: '', tel3: '' }
        if (this.user.TelNo1) {
          telNo = this.form.splitTelNo(this.user.TelNo1);
        }
        let postCode = { post1: '', post2: '' }
        if (this.user.postCode) {
          postCode = this.form.splitPostCode(this.user.postCode);
        }


        this.name.setValue(this.user.userName);
        this.mail.setValue(this.user.mailAdress);
        this.telNo1.setValue(telNo.tel1);
        this.telNo2.setValue(telNo.tel2);
        this.telNo3.setValue(telNo.tel3);
        this.inputData.areaNo1 = this.isSerParm(this.user.areaNo1, 'area1');
        this.inputData.areaNo2 = this.isSerParm(this.user.areaNo2, 'area2');
        this.inputData.adress = this.isSerParm(this.user.adress, 'adress');
        this.postCode1.setValue(postCode.post1);
        this.postCode2.setValue(postCode.post2);
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
    if (_isNil(this.inputData.areaNo1)
      || this.inputData.areaNo1 == '') {
      alert('必須項目です。');
    } else {
      this.user.userValidDiv = '0';
      this.user.corporationDiv = '0';
      this.user.userName = this.name.value;
      this.user.mailAdress = this.mail.value;
      this.user.TelNo1 = this.form.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value);
      this.user.areaNo1 = this.inputData.areaNo1;
      this.user.areaNo2 = this.inputData.areaNo2;
      this.user.adress = this.inputData.adress;
      this.user.profileImageUrl = ''; // 仮
      this.user.postCode = this.form.setPostCode(this.postCode1.value, this.postCode2.value);
      this.user.introduction = this.inputData.introduction;

      this.apiService.postUser(this.user).subscribe(result => {
        if (result == undefined) {
          // TODO
          alert('失敗');
        }
        alert('変更しました。');
        // this.router.navigate(["/main_menu"])
      });
    }
  }


}
