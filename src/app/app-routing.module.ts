import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  // Fallback when no prior route is matched
  Shell.childRoutes([
    {
      path: 'category',
      loadChildren: 'app/category/category.module#CategoryModule'
    },
    {
      path: 'customer',
      loadChildren: 'app/customer/customer.module#CustomerModule'
    },
    {
      path: 'home',
      loadChildren: 'app/home/home.module#HomeModule'
    },
    {
      path: 'product',
      loadChildren: 'app/product/product.module#ProductModule'
    },
    {
      path: 'purchaseOrder',
      loadChildren: 'app/purchase-order/purchase-order.module#PurchaseOrderModule'
    },
    {
      path: 'grn',
      loadChildren: 'app/grn/grn.module#GrnModule'
    },
    {
      path: 'salesOrder',
      loadChildren: 'app/sales-order/sales-order.module#SalesOrderModule'
    },
    {
      path: 'settings',
      loadChildren: 'app/settings/settings.module#SettingsModule'
    },
    {
      path: 'supplier',
      loadChildren: 'app/supplier/supplier.module#SupplierModule'
    },
    {
      path: 'merchant',
      loadChildren: 'app/merchant/merchant.module#MerchantModule'
    }
  ]),
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'forget-password',
    loadChildren: 'app/forget-password/forget-password.module#ForgetPasswordModule'
  },
  {
    path: 'login',
    loadChildren: 'app/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/register/register.module#RegisterModule'
  },
  {
    path: 'account/activate/:id',
    loadChildren: 'app/activate-account/activate-account.module#ActivateAccountModule'
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
