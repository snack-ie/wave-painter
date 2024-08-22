function updateTableCells() {

	// Update the table cells
	$("#tablesContainer td").off(); // remove existing events
	// Add mousedown event to table cells
	$("#tablesContainer td").mousedown(function(e) {
		e.preventDefault();
		isMouseDown = true;
		$("#uiLog").text("You're not selecting anything");
		// Check if it's a right-click or middle-click
		isRightClick = (e.button == 2);
		isMiddleClick = (e.button == 1);
		var cellText = $(this).text();
		if (isRightClick || isSelectEraser) {
			// Clear the text of the clicked cell
			$(this).text("");
			$(this).removeClass("rogue");
			$("#uiLog").text("Erased cell content");
		} else if (isMiddleClick && cellText) {
			selectItem(cellText);
		} else if (selectedItem) {
			// If the cell's content is the same as the current selected item, add the "rogue" class
			// check condition doesn't really work, but doesn't matter either
			if (cellText === selectedItem.name) {
				$(this).addClass("rogue");
				$("#uiLog").text("Marked cell as random row");
			} 
			else {
				// Set the text of the clicked cell to the selected item
				$(this).text(selectedItem.name);
				var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + selectedItem.img + '" >');
				$(this).append(itemImgDiv);
				$("#uiLog").text("Added item to cell: " + selectedItem.name);
			}
		}
		return false; // prevent text selection
	});
	$(document).mouseup(function(e) {
		isMouseDown = false;
	});
	// Add mouseenter event to table cells
	$("#tablesContainer td").mouseenter(function() {
		var cellText = $(this).text();
		if (isMouseDown) {
			if (isRightClick || isSelectEraser) {
				// Clear the text of the hovered cell
				$(this).text("");
				$(this).removeClass("rogue");
				$("#uiLog").text("Erased cell content with swiping");
			} else if (isMiddleClick && cellText) {
				selectItem(cellText);
			} else if (selectedItem) {
				// If the cell's content is the same as the current selected item, add the "rogue" class
				// check condition doesn't really work, but doesn't matter either
				if (cellText === selectedItem.name) {
					$(this).addClass("rogue");
					$("#uiLog").text("Marked cell as random row while swiping");
				} else {
					// Set the text of the clicked cell to the selected item
					$(this).text(selectedItem.name);
					var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + selectedItem.img + '" >');
					$(this).append(itemImgDiv);
					$("#uiLog").text("Added item to cell while swiping");
				}
			}
		}
	});

	$("#tablesContainer table").contextmenu(function(e) {
		// Prevent the default context menu from showing
		e.preventDefault();
		$("#uiLog").text("Prevented rightclick menu");
	});
	$("#tablesContainer table").on("wheel", function(e) {
		// Prevent the default scroll behavior
		e.preventDefault();
	});
	$("#tablesContainer table").off("wheel").on("wheel", function(e) {
		e.preventDefault();
		e.stopPropagation(); // Add this line to stop the event from bubbling up
		var delta = e.originalEvent.deltaY;
		if (delta > 0) {
			// Scroll down: select the next item
			selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
		} else {
			// Scroll up: select the previous item
			selectedIndex = Math.max(selectedIndex - 1, 0);
		}
		// Remove the selected class from all items
		$("#itemList .item, .eraser").removeClass("selected");
		isSelectEraser = false;
		
		// Add the selected class to the selected item
		var selectedItemElement = items.eq(selectedIndex).closest('.itemContainer');
		selectedItemElement.find('.item').addClass("selected");
		selectedItem = {
			name: selectedItemElement.find('.item').text(),
			cost: selectedItemElement.find('.itemCost').text(),
			img: selectedItemElement.find('.itemImg').find('img').attr('src')
		};
		// Update the cursor preview
		$("#cursorFollower").html('<img src="' + selectedItem.img + '" >');
		$("#uiLog").text("Selected new item by scrolling on table: "+selectedItem.name);
	});
	
	// Wheel function for PF count
	$("#tablesContainer .pfCount").off("wheel").on("wheel", function(e){
		e.preventDefault();
		e.stopPropagation();
		var pfCountInput = $(this).val();
		var delta = e.originalEvent.deltaY;
		if (delta > 0) {
			if (pfCountInput > 0) pfCountInput-- ;
			$(this).val(pfCountInput);
			updatePlantFood($(this).closest('.tableContainer'));
		} else {
			pfCountInput++;
			$(this).val(pfCountInput);
			updatePlantFood($(this).closest('.tableContainer'));
		}
		if(pfCountInput > 0){
			$(this).css('color', '#0f0');
		} else {
			$(this).css('color', '#acd');
		}
	});
	// Input function for PF count
	$("#tablesContainer .pfCount").change(function(e) {
		var pfCountInput = $(this).val();
		if(pfCountInput > 0){
			$(this).css('color', '#0f0');
		} else {
			$(this).css('color', '#acd');
		}
	});

}
// Add mouseup event to the document
$(document).mouseup(function() {
	isMouseDown = false;
	
});

updateTableCells();

var tableCount = 1;

function createTable(tableName, columnCount, rowCount) {
	// Table elements
	var label = $("<h2>").text(tableName).attr("contenteditable", "true");
	var pfCount = $("<input>").addClass("pfCount").attr("id", 'pfCount').attr("min", "0").attr("placeholder", "0");
	var pfCountTxt = $("<t>").addClass("pfCountTxt").text("Plant Food");
	var addColumnBtn = $("<button>").addClass("addColumnBtn").text("|→");
	var deleteColumnBtn = $("<button>").addClass("deleteColumnBtn").text("|←");
	var addTableBtn = $("<button>").addClass("addTableBtn").text("New Wave");
	var deleteTableBtn = $("<button>").addClass("deleteTableBtn").text("Delete Wave");
	// Table itself
	var table = $("<table>");
	for (var i = 0; i < rowCount; i++) {
		var row = $("<tr>");
		for (var j = 0; j < columnCount; j++) {
			row.append("<td></td>");
		}
		table.append(row);
	}
	
	// Table elements container
	var titleDiv = $("<div>").addClass("title");
	var headerDiv = $("<div>").addClass("header");
	var headBtnsDiv = $("<div>").addClass("headbtns");
	var tableDiv = $("<div>").addClass("table");
	var footBtnsDiv = $("<div>").addClass("footbtns");
	var footerDiv = $("<div>").addClass("footer");
	
	// Group elements into containers
	titleDiv.append(label);
	headerDiv.append(pfCount);
	headerDiv.append(pfCountTxt);
	headBtnsDiv.append(deleteTableBtn);
	headBtnsDiv.append(addTableBtn);
	tableDiv.append(table);
	footBtnsDiv.append(deleteColumnBtn);
	footBtnsDiv.append(addColumnBtn);
//			var waveCost = $("<div>").text("Wave Cost");  // Replace later
//			footerDiv.append(waveCost);
	
	// Group all containers into tableContainer
	var tableContainer = $("<div>").addClass("tableContainer");
	tableContainer.append(titleDiv);
	tableContainer.append(headerDiv);
	tableContainer.append(headBtnsDiv);
	tableContainer.append(tableDiv);
	tableContainer.append(footBtnsDiv);
	tableContainer.append(footerDiv);
	// Add the container to the tables container
	$("#tablesContainer").append(tableContainer);
	// Update the table cells
	updateTableCells();
	$("#uiLog").text("Created new table");
	
	// Add click event to the add column button
	addColumnBtn.click(function() {
		// Add a new column to each row in the table
		table.find("tr").each(function() {
			$(this).append("<td></td>");
		});
		// Update the table cells
		updateTableCells();
		$("#uiLog").text("Added new column");
	});

	// Add click event to the delete column button
	deleteColumnBtn.click(function() {
		// Check if the rightmost column is empty
		var isEmpty = true;
		table.find("tr").each(function() {
			var lastCell = $(this).find("td").last();
			if (lastCell.text() !== "") {
				isEmpty = false;
				return false; // break the loop
			}
			$("#uiLog").text("Right-most column still has stuff, clear it first before deleting column");
		});
		if (isEmpty) {
			// Delete the rightmost column
			table.find("tr").each(function() {
				$(this).find("td").last().remove();
			});
			// Update the table cells
			updateTableCells();
			$("#uiLog").text("Deleted right-most column");
		}
	});

	// Add click event to the add table button
	addTableBtn.click(function() {
		var newTable = createTable("Wave" + (++tableCount), columnCount, rowCount);
		tableContainer.after(newTable);
	});

	// Add click event to the delete table button
	deleteTableBtn.click(function() {
		// Delete the parent table container
		$(this).parent().parent().remove();
	});

	return tableContainer;
}

function updatePlantFood(tableElement) {
    var plantfoodCount = parseInt(tableElement.find(".pfCount").val(), 10); // get the number of plantfoodCount
    var columnCount = tableElement.find('tr:first td').length; // get the column count of the table
    tableElement.find("td").removeClass("plantfood"); // remove "plantfood" class from all cells
    for (var i = 0; i < columnCount; i++) { // iterate over each column
        tableElement.find('tr').each(function() { // iterate over each cell in the column
            var cell = $(this).find('td').eq(i);
            if (cell.text() !== "" && plantfoodCount > 0) { // if a cell is not empty
                cell.addClass("plantfood"); // add "plantfood" class to the cell
                plantfoodCount--; // subtract plantfoodCount by 1
            }
        });
        if (plantfoodCount === 0) { // if the plantfoodCount is 0
            return false; // break out of the loop
        }
    }
}

// Call updatePlantFood whenever the pfCount value is changed
$("#tablesContainer").on("change", ".pfCount", function() {
    updatePlantFood($(this).closest('.tableContainer'));
});

// Call updatePlantFood whenever the mouse is clicked within #tablesContainer
$("#tablesContainer").on("click", function() {
    $(this).find('.tableContainer').each(function() {
        updatePlantFood($(this));
    });
});

// Call updatePlantFood whenever the scroll wheel is used within #tablesContainer
$("#tablesContainer").on("wheel", function() {
    $(this).find('.tableContainer').each(function() {
        updatePlantFood($(this));
    });
});
// Call updatePlantFood whenever the right mouse button is clicked within #tablesContainer
$("#tablesContainer").on("contextmenu", function() {
    $(this).find('.tableContainer').each(function() {
        updatePlantFood($(this));
    });
    return false;
});

// Call updatePlantFood whenever the mouse is dragged within #tablesContainer
$("#tablesContainer").on("mousemove", function(e) {
    if (e.buttons === 1 || e.buttons === 2) {
        $(this).find('.tableContainer').each(function() {
            updatePlantFood($(this));
        });
    }
});


