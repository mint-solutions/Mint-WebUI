import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SalesOrderCreateComponent } from './create/sales-order-create.component';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderComponent } from './sales-order.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    SalesOrderRoutingModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  declarations: [SalesOrderComponent, SalesOrderCreateComponent],
  providers: []
})
export class SalesOrderModule {}
