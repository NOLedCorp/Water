import { Component, OnInit } from '@angular/core';
import { WaterService } from '../services/water.service';
import { DocTypes, Doc, UploadTypes, DocType } from '../services/models';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddService } from '../services/add.service';
import { WaterValidators } from '../services/water.validators';
import { Subscription, forkJoin } from 'rxjs';
import { LoadService } from '../services/load.service';
import { HttpEventType } from '@angular/common/http';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../prog-alert/prog-alert.component';

@Component({
  selector: 'app-admin-docs',
  templateUrl: './admin-docs.component.html',
  styleUrls: ['./admin-docs.component.less']
})
export class AdminDocsComponent extends AddService implements OnInit {
  description = '';
  tpattern=/(\.docx|\.pdf|\.txt|\.doc|\.xlsx|\.xls|\.zip|\.7z|\.rar)$/i;
  ipattern=/(\.png|\.jpg)$/i;
  docTypes: DocType;
  public Editor = ClassicEditor;
  
  public config = {
    language: 'ru',
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ]
  };
  public model = {
    editorData: this.description
  };
  constructor(
    private _as:AlertService, private _ws: WaterService, private _fb: FormBuilder, private _ls:LoadService) {
    super();
   }

  ngOnInit() {
    this._ws.getDocTypes().subscribe(types => {
      this.docTypes = types;
      this._ws.getDocs().subscribe(docs => {
        this.items = docs.reverse();
      })
    })

    this.addForm = this._fb.group({
      Name:[null, Validators.required],
      TypeId:[null, Validators.required],
      IsImportant:[false],
      Description: [null],
      Image:[null, [Validators.required, WaterValidators.FileNameValidator(this.ipattern)]],
      Document:[null, [Validators.required, WaterValidators.FileNameValidator(this.tpattern)]]
    })
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  public setForm(id){
    this.item = this.items.find(x => x.Id == id);
    this.item.IsImportant = this.item.IsImportant === '1';
    this.addForm.patchValue(this.item);
  }

  public save(): void{
    this.submitted = true;
    if(this.addForm.invalid){
      return;
    }
    if(this.item){
      this._update();
    }else{
      this._add();
    }
  }

  private _add(): void{
    this._ls.showLoad = true;
    this._ws.addDoc({Name: this.v.Name, TypeId: this.v.TypeId, IsImportant: this.v.IsImportant, Description: this.v.Description}).subscribe(docId => {
      const formData = new FormData();
      formData.append('Image', this.v.Image);
      formData.append('Document', this.v.Document);
      this._ws.UploadFile(docId, UploadTypes.Docs, formData).subscribe(event=>{
        if(event.type == HttpEventType.UploadProgress){
          this._ls.load = Math.round(event.loaded/event.total * 100);
        }
        else if(event.type == HttpEventType.Response){
          this.items.unshift({
            Id: docId, 
            Image: event.body[0].Image, 
            Document: event.body[0].Document, 
            Name: this.v.Name, 
            TypeId: this.v.TypeId, 
            IsImportant: this.v.IsImportant,
            Description: this.v.Description
          });
          this._ls.showLoad = false;
          this.submitted = false;
          this.addForm.reset();
          this._as.alert.showAlert({
            type: AlertType.Success,
            message: "Документ успешно добавлен"
          })
        }
      })
    })
  }

  private _update(){
    const update = this.generateUpdateRequest();
    if(update.data){
      this._ws.updateDoc({Id: this.item.Id, ...update.data}).subscribe(()=>{
        this.item = Object.assign(this.item, update.data);
        this.addForm.patchValue(this.item);
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Данные документа успешно обновлены"
        })
      })
    }
    
    if(update.files){
      this._ws.UploadFile(this.item.Id, UploadTypes.Docs,update.files).subscribe(event=>{
        if(event.type == HttpEventType.UploadProgress){
          this._ls.load = Math.round(event.loaded/event.total * 100);
        }
        else if(event.type == HttpEventType.Response){
          this.item = Object.assign(this.item, event.body[0]);
          this.addForm.patchValue(this.item);
          this._as.alert.showAlert({
            type: AlertType.Success,
            message: "Файлы успешно загружены"
          })
        }
      })
    }
  }

  remove(){
    this._ws.removeItem(this.item.Id, 'docs').subscribe(x => {
      if(x){
        (this.items as Doc[]).splice(
          (this.items as Doc[]).findIndex(x => x.Id == this.item.Id),1
        )
        this.submitted = false;
        this.addForm.reset();
        this.item = null;
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Документ успешно удален"
        })
      }
    })
  }

  clear(){
    this.submitted = false;
    this.addForm.reset();
    this.item = null;
    document.getElementsByTagName('prog-select')[0].getElementsByTagName("input")[0].value = '';
  }
}