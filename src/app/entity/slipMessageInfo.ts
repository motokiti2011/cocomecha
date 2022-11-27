/**
 * 伝票コメント情報
 */
export interface slipMessageInfo {
  // コメントID
  commentId: string;
  // 伝票番号
  slipNo: string;
  // 表示順
  displayOrder: string;
  // 投稿ユーザーID
  userId: string;
  // 投稿ユーザー名
  sendUserName: string;
  // コメント
  comment: string;
  // 投稿宛先
  sendAdress: string;
  // 論理削除フラグ
  logicalDeleteDiv: string;
  // 投稿日時
  sendDate: string;
}

/**
 * 伝票コメント情報空情報
 */
export const defaltSlipComment: slipMessageInfo = {
    // コメントID
    commentId: '0',
    // 伝票番号
    slipNo: '',
    // 表示順
    displayOrder: '0',
    // 投稿ユーザーID
    userId: '0',
    // 投稿ユーザー名
    sendUserName: '',
    // コメント
    comment: '',
    // 投稿宛先
    sendAdress: '',
    // 論理削除フラグ
    logicalDeleteDiv: '0',
    // 投稿日時
    sendDate: ''
}

/**
 * 表示用伝票コメント情報
 */
export interface dispSlipComment {
  // コメントID
  commentId: string;
  // 表示位置
  position: boolean;
  // 伝票番号
  slipNo: string;
  // 表示順
  displayOrder: string;
  // 投稿ユーザーID
  userId: string;
  // 投稿ユーザー名
  sendUserName: string;
  // コメント
  comment: string;
  // 投稿宛先
  sendAdress: string;
  // 論理削除フラグ
  logicalDeleteDiv: string;
  // 投稿日時
  sendDate: string;
}

/**
 * 伝票コメント情報空情報
 */
 export const defaltDispSlipComment: dispSlipComment = {
  // コメントID
  commentId: '0',
  // 表示位置
  position: true,
  // 伝票番号
  slipNo: '',
  // 表示順
  displayOrder: '0',
  // 投稿ユーザーID
  userId: '0',
  // 投稿ユーザー名
  sendUserName: '',
  // コメント
  comment: '',
  // 投稿宛先
  sendAdress: '',
  // 論理削除フラグ
  logicalDeleteDiv: '0',
  // 投稿日時
  sendDate: ''
}