//listens for color change, then sets new Color
var color = "#000";
$('.color-picker').on('change', function () {
  color = this.value;
})

//changes color of pixel.
var mouseIsDown;
var colorState = [];

$('#pixel-grid').on("mousedown",'.pixel',function (e) {
  e.preventDefault(); //stops drag and drop working, which messed up the mouseIsDown logic
  colorState = saveColorState(); //in case you want to undo this round of coloring
  $(this).css('background-color', color);
  mouseIsDown = true;
});

$('#pixel-grid').on("mousemove",'.pixel',function () {
  if (mouseIsDown) {
    $(this).css('background-color', color);
  }
});

$('#pixel-grid').on("mouseup",'.pixel',function () {
  mouseIsDown = false;
});

//makes the pixel grid as per user specification
function makeGrid(event) {
  event.preventDefault(); //cannot freakin' believe this worked - keeps page from reloading
  $('form').children('p').remove();
  var height = document.getElementById('grid-height').value;
  var width = document.getElementById('grid-width').value;
  if (isNaN(height) || isNaN(width)) {
    $('form').append('<p>Height and width must be numbers, you dingbat.</p>');
    return;
  }
  if (height<0 || width<0) {
    $('form').append('<p>Height and width must be positive, you dingbat.</p>');
    return;
  }
  if (height>75 && width>75) {
    $('form').append('<p>Don\'t say I didn\'t warn you.</p>');
  }

  colorState = [];

  //spqwns the correct number of pixels
  $("#pixel-grid").children().remove();
  for(var i=0;i<height*width;i++) {
    $("#pixel-grid").append('<div class="pixel"></div>');
  }

  //organizes pixels into correct number of columns
  $('#pixel-grid').css("grid-template-columns","repeat("+width+",1fr)");
}

//saves the color state of every pixel to an array, for reloading if user presses undo
function saveColorState() {
  var colorArray = [];
  $('.pixel').each(function() {
    colorArray.push($(this).css("background-color"));
  })
  return colorArray;
}

function undo() {
  var pixels = document.getElementById('pixel-grid').childNodes;
  $('.pixel').each(function(i) {
    $(this).css("background-color",colorState[i]);
  })
}
