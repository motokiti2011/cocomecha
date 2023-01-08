export interface userVehicle {
  // ユーザーID
  userId: string;
  // 車両ID
  vehicleId: string;
  // 車両名
  vehicleName: string;
  // 車両番号
  vehicleNo: string;
  // 車台番号
  chassisNo: string;
  // 指定類別
  designatedClassification: string;
  // カラー
  coler: string;
  // カラーNo.
  colerNo: string;
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
