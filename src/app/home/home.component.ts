import { Component, ElementRef, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';

import { AccountService } from '@app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Item, ItemCategory, ItemDetails } from '@app/_models';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.css'] })
export class HomeComponent {
    formSearch: FormGroup;
    searchUPCForm: FormGroup;
    addItemDetailsForm: FormGroup;
    private modalRef1: NgbModalRef;
    private modalRef2: NgbModalRef;

    loading = false;
    
    @ViewChild('editItemModal', {static: false})


    private detailgrid: TemplateRef<any>;
    account = this.accountService.accountValue; 
    title = 'modal2';
    editItemForm: FormGroup;
    imageSrcModal: '';
    itemDescription: ''
    itemList: any[];
    public itemSearch: Item;
    public categoryList: string[] = ['Food','Beauty','Household','Health','Baby','Personal Care'];



    public itemDetailsModalTotalStock: number;
    public itemDetailsModalItemId: number;
    public itemDetails: ItemDetails[];
    public itemDetailsModalAddingStatus: boolean;
    public expirationDates: string[] = [];
    public processingAddDatabase: boolean;
    public currentItem: Item;
    public processingAddItemDetailsDatabase: boolean;

    value: string;



    items$: Observable<Item[]>;
    formFilter: FormGroup;

    constructor(private accountService: AccountService,private fb: FormBuilder, private modalService: NgbModal, private activeModal: NgbActiveModal, public datepipe: DatePipe, private alertService: AlertService,private router: Router, private route: ActivatedRoute) { }

    // convenience getter for easy access to form fields
    get f() { return this.formSearch.controls; }
    get formUPCSearch() { return this.searchUPCForm.controls; }
    get formItemDetails() { return this.editItemForm.controls; }
    get formAddItemDetails(){return this.addItemDetailsForm.controls;}

    ngOnInit() {
        
        this.formSearch = this.fb.group({
            searchtxt: ['']
        });

        this.searchUPCForm = this.fb.group({
            upcText: ['']
        });


        this.addItemDetailsForm = this.fb.group({
            quantityAdd: [''],
            addEditExpirationDate: ['']
        })
        
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
                category: [''],
                categorySelect: ['']
               });
    }

   

    openVerticallyCentered(content) {    
        
        this.processingAddItemDetailsDatabase = false;  
        this.formUPCSearch.upcText.setValue("");
        this.modalRef2 =this.modalService.open(content, { centered: true });
      }

      openAddEditCentered(content){
        this.processingAddItemDetailsDatabase = true;


        this.formAddItemDetails.quantityAdd.setValue("");
        this.formAddItemDetails.addEditExpirationDate.setValue("");

        this.modalRef1 =  this.modalService.open(content, { centered: true });
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

        
        //this.itemDetailsModalAddingStatus = true;
        this.imageSrcModal = item.largeImage;
        this.itemDescription = item.shortDescription;
        this.itemDetailsModalTotalStock = -1;
        this.expirationDates = [];
        this.processingAddDatabase = false;
        this.currentItem = item;
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

        this.modalRef2 = this.modalService.open(targetModal, {
         centered: true,
         backdrop: 'static',
         size: 'lg'
        });

        this.processingAddItemDetailsDatabase = false;
        //this.alertService.clear();
        this.alertService.success('Item added successfully', { keepAfterRouteChange: true });

        
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


        saveItemData(){

            if((this.formItemDetails.sellingPrice.value == "") && (this.formItemDetails.categorySelect.value == "")){
                //this.alertService.clear();
                this.alertService.error("Provide selling price and select a category for this item");
                return;
            }

            if(this.formItemDetails.categorySelect.value == ""){
               // this.alertService.clear();
                this.alertService.error("Select a category for this item");
                return;
            }

            if(this.formItemDetails.sellingPrice.value == ""){
               // this.alertService.clear();
                this.alertService.error("Provide selling price for this item");
                return;
            }

            
    
            let categoryToAddItey = new ItemCategory(this.formItemDetails.categorySelect.value ,'');
            this.currentItem.sellingPrice=this.formItemDetails.sellingPrice.value;
            this.currentItem.category = categoryToAddItey ;


            //Resetting values after success call to saving Item


            this.accountService.saveItemDB(this.currentItem)
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    console.log(response.itemId);
                    this.itemDetailsModalItemId = response.itemId;
                    this.currentItem.itemId = response.itemId;
                    //this.alertService.clear();
                    this.alertService.success('Item added successfully to Database', { keepAfterRouteChange: true });
                    this.formItemDetails.category.setValue(this.categoryList[Number(this.formItemDetails.categorySelect.value) - 1])
                    this.formItemDetails.sellingPrice.disable();
                    this.itemDetailsModalTotalStock = 0;
                    this.processingAddDatabase = false;

                },
                error: error => {
                    this.alertService.error("An error ocurred");
                    this.loading = false;
                }
            }  
            
            );

            
            
            
        }


        wait(ms){
            var start = new Date().getTime();
            var end = start;
            while(end < start + ms) {
              end = new Date().getTime();
           }
         }

        addItemDetailsDB(){
            if((this.formAddItemDetails.quantityAdd.value == "") ){
                //this.alertService.clear();
                this.alertService.error("Provide quantity ");
                return;
            }

            if((this.formAddItemDetails.quantityAdd.value == "") && (this.formAddItemDetails.addEditExpirationDate.value == "")){
               // this.alertService.clear();
                this.alertService.error("Provide quantity or expiration date");
                return;
            }
            


           
            console.log(this.datepipe.transform(this.formAddItemDetails.addEditExpirationDate.value,"yyyy-MM-dd'T'HH:mm:ss.SSS")); //output : 2018-02-13



            let itemDetails = new ItemDetails(this.formAddItemDetails.quantityAdd.value,this.datepipe.transform(this.formAddItemDetails.addEditExpirationDate.value,"yyyy-MM-dd'T'HH:mm:ss.SSS"),this.currentItem.itemId,"2" );

            this.accountService.addItemDetailsDB(itemDetails)
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    
                   
                    //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    //this.router.navigateByUrl(returnUrl);
                    

                   
                    this.wait(3000)
                    //this.modalService.dismissAll();
                    this.ngOnInit()
                    this.accountService.getItem(this.currentItem.upc)
                    .pipe(first())
                    .subscribe(resp => {
            
                    this.itemSearch = resp
                    this.currentItem = resp
                    this.processingAddItemDetailsDatabase = false;
                    
                    
                    
                    

                    
                    this.modalRef1.close();
                    

                    this.modalRef2.close();
                     this.openModal(this.detailgrid, this.itemSearch);
                     this.formUPCSearch.upcText.setValue("");
                     this.processingAddItemDetailsDatabase = false;
                     //this.alertService.clear();
                     
                     
                     //this.alertService.success('Item added successfully', { keepAfterRouteChange: true });
                     
                     
                    });
                    
                   
                    //this.activeModal.dismiss();
                    //this.activeModal.close();
                },
                error: error => {
                    this.alertService.error("An error ocurred, verify date format is correct mm/dd/yyyy");
                    this.loading = false;
                }

                
            }  
            
            );
            this.processingAddItemDetailsDatabase = false;
            this.alertService.success('Item added successfully', { keepAfterRouteChange: true });

            
        }


        

}