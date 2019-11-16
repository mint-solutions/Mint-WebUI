import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('home');

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;

  selectedRow: any;
  formLoading = false;
  customers: any[] = [];

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
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.customers = this.listOfCustomers;
  }

  ngOnDestroy() {}

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
    this.customerForm.patchValue({ name: data.name });
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
