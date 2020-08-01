import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { RolesComponent } from './roles/roles.component';
import { BusinessLocationComponent } from './business-location/business-location.component';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TaxComponent } from './tax/tax.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

@NgModule({
  declarations: [RolesComponent, BusinessLocationComponent, TaxComponent, WarehouseComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, DataTablesModule, SettingsRoutingModule]
})
export class SettingsModule {}
