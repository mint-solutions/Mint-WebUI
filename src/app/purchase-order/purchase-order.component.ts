import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from './purchase-order.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';

const log = new Logger('home');

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  purchaseOrders: any[] = [];
  purchaseOrderForm: FormGroup;
  formLoading: boolean;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Purchase Order';
  public breadcrumbItem: any = [
    {
      title: 'Purchase Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPurchaseOrders();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getPurchaseOrders() {
    this.loader = true;
    this.purchaseOrderService
      .getPurchaseOrders()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPurchaseOrders', res);
          if (res.status === true) {
            this.purchaseOrders = res.result;
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
    //this.purchaseOrderForm.reset();
    this.createForm();

    this.selectedRow = event;

    this.purchaseOrderForm.patchValue({
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
      ...this.purchaseOrderForm.value,
      leadtime: +this.purchaseOrderForm.value.leadtime,
      pack: +this.purchaseOrderForm.value.pack
    };

    const config = {
      status,
      id: this.selectedRow.productconfiguration.id
    };

    this.purchaseOrderService
      .updatePurchaseOrderConfig(config, data)
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
          this.getPurchaseOrders();
          this.toastr.success(res.message, 'Purchase Order');
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

    this.purchaseOrderService
      .deletePurchaseOrder(this.selectedRow.id)
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
          this.getPurchaseOrders();
          this.toastr.success(res.message, 'Product');
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
    this.selectedRow = {};
  }
}
