import { Component, ElementRef, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';

import { AccountService } from '@app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Item, ItemDetails } from '@app/_models';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';


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


    public itemDetailsModalTotalStock: number;
    public itemDetailsModalItemId: number;
    public itemDetails: ItemDetails[];
    public itemDetailsModalAddingStatus: boolean;
    public expirationDates: string[] = [];
    public processingAddDatabase: boolean;

    value: string;



    items$: Observable<Item[]>;
    formFilter: FormGroup;

    constructor(private accountService: AccountService,private fb: FormBuilder, private modalService: NgbModal,public datepipe: DatePipe) { }

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
                brandName: [''],
                expirationDateSelect: [''],
                quantityAdd: [''],
                sellingPrice: [''],
                category: ['']
               });
    }

   

    openVerticallyCentered(content) {      
       
        this.modalService.open(content, { centered: true });
      }

      openAddEditCentered(content){
        this.modalService.open(content, { centered: true });
      }


      getTotalQuantity(itemDetails: ItemDetails[]){
        let totalQuantity = 0;

        for(let data of itemDetails){
            totalQuantity += Number(data.quantity);
        }
        return totalQuantity;
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

        
        this.itemDetailsModalAddingStatus = true;
        this.imageSrcModal = item.largeImage;
        this.itemDescription = item.shortDescription;
        this.itemDetailsModalTotalStock = -1;
        this.expirationDates = [];
        this.processingAddDatabase = false;
        
        if(item.itemDetails){
            this.itemDetailsModalTotalStock = this.getTotalQuantity(item.itemDetails);
            this.itemDetails = item.itemDetails;
           
            for (let itemDetails of this.itemDetails) {                
                let counter: number = 0;
                counter = counter +1;
                if (itemDetails.expirationDate != null) {   
                    this.expirationDates.push('ID: ' + itemDetails.item_id + '-' + counter + ' | Exp Date: ' + this.datepipe.transform(itemDetails.expirationDate, 'MM-dd-yyyy') + ' | ' +  'Stock: ' + itemDetails.quantity);
                }
            }      

           
           
        }
        
        this.itemDetailsModalItemId = item.itemId

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
            brandName: item.brandName
            

           });

           if(item.itemDetails){
            this.editItemForm.patchValue({
                sellingPrice: item.sellingPrice,
            category: item.category.name?item.category.name:''
                
    
               });
            
           }
           
         


           this.formItemDetails.name.disable();
           this.formItemDetails.salePrice.disable();
           this.formItemDetails.upc.disable();
           this.formItemDetails.brandName.disable();
           this.formItemDetails.shortDescription.disable();
           this.formItemDetails.sellingPrice.disable();
           this.formItemDetails.category.disable();
       
        }

        onSubmit() {
            this.modalService.dismissAll();
            console.log("res:", this.editItemForm.getRawValue());
           }


        addingItemToDB(){
            this.processingAddDatabase = true;
            this.formItemDetails.sellingPrice.setValue("");
            
            this.formItemDetails.sellingPrice.enable();
            
        }

}