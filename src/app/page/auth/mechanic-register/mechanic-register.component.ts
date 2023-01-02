import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { user, initUserInfo } from 'src/app/entity/user';
import { mechanicInfo, initMechanicInfo } from 'src/app/entity/mechanicInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';

import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-mechanic-register',
  templateUrl: './mechanic-register.component.html',
  styleUrls: ['./mechanic-register.component.scss']
})
export class MechanicRegisterComponent implements OnInit {


  // ユーザー情報
  user: user = initUserInfo;
  // メカニック情報
  mechanicInfo: mechanicInfo = initMechanicInfo;

  // 保有資格情報
  qualification = '';
  // 保有資格情報配列
  qualificationList:string[] = [];

  // 工場区分
  officeDiv = false;

  // 管理アドレス区分
  adminAdress = '0';

  // 事業所紐付き区分
  officeConnectionDiv = '0';

  // 入力データ
  inputData = {
    // メカニックID
    mechanicId: '',
    // メカニック名
    mechanicName: '',
    // 管理ユーザーID
    adminUserId: '',
    // 管理アドレス区分
    adminAddressDiv: '',
    // 管理メールアドレス
    mailAdress: null,
    // 事業所紐づき区分
    officeConnectionDiv: '0',
    // 事業所ID
    officeId: null,
    // 保有資格情報
    qualification: [''],
    // 得意作業
    specialtyWork: null,
    // プロフィール画像URL
    profileImageUrl: null,
    // 紹介文
    introduction: null
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  public form!: FormGroup;  // テンプレートで使用するフォームを宣言

  constructor(
    private location: Location,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private builder: FormBuilder,
    private cognito: CognitoService,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if(authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.inputData.adminUserId = user[0].userId;
        this.initForm();
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * 登録するボタン押下イベント
   */
  onResister() {
    this.setQualification();
    this.inputCheck();
    console.log(this.inputData);
    console.log(this.mechanicInfo);
    this.apiUniqueService.postMechanic(this.mechanicInfo, this.officeDiv).subscribe(result => {
      if(result != 200 ) {
        alert('失敗しました')
      } else {
        alert('登録成功')
        this.router.navigate(["/main_menu"]);
      }
    });
  }

  /**
   * ユーザー登録情報と合わせるボタン押下時イベント
   * @param e
   */
  onSomeUserInfo(e:string) {
    console.log(e);
  }

  // FormBuilderを使って初期フォームを作成します。フォームの塊のFormGroupとしています。
  initForm() {
    this.form = this.builder.group({
      name: [''],
      // フォームを追加したり、削除したりするために、FormArrayを設定しています。
      options: this.builder.array([])
    });
  }

  // 追加ボタンがおされたときに追加したいフォームを定義しています。returnでFormGroupを返しています。
  get optionForm(): FormGroup {
    return this.builder.group({
      name: [''],
    });
  }

  // FormのOption部分を取り出しています。
  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  // 追加ボタンがクリックされたときに実行する関数です。
  addOptionForm() {
    this.options.push(this.optionForm);
  }

  // removeAtでインデックスを指定することで、FormArrayのフォームを削除します。
  removeOptionForm(idx: number) {
    this.options.removeAt(idx);
  }

  test1() {
    this.setQualification();
  }

  /**
   * 資格情報をデータに格納する
   */
  private setQualification() {
    const qualificationArray = this.options.value as {name:string}[];
    const result: string[] = []
    // 資格情報を格納
    const qualificationForm = this.form.value.name.replace(/\s+/g, '');
    if(qualificationForm != ''
    || qualificationForm != null ) {
      result.push(this.form.value.name);
    }
    // 追加入力した資格情報を格納
    if(qualificationArray.length > 0) {
      qualificationArray.forEach(s => {
        // 空白削除
        const qualification = s.name.replace(/\s+/g, '');
        if(qualification != '' && qualification != null) {
          result.push(s.name)
        }
      });
    }
    this.inputData.qualification = result;
  }

  /**
   * 入力チェック
   */
  private inputCheck() {
    let message: string[] = []
    if(this.inputData.mechanicName == '' || this.inputData.mechanicName == null) {
      message.push('名称')
    }
    if(this.inputData.mailAdress == '' || this.inputData.mailAdress == null) {
      message.push('電話番号')
    }
    if(this.inputData.introduction == '' || this.inputData.introduction == null) {
      message.push('紹介文')
    }
    this.mechanicInfo.mechanicId = '0'
    this.mechanicInfo.validDiv = '0'
    this.mechanicInfo.mechanicName = this.inputData.mechanicName;
    this.mechanicInfo.adminUserId = this.inputData.adminUserId;
    this.mechanicInfo.adminAddressDiv = this.adminAdress;
    this.mechanicInfo.mailAdress = this.inputData.mailAdress;
    this.mechanicInfo.officeConnectionDiv = this.officeConnectionDiv
    this.mechanicInfo.officeId = this.inputData.officeId;
    this.mechanicInfo.qualification = this.inputData.qualification;
    this.mechanicInfo.specialtyWork = this.inputData.specialtyWork;
    this.mechanicInfo.profileImageUrl = this.inputData.profileImageUrl;
    this.mechanicInfo.introduction = this.inputData.introduction;
  }



}


