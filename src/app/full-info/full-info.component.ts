import { Component, OnInit, HostListener } from '@angular/core';
import { WaterService } from '../services/water.service';
import { LoadService } from '../services/load.service';
import { Doc, DocTypes, DocType } from '../services/models';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'full-info',
  templateUrl: './full-info.component.html',
  styleUrls: ['./full-info.component.less']
})
export class FullInfoComponent implements OnInit {
  docs:Doc[];
  curType:string;
  docType:DocType[];
  types = {};
  arOfTypes = [];
  constructor(private ws:WaterService, private ls:LoadService, private router:ActivatedRoute) {
    
   }

  ngOnInit() {
    this.ls.showLoad = true;
    this.ws.getDocTypes(true).subscribe(type=>{
      type.forEach(el => {
        this.arOfTypes.push(el.Id);
        this.types[el.Id] = el.Name;
      });
      this.ws.getTypeDocs(this.arOfTypes).subscribe(docs=>{
        this.docs = docs;
        this.curType = this.docTypes[0];
        this.ls.showLoad = false;
      })
    });
  }

  go(param){
    const element = document.getElementById ( param );
    element.scrollIntoView( !!element );
    this.curType=param;
  }

  getDocs(prop){
    if(this.docs){
      return this.docs.filter(x => x.TypeId == prop);
    }
  }

  get docTypes() { 
    return Object.keys(this.types);
  }

}
