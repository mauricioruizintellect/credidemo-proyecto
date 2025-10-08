public with sharing class ProductSelectorController {


    @AuraEnabled(cacheable = true)
    public static List<Product2> searchProducts(String searchKey){
        List<Product2> resultProducts = new  List<Product2>();
        try {
            System.debug('Esta llegando el valor: '+searchKey);
            resultProducts = [SELECT Id,Name,ProductCode, Family, Description FROM Product2
                              WHERE IsActive = true AND ( Name LIKE :('%' + searchKey + '%') OR ( ProductCode LIKE : ('%' + searchKey + '%')) )];
            return resultProducts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}