import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ElasticInputModule } from 'angular2-elastic-input';
import { MatButtonModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { CommonPipesModule } from '@plasma/plasma-common';

import { JackpotModule } from '../../modules/jackpot/jackpot.module';
import { AmountInputModule } from '../../modules/amount-input/amount-input.module';
import { SliderModule } from '../../modules/slider/slider.module';
import { BetsListModule } from '../../modules/bets-list/bets-list.module';

import { DiceComponent } from './dice.component';
import { routes } from './dice.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ElasticInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    JackpotModule,
    AmountInputModule,
    SliderModule,
    BetsListModule,
    CommonPipesModule
  ],
  declarations: [
    DiceComponent
  ]
})
export class DiceModule {

}
