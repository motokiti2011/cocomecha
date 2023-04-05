
/**
 * 問い合わせ情報
 */
export interface inquiryInfo {
  // 問い合わせID
  inquiryId: string;
  // 問い合わせユーザーID
  inquiryUserId: string;
  // 問い合わせユーザー名
  inquiryUserName: string;
  // 問い合わせカテゴリー
  inquiryUserCategory: string;
  // お問い合わせ内容
  inquiryUserContents: string;
  // お問い合わせ送信先
  inquiryAdless: string;
  // お問い合わせメールアドレス
  inquiryMailAdless: string;
  // お問い合わせ日付
  inquiryDate: number;
  // 回答区分
  anserDiv: string;
  // 回答日付
  anserDate: number;
  // 作成日
  created: string;
}

