import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { ProductCreateComponent } from './create/product-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: ProductComponent, data: { title: extract('Product') } },
  { path: 'create', component: ProductCreateComponent, data: { title: extract('Create Product') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProductRoutingModule {}
