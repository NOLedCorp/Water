import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { UploadTypes, BaseEntity, News } from '../services/models';
import { WaterService } from '../services/water.service';
import { Router } from '@angular/router';
import { LoadService } from '../services/load.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import { AlertType } from '../prog-alert/prog-alert.component';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { WaterValidators } from '../services/water.validators';
import { AddService } from '../services/add.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.less']
})
export class AdminNewsComponent extends AddService implements OnInit {
  addForm:FormGroup;
  submitted = false;
  images = [];
  ipattern=/(\.png|\.jpg)$/i;
  invalidImage = false;
  description = '';
  public Editor = ClassicEditor;
  
  public config = {
    language: 'ru',
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ]
  };
  public model = {
    editorData: this.description
  };
  constructor(private _as:AlertService,
     private fb:FormBuilder, private ls:LoadService, private ws:WaterService) {
       super();
     }

  ngOnInit() {
    this.ws.getNews().subscribe(news => {
      this.items = news;
    })
    this.submitted = false;

    this._initForm();
  }

  private _initForm(){
    this.addForm = this.fb.group({
      Name:[null,Validators.required],
      Image: this.fb.array([]),
      Description:[null, Validators.required]
    })
  }

  public setForm(id){
    this.item = this.items.find(x => x.Id == id);

    this.submitted = true;
    
    this.addForm = this.fb.group({
      Name: this.item.Name,
      Image: new FormArray([]),
      Description: this.item.Description,
    });

    const images = (<FormArray>this.addForm.get('Image'));
    this.item.Image.forEach(t => {
      images.push(new FormControl(t))
    })
    this.update = {};
  }

  setImages(){
    
  }

  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  addImage(value = null){
    const img = (<FormArray>this.addForm.get('Image'));
    img.push(new FormControl(value, [Validators.required]));
  }

  save(){
    this.submitted=true;
    if(this.addForm.invalid){
      return;
    }
    if (this.item) {
      this._update();
    }
    else{
      this.add();
    }
  }

  add(){
    this.ls.showLoad = true;
    this.ls.load = 0;
    this.ws.addNews(this.addForm.value).subscribe(news => {
      let item = Object.assign({},this.addForm.value, {Id:news[0]});
      item.Image = [];
      this.items.unshift(item);
      const v = this.addForm.value.Image;
      for (let i = 0; i < v.length; i++) {
        const el = v[i];
        var formData = new FormData();
        formData.append('Image', el, el.name.replace(' ','_'));
        const id = news[1][i];
        this.ws.UploadFile(id, UploadTypes.NewImage, formData).subscribe(event=>{
          if(event.type == HttpEventType.UploadProgress){
            this.ls.load = Math.round(event.loaded/event.total * 100);
          }
          else if(event.type == HttpEventType.Response){
            item.Image.push(event.body[0].Image);
          }
        })
      };
      this.ls.showLoad = false;
      this._as.alert.showAlert({
        type: AlertType.Success,
        message: "Новость успешно добавлена"
      })
      this.ngOnInit();
    })
  }

  remove(){
    this.ws.removeNews(this.item.Id, this.item.Image).subscribe(x=>{
      if(x){
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Новость успешно удалена"
        })
        this.ngOnInit();
      }
    });
  }

  private _update(){
    this.ls.showLoad = true;
    const update = this.generateUpdateRequest();
    if(update.data){
      this.ws.updateNews({Id: this.item.Id, ...update.data}).subscribe(news=>{
        this.item = Object.assign(this.item, update.data);
        this.item.Image = this.item.Image.filter(i => !(i instanceof File));
        if (news!=null) {
          for (let i = 0; i < this.addForm.value.Image.length; i++) {
            const el = this.addForm.value.Image[i];
            const id = news[i];
            if (el instanceof File) {
              var formData = new FormData();
              formData.append('Image', el, el.name.replace(' ','_'));
              this.ws.UploadFile(id, UploadTypes.NewImage, formData).subscribe(event=>{
                if(event.type == HttpEventType.UploadProgress){
                  this.ls.load = Math.round(event.loaded/event.total * 100);
                }
                else if(event.type == HttpEventType.Response){
                  (<FormArray>this.addForm.get('Image')).controls[i].setValue(event.body[0].Image);
                  this.item.Image.push(event.body[0].Image);
                }
              })
            }
            else {
              this.ws.updateUrl({Id:id, Image:el}).subscribe(()=>{});
            }
          } 
        }
        this.ls.showLoad = false;
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Данные документа успешно обновлены"
        })
      });
    }
  }

  clear(){
    this.submitted = false;
    this._initForm();
    this.item = null;
    document.getElementsByTagName('prog-select')[0].getElementsByTagName("input")[0].value = '';
  }

  removeImg(i){
    (<FormArray>this.addForm.get('Image')).removeAt(i);
  }

  get f() { return this.addForm.controls; };
}
