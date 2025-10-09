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

    @AuraEnabled
    public static void updateProduct(String recordId, String productId, string objectName){
        try {
            if(objectName == 'Lead'){
                Lead currentLead = new Lead(
                    Id = recordId,
                    ProductoInteres__c = productId
                );
                update currentLead;
            }
            if(objectName == 'Opportunity'){
                Opportunity currentOpp = new Opportunity(
                    Id = recordId,
                    ProductoInteresProspecto__c = productId
                );
                update currentOpp;
            }
        } catch (Exception e) {
            System.debug('error::::'+e);
            throw new AuraHandledException(e.getMessage());
        }
    }

}