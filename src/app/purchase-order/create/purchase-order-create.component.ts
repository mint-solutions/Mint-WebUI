import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { CategoryService } from '@app/category/category.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { SupplierService } from '@app/supplier/supplier.service';
import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { BusinessLocationModel } from '@app/settings/business-location/business-location.model';

const log = new Logger('home');

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.scss']
})
export class PurchaseOrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  cardTitle = 'New Purchase Order';
  purchaseOrderForm: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;

  mode: string = 'Create';

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];
  businesses: BusinessLocationModel[];

  public sidebarVisible = true;
  public title = 'Create New Purchase Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Purchase Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private purchaseOrderService: PurchaseOrderService,
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
      this.purchaseOrderForm.patchValue({
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

    if (this.purchaseOrderForm.valid) {
      const data = {
        supplierId: this.purchaseOrderForm.value.supplierId,
        invoiceNumber: this.purchaseOrderForm.value.invoiceNumber,
        shiptobusinessId: this.purchaseOrderForm.value.shiptobusinessId,
        duedate: this.purchaseOrderForm.value.duedate
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

    this.purchaseOrderService
      .createPurchaseOrder(data)
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
          this.route.navigate(['/', 'purchaseOrder', 'view']);
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

    this.purchaseOrderService
      .updatePurchaseOrder(payload)
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
          this.route.navigate(['/', 'purchaseOrder', 'view']);
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.purchaseOrderForm = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      shiptobusinessId: ['', [Validators.required]],
      duedate: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.purchaseOrderForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
