import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubStore, SubStoreDecorator } from '../../common/sub-store';
import { UserProvider } from '../../providers/user/user.provider';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
@SubStoreDecorator
export class AuthComponent implements OnInit {

  loading: boolean;

  error: {
    code: string;
    description: string;
  };

  private _subStore: SubStore;

  constructor(private route: ActivatedRoute, private router: Router, private userProvider: UserProvider) {

  }

  /**
   * Component init handler
   */
  ngOnInit(): void {
    this._subStore.sub = this.route.queryParams.subscribe((params: {code?: string, error?: string, error_description?: string}) => {
      if (params.error) {
        this.error = {
          code: params.error,
          description: params.error_description
        };
        return;
      }
      if (!params.code) {
        this.error = {
          code: 'no_code',
          description: 'Not have authorize code'
        };
        return;
      }

      this.loading = true;

      this.userProvider.authorize(params.code).subscribe(
        () => this.router.navigate(['dice']),
        err => {
          this.loading = false;
          this.error = {
            code: 'request_error',
            description: 'Getting token failed'
          };
        }
      );
    });
  }
}
