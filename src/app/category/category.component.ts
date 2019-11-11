import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

const log = new Logger('home');

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  formLoading = false;
  categories: any[] = [];
  mode: string = 'Create';

  public sidebarVisible = true;
  public title = 'Category';
  public breadcrumbItem: any = [
    {
      title: 'Category',
      cssClass: 'active'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.categories = [
      {
        id: 1,
        name: 'Electronic'
      },
      {
        id: 2,
        name: 'Phone'
      },
      {
        id: 3,
        name: 'Fashion'
      }
    ];
  }

  ngOnDestroy() {}

  onSubmit() {
    this.formLoading = true;

    if (this.categoryForm.valid) {
      const data = {
        ...this.categoryForm.value
      };
      switch (this.mode) {
        case 'Create':
          this.onCreate(data);
          break;
        case 'Ppdate':
          this.onUpdate(data);
          break;
      }
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
    this.mode = 'Update';
    this.categoryForm.patchValue({ name: data.name });
  }

  onCreate(data: any) {
    console.log('onCreate', data);
  }
  onUpdate(data: any) {
    console.log('onUpdate', data);
  }

  createForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.mode = 'Create';
  }
}
