// 評価情報
export interface evaluationInfo {

  // 伝票番号
  slipNo: string;
  // 評価情報ID
  evaluationInfoId: string;
  // メカニックID
  mechanicId: string;
  // 事業所ID
  officeId: string;
  // 拠点ID
  baseId: string;
  // サービスタイトル
  serviceTitle: string;
  // 日付
  date: string;
  // 評価者表示区分
  evaluationDispDiv: string;
  // 評価者ユーザーID
  evaluationUserId: string;
  // 評価者ユーザー名
  evaluationUserName: string;
  // 評価値
  evaluation: string;
  // 評価コメント
  evaluationComment: string;
  // 対評価コメント
  versusEvaluationComment: string;
  // 登録年月
  created: string;
  // 更新年月
  updated: string;
}
