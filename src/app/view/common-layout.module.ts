import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AvatarModule } from '../modules/avatar/avatar.module';
import { CommonLayoutComponent } from './common-layout.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    MatMenuModule,
    AvatarModule
  ],
  exports: [
    CommonLayoutComponent
  ],
  declarations: [
    CommonLayoutComponent
  ]
})
export class CommonLayoutModule {
}
