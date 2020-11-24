var _FormControl_Enter = "Save";
var _FormControl_FieldChange = true;

function SaveOrigValue(field) {
    field.attr("origvalue", field.val());
}

function SetDirtyField(e) {
    var field = $(e.target);
    if (!field.hasClass("change-notrack")) {
        field.toggleClass("dirty", (field.val() != field.attr("origvalue")));
        if (window.PostFieldChangedHandler) { PostFieldChangedHandler(e); }
    }
}

function SaveChecked(field) {
    field.attr("origchecked", field.prop("checked"));
}

function SetDirtyRadio(e) {
    var field = $(e.target);
    if (!field.hasClass("change-notrack")) {
        var gn = field.attr("name");
        var rb = $("input:radio[name='" + gn + "']");

        rb.each(function () {
            field = $(this);
            field.toggleClass("dirty", (String(field.prop("checked")) != field.attr("origchecked")));
        });

        if (window.PostFieldChangedHandler) { PostFieldChangedHandler(e); }
    }
}

function SetDirtyCheckbox(e) {
    var field = $(e.target);
    if (!field.hasClass("change-notrack")) {
        field.toggleClass("dirty", (String(field.prop("checked")) != field.attr("origchecked")));
        if (window.PostFieldChangedHandler) { PostFieldChangedHandler(e); }
    }
}

function BindFieldChangedHandler() {
    if (_FormControl_FieldChange) {
        $(":text, select").each(function () { SaveOrigValue($(this)); });
        $(":text, select").change(function (e) { SetDirtyField(e, true); }).keyup(function (e) { SetDirtyField(e, true); });
        $(":radio, :checkbox").each(function (e) { SaveChecked($(this)); });
        $(":radio").click(function (e) { SetDirtyRadio(e); });
        $(":checkbox").click(function (e) { SetDirtyCheckbox(e); });
    }
}

function SetFieldChanged(e) {
    _IsFieldChanged = true;
    if (window.PostFieldChangedHandler) { PostFieldChangedHandler(e); }
}

function IsFieldChanged() {
    return (_IsFieldChanged || $(":input.dirty").length > 0);
}

function HtmlChangedCheck() {
    if (!IsFieldChanged()) {
        if (g("htmleditorsource")) {
            var a = (g(_EditorId).value + "").replace(/\r/g, "");
            var b = CKEDITOR.instances.htmleditorsource.getData();
            $("#htmleditorsource").toggleClass("dirty", (a != b));
        }
    }
}

function Click_CheckAll(cls, flag) {
    $(":checkbox." + cls).prop("checked", flag);
}

function FormSubmit(freezetitle) {
    if (g("aspnetForm")) {
        if (!ValidateForm()) { return false; }
        if (window.PreSaveHandler) {
            if (!PreSaveHandler()) { return false; }
        }
        if (window.HtmlEditor_SaveHandler) { HtmlEditor_SaveHandler(); }

        if (window.Dialog_Open) { FreezePage(((freezetitle) ? freezetitle : "Saving changes..."), "Please wait..."); }

        _IsConfirmedSave = true;
        if (gm("xAction")) { gm("xAction").value = ""; }
        g("aspnetForm").submit();
    }
}


function FormSubmitNew(action, freezetitle) {
    if (g("aspnetForm")) {
        if (!ValidateForm()) { return false; }
        if (window.PreSaveHandler) {
            if (!PreSaveHandler()) { return false; }
        }
        if (window.HtmlEditor_SaveHandler) { HtmlEditor_SaveHandler(); }

        if (window.Dialog_Open) { FreezePage(((freezetitle) ? freezetitle : "Saving changes..."), "Please wait..."); }

        _IsConfirmedSave = true;
        if (gm("xAction")) { gm("xAction").value = action; }
        g("aspnetForm").submit();
    }
}

function ActionSubmit(action, freezetitle) {
    if (freezetitle && window.Dialog_Open) { FreezePage(((freezetitle) ? freezetitle : "Saving changes..."), "Please wait..."); }
 
    _IsConfirmedSave = true;
    if (gm("xAction")) {
        gm("xAction").value = action;
    } else if (g("xAction")) {
        g("xAction").value = action;
    }

    if (gm("xSaveExit")) { gm("xSaveExit").value = ""; }
    g("aspnetForm").submit();
}

function WebFormSubmit(action, controlid) {
    if (!ValidateWebForm(controlid)) { return false; }
    if (window.PreSaveHandler) {
        if (!PreSaveHandler()) { return false; }
    }

    //gm("xAction").value = action;
    //gm("xControlId").value = controlid;
    $("#" + controlid + "_Submit").html("<i class='fa fa-spinner fa-spin'></i>&nbsp; Submitting...").attr("disabled", "disabled");
    g(controlid + "_form").submit();
}

//========================================================================================================================
// LockdownForm - Prevent editing form values when the user does not have edit priviledges
//========================================================================================================================

function LockdownForm() {
    if (_NoEdit) {
        $m("divContentFrame").addClass("content-gray");

        $("input[type!='hidden'], textarea, select").attr("disabled", true);
        $("input[type='text'], input[type='password'], textarea").addClass("read-only");
    }
}

//========================================================================================================================
// Document Ready
//========================================================================================================================

$(function () {
    if (gm("xClientSite") !== undefined) {
        _FormControl_FieldChange = false;
    }

    if (_AppName != "Home") {
        BindFieldChangedHandler();
        LockdownForm();
    }
});