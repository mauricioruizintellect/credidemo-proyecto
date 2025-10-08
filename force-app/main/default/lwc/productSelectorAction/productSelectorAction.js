import { LightningElement } from 'lwc';
import searchProducts from '@salesforce/apex/ProductSelectorController.searchProducts';

const DEBOUNCE_DELAY = 1500;
export default class ProductSelectorAction extends LightningElement {
   searchKey = '';
   timeOutId;

   products = [];

   columns = [
    {label: 'Nombre Producto', fieldName:'Name'},
    {label: 'Código Producto', fieldName:'ProductCode'},
    {label: 'Descripción Producto', fieldName:'Description'}
   ];

   isLoading = false;

    async handleSearchKeyChange(event){
        this.searchKey = event.target.value;
        window.clearTimeout(this.timeOutId);
        this.isLoading = true;
        this.timeOutId = setTimeout( async()  => {
            if(this.searchKey && this.searchKey.length > 2){
                console.log(this.searchKey);
                this.products = await searchProducts({searchKey : this.searchKey });
                console.log(this.products);
                this.isLoading = false;
            }else{
                this.products = [];
                this.isLoading = false;
            }
        }, DEBOUNCE_DELAY);
    }

    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        console.log(JSON.stringify(selectedRows));
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
            console.log('You selected: ' + JSON.stringify(selectedRows[i]));
        }
    }

}