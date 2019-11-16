import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  // Fallback when no prior route is matched
  Shell.childRoutes([
    {
      path: 'product',
      loadChildren: 'app/product/product.module#ProductModule'
    },
    {
      path: 'customer',
      loadChildren: 'app/customer/customer.module#CustomerModule'
    },
    {
      path: 'supplier',
      loadChildren: 'app/supplier/supplier.module#SupplierModule'
    }
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
