window.$ = $;
window.jQuery = $;

$(document).ready(function($){
    init_header_scrolling();

    $(window).scroll( function(e) {
		init_header_scrolling();
	});
    
    function init_header_scrolling() {
		var header = $('nav');
		if ( $(window).scrollTop() > 0 ) {
			header.addClass('nav-scrolling');
		} else {
			header.removeClass('nav-scrolling');
		}
	}

	var darkMode;

	if (localStorage.getItem('dark-mode')) {  
		// if dark mode is in storage, set variable with that value
		darkMode = localStorage.getItem('dark-mode');
	} else {
		if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')){
			darkMode = 'dark';
		}else {  
			// if dark mode is not in storage, set variable to 'light'
			darkMode = 'light';
		}
	}

	// set new localStorage value
	localStorage.setItem('dark-mode', darkMode);

	if (localStorage.getItem('dark-mode') == 'dark') {
		// if the above is 'dark' then apply .dark to the body
		$('html').addClass('dark');  
		// hide the 'dark' button
		$('.dark-mode').hide();
		// show the 'light' button
	   	$('.light-mode').show();

	  	$('.d-light').hide();

	  	$('.d-dark').show();
  }

	$(".dark-mode").click(function(){

		$("html").addClass("dark");
		$(".dark-mode").hide();
		$(".light-mode").show();

		$(".d-light").hide();

		$(".d-dark").show();

		localStorage.setItem('dark-mode', 'dark');
		return false;
	});

	$(".light-mode").click(function(){

		$("html").removeClass("dark");
		$(".light-mode").hide();
		$(".dark-mode").show();

		$(".d-dark").hide();

		$(".d-light").show();

		localStorage.setItem('dark-mode', 'light');
		return false;
	});

	$("#showNav").click(function(){
		$("body").toggleClass('overflow-hidden');
		$(".side-nav").css({"transform":"translateX(0rem)"});
		$('#closeNav').show();
		$(this).hide();
	});

	$("#closeNav").click(function(){
		$("body").removeClass('overflow-hidden');
		$(".side-nav").css({"transform":"translateX(-32rem)"});
		$('#showNav').show();
		$(this).hide();
	});

	$('a.blogLink').each(function() {
		// Get the original URL
		const originalUrl = $(this).attr('href');
		
		// Encode the URL
		const encodedUrl = encodeURIComponent(originalUrl);
		
		// Set the encoded URL as the href attribute
		$(this).attr('href', encodedUrl);
	});
});