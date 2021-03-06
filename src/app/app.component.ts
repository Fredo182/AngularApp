import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';

import { Product } from './shared/http/models/Product';
import { Company } from './shared/http/models/Company';
import { Seller } from './shared/http/models/Seller';
import { DataService } from './shared/http/crud-service/data.service';
import { TableMap } from './shared/http/table-map';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    //Private members
    private unsub: Subject<void> = new Subject<any>();
    
    //Public members
    products: Product[] = [];
    companies: Company[] = [];
    sellers: Seller[] = [];
    title = 'dynamic crud service';


    constructor(public DS: DataService){}

    ngOnInit():void {}

    /**
     * First we subscribe to a subject in the DataService's subject map that corresponds with the table that we are concerned with.
     * This subscription will handle the receiving of any read data.
     * Then we make calls to this.DS.read with the table TS model to actually read the data.
     * Because we are subscribed to the subject, any time we read the data again we will hydrate our front end because of the Subject.
     */
    readWithSubjects(){

        // Subscribe to All Products in map container
        this.DS.subjectMap[TableMap.Products].many
            .pipe(takeUntil(this.unsub))
            .subscribe(
                res => {
                    this.products = res;
                },
                err => console.error(err)
            );

        // Subscribe to All companies in map container
        this.DS.subjectMap[TableMap.Companies].many
            .pipe(takeUntil(this.unsub))
            .subscribe(
                res => {
                    this.companies = res;
                },
                err => console.error(err)
            );
        // Subscribe to All Sellers in map container
        this.DS.subjectMap[TableMap.Sellers].many
            .pipe(takeUntil(this.unsub))
            .subscribe(
                res => {
                    this.sellers = res;
                },
                err => console.error(err)
            )
        //Call the read on Product Model
        this.DS.read(Product);
        this.DS.read(Company);
        this.DS.read(Seller);
    }

    /**
     * First we create an observable for each data type we are interested in.
     * Then we use the forkJoin to subscribe and wait for all observables to complete before continuining.
     * Once we get a result, we spread the results into our component's local properties.
     * This gives us more flexiblity for waiting for all results to complete before continuining (similar to async-await).
     */
    readWithObs(){
        const productObs = this.DS.readObs(Product);
        const companyObs = this.DS.readObs(Company);
        const sellerObs = this.DS.readObs(Seller);

        forkJoin([productObs, companyObs, sellerObs])
            .pipe(takeUntil(this.unsub))
            .subscribe(
                (res: any) => {
                    this.products = res[0];
                    this.companies = res[1];
                    this.sellers = res[2];
                },
                err => console.error(err)
            );
    }
    
    /**
     * First we generate a promise for each one of our data types.
     * We then can either query all asynchonously with Promise.all or add an await to wait for each to complete 1 by 1.
     * If we await each readPromise, then the productPromise will be a JSON array, otherwise it will be a promise
     * After we get the results, we assign them to our component's local properties.
     */
    async readWithPromise(){
        const productPromise = this.DS.readPromise(Product);
        const companyPromise = this.DS.readPromise(Company);
        const sellerPromise = this.DS.readPromise(Seller);

        const [productRes, companyRes, sellerRes] = await Promise.all([productPromise, companyPromise, sellerPromise]);

        this.products = productRes;
        this.companies = companyRes;
        this.sellers = sellerRes;
    }

    switchReadMethod(event: Event, tabName: String) {
        this.products = [];
        this.companies = [];
        this.sellers = [];
        this.unsub.next();

        switch (tabName) {
            case 'subject':
                this.readWithSubjects();
                break;
            case 'observable':
                this.readWithObs();
                break;
            case 'promise':
                this.readWithPromise();
                break;
            default:
                break;
        }
    }

    ngOnDestroy(){
        this.unsub.next();
        this.unsub.complete();
    }


}
