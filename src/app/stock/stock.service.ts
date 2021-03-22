import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { TransferRequest, TransferRequestApproval } from './stock.model';

const routes = {
  getStockTransfers: '/stocktransfer/gettransfers',
  getStockRequests: '/stocktransfer/getrequest',
  getRequestsforApproval: '/stocktransfer/getrequestforapproval',
  getTransfersforApproval: '/stocktransfer/gettransfersforapproval',
  createStocks: '/stocktransfer/create',
  approveStocks: '/stocktransfer/approve'
};

@Injectable()
export class StockService extends BaseService<TransferRequest> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getStockTransfers(): Observable<any> {
    return this.sendGet(`${routes.getStockTransfers}?page=1&limit=5`);
  }

  getStockRequests(): Observable<any> {
    return this.sendGet(`${routes.getStockRequests}?page=1&limit=5`);
  }

  getStockTransfersforApproval(): Observable<any> {
    return this.sendGet(`${routes.getTransfersforApproval}?page=1&limit=5`);
  }

  getStockRequestsforApproval(): Observable<any> {
    return this.sendGet(`${routes.getRequestsforApproval}?page=1&limit=5`);
  }

  createStocks(payload: TransferRequest): Observable<any> {
    return this.sendPost(routes.createStocks, payload);
  }

  approveStocks(payload: TransferRequestApproval): Observable<any> {
    return this.sendPost(routes.approveStocks, payload);
  }
}
