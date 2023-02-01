import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user, initUserInfo } from 'src/app/entity/user';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { FormService } from 'src/app/page/service/form.service';
import { userVehicle, vehicleNumberPlate, selectEraName, selectColoer } from 'src/app/entity/userVehicle';

@Component({
  selector: 'app-vehicle-menu',
  templateUrl: './vehicle-menu.component.html',
  styleUrls: ['./vehicle-menu.component.scss']
})
export class VehicleMenuComponent implements OnInit {

  /** ユーザー情報　*/
  user: user = initUserInfo;
  /** 車両リスト　*/
  vehicleList: userVehicle[] = [];


  constructor(
    private cognito: CognitoService,
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private router: Router,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        console.log(user);
        this.user = user[0];
        this.getVehicleList();
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }
  }

  /**
  * ご登録の車両情報はこちらボタン押下イベント
  */
  onVehcleInfo() {
    this.router.navigate(["/vehicle-register"]);
    console.log('vehicle-register')
  }

  /**
   * 車両選択イベント
   * @param id
   */
  onVehicleSelect(id: string) {
    console.log(id);
    // 選択されたIDをキーに車両詳細画面に遷移する
    this.router.navigate(["edit-vehicle"],
      {
        queryParams: {vehicleId: id}
      });



  }



  /**
   * 車両情報を取得する
   */
  private getVehicleList() {
    this.apiGsiService.serchVehicle(this.user.userId, '0').subscribe(result => {
      if (result) {
        this.vehicleList = result;
        this.setDispData();
      }
    });
  }

  /**
   * 取得した車両情報を表示用に整える
   */
  private setDispData() {
    this.vehicleList.forEach(vehicle => {
      // ナンバー表示変更
      vehicle.vehicleNo = vehicle.vehicleNoAreaName + ' ' + vehicle.vehicleNoClassificationNum
        + ' ' + vehicle.vehicleNoKana + ' ' + vehicle.vehicleNoSerialNum;
      vehicle.inspectionExpirationDate = this.setInspectionData(vehicle.inspectionExpirationDate);
    });
  }


  /**
   * 車検満了日と現在の日付から表示内容を設定する。
   * @param date
   * @returns
   */
  private setInspectionData(date: string): string {
    let result = '未設定です。'
    if (date) {
      return date;
    }
    return result;
  }

  /**
   * 履歴ボタン押下イベント
   * @param id
   */
  onHistory(id: string) {
    // 車両履歴モーダルを展開
  }

  /**
   * 削除ボタン押下イベント
   * @param id
   */
  onDeleteVehicle(id: string) {
    // 削除前にダイアログ表示
    alert('削除しますか？');


  }



}