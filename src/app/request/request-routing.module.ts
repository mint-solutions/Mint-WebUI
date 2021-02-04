import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core/i18n.service';
import { RequestCreateComponent } from './create/request-create.component';
import { RequestComponent } from './request.component';

const routes: Routes = [
  { path: 'view', component: RequestComponent, data: { title: extract('Requests') } },
  {
    path: 'create',
    component: RequestCreateComponent,
    data: { title: extract('Create Request') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GrnRoutingModule {}
