/** ユーザーお気に入り情報 */
export interface userFavorite {
  // ID
  id: string;
  // ユーザーID
  userId: string;
  // 伝票番号
  slipNo: string;
  // タイトル
  title: string;
  // 価格
  price: string;
  // 期間
  whet: string;
  // サービスタイプ
  serviceType: string;
  // 終了日
  endDate: string;
  // 画像url
  imageUrl:string;
}
