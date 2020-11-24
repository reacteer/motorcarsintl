var _Filter_Email = /^([\w\-\.]+)@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/g;
var _Filter_Phone15 = /^\([2-9]{1}\d{2}\) \d{3}-\d{4} x\d{1,5}$/g;
var _Filter_Phone10 = /^\([2-9]{1}\d{2}\) \d{3}-\d{4}$/g;
var _Filter_Zip10 = /^\d{5}-\d{4}$/g;
var _Filter_Zip5 = /^\d{5}$/g;
var _Filter_PostalCode = /^[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d$/g; // cn postal code is A0A 0A0
var _Filter_IPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g;
var _Filter_Numeric = /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)|(^-?\d*$)/g;
var _Filter_SSN = /^\d{3}-\d{2}-\d{4}$/g;
var _Filter_SSN_Canada = /^\d{3}-\d{3}-\d{3}$/g;
var _Filter_Date1 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/g;
var _Filter_Date2 = /^(\d{4})-(\d{2})-(\d{2})$/g;

var _ValidationClasses =
    ".val-required," +
        ".val-requiredif," +
        ".val-phone," +
        ".val-email," +
        ".val-zip," +
        ".val-postal," +
        ".val-zippostal," +
        ".val-ip," +
        ".val-ssn," +
        ".val-date," +
        ".val-year," +
        ".val-match," +
        ".val-min," +
        ".val-max";

function IsValidEmail(address) {
    return address.match(_Filter_Email);
}

function IsValidPhoneNumber(phone) {
    if (typeof _IsMobile !== 'undefined' && _IsMobile) {
        return true;
    }
    return (phone.match(_Filter_Phone15) || phone.match(_Filter_Phone10));
}

function IsValidZipCode(zip) {
    return (zip.match(_Filter_Zip10) || zip.match(_Filter_Zip5));
}

function IsValidPostalCode(postal) {
    return postal.match(_Filter_PostalCode);
}

function IsValidZipPostalCode(zip) {
    return (zip.match(_Filter_Zip10) || zip.match(_Filter_Zip5) || zip.match(_Filter_PostalCode));
}

function IsValidIPAddress(ip) {
    return (ip.match(_Filter_IPAddress));
}

function IsValidSSN(ssn) {
    return ssn.match(_Filter_SSN);
}
function IsValidSSNCanada(ssn) {
    return ssn.match(_Filter_SSN_Canada);
}
function IsValidDate(date) {
    if (typeof _IsMobile !== 'undefined' && _IsMobile) {
        return true;
    }
    var mm, dd, yyyy;
    var dm1 = date.match(_Filter_Date1);
    if (dm1 !== null) {
        var dp1 = date.split("index.html");
        mm = parseInt(dp1[0], 10) - 1;
        dd = parseInt(dp1[1], 10);
        yyyy = parseInt(dp1[2], 10);
    } else {
        var dm2 = date.match(_Filter_Date2);
        if (dm2 !== null) {
            var dp2 = date.split("-");
            yyyy = parseInt(dp2[0], 10);
            mm = parseInt(dp2[1], 10) - 1;
            dd = parseInt(dp2[2], 10);
        } else {
            return false;
        }
    }

    if (yyyy < 1920 || yyyy > 2099) {
        return false;
    }

    var ed = new Date(yyyy, mm, dd);

    return ((dd == ed.getDate()) && (mm == ed.getMonth()) && (yyyy == ed.getFullYear()));
}

function IsValidPassword(pwd) {
    if (pwd.length < 8) {
        return false;
    }
    if (pwd.match(/^[a-zA-Z]+$/g)) {
        return false;
    }
    return true;
}

function Validation_Error(title, error, field, format) {
    if (_AppName != "Clients" && window.Dialog_ValidationError) {
        if (format) {
            error += format;
        }
        Dialog_ValidationError(title, error, field);
    } else {
        if (format) {
            error += format.replace(/<br\/\>/g, "\n").replace(/<\/?b\>/g, "").replace(/&nbsp;/g, " ");
        }
        alert(error);
        FieldFocus_Start(field);
    }
}

function GetFieldLabel(field) {
    var label = (field.attr("label") !== undefined) ? field.attr("label") : field.attr("placeholder");
    if (label === undefined) {
        var labelFor = $("label[for='" + field.attr("id") + "']");
        if (labelFor !== undefined) {
            label = labelFor.text();
        }
    }
    if (label !== undefined) {
        if (label.endsWith(" *")) {
            label = label.substring(0, label.length - 2);
        }
    }

    return label;
}


function ValidateField(field) {
    var value = field.val().trim();
    var label = GetFieldLabel(field);

    if (!field.is(":visible")) {
        return true;
    }

    if (field.hasClass("val-required")) {
        if (field.attr("type") == "checkbox" || field.attr("type") == "radio") {
            value = (field.prop("checked") ? true : "");
        } else {
            if (field.hasClass("default-value")) {
                if (value === field[0].defaultValue) {
                    Validation_Error("Invalid Input", label + " is required.", field);
                    return false;
                }
            }
        }

        if (value === "") {
            Validation_Error("Invalid Input", label + " is required.", field);
            return false;
        }
    }

    if (field.hasClass("val-requiredif")) {
        var field2 = (_IsMasterPage) ? $c(field.attr("rel")) : $m(field.attr("rel"));
        var required = false;
        if (field2.attr("type") == "checkbox" || field2.attr("type") == "radio") {
            required = field2.prop("checked");
        } else {
            var relvalue = field.attr("relvalue");
            required = (relvalue) ? (field2.val() == relvalue) : (field2.val() !== "");
        }

        if (value === "" && required) {
            Validation_Error("Invalid Input", label + " is required.", field);
            return false;
        }
    }

    if (field.hasClass("val-phone")) {
        if (value !== "") {
            if (!IsValidPhoneNumber(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; (999) 999-9999 x?????");
                return false;
            }
        }
    }

    if (field.hasClass("val-email")) {
        if (value !== "") {
            if (!IsValidEmail(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; your.name@emailserver.com");
                return false;
            }
        }
    }

    if (field.hasClass("val-zip")) {
        if (value !== "") {
            if (!IsValidZipCode(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Zip Code Format:</b>&nbsp; 99999-????");
                return false;
            }
        }
    }

    if (field.hasClass("val-postal")) {
        if (value !== "") {
            if (!IsValidPostalCode(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Postal Code Format:</b>&nbsp; A9A 9A9");
                return false;
            }
        }
    }

    if (field.hasClass("val-zippostal")) {
        if (value !== "") {
            if (!IsValidZipPostalCode(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Zip Code Format:</b>&nbsp; 99999-????<br/><b>Postal Code Format:</b>&nbsp; A9A 9A9");
                return false;
            }
        }
    }

    if (field.hasClass("val-ip")) {
        if (value !== "") {
            if (!IsValidIPAddress(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; 999.999.999.999");
                return false;
            }
        }
    }

    if (field.hasClass("val-ssn")) {
        if (value !== "") {
            if (!IsValidSSN(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; 999-99-9999");
                return false;
            }
        }
    }
    if (field.hasClass("val-ssn-canada")) {
        if (value !== "") {
            if (!IsValidSSNCanada(value)) {
                Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; 999-999-999");
                return false;
            }
        }
    }

    if (field.hasClass("val-date")) {
        if (value !== "") {
            if (!IsValidDate(value)) {
                Validation_Error("Invalid Input", "Please enter a valid date for " + label + ".", field, "<br/><br/><b>Format:</b>&nbsp; MM/DD/YYYY");
                return false;
            }
        }
    }

    if (field.hasClass("val-year")) {
        if (value !== "" && (parseFloat(value) < 1900 || parseFloat(value) > 2050)) {
            Validation_Error("Invalid Input", "Please enter a valid " + label + ".", field);
            return false;
        }
    }

    if (field.hasClass("val-match")) {
        var field3 = ($c(field.attr("rel"))) ? $c(field.attr("rel")) : $m(field.attr("rel"));
        var label3 = GetFieldLabel(field3);
        if (value != field3.val()) {
            Validation_Error("Invalid Input", label + " does not match " + label3 + ".", field);
            return false;
        }
    }

    if (field.hasClass("val-min")) {
        var min = $c(field.attr("min"));
        if (value !== "" && parseFloat(value) > parseFloat(min)) {
            Validation_Error("Invalid Input", label + " cannot be less than " + min + ".", field);
            return false;
        }
    }

    if (field.hasClass("val-max")) {
        var max = $c(field.attr("max"));
        if (value !== "" && parseFloat(value) > parseFloat(max)) {
            Validation_Error("Invalid Input", label + " cannot be greater than " + max + ".", field);
            return false;
        }
    }

    return true;
}

function ValidateInputs(inputs) {
    var valid = true;
    for (var i = 0; i < inputs.length && valid; i++) {
        if (_Environment == "Development") {
            valid = ValidateField(inputs.eq(i));
        } else {
            try {
                valid = ValidateField(inputs.eq(i));
            } catch (e) {
            }
        }
    }
    return valid;
}

function ValidateForm(container) {
    var inputs;

    if (container) {
        inputs = $(container + " > " + _ValidationClasses);
    } else {
        inputs = $(_ValidationClasses);
    }

    return ValidateInputs(inputs);
}

function ValidateWebForm(controlid) {
    var inputs = $("[id^=" + controlid + "]").filter(_ValidationClasses);

    return ValidateInputs(inputs);
}

//========================================================================================================================
// Document Ready
//========================================================================================================================

$(function() {
    if (_Environment == "Development") {
        $(_ValidationClasses).each(function() {
            var field = $(this);
            var label = GetFieldLabel(field);
            if (label === undefined || label == "") {
                alert(field.attr("id") + " is missing Label/Placeholder for validation.");
            }
        });
    }
});