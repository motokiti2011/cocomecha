import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { area1SelectArea2, area1SelectArea2Data } from 'src/app/entity/area1SelectArea2';
import { fcmcSerchResult, fcmcSerchData, initSerchData } from 'src/app/entity/fcmcSerchResult';

import {
  filter as _filter,
} from 'lodash';
import { officeInfo, connectionOfficeInfo, adminSettingInfo } from 'src/app/entity/officeInfo';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

/**
 * 工場管理者設定モーダル
 */
@Component({
  selector: 'app-factory-admin-setting-modal',
  templateUrl: './factory-admin-setting-modal.component.html',
  styleUrls: ['./factory-admin-setting-modal.component.scss']
})
export class FactoryAdminSettingModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<FactoryAdminSettingModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: officeInfo,
  ) { }

  /** タイトル */
  title = '工場管理者設定';
  /** 検索条件 */
  serchInfo: fcmcSerchData = initSerchData;
  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** 地域２（市町村）データ */
  areaCityData: area1SelectArea2[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** 表示データ */
  dispData: adminSettingInfo[] = [];
  /** 検索結果 */
  serchResult? : fcmcSerchResult[];
  /** 一覧表示切替区分 */
  listDispSwitchDiv = false;

  ngOnInit(): void {
    // 表示情報に管理者情報を設定
    this.dispData = this.data.adminSettingInfo;

  }


  onSerch() {

  }

  /**
   * メカニック検索
   * @param serchData
   */
  onSerchMechanic(serchData:fcmcSerchResult ) {

  }

  /**
   * 管理者選択イベント
   * @param user
   */
  onSelectAdminUser(user: adminSettingInfo) {

  }

  /**
   * 閉じる押下時イベント
   */
  closeModal() {
    this._dialogRef.close();
  }


}
