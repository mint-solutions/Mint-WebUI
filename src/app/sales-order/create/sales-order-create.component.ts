import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SalesOrderService } from '../sales-order.service';
import { CustomerService } from '../../customer/customer.service';
import { ProductService } from '../../product/product.service';
import { PaymentTermsService } from '../../settings/payment-terms/payment-terms.service';

const log = new Logger('home');

@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.scss'],
  providers: [ProductService]
})
export class SalesOrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  cardTitle = 'New Sales Order';
  salesOrderFormOne: FormGroup;
  salesOrderFormTwo: FormGroup;
  salesOrderFormThree: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;

  customers: any[] = [];
  products: any[] = [];
  paymentTerms: any[] = [];
  saleTypes = [{ name: 'Wholesale', enum: 1 }, { name: 'Retail', enum: 2 }];

  mode = 'Create';

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];

  public sidebarVisible = true;
  public title = 'Create New Sales Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Sales Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private paymentTermsService: PaymentTermsService
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
      console.log('state', this.selectedRow);
    }
  }

  ngOnInit() {
    this.createForm();
    this.getCustomers();
    this.getProducts();
    this.getPaymentTerms();
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.mode = 'Update';
      this.cardTitle = 'Edit Sales Order';
      this.salesOrderFormOne.patchValue({
        customerId: this.selectedRow.customerId
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {}

  getCustomers() {
    this.loader = true;
    this.customerService
      .getCustomers()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCustomers', res);
          if (res.status === true) {
            this.customers = res.result;
            console.log(res);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getPaymentTerms() {
    this.loader = true;
    this.paymentTermsService
      .getPaymentTerms()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPaymentTerms', res);
          if (res.status === true) {
            this.paymentTerms = res.result;
            console.log(res);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getProducts() {
    this.loader = true;
    this.productService
      .getProducts()
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
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;
    console.log('this.mode', this.mode);

    if (this.salesOrderFormOne.valid && this.salesOrderFormTwo.valid && this.salesOrderFormThree.valid) {
      const productId = this.salesOrderFormTwo.value.productId;
      const product = this.products.find(item => item.id === productId);
      const salesItems = [
        {
          ...product,
          productId
        }
      ];
      const data = {
        customerId: this.salesOrderFormOne.value.customerId,
        paymentTermId: this.salesOrderFormThree.value.paymenttermId,
        emailsaleOrder: this.salesOrderFormThree.value.emailsaleOrder,
        saleType: this.salesOrderFormThree.value.saleType,
        salesItems
      };

      console.log('pament terms data', data);
      switch (this.mode) {
        case 'Create':
          this.onCreate(data);
          break;
        case 'Update':
          this.onUpdate(data);
          break;
      }
    }
  }

  onCreate(data: any) {
    console.log(data, 'it is here');

    this.salesOrderService
      .createSalesOrder(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            if (res.result && res.result.length > 0) {
              res.result.forEach((err: any) => {
                this.toastr.error(err.Message, err.Identifier);
              });
            }
            console.log('error', res);
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Purchase Order');
          this.resetForm();
          this.route.navigate(['/', 'salesOrder', 'view']);
        },
        error => {
          serverError(error, this.toastr);
        }
      );
  }

  onUpdate(data: any) {
    console.log('onUpdate', data);
    const payload = {
      ...data,
      id: this.selectedRow.id
    };

    this.salesOrderService
      .updateSalesOrder(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Purchase Order');
          this.route.navigate(['/', 'salesOrder', 'view']);
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    this.salesOrderFormOne = this.formBuilder.group({
      customerId: ['', [Validators.required]]
    });
    this.salesOrderFormTwo = this.formBuilder.group({
      productId: ['', [Validators.required]]
    });
    this.salesOrderFormThree = this.formBuilder.group({
      paymenttermId: ['', [Validators.required]],
      emailsaleOrder: ['', [Validators.required]],
      saleType: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.salesOrderFormOne.reset();
    this.salesOrderFormTwo.reset();
    this.salesOrderFormThree.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
