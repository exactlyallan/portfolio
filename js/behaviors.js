// Javascript allanenemark.com
// Interaction and custom behaviors
console.log("(ಠ_ಠ)");



// Get Time
var dates = new Date();
var nowHour = dates.getHours();
var nowYear = dates.getFullYear();
$('#stardate').text(nowYear); // set copyright


// Global Standard Color
var colorSet = ['dc8333', 'dc5858', '67a1d4', 'dc5858'];


// Change color scheme based on time
function setBaseColor() {

    var returnColorSet;
    var welcomeText = $('#welcome-text');

    // Morning
    if (nowHour < 11) {
        returnColorSet = colorSet[0];
        welcomeText.text("Good Morning");

    }
    // Afternoon
    else if (nowHour >= 11 && nowHour < 18) {
        returnColorSet = colorSet[1];
        welcomeText.text("Good Afternoon");
    }
    // Evening
    else if (nowHour >= 18) {
        returnColorSet = colorSet[2];
        welcomeText.text("Good Evening");
    }
    // Failsafe
    else {
        console.log("Wtf'O'Clock:" + nowHour);
        returnColorSet = colorSet[3];
        welcomeText.text("Good Day");
    }

    return returnColorSet;

}


// FitText
// https://github.com/davatron5000/FitText.js
$('#top-text').fitText(0.8);
$('.big-text').fitText(0.5);


// Down Arrow ScrollTo
$('#down-arrow').click(function(){

    $('html, body').animate({
        scrollTop: $("#welcome-text").offset().top-150, easing: 'easeInOutQuart'
    }, 1000);

})


// lazyLoad
// http://www.appelsiini.net/projects/lazyload
$('img.lazy').lazyload({
    effect : "fadeIn"
});



// video play/pause & start fallback
$('.vid').click(function(){
    if($(this).get(0).paused){
        $(this).get(0).play();
    } else {
        $(this).next().html('video paused');
        $(this).get(0).pause();
    }
})

// remove loading status event listener
$('.vid').on('canplay', function() {
    $(this).next().html('video ready');
});

// add playing status
$('.vid').on('play', function() {
    if($(this).get(0).networkState == 2 ){
        $(this).next().html('video loading...');
    } else {
        $(this).next().html('video ready');
    }
});


// Show More Click Event
$('.base-line').click(function(event) {
    $(this).next('.more-section').stop().slideToggle({ duration: 1200, easing: 'easeInOutQuart' });

    // eh, its messy but it works
    var eventTarget = $(event.target).context.firstElementChild;

    if ($(eventTarget).hasClass('flip')) {
        $(eventTarget).removeClass('flip')
    } else {
        $(eventTarget).addClass('flip');
    }

});


// Darken BG per section
// Base Color used in header viz and gradient background
$('section').each(function(key, val) {

    var colInc = -5 * key;
    var newColor = LightenDarkenColor(setBaseColor(), colInc);

    $(this).css('background-color', newColor);


});
// https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {

    var usePound = true;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}