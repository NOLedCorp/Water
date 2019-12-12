import { Component, OnInit, Input } from '@angular/core';
import { Rate, Price } from '../services/models';
import { AddService } from '../services/add.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { WaterService } from '../services/water.service';
import { AlertType } from '../prog-alert/prog-alert.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'admin-rate-form',
  templateUrl: './admin-rate-form.component.html',
  styleUrls: ['./admin-rate-form.component.less']
})
export class AdminRateFormComponent extends AddService implements OnInit {
  @Input() rate: Rate;

  formError:boolean = false;
  prices:Price[];

  years:number[] = [];

  yearControl:FormControl = new FormControl();
  ru = {
    firstDayOfWeek: 1,
    dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
    monthNamesShort: [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн","Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.mm.yyyy',
    weekHeader: 'Нед'
  };

  public choosedPriceId: number;

  constructor( private _as:AlertService,
     private _fb: FormBuilder, private _ws:WaterService) {
    super();
   }

  ngOnInit() {
    this.addForm = this._fb.group({
      DateStart: [null, Validators.required],
      DateFinish: [null, Validators.required],
      Price: [null, Validators.required]
    });
    let year = new Date().getFullYear();
    for(let i = year-10; i<year+10; i++){
      this.years.push(i);
    }
    this.yearControl.setValue(year);
    this.setPrices(year)
    this.yearControl.valueChanges.subscribe(year => {
      this.setPrices(+year)
    })
  }

  setPrices(year: number){
    this.prices = this.rate.Prices.filter(p => {
      return p.DateStart.getFullYear() === +year || p.DateFinish.getFullYear() === +year
    })
  }

  findPrice(dateStart: Date, dateFinish:Date){
    return this.rate.Prices.find(p => p.DateStart.toString() == dateStart.toString() 
    && p.DateFinish.toString() == dateFinish.toString());
  }

  choosePrice(id: number, price?: Price): void{
    if(!price){
      price = this.prices.find(p => p.Id == id);
    }
    this.item = price;
    this.addForm.patchValue(price, {emitEvent: false});
    
    this.choosedPriceId = id;
    this.update = {};
    this.setSubscriptions();
  }

  clearForm(){
    this.choosedPriceId = null;
    this.formError = false;
    this.addForm.reset();
  }

  save(){
    if(this.addForm.invalid){
      return;
    }

    if (this.addForm.value.DateStart>this.addForm.value.DateFinish) {
      this.formError = true;
      return;
    }
    
    this.formError = false;
    if(this.choosedPriceId){
      if(this.update['DateStart']){
        this.update['DateStart'] = this._formatDate(this.update['DateStart']);
      }
      if(this.update['DateFinish']){
        this.update['DateFinish'] = this._formatDate(this.update['DateFinish']);
      }
      this._ws.updatePrice({Id: this.choosedPriceId, ...this.update}).subscribe(()=> {
        let price = this.rate.Prices.find(p => p.Id==this.choosedPriceId);
        Object.assign(price, this.v);
        this.update = {};
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Тариф успешно обновлен"
        })
      })
    }
    else{
      this._ws.addPrice({
        PriceTypeId: this.rate.Id,
        DateStart: this._formatDate(this.v['DateStart']),
        DateFinish: this._formatDate(this.v['DateFinish']),
        Price: this.v['Price']
      }).subscribe(id => {
        this.rate.Prices.push({
          Id: id,
          PriceTypeId: this.rate.Id,
          ...this.v
        });
        this.addForm.reset();
        this.setPrices(this.yearControl.value);
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Тариф успешно добавлен"
        })
      })
    }
  }

  remove(id){
    this._ws.removeItem(id, 'pricevalues').subscribe(x => {
      if(x){
        this.rate.Prices.splice(this.rate.Prices.findIndex(p => p.Id == id), 1);
        this.clearForm();
        this.setPrices(this.yearControl.value);
        this._as.alert.showAlert({
          type: AlertType.Success,
          message: "Тариф успешно удален"
        })
      }
    })
  }


}
