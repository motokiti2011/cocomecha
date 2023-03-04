export interface belongs {
  // 役割区分
  belongsDiv: string;
  // 役割名
  belongs: string;
}

/** 役割データ */
export const belongsData :belongs[] = [
  {belongsDiv: '0', belongs: '管理者'},
  {belongsDiv: '1', belongs: '関連工場'},
  {belongsDiv: '2', belongs: '外注工場'},
  {belongsDiv: '3', belongs: '外注メカニック'}
]