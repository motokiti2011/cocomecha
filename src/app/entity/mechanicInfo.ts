export interface mechanicInfo {
  // メカニックID
  mechanicId: string;
  // 有効・無効区分
  validDiv: string;
  // メカニック名
  mechanicName: string;
  // 管理ユーザーID
  adminUserId: string;
  // 管理アドレス区分
  adminAddressDiv: string;
  // 管理メールアドレス
  mailAdress: string | null;
  // 事業所紐づき区分
  officeConnectionDiv: string;
  // 事業所ID
  officeId: string| null;
  // 保有資格情報
  qualification: string[] | null;
  // 得意作業
  specialtyWork: string | null;
  // プロフィール画像URL
  profileImageUrl: string | null;
  // 紹介文
  introduction: string | null;
  // 評価情報IDリスト
  evaluationInfoIdList: string[] | null;
  // 更新ユーザーID
  updateUserId: string;
  // 登録日
  created: string | null;
  // 更新日
  updated: string | null;
}


export const initMechanicInfo : mechanicInfo = {
  // メカニックID
  mechanicId: '',
  // 有効・無効区分
  validDiv: '',
  // メカニック名
  mechanicName: '',
  // 管理ユーザーID
  adminUserId: '',
  // 管理アドレス区分
  adminAddressDiv: '',
  // 管理メールアドレス
  mailAdress: null,
  // 事業所紐づき区分
  officeConnectionDiv: '0',
  // 事業所ID
  officeId: null,
  // 保有資格情報
  qualification: null,
  // 得意作業
  specialtyWork: null,
  // プロフィール画像URL
  profileImageUrl: null,
  // 紹介文
  introduction: null,
  // 評価IDリスト
  evaluationInfoIdList: null,
  // 更新ユーザーID
  updateUserId: '',
  // 登録日
  created: '',
  // 更新日
  updated: ''
}
