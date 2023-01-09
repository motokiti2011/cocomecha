import { Component, OnInit } from '@angular/core';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { UploadService } from 'src/app/page/service/upload.service';

@Component({
  selector: 'app-factory-menu',
  templateUrl: './factory-menu.component.html',
  styleUrls: ['./factory-menu.component.scss']
})
export class FactoryMenuComponent implements OnInit {


  imageFile:any = null;

  constructor(
    private s3: UploadService,
  ) { }

  ngOnInit(): void {
  }

  //編集モード区分
  editModeDiv = false;
  // 表示情報
  dispInfo: officeInfo = initOfficeInfo;


  show(info:officeInfo, editFlg: boolean) {
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
  onResister() {
    if(this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /************  以下内部処理 ****************/

  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        // this.mechanicInfo.profileImageUrl = data.Location;
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * 工場情報を登録する
   */
  private officeResister() {

  }



}
