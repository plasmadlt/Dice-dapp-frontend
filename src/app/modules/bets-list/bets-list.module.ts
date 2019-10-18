import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import { BetsListComponent } from './bets-list.component';
import { CommonPipesModule } from '@plasma/plasma-common';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MomentModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CommonPipesModule
  ],
  exports: [
    BetsListComponent
  ],
  declarations: [
    BetsListComponent
  ]
})
export class BetsListModule {

}
