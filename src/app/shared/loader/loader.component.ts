import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() isLoading = false;
  message: string = 'Please wait';

  constructor(public loaderService: LoaderService) {}

  ngOnInit() {}
}
