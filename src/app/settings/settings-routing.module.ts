import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from '@app/settings/roles/roles.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { BusinessLocationComponent } from './business-location/business-location.component';

const routes: Routes = [
  { path: '', redirectTo: '/business-location', pathMatch: 'full' },
  { path: 'business-location', component: BusinessLocationComponent, data: { title: extract('Business Location') } },
  { path: 'roles', component: RolesComponent, data: { title: extract('Roles') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
