import { Component, OnInit } from '@angular/core';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';


@Component({
  selector: 'app-factory-menu',
  templateUrl: './factory-menu.component.html',
  styleUrls: ['./factory-menu.component.scss']
})
export class FactoryMenuComponent implements OnInit {

  constructor() { }

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


  onResister() {

  }



}
