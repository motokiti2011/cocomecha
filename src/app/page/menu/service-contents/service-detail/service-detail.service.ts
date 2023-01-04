import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
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
    if(serviceType !== '0') {
      return this.apiUniqueService.getServiceContents(slipNo);
    }
    return this.apiUniqueService.getSlip(slipNo);
  }

  /**
   * 画像に番号を振り、表示用リストに格納する。
   * @param imageList
   * @returns
   */
  public setImages(imageList: string[]): image[] {
    let resultList:image[] = [];
    if(imageList.length == 0) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage)
    }
    let count = 0;
    imageList.forEach(image => {
      const item :image = {
        imageNo: String(count), src:image
      }
      resultList.push(item);
      count++;
    });
    return resultList;
  }





}
