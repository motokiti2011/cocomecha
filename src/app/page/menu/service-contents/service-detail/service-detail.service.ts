import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';
import { userFavorite } from 'src/app/entity/userFavorite';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { image } from 'src/app/entity/image';

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailService {

  constructor(
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
    if (serviceType !== '0') {
      return this.apiUniqueService.getServiceContents(slipNo);
    }
    return this.apiUniqueService.getSlip(slipNo);
  }

  /**
   * 画像に番号を振り、表示用リストに格納する。
   * @param thumbnailUrl
   * @param imageList
   * @returns
   */
  public setImages(thumbnailUrl: string, imageList: string[]): image[] {

    let resultList: image[] = [];
    // サムネイル画像が存在しない場合画像はなし
    if (thumbnailUrl == '' || thumbnailUrl == null) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage);
      return resultList;
    } else {
      const item: image = {
        imageNo: String(0), src: thumbnailUrl
      }
      resultList.push(item);
    }

    if (imageList.length == 0) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage)
    }
    let count = 0;
    imageList.forEach(image => {
      const item: image = {
        imageNo: String(count), src: image
      }
      resultList.push(item);
      count++;
    });
    return resultList;
  }




  /**
   * お気に入り情報を追加する
   * @param service 
   * @param userId 
   * @returns 
   */
  public addFavorite(service: salesServiceInfo, userId: string): Observable<any> {
    const favorite: userFavorite = {
      id: '', // ID
      userId: userId, // ユーザーID
      slipNo: service.slipNo, // 伝票番号
      title: service.title, // タイトル
      price: service.price, // 価格
      whet: '', // 期間
      serviceType: service.targetService, // サービスタイプ
      endDate:service.completionDate, // 終了日
      imageUrl: service.thumbnailUrl, // 画像url
      created: '',// 作成日時
      updated: '',      // 更新日時
    }
    return this.apiService.postFavorite(favorite);
  }





}
