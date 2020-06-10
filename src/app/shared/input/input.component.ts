import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() control: FormGroup;
  @Input() type: string = 'text';
  @Input() label: string;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() validator: string;
  @Input() required: boolean;
  //@Input() disabled: boolean;

  @Output() blur = new EventEmitter<String>();

  ngOnInit() {}

  showErrors() {
    const { dirty, touched, errors } = this.control;
    return touched && errors;
  }

  onBlur(event: any) {
    this.blur.emit(event.target.value);
  }

  isRequired() {
    return this.required === true ? { required: true } : '';
  }
}
