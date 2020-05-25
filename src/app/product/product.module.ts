import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { CoreModule } from '@app/core/core.module';
import { ProductCreateComponent } from './create/product-create.component';
import { ProductService } from './product.service';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, ProductRoutingModule, DataTablesModule, ReactiveFormsModule],
  declarations: [ProductComponent, ProductCreateComponent],
  providers: [ProductService]
})
export class ProductModule {}
