public with sharing class ProductSelectorController {


    @AuraEnabled(cacheable = true)
    public static List<Product2> searchProducts(String searchKey){
        List<Product2> resultProducts = new  List<Product2>();
        try {
            System.debug('Esta llegando el valor: '+searchKey);
            return resultProducts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}