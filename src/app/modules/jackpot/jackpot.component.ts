import { Component, Input, OnInit } from '@angular/core';
import { InfoProvider } from '../../providers/info/info.provider';
import { SubStore, SubStoreDecorator } from '../../common/sub-store';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss'],
  exportAs: 'jackpot'
})
@SubStoreDecorator
export class JackpotComponent implements OnInit {
  // Contract balances
  balances: {token: string, balance: number}[];
  // Selected currency
  @Input() currencyCode: string;

  private _subStore: SubStore;

  constructor(private infoProvider: InfoProvider) {

  }

  /**
   * Component init handler
   */
  ngOnInit(): void {
    this._subStore.sub = this.infoProvider.getAppBalances().subscribe(balances => this.balances = balances);
  }

  /**
   * Get total contract balance of selected currency
   */
  getContractBalance(): number {
    if (this.balances) {
      const balance = this.balances.find(i => i.token === this.currencyCode);
      return balance ? balance.balance : 0;
    }
    return 0;
  }
}
