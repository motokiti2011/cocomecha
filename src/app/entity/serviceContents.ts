// サービス内容
export interface serviceContents {
  // ID
  id:	string;
  // ユーザーID
  useId: string;
  // タイトル
  title: string;
  // 価格
  price: number;
  // 地域
  area:number;
  // カテゴリー
  category:number;
  // 入札方式
  bidMethod: number;
  // 説明
  explanation: string;
  // 入札者ID
  bidderId: number;
  // お気に入りフラグ
  favoriteFlg:boolean;
  // 登録日
  registeredDate: number
  // 希望日
  preferredDate:number;
  // 希望時間
  preferredTime:number;
  // 画像url
  imageUrl: string;
  // 論理削除フラグ
  logicalDeleteFlag: number;
}
