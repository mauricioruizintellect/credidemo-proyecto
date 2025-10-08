import { LightningElement } from 'lwc';
import searchProducts from '@salesforce/apex/ProductSelectorController.searchProducts';

const DEBOUNCE_DELAY = 1500;
export default class ProductSelectorAction extends LightningElement {
   searchKey = '';
   timeOutId;

    async handleSearchKeyChange(event){
        this.searchKey = event.target.value;
        window.clearTimeout(this.timeOutId);
        this.timeOutId = setTimeout( async()  => {
            if(this.searchKey && this.searchKey.length > 2){
                console.log(this.searchKey);
                const result = await searchProducts({searchKey : this.searchKey });
                console.log(result);
            }
        }, DEBOUNCE_DELAY);
    }

}