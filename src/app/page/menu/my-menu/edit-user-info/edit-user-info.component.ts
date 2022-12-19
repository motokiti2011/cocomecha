import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { user } from 'src/app/entity/user';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';

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

  constructor(
    private location: Location,
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private router: Router,
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

  private setDispDate(userId: string) {
    this.apiService.getUser(userId).subscribe(data => {
      if(data[0]) {
        const user:user = data[0];
        this.inputData.userName = user.userName;
        this.inputData.mailAdress = user.mailAdress;
        this.inputData.TelNo1 = this.isSerParm(user.TelNo1,'tel');
        this.inputData.TelNo2 = this.isSerParm(user.TelNo2,'tel');
        this.inputData.areaNo1 = this.isSerParm(user.areaNo1,'area1');
        this.inputData.areaNo2 = this.isSerParm(user.areaNo2,'area2');
        this.inputData.adress = this.isSerParm(user.adress,'adress');
        this.inputData.postCode = this.isSerParm(user.postCode,'postCode');
      } else {
        alert('データが取得できませんでした。再度アクセスしてください')
        this.location.back();
      }
    });
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


  selectArea() {

  }



  onResister() {
    console.log('');
  }


}
