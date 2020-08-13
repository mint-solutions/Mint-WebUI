import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core/i18n.service';
import { SalesOrderComponent } from './sales-order.component';
import { SalesOrderCreateComponent } from './create/sales-order-create.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: SalesOrderComponent, data: { title: extract('Purchase Order') } },
  { path: 'create', component: SalesOrderCreateComponent, data: { title: extract('Create Purchase Order') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SalesOrderRoutingModule {}
