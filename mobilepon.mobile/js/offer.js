function Offer(parentObject) {
    var $parentObject = $(parentObject);
    var _currentOffer = null;
    this.GetOffer = function () {
        return _currentOffer;
    }
    this.OfferID = null;
    this.LoadOfferByID = function (offerID) {
        this.OfferID = offerID;
        $.getJSON(ServiceUrlRoot + "GetOfferDetailInfo.ashx?offerID=" + offerID, function (offer) {
            _currentOffer = offer;
            var tplName = "#tpl" + offer.OfferTypeCode + "Detail";
            var template = Handlebars.compile($(tplName).html());
            var templateResult = template(offer);
            $parentObject.empty();
            $parentObject.append(templateResult);
            $("#btnRedeem").button();;
        });
    }

    this.RedeemOfferPoint = function (detailPanelID, receiptPanelID) {

        $.getJSON(ServiceUrlRoot + "RedeemOfferPoint.ashx?UserID=" + g_Application.UserID + "&OfferID=" + this.OfferID, function (CustomerOfferReport) {

            var today=new Date();
            var receipt;
            if(CustomerOfferReport.OfferTypeCode=="Coupon")
            {

                receipt = "This Coupon was used on " + today.toLocaleDateString() + " " + today.toLocaleTimeString();
            }
            else
            {
                receipt = "You redeemed " + CustomerOfferReport.PointsUsed + " points for this reward: " + CustomerOfferReport.OfferName
                    + ". Now you have " + CustomerOfferReport.PointsLeft + " points left.";
            }
            $(detailPanelID).hide();
            $(receiptPanelID).show();
            $(receiptPanelID).find(".redeemCode").html("Confirmation Code:<b>"+ CustomerOfferReport.RedeemConfirmCode+"</b>");
            $(receiptPanelID).find(".message").html(receipt)
        });
    }
}