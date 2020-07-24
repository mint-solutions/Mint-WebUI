import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared';
import { ShellModule } from './shell/shell.module';

import { ActivateAccountModule } from './activate-account/activate-account.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    ChartsModule,
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
