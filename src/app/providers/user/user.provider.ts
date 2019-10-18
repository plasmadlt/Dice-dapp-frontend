import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../../types/user';

@Injectable({providedIn: 'root'})
export class UserProvider {

  private _accessToken: string;

  private _refreshToken: string;
  // Change auth emitter
  private _authEmitter: BehaviorSubject<boolean>;

  private _userStream: Observable<{username: string, user: User}>;

  constructor(private http: HttpClient) {
    this._accessToken = localStorage.getItem('access_token');
    this._refreshToken = localStorage.getItem('refresh_token');

    this._authEmitter = new BehaviorSubject<boolean>(this.isAuthenticated());

    this._userStream = this.http.get<{username: string, user: User}>(`${environment.api}/plasma/api/v1/me`).pipe(shareReplay());
  }

  /**
   * Get current user
   */
  getUser(): Observable<User> {
    return this._userStream.pipe(map(data => data.user));
  }

  /**
   * Get current user
   */
  getAccount(): Observable<string> {
    return this._userStream.pipe(map(data => data.username));
  }

  /**
   * Returns authorisation url
   */
  getAuthUrl(): string {
    let url = `${environment.auth.url}`;
    url += `?client_id=${environment.auth.clientId}`;
    url += `&response_type=code`;
    url += `&redirect_uri=${encodeURIComponent(environment.auth.redirectUri)}`;
    url += `&scope=${environment.auth.scope.join(',')}`;
    return url;
  }

  /**
   * Replace code to tokens and save it
   */
  authorize(code: string): Observable<{access_token: string, refresh_token: string}> {
    const body = {
      grant_type: 'authorization_code',
      code,
      client_id: environment.auth.clientId,
      redirect_uri: environment.auth.redirectUri,
      scope: environment.auth.scope.join(',')
    };

    return this.http.post<{access_token: string, refresh_token: string}>(`${environment.api}/id/oauth/v1/token`, body)
      .pipe(tap((tokens) => this.saveTokens(tokens.access_token, tokens.refresh_token)));
  }

  /**
   * Save tokens
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    this._authEmitter.next(true);
  }

  /**
   * Clear tokens
   */
  logout(): void {
    this._accessToken = null;
    this._refreshToken = null;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    this._authEmitter.next(false);
  }

  /**
   * Is authenticated a user
   * @return - If user logged returns true
   */
  isAuthenticated(): boolean {
    return !this.isExpiredAccessToken();
  }

  /**
   * Is authenticated stream
   * @return - If user logged returns true
   */
  isAuthenticatedStream(): Observable<boolean> {
    return this._authEmitter.asObservable();
  }

  /**
   * Is expired access token
   *
   * @return if token was expired returns true
   */
  isExpiredAccessToken(): boolean {
    if (this._accessToken) {
      try {
        const payload = JSON.parse(atob(this._accessToken.split('.')[1]));
        return (new Date(payload.exp * 1000)) < new Date();
      } catch (e) {}
    }

    return true;
  }

  /**
   * Is expired access token
   *
   * @return if token was expired returns true
   */
  isExpiredRefreshToken(): boolean {
    if (this._refreshToken) {
      try {
        const payload = JSON.parse(atob(this._refreshToken.split('.')[1]));
        return (new Date(payload.exp * 1000)) < new Date();
      } catch (e) {}
    }

    return true;
  }

  /**
   * Returns refresh token
   */
  get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Returns refresh token
   */
  get refreshToken(): string {
    return this._refreshToken;
  }
}


