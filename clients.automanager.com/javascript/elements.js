var _Slider_Auto = false;
var _Slider_AutoTimer = null;
var _Slider_AutoDelay = 5000;

$(function () {
    $("select[label='Desired Vehicle']").each(function () {
        Form_SelectVehicle(this);
    });

    $(".carousel").on("slide.bs.carousel", function (ev) {
        var lazy = $(ev.relatedTarget).find("img[data-src]");
        lazy.attr("src", lazy.data('src'));
        lazy.removeAttr("data-src");
    });

    $("a[class^=slider-arrow]").click(function () {
        return SliderArrow_Click(this);
    }).dblclick(function () {
        return SliderArrow_Click(this);
    });

    var arr = $("[class='vehicle-panel-specials']");
    if (arr.length > 0) {
        _Slider_Auto = true;
        Slider_InitAuto();
    }

    $("div.slideshow-container-inner").each(function () {
        SlideShow_Init($(this));
    });

    //$("[id$='_SearchText']").each(function () {
    //    FieldFocus_Start($(this).eq(0));
    //});

    $("form.inventory-search").keydown(function (e) {
        if (e.keyCode == 13) {
            $("form.inventory-search").submit();
        }
    });
    if (typeof _styleId !== "undefined" && _styleId === "GRD") {
      //  $('.inventory-price-container').matchHeight();
     //   $('.element-type-inventorylisttitle').matchHeight();
    //    $('.element-type-inventorylistdata').matchHeight();
        $('.col-sm-4').matchHeight();
     //   $('.inventory-photo-column').matchHeight();
    }

    var changeValuesToZero = function () {
        $(".calc-down-payment").val("");
        $(".calc-trade-in-value").val("");
        $(".calc-loan-amount").text("");
        $(".calc-monthly-payment").text("");
    };
    var checkIfVisible = function () {
        if (typeof _hideInterest !== "undefined" && _hideInterest) {
            $(".interestRate").hide();
        }
        if (typeof _hideSalesTaxt !== "undefined" && _hideSalesTaxt) {
            $(".salesTax").hide();
        }
        if (typeof _hideMoneyFactor !== "undefined" && _hideMoneyFactor) {
            $(".moneyFactor").hide();
        }
        if (typeof _hideDisclaimer !== "undefined" && _hideDisclaimer) {
            $(".disclaimerText").hide();
        }
    };
    VD_LoadSlideshowPhoto();
    $('.lazy').lazy();
    //$('#photoModal').on('show.bs.modal',
    //    function () {
    //        debugger;
    //        HighlightPhoto(1);
    //    });


    $("#paymentType").change(function () {
        var paymentType = $("#paymentType").val().toLowerCase();
        switch (paymentType) {
            case "loan":
                $("label[for = 'calc-vehicle-price']").html("Vehicle Price");
                $("label[for = 'calc-monthly-payment']").html("Monthly Payment");
                changeValuesToZero();
                $(".residualValue").hide();
                $(".moneyFactor").hide();
                checkIfVisible();
                break;
            case "lease":
                $("label[for = 'calc-vehicle-price']").html("Vehicle Price");
                $("label[for = 'calc-monthly-payment']").html("Monthly Payment");
                changeValuesToZero();
                $(".residualValue").show();
                $(".moneyFactor").show();
                checkIfVisible();

                break;
            case "afford":
                $("label[for = 'calc-vehicle-price']").html("Monthly Payment");
                $("label[for = 'calc-monthly-payment']").html("Vehicle Price");
                changeValuesToZero();
                $(".residualValue").hide();
                $(".moneyFactor").hide();
                checkIfVisible();
                break;
        }

    });

    $('#calc').on('show.bs.modal',
        function () {

            $("#calc #vehicleAfford").hide();
            $(".residualValue").hide();
            $(".moneyFactor").hide();
            checkIfVisible();
            
            $(".calc-vehicle-price").val(carPrice);
        });

});

function SliderArrow_Click(arrow) {
    var resetAuto = false;
    if (_Slider_AutoTimer) {
        window.clearTimeout(_Slider_AutoTimer);
        resetAuto = true;
    }

    var arr = $(arrow);
    var table = arr.closest("table").eq(0);
    var index = parseInt(table.attr("slider-index"));
    var maxIndex = parseInt(table.attr("max-index"));
    var panelSize = parseInt(table.attr("panel-size"));
    var viewport = table.find("div.slider-viewport").eq(0);
    var axis = "y";
    var animDelay = 200;

    var newIndex = index;

    if (arr.hasClass("slider-arrow-right")) {
        axis = "x";
        newIndex += 1;
    } else if (arr.hasClass("slider-arrow-left")) {
        axis = "x";
        newIndex -= 1;
    } else if (arr.hasClass("slider-arrow-bottom")) {
        newIndex += 1;
    } else if (arr.hasClass("slider-arrow-top")) {
        newIndex -= 1;
    }

    if (newIndex < 0) { newIndex = maxIndex; animDelay = 500; }
    if (newIndex > maxIndex) { newIndex = 0; animDelay = 500; }
    table.attr("slider-index", newIndex);

    viewport.scrollTo((newIndex * panelSize), { axis: axis, duration: animDelay });

    if (resetAuto) Slider_InitAuto();

    return false;
}

function Slider_AutoScroll() {
    window.clearTimeout(_Slider_AutoTimer);
    _Slider_AutoTimer = null;
    var button = $("a[class^=slider-arrow-right]");
    if (button == null) {
        button = $("a[class^=slider-arrow-bottom]");
    }
    button.click();

    Slider_InitAuto();
}

function Slider_InitAuto() {
    _Slider_AutoTimer = window.setTimeout("Slider_AutoScroll()", _Slider_AutoDelay);
}

function SlideShow_Init(container) {
    var effect = container.attr("effect");
    var speed = 1000 + parseInt(container.attr("speed")) * 100;
    var timeout = parseInt(container.attr("speed")) * 1000;
    var pagerId = "#" + container.attr("pagerId");

    container.cycle({
        fx: effect,
        speed: speed,
        timeout: timeout,
        pager: pagerId,
        pagerTemplate: "<li><a href='#'></a></li>",
        slides: "> div"
    });

    container.cycle("resume");
}

function ClickInnerSlide(overlay) {
    var container = $(overlay).parent();
    var anchor = container.find(".cycle-slide-active").children().first();
    var href = anchor.prop("href");
    if (anchor && href) {
        var target = anchor.prop("target");
        if (target == "_blank") {
            window.open(href);
        } else {
            window.location = href;
        }
    }
}

// Form elements

function Form_SelectVehicle(vid, detailid) {
    var div = $("#" + detailid);
    if (vid == "") {
        div.html("");
        div.hide();
    } else {
        var url = _AppUrls.Clients + "ajax/formvehicle.aspx?ClientID=" + _ClientId + "&VehicleID=" + vid + "&TS=" + Number(new Date());
        //url = url.replace("http://", "https://");
        div.load(url + " #divMain");
        div.show();
    }
}

function SelectMake(make) {
    var vtype = $("input[id$='xVehicleType']").get(0).value;

    var models = $("select.model").get(0);
    if (vtype != "O") {
        while (models.length > 0) models.remove(0);
        var selectedMake = make.options[make.selectedIndex].value;
        if (MakeList[selectedMake] === undefined) {
            var opt1 = document.createElement("OPTION");
            opt1.text = "Other";
            opt1.value = "Other";
            models.options.add(opt1);
        } else {
            if (MakeList[selectedMake].length > 0) {
                //var om = false;
                for (i = 0; i < MakeList[selectedMake].length; i++) {
                    if (MakeList[selectedMake][i] == "Other") {
                        //om = true;
                    }
                    else {
                        var opt2 = document.createElement("OPTION");
                        opt2.text = MakeList[selectedMake][i];
                        opt2.value = MakeList[selectedMake][i];
                        models.options.add(opt2);
                    }
                }

                var opt3 = document.createElement("OPTION");
                opt3.text = "Other";
                opt3.value = "Other";
                models.options.add(opt3);

            }
            else {

                var opt4 = document.createElement("OPTION");
                opt4.text = "All Models";
                opt4.value = "All Models";
                models.options.add(opt4);
            }
        }
    }
}

function Inventory_SetSortBy(elementId, sortBy) {
    $("#" + elementId + "_xSortBy").val(sortBy);
    $("#" + elementId + "_form").submit();
}

function Inventory_SetPage(elementId, pageId) {
    $("#" + elementId + "_xPageId").val(pageId);
    $("#" + elementId + "_form").submit();
}

function Inventory_SetPageSize(elementId, pageSize) {
    $("#" + elementId + "_xPageSize").val(pageSize);
    $("#" + elementId + "_form").submit();
}

function Inventory_SelectSearchFor(elementId, searchFor) {
    var label = searchFor;
    var placeholder = searchFor;
    switch (searchFor) {
        case "MakeModel":
            label = "Make Model";
            placeholder = "Make Model (e.g. Honda Accord)";
            break;
        case "YearMakeModel":
            label = "Year Make Model";
            placeholder = "Year Make Model (e.g. 2009 Honda Accord)";
            break;
        case "StockNum":
            label = "Stock #";
            placeholder = "Stock # starting with...";
            break;
        case "VIN":
            placeholder = "VIN starting with...";
            break;
        case "Color":
            placeholder = "Color (e.g. Black, Red, Silver, etc.)";
            break;
    }
    $("#" + elementId + "_SearchForLabel").html(label);
    $("#" + elementId + "_SearchText").prop("placeholder", placeholder);
    $("#" + elementId + "_SearchFor").val(searchFor);
}


// Vehicle Details Slideshow


function VD_LoadSlideshowPhoto() {
    if (typeof (_VD_PhotosLoaded) !== "undefined"){
        if (_VD_PhotosLoaded < _VD_SlideshowPhotos.length) {
            var p = new Image();
            p.onload = VD_InsertSlideshowPhoto();
            p.src = _VD_SlideshowPhotos[_VD_PhotosLoaded];
        }
    }
}

function VD_InsertSlideshowPhoto() {
    var altText = _VD_SlideshowAltLabel + " - Photo " + (_VD_PhotosLoaded + 1) + " - " + _VD_SlideshowAltLocation;
    var items = $("#featuredphoto-carousel-items");
    var item = "<div class=\"item " + ((_VD_PhotosLoaded == 0) ? "active" : "") + "\"><img src=\"" + _VD_SlideshowPhotos[_VD_PhotosLoaded] + "\" alt=\"" + altText + "\" class=\"img-responsive center-block\" />";
    if (_VD_SlideshowCaptions[_VD_PhotosLoaded] != "") {
        item += "<div class=\"carousel-caption\">" + _VD_SlideshowCaptions[_VD_PhotosLoaded] + "</div>";
    }
    item += "</div>";
    items.append(item);

    $("#carousel-container-featuredphoto").carousel();

    _VD_PhotosLoaded++;
    VD_LoadSlideshowPhoto();
}

// Vehicle Details Slider

function VD_DisplaySliderPhoto(anchor, index) {
    var div = $("#photo-" + index);
    if (div.length > 0) {
        $("#featured-photo > div").hide();
        div.show();
        return;
    }

    anchor = $(anchor);
    var src = anchor.attr("href");
    var alt = anchor.attr("alt");
    var caption = anchor.attr("title");
    

    div = "<div id=\"photo-" + index + "\"><img src=\"" + src + "\" class=\"img-responsive center-block\" alt=\"" + alt + "\" />";
    //if (caption != "") {
        div += "<div class=\"photo-caption accent-color2\">" + caption + "</div>";
    //}
    div += "</div>";

    var container = $("#featured-photo");
    container.html(div);
}


///Slideshow

function SlideshowPhotoLoaded() {
    _VD_PhotosLoaded++;
    $("#slideshow-loading-count").html(_VD_PhotosLoaded);
    if (_VD_PhotosLoaded > _VD_SlideshowPhotos.length) {
        EnableVehicleSlideshow();
    }
}

function EnableVehicleSlideshow() {
    for (var i = 0; i < _VD_SlideshowPhotos.length; i++) {
        $(".featured-photo-slideshow").append("<img src='" + _VD_SlideshowPhotos[i] + "' />");
    }

    // Enable slideshow.
    $(".featured-photo-slideshow").cycle({
        fx: "fade",
        speed: 1500,
        timeout: 5000,
        prev: "#slideshow-player-prev",
        next: "#slideshow-player-next"
    });
    $(".featured-photo-slideshow").cycle("pause");

    // Display play controls.
    $(".slideshow-player-play").click(function () {
        $(".slideshow-player-play").hide();
        $(".slideshow-player-pause").show();
        $(".featured-photo-slideshow").cycle("resume", true);
    });
    $(".slideshow-player-pause").click(function () {
        $(".slideshow-player-pause").hide();
        $(".slideshow-player-play").show();
        $(".featured-photo-slideshow").cycle("pause");
    });
    $(".slideshow-loading-container").hide();
    $(".slideshow-player-container").fadeIn(1000);
}

$(function () {
    // Load additional photos.
    if (typeof (_VD_SlideshowPhotos) === "undefined")
        return null;
    for (var i = 0; i < _VD_SlideshowPhotos.length; i++) {
        var p = new Image();
        p.onload = SlideshowPhotoLoaded();
        p.src = _VD_SlideshowPhotos[i];
    }
});


// Credit application
var vehicles;

function SelectAppType() {
    var joint = ($("#CreditApp_AppType").val() === "Joint");
    $("#divCoApp_Personal").toggle(joint);
    $("#divCoApp_Employment").toggle(joint);
    $("#divCoApp_Residential").toggle(joint);
    $("#divCoApp_Financial").toggle(joint);
}

function SaveApplication() {
    $("#xAction").val("Save");
    $("#CreditApp_Save").html("<i class='fa fa-spinner fa-spin'></i>&nbsp; Submitting...").attr("disabled", "disabled");
    g("CreditApp_form").submit();

}

function Form_FilterDesiredVehicle() {
    var year = $("#CreditApp_YearFilter").val();
    var make = $("#CreditApp_MakeFilter").val();
    var model = $("#CreditApp_ModelFilter").val();

    var list = $("#CreditApp_Vehicle");
    var selectedVehicle = list.val();

    list.empty();
    list.prop("disabled", false);

    if (year === "" && make === "" && model === "") {
        vehicles.appendTo("#CreditApp_Vehicle");
        $("#CreditApp_Vehicle").val(selectedVehicle);
    }
    else {
        var index;
        for (index = 0; index < vehicles.length; ++index) {
            var option = vehicles[index];
            if (((year === "" || option.innerText.indexOf(year) > -1) && (make === "" || option.innerText.indexOf(make) > -1) && ((model === "" || option.innerText.indexOf(model) > -1)))) {
                list.append(option);
            }
        }

        if (list.children().length < 1) {
            list.append("<option value=''>-- No vehicles matching your filter --</option>");
            list.prop("disabled", true);
        }

        //$("#CreditApp_Vehicle").val('');
        //$("#CreditApp_Vehicle_Details").hide();
    }

    list[0].selectedIndex = 0;
    Form_SelectVehicle(list.val(), "CreditApp_Vehicle_Details");
}

function ResetFilter() {
    $("#CreditApp_YearFilter").val('');
    $("#CreditApp_MakeFilter").val('');
    $("#CreditApp_ModelFilter").val('');
    Form_FilterDesiredVehicle();
    $("#CreditApp_Vehicle").val('');
    $("#CreditApp_Vehicle_Details").hide();
    $("#FilterReset").blur();
}

$(function () {
    SelectAppType();
    if ($("#CreditApp_Vehicle").length) {
        vehicles = $("#CreditApp_Vehicle option");

        Form_SelectVehicle($("#CreditApp_Vehicle").val(), "CreditApp_Vehicle_Details");
    }
});
///selly text
var target;

$("#RequestText").on("hide.bs.modal",
    function () {
        $(".modal-body input").val("");

    });
$('#RequestText').on('show.bs.modal',
    function (e) {
        $("#btnText").show();
        // $("#btnText").html("Request asdasdd");
        $(".RequestForm").show();
        $(".successForm").hide();
        $(".errorForm").hide();
        $(document).off('focusin.modal');
        target = e.currentTarget;
        //get data-id attribute of the clicked element
        //var photoUrl = $(e.relatedTarget).data('photo');
        //var vin = $(e.relatedTarget).data('vin');
        //var stock = $(e.relatedTarget).data('stock');
        //var title = $(e.relatedTarget).data('title');
        //$(e.currentTarget).find('input[name="firstName"]').val(getCookie("firstName"));
        //$(e.currentTarget).find('input[name="lastName"]').val(getCookie("lastName"));
        //$(e.currentTarget).find('input[name="emailAddress"]').val(getCookie("emailAddress"));
        //target = e.currentTarget;

        //populate the textbox               


        id = $(e.relatedTarget).data('id');

    });
$("#btnText").on("click",
    function () {
        var fName = $(target).find('input[name="firstName"]').val();
        var lName = $(target).find('input[name="lastName"]').val();
        var phoneNumber = $(target).find('input[name="phoneNumber"]').val();
        var comment = $(target).find('textarea[name="txtComments"]').val();
        if (fName === "") {
            //   $("#shakeFirst").effect("shake");
            //   return false;
        }
        if (lName === "") {
            //  $("#shakeLast").effect("shake");
            //   return false;
        }
        if (phoneNumber === "") {
            //   $("#shakeEmail").effect("shake");
            //   return false;
        }


        //setCookie("firstName", fName, 30);
        //setCookie("lastName", lName, 30);
        //setCookie("emailAddress", phoneNumber, 30);
        $.ajax({
            url: clientUrl + 'Scripts/EmailForPrice.aspx/SendText',
            type: 'POST',
            data: '{"clientId":"' +
            _ClientId +
            '", "firstName":"' +
            fName +
            '", "lastName":"' +
            lName +
            '", "comment":"' +
            comment +
            '", "phoneNumber":"' +
            phoneNumber +
            '", "sellyNumber":"' +
            SellyPhoneNumber +
            '", "sellyDealerId":"' +
            SellyDealerId +
            '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            global: true,
            success: function (response) {
                if (response.d.Success === false) {
                    $(".RequestForm").hide();
                    $(".errorForm").show();
                } else {
                    $("#btnText").hide();
                    $(".RequestForm").hide();
                    $(".successForm").show();
                }

            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

////Schedule service form functions
