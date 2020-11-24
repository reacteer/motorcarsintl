function FieldFocus_Start(field) {
    //FieldFocus_Stop();
    if (field.attr("id") == "htmleditorsource") {
        CKEDITOR.instances.htmleditorsource.focus();
    } else {
        field.focus();
        var type = field.attr("type");
        switch (type) {
        case "radio":
        case "checkbox":
            break;
        default:
            field.removeClass("field-focus-out");
            field.addClass("field-focus-out");
            if (!field.is("select")) {
                var val = field.val();
                field.val("");
                setTimeout(function() {
                    field.val(val);
                }, 1);
            }
            //_FadeField = field;
            //_FocusFadeTimer = window.setTimeout("FieldFocus_Stop();", 2000);
        }

        var clientSite = $("html").hasClass("client-site");
        if (clientSite) {
            if ($(".navbar").hasClass("navbar-fixed-top")) {
                var offset = field.offset();
                var posY = offset.top - $(window).scrollTop();
                window.scrollBy(0, posY - 100);
            }
        };
    }
}
