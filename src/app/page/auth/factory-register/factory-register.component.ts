import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { officeInfo, employee, baseInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { user, initUserInfo } from 'src/app/entity/user';

@Component({
  selector: 'app-factory-register',
  templateUrl: './factory-register.component.html',
  styleUrls: ['./factory-register.component.scss']
})
export class FactoryRegisterComponent implements OnInit {

  // 入力データ
  inputData = {
    // 工場名
    officeName: '',
    // 事業所所在地１
    officeArea1: '',
    // 事業所所在地２
    officeArea: '',
    // 事業所所在地
    officeAdress: '',
    // 事業所郵便番号
    officePostCode: '',
    // 事業所電話番号リスト
    officeTel: [],
    // 事業所メールアドレス
    officeMailAdress: '',
    // 営業時間
    businessHours: '',
    // 事業所PR
    officePR:  '',
    // 事業所PR画像URL
    officePRimageURL: ''
  }
  // 事業所情報
  officeInfo:officeInfo = initOfficeInfo;

  // 電話番号
  telNo = '';
  // 管理設定ユーザー
  adminSettingUser = '';
  // 従業員リスト
  employeeList:employee[] = [];
  // 拠点情報リスト
  baseInfoList: baseInfo[] = [];
  // 営業時間（開始）businessHours
  businessHoursStart = ''
  // 営業時間（終了）
  businessHoursEnd = ''
  // 休憩時間(開始)
  restHoursStart = '';
  // 休憩時間(開始)
  restHoursEnd = '';
  // 業務内容
  businessContentList: string[] = [];

  user: user = initUserInfo;


  public form!: FormGroup;  // テンプレートで使用するフォームを宣言


  constructor(
    private builder: FormBuilder,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private cognito: CognitoService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if(authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        this.initForm();
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }
    this.initForm();
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
    this.setbusinessContent();
  }

  /**
   * 業務内容情報をデータに格納する
   */
  private setbusinessContent() {
    const businessContentArray = this.options.value as {name:string}[];
    const result: string[] = []

    // 資格情報を格納
    const contents = this.form.value.name.replace(/\s+/g, '');
    if(contents != ''
    || contents != null ) {
      console.log(contents);
      console.log(this.form.value.name);
      result.push(this.form.value.name);
    }
    // 追加入力した資格情報を格納
    if(businessContentArray.length > 0) {
      businessContentArray.forEach(s => {
        // 空白削除
        const businessContent = s.name.replace(/\s+/g, '');
        if(businessContent != '' && businessContent != null) {
          result.push(s.name)
        }
      });
    }
    console.log(result)
    this.businessContentList = result;
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
      // 業務内容情報を設定
      this.setbusinessContent();
      // 更新データ設定
      this.officeInfo.officeName = this.inputData.officeName;
      this.officeInfo.officeTel = this.inputData.officeTel;
      this.officeInfo.officeMailAdress = this.inputData.officeMailAdress;
      this.officeInfo.officeArea1 = this.inputData.officeArea1;
      this.officeInfo.officeArea = this.inputData.officeArea;
      this.officeInfo.officeAdress = this.inputData.officeAdress;
      this.officeInfo.officePostCode = this.inputData.officePostCode;
      this.officeInfo.workContentList = this.businessContentList;
      // TODO
      this.officeInfo.businessHours = [];
      this.officeInfo.baseInfoList = [];
      this.officeInfo.employeeList = [];
      this.officeInfo.officePR = this.inputData.officePR;
      this.officeInfo.officePRimageURL = this.inputData.officePRimageURL;

      this.apiUniqueService.postFactory(this.officeInfo, this.user.userId, this.user.mechanicId).subscribe(result => {
        console.log(result);
      });
    }

    goBack() {
      this.location.back();
    }

}
