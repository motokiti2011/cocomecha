export interface userVehicle {
  // 車両ID
  vehicleId: string;
  // ユーザーID
  userId: string;
  // 車両名
  vehicleName: string;
  // 車両番号
  vehicleNo: vehicleNumberPlate;
  // 車台番号
  chassisNo: string;
  // 指定類別
  designatedClassification: string;
  // カラー
  coler: string;
  // カラーNo.
  colerNo: string;
  // 走行距離
  mileage: string;
  // 初年度登録日
  firstRegistrationDate: string;
  // 車検満了日
  inspectionExpirationDate: string;
  // 更新ユーザーID
  updateUserId: string;
  // 作成日時
  created: string;
  // 更新日時
  updated: string;
}

/**
 * 車両登録番号
 */
export interface vehicleNumberPlate {
  // 地域名
  areaName: string;
  // 分類番号
  classificationNum: string;
  // ひらがな
  kana: string;
  // 一連指定番号
  serialNum: string;
}
