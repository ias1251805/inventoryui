import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Account, Role } from './_models';

import Quagga from 'quagga';
@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['./app.component.scss'] })
export class AppComponent {
    Role = Role;
    account: Account;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }

    handleQuogga(){Quagga.stop();
    }
}