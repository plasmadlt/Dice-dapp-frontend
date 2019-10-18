import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, share, tap } from 'rxjs/operators';
import { UserProvider } from '../providers/user/user.provider';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AppInterceptor implements HttpInterceptor {
  // Get access token stream
  private _getTokenStream: Observable<any>;

  constructor(private http: HttpClient, private userProvider: UserProvider) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Headers to add
    const headers = {};

    // Add auth token
    if (this.userProvider.isAuthenticated()) {
      headers['Authorization'] = `JWT ${this.userProvider.accessToken}`;
    }

    // Change headers
    headers['Content-Type'] = 'application/json';
    headers['charset'] = 'UTF-8';
    headers['X-Requested-With'] = 'XMLHttpRequest';

    // Create new request
    return next.handle(request.clone({setHeaders: headers, body: request.body}))
      .pipe(
        // Try refresh token (if 401 error)
        catchError((err: HttpErrorResponse) => this.refreshToken(err, request)),
        // Logout if tokens was expired
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.userProvider.logout();
          }
          return throwError(err);
        })
      );
  }

  /**
   * Try to refresh access token
   */
  private refreshToken(err: HttpErrorResponse, req: HttpRequest<any>): Observable<any> {
    const url = `${environment.api}/id/oauth/v1/token`;
    // If there is a 401 error and refresh token still not expired
    if (err.status === 401 && !this.userProvider.isExpiredRefreshToken() && req.url.indexOf(url) === -1) {

      if (!this._getTokenStream) {

        const body = {
          grant_type: 'refresh_token',
          refresh_token: this.userProvider.refreshToken,
          scope: environment.auth.scope.join(',')
        };

        // Get a new token (once)
        this._getTokenStream = this.http.post<{access_token: string, refresh_token: string}>(url, body)
          .pipe(
            // Login user again
            tap((tokens: {access_token: string, refresh_token: string}) => {
              this.userProvider.saveTokens(tokens.access_token, tokens.refresh_token);
            }),
            // Remove stream
            tap(() => this._getTokenStream = null),
            // Waiting for other request (Not to ask for a token again)
            delay(1000),
            share()
          );
      }

      // If the token cannot be obtained, we return 401 errors from the previous request
      return this._getTokenStream.pipe(catchError(() => throwError(err)));
    }

    return throwError(err);
  }
}
