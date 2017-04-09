// Javascript allanenemark.com
// Interaction and custom behaviors
console.log("(ಠ_ಠ) Yes, jQuery. Ping me if you want to know my reasons for not using React or something...");


// Get Time
var dates = new Date();
var nowHour = dates.getHours();
var nowYear = dates.getFullYear();
$('#stardate').text(nowYear); // set copyright


//// COLORS

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


//// EVENTS

// B-Lazy Load
var bLazy = new Blazy({ 
        loadInvisible: true
});


// Click Video to Play / Pause
$('.vid').click(function(){
    if($(this).get(0).paused){
        $(this).get(0).play();
    } else {
        $(this).get(0).pause();
    }
})

// Down Arrow ScrollTo
$('#down-arrow').click(function(){
    $('html, body').animate({
        scrollTop: $("#welcome-text").offset().top-150, easing: 'easeInOutQuart'
    }, 1000);
})

// Nav ScrollTo
$('.nav-link').click(function(event){
    event.preventDefault()
    var sec = $(this).attr('href')
    var distance = $(sec).offset().top-150;
    var time = distance * 0.4
    $('html, body').animate({
        scrollTop: distance, easing: 'easeInOutCubic'
    }, time);
})


// Show More Click Event
$('.open-detail').click(function(event) {
    
    var idmore = '#' + $(this).data('open') + '-more';
    var idchev = '#' + $(this).data('open') + '-chev';

    $(idmore).stop().slideToggle({ duration: 1200, easing: 'easeInOutQuart' });

    if ($(idchev).hasClass('flip')) {
        $(idchev).removeClass('flip')
    } else {
        $(idchev).addClass('flip');
    }

});

// Close More Click Event
$('.close-detail').click(function(event){

    var idmore = '#' + $(this).data('open') + '-more';
    var idchev = '#' + $(this).data('open') + '-chev';

    $(idmore).stop().slideUp({ duration: 1200, easing: 'easeInOutQuart' });

    if ($(idchev).hasClass('flip')) {
        $(idchev).removeClass('flip')
    } else {
        $(idchev).addClass('flip');
    }

});


//// EOF
