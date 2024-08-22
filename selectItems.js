
// Add click event to items
$("#itemList").on("click", ".item", function() {
	selectItem($(this).text());
	$("#uiLog").text("Selected new item by clicking on item deck: " + selectedItem.name);
});

// Add scroll event to items
$("#itemList").on("wheel", function(e) {
	// Prevent the default scroll behavior
	e.preventDefault();
	$("#itemList .item, .eraser").removeClass("selected");
	isSelectEraser = false;
	// Determine the scroll direction
	var delta = e.originalEvent.deltaY;
	if (delta > 0) {
		// Scroll down: select the next item
		selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
	} else {
		// Scroll up: select the previous item
		selectedIndex = Math.max(selectedIndex - 1, 0);
	}
	// Get the selected item data on the webpage, ignore the item pool
	var selectedItemElement = items.eq(selectedIndex).closest('.itemContainer');
	selectedItemElement.find('.item').addClass("selected");
	selectedItem = {
		name: selectedItemElement.find('.item').text(),
		cost: selectedItemElement.find('.itemCost').text(),
		img: selectedItemElement.find('.itemImg').find('img').attr('src')
	};
	// Update the cursor preview
	$("#cursorFollower").html('<img src="' + selectedItem.img + '" >');
	$("#uiLog").text("Selected new item by scrolling on item deck: " + selectedItem.name);
});
var isMouseDown = false;
var isRightClick = false;
		
function selectItem(targetName) {
    // Find the item in itemList that has the same name as targetName
    var itemElement = $("#itemList .item").filter(function() {
        return $(this).text() === targetName;
    });
    if (itemElement.length > 0) {
        // If the item is found, select it
        $("#itemList .item, .eraser").removeClass("selected");
		isSelectEraser = false;
        itemElement.addClass("selected");
        selectedItem.name = itemElement.text();
        selectedItem.cost = itemElement.siblings('.itemCost').text();
        selectedItem.img = itemElement.siblings('.itemImg').find('img').attr('src');
        selectedIndex = $("#itemList .item").index(itemElement);
		$("#cursorFollower").html('<img src="' + selectedItem.img + '" >');
        $("#uiLog").text("Selected item: " + selectedItem.name);
    } else {
        // If the item is not found, create it and select it
        createItem(targetName);
        selectItem(targetName);
        $("#uiLog").text("Created and selected new item: " + selectedItem.name);
    }
}

$("#itemList .eraser").on("click", function() {
	$("#itemList .item").removeClass("selected");
	selectedIndex = -1;
	$(this).addClass("selected");
	isSelectEraser = true;
	$("#cursorFollower").html('<img src=./icons/shovel.png>');
	$("#uiLog").text("Selecting eraser");
});
