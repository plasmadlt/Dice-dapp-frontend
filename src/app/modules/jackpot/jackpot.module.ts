import { NgModule } from '@angular/core';
import { CommonPipesModule } from '@plasma/plasma-common';
import { JackpotComponent } from './jackpot.component';

@NgModule({
  imports: [
    CommonPipesModule
  ],
  exports: [
    JackpotComponent
  ],
  declarations: [
    JackpotComponent
  ]
})
export class JackpotModule {

}
