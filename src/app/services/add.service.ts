import { Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Injectable()
export class AddService{
    private _item:any;
    @Input() public set item(item){
        this._item = item;
        this.update = {};
    };
    @Input() items:any;
    public update = {};
    public _addForm:FormGroup;
    public submitted = false;
    public files = {};
    constructor(){

    }
    public get addForm(){
        return this._addForm;
    }

    public get item(){
        return this._item;
    }
    public set addForm(form:FormGroup){
        this._addForm = form;
        Object.keys(this.addForm.controls).forEach(controlName => {
            this._addForm.controls[controlName].valueChanges.subscribe(c => {
                
                if(this.item){
                    if(this.item[controlName]!=c){
                        this.update[controlName]=c;
                    }else{
                        delete this.update[controlName];
                    }
                }
            })
        })
    }
    getValue(v){
        if(v){
            return v.split('\\')[2];
        }
        
    }
    setFile(e){
      this.files[e.target.id]=e.target.files[0];
    }

    updArray(name, arr){
        this.update[name]=arr;
    }

    deleteItem(parent, arr, name, id){
        parent[arr] = parent[arr].filter(x => x[name]!=id);
        return true;
    }

    generateUpdateRequest(): {data:any, files: FormData}{
        let out: {data:any, files: FormData} = {data:null, files:null};
        Object.keys(this.update).forEach(k => {
            if(this.update[k] instanceof File){
                if(!out.files){
                    out.files = new FormData();
                }
                out.files.set(k, this.update[k], this.update[k].name);
            }else{
                if(!out.data){
                    out.data = {};
                }
                out.data[k]=this.update[k];
            }
        })
        return out;
    }

    get f() { return this.addForm.controls; }
    get v() { return this.addForm.value; }
    get upd_length() { return Object.keys(this.update).length }
}