import { Component, OnInit } from '@angular/core';
import { AddService } from '../services/add.service';
import { AlertService } from '../services/alert.service';
import { WaterService } from '../services/water.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadService } from '../services/load.service';
import { AlertType } from '../prog-alert/prog-alert.component';
import { DocType } from '../services/models';

@Component({
  selector: 'admin-info',
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.less']
})
export class AdminInfoComponent extends AddService implements OnInit {

  constructor(private as:AlertService, private ws: WaterService, private fb: FormBuilder, private ls:LoadService) {
    super()
  }

  ngOnInit() {
    this.ws.getDocTypes(true).subscribe(types => {
      this.items = types;
    })
    this.initForm();
  }

  public initForm(){
    this.addForm = this.fb.group({
      Name:[null, Validators.required]
    })
  }

  public setForm(id){
    this.item = this.items.find(x => x.Id == id);
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

  private _update(){
    this.update['Id']=this.item.Id;
    this.ws.updateDocType(this.update).subscribe(() => {
      this.item = Object.assign(this.item, this.update);
      this.update = {};
      this.as.alert.showAlert({
        type: AlertType.Success,
        message: "Данные раздела успешно обновлены"
      })
    })
  }

  private _add(){
    this.addForm.value['Info'] = true;
    this.ws.addDocType(this.addForm.value).subscribe(id => {
      this.items.push({Id:id, ...this.addForm.value});
      this.submitted = false;
      this.addForm.reset();
      this.as.alert.showAlert({
        type: AlertType.Success,
        message: "Раздел успешно добавлен"
      })
    })
  }

  public remove(){
    this.ws.removeItem(this.item.Id, 'doctypes').subscribe(x => {
      if(x){
        (this.items as DocType[]).splice(
          (this.items as DocType[]).findIndex(x => x.Id == this.item.Id),1
        )
        this.submitted = false;
        this.initForm();
        this.item = null;
        this.as.alert.showAlert({
          type: AlertType.Success,
          message: "Раздел успешно удален"
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
