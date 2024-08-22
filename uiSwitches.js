var imgSize = $("#imgSizeSlider").val();
$("#imgSizeSlider").on("input", function() {
    imgSize = $(this).val();
    $("#tablesContainer .itemImg img").css('width', imgSize + 'px');
	$("#tablesContainer .itemImg img").css('height', imgSize + 'px');
	$("#imgSizeSliderTxt").text("Image size: "+imgSize);
});
$("#imgSizeSlider").on("wheel", function(e) {
	// Prevent the default scroll behavior
	e.preventDefault();
	// Determine the scroll direction
	var delta = e.originalEvent.deltaY;
	if (delta > 0) {
		imgSize-=10;
		if(imgSize<0) imgSize=0;
	} else {
		imgSize+=10;
		if(imgSize>100) imgSize=100;
	}
	$("#tablesContainer .itemImg img").css('width', imgSize + 'px');
	$("#tablesContainer .itemImg img").css('height', imgSize + 'px');
	$("#imgSizeSliderTxt").text("Image size: "+imgSize);
});

var fontSize = $("#fontSizeSlider").val();
$("#fontSizeSlider").on("input", function() {
    var fontSize = $(this).val();
    $("#tablesContainer td").css('font-size', fontSize + 'px');
	$("#fontSizeSliderTxt").text("Text size: "+fontSize);
});
$("#fontSizeSlider").on("wheel", function(e) {
	// Prevent the default scroll behavior
	e.preventDefault();
	// Determine the scroll direction
	var delta = e.originalEvent.deltaY;
	if (delta > 0) {
		fontSize-=3;
		if(fontSize<0) fontSize=0;
	} else {
		fontSize+=3;
		if(fontSize>24) fontSize=24;
	}
    $("#tablesContainer td").css('font-size', fontSize + 'px');
	$("#fontSizeSliderTxt").text("Text size: "+fontSize);
});

$("#rowHeightSlider").on("input", function() {
    var size = $(this).val();
    $("#tablesContainer td").css('height', size + 'px');
	$("#rowHeightSliderTxt").text("Row height: "+size);
});

$("#resizeTableSwitch").change(function() {
    if (this.checked) {
		$("#tablesContainer td").css({
			'max-width': 'fit-content'
        });
    } else {
		$("#tablesContainer td").css({
			'max-width': '50px'
        });
    }
});

$("#showCostSwitch").change(function() {
    if (this.checked) {
		$("#itemList .itemCost").show();
    } else {
		$("#itemList .itemCost").hide();
    }
});

$("#showHeaderSwitch").change(function() {
    if (this.checked) {
		$("#tablesContainer .header").show();
    } else {
		$("#tablesContainer .header").hide();
    }
});

$("#showButtonSwitch").change(function() {
    if (this.checked) {
		$("#tablesContainer .headbtns").show();
		$("#tablesContainer .footbtns").show();
    } else {
		$("#tablesContainer .headbtns").hide();
		$("#tablesContainer .footbtns").hide();
    }
});

$("#showLogSwitch").change(function() {
    if (this.checked) {
		$("#uiLog").show();
    } else {
		$("#uiLog").hide();
    }
});

$("#currentLevelSwitch").change(function() {
    if (this.checked) {
		isCurrentLevel = true;
    } else {
		isCurrentLevel = false;
    }
});

