import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { componentError, serverError } from '@app/helper';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';

export interface SelectedProductElement {
  id: string;
  name: string;
  position: number;
  itemCode: string;
  storeproduct: storeproduct[];
}

export interface storeproduct {
  instockqty: number;
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
  products: any[] = [];
  productid: string;

  productDataSource = new MatTableDataSource<SelectedProductElement>(SELECTED_PRODUCT_DATA);
  displayedCustomerColumns: string[] = ['select', 'position', 'itemCode', 'name', 'instockqty'];
  public title = 'Create New Stock Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Stock Order',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public modal: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productDataSource.paginator = this.paginator;
    this.getproducts();
  }

  getproducts() {
    this.productService
      .getRequestProducts()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getProducts', res);
          if (res.status === true) {
            this.products = res.result;
            this.productDataSource.data = this.products.map((product, index) => {
              const { id, name, itemcode: itemCode, storeproduct: storeproduct } = product;
              return {
                id,
                name,
                itemCode,
                storeproduct,
                position: index + 1
              };
            });
            console.log(this.productDataSource.data);
            console.log('dataSource', this.productDataSource);
            this.cdr.detectChanges();
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }
}
