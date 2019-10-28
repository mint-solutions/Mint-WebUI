import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { DetailTilesComponent } from './detail-tiles/detail-tiles.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { TopProductsComponent } from './top-products/top-products.component';
import { CardActionsComponent } from './card-actions/card-actions.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { TotalRevenueComponent } from './total-revenue/total-revenue.component';
import { ActivitiesComponent } from './activities/activities.component';
import { CoreModule } from '@app/core/core.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule, NgxEchartsModule, ChartsModule],
  declarations: [
    HomeComponent,
    DetailTilesComponent,
    TopProductsComponent,
    CardActionsComponent,
    ReferralsComponent,
    TotalRevenueComponent,
    ActivitiesComponent
  ],
  providers: [QuoteService]
})
export class HomeModule {}
