
			// When the mouse moves over the document
			$(document).mousemove(function(e) {
				// Move the cursor follower to the mouse position
				$("#cursorFollower").css({
					left: e.pageX-5,
					top: e.pageY-5
				});

			});

			// When the mouse enters a table
			$("#tablesContainer").on("mouseenter", "td", function() {
				$("#cursorFollower").show();
			});

			// When the mouse leaves a table
			$("#tablesContainer").on("mouseleave", "td", function() {
				$("#cursorFollower").hide();
			});
