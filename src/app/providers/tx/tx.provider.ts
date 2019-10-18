import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Action, BetActionData, DiceActionData } from '../../../types/action';
import { MoneyAction } from '../../../types/money-action';
import { ActionItem } from '../../../types/action-item';
import { RawTx } from '../../../types/raw-tx';

@Injectable({providedIn: 'root'})
export class TxProvider {

  constructor(private http: HttpClient) {

  }

  /**
   * Get my bets list
   */
  getMyActions(): Observable<ActionItem[]> {
    return this.http.get<ActionItem[]>(`${environment.api}/plasma/api/v1/actions/my?contract=${environment.contract}`);
  }

  /**
   * Get all bets list (no authorized)
   */
  getAllActions(): Observable<ActionItem[]> {
    return this.http.get<ActionItem[]>(`${environment.api}/plasma/api/v1/actions/all?contract=${environment.contract}`);
  }

  /**
   * Sign and send action
   */
  sendTx(action: Action<DiceActionData | BetActionData>): Observable<{moneyActions: MoneyAction[], rawTx: RawTx}> {
    return this.http.post<{moneyActions: MoneyAction[], rawTx: RawTx}>(`${environment.api}/plasma/api/v1/send-tx`, {actions: [action]});
  }
}
