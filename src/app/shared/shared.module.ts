import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ActivityPostComponent } from './activity-post/activity-post.component';
import { BlockHeaderComponent } from './block-header/block-header.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { SortableDirective } from '@app/shared/directives/sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupByPipe } from './pipes/group-by.pipe';
import { DoughnutChartComponent } from './charts/doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { ChartsModule } from 'ng2-charts';
import { InputValidatorDirective } from './validators/input-validator.directive';
import { BtnLoaderComponent } from './btn-loader/btn-loader.component';
import { DeleteModalComponent } from './modals/delete-modal/delete-modal.component';
import { AppModalComponent } from './modals/app-modal/app-modal/app-modal.component';
import { InputComponent } from './input/input.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { PurchaseOrderModalComponent } from '@app/purchase-order/create/purchase-order-create.component';
import {
  DateRangeSearchModalComponent,
  SupplierSearchModalComponent,
  InvoiceNumberSearchModalComponent
} from '@app/purchase-order/purchase-order.component';
import {
  MatStepperModule,
  MatIconModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatTableModule,
  MatCheckboxModule,
  MatInputModule,
  MatPaginatorModule,
  MatDialogModule,
  MatRadioModule,
  MatOptionModule,
  MatSelectModule,
  MatMenuModule,
  MatSlideToggleModule
} from '@angular/material';
import { ApprovePurchaseOrderModalComponent } from '@app/purchase-order/view/view.component';
import { GrnModalComponent } from '@app/grn/update/grn-update.component';
import { SalesOrderModalComponent } from '@app/sales-order/create/sales-order-create.component';

@NgModule({
  declarations: [
    LoaderComponent,
    BtnLoaderComponent,
    AlertMessageComponent,
    AppModalComponent,
    ActivityPostComponent,
    BlockHeaderComponent,
    DataTableComponent,
    DeleteModalComponent,
    SortableDirective,
    GroupByPipe,
    LineChartComponent,
    DoughnutChartComponent,
    InputValidatorDirective,
    InputComponent,
    InputErrorComponent,
    PurchaseOrderModalComponent,
    DateRangeSearchModalComponent,
    SupplierSearchModalComponent,
    InvoiceNumberSearchModalComponent,
    ApprovePurchaseOrderModalComponent,
    GrnModalComponent,
    SalesOrderModalComponent
  ],
  entryComponents: [
    PurchaseOrderModalComponent,
    DateRangeSearchModalComponent,
    SupplierSearchModalComponent,
    InvoiceNumberSearchModalComponent,
    ApprovePurchaseOrderModalComponent,
    GrnModalComponent,
    SalesOrderModalComponent
  ],
  imports: [
    CommonModule,
    NgxEchartsModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatStepperModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  exports: [
    LoaderComponent,
    BtnLoaderComponent,
    AlertMessageComponent,
    ActivityPostComponent,
    BlockHeaderComponent,
    DataTableComponent,
    DeleteModalComponent,
    GroupByPipe,
    LineChartComponent,
    DoughnutChartComponent,
    InputValidatorDirective,
    InputComponent,
    InputErrorComponent,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    MatSlideToggleModule
  ]
})
export class SharedModule {}
