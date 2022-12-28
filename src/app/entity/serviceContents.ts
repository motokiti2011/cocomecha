// サービス内容
export interface serviceContents {
  // ID
  id:	string;
  // ユーザーID
  userId: string;
  // ユーザー名
  userName: string;
  // メカニックID
  mechanicId: string| null;
  // 事業所ID
  officeId: string| null;
  // タイトル
  title: string;
  // 作業場所
  workArea: string;
  // 価格
  price: number;
  // 地域
  area:number;
  // カテゴリー
  category:string;
  // 対象車両
  targetVehcle:string;
  // 入札方式
  bidMethod: string;
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
  // メッセージ公開レベル
  msgLv: string;
  // 画像url
  thumbnailUrl: string;
  // 画像urlリスト
  imageUrlList: string[]| null;
  // 論理削除フラグ
  logicalDeleteFlag: number;
  // 対象サービス内容
  targetService: string;
}

export const initServiceContent:serviceContents = {
  id: '0',
  userId: '0',
  userName: '',
  mechanicId: null,
  officeId: null,
  title: '',
  workArea: '',
  price: 0,
  area: 0,
  category: '0',
  bidMethod: '1',
  targetVehcle:'',
  explanation: '',
  bidderId: 0,
  favoriteFlg:false,
  registeredDate: 0,
  preferredDate: 0,
  preferredTime: 0,
  msgLv:'1',
  thumbnailUrl:'',
  imageUrlList:null,
  logicalDeleteFlag: 0,
  targetService: '0'
}
