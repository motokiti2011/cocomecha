import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceSerchConditionsService } from './service-serch-conditions.service';
import { serchCondition } from 'src/app/entity/serchCondition';

@Component({
  selector: 'app-service-serch-conditions',
  templateUrl: './service-serch-conditions.component.html',
  styleUrls: ['./service-serch-conditions.component.scss']
})
export class ServiceSerchConditionsComponent implements OnInit {

  pageX = ''
  pageY = ''
  offsetX = ''
  offsetY = ''


  /**
   * 検索条件
   */
  serchCondition : serchCondition = {
    mapOffsetX: 0,
    mapOffsetY: 0,
    areaNum:0,
    category : 0,
  }


  constructor(
    private location: Location,
    private service: ServiceSerchConditionsService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
   goBack():void {
    this.location.back();
  }


  /**
   * mapがクリックされた場合に座標情報からクリック位置を決定する
   * @param e 座標情報
   */
  mapSelect(e:any) {
    this.offsetX = e.offsetX
    this.offsetY = e.offsetY

    this.serchCondition.mapOffsetX =  e.offsetX;
    this.serchCondition.mapOffsetY = e.offsetY;
    const serchResult = this.service.coordinateMap(this.serchCondition);

    // 戻り値が0以外の場合検索結果を格納の上画面遷移
    if(serchResult > 0) {
      this.serchCondition.areaNum = serchResult;
      this.router.navigate(["service_list"],
       {queryParams:{areaNum :this.serchCondition.areaNum ,category: 0}});        
    }
  }

  /**
   * 都道府県名エリアがクリックされた際に検索条件に組み込み
   * サービス一覧画面に遷移する。
   * @param i 件名管理ID
   */
  areaSelect(i:number) {
    // 検索条件の都道府県IDに選択地を設定する
    this.serchCondition.areaNum = i;
    this.router.navigate(["service_list"],
    {queryParams:{areaNum :this.serchCondition.areaNum ,category: 0}});
  }

  /**
   * サービス内容から探すが選択された際の処理
   * @param i サービスカテゴリー選択値
   */
   contentsSelect(i:number) {
    // 検索条件のサービスカテゴリーIDに設定する
    this.serchCondition.category = i;
    this.router.navigate(["service_list"],
    {queryParams:{areaNum :0 ,category: this.serchCondition.category}});  
  }


}
