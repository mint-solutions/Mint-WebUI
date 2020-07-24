import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyEmailComponent } from '@app/verify-email/verify-email.component';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [{ path: '', component: VerifyEmailComponent, data: { title: extract('Verify email') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class VerifyEmailRoutingModule {}
