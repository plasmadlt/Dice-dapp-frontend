import { Component, OnInit } from '@angular/core';
import { of, Subject, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TxProvider } from '../../providers/tx/tx.provider';
import { SubStore, SubStoreDecorator } from '../../common/sub-store';
import { ActionItem } from '../../../types/action-item';
import { BetItem } from '../../../types/bet-item';
import { environment } from '../../../environments/environment';
import { UserProvider } from '../../providers/user/user.provider';

@Component({
  selector: 'app-bets-list',
  templateUrl: './bets-list.component.html',
  styleUrls: ['./bets-list.component.scss'],
  exportAs: 'betList'
})
@SubStoreDecorator
export class BetsListComponent implements OnInit {

  bets: BetItem[];

  loading: boolean;

  tabIndex: number;

  private _updateBetsStream: Subject<any>;

  private _subStore: SubStore;

  constructor(private txProvider: TxProvider, private userProvider: UserProvider) {
    this._updateBetsStream = new Subject();
  }

  /**
   * Component init handler
   */
  ngOnInit(): void {

    this._subStore.sub = this.userProvider.isAuthenticatedStream().subscribe(isAuthenticated => isAuthenticated ? null : this.tabChange(1));

    this._subStore.sub = this._updateBetsStream
      .pipe(
        // switchMap(() => timer(0, 10000)),
        switchMap(() => this.tabIndex === 0 ? this.txProvider.getMyActions() : this.txProvider.getAllActions()),
        map(actions => this.actionsToBets(actions)),
        tap(() => this.loading = false)
      )
      .subscribe(bets => this.bets = bets);

    this.tabChange(1);
  }

  /**
   * Change tab handler
   */
  tabChange(index: number): void {
    this.tabIndex = index;
    this.loading = true;
    this.updateList();
  }

  /**
   * Update bet list
   */
  updateList(): void {
    this._updateBetsStream.next();
  }

  /**
   * To disable my bets tab
   */
  myTabIsDisabled(): boolean {
    return !this.userProvider.isAuthenticated();
  }

  /**
   * Convert actions list to bets list
   */
  private actionsToBets(actions: ActionItem[]): BetItem[] {
    const bets: BetItem[] = [];

    actions.forEach(action => {
      if (action.action_trace.act.name === 'dice' && action.action_trace.act.account === 'plasma.dice') {

        try {
          const logTrace = action.action_trace.inline_traces.find(i => i.act.name === 'prize' && i.act.account === 'logs.dice');
          const payout = action.action_trace.console ? Number(/payout \[([\d.]{0,})/.exec(action.action_trace.console)[1]) : 0;
          const betAmount = Number(logTrace.act.data['result']['amount']['value'].split(' ')[0]);

          bets.push({
            time: action.block_time,
            transactionUrl: `${environment.explorer}/transactions/${action.block_num}/${action.action_trace.trx_id}`,
            bettor: action.action_trace.act.data['user'],
            rollUnder: Number(logTrace.act.data['result']['roll_under']),
            roll: Number(logTrace.act.data['result']['random_roll']),
            betAmount,
            payout: payout ? payout : -betAmount,
            currencyCode: logTrace.act.data['result']['amount']['value'].split(' ')[1]
          });
        } catch (e) {
          console.log(e);
        }
      }
    });

    return bets;
  }
}
