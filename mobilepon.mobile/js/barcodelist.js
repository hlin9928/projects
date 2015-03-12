
$('#barcodeListPage').on('pageinit', function (event) {
    getBarcodeList();

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function (position) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
              'Longitude: ' + position.coords.longitude + '\n' +
              'Altitude: ' + position.coords.altitude + '\n' +
              'Accuracy: ' + position.coords.accuracy + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
              'Heading: ' + position.coords.heading + '\n' +
              'Speed: ' + position.coords.speed + '\n' +
              'Timestamp: ' + position.timestamp + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

});


function getBarcodeList() {

    $.getJSON(ServiceUrlRoot + "GetUserBarcodes.ashx?callback=callback&UserID=" + UserID, function (data) {
        $('#barcodeList li').remove();

        $.each(data, function (index, barcode) {
            var barcodeInfo = barcode.BarcodeInfo;
            var tplName = "#tplSummary_" + barcodeInfo.CurrentBarcode.BarcodeType;
            var template= Handlebars.compile($(tplName).html());
            $('#barcodeList').append(template(barcodeInfo.CurrentBarcode));
        });
        $('#barcodeList').listview('refresh');
    });
}