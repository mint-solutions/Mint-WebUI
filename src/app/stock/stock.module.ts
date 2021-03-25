import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock-routing.module';
import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { StockhomeComponent } from './stockhome/stockhome.component';
import { CreatestockComponent } from './createstock/createstock.component';
import { ProductService } from '../product/product.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material';

@NgModule({
  declarations: [StockhomeComponent, CreatestockComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule,
    DataTablesModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  providers: [ProductService, ToastrService]
})
export class StockModule {}
