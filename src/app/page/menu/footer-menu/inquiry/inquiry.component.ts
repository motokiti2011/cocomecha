import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {

  /** フォームコントロール */
  name = new FormControl('名前', [
    Validators.required
  ]);

  mail = new FormControl('メール', [
    Validators.required
  ]);

  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    name: this.name,
    mail: this.mail,
  })

  constructor(
    private builder: FormBuilder,
    public modal: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
