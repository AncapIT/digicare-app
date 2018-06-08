import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {ApiService} from '../../app/api.service';
import {TranslateService} from '@ngx-translate/core';
import {Network} from "@ionic-native/network";


@Component({
    selector: 'page-internet-down',
    templateUrl: 'internet-down.html',
    providers: [ApiService, TranslateService]
})
export class InternetDownPage {

    public isExcluded:boolean=true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private network: Network,
                ) {

    }


    tryAgain() {
        if(this.network.type!="none"){
            this.navCtrl.pop();
        }
    }

}

 
