$(document).ready(function(){

    $("#typed").typed({
        strings: ["Medical Student", "Computer Programmer"],
        typeSpeed: 30,
        backDelay: 2000,
        loop: true,
        contentType: 'html', // or text
        loopCount: false,
        showCursor: true,
        cursorChar: "|",
    });

    $(".nav-cell").mouseenter(function(){
        $(this).css("background-color", "#D8D8D8");
    });

    $(".nav-cell").mouseleave(function(){
        $(this).css("background-color", "white");
    });
});