$(document).ready(function(){
    $('.sarmadyGrid').pinbox({rtl : true}).hide(0).fadeIn(1000);
    setTimeout(function(){
        $('.sarmadyGrid div').addClass('new');
        $('.sarmadyGrid').pinbox({rowsize : 3 , rtl : true});
    },5000);
});
