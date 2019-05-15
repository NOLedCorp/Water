
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalService } from './modal.service';
import { LoadService } from './load.service';
// import { OnInit } from '@angular/core';

@Injectable()
export class UserService{
    public user;
    baseUrl:string='http://client.nomokoiw.beget.tech/water/';

    constructor(private router:Router, private http: HttpClient, private ls:LoadService){
        // sessionStorage.removeItem('userWaterNar');
        // localStorage.removeItem('userWaterNar');
        if(sessionStorage.getItem('userWaterNar')){
            let u = JSON.parse(sessionStorage.getItem('userWaterNar'));
            this.signIn(u.Email, u.Password).subscribe(data => {
                if(data){
                    data.Password=u.Password;
                    data.IsAdmin=Boolean(Number(data.IsAdmin));
                    this.User = data;
                    this.save();
                }else{
                    sessionStorage.removeItem('userWaterNar');
                    this.router.navigate(['sign']);
                }
                
            })
            
        }
        else if(localStorage.getItem('userWaterNar')){
            let u = JSON.parse(localStorage.getItem('userWaterNar'));
            this.signIn(u.Email, u.Password).subscribe(data => {
                if(data){
                    data.Password=u.Password;
                    data.IsAdmin=Boolean(Number(data.IsAdmin));
                    this.User = data;
                    this.save();
                }else{
                    localStorage.removeItem('userWaterNar');
                    this.router.navigate(['sign']);
                }
            })
            
        }else{
            this.router.navigate(['sign']);
        }
    }

    set User(User){
        this.user = User;
    }

    /**
     * Авторизация пользователя
     * @param email Email пользовтеля
     * @param password Пароль пользователя
     */
    public signIn(email:string, password:string){
        return this.http.get<any>(this.baseUrl + 'UserController.php?Key=get-user&Email='+email+'&Password='+password);
    }

    /**
     * Регистрация пользователя
     * @param user Новый пользователь
     */
    public signUp(user:any){
        return this.http.post<any>(this.baseUrl + 'UserController.php?Key=add-user', user);
    }

    /**
     * Сохрание данных пользователя онлайн
     * @param local сохранение пользователя в localStorage на клиенте
     */
    public save(local = false){
        if(local){
            localStorage.setItem('userWaterNar', JSON.stringify(this.user));
        }
        sessionStorage.setItem('userWaterNar', JSON.stringify(this.user));
    }

    public exit(){
        this.user=null;
        localStorage.removeItem('userWaterNar');
        sessionStorage.removeItem('userWaterNar');
        this.router.navigate(['sign']);
    }
    
    /**
     * Генерация пароля
     */
    GenPassword(){
        let alf = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
        var res = "";
        for(let i = 0; i<10;i++){
            let r = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            if(r > 3 ){
               if(r>6){
                res+=alf[Math.floor(Math.random() * (alf.length-1 - 0 + 1)) + 0].toUpperCase().toString();
               }
               else{
                res+=alf[Math.floor(Math.random() * (alf.length-1 - 0 + 1)) + 0].toString();
               }
               
            }
            else{
                res+=r.toString();
            }
        }
        return res;

    }
}

