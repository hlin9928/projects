function BarcodeDetail(parentObject) {
    var $parentObject = $(parentObject);

    this.DisplayBarcodeByCodeID=function(code) {
        var servicePath = 'GetBarcodeInfo.ashx?callback=callback&Barcode=' + code;
        $.getJSON(ServiceUrlRoot + servicePath, displayBarcodeInfo);
    }

    function displayBarcodeInfo(barcodeInfo) {
        var tplName = "#tpl" + barcodeInfo.OfferTypeCode + "Detail";
        var template = Handlebars.compile($(tplName).html());
        var templateResult = template(barcodeInfo);
        $parentObject.empty();
        $parentObject.append(templateResult);
    }
}