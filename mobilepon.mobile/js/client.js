var g_Client;

function Client(parentObject) {
    var $parentObject = $(parentObject);
    var _currentClient=null;
    this.GetCurrentClient = function () {
        return _currentClient;
    }

    var categoryID;
    var isDeviceReady = false;

    this.LoadClients = function () {

        if (isTest == 1) {
            g_CurrentPosition = new Object();
            g_CurrentPosition.coords = new Object();
            g_CurrentPosition.coords.latitude = 26.4267359;
            g_CurrentPosition.coords.longitude = -80.145928;
            GetClientListByPosition(g_CurrentPosition);
        }
        else {

            document.addEventListener("deviceready", onClientListDeviceReady, false);
            if (g_CurrentPosition != null)
                GetClientListByPosition(g_CurrentPosition);
        }
    }

    var onClientListDeviceReady = function () {
        isDeviceReady = true;
        navigator.geolocation.getCurrentPosition(GetClientListByPosition, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    }

    this.LoadFavoriteClient = function (userID) {
        $.mobile.loading('show');
        var jsonUrl = ServiceUrlRoot + "GetFavoriteClient.ashx?UserID=" + userID;
        $.getJSON(jsonUrl, function (clientLists) {
            var tplName = "#tplClientLists";
            var template = Handlebars.compile($(tplName).html());

            $parentObject.empty();
            $parentObject.append(template(clientLists));
            if(clientLists.length==0)
                $("#liNoRecord").html("You do not have any favorite business. To add business to your favorites, find the business and click on Add to Favorite button.");
            $parentObject.listview('refresh');
            var withA = Number($("#listViewClientLists>li>a").prop('clientWidth'));
            $(".content").width(withA - 74);
            $(".PrimaryOffer .BodyContent1").css("max-width", withA - 70);
            $.mobile.loading('hide');
        });
    }


    this.LoadMoreClients = function () {
        var latitude = g_Application.Latitude;
        var longitude = g_Application.Longitude;

        var jsonUrl = ServiceUrlRoot + "GetClientListByLocation.ashx?pageNo="+g_PageNo+"&latitude=" + latitude + "&longitude=" + longitude + "&userID=" + g_Application.UserID + "&categoryID=" + g_CategoryID + "&searchTerm=" + g_SearchTerm;
        $.mobile.loading('show');

        $.getJSON(jsonUrl, function (clientLists) {
            g_PageNo++;
            var tplName = "#tplClientLists";
            var template = Handlebars.compile($(tplName).html());
            $parentObject.append(template(clientLists));
            $parentObject.listview('refresh');

            var withA = Number($("#listViewClientLists>li>a").prop('clientWidth'));
            $(".content").width(withA - 74);
            $(".PrimaryOffer .BodyContent1").css("max-width", withA - 70);
            $.mobile.loading('hide');
        });
    };


    this.LoadClientImages = function (userID) {
        var jsonUrl = WebsiteRoot + "Merchant/GetClientImages";

        $.post(jsonUrl, "ClientID=" + userID, function (clientImages) {

            if (clientImages.length > 0) {
                var tplName = "#tplClientImages";
                var template = Handlebars.compile($(tplName).html());
                $parentObject.empty();
                $parentObject.append(template(clientImages));

                var contentHeight = $(window).height();
                var contentWidth = $(window).width();

                $("#slider1_container").css("width", contentWidth + "px");
                $("#slidersContainer").css("width", contentWidth + "px");
                $("#slider1_container").css("height", contentHeight - 100 + "px");
                $("#slidersContainer").css("height", contentHeight - 100 + "px");

                //var padtop = (contentHeight - contentWidth) / 2 + "px";
                //$("#imageContent").css("padding-top", padtop);

                var slider = new ClientImageSlider();
                slider.BeginSlider();
            }
        });
    }


    var GetClientListByPosition = function (myPosition) {

        //        g_Application.CurrentLocation = myPosition.coords;

        var latitude = myPosition.coords.latitude;
        var longitude = myPosition.coords.longitude;

        g_Application.Latitude = latitude;
        g_Application.Longitude = longitude;

        //latitude = 26.3037927;
        //longitude = -80.1881519;

        var jsonUrl = ServiceUrlRoot + "GetClientListByLocation.ashx?pageNo=1&latitude=" + latitude + "&longitude=" + longitude + "&userID=" + g_Application.UserID + "&categoryID=" + g_CategoryID + "&searchTerm=" + g_SearchTerm;
        $.mobile.loading('show');
        $.getJSON(jsonUrl, function (clientLists) {
            var tplName = "#tplClientLists";
            var template = Handlebars.compile($(tplName).html());

            $parentObject.empty();
            $parentObject.append(template(clientLists));

            $parentObject.listview('refresh');
            var withA = Number($("#listViewClientLists>li>a").prop('clientWidth'));
            $(".content").width(withA - 74);
            $(".PrimaryOffer .BodyContent1").css("max-width",withA - 70);

            $.mobile.loading('hide');
        });
    };


    var onError = function (error) {
        var position = g_Application.CurrentLocation;
        if (position == null) {
            ApplicationAlert("We are not able to determine your location at this moment. Please make sure your turn on  the location service or try again.");
        }
        else {
            ApplicationAlert("We have difficult to determine your location. Your previous location will be used.");
            GetClientListByPosition(position);
        }

    }

    //////////////////// Load Client Detail  ////////////////////

    this.LoadClientByID=function(clientID)
    {
        $.mobile.loading('show');
        $.getJSON(ServiceUrlRoot + "GetClientDetailInfo.ashx?clientID=" + clientID + "&customerID=" + g_Application.UserID, DisplayClientDetail);
    }

    this.ScanBarcode = function () {
        if (g_Application.UserName == "") {
            $.mobile.changePage("login.html");
            return;
        }

        navigator.geolocation.getCurrentPosition(ScanBarcodeFromLocation, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

    }

    var ScanBarcodeFromLocation = function (myPosition) {

        var latitude = myPosition.coords.latitude;
        var longitude = myPosition.coords.longitude;

        if (typeof cordova != "undefined") {
            if ('plugins' in window && 'barcodeScanner' in window.plugins) {
                scanner = window.plugins.barcodeScanner;
            }
            else if ('barcodeScanner' in window) {
                scanner = window.barcodeScanner;
            }
            else if ('cordova' in window) {
                // barcodeScanner 1.0
                if ('plugins' in cordova && 'barcodeScanner' in cordova.plugins) {
                    scanner = cordova.plugins.barcodeScanner;
                    // barcodeScanner 0.7
                } else {

                    scanner = cordova.require("cordova/plugin/BarcodeScanner");
                }
            }

            scanner.scan(
               function (result) {
                   var servicePath = 'ScanBarcode.ashx?callback=callback&CodeContent=' + result.text + '&UserID=' + g_Application.UserID + '&Latitude=' + latitude + '&Longitude=' + longitude;
                   $.getJSON(ServiceUrlRoot + servicePath, DisplayClientDetail);
               },
               function (error) {
                   alert("Scanning failed: " + error);
               }
            );
        }
        else { //for testing purpose in browser (no scanner available);
            var servicePath = 'ScanBarcode.ashx?callback=callback&CodeContent=http://www.yahoo.com&UserID=' + g_Application.UserID;
            $.getJSON(ServiceUrlRoot + servicePath, DisplayClientDetail);
        }
    }

    function DisplayClientDetail(client) {
        _currentClient = client;
        var tplName = "#tplClientDetail";
        var template = Handlebars.compile($(tplName).html());
        var templateResult = template(client);
        $parentObject.empty();
        $parentObject.append(templateResult);
        //FB.XFBML.parse();
        //$.getScript('http://platform.twitter.com/widgets.js');
        //$('#couponListView').listview().listview('refresh');
        $('#loyaltyListView').listview().listview('refresh');
        $('#socialView').listview().listview('refresh');

        if (client.IsFavorite == "1")
        {
            $("#btnAddRemoveFavorite").html("Remove From Favorite");
            $("#btnAddRemoveFavorite").removeClass("ui-icon-addFavorite");
            $("#btnAddRemoveFavorite").addClass("ui-icon-removeFavorite");

            //$("#btnAddRemoveFavorite").attr("src","images/Remove22x22.png");
        }
        else
        {
            $("#btnAddRemoveFavorite").html("Add To Favorite");
            $("#btnAddRemoveFavorite").removeClass("ui-icon-removeFavorite");
            $("#btnAddRemoveFavorite").addClass("ui-icon-addFavorite");

            //$("#btnAddRemoveFavorite").attr("src", "images/addFav24x24.png");
        }
        //$("#testid").button();
        //$("#idRaffle").button();
        $("#idRaffleHistory").button();
        if ($("#idRaffleVisitCount").length > 0) {
            if (client.RaffleCustomerVisitCount > 1)
                $("#idRaffleVisitCount").html("You have visited " + client.RaffleCustomerVisitCount.toString() + " times.");
            else
                $("#idRaffleVisitCount").html("You have visited " + client.RaffleCustomerVisitCount.toString() + " time.");
        }
        //if($("#loyaltyListView div.ProgramName").length>1)
        //    $("#LoyaltyLabel").html("Rewards Programs");
        //else
        //    $("#LoyaltyLabel").html("Rewards Program");

        if (_currentClient.Point > 1)
            $("#rewardPoint").html("Reward Points");
        else
            $("#rewardPoint").html("Reward Point");

        $("#loyaltyListView a>div").each(function () {
            $this = $(this);
            var requiredPoint = $this.attr("requiredPoints");
            if (requiredPoint != undefined) {
                var client = g_Client.GetCurrentClient();
                if (client.Point != null && Number(client.Point) >= Number(requiredPoint)) {
                    $this.removeClass("inActive").addClass("active");
                }
                else {
                    $this.removeClass("active").addClass("inActive");
                }
            }
        });
        $.mobile.loading('hide');
        //$('#couponCollapse').collapsible().collapsible('refresh');
        //$('#loyaltyCollapse').collapsible().collapsible('refresh');
    }

    function DisplayCustomerVistList(customerVisit) {
        var tplName = "#tplCustomerCheckInHistory";
        var template = Handlebars.compile($(tplName).html());
        var templateResult = template(customerVisit);
        $parentObject.empty();
        $parentObject.append(templateResult);

        $('#visitHistory').listview().listview('refresh');
        $.mobile.loading('hide');
    }


    this.LoadCustomerVistList = function (parentID) {
        $parentObject = $(parentID);
        $.mobile.loading('show');

        $.getJSON(ServiceUrlRoot + "GetCustomerVisitHistoryList.ashx?clientID=" + _currentClient.ClientID + "&customerID=" + g_Application.UserID, DisplayCustomerVistList);
    }

}