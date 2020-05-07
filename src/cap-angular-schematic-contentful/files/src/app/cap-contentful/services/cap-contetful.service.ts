import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class CapContentfulService {

    private actionUrl: string;
    private httpOptions: any;

    constructor(
        private _http: HttpClient, 
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({ 
                'Authorization': `Bearer ${environment.contAccessToken}`,
                'Content-Type': 'application/vnd.contentful.delivery.v1+json'
            }),
            observe: "response"
        };
        this.actionUrl = `https://cdn.contentful.com/spaces/${environment.contSpace}/environments/${environment.contentfulEnvironment}/`;
    }

    responseWithRelatedAssets(response: any, relatedAssetKey: string[]): any {
        if (!response.includes || 
            !response.includes.Asset ||
            !response.items) {
            return response;
        }
        const includes = response.includes.Asset;
        const items = response.items;

        // By each item must be know his related Asset
        let newItems = [];
        items.map(item => {
            relatedAssetKey.map(key => {
                // Search and replace by a include file
                let file = includes.filter(a => a.sys.id === item.fields[key].sys.id)[0].fields;
                const fileClone = file;
                file = file.file;            
                file['title'] = fileClone.title || '';
                file['description'] = fileClone.description || '';
                item.fields[key] =  {...item.fields[key], file};
                newItems = [...newItems, item];
            });
        });
        response.items = newItems;
        return response.items;
    }

    getItem(contentType: string, relatedAssetKey?: string[]): Observable<any> {
        const _url = `${this.actionUrl}entries?content_type=${contentType}`;
        return this._http.get<any>(_url, this.httpOptions)
        .pipe(
            map((response: any) => response.body),
            tap((response: any) => {
                if (relatedAssetKey) {
                    return this.responseWithRelatedAssets(response, relatedAssetKey);
                } else {
                    return response;
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getItemById(contentType: string, id: string, relatedAssetKey?: string[]): Observable<any> {
        const _url = `${this.actionUrl}entries?content_type=${contentType}&fields.id=${id}`;
        return this._http.get<any>(_url, this.httpOptions)
        .pipe(
            map((response: any) => response.body),
            tap((response: any) => {
                if (relatedAssetKey) {
                    return this.responseWithRelatedAssets(response, relatedAssetKey);
                } else {
                    return response;
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    private handleError(error: any) {
        console.error(error);
        return throwError(error || 'Server error');
    }
}
