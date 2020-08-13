import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { TaxService } from '../settings/tax/tax.service';

const log = new Logger('home');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  products: any[] = [];
  productForm: FormGroup;
  formLoading: boolean;
  loader: boolean;
  taxes: any[] = [];

  public sidebarVisible = true;
  public title = 'Product';
  public breadcrumbItem: any = [
    {
      title: 'Product',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private productService: ProductService,
    private router: Router,
    private taxService: TaxService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getAllTax();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllTax() {
    this.loader = true;
    this.taxService
      .getAllTax()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('res', res);
          if (res.status === true) {
            this.taxes = res.result;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => {
          console.log('errorss', error);
          serverError(error, this.toastr);
        }
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
    //this.productForm.reset();
    this.createForm();

    this.selectedRow = event;

    console.log('event', this.selectedRow);

    this.productForm.patchValue({
      imagelink: this.selectedRow.productconfiguration.imagelink,
      leadtime: this.selectedRow.productconfiguration.leadtime,
      pack: this.selectedRow.productconfiguration.pack,
      canexpire: this.selectedRow.productconfiguration.canexpire,
      canbesold: this.selectedRow.productconfiguration.canbesold,
      salestaxId: this.selectedRow.productconfiguration.salestaxId,
      canbepurchased: this.selectedRow.productconfiguration.canbepurchased,
      anypromo: this.selectedRow.productconfiguration.anypromo
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
      ...this.productForm.value,
      leadtime: +this.productForm.value.leadtime,
      pack: +this.productForm.value.pack,
      salestaxId: +this.productForm.value.salestaxId
    };

    const config = {
      status,
      id: this.selectedRow.productconfiguration.id
    };

    this.productService
      .updateproductConfig(config, data)
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
          this.getProducts();
          this.toastr.success(res.message, 'Product Configuration');
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

    this.productService
      .deleteproduct(this.selectedRow.id)
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
          this.getProducts();
          this.toastr.success(res.message, 'Product');
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.productForm = this.formBuilder.group({
      imagelink: [''],
      leadtime: [0],
      salestaxId: ['', Validators.required],
      pack: [''],
      canexpire: [false],
      //expiredenabled: [ false ],
      canbesold: [false],
      canbepurchased: [false],
      anypromo: [false]
    });
  }

  resetForm() {
    this.productForm.reset();
    this.selectedRow = {};
  }
}
