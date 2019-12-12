import { Component, OnInit } from '@angular/core';
import { WaterService } from '../services/water.service';
import { AddService } from '../services/add.service';
import { FormBuilder, Validators, FormControl, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { VacancyType, Vacancy } from '../services/models';
import { AlertType } from '../prog-alert/prog-alert.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-admin-vacancies',
  templateUrl: './admin-vacancies.component.html',
  styleUrls: ['./admin-vacancies.component.less']
})
export class AdminVacanciesComponent extends AddService implements OnInit {
  type = VacancyType;
  constructor(private _as:AlertService,
     private _ws:WaterService, private _fb:FormBuilder) { 
    super();
  }

  ngOnInit() {
    this._ws.getVacancies().subscribe(v => {
      this.items = v;
    })
    this._initForm();
  }

  private _initForm(){
    this.addForm = this._fb.group({
      Name:[null, Validators.required],
      WorkTime:[null, Validators.required],
      Duties: new FormArray([
        this._fb.group({
          Type: [VacancyType.Duty],
          Name: [null, Validators.required]
        })
      ]),
      Requirements: new FormArray([
        this._fb.group({
          Type: [VacancyType.Requirement],
          Name: [null, Validators.required]
        })
      ]),
      Conditions: new FormArray([
        this._fb.group({
          Type: [VacancyType.Condition],
          Name: [null, Validators.required]
        })
      ]),
      Country:[null, Validators.required],
      Salary: [null]
    })
    this.update = {};
  }


  public setForm(id): void{
    this.submitted = true;
    this.item = this.items.find(c => c.Id == id);
    
    this.addForm = this._fb.group({
      Name:[this.item.Name, Validators.required],
      WorkTime:[this.item.WorkTime, Validators.required],
      Duties: new FormArray([]),
      Requirements: new FormArray([]),
      Conditions: new FormArray([]),
      Country:[this.item.Country, Validators.required],
      Salary: [this.item.Salary, Validators.required]
    });
    

    const duties = (<FormArray>this.addForm.get('Duties'));
    const requirements = (<FormArray>this.addForm.get('Requirements'));
    const conditions = (<FormArray>this.addForm.get('Conditions'));

    this.item.Duties.forEach((t,i) => {
      duties.push(
        this._fb.group({
          Type: [VacancyType.Duty],
          Name: [t.Name, Validators.required]
        })
      )
    })
    this.item.Requirements.forEach((t,i) => {
      requirements.push(
        this._fb.group({
          Type: [VacancyType.Requirement],
          Name: [t.Name, Validators.required]
        })
      )
    })
    this.item.Conditions.forEach((t,i) => {
      conditions.push(
        this._fb.group({
          Type: [VacancyType.Condition],
          Name: [t.Name, Validators.required]
        })
      )
    })
    this.update = {};
  }

  getFormControls(form: string){
    return (<FormArray>this.addForm.get(form)).controls;
  }

  clearVacancy(index: number, formName: string){
    const form = (<FormArray>this.addForm.get(formName));
    form.removeAt(index);
    
  }

  addVacancy(formControlName: string, type: VacancyType){
    const formControl = (<FormArray>this.addForm.get(formControlName));
    formControl.push(
      this._fb.group({
        Type: [type],
        Name: [null, Validators.required]
      }))
  }

  save(){
    this.submitted = true;
    if(this.addForm.invalid){
      return;
    }
    if(this.item){
      this.updateVacancy();
    }else{
      this.saveVacancy();
    }
  }

  saveVacancy(){
    let vacancy = Object.assign({}, this.v, {AllConditions: [...this.v.Duties, ...this.v.Requirements, ...this.v.Conditions]});
    delete vacancy.Duties;
    delete vacancy.Requirements;
    delete vacancy.Conditions;
    this._ws.addVacancy(vacancy).subscribe(id => {
      this.items.push({Id:id, ...this.v});
      this.submitted = false;
      this._initForm();
      this._as.alert.showAlert({
        type: AlertType.Success,
        message: "Вакансия успешно добавлена"
      })
    })
  }

  updateVacancy(){
    
    let conditions = [];
    let types = Object.entries(this.update)
    .filter(([k,v]) => v instanceof Array)
    .map(([k,v]) => {
      conditions.push(...(<any>v));
      if(v[0]){
        return v[0].Type
      }else{
        switch(k){
          case 'Duties':{
            return VacancyType.Duty;
          }
          case 'Requirements':{
            return VacancyType.Requirement;
          }
          case 'Conditions':{
            return VacancyType.Condition;
          }
        }
      }
      
    })
    let upd = Object.assign(this.update, {AllConditions: conditions, Types: types, Id: this.item.Id});
    delete upd['Duties'];
    delete upd['Requirements'];
    delete upd['Conditions'];
    this._ws.updateVacancy(upd).subscribe(id => {
      this.item = Object.assign(this.item, this.update);
      this.submitted = false;
      this.update = {};
      this._as.alert.showAlert({
        type: AlertType.Success,
        message: "Вакансия успешно обновлена"
      })
    })
  }

  remove(){
    this._ws.removeItem(this.item.Id, 'vacancies').subscribe(x => {
      if(x){
        (this.items as Vacancy[]).splice(
          (this.items as Vacancy[]).findIndex(x => x.Id == this.item.Id),
          1
        )
        this.submitted = false;
        this._initForm();
        this.item = null;

        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Вакансия успешно удалена"
        })
      }
    })
  }

  clear(){
    this.submitted = false;
    this._initForm();
    this.item = null;
    document.getElementsByTagName('prog-select')[0].getElementsByTagName("input")[0].value = '';
  }
}
