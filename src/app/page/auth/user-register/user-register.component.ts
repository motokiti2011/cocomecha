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
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthUserService } from '../authUser.service';
import { ApiSerchService } from '../../service/api-serch.service';
import { UploadService } from '../../service/upload.service';
import { FormService } from '../../service/form.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { area1SelectArea2, area1SelectArea2Data } from 'src/app/entity/area1SelectArea2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SingleImageModalComponent } from 'src/app/page/modal/single-image-modal/single-image-modal.component';
import { imgFile } from 'src/app/entity/imgFile';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  // ユーザー情報
  user: user = initUserInfo;


  /** フォームコントロール */
  name = new FormControl('', [
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
    // mail: this.mail,
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

  /** 地域２（市町村）データ */
  areaCityData: area1SelectArea2[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** イメージ */
  imageFile: imgFile[] = []

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });


  constructor(
    private location: Location,
    private apiService: ApiSerchService,
    private router: Router,
    private s3: UploadService,
    private builder: FormBuilder,
    private form: FormService,
    private cognito: CognitoService,
    private overlay: Overlay,
    public modal: MatDialog,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    const user = this.cognito.initAuthenticated();
    if (user == null) {
      alert("ログインが必要です")
      this.location.back();
      // ローディング解除
      this.overlayRef.detach();
      return;
    }
    console.log(user);
    this.apiService.getUser(user).subscribe(data => {
      this.user.userId = data[0].userId;
      // 初回はメールアドレスしかないので格納する
      this.mail.setValue(data[0].mailAdress);
      // ローディング解除
      this.overlayRef.detach();
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

  /**
   * 地域選択イベント
   */
  selectArea() {
    console.log('県名選択：' + this.inputData.areaNo1);
    this.inputData.areaNo1 = this.areaSelect;
    this.areaCityData = _filter(area1SelectArea2Data, data => data.prefecturesCode == this.areaSelect);

  }

  /**
   * 市町村選択イベント
   */
  onSelectCity() {
    this.inputData.areaNo2 = this.citySelect;
    // console.log(this.inputData.area2);
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
 * 画像を添付するボタン押下イベント
 */
  onImageUpload() {
    // 画像添付モーダル展開
    const dialogRef = this.modal.open(SingleImageModalComponent, {
      width: '750px',
      height: '600px',
      data: this.imageFile
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        // 返却値　無理に閉じたらundifind
        console.log('画像モーダル結果:' + result)
        if (result != undefined && result != null) {
          if (result.length != 0) {
            this.imageFile = result;
          }
        }
      }
    );
  }

  /**
   * 登録ボタン押下時イベント
   */
  onResister() {
    if (this.imageFile != null) {
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
    this.s3.onManagedUpload(this.imageFile[0].file).then((data) => {
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
    if (_isNil(this.inputData.areaNo1) || this.inputData.areaNo1 == '') {
      alert('必須項目です。');
    } else {
      this.user.userId = this.user.userId;
      this.user.userValidDiv = '0';
      this.user.corporationDiv = '0';
      this.user.userName = this.name.value;
      this.user.mailAdress = this.mail.value;
      this.user.TelNo1 = this.form.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value);
      this.user.areaNo1 = this.areaSelect;
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
        this.router.navigate(["/main_menu"])
      });
    }
  }

}
