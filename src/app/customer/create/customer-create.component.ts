import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';
import { DataTableDirective } from 'angular-datatables';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../customer.service';

const log = new Logger('home');

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  modalTitle = 'Customer';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  customerForm: FormGroup;
  formLoading = false;
  customers: any[] = [];
  mode: string = 'Create';
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Create New Customer';
  public breadcrumbItem: any = [
    {
      title: 'Create New Customer',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  onDateSelect(event: any) {
    const birthmonth = `${event.year}-${event.month}-${event.day}`;
    this.customerForm.patchValue({ birthmonth });
  }

  onSubmit() {
    this.formLoading = true;

    if (this.customerForm.valid) {
      const data = {
        ...this.customerForm.value
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
    console.log(data);

    this.customerService
      .createCustomer(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }
  onUpdate(data: any) {
    console.log('onUpdate', data);
    const payload = {
      ...data,
      id: this.selectedRow.id
    };

    this.customerService
      .updateCustomer(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
    this.customerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', Validators.required],
      birthmonth: ['', Validators.required]
    });
  }

  resetForm() {
    this.customerForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
