import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { GrnUpdateComponent } from './update/grn-update.component';
import { GrnRoutingModule } from './grn-routing.module';
import { GrnComponent } from './grn.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, GrnRoutingModule, DataTablesModule, ReactiveFormsModule],
  declarations: [GrnComponent, GrnUpdateComponent],
  providers: []
})
export class GrnModule {}
