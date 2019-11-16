import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { CustomerCreateComponent } from './create/customer-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: CustomerComponent, data: { title: extract('Customer') } },
  { path: 'create', component: CustomerCreateComponent, data: { title: extract('Create Customer') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CustomerRoutingModule {}
