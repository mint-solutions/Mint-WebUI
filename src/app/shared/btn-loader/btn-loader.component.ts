import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-btn-loader',
  templateUrl: './btn-loader.component.html',
  styleUrls: ['./btn-loader.component.scss']
})
export class BtnLoaderComponent implements OnInit {
  @Input() isLoading: boolean = false;
  message: string = 'Please wait';

  constructor() {}

  ngOnInit() {}
}
