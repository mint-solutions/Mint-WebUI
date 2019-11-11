import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent } from './category.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([{ path: 'category', component: CategoryComponent, data: { title: extract('Category') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CategoryRoutingModule {}
