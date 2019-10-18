
export interface MoneyAction {

  txId: string;

  type: string;

  actionNum: number;

  blockId: null;

  blockNum: number;

  currency: string;

  feeCurrency: number;

  feePlasma: number;

  from: string;

  quantity: number;

  timestamp: string;

  to: string;
}
