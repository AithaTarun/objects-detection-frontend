import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HeaderComponent} from './header/header.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationInterceptor} from "./authentication/authentication.interceptor";

@NgModule({
  declarations: [AppComponent, HeaderComponent],

  entryComponents: [],

  imports:
    [
      CommonModule,
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      ReactiveFormsModule,
      HttpClientModule
    ],

  providers:
    [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

      // Auth interceptor to attach token to outgoing requests
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthenticationInterceptor,
        multi: true
      },
    ],

  bootstrap: [AppComponent],
})
export class AppModule {}
