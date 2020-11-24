//========================================================================================================================
// Control panel fields
//========================================================================================================================
function ControlIds(master, nav, content) {
    this.Master = master;
    this.Nav = nav;
    this.Content = content;
}

var _ControlIds = new ControlIds("", "", "");

function AppUrls(webmanager, clients) {
    this.WebManager = webmanager;
    this.Clients = clients;
}

var _AppUrls = new AppUrls("", "");


var _IsMasterPage = false;
var _NoEdit = false;
var _IsPageLoaded = false;
var _IsFieldChanged = false;
var _IsConfirmedSave = false;

var _DialogPanelType = null;

var _IsResponsive = false;


//========================================================================================================================
// Document ready
//========================================================================================================================
$(function() {
    window.focus();

    if ($("html").hasClass("master-page")) {
        _IsMasterPage = true;
    }
    if ($("html").hasClass("responsive")) {
        _IsResponsive = true;
    }

    $(document).keydown(function(e) {
        if (e.keyCode == 13) {
            if (e.target.tagName != "TEXTAREA") {
                e.preventDefault();
                if (window.Dialog_Open) {
                    if (_DialogPanel.dialog("isOpen")) {
                        $(".ui-dialog-buttonpane button").eq(0).trigger("click");
                        return false;
                    }
                }

                var form = $(e.target).closest("div.form");
                var button = form.find("input[type=submit]");
                if (button.length == 1) {
                    button.click();
                    return false;
                }

                if (window.Click_Enter) Click_Enter();
                return false;
            }
        }
    });

    try {
        // The base scripts for these (bootstrap and fancybox) may not be included in some instances where this script is loaded.
        $('[data-toggle="popover"]').popover({
            container: 'body',
            html: true,
            trigger: 'focus'
        });

        $(".fancybox").fancybox();
    } catch (e) {
    };

    _IsPageLoaded = true;
    _IsFieldChanged = false;
    _IsConfirmedSave = false;
});


//========================================================================================================================
// Navigation
//========================================================================================================================

function Go(url) {
    location.href = url;
}
// Grid to list / List to grid
function SwitchStyle() {
    $('#frmSwitchStyle').submit();
}

//========================================================================================================================
// Element selectors
//========================================================================================================================

function g(id) { return $("#" + id).get(0); }
function gm(id) { return g(_ControlIds.Master + id); }
function gn(id) { return g(_ControlIds.Nav + id); }
function gc(id) { return g(_ControlIds.Content + id); }

function $m(id) { return $("#" + _ControlIds.Master + id); }
function $n(id) { return $("#" + _ControlIds.Nav + id); }
function $c(id) { return $("#" + _ControlIds.Content + id); }

//========================================================================================================================
// Helpers
//========================================================================================================================

function BookmarkPage() {
    var title = document.title;
    var url = window.location.href;
    if (document.all) {
        window.external.AddFavorite(url, title);
    } else {
        if (window.sidebar) window.sidebar.addPanel(title, url, "");
    }
}


//========================================================================================================================
// Theme Interface
//========================================================================================================================

var _Menu_HideTimer = null;
var _Menu_Heading = null;
var _Menu_HoverEffect = "dropdown";

$(function () {
    $(document).ajaxStop(function () {
        $("#ajax_loader").hide();
    });
    $(document).ajaxStart(function () {
        $("#ajax_loader").show();
    });
    $("button[type=submit]").click(function(e) {
        e.preventDefault();
        var button = $(this);
        var action = button.val();
        var controlid = button.attr("id");
        var p = controlid.indexOf("_Submit");
        if (p > 0) {
            controlid = controlid.substring(0, p);
        }
        WebFormSubmit(action, controlid);
    });

    //$("button, a.button").disableSelection();

    if ($("base").length) {
        var re1 = /#([\w-]+)/;
        var re2 = /^#([\w-]+)/;
        var baseUrl = document.location.href.replace(re1, "");
        var href = '';
        var anchor = '';
        $("a[href]").each(function() {
            href = $(this).attr("href");
            if (re2.test(href)) {
                anchor = href.match(re2);
                $(this).attr("href", baseUrl + '#' + anchor[1]);
            }
        });
    }

    $("div.debug-info").delay(3000).fadeOut(2000);
});

function CloseOtherCriteria(div) {
    div = $(div);
    div.addClass("skip-close");
    div.parent().parent().find("div.search-criteria-heading").each(function() {
        var odiv = $(this);
        if (odiv.hasClass("arrow-down") && !odiv.hasClass("skip-close")) {
            odiv.toggleClass("arrow-down").next().toggle();
        }
    });
    div.removeClass("skip-close");
}

function Menu_Show(menuid) {
    if (_Menu_HideTimer) window.clearTimeout(_Menu_HideTimer);
    if (_Menu_Heading != null) {
        if (_Menu_Heading != menuid) {
            Menu_HideNow();
        }
    }
    _Menu_Heading = menuid;
    $("#tdMenu_" + menuid).addClass("menu-heading-hover").children("div").show();
}

function Menu_Hide() {
    _Menu_HideTimer = window.setTimeout("Menu_HideNow()", 250);
}

function Menu_HideNow() {
    if (_Menu_HideTimer) window.clearTimeout(_Menu_HideTimer);
    if (_Menu_Heading) {
        $("#tdMenu_" + _Menu_Heading).removeClass("menu-heading-hover").children("div").hide();
    }
    _Menu_Heading = null;
}

function ViewAllPhotos() {
    window.open(_AppUrls.Clients + "Scripts/VehiclePhotos.aspx?VID=" + _VehicleId + "&Source=Website");
}

function AskSellerQuestion() {
    window.open(_AppUrls.Clients + "Scripts/VehicleQuestion.aspx?VID=" + _VehicleId + "&Source=Website", "questionFrame");
}

function EmailFriend() {
    window.open(_AppUrls.Clients + "Scripts/EmailtoFriend.aspx?VID=" + _VehicleId + "&Source=Website", "emailFrame");
}

function AM_ViewPhoto(img) {
    $("#AM_imgMainPhoto").attr("src", img.href);
    $("#AM_divMainCaption").html(img.getAttribute("caption"));
}

//========================================================================================================================
// Comparison Interface
//========================================================================================================================
$.fn.compare = function (options) {
    var individualFrame = [];
    var mobile = false;
    // setup the default options
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mobile = true;
    }
    var defaults = {
        compareButton: mobile ? '.compare-vehicles-mobile' : '.compare-vehicles'
    };
          
    var options = $.extend(defaults, options);
    var itemsarray = []; // array for storing selected items
    var photoObjects = {};
    try {
        var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)
    }
    catch(err) {
        
    }
    if (typeof (vehicleComparison) != "undefined" && vehicleComparison !== null)
     vehicleComparison.forEach(function(objects){
         photoObjects[objects['id']] = objects["displayimg"]
    })
    if ((typeof(itemsArraySession) != "undefined" && itemsArraySession !== null)) {
        itemsArraySession.forEach(function(vehicleId) {
            $(".vehicle-comparison-images").append('<div class="col-md-2 nopadding imageContainer-' + vehicleId + '" style="float:right;"><div class="VehicleComparingImage SelectedVehicle1">      <aside><i class="fa fa-times-circle RemoveVehicleFromPreview" style="border-radius:50%; position: absolute; top: 0;right: 0;color: white;background-color:  black;" data-id="' + vehicleId + '" style="display: block;"></i></aside><img class="VehiclePhoto img-responsive" src="' + photoObjects[vehicleId] + '" alt="" style="display: block; width:100%;"></div></div>')
            $('.inventory-comparison').removeAttr('hidden');
            $('.inventory-comparison').show();
            itemsarray.push(vehicleId)
        })
        $(".comparison-mobile-counter").text(itemsArraySession.length + ' Vehicle Selected');
    }
    // if the compare button is clicked add the items to the
    // modal window - opening the modal is triggered by the modal
    // plugin seperately
    $('.compare-vehicles').click(function () {
        // if the button has the class active we have items to compare
        var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)
        //if ($(this).hasClass('active')) {

            $('.modal-vehicles').empty(); // clear the modal
            $('.no-vehicles').hide(); // hide the no vehicles selected message
            var validCategoryArray = testy.split(",");
            var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)
            var testArray = { 0: 'displayimg', 1: 'displaytitle', 2: 'displayprice', 3: 'displayyear', 4: 'displaymake', 5: 'displaymodel', 6: 'displaytrim', 7: 'displayengine', 8: 'displaytransmission', 9: 'displaymileage', 10: 'displayextcolor', 11: 'displayintcolor', 12: 'displaydrivetrain', 13: 'displayfuel', 14: 'displayfeatures' }
            var sampleTitles = { 0: 'Features', 1: 'Title', 2: 'Price', 3: 'Year', 4: 'Make', 5: 'Model', 6: 'Trim', 7: 'Engine', 8: 'Transmission', 9: 'Miles', 10: 'Exterior Color', 11: 'Interior Color', 12: 'Drivetrain', 13: 'Fuel', 14: 'Features' }

            var htmlString = ""

            for (var i = 0; i < Object.keys(testArray).length; i++) {
                var htmlString = '<tr>';
                if (validCategoryArray.indexOf(testArray[i]) === -1) {
                    continue;
                }
                for (var j = 0; j < vehicleComparison.length; j++) {
                    if (j === 0) {
                        htmlString += '<th scope="row">' + ReturnCategory(i, sampleTitles[i]) + '</th>'
                    }
                    
                    var value = '';
                    if (testArray[i] === 'displayimg' && validCategoryArray.indexOf(testArray[i]) !== -1) {

                        value = '<img class="img-responsive" src="' + vehicleComparison[j][testArray[i]] + '">'
                    }
                    else if (testArray[i] === 'displayfeatures' && validCategoryArray.indexOf(testArray[i]) !== -1) {

                        value = '<td class="option-' + vehicleComparison[j]['id'] + '"><a class="ExpandOptions btn btn-default" onclick="ExpandOptions();"> Expand Features </a></td>'
                    }
                    else {
                        if (validCategoryArray.indexOf(testArray[i]) !== -1) {
                            value = vehicleComparison[j][testArray[i]]
                        }
                    }
                    if (testArray[i] === 'displayfeatures')
                        htmlString += value
                    else
                        htmlString += '<td>' + value + '</td>'

                }
                htmlString += '</tr>';
                $('.modal-vehicles').append(htmlString);
            }


       
            //vehicleComparison.forEach(vehicle => {
            //    for (let elem in vehicle) {
            //        console.log(`${elem} = ${vehicle[elem]}`);

            //    }


            ////});
            //for (var i = 0; i < vehicleComparison.length; i++) {
            //    htmlString += vehicleComparison[i];
            //}
            //$('.modal-vehicles').append(htmlString);
            // else we haven't selected any vehicles to compare yet
        //} else {
        //    $('.modal-vehicles').empty(); // clear the modal
        //    $('.no-vehicles').show(); // show the no vehicles selected message       	
        //}

    });
   
    function BuildHtmlString(id) {
        var validCategoryArray = testy.split(",");
        var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)
        var htmlString = ""
        var count = 0;
        if (vehicleComparison !== null ) {
            htmlCompareList = vehicleComparison
        }

        var testArray = { 0: 'displayimg', 1: 'displaytitle', 2: 'displayprice', 3: 'displayyear', 4: 'displaymake', 5: 'displaymodel', 6: 'displaytrim', 7: 'displayengine', 8: 'displaytransmission', 9: 'displaymileage', 10: 'displayextcolor', 11: 'displayintcolor', 12: 'displaydrivetrain', 13: 'displayfuel', 14: 'displayfeatures' }
        var sampleTitles = { 0: 'Features', 1: 'Title', 2: 'Price', 3: 'Year', 4: 'Make', 5: 'Model', 6: 'Trim', 7: 'Engine', 8: 'Transmission', 9: 'Miles', 10: 'Exterior Color', 11: 'Interior Color', 12: 'Drivetrain', 13: 'Fuel', 14: 'Features' }
        var htmlString = '';
        var htmlList = {};
        for (var i = 0; i < Object.keys(testArray).length; i++) {
            
            
            if (validCategoryArray.indexOf(testArray[i]) === -1) {
                continue;
            }
            htmlString += '<tr class="' + testArray[i] +  '">';
            //for (var j = 0; j < 1; j++) {
                //if (j === 0 && itemsarray.length === 1) {
                //    htmlString += '<th scope="row">' + ReturnCategory(i, sampleTitles[i]) + '</th>'
                //}
                vehicle = $('.vehicle[data-id="' + id + '"]');
                var value = '';
                if (testArray[i] === 'displayimg' && validCategoryArray.indexOf(testArray[i]) !== -1) {

                    value =  $(vehicle).find('img').attr('src')
                }
                else if (testArray[i] === 'displayfeatures' && validCategoryArray.indexOf(testArray[i]) !== -1) {

                    value = '<td class="option-' + id + '"><a class="ExpandOptions btn btn-default" onclick="ExpandOptions();"> Expand Features </a></td>'
                }
                else {
                    if (validCategoryArray.indexOf(testArray[i]) !== -1) {
                        value = $(vehicle).data(testArray[i])
                    }
               // }
                
             }
                htmlList[testArray[i]] = value
           
            

        }
        htmlList["id"] = id
        htmlCompareList.push(htmlList);


        //for (var j = -1; j < 1; j++) {
        //    if (j === -1) {
        //        htmlString += '<tr><th scope="row">Key Features</th>';
        //    }
        //    else {
        //        htmlString += '<td class="option-' + itemsarray[j] + '"><a class="ExpandOptions btn btn-default" onclick="ExpandOptions();"> Expand Features </a></td>';
        //    }

        //}
        //htmlString += '</tr>'
        
        sessionStorage.setObj('comparehtml-' + _ClientId, htmlCompareList)
    }
    function ReturnCategory(index, category) {
        if (index === 0)
            return "";
        return category;

    }
    $('.compare-vehicles-mobile').click(function () {
              
        // if the button has the class active we have items to compare
        if ($(this).hasClass('active')) {
            //$('.left-compare-button').show();
            //$('.right-compare-button').show();
            $('.modal-vehicles').empty(); // clear the modal
            $('.no-vehicles').hide(); // hide the no vehicles selected message
            var currentIndex = 0;

            //$('.myModalCompareCount').text(currentIndex + 1 + ' of ' + itemsarray.length)
            //$('.myModalCompareCount').show();
            var arrayLength = itemsarray.length;
            // loop through the array if vehicles

            //var testy = "<%= _CompareFields %>";
            var validCategoryArray = testy.split(",");
            var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)

            var testArray = { 0: 'displayimg', 1: 'displaytitle', 2: 'displayprice', 3: 'displayyear', 4: 'displaymake', 5: 'displaymodel', 6: 'displaytrim', 7: 'displayengine', 8: 'displaytransmission', 9: 'displaymileage', 10: 'displayextcolor', 11: 'displayintcolor', 12: 'displaydrivetrain', 13: 'displayfuel' }
            var sampleTitles = { 0: 'Features', 1: 'Title', 2: 'Price', 3: 'Year', 4: 'Make', 5: 'Model', 6: 'Trim', 7: 'Engine', 8: 'Transmission', 9: 'Miles', 10: 'Exterior Color', 11: 'Interior Color', 12: 'Drivetrain', 13: 'Fuel' }
   
       
            for (var j = 0; j < vehicleComparison.length; j++) {
                var htmlString = '<div data-fancybox="images"><table class="table"><tbody class="modal-vehicles">';
                for (var i = 0; i < Object.keys(testArray).length; i++) {
                    if (validCategoryArray.indexOf(testArray[i]) === -1) {
                        continue;
                    }
                    htmlString += '<tr><th scope="row">' + ReturnCategory(i, sampleTitles[i]) + '</th>'
                    vehicle = $('.vehicle[data-id="' + vehicleComparison[j][testArray[i]] + '"]');
                    var value = '';
                    if (testArray[i] === 'displayimg') {

                        value = '<img class="img-responsive" src="' + vehicleComparison[j][testArray[i]] + '">'
                    }
                    else{
                        value = vehicleComparison[j][testArray[i]]
                    }
                    htmlString += '<td>' + value + '</td>'
                    htmlString += '</tr>';
                }
                htmlString += '<tr><th scope="row">Key Features</th><td class="option-' + vehicleComparison[j] + '"><a class="ExpandOptions btn btn-default" onclick="ExpandOptions();"> Expand Features </a></td></tr></tbody></table></div>';
                individualFrame[j] = htmlString;
            }
            var fancyString = '[';

            var arr = [];

            for (var i = 0; i < individualFrame.length; i++) {
                var myObj = { src: individualFrame[i], type: "inline", opts: { thumb: individualFrame[i] } }

               // myObj["opts"]["thumb"] = individualFrame[i];
                arr.push(myObj);
                //fancyString += '{ "src" : "' + individualFrame[i] + '", "type" : "inline"'
                //if (i < individualFrame.length - 1)
                //    fancyString += '}, '
                //else
                //    fancyString += '}]'

            }
            $.fancybox.open(arr
      , {
          loop: false,
          toolbar: "auto",
          smallBtn: "auto",
          buttons: [
          //"share",
          "thumbs",
          "close"
          ],

          thumbs: {
              autoStart: false, // Display thumbnails on opening
              hideOnClose: true, // Hide thumbnail grid when closing animation start
              axis: "y" // Vertical (y) or horizontal (x) scrolling
          },
      });
            $('.fancybox-thumbs').addClass("myBg");
            
            $('.fancybox-thumbs-active').addClass(".myborder");
           // $('.modal-vehicles').append(individualFrame[currentIndex]);

        }
    });
            
        

    // If an item is click for comparison run this code
    //
    $(document).on("click", ".addCompare",function () {
        // toggle the class selected on the vehicle wrapper
        //var maxVehic = <%= MaxCompareVehicles %>;
        if (itemsarray.length === 0) {
            $('.inventory-comparison').removeAttr('hidden');
            $('.inventory-comparison').show();
        }
        $(this).parent().toggleClass('selected');
            
        // get the vehicle id
        var obj = {}
        vehicleId = $(this).closest($(".inventory-panel")).data('id');
        var photoLink = $(this).closest($(".inventory-panel")).data('displayphoto');
        obj[vehicleId] = photoLink
        var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)

        // check if this vehicle is already in the array
        var inArray = $.inArray(vehicleId, itemsarray);

        if (inArray < 0) {
            // add this vehicle to the array
            if(itemsarray.length >= maxVehic ){
                return false;
            }
            $(this).text('- Compare')
            itemsarray.push(vehicleId);
            globalItemArray = itemsarray;
            $(".vehicle-comparison-images").append('<div class="col-md-2 nopadding imageContainer-' + vehicleId + '" style="float:right;"><div class="VehicleComparingImage SelectedVehicle1">      <aside><i class="fa fa-times-circle RemoveVehicleFromPreview" style="border-radius:50%; position: absolute; top: 0;right: 0;color: white;background-color:  black;" data-id="' + vehicleId + '" style="display: block;"></i></aside><img class="VehiclePhoto img-responsive" src="' + photoLink + '" alt="" style="display: block; width:100%;"></div></div>')
            $(".comparison-mobile-counter").text(itemsarray.length + ' Vehicle Selected');
            BuildHtmlString(vehicleId)

        } else {
            // remove if from the array
            itemsarray.splice($.inArray(vehicleId, itemsarray), 1);
            $('.imageContainer-' + vehicleId).remove();
            globalItemArray = itemsarray;
            $(".comparison-mobile-counter").text( itemsarray.length + ' Vehicle Selected');
            $(this).text('+ Compare')
            if (vehicleComparison !== null) {
                for (var i = 0; i < vehicleComparison.length; i++) {
                    if (vehicleComparison[i]["id"] === vehicleId) {
                        vehicleComparison.splice(i, 1);
                    }
                }
                sessionStorage.setObj('comparehtml-' + _ClientId, vehicleComparison)
            }
        }


        if (itemsarray.length > 1) {
            // if there are items in the array (selected) add the class 'active'
            // to the 'compare' button
            $('#compare').prop('disabled', false).removeClass('disabled');
            $('#compare-mobile').prop('disabled', false).removeClass('disabled');
            $(options.compareButton).addClass('active');
            $('#compare-mobile').addClass('active');


        } else {
            // if there are no items in the array (selected)
            // remove the active class
            $('#compare').prop('disabled', true).addClass('disabled');
            $('#compare-mobile').prop('disabled', true).addClass('disabled');
            $(options.compareButton).removeClass('active');
            $('#compare-mobile').removeClass('active');

        }
        if (itemsarray.length === 0) {
            $('.inventory-comparison').hide();
        }

        sessionStorage.setObj("CompareIds-" + _ClientId, itemsarray);
        
        
    });
    $(document).on("click", ".RemoveVehicleFromPreview", function () {
        // toggle the class selected on the vehicle wrapper
        // $(this).parent().toggleClass('selected');
        // get the vehicle id

        vehicleId = $(this).data('id');
        var vehicleComparison = sessionStorage.getObj("comparehtml-" + _ClientId)
        // check if this vehicle is already in the array
        var inArray = $.inArray(vehicleId, itemsarray);

        if (inArray > -1) {
            // add this vehicle to the array
            var index = itemsarray.indexOf(vehicleId);
            if (index > -1) {
                itemsarray.splice(index, 1);
                $('.imageContainer-' + vehicleId).remove();
                $('.addCompare-' + vehicleId).text('+ Compare');
                $(".comparison-mobile-counter").text(itemsarray.length + ' Vehicle Selected');
                globalItemArray = itemsarray;
                if (vehicleComparison !== null){
                for (var i = 0; i < vehicleComparison.length; i++) {
                    if (vehicleComparison[i]["id"] === vehicleId) {
                        vehicleComparison.splice(i, 1);
                    }
                }
                sessionStorage.setObj('comparehtml-' + _ClientId, vehicleComparison)
                }
                
            }

        }
        if (itemsarray.length > 1) {
            // if there are items in the array (selected) add the class 'active'
            // to the 'compare' button
            $('#compare').prop('disabled', false).removeClass('disabled');
            $('#compare-mobile').prop('disabled', false).removeClass('disabled');
            $(options.compareButton).addClass('active');
            $(".comparison-mobile-counter").text(itemsarray.length + ' Vehicle Selected');
            $('#compare-mobile').addClass('active');
        } else {
            // if there are no items in the array (selected)
            // remove the active class

            $('#compare').prop('disabled', true).addClass('disabled');
            $('#compare-mobile').prop('disabled', true).addClass('disabled');
           // $('#compare').css('visibility', 'hidden');
            $(options.compareButton).removeClass('active');
            $(".comparison-mobile-counter").text(itemsarray.length + ' Vehicle Selected');
            $('#compare-mobile').removeClass('active');

        }
        if (itemsarray.length === 0) {
            $('.inventory-comparison').hide();
        }
        sessionStorage.setObj("CompareIds-" + _ClientId, itemsarray);
       

    });

};
$('.vehicle').compare({
    compareButton: '.compare-vehicles'
});
function ExpandOptions() {
    for (var i = 0; i < globalItemArray.length; i++) {
        $(".option-" + globalItemArray[i]).html('<i class="fa fa-refresh fa-lg fa-spin"></i>');
    }

    $.ajax({
        url: urlConnect,
        type: 'POST',
        data: '{"invIds":"' +
            globalItemArray +
            '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            $.each(response, function (key, value) {
                $.each(value, function (key, value) {
                    if (key !== "Success") {
                        $('.option-' + key).html(value);
                    }
                });
            });
        },
        failure: function (response) {

        }
    });
}

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}
    //========================================================================================================================
    // Counter Interface
    //========================================================================================================================
    $.fn.countTo = function (options) {
        options = options || {};
        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it firs
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof (settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof (settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,               // the number the element should start at
        to: 0,                 // the number the element should end at
        speed: 1000,           // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,           // the number of decimal places to show
        formatter: formatter,  // handler for formatting the value before rendering
        onUpdate: null,        // callback method for every time the element is updated
        onComplete: null       // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }


    // custom formatting example
    $('.count-number').data('countToOptions', {
        formatter: function (value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

///// ASK QUESTION
    var askId = "";
    //var questTarget;
    $('#AskQuestion').on('show.bs.modal',
        function (e) {
            $("#btnAskQuestion").show();
                $("#btnAskQuestion").html("Submit");
            $(".askRequestForm").show();
            $(".askSuccessForm").hide();
            $(".askErrorForm").hide();
            $(document).off('focusin.modal');
            //get data-id attribute of the clicked element
            var vin = _Vin
            askId = _VehicleId
            var photoUrl = $(e.relatedTarget).data('photo');
            var vin = $(e.relatedTarget).data('vin');
            var stock = $(e.relatedTarget).data('stock');
            var title = $(e.relatedTarget).data('title');

            //    $(e.currentTarget).find('input[name="firstName"]').val(getCookie("firstName"));
            //   $(e.currentTarget).find('input[name="lastName"]').val(getCookie("lastName"));
            //  $(e.currentTarget).find('input[name="emailAddress"]').val(getCookie("emailAddress"));
            questTarget = e.currentTarget;
            //      $('#VehiclePhoto').html("<img width=\"100\" height=\"75\" src=\"" + photoUrl + "\">");
            //   $('#vehicleInfo').html("<div class=\"palette-heading1 accent-color1\">" + title + "</div><table><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>VIN:</b></td><td>" + vin + "</td></tr><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>Stock #:</b></td><td>" + stock + "</td></tr></table>");
            //populate the textbox               


            id = $(e.relatedTarget).data('id');

        });
    $("#btnAskQuestion").on("click",
        function () {
           
            var response;
            if (UseCaptcha === "True") {
                response = grecaptcha.getResponse();
            }
            if (UseCaptcha === 'False' || response !== "") {
                var fName = $(questTarget).find('input[name="firstName"]').val();
                var lName = $(questTarget).find('input[name="lastName"]').val();
                var emailAddress = $(questTarget).find('input[name="emailAddress"]').val();
                var phone = $(questTarget).find('input[id="txtPhone"]').val();
                var contact = $(questTarget).find('select[id="listContact"]').val();
                var method = $(questTarget).find('select[id="listMethod"]').val();
                var company = $(questTarget).find('input[id="txtCompany"]').val();
                subject = "";
                var comment = $(questTarget).find('textarea[name="txtComments"]').val();

                var data = {};
                data.InvId = askId;
                data.clientId = _ClientId
                data.firstName = fName;
                data.lastName = lName;
                data.emailAddress = emailAddress;
                data.phone = phone || "";
                data.contact = contact || "";
                data.method = method || "";
                data.company = company || "";
                data.comment = comment || "";
                var param = JSON.stringify(data);
                if ((typeof (response) !== "undefined" && response.length > 0) || UseCaptcha === 'False') {
                    $.ajax({
                        url: clientUrl + 'Scripts/VehicleQuestion.aspx/SendQuestion',
                        type: 'POST',
                        data: param,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function (response) {
                      
                            if (response.d.Success) {
                                $(".askRequestForm").hide();
                                $(".askSuccessForm").show();
                                var div = document.createElement('div');
                                var leadScript = response.d.leadScript || "";
                                var conversionScript = response.d.conversionScript
                                $('body').append(leadScript + ' ' + conversionScript);

                            }
                            else {
                                alert(response.d.ErrorMessage);
                            }

                        },
                        failure: function (response) {
                            $(".askRequestForm").hide();

                            alert(response.d.ErrorMessage);
                            $(".askErrorForm").show();
                        }
                    });
                }
            }
            else {
                alert("Captcha not set");
            }
            //if (fName === "") {
            //    $("#shakeFirst").effect("shake");
            //    return false;
            //}
            //if (lName === "") {
            //    $("#shakeLast").effect("shake");
            //    return false;
            //}
            //if (emailAddress === "") {
            //    $("#shakeEmail").effect("shake");
            //    return false;
            //}


            //setCookie("firstName", fName, 30);
            //setCookie("lastName", lName, 30);
            //setCookie("emailAddress", emailAddress, 30);

            //$.ajax({
            //    url: clientUrl + 'Scripts/EmailForPrice.aspx/SendPriceRequest',
            //    type: 'POST',
            //    data: '{"invId":"' +
            //    id +
            //    '","clientId":"' +
            //    _ClientId +
            //    '","lotId":"|' +
            //    _LotId +
            //    '|", "firstName":"' +
            //    fName +
            //    '", "lastName":"' +
            //    lName +
            //    '", "subject":"' +
            //    subject +
            //    '", "comment":"' +
            //    comment +
            //    '", "emailAddress":"' +
            //    emailAddress +
            //    '", "priceCookie":"' +
            //    priceCookie +
            //    '"}',
            //    contentType: 'application/json; charset=utf-8',
            //    dataType: 'json',
            //    global: true,
            //    success: function (response) {
            //        $("#btnEmail").hide();
            //        $(".RequestForm").hide();
            //        $(".successForm").show();
            //        $('.request-price').attr('data-target', '#RequestPriceShowPrice');
            //        $('.request-price').html('<span class=""fa fa-usd""></span> Show Price');
            //        setCookie('priceRequest_' + _ClientId, "1", 30)
            //    },
            //    failure: function (response) {
            //        $(".RequestForm").hide();
            //        $(".errorForm").show();
            //        alert(response.d);
            //    }
            //});

        });

    ///// EMAIL
    var askId = "";
    //var questTarget;
    $('#EmailFriend').on('show.bs.modal',
        function (e) {
            $("#btnAEmailFriend").show();
            if ($("#btnAEmailFriend").html() == "")
                $("#btnAEmailFriend").html("Submit");
            $(".emailRequestForm").show();
            $(".emailSuccessForm").hide();
            $(".emailErrorForm").hide();
            $(document).off('focusin.modal');
            //get data-id attribute of the clicked element
            var vin = _Vin
            askId = _VehicleId
            var photoUrl = $(e.relatedTarget).data('photo');
            var vin = $(e.relatedTarget).data('vin');
            var stock = $(e.relatedTarget).data('stock');
            var title = $(e.relatedTarget).data('title');

            //    $(e.currentTarget).find('input[name="firstName"]').val(getCookie("firstName"));
            //   $(e.currentTarget).find('input[name="lastName"]').val(getCookie("lastName"));
            //  $(e.currentTarget).find('input[name="emailAddress"]').val(getCookie("emailAddress"));
            questTarget = e.currentTarget;
            //      $('#VehiclePhoto').html("<img width=\"100\" height=\"75\" src=\"" + photoUrl + "\">");
            //   $('#vehicleInfo').html("<div class=\"palette-heading1 accent-color1\">" + title + "</div><table><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>VIN:</b></td><td>" + vin + "</td></tr><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>Stock #:</b></td><td>" + stock + "</td></tr></table>");
            //populate the textbox               


            id = $(e.relatedTarget).data('id');

        });
    $("#btnEmailFriend").on("click",
        function () {
            var response;
            if (UseCaptcha === "True") {
                response = grecaptcha.getResponse(widgetEmailId);
            }
            if (UseCaptcha === 'False' || response !== "") {
                var fName = $(questTarget).find('input[name="firstName"]').val();
                var lName = $(questTarget).find('input[name="lastName"]').val();
                var emailAddress = $(questTarget).find('input[name="emailAddress"]').val();
                var friendEmail = $(questTarget).find('input[name="friendEmailAddress"]').val();
                var subject = $(questTarget).find('input[name="subject"]').val();
                var comments = $(questTarget).find('textarea[name="txtComments"]').val();

                var data = {};
                data.InvId = askId;
                data.clientId = _ClientId
                data.firstName = fName;
                data.lastName = lName;
                data.emailAddress = emailAddress;
                data.friendEmailAddress = friendEmail;
                data.subject = subject;
                data.comment = comments;
                data.firstPhoto = vehicleUrlPhotoForms;
                
                var param = JSON.stringify(data);
                if ((typeof (response) !== "undefined" && response.length > 0) || UseCaptcha === 'False') {
                    $.ajax({
                        url: clientUrl + 'Scripts/EmailtoFriend.aspx/SendQuestion',
                        type: 'POST',
                        data: param,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function (response) {
                            if (response.d.Success) {
                                $(".emailRequestForm").hide();
                                $(".emailSuccessForm").show();
                                var div = document.createElement('div');
                                var leadScript = response.d.leadScript || "";
                                var conversionScript = response.d.conversionScript
                                $('body').append(leadScript + ' ' + conversionScript);

                            }
                            else {
                                alert(response.d.ErrorMessage);
                            }

                        },
                        failure: function (response) {
                            $(".askRequestForm").hide();

                            alert(response.d.ErrorMessage);
                            $(".askErrorForm").show();
                        }
                    });
                }
            }
            else {
                alert("Captcha not set");
            }
            //if (fName === "") {
            //    $("#shakeFirst").effect("shake");
            //    return false;
            //}
            //if (lName === "") {
            //    $("#shakeLast").effect("shake");
            //    return false;
            //}
            //if (emailAddress === "") {
            //    $("#shakeEmail").effect("shake");
            //    return false;
            //}


            //setCookie("firstName", fName, 30);
            //setCookie("lastName", lName, 30);
            //setCookie("emailAddress", emailAddress, 30);

            //$.ajax({
            //    url: clientUrl + 'Scripts/EmailForPrice.aspx/SendPriceRequest',
            //    type: 'POST',
            //    data: '{"invId":"' +
            //    id +
            //    '","clientId":"' +
            //    _ClientId +
            //    '","lotId":"|' +
            //    _LotId +
            //    '|", "firstName":"' +
            //    fName +
            //    '", "lastName":"' +
            //    lName +
            //    '", "subject":"' +
            //    subject +
            //    '", "comment":"' +
            //    comment +
            //    '", "emailAddress":"' +
            //    emailAddress +
            //    '", "priceCookie":"' +
            //    priceCookie +
            //    '"}',
            //    contentType: 'application/json; charset=utf-8',
            //    dataType: 'json',
            //    global: true,
            //    success: function (response) {
            //        $("#btnEmail").hide();
            //        $(".RequestForm").hide();
            //        $(".successForm").show();
            //        $('.request-price').attr('data-target', '#RequestPriceShowPrice');
            //        $('.request-price').html('<span class=""fa fa-usd""></span> Show Price');
            //        setCookie('priceRequest_' + _ClientId, "1", 30)
            //    },
            //    failure: function (response) {
            //        $(".RequestForm").hide();
            //        $(".errorForm").show();
            //        alert(response.d);
            //    }
            //});

        });
    //========================================================================================================================
    // PriceRequest Interface
    //========================================================================================================================
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    $(document).ajaxStart(function () {
        $("#btnEmail").html('<i class="fa fa-refresh fa-lg fa-spin" style="color: #000000;"></i>');
        $("#btnAskQuestion").html('<i class="fa fa-refresh fa-lg fa-spin" style="color: #000000;"></i>');
        $("#btnEmailFriend").html('<i class="fa fa-refresh fa-lg fa-spin" style="color: #000000;"></i>');
    })
    .ajaxStop(function () {
        $("#btnAskQuestion").hide();
        $("#btnEmailFriend").hide();
    });
    var fName;
    var lName;
    var emailAddress;
    var subject;
    var comment;
    var id;
    var target;
    var priceCookie;
    $("#RequestPrice").on("hide.bs.modal",
        function () {
            $(".modal-body input").val("");

        });
$('#RequestPriceShowPrice').on('show.bs.modal',
    function (e) {
        var vin = $(e.relatedTarget).data('vin');
        id = $(e.relatedTarget).data('id');
        var photoUrl = $(e.relatedTarget).data('photo');
        var priceHtml = $(e.relatedTarget).data("price")
        var stock = $(e.relatedTarget).data('stock');
        var title = $(e.relatedTarget).data('title');
        $('#VehiclePhotoRequest').html("<img width=\"100\" height=\"75\" src=\"" + photoUrl + "\">");
        $('#vehicleInfoRequest').html("<div class=\"palette-heading1 accent-color1\">" + title + "</div><table><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>VIN:</b></td><td>" + vin + "</td></tr><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>Stock #:</b></td><td>" + stock + "</td></tr></table>");
        $(".inventory-requestprice-container").html(priceHtml);
    });

    $('#RequestPrice').on('show.bs.modal',
        function (e) {
            $("#btnEmail").show();
            if ($("#btnEmail").html() == "Send Request")
                $("#btnEmail").html("Request Price");
            $(".RequestForm").show();
            $(".successForm").hide();
            $(".errorForm").hide();
            $(document).off('focusin.modal');
            //get data-id attribute of the clicked element
            var photoUrl = $(e.relatedTarget).data('photo');
            var vin = $(e.relatedTarget).data('vin');
            var stock = $(e.relatedTarget).data('stock');
            var title = $(e.relatedTarget).data('title');
            priceCookie = $(e.relatedTarget).data('pricecookie');

            $(e.currentTarget).find('input[name="firstName"]').val(getCookie("firstName"));
            $(e.currentTarget).find('input[name="lastName"]').val(getCookie("lastName"));
            $(e.currentTarget).find('input[name="emailAddress"]').val(getCookie("emailAddress"));
            target = e.currentTarget;
            $('#VehiclePhoto').html("<img width=\"100\" height=\"75\" src=\"" + photoUrl + "\">");
            $('#vehicleInfo').html("<div class=\"palette-heading1 accent-color1\">" + title + "</div><table><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>VIN:</b></td><td>" + vin + "</td></tr><tr><td class=\"accent-color2\" style=\"padding-right: 10px;\"><b>Stock #:</b></td><td>" + stock + "</td></tr></table>");
            //populate the textbox               


            id = $(e.relatedTarget).data('id');

        });

    $("#btnEmail").on("click",
     function () {
         fName = $(target).find('input[name="firstName"]').val();
         lName = $(target).find('input[name="lastName"]').val();
         emailAddress = $(target).find('input[name="emailAddress"]').val();
         subject = "";
         comment = $(target).find('textarea[name="txtComments"]').val();
         if (fName === "") {
             $("#shakeFirst").effect("shake");
             return false;
         }
         if (lName === "") {
             $("#shakeLast").effect("shake");
             return false;
         }
         if (emailAddress === "") {
             $("#shakeEmail").effect("shake");
             return false;
         }


         setCookie("firstName", fName, 30);
         setCookie("lastName", lName, 30);
         setCookie("emailAddress", emailAddress, 30);

         $.ajax({
             url: clientUrl + 'Scripts/EmailForPrice.aspx/SendPriceRequest',
             type: 'POST',
             data: '{"invId":"' +
             id +
             '","clientId":"' +
             _ClientId +
             '","lotId":"|' +
             _LotId +
             '|", "firstName":"' +
             fName +
             '", "lastName":"' +
             lName +
             '", "subject":"' +
             subject +
             '", "comment":"' +
             comment +
             '", "emailAddress":"' +
             emailAddress +
             '", "priceCookie":"' +
             priceCookie +
             '"}',
             contentType: 'application/json; charset=utf-8',
             dataType: 'json',
             global: true,
             success: function (response) {
                 $("#btnEmail").hide();
                 $(".RequestForm").hide();
                 $(".successForm").show();
                 $('.request-price').attr('data-target', '#RequestPriceShowPrice');
                 $('.request-price').html('<span class=""fa fa-usd""></span> Show Price');
                 setCookie('priceRequest_' + _ClientId, "1", 30)
             },
             failure: function (response) {
                 $(".RequestForm").hide();
                 $(".errorForm").show();
                 alert(response.d);
             }
         });

     });



    $(".save-vehicle").click(function () {
        var vehicleId = $(this).data("vehicle");
        var test = getCookie("savedvehicles");
        var ids = test.split(',')
        if (test === "")
           // test = vehicleId;
        ids.push(vehicleId);
        else if (!ids.includes(vehicleId)){
            ids.push(vehicleId)
        }
        else {
            var index = ids.indexOf(vehicleId);
            if (index > -1) {
                ids.splice(index, 1);
            }
        }
        setCookie("savedvehicles", ids.join(","), 30);

    });
    var mediaWindow = window.matchMedia("(min-width: 600px)")
    
    $(".photo-button").click(function () {
        var vehicleId = $(this).data("vehicle");
        $.ajax({
            url: clientUrl + 'Scripts/ComparisonInfo.aspx/GetVehiclePhotos',
            type: 'POST',
            data: '{"invId":"' +
                vehicleId +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
            
                        var arr = [];
                        for (var i = 0; i < response.d.length; i++) {
                            var myObj = { src: response.d[i], opts: { thumb: response.d[i] } }
                            arr.push(myObj);

                        }
                            
                         $.fancybox.open(
                              arr
                            , {
                                loop: false,
                                buttons: [
                                "zoom",
                                //"share",
                                "slideShow",
                                "thumbs",
                                "close"
                                ],
                                thumbs: {

                                    autoStart: mediaWindow.matches ? true : false, // Display thumbnails on opening
                                    hideOnClose: false, // Hide thumbnail grid when closing animation start
                                    axis: "x" // Vertical (y) or horizontal (x) scrolling
                                },
                               
                            });
                        
            },
            failure: function (response) {

            }
        });

        $('.fancybox-thumbs').addClass("myBg");
        $('.fancybox-thumbs-active').addClass(".myborder");

    });
    $("#vehicle-link-photos-modal").click(function () {
        $.fancybox.open(
           _fancyModal
        , {
            loop: false,
            buttons: [
            "zoom",
            //"share",
            "slideShow",
            "thumbs",
            "close"
            ],
            thumbs: {
                autoStart: mediaWindow.matches ? true : false, // Display thumbnails on opening
                fitToView: false,
                hideOnClose: true, // Hide thumbnail grid when closing animation start
                axis: "x" // Vertical (y) or horizontal (x) scrolling
            },
        });
        $('.fancybox-thumbs').addClass("myBg");
        $('.fancybox-thumbs-active').addClass(".myborder");

    });
    $(".photo-modal-additional").click(function () {
        $.fancybox.open(
           _fancyModalAdditional
        , {
            loop: false,
            buttons: [
            "zoom",
            //"share",
            "slideShow",
            "thumbs",
            "close"
            ],
            thumbs: {
                autoStart: mediaWindow.matches ? true : false, // Display thumbnails on opening
                fitToView: false,
                hideOnClose: false, // Hide thumbnail grid when closing animation start
                axis: "x" // Vertical (y) or horizontal (x) scrolling
            },
        });
        $('.fancybox-thumbs').addClass("myBg");
        $('.fancybox-thumbs-active').addClass(".myborder");

    });
    $(function () {
        return $(".carousel").on("slide.bs.carousel",
            function (ev) {
                var lazy;
                lazy = $(ev.relatedTarget).find("img[data-src]");
                lazy.attr("src", lazy.data('src'));
                lazy.removeAttr("data-src");
            });
    });
    function Fancy_Dialog(title, content, alert) {
        $.fancybox.open(
          content
       , {
           loop: false,
           buttons: [
           "zoom",
           //"share",
           "slideShow",
           "fullScreen",
           "download",
           "thumbs",
           "close"
           ],
           thumbs: {
               autoStart: mediaWindow.matches ? true : false, // Display thumbnails on opening
               hideOnClose: true, // Hide thumbnail grid when closing animation start
               axis: "y" // Vertical (y) or horizontal (x) scrolling
           },
       });
        $('.fancybox-thumbs').addClass("myBg");
        $('.fancybox-thumbs-active').addClass(".myborder");
    }


    $(document).ready(function () {
        if (mediaWindow.matches) {
            $("[data-fancybox]").fancybox({
                iframe: {
                    css: {
                        width: '640px',
                        height: '360px'
                    }
                },
                fitToView: false,
                autoSize: false
            });
        }
        else {
            $("[data-fancybox]").fancybox({
                iframe: {
                    css: {
                        width: '640px',
                        height: '250px'
                    }
                },
                fitToView: false,
                autoSize: false
            });
        }

    });
//Calculator

