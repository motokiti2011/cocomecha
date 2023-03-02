import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { officeInfo, connectionOfficeInfo } from 'src/app/entity/officeInfo';
import { ApiUniqueService } from '../../service/api-unique.service';

/**
 * 関連工場コンポーネント
 */
@Component({
  selector: 'app-connection-factory-modal',
  templateUrl: './connection-factory-modal.component.html',
  styleUrls: ['./connection-factory-modal.component.scss']
})
export class ConnectionFactoryModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<ConnectionFactoryModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: officeInfo,
    private uniqueService: ApiUniqueService,
  ) { }

  // 表示情報リスト
  dispData: connectionOfficeInfo[] = [];

  ngOnInit(): void {
    // 現在登録中の関連工場情報を設定
    if(this.data.connectionOfficeInfo) {
      this.dispData = this.data.connectionOfficeInfo;
    }
  }

  /**
   * 関連工場ステータス変更イベント
   * @param connectionOffice
   */
  onStatusEdit(connectionOffice:connectionOfficeInfo) {
    this.statusEditConnection(connectionOffice).subscribe(data => {

    })
  }




  /************** 内部処理 ****************/

  /**
   * 関連工場ステータス編集を行う
   */
  private statusEditConnection(connectionOffice:connectionOfficeInfo):Observable<connectionOfficeInfo> {
    return this.uniqueService.editConnectionOfficeStatus(connectionOffice);
  }



}
