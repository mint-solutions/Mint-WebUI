import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { GrnRoutingModule } from './request-routing.module';
import { RequestComponent } from './request.component';
import { RequestCreateComponent } from './create/request-create.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, GrnRoutingModule, DataTablesModule, ReactiveFormsModule],
  declarations: [RequestComponent, RequestCreateComponent],
  providers: []
})
export class RequestModule {}
