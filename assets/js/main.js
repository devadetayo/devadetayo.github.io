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

	$(document).ready(function() {
		var darkMode;
	
		// Check if dark mode is saved in localStorage
		if (localStorage.getItem('dark-mode')) {
			darkMode = localStorage.getItem('dark-mode');
		} else {
			// Check for user's system preference
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				darkMode = 'dark';
			} else {
				darkMode = 'light';
			}
		}
	
		// Apply the initial mode
		if (darkMode === 'dark') {
			$('html').addClass('dark').removeClass('light');
		} else {
			$('html').addClass('light').removeClass('dark');
		}
	
		// Set the initial mode in localStorage
		localStorage.setItem('dark-mode', darkMode);
	
		// Toggle functionality
		$('.toggle').click(function() {
			$('html').toggleClass('dark light');
	
			// Update localStorage based on the current mode
			if ($('html').hasClass('dark')) {
				localStorage.setItem('dark-mode', 'dark');
			} else {
				localStorage.setItem('dark-mode', 'light');
			}
		});
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