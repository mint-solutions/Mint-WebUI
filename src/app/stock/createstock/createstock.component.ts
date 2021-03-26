import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { componentError, serverError } from '@app/helper';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { element } from 'protractor';

export interface SelectedProductElement {
  id: string;
  name: string;
  //position: number;
  itemcode: string;
  storeproduct: storeproduct[];

  //productAdded: boolean;
  //enableproduct: boolean;
  enablequantity: boolean;
  selectedWarehouseIndex: number;
  highestQuantity: number;
  enteredQuantity: number;
}

export interface storeproduct {
  instockqty: number;
  warehouse: warehouse;
}

export interface warehouse {
  id: string;
  name: string;
}

const SELECTED_PRODUCT_DATA: SelectedProductElement[] = [];

@Component({
  selector: 'app-createstock',
  templateUrl: './createstock.component.html',
  styleUrls: ['./createstock.component.scss']
})
export class CreatestockComponent implements OnInit {
  @ViewChild(DataTableDirective, { read: false })
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  stockTransfers: any[] = [];

  dataSource = new MatTableDataSource<SelectedProductElement>(SELECTED_PRODUCT_DATA);
  displayedColumns: string[] = ['select', 'name', 'itemcode', 'warehouse', 'quantity'];

  public title = 'Create New Stock Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Stock Order',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  warehouseqty: number;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public modal: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getPurchaseOrders();
  }

  changeProduct(warehouseIndex: any, elementId: string) {
    let product = this.dataSource.data.find(x => x.id == elementId);
    if (product != null && product != undefined) {
      let productIndex = this.dataSource.data.findIndex(x => x.id == elementId);
      this.dataSource.data[productIndex].enablequantity = false;
      this.dataSource.data[productIndex].highestQuantity = this.dataSource.data[productIndex].storeproduct[
        warehouseIndex
      ].instockqty;
      this.dataSource.data[productIndex].selectedWarehouseIndex = +warehouseIndex;
    }
  }

  changeQuantity(elementId: string) {
    let product = this.dataSource.data.find(x => x.id == elementId);
    if (product != null && product != undefined) {
      debugger;
      let productIndex = this.dataSource.data.findIndex(x => x.id == elementId);
      console.log(this.dataSource.data[productIndex].enteredQuantity);
      console.log(this.dataSource.data[productIndex].highestQuantity);
      if (this.dataSource.data[productIndex].enteredQuantity > this.dataSource.data[productIndex].highestQuantity) {
        console.log('print error here');
      } else {
        console.log('remove error here');
      }
    }
  }

  getPurchaseOrders() {
    this.loader = true;

    //const searchData = this.getSearchData();

    //console.log(searchData);

    this.productService
      .getRequestProducts()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPurchaseOrders', res);
          if (res.status === true) {
            this.stockTransfers = res.result;
            //this.sharedService.nextPurchaseOrders(this.stockTransfers);
            this.dataSource.data = this.stockTransfers
              //.filter(orders => orders.doctypeId === 1)
              .map((transfers, index) => {
                const { id, name, itemcode, storeproduct } = transfers;
                return {
                  id,
                  name,
                  itemcode,
                  storeproduct,
                  selectedWarehouseIndex: null,
                  highestQuantity: null,
                  enteredQuantity: null,
                  enablequantity: true
                };
              });
            console.log(this.dataSource.data);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  //getSearchData() {
  //  const { startDate, endDate, supplierId, postedBy, invoiceNumber } = this.orderTypeData;

  //  return {
  //    postedBy,
  //    invoiceNumber,
  //    searchtype: this.orderType,
  //    supplierSearch: {
  //      supplierId,
  //      startDate,
  //      endDate
  //    },
  //    daterangeSearch: {
  //      startDate,
  //      endDate
  //    }
  //  };
  //}
}
