import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getPlasmaAssetsFee } from '@plasma/commission';
import { Big } from 'big.js';
import { filter, flatMap, map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { sha256 } from 'js-sha256';
import { roundMoney } from '@plasma/plasma-common';
import { SubStore, SubStoreDecorator } from '../../common/sub-store';
import { InfoProvider } from '../../providers/info/info.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { TxProvider } from '../../providers/tx/tx.provider';
import { Action, BetActionData, DiceActionData } from '../../../types/action';
import { Currency } from '../../../types/currency';
import { RawTx } from '../../../types/raw-tx';
import { Fees } from '../../../types/fees';
import { SliderComponent } from '../../modules/slider/slider.component';
import { environment } from '../../../environments/environment';
import { BetsListComponent } from '../../modules/bets-list/bets-list.component';
import { AudioService } from '../../services/audio/audio.service';
import { NotifyService } from '../../modules/notify/notify.service';

@Component({
  selector: 'app-game',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
@SubStoreDecorator
export class DiceComponent implements OnInit {

  form: FormGroup;
  // Selected currency
  currency: Currency;
  // Currencies list for select
  currencies: (Currency & { decimals: number })[];
  // Tokens balances
  balances: { token: string, balance: number }[];
  // Total contact balance
  appBalances: { token: string, balance: number }[];
  // Common play loading
  loading: boolean;
  // Win or lose
  result: number;
  // Plasma fees
  fees: Fees;
  // Plasma wallet account name
  account: string;
  // Sound OFF ON
  sound: boolean;

  contractLink: string;
  // Slider element
  @ViewChild('slider') slider: SliderComponent;

  @ViewChild('betList') betList: BetsListComponent;

  private _subStore: SubStore;

  constructor(
    private formBuilder: FormBuilder,
    private userProvider: UserProvider,
    private infoProvider: InfoProvider,
    private txProvider: TxProvider,
    private audioService: AudioService,
    private notify: NotifyService,
    private translate: TranslateService
  ) {
    this.sound = true;
    this.contractLink = `${environment.explorer}/contract/${environment.contract}`;
    this.form = this.formBuilder.group({
      amount: formBuilder.control(0, [this.amountValidator()]),
      rollUnder: formBuilder.control(50),
      currencyCode: formBuilder.control('USDP'),
      payFeeWithPlasma: formBuilder.control(false)
    });
  }

  /**
   * Component init handler
   */
  ngOnInit(): void {
    // Disable form
    this._subStore.sub = this.userProvider.isAuthenticatedStream().subscribe(isAuthenticated => isAuthenticated ? this.form.enable() : this.form.disable());

    // Set up user currency
    this._subStore.sub = this.form.get('currencyCode').valueChanges
      .pipe(flatMap(code => this.infoProvider.getCurrency(code)))
      .subscribe(currency => this.currency = currency);

    // Subscribe to change user currency list
    this._subStore.sub = this.getUserCurrencies().subscribe(currencies => {
      this.form.get('currencyCode').setValue(currencies[0].code);
      this.currencies = currencies;
    });

    // Get plasma fees
    this._subStore.sub = this.getFees().subscribe(fees => this.fees = fees);

    // Get plasma account name
    this._subStore.sub = this.getPlasmaAccount().subscribe(account => this.account = account);

    // Get total bank money
    this._subStore.sub = this.infoProvider.getAppBalances().subscribe(balances => this.appBalances = balances);

    // Get user balances
    this._subStore.sub = this.getBalances().subscribe(balances => {
      this.balances = balances;
      this.form.get('amount').setValue(10);
    });

    this._subStore.sub = this.form.get('currencyCode').valueChanges.subscribe(() => this.form.get('amount').updateValueAndValidity());

    this.infoProvider.updateAppBalances();
  }

  /**
   * Calculate payout multiplier
   */
  getPayoutMultiplier(): number {
    return Number(Big(98).div(Big(this.form.get('rollUnder').value).minus(1)).toFixed(2));
  }

  /**
   * Get win payout
   */
  getPayoutToWin(): number {
    const amount = this.form.get('amount').value;
    try {
      const payoutToWin = Big(amount).times(Big(98).div(Big(this.form.get('rollUnder').value).minus(1)));
      const gameFee = Number(Big(payoutToWin).times(Big(environment.gameFee).div(100)).toString());
      return Number(payoutToWin.minus(gameFee).toString());
    } catch (e) {
      return 0;
    }
  }

  /**
   * Returns user balance
   */
  getBalance(): number {
    if (this.balances) {
      const currencyCode = this.form.get('currencyCode').value;
      const balance = this.balances.find(i => i.token === currencyCode);
      return balance ? balance.balance : 0;
    }
    return 0;
  }

  /**
   * Returns fee in plasma
   */
  getPlasmaFee(): string {
    const amount = this.form.get('amount').value;
    const payFeeWithPlasma = this.form.get('payFeeWithPlasma').value;
    const currencyCode = this.form.get('currencyCode').value;

    if (currencyCode === 'PLASMA' || !payFeeWithPlasma || !this.fees) {
      return '0';
    }

    return getPlasmaAssetsFee(amount, 'currency', 'myself', this.fees);
  }

  /**
   * Get fee in tokens
   */
  getTokensFee(): string {
    const amount = this.form.get('amount').value;
    const payFeeWithPlasma = this.form.get('payFeeWithPlasma').value;
    const currencyCode = this.form.get('currencyCode').value;

    if (currencyCode === 'PLASMA' || payFeeWithPlasma || !this.fees) {
      return '0';
    }

    return getPlasmaAssetsFee(amount, 'tokens', 'myself', this.fees);
  }

  /**
   * Returns fame fee
   */
  getGameFee(): string {
    if (!this.fees) {
      return '0';
    }

    const currencyCode = this.form.get('currencyCode').value;
    const amount = this.form.get('amount').value;
    const payoutToWin = Big(amount).times(this.getPayoutMultiplier()).toString();
    const gameFee = Big(payoutToWin).times(Big(environment.gameFee).div(100)).toString();

    return currencyCode === 'PLASMA' ? `${roundMoney(gameFee, 'CRYPTO')} PLASMA` : `${this.currency.symbol} ${roundMoney(gameFee, 'CRYPTO')}`;
  }

  /**
   * Returns transaction fee
   */
  getTxFee(): string {
    if (this.fees) {
      const amount = this.form.get('amount').value;
      const payFeeWithPlasma = this.form.get('payFeeWithPlasma').value;
      const currencyCode = this.form.get('currencyCode').value;

      if (currencyCode === 'PLASMA') {
        return '0 PLASMA';
      }

      if (payFeeWithPlasma) {
        return `${roundMoney(getPlasmaAssetsFee(amount, 'currency', 'myself', this.fees), 'CRYPTO')} PLASMA`;
      } else {
        return `${this.currency ? `${this.currency.symbol}` : ''} ${roundMoney(getPlasmaAssetsFee(amount, 'tokens', 'myself', this.fees))}`;
      }
    }
    return '0';
  }

  /**
   * Go to sign
   */
  sign(): void {
    window.location.href = this.userProvider.getAuthUrl();
  }

  /**
   * Play game
   */
  submit(): void {
    this.slider.win(null);
    this.result = null;
    if (this.form.invalid || this.loading) {
      Object.keys(this.form.controls).forEach(controlName => this.form.get(controlName).markAsTouched());
      return;
    }

    // Check max amount
    if (this.form.value.amount > this.getJackpot()) {
      this.translate.get('not_enough_funds_to_pay').subscribe(message => this.notify.alertDanger(message));
      return;
    }

    this.loading = true;

    const decimals = this.currencies.find(i => i.code === this.form.value.currencyCode).decimals;
    const amount = Big(this.form.value.amount).plus(this.getTokensFee()).toFixed(decimals);
    const seed = sha256(`${Math.random().toString()}${new Date().valueOf().toString()}`);
    const seedHash = sha256(seed.toString());
    const userSeed = sha256(`${Math.random().toString()}${new Date().valueOf().toString()}`);
    const userSeedHash = sha256(userSeed.toString());

    const betAction: Action<BetActionData> = {
      account: environment.contract,
      name: 'bet',
      authorization: [{
        actor: this.account,
        permission: environment.permission
      }],
      data: {
        user: this.account,
        quantity: `${amount} ${this.form.value.currencyCode}`,
        roll_under: this.form.value.rollUnder,
        seed_hash: seedHash,
        user_seed_hash: userSeedHash,
        paySysCms: this.form.value.payFeeWithPlasma
      }
    };

    // Send bet action
    this.txProvider.sendTx(betAction)
      .pipe(
        flatMap(betTx => {
          const diceAction: Action<DiceActionData> = {
            account: environment.contract,
            name: 'dice',
            authorization: [{
              actor: this.account,
              permission: environment.permission
            }],
            data: {
              user: this.account,
              bet_id: this.getBetIdFromTraces(betTx.rawTx),
              seed: seed
            }
          };

          // Send dice action
          return this.txProvider.sendTx(diceAction);
        }),
        map(diceTx => this.getResult(diceTx.rawTx))
      )
      .subscribe(
        result => {

          if (this.sound) {
            result.payout < 0 ? this.audioService.lose() : this.audioService.win();
          }

          this.result = result.payout;
          this.slider.win(result.winRoll);
          this.betList.updateList();
          this.infoProvider.updateAppBalances();
          this.infoProvider.getUserBalances().subscribe(balances => this.balances = balances);
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.notify.alertDanger(err.message);
        }
      );
  }

  /**
   * Get user currency stream
   */
  private getUserCurrencies(): Observable<(Currency & { decimals: number })[]> {
    return this.userProvider.isAuthenticatedStream()
      .pipe(
        switchMap(isAuthenticated => isAuthenticated ? this.infoProvider.getTokens() : of([{token: 'USDP', decimals: 6}])),
        flatMap(tokens => {
          return this.infoProvider.getCurrencies()
            .pipe(
              map(currencies => {
                return tokens
                  .map((token: { token: string, decimals: number }) => {
                    const currency = currencies.find(i => i.code === token.token);
                    return currency ? Object.assign(currency, {decimals: token.decimals}) : null;
                  })
                  .filter(i => !!i);
              }));
        })
      );
  }

  /**
   * Get user balances
   */
  private getBalances(): Observable<{ token: string, balance: number }[]> {
    return this.userProvider.isAuthenticatedStream()
      .pipe(switchMap((isAuthenticated) => isAuthenticated ? this.infoProvider.getUserBalances() : of([])));
  }

  /**
   * Returns max bet
   */
  private getJackpot(): number {
    if (this.appBalances) {
      const currencyCode = this.form.get('currencyCode').value;
      const balance = this.appBalances.find(i => i.token === currencyCode);
      return balance ? balance.balance : 0;
    }
    return 0;
  }

  /**
   * Get app meta data
   */
  private getFees(): Observable<Fees> {
    return this.userProvider.isAuthenticatedStream()
      .pipe(
        switchMap(isAuthenticated => {
          if (!isAuthenticated) {
            return of(null);
          }
          return combineLatest(this.userProvider.getAccount(), this.form.get('currencyCode').valueChanges)
            .pipe(
              switchMap(([username, currencyCode]) => this.infoProvider.getFees(username, currencyCode))
            );
        })
      );
  }

  /**
   * Get app meta data
   */
  private getPlasmaAccount(): Observable<string> {
    return this.userProvider.isAuthenticatedStream()
      .pipe(switchMap(isAuthenticated => isAuthenticated ? this.userProvider.getAccount() : of(null)));
  }

  /**
   * Get bet ID from raw transaction
   */
  private getBetIdFromTraces(rawTx: RawTx): number {
    if (rawTx && rawTx.processed && rawTx.processed.action_traces[0] && rawTx.processed.action_traces[0].console) {
      const result = /\[#(\d*)\]/.exec(rawTx.processed.action_traces[0].console);
      if (result && result[1]) {
        return Number(result[1]);
      }
    }

    throw Error('Bad action from block chain');
  }

  /**
   * Returns bet result
   */
  private getResult(rawTx: RawTx): { payout: number, winRoll: number } {
    if (rawTx && rawTx.processed && rawTx.processed.action_traces && rawTx.processed.action_traces[0]) {
      const trace = rawTx.processed.action_traces[0];
      const logAction = trace.inline_traces.find(i => i.act && i.act.name === 'prize' && i.act.account === 'logs.dice');

      if (logAction && logAction.act && logAction.act.data && logAction.act.data.result) {
        const winRoll = logAction.act.data.result['random_roll'];
        const amount = Number(logAction.act.data.result['amount']['value'].split(' ')[0]);

        if (trace.console) {
          const result = /payout \[([\d.]{0,})/.exec(trace.console);
          if (result && result[1]) {
            return {payout: Number(result[1]), winRoll};
          }
        } else {
          return {payout: -amount, winRoll};
        }
      }
    }

    throw new Error('Bad action please check it');
  }

  /**
   * Bet amount validator
   */
  private amountValidator(): ValidatorFn {
    return (control: AbstractControl): null | ValidationErrors => {
      if (!this.form) {
        return null;
      }

      const value = Number(control.value);
      const currencyCode = this.form.get('currencyCode').value;
      const payFeeWithPlasma = this.form.get('payFeeWithPlasma').value;
      const fee = payFeeWithPlasma ? this.getPlasmaFee() : this.getTokensFee();
      const min = currencyCode === 'PLASMA' ? 0.00001 : 0.01;
      const max = Number(Big(this.getBalance()).minus(fee).toString());

      if (isNaN(value)) {
        return {required: true};
      }

      if (value < min) {
        return {lessThan: {min}};
      }

      if (value > max) {
        return {greaterThan: {max}};
      }

      return null;
    };
  }
}
