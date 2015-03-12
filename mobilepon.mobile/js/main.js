var isTest = 0;
//$(document).on("pagebeforechange", function (e, data) {
//    alert(data);
//    console.log(JSON.stringify(data));
//    g_MobilePreviousUrl = data.options.absUrl;
//    console.log(data);
//});


//$(document).on('pagecontainerbeforetransition', function (e, data) {
//    alert("pagecontainerbeforetransition");
//    console.log(data);
//});


//$(document).on('pagebeforecreate', '[data-role="page"]', function (e, data) {
//alert("pagebeforecreate");
//console.log(data);
//});

//$(document).on('pagecreate', '[data-role="page"]', function (data) {
//    alert("pagecreate");
//});

$(document).on('pageinit', '[data-role="page"]', function () {
});

//$(document).on('pagebeforeload', '[data-role="page"]', function () {
//    alert("pagebeforeload");
//});

//$(document).ready(function () {
//    $.ajaxSetup({ cache: true });
//});

function refreshPage() {
    $.mobile.changePage(
      window.location.href,
      {
          allowSamePageTransition: true,
          transition: 'none',
          showLoadMsg: false,
          reloadPage: true
      }
    );
}

function logoff() {
    g_Application.UserName = "";
    g_Application.UserID = "";
}

function GetPageName() {
    var pathArray = window.location.pathname.split("/");
    return pathArray[pathArray.length-1];
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hashes[i].slice(hashes[i].indexOf('=')+1);
    }
    return vars;
}

function getUrlVar(key) {
    var vars = getUrlVars();
    if (vars[key] == undefined)
        return "";
    else
        return vars[key];
}

function ApplicationAlert(message) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, "", 'OK');
    } else {
        alert(message);
    }
}
function ApplicationAlertWithTitle(message,title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(message);
    }
}

function ApplicationConfirmWithLabel(title, message, labels, onConfirm) {

    if (navigator.notification) {
        navigator.notification.confirm(
            message,  // message
            onConfirm,              // callback to invoke with index of button pressed
            title,            // title
            labels          // buttonLabels
        )
    } else {
        if (confirm(title ? (title + ": " + message) : message))
            onConfirm(2);
        else
            onConfirm(1);
    }
}

function ApplicationConfirm(title,message, onConfirm) {
    ApplicationConfirmWithLabel(title, message, 'Cancel,Confirm', onConfirm);
}

function ApplyMasterPage(externalPage) {
    var $page = $(externalPage);
    //var $body = $(externalPage + " div.extenalPageContent").clone(true);
    //$page.empty();

    $.ajax
    (
        {
            type: "GET",
            url: "shared.html",
            async: false,
            cache: true,
            dataType: 'html',
            success: function (data) {
                $page.append(data);
            },
            error: function (xhr, textStatus, thrownError) {
                ret_val = xhr.readyState;
                alert("status=" + xhr.status);
            }
        }
    );
    $(externalPage + " div.sharedBodyPlaceHolder").append($(externalPage + " div.extenalPageContent"));
}

function LoadMasterPage() {
    SetSharedFooterActive();
    return;
    if (g_Application.UserName != "") {
        $("#navWelcome").show();

        $("#aWelcome").html("Wellcome " + g_Application.UserName);
        $("#aWelcome").attr("href", "manageUser.html");

        $("#navAccount").html("Logoff");
        $("#navAccount").attr("href", "logoff.html");
    }
    else {
        $("#navWelcome").hide();

        $("#navAccount").html("Login");
        $("#navAccount").attr("href", "login.html");

    }
}

var g_CurrentPosition=null;
function ScanBarcode() {

    g_FooterLinkIndex = 1;
    if (g_Application.UserName == "") {
        $.mobile.changePage("login.html");
        return;
    }
    ScanBarcodeFromLocation();
    navigator.geolocation.getCurrentPosition(SetCurrentPosition, onGetLocationError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

function ScanClientReceipt(clientID, onSucess, onFailed) {

    //$.mobile.changePage("ConfirmReceiptScan.html?orderNo=orderNumber");
    //return;

    if (g_Application.UserName == "") {
        $.mobile.changePage("login.html");
        return;
    }
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
               if (result.text == "")
                   return;

               var content = "";
               $.mobile.changePage("ConfirmReceiptScan.html?orderNo=" + result.text);
               //if (result.format == "CODE_128") {
                   //content = result.text;
                   //ApplicationConfirmWithLabel("Is the following the right Order Number", content,"No,Yes", function (buttonIndex) {
                   //    if (buttonIndex == 2) {
                   //        var servicePath = 'ScanClientReceipt.ashx?callback=callback&receiptContent=' + result.text + '&customerID=' + g_Application.UserID + '&clientID=' + clientID;
                   //        $.getJSON(ServiceUrlRoot + servicePath, function (result) {
                   //            if (result.Errorcode == 0) {
                   //                ApplicationAlertWithTitle(result.Message, "Success");
                   //                if (onSucess != null)
                   //                    onSucess();
                   //            }
                   //            else
                   //                ApplicationAlertWithTitle(result.Message, "Failed");

                   //        });
                   //    }
                   //    else
                   //        return;
                   //})
               //}
               //else {
               //    ApplicationAlert("Scanning failed: Please try again:" + result.format + ":" + result.text);
               //    if (onFailed != null)
               //        onFailed();
               //    return;
               //}
           },
           function (error) {
               alert("Scanning failed: " + error);
               if (onFailed != null)
                   onFailed();
           }
        );
    }
}


function SearchClient() {
    var searchTerm = $("#SearchTerm").val();
    if (searchTerm != "")
        window.location.href = "ClientList.html?SearchTerm=" + searchTerm;

    return false;
}


function onGetLocationError(error) {
    ApplicationAlert("We are not able to determine your location at this moment. Please make sure your turn on  the location service or try again later.");
}

//function ScanBarcodeFromLocation(myPosition) {
function ScanBarcodeFromLocation() {
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
               if (result.text == "")
                   return;

               if (g_CurrentPosition == null)
                   alert("We are not able to determine your location at this moment. Please make sure your turn on  the location service or try again later.");

               var latitude = g_CurrentPosition.coords.latitude;
               var longitude = g_CurrentPosition.coords.longitude;

               var servicePath = 'ScanBarcode.ashx?callback=callback&CodeContent=' + result.text + '&UserID=' + g_Application.UserID + '&Latitude=' + latitude + '&Longitude=' + longitude;
               $.getJSON(ServiceUrlRoot + servicePath, function (barcodeInfo) {

                   if (barcodeInfo.ClientID != null) {
                       //ApplicationAlert("Your distance is:" + barcodeInfo.Distance);
                       if (barcodeInfo.Errorcode == 0) {
                           //window.location.href = "Redirect.html?redirectUrl=clientdetail.html?clientID=" + barcodeInfo.ClientID
                           if(barcodeInfo.CheckinCount>1)
                               ApplicationAlertWithTitle(barcodeInfo.CheckinCount + " points added to your account", "Check in");
                           else
                               ApplicationAlertWithTitle(barcodeInfo.CheckinCount + " point added to your account", "Check in");
                           $.mobile.changePage("Redirect.html?redirectUrl=clientdetail.html?clientID=" + barcodeInfo.ClientID);
                       }
                       else
                           ApplicationAlert(barcodeInfo.ErrorMessage);
                   }
                   else {
                       ApplicationAlert("Sorry, this is not a Mobilepon QR code. Please check-in by scanning a Mobilepon QR code.");
                       //$.mobile.changePage("barcodeDetail.html?barcodeID=" + barcodeInfo.Barcode);
                   }
               });
           },
           function (error) {
               alert("Scanning failed: " + error);
           }
        );
    }
}
function MyStore() {
    if (g_Application.UserName == "") {
        $.mobile.changePage("login.html");
    }
    else {
        window.location.href = "ClientList.html?IsFavorite=1";
    }
}

var g_LocalStore = window.localStorage != null ? window.localStorage : new Object();
var g_Application = {
    get UserID() {
        if (g_LocalStore["UserID"] == undefined || g_LocalStore["UserID"]=='null')
            return "";
        else
            return g_LocalStore["UserID"];
    },
    set UserID(UserID) {
        g_LocalStore["UserID"] = UserID;
    },
    get UserName() {
        if (g_LocalStore["UserName"] == undefined || g_LocalStore["UserName"] == 'null')
            return "";
        else
            return g_LocalStore["UserName"];
    },
    set UserName(UserName) {
        g_LocalStore["UserName"] = UserName;
    },

    get FullName() {
        if (g_LocalStore["FullName"] == undefined || g_LocalStore["FullName"] == 'null')
            return "";
        else
            return g_LocalStore["FullName"];
    },
    set FullName(FullName) {
        g_LocalStore["FullName"] = FullName;
    },

    get UserType() {
        if (g_LocalStore["UserType"] == undefined || g_LocalStore["UserType"] == 'null')
            return "";
        else
            return g_LocalStore["UserType"];
    },
    set UserType(UserType) {
        g_LocalStore["UserType"] = UserType;
    },
    get CurrentLocation() {
        if (g_LocalStore["CurrentLocation"] == undefined || g_LocalStore["CurrentLocation"] == 'null')
            return null;
        else {
            var localData = JSON.parse(g_LocalStore.getItem["CurrentLocation"]);
            return localData;
        }
    },
    set CurrentLocation(CurrentLocation) {
        var localData = JSON.stringify(CurrentLocation);
        alert(localData);
        var dd = JSON.parse(localData);
        alert(dd);
        alert(dd.latitude);
        g_LocalStore.setItem["CurrentLocation"] = localData;
    },

    get Latitude() {
        if (g_LocalStore["Latitude"] == undefined || g_LocalStore["Latitude"] == 'null')
            return "";
        else
            return g_LocalStore["Latitude"];
    },
    set Latitude(Latitude) {
        g_LocalStore["Latitude"] = Latitude;
    },

    get Longitude() {
        if (g_LocalStore["Longitude"] == undefined || g_LocalStore["Longitude"] == 'null')
            return "";
        else
            return g_LocalStore["Longitude"];
    },
    set Longitude(Longitude) {
        g_LocalStore["Longitude"] = Longitude;
    }
}

function effectiveDeviceWidth() {
    var deviceWidth = window.orientation == 0 ? window.screen.width : window.screen.height;
    // iOS returns available pixels, Android returns pixels / pixel ratio
    // http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html
    if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
        deviceWidth = deviceWidth / window.devicePixelRatio;
    }
    return deviceWidth;
}

function WatchLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(SetCurrentPosition);
    } else {
        ApplicationAlert("Geolocation is not supported by this browser.");
    }
}
function SetCurrentPosition(position) {
    g_CurrentPosition = position;
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    g_Application.Latitude = latitude;
    g_Application.Longitude = longitude;
}

//WatchLocation();

$(function(){
  document.addEventListener("deviceready", onDeviceReady, false);
})

function onDeviceReady() {

    navigator.geolocation.getCurrentPosition(SetCurrentPosition, onGetLocationError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

    //$("#idTest").append("onDeviceReady ");
    //navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
function onSuccess(position) {
    //alert("test");
  // your callback here
}

function onError(error) {
    alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
}

function openExternalUrl(url) {
    if (typeof navigator != "undefined" && navigator.app) {
        // Mobile device.
        navigator.app.loadUrl(url, { openExternal: false });
    } else {
        window.open(url, "_blank");
    }
}

function SetFooterActive(index) {
    $li=$(".footer li");
    $li.removeClass("active");
    $li.eq(index).addClass("active");
}

var g_FooterLinkIndex = 0;
function SetSharedFooterActive() {
    $li = $("#sharedFooter li");
    $li.removeClass("active");
    $li.eq(g_FooterLinkIndex).addClass("active");
}

function LoginNormalCustomer() {
    if (!$('#loginForm').valid())
        return false;
    var vals = $("#loginForm").serialize();
    return LoginCustomer(vals, "");
}

function LoginCustomer(accountData, userType) {
    $.post(WebsiteRoot + "Account/LoginCustomer", accountData, function (data) {
        if (data.JSonMessage != null) {
            alert(data.JSonMessage);
            return false;
        }
        else {
            g_Application.UserID = data.CustomerID;
            g_Application.UserName = data.UserName;
            g_Application.UserType = userType;
            g_Application.FullName = data.FullName;

            var returnUrl = getUrlVars()["ReturnUrl"];
            if (returnUrl == undefined) {
                returnUrl = "index.html";
            }
            window.location.href = returnUrl;
            return true;
            //$.mobile.changePage("index.html");
        }
    });
}

var resetPasswordDialog;
function OpenResetPasswordForm() {
    resetPasswordDialog.dialog("open");
}

function ResetPassword() {
    if (!$('#resetForm').valid())
        return false;

    var accountData = $("#resetForm").serialize();
    $.post(WebsiteRoot + "Account/ResetCustomerPassword", accountData, function (data) {
        if (data.JSonMessage != null) {
            ApplicationAlert(data.JSonMessage);
            return false;
        }
        else {
            resetPasswordDialog.dialog("close");
            ApplicationAlertWithTitle("An email was sent to this address containing your password.","Forgot password");

            return true;
        }
    });
}

var g_MobilePreviousUrl = "";

    var ServiceUrlRoot
    var WebsiteRoot

    if (isTest == 1)
        WebsiteRoot = "http://localhost/scansaves/";
    else
        WebsiteRoot = "http://www.mobilepon.com/";


    ServiceUrlRoot = WebsiteRoot+"DataProvider/";
