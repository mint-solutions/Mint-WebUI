import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('home');

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Create New Category';
  public breadcrumbItem: any = [
    {
      title: 'Create New Category',
      cssClass: 'active'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {}

  onSubmit() {
    this.toastr.info('Hello, welcome.', undefined, {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  createForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
  }
}
