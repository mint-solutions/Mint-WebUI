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
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
  months = [
    'January',
    'Februrary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

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
    private customerService: CustomerService,
    private route: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.createForm();
    let state = history.state;

    console.log(state);
    if (state.mode && state.mode === 'edit') {
      this.selectedRow = state.data;
      this.mode = 'Update';
      this.customerForm.patchValue({
        fullname: state.data.fullname,
        email: state.data.email,
        age: state.data.age,
        birthday: state.data.birthday,
        birthmonth: state.data.birthmonth,
        gender: state.data.gender,
        mobilenumber: state.data.mobilenumber
      });
      console.log('edit', state);
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  onDateSelect(event: any) {
    const birthday = `${event.year}-${event.month}-${event.day}`;
    this.customerForm.patchValue({ birthday });
  }

  onSubmit() {
    this.formLoading = true;

    if (this.customerForm.valid) {
      const data = {
        ...this.customerForm.value,
        age: +this.customerForm.value.age,
        gender: +this.customerForm.value.gender,
        birthday: +this.customerForm.value.birthday
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
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            console.log('Failed', res.message);
            //return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Category');
          this.resetForm();
          this.route.navigate(['/', 'customer', 'view']);
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
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status === false) {
            return componentError(res.message, this.toastr);
          }

          this.toastr.success(res.message, 'Category');
          this.resetForm();
          //this.route.navigate([ '/', 'customer', 'view' ]);
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
      email: ['', [Validators.email]],
      mobilenumber: ['', Validators.required],
      birthmonth: [''],
      age: [''],
      birthday: [''],
      gender: ['', Validators.required]
    });
  }

  resetForm() {
    this.customerForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
    this.route.navigate(['/', 'customer', 'view']);
  }
}
