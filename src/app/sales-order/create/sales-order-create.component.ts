import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SalesOrderService } from '../sales-order.service';
import { SupplierService } from '@app/supplier/supplier.service';
import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { BusinessLocationModel } from '@app/settings/business-location/business-location.model';

const log = new Logger('home');

@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.scss']
})
export class SalesOrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  cardTitle = 'New Sales Order';
  salesOrderForm: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;

  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  customerForm: FormGroup;

  customers: any[] = [];

  mode = 'Create';

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];
  businesses: BusinessLocationModel[];

  public sidebarVisible = true;
  public title = 'Create New Sales Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Sales Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private salesOrderService: SalesOrderService,
    private businessLocationService: BusinessLocationService,
    private supplierService: SupplierService
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
      console.log('state', this.selectedRow);
    }
  }

  ngOnInit() {
    //this.getPackings();
    this.getSuppliers();
    this.createForm();
    this.getBusinessess();
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.mode = 'Update';
      this.cardTitle = 'Edit Purchase Order';
      this.salesOrderForm.patchValue({
        supplierId: this.selectedRow.supplierId,
        invoiceNumber: this.selectedRow.invoiceNumber,
        shiptobusinessId: this.selectedRow.shiptobusinessId,
        duedate: this.selectedRow.duedate
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {}

  getSuppliers() {
    this.suppliersLoader = true;
    this.supplierService
      .getsuppliers()
      .pipe(
        finalize(() => {
          this.suppliersLoader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getSuppliers', res);
          if (res.status === true) {
            this.suppliers = res.result;
            console.log(res);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getBusinessess() {
    this.loader = true;
    this.businessLocationService
      .getAllBusiness()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getBusinessess', res);
          if (res.status === true) {
            this.businesses = res.result;
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

    if (this.salesOrderForm.valid) {
      const data = {
        supplierId: this.salesOrderForm.value.supplierId,
        invoiceNumber: this.salesOrderForm.value.invoiceNumber,
        shiptobusinessId: this.salesOrderForm.value.shiptobusinessId,
        duedate: this.salesOrderForm.value.duedate
      };
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
    let isDisabled = formMode === 'view' ? true : false;

    this.salesOrderForm = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      shiptobusinessId: ['', [Validators.required]],
      duedate: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.salesOrderForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
