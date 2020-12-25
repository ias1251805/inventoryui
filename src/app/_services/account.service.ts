import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';
import { Item } from '@app/_models';

const baseUrl = `${environment.apiUrl}` + '/account';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    private itemSubject: BehaviorSubject<Item>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    public get itemValue(): Item {
        return this.itemSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(baseUrl + "/authenticate", { email, password }, { withCredentials: false })
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return this.account;
            }));
    }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: false })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: Account) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Account[]>(`${baseUrl}/get-accounts`,{ withCredentials: false });
    }

    getAllItems() {
        return this.http.get<Item[]>(`${environment.apiUrl}/products/getAllItems`,{ withCredentials: false });
    }

    getItem(UPC: string) {
        return this.http.get<Item>(`${environment.apiUrl}/products/getItemDetailsByUPC?UPC=${UPC}`,{ withCredentials: false });
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/get-account-id?id=${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}