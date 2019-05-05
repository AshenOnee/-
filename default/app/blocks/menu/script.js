/**
 * Created by Islam on 20.04.2019.
 */
$(document).ready(function () {
    var f = false;
    var busy = false;
    var MapButton = $('.menu__map');
    var SubMenu = $('.sub-menu');

    MapButton.click(function () {
        if(!busy){
            f = !f;
            busy = true;
            if(f)
                SubMenu.animate({
                    bottom: 0
                }, 500, function() {busy = false});
            else
                SubMenu.animate({
                    bottom: 550
                }, 500, function() {busy = false});
        }
    });

    SubMenu.mouseleave(function(){
        if(f){
            if(!busy){
                f = false;
                busy = true;
                SubMenu.animate({
                    bottom: 550
                }, 500, function() {busy = false});
            }
        }
    });
});
