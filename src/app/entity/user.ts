export interface user {
  // ユーザーID
  useId: number;
  // ユーザー名
  userName: string;
  // メールアドレス
  mailAdress: string;
  // 地域
  area: string;
  // 法人区分
  corporationDiv: string;
  // 事業所名
  officeName: string;
  // 紹介文
  introduction: string;
  // 登録日
  registeredDate: number
  // 終了日
  completiondate:number;
  // 論理削除フラグ
  logicalDeleteFlag: boolean;
}
