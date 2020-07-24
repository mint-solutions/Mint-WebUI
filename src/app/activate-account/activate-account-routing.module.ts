import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateAccountComponent } from './activate-account.component';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [{ path: '', component: ActivateAccountComponent, data: { title: extract('Login') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ActivateAccountRoutingModule {}
