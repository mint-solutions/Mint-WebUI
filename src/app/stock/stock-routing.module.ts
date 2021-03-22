import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockhomeComponent } from './stockhome/stockhome.component';

const routes: Routes = [{ path: 'view', component: StockhomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule {}
