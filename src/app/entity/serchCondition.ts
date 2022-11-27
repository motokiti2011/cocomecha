// サービス内容
export interface serchCondition {
  // X座標
  mapOffsetX:	number;
  // Y座標
  mapOffsetY:	number;
  // 地域ID
  areaNum: number;
  // カテゴリー
  category: number;

}

// サービス内容
export interface serchCategory {
  // ID
  id:	number;
  // カテゴリー
  category:	string;
}



export const serchCategoryData: serchCategory[] = [
  {id: 1, category: '洗車'},
  {id: 2, category: 'コーティング　ラッピング'},
  {id: 3, category: 'カスタマイズ'},
  {id: 4, category: '部品・用品取り付け'},
  {id: 5, category: '点検・整備'},
  {id: 6, category: '手続き'},
];
