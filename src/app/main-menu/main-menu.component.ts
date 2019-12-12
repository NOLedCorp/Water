import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WaterService } from '../services/water.service';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.less']
})
export class MainMenuComponent implements OnInit {

  showMenu = false;
  constructor( private ws:WaterService, private router:Router, private ls:LoadService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      if(this.showMenu){
        this.show();
      }
      
     });
  }

  show(){
    this.showMenu = !this.showMenu;
  }
  search(str){
    this.ls.showLoad = true;
    this.ws.search(str).subscribe(res => {
      console.log(res);
      sessionStorage.setItem('searchResultWater', JSON.stringify(res));
      this.ls.showLoad = false;
      this.router.navigate(['/search'], 
      {
        queryParams:{
            'searchStr': str
        }
    });
    })
  }
  searchBtn(e, str){
    if(e.key=='Enter'){
      this.search(str);
    }
  }

}
