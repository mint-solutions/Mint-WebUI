import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { CoreModule } from '@app/core/core.module';
import { ProductCreateComponent } from './create/product-create.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, ProductRoutingModule],
  declarations: [ProductComponent, ProductCreateComponent],
  providers: []
})
export class ProductModule {}
