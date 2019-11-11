import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  @Input() selectedRowData: any;
  @Input() loader: boolean;
  @Output() onDelete = new EventEmitter<void>();
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  onDoDelete() {
    this.onDelete.emit();
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
