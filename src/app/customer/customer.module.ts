import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CoreModule } from '@app/core/core.module';
import { CustomerCreateComponent } from './create/customer-create.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule
  ],
  declarations: [CustomerComponent, CustomerCreateComponent],
  providers: []
})
export class CustomerModule {}
