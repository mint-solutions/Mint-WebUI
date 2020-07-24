import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseOrderCreateComponent } from './create/purchase-order-create.component';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    PurchaseOrderRoutingModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  declarations: [PurchaseOrderComponent, PurchaseOrderCreateComponent],
  providers: []
})
export class PurchaseOrderModule {}
