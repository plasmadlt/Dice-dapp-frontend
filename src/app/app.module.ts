import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GestureConfig } from '@angular/material';

import { CommonLayoutModule } from './view/common-layout.module';
import { NotifyModule } from './modules/notify/notify.module';

import { UserProvider } from './providers/user/user.provider';
import { InfoProvider } from './providers/info/info.provider';
import { TxProvider } from './providers/tx/tx.provider';
import { AudioService } from './services/audio/audio.service';

import { AppComponent } from './app.component';

import { TranslateMessageCompiler } from './common/translate-message-compiler';
import { AppInterceptor } from './common/app.interceptor';

import { routes } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageCompiler
      }
    }),
    CommonLayoutModule,
    NotifyModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    UserProvider,
    InfoProvider,
    TxProvider,
    AudioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './locales/',
    `.json`
  );
}
