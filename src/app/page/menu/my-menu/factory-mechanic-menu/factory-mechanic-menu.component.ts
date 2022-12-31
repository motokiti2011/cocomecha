import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { user, initUserInfo } from 'src/app/entity/user';
import { mechanicInfo, initMechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { FactoryMenuComponent } from '../factory-menu/factory-menu.component';


@Component({
  selector: 'app-factory-mechanic-menu',
  templateUrl: './factory-mechanic-menu.component.html',
  styleUrls: ['./factory-mechanic-menu.component.scss']
})
export class FactoryMechanicMenuComponent implements OnInit {

  /** 子コンポーネントを読み込む */
  @ViewChild(FactoryMenuComponent) child!: FactoryMenuComponent;

  // ユーザー情報
  user: user = initUserInfo;
  // メカニック情報
  mechanicInfo: mechanicInfo = initMechanicInfo;
  // 工場情報
  officeInfo: officeInfo = initOfficeInfo;

  // 保有資格情報
  qualification = '';
  // 保有資格情報配列
  qualificationList:string[] = []
  // 工場区分
  officeDiv = false;
  // 工場情報表示モード
  factoryDispDiv = false;
  // 工場表示切替ボタンテキスト
  factoryBtnText = '工場情報を編集する'
  // 工場情報編集モード
  officeEditMode = false;
  // 管理アドレス区分
  adminAdress = '0';
  // 事業所紐付き区分
  officeConnectionDiv = '0';

  // 入力データ
  inputData = {
    // メカニック名
    mechanicName: '',
    // 管理ユーザーID
    adminUserId: '',
    // 管理アドレス区分
    adminAddressDiv: '',
    // 管理メールアドレス
    mailAdress: '',
    // 事業所紐づき区分
    officeConnectionDiv: '0',
    // 保有資格情報
    qualification: [''],
    // 得意作業
    specialtyWork: '',
    // プロフィール画像URL
    profileImageUrl: '',
    // 紹介文
    introduction: ''
  }

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  /** 工場登録有無区分 */
  factoryResistDiv = false;

  public form!: FormGroup;  // テンプレートで使用するフォームを宣言


  constructor(
    private activeRouter: ActivatedRoute,
    private location: Location,
    private apiService: ApiSerchService,
    private router: Router,
    private builder: FormBuilder,
    private cognito: CognitoService,
  ) { }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(params => {
      if (params['mechanicId'] != '') {
        const mechanicId = params['mechanicId'];
        this.getMechanicInfo(mechanicId);
      } else {
        alert('メカニック・工場情報が取得できませんでした。');
        this.router.navigate(["/main_menu"]);
      }
    });

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
    this.apiService.postMechanic(this.mechanicInfo, this.officeDiv).subscribe(result => {
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
    this.mechanicInfo.mechanicName = this.inputData.mechanicName;
    this.mechanicInfo.adminUserId = this.inputData.adminUserId;
    this.mechanicInfo.adminAddressDiv = this.adminAdress;
    this.mechanicInfo.mailAdress = this.inputData.mailAdress;
    this.mechanicInfo.officeConnectionDiv = this.officeConnectionDiv
    this.mechanicInfo.qualification = this.inputData.qualification;
    this.mechanicInfo.specialtyWork = this.inputData.specialtyWork;
    this.mechanicInfo.profileImageUrl = this.inputData.profileImageUrl;
    this.mechanicInfo.introduction = this.inputData.introduction;
  }

  /**
   * メカニック情報を取得する
   * @param mechanicId
   */
  private getMechanicInfo(mechanicId:string) {
    this.apiService.getMecha(mechanicId).subscribe(result => {
      // メカニック情報取得後企業コードをチェック
      if(result[0] != undefined || result[0] != null ) {
        this.mechanicInfo = result[0];
        // メカニック情報を画面に設定
        this.setMechanicInfo();
        if(this.mechanicInfo.officeId != null) {
          if(this.mechanicInfo.officeId !== '0') {
            this.getOfficeInfo(this.mechanicInfo.officeId);
          }
        }
      } else {
        alert('メカニック情報が取得できませんでした。')
        this.router.navigate(["/main_menu"]);
        return;
      }
    })
  }

  /**
   * 工場情報を取得する
   * @param officeId
   */
  private getOfficeInfo(officeId: string) {
    this.apiService.getOfficeInfo(officeId).subscribe(result => {
      if(result[0] != undefined || result[0] != null ) {
        this.officeInfo = result[0];
        // 工場名が未設定の場合
        if(this.officeInfo.officeName == ''
        ||this.officeInfo == null) {
          // 登録画面、所属工場情報のボタンを表示
          this.factoryResistDiv = true;
        } else {
          this.factoryResistDiv = false;
        }
        // 管理ユーザー情報が空白の場合
        if(this.officeInfo.adminIdList.length = 0) {
          this.officeEditMode = false;
        } else {
          this.officeEditMode = true;
        }

      }
    });
  }

  /**
   * 画面にメカニック情報を設定する
   */
  private setMechanicInfo() {
    this.inputData.mechanicName = this.mechanicInfo.mechanicName;
    this.inputData.adminUserId = this.mechanicInfo.adminUserId;
    this.inputData.adminAddressDiv = this.mechanicInfo.adminAddressDiv;
    this.inputData.mailAdress = this.setParam(this.mechanicInfo.mailAdress);
    this.inputData.officeConnectionDiv = this.mechanicInfo.officeConnectionDiv;
    this.inputData.specialtyWork = this.setParam(this.mechanicInfo.specialtyWork);
    this.inputData.profileImageUrl = this.setParam(this.mechanicInfo.profileImageUrl);
    this.inputData.introduction = this.setParam(this.mechanicInfo.introduction);
    // 保有資格は別途設定
    this.initQualification(this.mechanicInfo.qualification);
  }

  /**
   * 入力データにパラメータ設定を行う
   * @param param
   */
  private setParam(param:string | null):string {
    if(param == null) {
      return '';
    }
    return param;
  }

  /**
   * 入力データにパラメータ設定を行う
   * @param param
   */
    private initQualification(param:string[] | null) {
      if(param == null) {
        return;
      }
      let count = 0;
      param.forEach(l => {
        if(count == 0) {
          this.form.value.name = l;
        }
        const quForm = this.builder.group({
          name: [l],
        });
        this.options.push(quForm);
        count++;
      })
      this.setQualification();
    }

    /**
     * 工場情報の表示切替を行う
     */
    onFactoryDisp() {
        if(this.factoryDispDiv == false) {
          this.factoryBtnText = '閉じる';
          this.factoryDispDiv = true;
          return;
        }
        this.factoryDispDiv = false
        this.factoryBtnText = '工場情報を編集する';
    }

    /**
     * 工場登録（本所属工場新規登録）
     */
    onFactoryResister() {
      this.router.navigate(["/factory-register"]);
    }



}