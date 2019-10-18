import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Currency } from '../../../types/currency';
import { Fees } from '../../../types/fees';
import { STABLE_CURRENCY_CODES } from '../../../config';

@Injectable({providedIn: 'root'})
export class InfoProvider {

  private _getCurrenciesStream: Observable<Currency[]>;

  private _userBalanceStream: BehaviorSubject<{token: string, balance: number}[]>;

  private _appBalanceStream: BehaviorSubject<{token: string, balance: number}[]>;

  constructor(private http: HttpClient) {

    this._getCurrenciesStream = this.http.get<Currency[]>('./assets/currencies.json').pipe(shareReplay());

    this._appBalanceStream = new BehaviorSubject([]);
    this._userBalanceStream = new BehaviorSubject([]);
  }

  /**
   * Get tokens balance
   */
  getUserBalances(): Observable<{token: string, balance: number}[]> {
    return this.http.get<{token: string, balance: number}[]>(`${environment.api}/plasma/api/v1/balance`);
  }

  /**
   * Get application balance
   */
  getAppBalances(): Observable<{token: string, balance: number}[]> {
    return this._appBalanceStream.asObservable();
  }

  /**
   * Get tokens list
   */
  getTokens(): Observable<{token: string, decimals: number}[]> {
    return this.http.get<{token: string, decimals: number}[]>(`${environment.api}/plasma/api/v1/tokens`)
      .pipe(map(balances => balances.filter(i => STABLE_CURRENCY_CODES.includes(i.token))));
  }

  /**
   * Get currencies list
   */
  getCurrencies(): Observable<Currency[]> {
    return this._getCurrenciesStream;
  }

  /**
   * Get currencies list
   */
  getCurrency(code: string): Observable<Currency> {
    return this._getCurrenciesStream.pipe(map(currencies => currencies.find(i => i.code === code)));
  }

  /**
   * Get plasma fees
   */
  getFees(username: string, tokenCode: string): Observable<Fees> {
    return this.http.get<Fees>(`${environment.api}/plasma/api/v1/fees?username=${username}&tokenCode=${tokenCode}`);
  }

  /**
   * Update all app balances
   */
  updateAppBalances(): void {
    this.http.get<{token: string, balance: number}[]>(`${environment.api}/plasma/api/v1/balance/app?contract=${environment.account}`)
      .subscribe(balances => this._appBalanceStream.next(balances));
  }
}
