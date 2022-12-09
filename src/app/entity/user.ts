export interface user {
  // ユーザーID
  useId: string;
  // 有効無効区分
  userValidDiv: string;
  // 法人区分
  corporationDiv: string;
  // ユーザー名
  userName: string;
  // メールアドレス
  mailAdress: string;
  // 電話番号1
  TelNo1: string | null;
  // 電話番号2
  TelNo2: string | null;
  // 地域1
  areaNo1: string;
  // 地域2
  areaNo2: string | null;
  // 住所
  adress: string | null;
  // 郵便番号
  postCode: string | null;
  // 事業所ID
  officeId: string | null;
  // 拠点ID
  baseId: string | null;
  // 会社役割
  officeRole: string | null;
  // 紹介文
  introduction: string | null;
  // 更新ユーザーID
  updateUserId: string;
  // 登録日
  created: number | null;
  // 更新日
  updated: number | null;
}


export const initUserInfo : user = {
      // ユーザーID
      useId: '',
      // 有効無効区分
      userValidDiv: '0',
      // 法人区分
      corporationDiv: '0',
      // ユーザー名
      userName: '',
      // メールアドレス
      mailAdress: '',
      // 電話番号1
      TelNo1: null,
      // 電話番号2
      TelNo2: null,
      // 地域1
      areaNo1: '',
      // 地域2
      areaNo2: null,
      // 住所
      adress: null,
      // 郵便番号
      postCode: null,
      // 事業所ID
      officeId: null,
      // 拠点ID
      baseId: null,
      // 会社役割
      officeRole: '',
      // 紹介文
      introduction: '',
      // 更新ユーザーID
      updateUserId: '',
      // 登録日
      created: null,
      // 更新日
      updated: null
}
