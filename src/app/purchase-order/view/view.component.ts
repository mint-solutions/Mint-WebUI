import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '../../shared/shared.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

const log = new Logger('home');

export interface OrderItemsElement {
  name: string;
  position: number;
  itemCode: number;
  wholesaleCost: number;
  retailCost: number;
  productId: number;
  ctnQuantity: number;
  unitQuantity: number;
  pack: number;
}

export interface OrderElement {
  supplier: string;
  businessLocation: string;
  warehouse: string;
  dueDate: string;
  invoiceNumber: string;
}

export interface ApprovePurchaseOrderElement {
  purchaseorderId: string;
  status: string;
  comment: string;
}

const ORDER_ITEMS_TABLE_DATA: OrderItemsElement[] = [];
const ORDER_TABLE_DATA: OrderElement[] = [];

@Component({
  selector: 'approve-purchase-order-modal',
  templateUrl: 'approve-purchase-order-modal.html',
  styleUrls: ['./view.component.scss']
})
export class ApprovePurchaseOrderModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ApprovePurchaseOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApprovePurchaseOrderElement
  ) {}

  onNoClick(data: ApprovePurchaseOrderElement): void {
    data['cancel'] = true;
    this.dialogRef.close();
  }
}

@Component({
  selector: 'purchase-order-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class PurchaseOrderViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dtElement: DataTableDirective;
  sharedServiceSubsscription: Subscription;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  purchaseOrder: any[] = [];
  formLoading: boolean;
  loader: boolean;

  orderDataSource = new MatTableDataSource<OrderElement>(ORDER_TABLE_DATA);
  orderItemsDataSource = new MatTableDataSource<OrderItemsElement>(ORDER_ITEMS_TABLE_DATA);
  displayedOrderColumns: string[] = ['invoiceNumber', 'supplier', 'businessLocation', 'warehouse', 'dueDate'];

  displayedItemsColumns: string[] = [
    'position',
    'name',
    'wholesaleCost',
    'retailCost',
    'pack',
    'ctnQuantity',
    'unitQuantity'
  ];

  public sidebarVisible = false;
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
    private router: Router,
    private sharedService: SharedService,
    private routes: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    public modal: MatDialog
  ) {}

  ngOnInit() {
    this.getParams();
    this.orderItemsDataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.sharedServiceSubsscription.unsubscribe();
  }

  getParams() {
    this.routes.params.subscribe(params => {
      const { invoiceNumber } = params;
      this.getPurchaseOrderByInvoiceNumber(invoiceNumber);
    });
  }

  getPurchaseOrderByInvoiceNumber(invoiceNumber: string) {
    this.sharedServiceSubsscription = this.sharedService.sharedPurchaseOrders.subscribe(purchaseOrders => {
      this.purchaseOrder = purchaseOrders.filter(purchaseOrder => purchaseOrder.invoiceNumber === invoiceNumber);
      if (!this.purchaseOrder.length) {
        this.router.navigateByUrl('/purchaseOrder/view');
        return;
      }

      this.title = `Purchase Order ${this.purchaseOrder[0].invoiceNumber}`;
      console.log('purchaseOrder', this.purchaseOrder);
      this.orderDataSource.data = this.purchaseOrder.map(order => {
        const {
          supplier: { companyname: supplier },
          dueDate,
          shipbusinesslocation: { name: businessLocation },
          warehouse: { name: warehouse }
        } = order;
        return { invoiceNumber, supplier, businessLocation, warehouse, dueDate };
      });

      this.orderItemsDataSource.data = this.purchaseOrder[0].orderitem.map((item: any, index: string) => {
        const position = index + 1;
        const {
          product: {
            name,
            itemCode,
            id: { productId }
          },
          unitqty: unitQuantity,
          ctnqty: ctnQuantity,
          wholesalecost: wholesaleCost,
          linetotalwholesaleCost,
          retailcost: retailCost
        } = item;

        const pack = linetotalwholesaleCost / wholesaleCost;
        return {
          position,
          name,
          itemCode,
          retailCost,
          wholesaleCost,
          productId,
          pack,
          unitQuantity,
          ctnQuantity
        };
      });
    });
  }

  applyFilter(filterValue: string) {
    this.orderItemsDataSource.filter = filterValue.trim().toLowerCase();
  }

  onApprovePurchaseOrder(purchaseorderId: string) {
    const data = { purchaseorderId, status: true, comment: '' };
    this.openApproveDialog(data);
  }

  onRejectPurchaseOrder(purchaseorderId: string) {
    const data = { purchaseorderId, status: false, comment: '' };
    this.openApproveDialog(data);
  }

  openApproveDialog(data: any): void {
    const dialogRef = this.modal.open(ApprovePurchaseOrderModalComponent, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.approvePurchaseOrder(result);
    });
  }

  approvePurchaseOrder(data: any) {
    this.purchaseOrderService
      .approvePurchaseOrder(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          console.log('approvePurchaseOrder', res);
          this.formLoading = false;
          if (res.status !== true) {
            if (res.result && res.result.length > 0) {
              res.result.forEach((err: any) => {
                this.toastr.error(err.Message, err.Identifier);
              });
            }
            console.log('error', res);
            return this.toastr.error(res.message, 'ERROR');
          }
          this.toastr.success(res.message, 'SUCCESS');
          data.status
            ? (this.purchaseOrder[0].transactionstatusId = 2)
            : (this.purchaseOrder[0].transactionstatusId = 3);
        },
        error => {
          this.toastr.error(error, 'ERROR');
        }
      );
  }

  convertPurchaseOrderToGrn(purchaseOrderId: string) {
    this.purchaseOrderService
      .convertToGrn(purchaseOrderId)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          console.log('convertToGrn', res);
          this.formLoading = false;
          if (res.status !== true) {
            if (res.result && res.result.length > 0) {
              res.result.forEach((err: any) => {
                this.toastr.error(err.Message, err.Identifier);
              });
            }
            console.log('error', res);
            return this.toastr.error(res.message, 'ERROR');
          }
          this.toastr.success(res.message, 'SUCCESS');
          this.router.navigate(['/', 'grn', 'view']);
        },
        error => {
          this.toastr.error(error, 'ERROR');
        }
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
}
