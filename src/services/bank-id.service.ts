/**
 * Created by ys on 28-Feb-18.
 */
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
//import {VALUES} from "../models/api-values";
import {Observable} from "rxjs/Rx";
import {catchError} from "rxjs/operators";
import { ApiService } from '../app/api.service';

@Injectable()
export class BankIdService {

    //API_URL:string=VALUES.API_URL;
    API_URL:string = this.apiService.api_host;

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }


    public getRedirectUrl(personNumber:number): Observable<any> {

        let body = new HttpParams();
        body=body.append("personNumber",personNumber.toString());
        let headers= new HttpHeaders().append("Content-Type","application/x-www-form-urlencoded");
        return this.http.post(this.API_URL+"get_redirect_url",
            body.toString(),
            {headers:headers})
            .pipe(
                catchError(this.handleError)
            )
    }

    public login(personNumber:number,sessionId:string): Observable<any> {
        let body = new HttpParams();
        body=body.append("personNumber",personNumber.toString());
        body=body.append("sessionId",sessionId);
        let headers= new HttpHeaders().append("Content-Type","application/x-www-form-urlencoded");
        return this.http.post(this.API_URL+"login_bank_id",
            body.toString(),
            {headers:headers})
            .pipe(
                catchError(this.handleError)
            )
    }

    private handleError (error: Response | any) {
        console.log(error,"HTTP");
        let errMsg="";
        if (error instanceof Response) {
            const body = error.json() || '';
            console.error("body",body);
            errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("errMessage:",errMsg);
        return Observable.throw(error);
    }
}