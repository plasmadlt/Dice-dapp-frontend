export interface Fees {

  plasma: {
    // Real balance = this.balance * Math.pow(10, -this.decimals)
    balance: number;

    decimals: number;

    currencyRate?: number;

    feePercents: number;
    // Min fee in plasma
    minFee: number;

    exchangeFeePercents: number;
  };

  currency: {
    // Real balance = this.balance * Math.pow(10, -this.decimals)
    balance: number;
    //
    decimals: number;

    feePercents: number;

    plasmaRate: number;
    // Min fee in stablecoins
    minFee: number;

    exchangeFeePercents: number;
  };
}
