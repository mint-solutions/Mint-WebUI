import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent } from './category.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { CategoryCreateComponent } from './create/category-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'view', component: CategoryComponent, data: { title: extract('Category') } },
  { path: 'create', component: CategoryCreateComponent, data: { title: extract('Create Category') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CategoryRoutingModule {}
