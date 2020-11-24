function FixNavbar() {
    var scrollTop = $(window).scrollTop();
    var menuOffset = $('.menu-container').offset().top;
    var navbar = $('.navbar-top');
    if (scrollTop > menuOffset) {
        navbar.addClass('navbar-fixed-top navbar-fixed-shadow');
    } else {
        navbar.removeClass('navbar-fixed-top navbar-fixed-shadow');
    }
}

function SetupParallax() {
    if (_BGParallax) {
        $("body").addClass("bg-parallax").attr("data-stellar-background-ratio", "0." + _BGParallaxSpeed);
    }

    $('.bg-parallax').each(function() {
        var elem = $(this);
        var ratio = elem.attr("data-stellar-background-ratio");
        if (ratio === undefined) {
            elem.attr("data-stellar-background-ratio", "0.1");
        }
    });
    $.stellar();
}

function InitSliders() {
    $('.flexslider').each(function () {
        var slider = $(this);
        var panelWidth = parseInt(slider.attr("data-panel-width"));
        var randomize = false;
        if (slider.attr("data-randomize")) {
            randomize = (slider.attr("data-randomize") == "true");
        }
        var slideSpeed = 5000;
        slider.flexslider({
            animation: "slide",
            animationLoop: true,
            animationSpeed: 1000,
            controlNav: false,
            itemWidth: panelWidth,
            itemMargin: 0,
            keyboard: false,
            minItems: 1,
            maxItems: 10,
            pauseOnHover: true,
            prevText: "",
            nextText: "",
            randomize: randomize,
            slideshowSpeed: slideSpeed,
            init: function (slider) {
                // lazy load
                $("img.lazy").slice(0, 8).each(function () {
                    var src = $(this).attr("data-src");
                    $(this).attr("src", src).removeAttr("data-src").removeClass("lazy");
                });
            },
            before: function (slider) {
                // lazy load

                $("img.lazy").slice(0, 8).each(function () {
                    var src = $(this).attr("data-src");
                    $(this).attr("src", src).removeAttr("data-src").removeClass("lazy");
                });
            }
        });
        });
}

function ResetSliders() {
    $('.flexslider').each(function() {
        var slider = $(this);
        slider.flexslider(0);
    });
}

$(function () {
    var fixedNavbar = $("nav.navbar.dynamic-fixed").length;
    if (fixedNavbar) {
        FixNavbar();
        $(window).scroll(function () {
            FixNavbar();
        });
    }

    if (!_IsMobile) {
        $("ul.nav li.dropdown").hover(function() {
            if ($("button.navbar-toggle").hasClass("collapsed")) {
                //$(this).find(".dropdown-menu").stop(true, true).show();
                $(this).addClass("open");
            }
        }, function() {
            if ($("button.navbar-toggle").hasClass("collapsed")) {
                //$(this).find(".dropdown-menu").stop(true, true).hide();
                $(this).removeClass("open");
            }
        });

        $("ul.nav li.dropdown a.menu-heading").click(function() {
            if ($("button.navbar-toggle").hasClass("collapsed")) {
                var a = $(this).parent().find(".dropdown-menu").find("a").first();
                var href = a.attr("href");
                window.location = href;
            }
        });
    }

    SetupParallax();
    InitSliders();

    var resizeTimeout;
    $(window).on("resize orientationChanged", function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(ResetSliders, 500);
    });

    $(".inventorysearch").keydown(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $(".searchform").submit();
        }
    });

              $('.700_credit_modal').on('shown.bs.modal', function () {
                  var frame = $(this).find('iframe');
                  $(this).find('iframe').attr('src', frame.data('src'));
              })
              $('.700_credit_modal').on('hidden.bs.modal', function () {
                  var frame = $(this).find('iframe');
                  $(this).find('iframe').attr('src', '');
              })

   
    $(".inventorysearch").autocomplete({
        source: availableTags
    });


});