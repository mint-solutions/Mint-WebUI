import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock-routing.module';
import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { StockhomeComponent } from './stockhome/stockhome.component';

@NgModule({
  declarations: [StockhomeComponent],
  imports: [CommonModule, StockRoutingModule, SharedModule, DataTablesModule],
  providers: []
})
export class StockModule {}
