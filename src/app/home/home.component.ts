import { ChangeDetectorRef, Component, ElementRef, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';

import { AccountService } from '@app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Item, ItemCategory, ItemDetails } from '@app/_models';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import Quagga from 'quagga';
import { BeepService } from './beep.service';

@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.css'] })
export class HomeComponent {
    formSearch: FormGroup;
    searchUPCForm: FormGroup;
    addItemDetailsForm: FormGroup;
    private modalRef1: NgbModalRef;
    private modalRef2: NgbModalRef;
    private modalRefMobile: NgbModalRef;
    public expirationSelect: any = {
        defaultLayout: ''
     }
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
    public isMobileGlobal: boolean;
    public scanFinished: boolean;

    public itemDetailsModalTotalStock: number;
    public itemDetailsModalItemId: number;
    public itemDetails: ItemDetails[];
    public itemDetailsModalAddingStatus: boolean;
    public expirationDates: string[] = [];
    public processingAddDatabase: boolean;
    public currentItem: Item;
    public processingAddItemDetailsDatabase: boolean;
    public searchUPCMobileResult: boolean = true;
    public lastScannedCode: string;
    public lastScannedCodeDate: number;

    value: string;



    items$: Observable<Item[]>;
    formFilter: FormGroup;

    constructor(private changeDetectorRef: ChangeDetectorRef,private beepService: BeepService,private accountService: AccountService,private fb: FormBuilder, private modalService: NgbModal, private activeModal: NgbActiveModal, public datepipe: DatePipe, private alertService: AlertService,private router: Router, private route: ActivatedRoute,private elementRef: ElementRef) { }

    // convenience getter for easy access to form fields
    get f() { return this.formSearch.controls; }
    get formUPCSearch() { return this.searchUPCForm.controls; }
    get formItemDetails() { return this.editItemForm.controls; }
    get formAddItemDetails(){return this.addItemDetailsForm.controls;}



    // Create the QuaggaJS config object for the live stream
	liveStreamConfig = {
        inputStream: {
            type : "LiveStream",
            constraints: {
               
                facingMode: "environment" // or "user" for the front camera
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
        decoder: {
            "readers":[
                {"format":"ean_reader","config":{}}
            ]
        },
        locate: true
    };

    startQuagga(){
        this.scanFinished = false;
        Quagga.init(
			this.liveStreamConfig, 
			function(err) {
				Quagga.start();
            },
            Quagga.onDetected((result) => {
                
                if (result.codeResult.code){
                    let code: string = result.codeResult.code;
                    
                    this.formUPCSearch.upcText.setValue(code);
                    this.onBarcodeScanned(code);
                   // this.searchUPCMobileResult = this.getItemDataUPC();
                    
                    

                    
                }
              
            })
        )};


    stopQuagga(){
        Quagga.stop();
    }

    ngOnInit() {
        let randoms: string[] = this.rand();
        console.log('random' + randoms)

        console.log('duplicated: '+ this.findDuplicates(randoms))

        

        
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
       
        if(this.isMobile()){
            this.searchUPCMobileResult = true;
            this.startQuagga()
            // this.modalRef2.componentInstance.name = 'World';
             this.modalRef2.result.then(res=>{

             },dismiss=>{
                 this.scanFinished = false;
                 if (Quagga){
                     Quagga.stop();	
                 }
             })
        }else{

        }
        
      }


      rand(): string[] {
        let numbers: string[] = [];
        let repeatedNum: number = 0;
        let repeatedNum1: number = 0;
        let repeatedNum2: number = 0;
        for (let i:number = 0; i < 15; i++) {

        

        let randomNum1 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum2 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum3 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum4 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum5 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum6 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum7 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum8 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum9 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum10 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum11 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum12 = String(Math.floor(Math.random() * (9 - 0) + 0));
        let randomNum13 = String(Math.floor(Math.random() * (9 - 0) + 0));
        
        
     
        let randomnumber = randomNum1+randomNum2+randomNum3+randomNum4+randomNum5+randomNum6+randomNum7+randomNum8+randomNum9+randomNum10+randomNum11+randomNum12;
        
        numbers.push(randomnumber)
    }
        numbers.push(numbers[5])
        numbers.push(numbers[4])
        numbers.push(numbers[4])
        numbers.push(numbers[4])
        return numbers;
      }

      

      findDuplicates = (arr) => {
        let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the
        // original array won't be modified)
        let results = [];
        let repeatedCount = 0;
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            
          if (sorted_arr[i + 1] == sorted_arr[i]) {
            repeatedCount = repeatedCount + 1;
            results.push(repeatedCount + '-' + sorted_arr[i]);
          }else{
            repeatedCount = 0;
          }
        }

        let new_sorted_arr = results.slice().sort();
        console.log(new_sorted_arr);
        console.log(new_sorted_arr[new_sorted_arr.length-1])
        return new_sorted_arr[new_sorted_arr.length-1].split("-")[1];
      }


      onBarcodeScanned(code: string) {
       




       
        this.formUPCSearch.upcText.setValue(code);
        // ignore duplicates for an interval of 1.5 seconds
        const now = new Date().getTime();
        if (code === this.lastScannedCode && (now < this.lastScannedCodeDate + 1500)) {
          return;
        }
        this.formUPCSearch.upcText.setValue(code);

        this.beepService.beep();

        this.getItemDataUPC();
    
        this.lastScannedCode = code;
        this.lastScannedCodeDate = now;
        
        this.changeDetectorRef.detectChanges();
        this.scanFinished = false;
      }
    


      isMobile(){
          console.log('Checking if is mobile')
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            this.isMobileGlobal = true;
            return true;
          }else{
            this.isMobileGlobal = false;
            return false;
          }
      }


    // Once a barcode had been read successfully, stop quagga and 
	// close the modal after a second to let the user notice where 
	// the barcode had actually been found.
	


      openAddEditCentered(content){
        this.processingAddItemDetailsDatabase = true;


        this.formAddItemDetails.quantityAdd.setValue("");
        this.formAddItemDetails.addEditExpirationDate.setValue("");

        this.modalRef1 =  this.modalService.open(content, { centered: true });

        this.modalRef1.result.then(res=>{

        },dismiss=>{
            this.scanFinished == false;
        })
      }


      getTotalQuantity(itemDetails: ItemDetails[]){
        let totalQuantity = 0;

        for(let data of itemDetails){
            totalQuantity += Number(data.quantity);
        }
        return totalQuantity;
      }

    getItemDataUPC(): boolean{


        



        this.alertService.info("Searching Item with UPC: " + this.formUPCSearch.upcText.value  );
        let errorResponse: string;

        this.accountService.getItem(this.formUPCSearch.upcText.value)
        .pipe(first())
        .subscribe({
            next: (resp: any) => {
                
                
         this.itemSearch = resp

            
         this.openModal(this.detailgrid, this.itemSearch);
         this.formUPCSearch.upcText.setValue("");
        return true;

        //if(this.isMobile()){
         //  this.modalRef2.dismiss();
       // }
        
            },
            error: error => {
                this.alertService.error("UPC not found" );
                this.loading = false;
                //this.scanFinished = false;
                return false;

            }
        }  
        
        );
        
        return true;
    }

    openModal(targetModal, item) {
        this.imageSrcModal  = "";
        
        //this.itemDetailsModalAddingStatus = true;
        //this.imageSrcModal = item.largeImage;
        this.itemDescription = item.shortDescription;
        this.itemDetailsModalTotalStock = -1;
        this.expirationDates = [];
        this.processingAddDatabase = false;
        this.currentItem = item;
        if(item.itemDetails){
            this.itemDetailsModalTotalStock = this.getTotalQuantity(item.itemDetails);
            this.itemDetails = item.itemDetails;
            let counter: number = 0;
            for (let itemDetails of this.itemDetails) {                
                
                
                if (itemDetails.expirationDate != null) {  
                    counter = counter +1; 
                    this.expirationDates.push('ID: ' + itemDetails.item_id + '-' + itemDetails.id + ' | Exp Date: ' + this.datepipe.transform(itemDetails.expirationDate, 'MM-dd-yyyy') + ' | ' +  'Stock: ' + itemDetails.quantity);
                }
            }      

           
           
        }
        
        this.itemDetailsModalItemId = item.itemId

        this.modalRef2 = this.modalService.open(targetModal, {
         centered: true,
        // backdrop: 'static',
         size: 'lg'
        });

        this.modalRef2.result.then(res=>{

        },dismiss=>{
            this.scanFinished = false;
        })

        
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


           if(!this.currentItem.largeImage){

            this.accountService.getItemImageByUPC(this.currentItem.upc)
           .pipe(first())
           .subscribe({
               next: (response: any) => {
                   
                this.imageSrcModal = response.largeImage;

               },
               error: error => {
                   this.alertService.error("An error ocurred while retrieving product image");
                   this.loading = false;
               }
           }  
           
           );

           }else{
            this.imageSrcModal = item.largeImage;
           }
           

           
        }

        onSubmit() {
            this.modalService.dismissAll();
            console.log("res:", this.editItemForm.getRawValue());
           }


        addingItemToDB(event){
            this.alertService.clear;
            this.alertService.warn('<b>Add new item to database by entering category and selling price</b>' , { keepAfterRouteChange: true });    
            this.processingAddDatabase = true;
            this.formItemDetails.sellingPrice.setValue("");
            this.formItemDetails.sellingPrice.enable();
            event.srcElement.previousElementSibling.focus();
            
        }


        saveItemData(){
            
            if((this.formItemDetails.sellingPrice.value == "") && (this.formItemDetails.categorySelect.value == "")){
                this.alertService.clear();
                this.alertService.error("Provide selling price and select a category for this item");
                return;
            }

            if(this.formItemDetails.categorySelect.value == ""){
                this.alertService.clear();
                this.alertService.error("Select a category for this item");
                return;
            }

            if(this.formItemDetails.sellingPrice.value == ""){
                this.alertService.clear();
                this.alertService.error("Provide selling price for this item");
                return;
            }

            console.log('Continued')
    
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
                    this.alertService.clear();
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

           let itemDetailsAdded: string;

            console.log('date value: ' + this.formAddItemDetails.addEditExpirationDate.value)
            this.processingAddItemDetailsDatabase = true;
            console.log('Getting item quanityty value: ' + Number(this.formAddItemDetails.quantityAdd.value))

            if((this.formAddItemDetails.quantityAdd.value == "" || Number(this.formAddItemDetails.quantityAdd.value) <=0 ) ){
                this.alertService.clear();
                this.alertService.error("Provide quantity ");
                return;
            }

            if((this.formAddItemDetails.quantityAdd.value == "") && (this.formAddItemDetails.addEditExpirationDate.value == "")){
                this.alertService.clear();
                this.alertService.error("Provide quantity or expiration date");
                return;
            }
            


           
            console.log(this.datepipe.transform(this.formAddItemDetails.addEditExpirationDate.value,"yyyy-MM-dd'T'HH:mm:ss.SSS")); //output : 2018-02-13



            let itemDetails = new ItemDetails(this.formAddItemDetails.quantityAdd.value,this.datepipe.transform(this.formAddItemDetails.addEditExpirationDate.value,"yyyy-MM-dd"),this.currentItem.itemId,"2" );

            this.accountService.addItemDetailsDB(itemDetails)
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    itemDetailsAdded = response.itemDetailsId;
                this.processingAddItemDetailsDatabase = false;
                if(this.formAddItemDetails.addEditExpirationDate.value != ""){
                    this.alertService.success('Item ID: <b>' + itemDetailsAdded + '</b> was added successfully' , { keepAfterRouteChange: true });    
                }else{
                    this.alertService.success('Item was added successfully' , { keepAfterRouteChange: true });    
                }
                
                    //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    //this.router.navigateByUrl(returnUrl);
                    

                   
                    
                    //this.modalService.dismissAll();
                    this.ngOnInit()
                    this.accountService.getItem(this.currentItem.upc)
                    .pipe(first())
                    .subscribe(resp => {
            
                    this.itemSearch = resp
                    this.currentItem = resp
                    this.processingAddItemDetailsDatabase = false;
                    
                    
                    if(this.formAddItemDetails.addEditExpirationDate.value != ""){
                        this.wait(3000)

                    }else{
                        this.wait(2000)
                        
                    }
                    
                    
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
            //this.processingAddItemDetailsDatabase = false;
            //this.alertService.success('Item added successfully. ID: ' + itemDetailsAdded, { keepAfterRouteChange: true });

            
        }

        moveEnter(event) {
            console.log('entering')
           // if (event.keyCode === 13) {
            event.srcElement.nextElementSibling.focus();
                //this.elementRef.nativeElement.focus();
            //}
        }
             

        truncateText(str: string, n:number){
            return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
          };
        

}