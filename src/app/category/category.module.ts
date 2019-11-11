import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CoreModule } from '@app/core/core.module';
import { CategoryCreateComponent } from './create/category-create.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, CategoryRoutingModule, ReactiveFormsModule],
  declarations: [CategoryComponent, CategoryCreateComponent],
  providers: []
})
export class CategoryModule {}
