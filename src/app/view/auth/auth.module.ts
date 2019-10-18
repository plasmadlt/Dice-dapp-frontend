import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './auth.routes';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  exports: [],
  declarations: [
    AuthComponent
  ]
})
export class AuthModule {

}
