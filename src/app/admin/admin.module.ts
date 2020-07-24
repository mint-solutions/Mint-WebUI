import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { SignupComponent } from './signup/signup.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, AdminRoutingModule]
})
export class AdminModule {}
