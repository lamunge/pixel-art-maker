//horrifying global variables
let mouseIsDown;
let colorState = [];
let color = '#000';

//listens for color change, then sets new Color
document.getElementById('color-picker').addEventListener('change', function () {
  color = this.value;
})

document.getElementById('pixel-grid').addEventListener('mousedown',function (e) {
  e.preventDefault(); //stops drag and drop working, which messed up the mouseIsDown logic
  const targetChild = event.target; //to figure out which pixel triggered the event
  colorState = saveColorState(); //in case you want to undo this round of coloring
  targetChild.style.setProperty('background-color',color);
  mouseIsDown = true;
});

document.getElementById('pixel-grid').addEventListener('mousemove',function () {
  if (mouseIsDown) {
    const targetChild = event.target;
    targetChild.style.setProperty('background-color', color);
  }
});

document.getElementById('pixel-grid').addEventListener('mouseup',function () {
  mouseIsDown = false;
});

function removeSnark() {
  //remove any snarky comments so that the snark doesn't keep piling up
  form = document.getElementById('grid-adjustments');
  const snark = form.querySelector('p');
  if (snark != null) {
    form.removeChild(snark);
  }
}

//spawns the correct number of pixels
function spawnPixels(numberToSpawn) {

  //removes all the existing pixels
  const pixelGrid = document.getElementById('pixel-grid');
  while (pixelGrid.firstChild) {
    pixelGrid.removeChild(pixelGrid.firstChild);
  }

  //creates the correct number of new pixels
  for(var i=0;i<numberToSpawn;i++) {
    let pixel = document.createElement('div');
    pixel.className = 'pixel';
    document.getElementById('pixel-grid').appendChild(pixel);
  }
}

//makes the pixel grid as per user specification
function makeGrid(event) {
  event.preventDefault(); //cannot freakin' believe this worked - keeps page from reloading

  removeSnark();

  const height = document.getElementById('grid-height').value;
  const width = document.getElementById('grid-width').value;
  if (isNaN(height) || isNaN(width)) {
    let snark = document.createElement("p");
    snark.innerHTML = 'Height and width must be numbers, you dingbat.';
    document.getElementById('grid-adjustments').append(snark);
    return;
  }
  if (height<0 || width<0) {
    let snark = document.createElement("p");
    snark.innerHTML = 'Height and width must be positive, you dingbat.';
    document.getElementById('grid-adjustments').append(snark);
    return;
  }
  if ((height>75 && width>75) || (height>99 || width >99)) {
    let snark = document.createElement("p");
    snark.innerHTML = 'Don\'t say I didn\'t warn you.';
    document.getElementById('grid-adjustments').append(snark);
  }

  colorState = []; //reset the color state for the new grid

  spawnPixels(height*width);

  //organizes pixels into correct number of columns
  document.getElementById('pixel-grid').style.setProperty(
    'grid-template-columns','repeat('+width+',1fr)');
}

//saves the color state of every pixel to an array, for reloading if user presses undo
function saveColorState() {
  let colorArray = [];
  const pixels = document.getElementsByClassName('pixel');
  //because pixels is an array-like object, not a real array, we can't call
  //forEach() directly on pixels. So we do this instead:
  Array.prototype.forEach.call(pixels, function(element,index,array) {
    colorArray.push(pixels[index].style.getPropertyValue('background-color'));
  })
  return colorArray;
}

function undo() {
  let pixels = document.getElementsByClassName('pixel');
  Array.prototype.forEach.call(pixels, function(element,index,array) {
    pixels[index].style.setProperty('background-color',colorState[index]);
  })
}
