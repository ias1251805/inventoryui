import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './_models/item';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, sName:string): any[] {
   
    sName = sName.toLowerCase();
    if(sName===""){
      return value;
    }
    const tempItems:any[]=[];


    for(let i=0;i<=value.length - 1;i++){
      
      let productName:string = value[i].name.toLowerCase();
      let productUPC:string = String(value[i].upc);
      let productCategory:string = value[i].category.name.toLowerCase();
      let productId:string = String(value[i].itemId);
      let productBrandName:string = value[i].brandName?value[i].brandName.toLowerCase():"";
      let productSellingPrice:string = value[i].sellingPrice;
      





      if(Number(sName)>0 && (sName).length<100000){
        if( productId.startsWith(sName)){
          tempItems.push(value[i])
          
        }

        if(productUPC.startsWith(sName)){
        
          tempItems.push(value[i])
        }
        
      }else{
        if(productName.includes(sName) || productUPC.startsWith(sName) || productCategory.match(sName) || productBrandName.includes(sName)){
          tempItems.push(value[i])
        }
      }






    }


    
    return tempItems;
  }

}
