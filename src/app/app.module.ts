import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Формы
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

//Модальные окна
import { ModalModule, BsModalService } from 'ngx-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal.service';

//HTTP запросы
import { HttpClientModule, HttpClient } from '@angular/common/http';

//Компоненты
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LoadService } from './services/load.service';
import { LoadComponent } from './load/load.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FullInfoComponent } from './full-info/full-info.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientRatesComponent } from './client-rates/client-rates.component';
import { InfoComponent } from './info/info.component';
import { BusinessComponent } from './business/business.component';
import { ReferenceBookComponent } from './reference-book/reference-book.component';
import { BuisenessRatesComponent } from './buiseness-rates/buiseness-rates.component';
import { ClientsServicesComponent } from './clients-services/clients-services.component';
import { BusinessServicesComponent } from './business-services/business-services.component';
import { WaterServicesComponent } from './water-services/water-services.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { WaterService } from './services/water.service';
import { UserService } from './services/user.service';
import { AdminComponent } from './admin/admin.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { NewsMainComponent } from './news-main/news-main.component';
import { DocsMainComponent } from './docs-main/docs-main.component';
import { FooterComponent } from './footer/footer.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NewsComponent } from './news/news.component';
import { SearchComponent } from './search/search.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { FaqComponent } from './faq/faq.component';
import { AdminDocsComponent } from './admin-docs/admin-docs.component';
import { ProgSelectComponent } from './prog-select/prog-select.component';
import { DocumentComponent } from './document/document.component';
import { ProgFileInputComponent } from './prog-file-input/prog-file-input.component';
import { AdminContactsComponent } from './admin-contacts/admin-contacts.component';
import { AdminRatesComponent } from './admin-rates/admin-rates.component';

import {CalendarModule} from 'primeng/calendar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdminRateFormComponent } from './admin-rate-form/admin-rate-form.component';
import { RatePipe } from './services/pipes/rate.pipe';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { AdminVacanciesComponent } from './admin-vacancies/admin-vacancies.component';
import { ProgAlertComponent } from './prog-alert/prog-alert.component';

import { AlertModule } from 'ngx-bootstrap';
import { DocPipe } from './services/pipes/doc.pipe';
import { AdminInfoComponent } from './admin-info/admin-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ModalComponent,
    LoadComponent,
    ContactsComponent,
    FullInfoComponent,
    AboutComponent,
    HomeComponent,
    ClientsComponent,
    ClientRatesComponent,
    InfoComponent,
    BusinessComponent,
    ReferenceBookComponent,
    BuisenessRatesComponent,
    ClientsServicesComponent,
    BusinessServicesComponent,
    WaterServicesComponent,
    SignInComponent,
    AdminComponent,
    MainHeaderComponent,
    NewsMainComponent,
    DocsMainComponent,
    FooterComponent,
    FeedbackComponent,
    NewsComponent,
    SearchComponent,
    AddQuestionComponent,
    AdminNewsComponent,
    FaqComponent,
    AdminDocsComponent,
    ProgSelectComponent,
    DocumentComponent,
    ProgFileInputComponent,
    AdminContactsComponent,
    AdminRatesComponent,
    AdminRateFormComponent,
    RatePipe,
    DocPipe,
    VacanciesComponent,
    AdminVacanciesComponent,
    ProgAlertComponent,
    AdminInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    CalendarModule,
    BrowserAnimationsModule,
    AlertModule.forRoot()
  ],
  providers: [FormBuilder, 
    HttpClient, 
    ModalService, 
    BsModalService, 
    LoadService, 
    WaterService, 
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
