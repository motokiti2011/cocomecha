import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-serch-service-modal',
  templateUrl: './serch-service-modal.component.html',
  styleUrls: ['./serch-service-modal.component.scss']
})


export class SerchServiceModalComponent implements OnInit {

    constructor(
    public _dialogRef: MatDialogRef<SerchServiceModalComponent>,
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
