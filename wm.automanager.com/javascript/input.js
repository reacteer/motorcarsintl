var _AlphaPattern = /[a-z]/gi;
var _EmailPartPattern = /[a-z0-9\.\-]/gi;
var _DatePattern = /[0-9\/]/g;
var _DigitPattern = /[0-9]/g;
var _FloatPattern = /[0-9,\.\-]/g;
var _IpPattern = /[0-9\.]/g;
var _ZipPattern = /[0-9\-]/g;
var _ZipPostalPattern = /[0-9a-ceghj-npr-tv-z\- ]/gi;
var _HexPattern = /[0-9a-f]/gi;
var _VinPattern = /[0-9a-hji-npr-z]/gi;
var _PhonePattern = /[\(\)0-9\- ]/g;
var _PhoneExtPattern = /[\(\)0-9\- x]/g;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.hasMatch = function(pattern) {
    return (this.search(pattern) > -1);
};

Array.prototype.findIndex = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
};

String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix, 0) !== -1;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(part) {
    return this.indexOf(part) >= 0;
};

function StrRepeat(str, count) {
    return new Array(count + 1).join(str);
}

function RemoveBreaks(field) {
    var v = field.value;
    v = v.replace(/\r/, ' ').replace(/\n/, '');
    if (v !== field.value) {
        field.value = v;
    }
}

function HtmlEncode(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\r\n/g, "<br/>").replace(/\s+/g, " ");
}

function Format_UpperCase(field) {
    var value = field.val().toUpperCase();
    if (value !== field.val()) {
        var cp = field.caret();
        field.val(value);
        field.caret(cp.begin, cp.end);
    }
}

function Format_MaxLength(field) {
    var maxLength = parseInt(field.attr("length"), 10);
    if (field.val().length > maxLength) {
        field.val(field.val().substring(0, maxLength));
    }
    if (field.attr("count")) {
        $("#" + field.attr("count")).html(field.val().length);
    }
}

function FormatNumber(num, dec, zero) {
    if (isNaN(parseFloat(num))) {
        return "";
    }
    if (zero === false && num === 0) {
        return "";
    }

    var neg = (num < 0);

    var tmpNum = parseFloat(num);
    tmpNum *= Math.pow(10, dec);
    tmpNum = Math.round(Math.abs(tmpNum));
    tmpNum /= Math.pow(10, dec);

    if (neg) {
        tmpNum *= -1;
    }

    var tmpNumStr = tmpNum.toString();
    if (dec > 0) {
        var pos = tmpNumStr.lastIndexOf(".");
        if (pos === -1) {
            tmpNumStr += "." + StrRepeat("0", dec);
        } else {
            pos = tmpNumStr.length - pos;
            if (pos < dec + 1) {
                tmpNumStr += StrRepeat("0", dec + 1 - pos);
            }
        }
    }

    return tmpNumStr;
}

function Input_DateConfig(field) {
    if (field.attr("defaultdate")) {
        field.datepicker("option", "defaultDate", field.attr("defaultdate"));
    } else {
        field.datepicker("option", "defaultDate", null);
    }
    if (field.attr("mindate")) {
        field.datepicker("option", "minDate", field.attr("mindate"));
    }
    if (field.attr("maxdate")) {
        field.datepicker("option", "maxDate", field.attr("maxdate"));
    }
    field.datepicker("option", "changeMonth", true);
    field.datepicker("option", "changeYear", true);
    if (field.attr("yearrange")) {
        field.datepicker("option", "yearRange", field.attr("yearrange"));
    } else {
        field.datepicker("option", "yearRange", "-10:+0");
    }
}

function Input_Filter(e, input) {
    var key = event.key;
    var shift = e.shiftKey;
    var ctrl = e.ctrlKey;

    switch (key) {
        // modifier keys
        case "Shift":
        case "Control":
        case "Alt":

        // navigation keys
        case "Enter":
        case "Escape":

        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":

        case "Backspace":
        case "Tab":

        case "Delete":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":

        // meta keys
        case "Meta":
        case "ContextMenu":
        case "CapsLock":
        case "NumLock":
        case "ScrollLock":
        case "Pause":

        // function keys
        case "F1":
        case "F2":
        case "F3":
        case "F4":
        case "F5":
        case "F6":
        case "F7":
        case "F8":
        case "F9":
        case "F10":
        case "F11":
        case "F12":
            return true;

        case "Insert": // paste
            if (shift) {
                Input_FilterPaste(e.target, input);
                return true;
            }
            return true;

        case "z": // undo
            if (ctrl) {
                return true;
            }
            break;
        case "x": // cut
            if (ctrl) {
                return true;
            }
            break;
        case "c": // copy
            if (ctrl) {
                return true;
            }
            break;
        case "v": // paste
            if (ctrl) {
                Input_FilterPaste(e.target, input);
                return true;
            }
            break;
    }
    
    //alert(shift + " / " + ctrl + " / " + key);

    return Input_FilterKey(key, input);
}

function Input_FilterKey(key, input) {
    if (key === "") return false;

    switch (input) {
    case "alpha":
        return key.hasMatch(_AlphaPattern);

    case "emailpart":
        return key.hasMatch(_EmailPartPattern);

    case "date":
        return key.hasMatch(_DatePattern);

    case "digit":
        return key.hasMatch(_DigitPattern);

    case "float":
        return key.hasMatch(_FloatPattern);

    case "ip":
        return key.hasMatch(_IpPattern);

    case "zip":
        return key.hasMatch(_ZipPattern);

    case "zippostal":
        return key.hasMatch(_ZipPostalPattern);

    case "hex":
        return key.hasMatch(_HexPattern);

    case "vin":
        return key.hasMatch(_VinPattern);

    case "phone":
        return key.hasMatch(_PhonePattern);
    case "phoneext":
        return key.hasMatch(_PhoneExtPattern);

    }
    return false;
}

function Input_FilterPaste(target, input) {
    setTimeout(function() {
        if (target.value !== "") {
            var chars = target.value.split("");
            var clean = "";
            for (var i = 0; i < chars.length; i++) {
                var key = chars[i];
                if (Input_FilterKey(key, input)) clean += key;
            }
            target.value = clean;
        }
    }, 5);
}

function Input_RestoreDefault(field) {
    if (field.value === "") field.value = field.defaultValue;
}

//========================================================================================================================
// Document Ready
//========================================================================================================================

$(function () {
    var clientSite = $("html").hasClass("client-site");

    $("input:checked").addClass("checked");

    $("input[type='text'].default-value").focus(function () {
        if (this.value === this.defaultValue) this.value = "";
    });

    $("input[type='text'].default-value").blur(function () {
        var field = this;
        if ($(field).is(".input-year,.input-zip,.input-postal,.input-phone,.input-phoneext,.input-ssn")) {
            setTimeout(function () { Input_RestoreDefault(field); }, 10);
        } else {
            Input_RestoreDefault(field);
        }
    });

    if (typeof _IsMobile !== 'undefined' && _IsMobile) {
        // Input mask plugin doesn't work reliably across mobile devices.
        // Just filter keys, don't apply mask.
        $("input[type='text'].input-year").keydown(function (e) {
            return Input_Filter(e, "digit");
        });

        $("input[type='text'].input-zip").keydown(function (e) {
            return Input_Filter(e, "zip");
        });

        $("input[type='text'].input-postal").keydown(function (e) {
            return Input_Filter(e, "zippostal");
        });

        $("input[type='text'].input-phone").keydown(function (e) {
            return Input_Filter(e, "phone");
        });
        $("input[type='text'].input-phoneext").keydown(function (e) {
            return Input_Filter(e, "phoneext");
        });

        $("input[type='text'].input-ssn").keydown(function (e) {
            return Input_Filter(e, "phone");
        });
        $("input[type='text'].input-ssn-canada").keydown(function (e) {
            return Input_Filter(e, "phone");
        });

    } else {
        $("input[type='text'].input-year").mask("9999");

        $("input[type='text'].input-zip").mask("99999?-9999");

        $("input[type='text'].input-postal").mask("a9a 9a9");

        $("input[type='text'].input-phone").mask("(999) 999-9999");
        $("input[type='text'].input-phoneext").mask("(999) 999-9999? x99999");

        $("input[type='text'].input-ssn").mask("999-99-9999");
        $("input[type='text'].input-ssn-canada").mask("999-999-999");
    }

    $("input[type='text'].input-alpha").keydown(function (e) {
        return Input_Filter(e, "alpha");
    });

    $("input[type='text'].input-emailpart").keydown(function (e) {
        return Input_Filter(e, "emailpart");
    });

    $("input[type='text'].input-date").keydown(function (e) {
        return Input_Filter(e, "date");
    });

    $("input[type='text'].input-digit").keydown(function (e) {
        return Input_Filter(e, "digit");
    });

    $("input[type='text'].input-float").keydown(function (e) {
        return Input_Filter(e, "float");
    });

    $("input[type='text'].input-money").keydown(function (e) {
        return Input_Filter(e, "float");
    });

    $("input[type='text'].input-pct").keydown(function (e) {
        return Input_Filter(e, "float");
    });

    $("input[type='text'].input-ip").keydown(function (e) {
        return Input_Filter(e, "ip");
    });

    $("input[type='text'].input-zippostal").keydown(function (e) {
        return Input_Filter(e, "zippostal");
    });

    $("input[type='text'].input-hex").keydown(function (e) {
        return Input_Filter(e, "hex");
    });

    $("input[type='text'].input-rgb").keydown(function (e) {
        return Input_Filter(e, "hex");
    });

    $("input[type='text'].input-vin").keydown(function (e) {
        return Input_Filter(e, "vin");
    });

    $("input[type='text'].input-vin").keydown(function () {
        Format_UpperCase($(this));
    }).keyup(function () {
        Format_UpperCase($(this));
    }).change(function () {
        Format_UpperCase($(this));
    }).blur(function () {
        Format_UpperCase($(this));
    });

    $("textarea[length]").each(function () {
        Format_MaxLength($(this));
    }).keydown(function () {
        Format_MaxLength($(this));
    }).keyup(function () {
        Format_MaxLength($(this));
    }).change(function () {
        Format_MaxLength($(this));
    }).blur(function () {
        Format_MaxLength($(this));
    });

    $("input[type=password]").focus(function () {
        if ($(this).val() === "[password]") {
            $(this).val("");
        }
    });

    try {
        var inp = document.createElement("input");
        inp.setAttribute("type", "date");
        var inputDateSupported = (inp.type !== "text");

        if (!clientSite || !inputDateSupported) {
            $("input.input-date").datepicker({
                dateFormat: "m/d/yy",
                showAnim: "fadeIn"
            }).each(function () {
                Input_DateConfig($(this));
            });
        } else {
            $("input.input-date").each(function () {
                var d = $(this).attr("value");
                if (d !== undefined && d !== null) {
                    var s = d.split('/');
                    d = [s[2], ('0' + s[0]).slice(-2), ('0' + s[1]).slice(-2)].join('-');
                    $(this).val(d);
                }
            });
        }
    } catch (ex) {
        //
    }

    $("input:input:checkbox").click(function () {
        $(this).toggleClass("checked");
    });

    $("input:radio").click(function () {
        var gn = $(this).attr("name");
        $("input:radio[name='" + gn + "']").each(function () {
            $(this).toggleClass("checked", $(this).prop("checked"));
        });
    });


    // Focus first field.  
    var highlight = true;
    if (_AppName === "Home") {
        highlight = false;
    } else {
        if (_AppName === "Live") {
            highlight = (NoEdit === false);
        } else {
            highlight = (_NoEdit === false);
        }
    }

    if (highlight) {
        if (!clientSite) {
            var inputs = null;
            if (gm("divContentFrame")) {
                inputs = $("#divContentFrame :input:not(button)");
            } else {
                inputs = $(":input:not(button)[id]");
            }

            for (var i = 0; i < inputs.length; i++) {
                var input = inputs.eq(i);
                if (input.attr("type") !== "hidden" && input.attr("type") !== "checkbox" && input.attr("readonly") !== true && !input.hasClass("read-only") && !input.hasClass("input-data") && !input.hasClass("no-auto-focus")) {
                    FieldFocus_Start(input);
                    break;
                }
            }
        }
    }
});