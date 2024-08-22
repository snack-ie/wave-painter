var modal = document.getElementById("myModal");
var btn = document.getElementById("moreItemBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
  $("#newItemInput").select();
  document.getElementById("modalItems").innerHTML = ""; // clear the modal
  $("#newItemInput").attr("placeholder", "Search...");
  $("#uiLog").text("Clicked load items");
	for (var i = 0; i < itemsPool.length; i++) {
		if (itemsPool[i].name === "0empty") {
			// Add a paragraph break and skip this iteration
			document.getElementById("modalItems").appendChild(document.createElement("p"));
			continue;
		}
		var itemDiv = document.createElement("div");
		var name = document.createTextNode(itemsPool[i].name);
		var img = document.createElement("img");
		itemsPool[i].img ? img.src = itemsPool[i].img : img.src = itemImgDefault;
		itemDiv.appendChild(name);
		itemDiv.appendChild(img);
		itemDiv.onclick = function() {
			// This function will be called when the item is clicked
			createItem(this.textContent); // Add the clicked item to the main list
		}
		document.getElementById("modalItems").appendChild(itemDiv);
		$("#uiLog").text("Loaded items from pool.js");
	}
}


span.onclick = function() {
  modal.style.display = "none";
  $("#uiLog").text("Closed popup");
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
	$("#uiLog").text("Closed popup");
  }
}

// On any changes on the new item input, start searching
$("#newItemInput").on("input", function() {
    var searchValue = $(this).val().toLowerCase();
    var items = $("#modalItems div").get();
	$("#uiLog").text("Searching for " + searchValue);
    items.sort(function(a, b) {
        var aName = $(a).text().toLowerCase();
        var bName = $(b).text().toLowerCase();
        if (aName.startsWith(searchValue) || aName.includes('_' + searchValue)) {
            return -1;
        } else if (bName.startsWith(searchValue) || bName.includes('_' + searchValue)) {
            return 1;
        } else {
            return aName.localeCompare(bName);
        }
    });
    $("#modalItems").empty().append(items);
	
	// Hide the fake line breaks
    $("#modalItems div").each(function() {
        if ($(this).text().toLowerCase().includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

