import '@angular/localize/init';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes, LibsBecomingGermanUiModule } from "@becoming-german/ui";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    LibsBecomingGermanUiModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
