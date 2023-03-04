/** 役割情報 */
export interface role {
  // 役割区分
  roleDiv: string;
  // 役割名
  role: string;
}

/** 役割データ */
export const roleData :role[] = [
  {roleDiv: '0', role: '管理者'},
  {roleDiv: '1', role: '従業員'},
  {roleDiv: '2', role: '関連工場'},
  {roleDiv: '3', role: '外注'}
]