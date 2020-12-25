﻿
import { ItemCategory } from './itemCategory';
import { ItemDetails } from './itemDetails';
export class Item {
    itemId: string;
    name: string;
    msrp: string;
    salePrice: string;
    upc: string;
    shortDescription: String;
    brandName: string;
    thumbnailImage: string;
    mediumImage: string;
    largeImage: string;
    quantity: string;
    itemDetails: ItemDetails[];
    category: ItemCategory; 
}