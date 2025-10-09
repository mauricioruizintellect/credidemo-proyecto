import { LightningElement,api } from 'lwc';
import searchProducts from '@salesforce/apex/ProductSelectorController.searchProducts';
import updateProduct from '@salesforce/apex/ProductSelectorController.updateProduct';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from 'lightning/actions';
import {notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { updateRecord } from "lightning/uiRecordApi";

const DEBOUNCE_DELAY = 1500;
export default class ProductSelectorAction extends LightningElement {
    @api recordId;
    @api objectApiName;
   searchKey = '';
   timeOutId;

   products = [];

   columns = [
    {label: 'Nombre Producto', fieldName:'Name'},
    {label: 'Código Producto', fieldName:'ProductCode'},
    {label: 'Descripción Producto', fieldName:'Description'}
   ];

   isLoading = false;

   selectedProductId = '';

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
        console.log(JSON.stringify(selectedRows[0].Id));
        this.selectedProductId = selectedRows[0].Id;
    }


    async saveProduct(){
        if(this.selectedProductId == '' || this.selectedProductId == null){
            this.showNotification('Campos Requeridos','Debe Seleccionar un Producto antes de guardar','error');
            return null;
        }
        try {
            this.isLoading = true;
            await updateProduct({
                recordId: this.recordId,
                productId: this.selectedProductId,
                objectName: this.objectApiName
            });
            this.isLoading = false;
            this.showNotification('Actualizado','Producto asignado exitosamente','success');
            this.closeQuickAction();
            this.refreshPage();
        } catch (error) {
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.showNotification('error','Error al guardar el producto','error');
        }
    }

    updateProductByLWC(){
        if(this.selectedProductId == '' || this.selectedProductId == null){
            this.showNotification('Campos Requeridos','Debe Seleccionar un Producto antes de guardar','error');
            return null;
        }
        this.isLoading = true;
        const fields = {};
        fields["Id"] = this.recordId;
        if(this.objectApiName == 'Lead'){
            fields["ProductoInteres__c"] = this.selectedProductId;
        }
        if(this.objectApiName == 'Opportunity'){
            fields["ProductoInteresProspecto__c"] = this.selectedProductId;
        }
        const recordInput = { fields };

        updateRecord(recordInput)
        .then(() => {
            this.isLoading = false;
            this.showNotification('Actualizado','Producto asignado exitosamente','success');
            this.closeQuickAction();
            this.refreshPage();
        })
        .catch((error) => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.showNotification('error','Error al guardar el producto','error');
        });
    }

    showNotification(title,message,variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(evt);
    }

    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    refreshPage() {
        notifyRecordUpdateAvailable([{recordId: this.recordId}]);
    }

}