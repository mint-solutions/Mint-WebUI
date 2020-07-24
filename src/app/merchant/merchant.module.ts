import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { MerchantRoutingModule } from './merchant-routing.module';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, MerchantRoutingModule]
})
export class MerchantModule {}
