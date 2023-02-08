import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, nextAction } from 'src/app/entity/nextActionButtonType';


@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {


  title = '画像登録'


  /** イメージ */
  img: any = []
  /** ファイルリスト */
  fileList: any[] = []

  constructor(
    public _dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ModalData
    ) { }

  ngOnInit(): void {
  }


  nextAction(selected: nextAction) {
    this.data.resultAction = selected.nextId;
    this._dialogRef.close(this.data);
  }

  /**
   * 決定ボタン押下イベント
   */
  getResult() {
    this._dialogRef.close(this.fileList);    
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const files = event.target.files[0];
    console.log('１ファイル');
    console.log(files);
    this.fileList.push(files);
    this.img.push(files);
    console.log('２リスト');
    console.log(this.fileList);
    console.log(this.img);
  }


  onChangeDragAreaInput(event: any) {
    // ファイルの情報はevent.target.filesにある
    let reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.img.push(reader.result);
    };
  }

  dragOver(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
  }
  drop(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
    if (event.dataTransfer == null) {
      return;
    }
    const file = event.dataTransfer.files;
    this.fileList.push(file[0])
    const fileList = Object.entries(file).map(f => f[1]);
    console.log(fileList);

    fileList.forEach(f => {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        this.img.push(reader.result);
      };
    });
  }





}
