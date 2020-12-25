import { Component, ElementRef, PipeTransform, TemplateRef, ViewChild } from '@angular/core';

import { AccountService } from '@app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Item } from '@app/_models';
import { Observable } from 'rxjs';




@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.css'] })
export class HomeComponent {
    formSearch: FormGroup;
    searchUPCForm: FormGroup;


    
    @ViewChild('editItemModal', {static: false})


    private detailgrid: TemplateRef<any>;
    account = this.accountService.accountValue; 
    title = 'modal2';
    editItemForm: FormGroup;
    imageSrcModal: '';
    itemDescription: ''
    itemList: any[];
    public itemSearch: Item;
    value: string;



    items$: Observable<Item[]>;
    formFilter: FormGroup;

    constructor(private accountService: AccountService,private fb: FormBuilder, private modalService: NgbModal) { }

    // convenience getter for easy access to form fields
    get f() { return this.formSearch.controls; }
    get formUPCSearch() { return this.searchUPCForm.controls; }
    get formItemDetails() { return this.editItemForm.controls; }

    ngOnInit() {
        
        this.formSearch = this.fb.group({
            searchtxt: ['']
        });

        this.searchUPCForm = this.fb.group({
            upcText: ['']
        });
        
        this.accountService.getAllItems()
            .pipe(first())
            .subscribe(itemList => this.itemList = itemList);

            this.editItemForm = this.fb.group({
                name: [''],
                msrp: [''],
                salePrice: [''],
                upc: [''],
                shortDescription: [''],
                brandName: ['']
               });
    }

    openVerticallyCentered(content) {
        
       
       
        this.modalService.open(content, { centered: true });
      }

    getItemDataUPC(){
        this.accountService.getItem(this.formUPCSearch.upcText.value)
        .pipe(first())
        .subscribe(resp => {

         this.itemSearch = resp


         this.openModal(this.detailgrid, this.itemSearch);
         this.formUPCSearch.upcText.setValue("");
        });
        
    }

    openModal(targetModal, item) {

        
        this.imageSrcModal = item.largeImage;
        this.itemDescription = item.shortDescription;
        this.modalService.open(targetModal, {
         centered: true,
         backdrop: 'static',
         size: 'lg'
        });

       
        
        this.editItemForm.patchValue({
            name: item.name,
            msrp: item.msrp,
            salePrice: item.salePrice,
            upc: item.upc,
            shortDescription: item.shortDescription,
            brandName: item.brandName,
            

           });
           this.formItemDetails.name.disable();
           this.formItemDetails.salePrice.disable();
           this.formItemDetails.upc.disable();
           this.formItemDetails.brandName.disable();
           this.formItemDetails.shortDescription.disable();
       
        }

        onSubmit() {
            this.modalService.dismissAll();
            console.log("res:", this.editItemForm.getRawValue());
           }
}