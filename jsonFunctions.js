// Export table data as JSON
$("#exportBtn").click(function() {
	var data = [];
	$("#uiLog").text("Clicked export json");
	// Iterate over each table
	$(".tableContainer").each(function(tableIndex, tableContainer) {
		var tableData = [];
		// Get the table name from the labels
		var tableName = $(tableContainer).find("h2").text();
		var columnCount = $(tableContainer).find("tr:first-child td").length;
		for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
			$(tableContainer).find("tr").each(function(rowIndex, row) {
				// Get the cell at the current column index
				var cell = $(row).find("td").eq(columnIndex);
				var cellText = cell.text();
				if (cellText !== "") {
					// if celltext is CurrentLevel object
					if (cellText.includes("@.")){
						cellText = "RTID(" + cellText + ")"
					} else cellText = "RTID(" + cellText + "@ZombieTypes)";
					var itemData = {
					// Cells with "rogue" class will have row -1, otherwise row is the same on table
						"Row": $(cell).hasClass("rogue") ? "-1" : (rowIndex + 1).toString(),
						"Type": cellText
					};
					// If the cell has the "rogue" class, add the custom parameter //for researching
					if ($(cell).hasClass("rogue")) {
//									itemData["Count"] = "69";
					}
					tableData.push(itemData);
				}
			});
		}
		var pfCount = $(tableContainer).find(".pfCount").val();
		if (tableData.length > 0) {
			// If the table has any non-blank items, add its data to the overall data
			data.push({
				"aliases": [tableName],
				"objclass": "SpawnZombiesJitteredWaveActionProps",
				"objdata": {
					"AdditionalPlantfood": (pfCount > 0 ? parseInt(pfCount) : parseInt(0)),
					"Zombies": tableData
				}
			});
		}
	});
	var blob = new Blob([JSON.stringify({objects: data})], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "waves.json");
	$("#uiLog").text("Downloaded as waves.json");
});

// Import JSON file
$("#importFileBtn").click(function() {
	$("#importBtn").click();
	$("#uiLog").text("Clicked import json");
});			
$("#importBtncontrol").change(function() {
	var file = this.files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		if (isCurrentLevel) {$("#currentLevelSwitch").click()};
		var content = JSON.parse(e.target.result);
		var data = content.objects;
		// Iterate over each object in the data
		data.forEach(function(tableData, index) {
			if (tableData.objclass === "SpawnZombiesJitteredWaveActionProps") {
				// Get the table name from the table data
				var tableName = tableData.aliases[0];
				var pfCount = tableData.objdata.AdditionalPlantfood;
				// Determine the number of columns
				var rows = Array(5).fill(0);
				tableData.objdata.Zombies.forEach(function(item) {
					var rowIndex = parseInt(item.Row) - 1;
					rows[rowIndex]++;
				});
				var numColumns = Math.max(3, Math.max(...rows));
				// Create a new table
				var tableContainer = createTable(tableName, numColumns, 5);

				var pfCountInput = tableContainer.find(".pfCount");
				if(pfCount>0) pfCountInput.val(pfCount);
				
				var table = tableContainer.find("table");
				// Populate the table with the items
				tableData.objdata.Zombies.forEach(function(item) {
					var rowIndex = parseInt(item.Row) - 1;
					var row = table.find("tr").eq(rowIndex);
					// Find the first empty cell in the row
					var emptyCell = row.find("td").filter(function() {
						return $(this).text() === "";
					}).first();
					// Add the item to the empty cell
					if (emptyCell.length >= 0) {
						var cellDataName = item.Type.replace("RTID(", "").replace("@ZombieTypes)", "").replace("@CurrentLevel)", "@.").replace("@.)", "@.");
						emptyCell.text(cellDataName);
						selectItem(cellDataName);
						var cellData = itemsPool.find(item => item.name === cellDataName);
						if (cellData){
							if (cellData.img) {
								var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + cellData.img + '" >');
								emptyCell.append(itemImgDiv);
							} else {
								var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + itemImgDefault + '" >');
								emptyCell.append(itemImgDiv);
							}
						} else {
							var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + itemImgDefault + '" >');
							emptyCell.append(itemImgDiv);
						}
					}
				});
			}
		});
		$("#uiLog").text("Done pasting data");
	};
	reader.readAsText(file);
});

$("#importBtn2").change(function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        if (isCurrentLevel) {$("#currentLevelSwitch").click()};
        var content = JSON.parse(e.target.result);
        var data = content.objects;
        // Iterate over each object in the data
        data.forEach(function(tableData, index) {
            if (tableData.objclass === "SpawnZombiesJitteredWaveActionProps") {
                // Get the table name from the table data
                var tableName = tableData.aliases[0];
                var pfCount = tableData.objdata.AdditionalPlantfood;
                
                // Create a new table with 3 columns
                var tableContainer = createTable(tableName, 3, 5);
                var pfCountInput = tableContainer.find(".pfCount");
                if(pfCount>0) pfCountInput.val(pfCount);
                
                var table = tableContainer.find("table");
                var zombies = tableData.objdata.Zombies;
                var colIndex = 0;
                
                // Sort the zombies array by row
                zombies.sort(function(a, b) {
                    return a.Row - b.Row;
                });
                
                // Iterate over each item
                zombies.forEach(function(item, index) {
                    var rowIndex = parseInt(item.Row) - 1;
                    var cell = table.find("tr").eq(rowIndex).find("td").eq(colIndex);
                    var cellDataName = item.Type.replace("RTID(", "").replace("@ZombieTypes)", "").replace("@CurrentLevel)", "@.").replace("@.)", "@.");
                    cell.text(cellDataName);
                    // Add other necessary actions here
                    
                    if (index < zombies.length - 1 && zombies[index + 1].Row !== item.Row) {
                        colIndex++;
                        if (colIndex > 2) {
                            // Call the addColumnBtn function on the current table
                            tableContainer.find(".addColumnBtn").click();
                            colIndex = 2;
                        }
                    }
                });
            }
        });
        $("#uiLog").text("Done pasting data");
    };
    reader.readAsText(file);
});

$("#importBtn").change(function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        if (isCurrentLevel) {$("#currentLevelSwitch").click()};
        var content = JSON.parse(e.target.result);
        var data = content.objects;
        // Iterate over each object in the data
        data.forEach(function(tableData, index) {
            if (tableData.objclass === "SpawnZombiesJitteredWaveActionProps") {
                // Get the table name from the table data
                var tableName = tableData.aliases[0];
                var pfCount = tableData.objdata.AdditionalPlantfood;
                
                // Create a new table with 3 columns
                var tableContainer = createTable(tableName, 3, 5);
                var pfCountInput = tableContainer.find(".pfCount");
                if(pfCount>0) pfCountInput.val(pfCount);
                
                var table = tableContainer.find("table");
                var zombies = tableData.objdata.Zombies;
                
                // Iterate over each column then each row
				for (var colIndex = 0; colIndex < 50; colIndex++) {
					console.log(colIndex + " column index");
					var rogue = false;
					for (var rowIndex = 0; rowIndex < 5; rowIndex++) {
						var cell = table.find("tr").eq(rowIndex).find("td").eq(colIndex);
						// If there are still zombies
						if (zombies.length > 0) {
							// Check if the zombie has a valid Row property and value
							if (!zombies[0].hasOwnProperty("Row") || zombies[0].Row <= 0 || zombies[0].Row > 5) {
								// Set rogue to true and assign the current row index to the zombie's Row
								rogue = true;
								zombies[0].Row = rowIndex + 1;
							}
							// If the next zombie's row matches the current row
							if (parseInt(zombies[0].Row) - 1 === rowIndex) {
								var zombie = zombies.shift();
								var cellDataName = zombie.Type.replace("RTID(", "").replace("@ZombieTypes)", "").replace("@CurrentLevel)", "@.").replace("@.)", "@.");
								cell.text(cellDataName);
								selectItem(cellDataName);
								// done pasting name, now strip the @. to get image
								var cellDataNameforImg = cellDataName.replace("@.", "");
								var cellData = itemsPool.find(item => item.name === cellDataNameforImg);
								if (cellData){
									if (cellData.img) {
										var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + cellData.img + '" >');
										cell.append(itemImgDiv);
									} else {
										var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + itemImgDefault + '" >');
										cell.append(itemImgDiv);
									}
								} else {
									var itemImgDiv = $("<div>").addClass("itemImg").html('<img src="' + itemImgDefault + '" >');
									cell.append(itemImgDiv);
								}
								// Check if the zombie is rogue
								if (rogue) {
									// Add the "rogue" class to the cell
									$(cell).addClass("rogue");
									// Set rogue back to false
									rogue = false;
								}
							}
						}
					}
					if (colIndex >= 2 && zombies.length > 0) tableContainer.find(".addColumnBtn").click();
					// If there are no more zombies, break out of the loop
					if (zombies.length === 0) {
						break;
					}
				}
            }
        });
        $("#uiLog").text("Done pasting data");
    };
    reader.readAsText(file);
});


