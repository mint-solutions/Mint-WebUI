import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CoreModule } from '@app/core/core.module';
import { CategoryCreateComponent } from './create/category-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CategoryService } from './category.service';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, CategoryRoutingModule, ReactiveFormsModule, DataTablesModule],
  declarations: [CategoryComponent, CategoryCreateComponent],
  providers: [CategoryService]
})
export class CategoryModule {}
