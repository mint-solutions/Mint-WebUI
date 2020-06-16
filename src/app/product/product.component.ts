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
    private router: Router
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

    this.productForm.patchValue({
      imagelink: this.selectedRow.productconfiguration.imagelink,
      leadtime: this.selectedRow.productconfiguration.leadtime,
      pack: this.selectedRow.productconfiguration.pack,
      canexpire: this.selectedRow.productconfiguration.canexpire,
      canbesold: this.selectedRow.productconfiguration.canbesold,
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

  onSubmit(status: boolean = true) {
    this.formLoading = true;
    const data = {
      ...this.productForm.value,
      leadtime: +this.productForm.value.leadtime,
      pack: +this.productForm.value.pack
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
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formLoading = true;
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.productForm = this.formBuilder.group({
      imagelink: [''],
      leadtime: [0],
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
