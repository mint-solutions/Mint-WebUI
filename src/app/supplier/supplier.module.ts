import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { CoreModule } from '@app/core/core.module';
import { SupplierCreateComponent } from './create/supplier-create.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule
  ],
  declarations: [SupplierComponent, SupplierCreateComponent],
  providers: []
})
export class SupplierModule {}
