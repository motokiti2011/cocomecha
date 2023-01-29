import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ApiSerchService } from '../../service/api-serch.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../cognito.service';
import { FormService } from '../../service/form.service';
import { officeInfo, employee, baseInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { user, initUserInfo } from 'src/app/entity/user';
import { UploadService } from '../../service/upload.service';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash'

@Component({
  selector: 'app-factory-register',
  templateUrl: './factory-register.component.html',
  styleUrls: ['./factory-register.component.scss']
})
export class FactoryRegisterComponent implements OnInit {

  // 入力データ
  inputData = {
    // 事業所郵便番号
    officePostCode: '',
    // 事業所電話番号リスト
    officeTel: [],
    // 営業時間
    businessHours: '',
    // 事業所PR
    officePR: '',
    // 事業所PR画像URL
    officePRimageURL: ''
  }
  // 事業所情報
  officeInfo: officeInfo = initOfficeInfo;

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  areaSelect = '';

  // 工場名
  officeName = new FormControl('', [
    Validators.required
  ]);

  // 事業所メールアドレス
  officeMailAdress = new FormControl('', [
    Validators.required,
    Validators.email
  ]);


  // 郵便番号１
  postCode1 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(3)
  ]);

  // 郵便番号２
  postCode2 = new FormControl('', [
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 電話番号１
  telNo1 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 電話番号２
  telNo2 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  // 電話番号３
  telNo3 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]*'),
    Validators.maxLength(4)
  ]);

  
  // 事業所所在地(地域)
  officeArea1 = new FormControl('', [
    Validators.required
  ]);

  // 事業所所在地（市町村）
  officeArea = new FormControl('', [
    Validators.required
  ]);

  // 事業所所在地（住所その他）
  officeAdress = new FormControl('', [
    Validators.required
  ]);


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    officeName: this.officeName,
    officeMailAdress: this.officeMailAdress,
    officeArea1: this.officeArea1,
    officeArea: this.officeArea,
    officeAdress: this.officeAdress,
    postCode1: this.postCode1,
    postCode2: this.postCode2,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
  })

  // 管理設定ユーザー
  adminSettingUser = '';
  // 従業員リスト
  employeeList: employee[] = [];
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
  // 作業内容
  workContentsOne = '';
  // 業務内容
  businessContentList: string[] = [];
  // ユーザー情報
  user: user = initUserInfo;
  // 画像情報
  imageFile: any = null;
  // テンプレートで使用するフォームを宣言
  public form!: FormGroup;

  constructor(
    private builder: FormBuilder,
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private router: Router,
    private cognito: CognitoService,
    private location: Location,
    private s3: UploadService,
    private formService: FormService,
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
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
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.imageFile = file;

  }

  /**
   * ユーザー登録情報と合わせるボタン押下時イベント
   * @param e
   */
  onSomeUserInfo(e: string) {
    if (e === '1') {
      // 名称を設定
      this.officeName.setValue(this.user.userName);
    } else if (e === '2') {
      // 電話番号を設定
      const telNo = this.formService.splitTelNo(this.user.TelNo1);
      this.telNo1.setValue(telNo.tel1);
      this.telNo2.setValue(telNo.tel2);
      this.telNo3.setValue(telNo.tel3);
    } else if (e === '3') {
      // アドレスを設定
      this.officeMailAdress.setValue(this.user.mailAdress);
    } else if (e === '4') {
      // 所在地情報を設定
      this.officeArea1.setValue(this.user.areaNo1);
      if (this.user.areaNo2) {
        this.officeArea.setValue(this.user.areaNo2);
      }
      if (this.user.adress) {
        this.officeAdress.setValue(this.user.adress);
      }
      if (this.user.postCode) {
        const post = this.formService.splitPostCode(this.user.postCode);
        this.postCode1.setValue(post.post1);
        this.postCode2.setValue(post.post2);
      }
    }

  }

  /**
   * 登録するボタン押下イベント
   */
  onRegister() {
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /**
   * 地域選択イベント
   */
  selectArea() {
    console.log('地域')
    console.log(this.areaSelect)
  }

  goBack() {
    this.location.back();
  }


  /************  以下内部処理 ****************/

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        this.inputData.officePRimageURL = data.Location;
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * 工場登録
   */
  private officeResister() {
    // 業務内容情報を設定
    this.setbusinessContent();
    // 更新データ設定
    this.officeInfo.officeName = this.officeName.value;
    this.officeInfo.officeTel = this.inputData.officeTel;
    this.officeInfo.officeMailAdress = this.officeMailAdress.value;
    this.officeInfo.officeArea1 = this.formService.setAreaId(this.officeArea1.value);
    this.officeInfo.officeArea = this.officeArea.value;
    this.officeInfo.officeAdress = this.officeAdress.value;
    this.officeInfo.officePostCode = this.formService.setPostCode(this.postCode1.value, this.postCode2.value);
    this.officeInfo.workContentList = this.businessContentList;
    this.officeInfo.officeTel.push(this.formService.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value))

    // TODO
    this.officeInfo.businessHours = [];
    this.officeInfo.baseInfoList = [];
    this.officeInfo.employeeList = [];
    this.officeInfo.officePR = this.inputData.officePR;
    this.officeInfo.officePRimageURL = this.inputData.officePRimageURL;

    this.apiUniqueService.postFactory(this.officeInfo, this.user.userId, this.user.mechanicId).subscribe(result => {
      console.log(result);
      if(result == 200) {
        alert('登録完了')
        // this.router.navigate(["/main_menu"]);
        this.location.back();
      } else {
        alert('登録失敗しました：ステータス['+ result + ']');
      }
    });
  }


  /**
   * 業務内容情報をデータに格納する
   */
  private setbusinessContent() {
    const businessContentArray = this.options.value as { name: string }[];
    const result: string[] = []

    // 資格情報を格納
    const contents = this.workContentsOne.replace(/\s+/g, '');
    if (contents != '' && contents != null) {
      result.push(this.workContentsOne);
    }
    // 追加入力した資格情報を格納
    if (businessContentArray.length > 0) {
      businessContentArray.forEach(s => {
        // 空白削除
        const businessContent = s.name.replace(/\s+/g, '');
        if (businessContent != '' && businessContent != null) {
          result.push(s.name)
        }
      });
    }
    console.log(result)
    this.businessContentList = result;
  }

}
