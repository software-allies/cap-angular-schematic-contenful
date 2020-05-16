import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapContentfulService, ConfigService } from 'cap-angular-contentful';


@Injectable({
    providedIn: 'root'
})
export class ContentfulService extends CapContentfulService {
  constructor (private http:HttpClient, private configService:ConfigService){
    super(http, configService)
  }
}
