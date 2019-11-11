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
import { FormsModule } from '@angular/forms';
import { GroupByPipe } from './pipes/group-by.pipe';
import { DoughnutChartComponent } from './charts/doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { ChartsModule } from 'ng2-charts';
import { InputValidatorDirective } from './validators/input-validator.directive';
import { BtnLoaderComponent } from './btn-loader/btn-loader.component';
import { DeleteModalComponent } from './modals/delete-modal/delete-modal.component';
import { AppModalComponent } from './modals/app-modal/app-modal/app-modal.component';

@NgModule({
  imports: [CommonModule, NgxEchartsModule, RouterModule, NgbModule, FormsModule, ChartsModule],
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
    InputValidatorDirective
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
    InputValidatorDirective
  ]
})
export class SharedModule {}
