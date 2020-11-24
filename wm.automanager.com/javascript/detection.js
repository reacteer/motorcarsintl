//========================================================================================================================
// Browser detection
//========================================================================================================================
var _UserAgent  = navigator.userAgent.toLowerCase();
var _AppVersion = navigator.appVersion.toLowerCase();

// Internet Explorer
if (_UserAgent.indexOf("trident/8.") > -1) {
    _IsIe = true;
    _IeVersion = 12;
} else if (_UserAgent.indexOf("trident/7.") > -1) {
    _IsIe = true;
    _IeVersion = 11;
} else {
    var _IsIe = ((_AppVersion.indexOf('msie') > -1) && (!_IsOpera));
    var _IeVersion = 8;
    if (_IsIe) {
        var re = new RegExp("msie ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(_UserAgent) !== null) {
            _IeVersion = parseFloat(RegExp.$1);
        }
    }
}

// Firefox
var _IsFf  = false;
var _FfVersion  = 3;
if (/firefox[\/\s](\d+\.\d+)/.test(_UserAgent)) {
  _IsFf = true;
  _FfVersion = parseFloat(RegExp.$1);
}

// Edge
var _IsEdge = !!window.StyleMedia;

// Chrome
var _IsChrome = (!_IsEdge && _UserAgent.indexOf('chrome')) > -1;

// Safari & iPad
var _IsSafari   = (_UserAgent.indexOf('safari') > -1) && (_UserAgent.indexOf('mac') > -1);
var _IsIpad     = (_IsSafari) && (_UserAgent.indexOf('ipad') > -1);

// Opera
var _IsOpera    = (_UserAgent.indexOf("opera") > -1);


// Version validation
var _IsValidBrowser = ((_IsIe && _IeVersion >= 7) || (_IsFf && _FfVersion >= 3) || _IsChrome || _IsSafari || _IsOpera);

// Cookies enabled
document.cookie = "cookies=true";
var _IsCookieEnabled  = (document.cookie) ? true : false;
