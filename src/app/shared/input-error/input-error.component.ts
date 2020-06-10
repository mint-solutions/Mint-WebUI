import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss']
})
export class InputErrorComponent implements OnInit {
  @Input() control: FormGroup;
  @Input() name: string;

  @Output() blur = new EventEmitter<String>();

  ngOnInit() {}

  showErrors() {
    const { dirty, touched, errors } = this.control;
    return touched && errors;
  }
}
