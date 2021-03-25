import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockhomeComponent } from './stockhome/stockhome.component';
import { CreatestockComponent } from './createstock/createstock.component';

const routes: Routes = [
  { path: 'view', component: StockhomeComponent },
  { path: 'create', component: CreatestockComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule {}
