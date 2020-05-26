import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from './customer.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';

const log = new Logger('home');

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  customerForm: FormGroup;

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;

  selectedRow: any;
  formLoading = false;
  customers: any[] = [];
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Customer';
  public breadcrumbItem: any = [
    {
      title: 'Customer',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.getCustomers();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

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
          console.log('getCountries', res);
          if (res.status === true) {
            this.customers = res.result;
            console.log(res);
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

  onSubmit() {
    this.formLoading = true;

    if (this.customerForm.valid) {
      const data = {
        ...this.customerForm.value
      };
      this.onCreate(data);

      this.toastr.info('Hello, welcome to eCorvids.', undefined, {
        closeButton: true,
        positionClass: 'toast-top-right'
      });
    }
  }

  onViewRow(data: any, mode?: string) {
    console.log(data, mode);
  }

  onEdit(data: any, mode: any) {
    this.router.navigateByUrl('/customer/create', { state: { mode: 'edit', data: data } });
    // this.customerForm.patchValue({ name: data.name });
  }

  onCreate(data: any) {
    console.log('onCreate', data);
  }
  onUpdate(data: any) {
    console.log('onUpdate', data);
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

  createForm() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
  }

  get listOfCustomers() {
    return [
      {
        id: 1,
        firstname: 'James',
        lastname: 'Mike',
        phonenumber: '07032248237'
      },
      {
        id: 2,
        firstname: 'Vicky',
        lastname: 'Olu',
        phonenumber: '07032248237'
      },
      {
        id: 3,
        firstname: 'Sandra',
        lastname: 'Iyom',
        phonenumber: '07032248237'
      }
    ];
  }
}
