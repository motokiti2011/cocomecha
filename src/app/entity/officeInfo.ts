export interface officeInfo {
  // 事業所ID
  officeId: string;
  // 事業所名
  officeName: string;
  // 事業所電話番号リスト
  officeTel: string[];
  // 事業所メールアドレス
  officeMailAdress: string;
  // 事業所所在地１
  officeArea1: string;
  // 事業所所在地２
  officeArea: string;
  // 事業所所在地
  officeAdress: string;
  // 事業所郵便番号
  officePostCode: string;
  // 業務内容リスト
  workContentList: string[];
  // 営業時間
  businessHours: string[];
  // 管理拠点ID
  adminBaseId: string;
  // 拠点情報リスト
  baseInfoList: Array<baseInfo>| null;
  // 管理者IDリスト
  adminIdList: string[];
  // 従業員リスト
  employeeList: Array<employee>| null;
  // 事業所PR
  officePR: string;
  // 事業所PR画像URL
  officePRimageURL: string;
}

/**
 * 拠点情報
 */
export interface baseInfo {
  // 事業所ID
  officeInfo: string;
  // 事業所名
  officeName: string| null;
  // 事業所関係性
  officeAssociation: string| null;
}

/**
 * 従業員
 */
export interface employee {
  // メカニックID
  mechanicId: string;
  // メカニック名
  mechanicName: string| null;
  // 所属区分
  belongsDiv: string| null;
}

export const initOfficeInfo = {
  // 事業所ID
  officeId: '',
  // 事業所名
  officeName: '',
  // 事業所電話番号リスト
  officeTel: [],
  // 事業所メールアドレス
  officeMailAdress: '',
  // 事業所所在地１
  officeArea1: '',
  // 事業所所在地２
  officeArea: '',
  // 事業所所在地
  officeAdress: '',
  // 事業所郵便番号
  officePostCode: '',
  // 業務内容リスト
  workContentList: [],
  // 営業時間
  businessHours: [],
  // 管理拠点ID
  adminBaseId: '',
  // 拠点情報リスト
  baseInfoList: [],
  // 管理者IDリスト
  adminIdList: [],
  // 従業員リスト
  employeeList: [],
  // 事業所PR
  officePR: '',
  // 事業所PR画像URL
  officePRimageURL: '',
}
