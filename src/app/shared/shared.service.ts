import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {
  private purchaseOrders = new BehaviorSubject([]);
  // tslint:disable-next-line: member-ordering
  sharedPurchaseOrders = this.purchaseOrders.asObservable();

  constructor() {}

  nextPurchaseOrders(purchaseOrders: object[]) {
    this.purchaseOrders.next(purchaseOrders);
  }
}
