import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SubStore, SubStoreDecorator } from '../common/sub-store';
import { UserProvider } from '../providers/user/user.provider';
import { User } from '../../types/user';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss']
})
@SubStoreDecorator
export class CommonLayoutComponent implements OnInit {

  authUrl: string;

  user: User;

  isAuthenticated: boolean;

  private _subStore: SubStore;

  constructor(private userProvider: UserProvider) {
    this.authUrl = userProvider.getAuthUrl();
  }

  /**
   * Component init handler
   */
  ngOnInit(): void {
    // Get user
    this._subStore.sub = this.userProvider.isAuthenticatedStream()
      .pipe(
        tap((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated),
        switchMap((isAuthenticated: boolean) => isAuthenticated ? this.userProvider.getUser() : of(null))
      )
      .subscribe(user => this.user = user);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.userProvider.logout();
  }
}
