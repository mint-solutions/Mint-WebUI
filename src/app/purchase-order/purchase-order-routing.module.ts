import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderCreateComponent } from './create/purchase-order-create.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: PurchaseOrderComponent, data: { title: extract('Purchase Order') } },
  { path: 'create', component: PurchaseOrderCreateComponent, data: { title: extract('Create Purchase Order') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PurchaseOrderRoutingModule {}
