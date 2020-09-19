import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core/i18n.service';
import { GrnComponent } from './grn.component';
import { GrnUpdateComponent } from './update/grn-update.component';

const routes: Routes = [
  { path: 'view', component: GrnComponent, data: { title: extract('GRN') } },
  {
    path: 'edit/:invoiceNumber',
    component: GrnUpdateComponent,
    data: { title: extract('Update GRN') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GrnRoutingModule {}
