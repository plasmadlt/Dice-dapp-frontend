import { NgModule } from '@angular/core';

import { AmountInputDirective } from './amount-input.directive';

@NgModule({
  declarations: [AmountInputDirective],
  exports: [AmountInputDirective]
})
export class AmountInputModule {

}
