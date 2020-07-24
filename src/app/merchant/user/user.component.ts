import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { BusinessLocationModel } from '@app/settings/business-location/business-location.model';

const log = new Logger('home');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  users: UserModel[];
  businessLocations: BusinessLocationModel[];
  userForm: FormGroup;
  mode: string = 'Create';
  formLoading = false;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Business Location';
  public breadcrumbItem: any = [
    {
      title: 'Business Location',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private businessLocationService: BusinessLocationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getBusinessLocation();
  }

  getBusinessLocation() {
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
          console.log('getBusinessLocation', res);
          if (res.status === true) {
            this.businessLocations = res.result[0].businessLocation;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;

    if (this.userForm.valid) {
      const data = {
        ...this.userForm.value
      };
      switch (this.mode) {
        case 'Create':
          this.onCreate(data);
          break;
      }
    }
  }

  onCreate(data: any) {
    console.log(data);

    this.userService
      .createuser(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            this.resetForm();
            return componentError(res.message, this.toastr);
          }

          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }

  onEdit(data: UserModel, type: string) {}

  onDelete(category: any, doDelete: any) {
    this.selectedRow = category;
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }
  onDoDelete() {}
  onGetusers(business: any, locationModal: any) {
    this.selectedRow = business;
    this.modalRef = this.modalService.open(locationModal, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onViewRow(event: any, category: any, mode: null) {
    this.userForm.reset();

    const selectedRow = event;
    this.selectedRow = selectedRow;
    this.mode = mode;

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      businesslocationId: ['', Validators.required]
    });
  }

  resetForm() {
    this.userForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  d(data: any) {
    this.resetForm();
  }
}
