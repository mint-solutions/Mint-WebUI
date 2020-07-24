import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetpasswordComponent } from '@app/setpassword/setpassword.component';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [{ path: '', component: SetpasswordComponent, data: { title: extract('Set password') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetpasswordRoutingModule {}
