import { Component, OnInit } from '@angular/core';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { UploadService } from 'src/app/page/service/upload.service';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { FormService } from 'src/app/page/service/form.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { filter as _filter} from 'lodash'
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';


@Component({
  selector: 'app-factory-menu',
  templateUrl: './factory-menu.component.html',
  styleUrls: ['./factory-menu.component.scss']
})
export class FactoryMenuComponent implements OnInit {

  /** ファイル情報 */
  imageFile: any = null;
  /** ユーザー情報 */
  user?: user
  //編集モード区分
  editModeDiv = false;
  // 表示情報
  dispInfo: officeInfo = initOfficeInfo;
  // 工場情報登録区分
  fcRegisDiv = false;
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

  // 営業時間（開始1）
  businessHoursStart1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 営業時間（開始2）
  businessHoursStart2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 営業時間（終了1）
  businessHoursEnd1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);
  businessHoursEnd2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeStart1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeStart2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeEnd1 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  breakTimeEnd2 = new FormControl('', [
    Validators.pattern('[0-9:]*'),
  ]);

  // 事業所所在地(地域)
  officeArea1 = new FormControl('', [
    Validators.required
  ]);


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    officeName: this.officeName,
    officeMailAdress: this.officeMailAdress,
    telNo1: this.telNo1,
    telNo2: this.telNo2,
    telNo3: this.telNo3,
    postCode1: this.postCode1,
    postCode2: this.postCode2,
    businessHoursStart1: this.businessHoursStart1,
    businessHoursStart2: this.businessHoursStart2,
    businessHoursEnd1: this.businessHoursEnd1,
    businessHoursEnd2: this.businessHoursEnd2,
    breakTimeStart1: this.breakTimeStart1,
    breakTimeStart2: this.breakTimeStart2,
    breakTimeEnd1: this.breakTimeEnd1,
    breakTimeEnd2: this.breakTimeEnd2,
  });

  // 作業内容
  workContentsOne = '';

  // テンプレートで使用するフォームを宣言
  public form!: FormGroup;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private s3: UploadService,
    private router: Router,
    private cognito: CognitoService,
    private overlay: Overlay,
    private builder: FormBuilder,
    private apiService: ApiSerchService,
    private formService: FormService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        this.user = user[0];
        if (this.user) {
          if (this.user.officeId != '0' && this.user.officeId != null) {
            // 工場登録ある場合表示
            this.fcRegisDiv = false;
            this.officeSetting();
            this.initForm();
          } else {
            // 登録がない場合、登録ボタンのみ表示
            this.fcRegisDiv = true;
            // ローディング解除
            this.overlayRef.detach();
          }
        } else {
          alert('ログインが必要です');
          // ローディング解除
          this.overlayRef.detach();
          this.router.navigate(["/main_menu"]);
        }
      });

    }
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

  show(info: officeInfo, editFlg: boolean) {
    this.editModeDiv = editFlg;
    this.dispInfo = info;
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
  onRegister() {
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /**
   * 工場情報を変更を登録する
   */
  private officeResister() {
    this.setRegisterWorkContents();
    this.setBusinessHour()
    this.dispInfo.officeName = this.officeName.value;
    this.dispInfo.officeTel[0] = this.formService.setTelNo(this.telNo1.value, this.telNo2.value, this.telNo3.value)
    this.dispInfo.officeMailAdress = this.officeMailAdress.value;
    this.dispInfo.officeArea1 = this.formService.setAreaId(this.officeArea1.value);
    this.dispInfo.officePostCode = this.formService.setPostCode(this.postCode1.value, this.postCode2.value);
    this.dispInfo.officePR = this.officeName.value;
    this.apiService.postOffice(this.dispInfo).subscribe(res => {
      if (res == 200) {
        alert('更新しました。')
      } else {
        alert('更新に失敗しました。')
        console.log(res);
      }
    });
  }


  /**
   * 工場登録はこちらからボタン押下イベント
   */
  onInitFactory() {
    this.router.navigate(["factory-register"]);
  }

  onSomeUserInfo(e: string) {

  }




  /************  以下内部処理 ****************/


  /**
   * 工場情報を取得する
   */
  private officeSetting() {
    if (!this.user?.officeId) {
      return;
    }
    this.apiService.getOfficeInfo(this.user.officeId).subscribe(res => {
      console.log(res);
      if (!res[0]) {
        alert('ログインが必要です');
        // ローディング解除
        this.overlayRef.detach();
        this.router.navigate(["/main_menu"]);
        return
      }
      this.initSetting(res[0]);

    });

    // ローディング解除
    this.overlayRef.detach();
  }

  /**
   * 工場情報の初期表示設定を行う
   * @param info 
   */
  private initSetting(info: officeInfo) {
    this.dispInfo.officeId = info.officeId;
    this.officeArea1.setValue(this.formService.setAreaName(info.officeArea1));
    this.dispInfo.officeArea = info.officeArea;
    this.dispInfo.officeAdress = info.officeAdress;
    this.dispInfo.officePR = info.officePR;
    this.dispInfo.created = info.created;
    this.officeName.setValue(info.officeName);
    this.officeMailAdress.setValue(info.officeMailAdress);
    const tel = this.formService.splitTelNo(info.officeTel[0]);
    this.telNo1.setValue(tel.tel1);
    this.telNo2.setValue(tel.tel2);
    this.telNo3.setValue(tel.tel3);
    if (info.officePostCode) {
      const post = this.formService.splitPostCode(info.officePostCode);
      this.postCode1.setValue(post.post1);
      this.postCode2.setValue(post.post2);
    }

    if (info.businessHours.length > 0) {
      this.businessHoursStart1.setValue(info.businessHours[0])
      this.businessHoursStart2.setValue(info.businessHours[1])
      this.businessHoursEnd1.setValue(info.businessHours[2])
      this.businessHoursEnd2.setValue(info.businessHours[3])
      this.breakTimeStart1.setValue(info.businessHours[4])
      this.breakTimeStart2.setValue(info.businessHours[5])
      this.breakTimeEnd1.setValue(info.businessHours[6])
      this.breakTimeEnd2.setValue(info.businessHours[7])
    }
    // 業務内容の設定
    if (info.workContentList.length > 0) {
      this.setWorkContents(info.workContentList);
    }
  }

  /**
   * 作業内容を設定する
   * @param workContents 
   */
  private setWorkContents(workContents: string[]) {
    let count = 0;
    workContents.forEach(l => {
      if (count == 0) {
        this.workContentsOne = l;
      } else {
        const quForm = this.builder.group({
          name: [l],
        });
        this.options.push(quForm);
      }
      count++;
    });

  }

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  /**
   * 資格情報をデータに格納する
   */
  private setRegisterWorkContents() {
    const contentsArray = this.options.value as { name: string }[];
    const result: string[] = []
    // 資格情報を格納
    const contentsForm = this.workContentsOne.replace(/\s+/g, '');
    if (contentsForm != '' && contentsForm != null) {
      result.push(this.workContentsOne);
    }
    // 追加入力した資格情報を格納
    if (contentsArray.length > 0) {
      contentsArray.forEach(s => {
        // 空白削除
        const contents = s.name.replace(/\s+/g, '');
        if (contents != '' && contents != null) {
          result.push(s.name)
        }
      });
    }
    this.dispInfo.workContentList = result;
  }


  /**
   * 営業時間、休憩時間データを登録データに設定する
   */
  private setBusinessHour() {
    const hourList = [];
    hourList.push(this.businessHoursStart1.value)
    hourList.push(this.businessHoursStart2.value)
    hourList.push(this.businessHoursEnd1.value)
    hourList.push(this.businessHoursEnd2.value)
    hourList.push(this.breakTimeStart1.value)
    hourList.push(this.breakTimeStart2.value)
    hourList.push(this.breakTimeEnd1.value)
    hourList.push(this.breakTimeEnd2.value)
    this.dispInfo.businessHours = hourList;
  }


}
