import { Component, Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-create-modal',
  templateUrl: './service-create-modal.component.html',
  styleUrls: ['./service-create-modal.component.scss']
})
export class ServiceCreateModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<ServiceCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: string,
  ) { }

  ngOnInit(): void {
  }

  onClick(result: number) {
    console.log(result);
  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  onReturn() {
    this.closeModal();
  }

}
