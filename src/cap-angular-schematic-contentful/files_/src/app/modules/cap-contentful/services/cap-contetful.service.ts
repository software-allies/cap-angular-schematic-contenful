import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { CapContentfulService } from 'cap-angular-contentful';


@Injectable({
    providedIn: 'root'
})
export class ContentfulService extends CapContentfulService {

    constructor() {
    }

    private handleError(error: any) {
        console.error(error);
        return throwError(error || 'Server error');
    }
}
