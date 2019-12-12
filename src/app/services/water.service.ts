import { News, Doc, Prop, UploadTypes, DocTypes, Rate, ClientTypes, Contact, BaseEntity, Vacancy, DocType } from './models';
import { Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadService } from './load.service';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';


@Injectable()
export class WaterService{
    
    baseUrl:string=`${environment.base_url}WaterController.php?`;
    constructor(private http: HttpClient, private ls:LoadService, private us:UserService ){

    }

    

    getNews(){
      return this.http.get<News[]>(this.baseUrl + 'Key=get-news');
    }

    getVacancies(){
      return this.http.get<Vacancy[]>(this.baseUrl + 'Key=get-vacancies');
    }

    getQuestions(lim:number = null){
      return this.http.get<{Count:number, Questions:BaseEntity[]}>(this.baseUrl + 'Key=get-questions&Limit='+lim);
    }

    search(str){
      return this.http.get<any>(this.baseUrl + 'Key=search&SearchString='+str);
    }

    getLimitNews(lim:number){
      return this.http.get<News[]>(this.baseUrl + 'Key=get-news&Limit='+lim);
    }

    getProps(){
      return this.http.get<Prop[]>(this.baseUrl + 'Key=get-props');
    }

    getDocs(){
      return this.http.get<Doc[]>(this.baseUrl + 'Key=get-docs');
    }

    getTypeDocs(types){
      return this.http.post<Doc[]>(this.baseUrl + 'Key=get-type-docs',types);
    }

    getDocTypes(info = null){
      return this.http.get<any>(this.baseUrl + 'Key=get-doc-types&Info='+info);
    }

    getRates(type:ClientTypes){
      return this.http.get<Rate[]>(this.baseUrl + 'Key=get-rates&Type='+type);
    }

    getContacts(){
      return this.http.get<Contact[]>(this.baseUrl + 'Key=get-contacts');
    }

    getImportantDocs(){
      return this.http.get<Doc[]>(this.baseUrl + 'Key=get-important-docs');
    }

    getProp(name:string){
      return this.http.get<Prop>(this.baseUrl + 'Key=get-prop&Name='+name);
    }

    addApp(app){
      return this.http.post(this.baseUrl + 'Key=add-app', app);
    }

    /**
     * Загрузка файлов на сервер
     * @param id Id родителя изображения
     * @param type тип родителя изображения
     * @param data изображение (FormData)
     */
    UploadFile(id, type:UploadTypes, data) {
      return this.http.post<any>(this.baseUrl + 'Key=upload-file&Id='+id+'&Type='+type+'&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), data, {
        reportProgress:true,
        observe:'events'
      });
    }

    addDocType(type){
      return this.http.post<DocType>(this.baseUrl + 'Key=add-doc-type&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), type);
    }

    updateDocType(type){
      return this.http.post<number>(this.baseUrl + 'Key=update-doc-type&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), type);
    }

    addNews(news){
      return this.http.post<News>(this.baseUrl + 'Key=add-news&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), news);
    }
    updateUrl(url){
      return this.http.post<any>(this.baseUrl + 'Key=update-url&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), url);
    }
    addDoc(doc){
      return this.http.post<number>(this.baseUrl + 'Key=add-doc&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), doc);
    }

    updateNews(news){
      return this.http.post<number>(this.baseUrl + 'Key=update-news&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), news);
    }

    addPrice(price){
      return this.http.post<number>(this.baseUrl + 'Key=add-price&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), price);
    }

    updatePrice(price){
      return this.http.post<number>(this.baseUrl + 'Key=update-price&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), price);
    }

    updateDoc(doc){
      return this.http.post<number>(this.baseUrl + 'Key=update-doc&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), doc);
    }

    addQuestion(q){
      return this.http.post<number>(this.baseUrl + 'Key=add-question&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    updateQuestion(q){
      return this.http.post<number>(this.baseUrl + 'Key=update-question&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    addVacancy(q){
      return this.http.post<number>(this.baseUrl + 'Key=add-vacancy&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    updateVacancy(q){
      return this.http.post<number>(this.baseUrl + 'Key=update-vacancy&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    addContact(q){
      return this.http.post<number>(this.baseUrl + 'Key=add-contact&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    updateContact(q){
      return this.http.post<number>(this.baseUrl + 'Key=update-contact&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password), q);
    }

    removeNews(id, images){
      return this.http.delete<number>(this.baseUrl + 'Key=remove-new&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password)+'&Id='+id+'&Images='+images);
    }

    removeQuestion(id){
      return this.http.delete<number>(this.baseUrl + 'Key=remove-question&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password)+'&Id='+id);
    }

    removeItem(id, table){
      return this.http.delete<number>(this.baseUrl + 'Key=remove-item&Login='+encodeURIComponent(this.us.user.Login)+'&Password='+encodeURIComponent(this.us.user.Password)+'&Id='+id+'&Table='+table);
    }
    
}



