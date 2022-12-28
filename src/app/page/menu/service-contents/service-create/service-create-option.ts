
/** 入札方式 */
export const bidMethodData = [
  { id: 1, label: '自分で設定', value: 'yourself', disabled: false },
  { id: 2, label: 'オークション方式', value: 'auction', disabled: false },
  { id: 3, label: '見積り希望', value: 'estimate', disabled: false }
]

export interface createServiceSelect  {
  // id
  id: string;
  // 表示文字列
  label: string;
}


/** 希望時間 */
export const timeData = [
  { id: '1', label: '1時' }, { id: '2', label: '2時' }, { id: '3', label: '3時' }, { id: '4', label: '4時' }, { id: '5', label: '5時' }, { id: '6', label: '6時' },
  { id: '7', label: '7時' }, { id: '8', label: '8時' }, { id: '9', label: '9時' }, { id: '10', label: '10時' }, { id: '11', label: '11時' }, { id: '12', label: '12時' },
  { id: '13', label: '13時' }, { id: '14', label: '14時' }, { id: '15', label: '15時' }, { id: '16', label: '16時' }, { id: '17', label: '17時' }, { id: '18', label: '18時' },
  { id: '19', label: '19時' }, { id: '20', label: '20時' }, { id: '21', label: '21時' }, { id: '22', label: '22時' }, { id: '23', label: '23時' }, { id: '24', label: '24時' },
]

// 作業場所
/** ユーザー作業エリア */
export const userWorkArea = [
  { id: '1', label: '登録住所' },
  { id: '2', label: '受注者の作業場所' },
  { id: '3', label: '個別に決める' },
  { id: '4', label: '受注者にまかせる' },
  { id: '5', label: '後から決める' },
]

/** ユーザー作業エリア */
export const mechanicWorkArea = [
  { id: '21', label: '登録作業所の場所' },
  { id: '22', label: '購入者の指定場所' },
  { id: '23', label: '個別に決める' },
  { id: '24', label: '購入者にまかせる' },
  { id: '25', label: '後から決める' },
]

// 車両
/** ユーザー作業エリア */
export const userTargetVehcle = [
  { id: '1', label: '登録車両' },
  { id: '2', label: '新規登録' },
  { id: '3', label: '車両なし' }
]

/** メカニック作業エリア */
export const mechanicTargetVehcle = [
  { id: '31', label: '指定なし' },
  { id: '32', label: 'メーカー指定' },
  { id: '33', label: '車両形状指定' },
  { id: '34', label: 'フリー入力' }
]

// 価格
/** ユーザー価格 */
export const userPrice = [
  { id: '1', label: '自身で設定する' },
  { id: '2', label: '見積もり依頼（無料）' },
  { id: '3', label: '見積もり依頼' }
]

/** メカニック価格 */
export const mechanicPrice = [
  { id: '41', label: '自身で設定する' },
  { id: '42', label: '見積もり後価格決定' },
  { id: '43', label: '見積もり後価格決定（無料）' },
  { id: '44', label: '見積もり後価格決定（有料）' }
]

export const messageLevel = [
    { id: '1', label: '全体に公開' },
    { id: '2', label: '一部に公開' },
    { id: '3', label: '非公開' }
  ];

