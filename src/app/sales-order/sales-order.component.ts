import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesOrderService } from './sales-order.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';

const log = new Logger('home');

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  salesOrders: any[] = [];
  salesOrderForm: FormGroup;
  formLoading: boolean;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Sales Order';
  public breadcrumbItem: any = [
    {
      title: 'Sales Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private salesOrderService: SalesOrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSalesOrders();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getSalesOrders() {
    this.loader = true;
    this.salesOrderService
      .getSalesOrders()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getSalesOrders', res);
          if (res.status === true) {
            this.salesOrders = res.result;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onViewRow(event: any, modalView: any) {
    //this.salesOrderForm.reset();
    this.createForm();

    this.selectedRow = event;

    this.salesOrderForm.patchValue({
      supplierId: this.selectedRow.supplierId,
      invoiceNumber: this.selectedRow.invoiceNumber,
      shiptobusinessId: this.selectedRow.shiptobusinessId,
      duedate: this.selectedRow.duedate
    });

    this.modalRef = this.modalService.open(modalView, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'lg',
      windowClass: 'confirmModal'
    });
  }

  onViewDetails(event: any, modalView: any) {
    this.selectedRow = event;
    console.log(this.selectedRow);

    this.modalRef = this.modalService.open(modalView, {
      size: 'lg',
      windowClass: 'search'
    });
  }

  onSubmit(status: boolean = true) {
    this.formLoading = true;
    const data = {
      ...this.salesOrderForm.value,
      leadtime: +this.salesOrderForm.value.leadtime,
      pack: +this.salesOrderForm.value.pack
    };

    const config = {
      status,
      id: this.selectedRow.productconfiguration.id
    };

    this.salesOrderService
      .updateSalesOrderConfig(config, data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
          this.modalRef.close();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getSalesOrders();
          this.toastr.success(res.message, 'Sales Order');
        },
        error => serverError(error, this.toastr)
      );
  }

  onEdit(data: any, mode: any) {
    data['mode'] = mode;

    console.log(data);

    this.router.navigateByUrl('/product/create', { state: data });
  }

  onDelete(data: any, doDelete: any) {
    this.selectedRow = data;

    console.log(this.selectedRow.id);
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete() {
    this.formLoading = true;

    this.salesOrderService
      .deleteSalesOrder(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.doDeleteModalRef.close();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getSalesOrders();
          this.toastr.success(res.message, 'Product');
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
    this.selectedRow = {};
  }
}
