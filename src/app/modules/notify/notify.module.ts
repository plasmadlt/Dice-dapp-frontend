import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyComponent } from './notify.component';
import { NotifyService } from './notify.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NotifyComponent],
  exports: [NotifyComponent]
})
export class NotifyModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NotifyModule,
      providers: [NotifyService]
    };
  }
}
