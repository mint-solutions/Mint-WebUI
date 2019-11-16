import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierComponent } from './supplier.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { SupplierCreateComponent } from './create/supplier-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: SupplierComponent, data: { title: extract('Supplier') } },
  { path: 'create', component: SupplierCreateComponent, data: { title: extract('Create Supplier') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SupplierRoutingModule {}
