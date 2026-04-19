/* DN1010 Experimental Interaction, Rena Cheong (G02) 2026
 * Week 7 - Style Transfer
 * 
 * Pix2Pix
 * Model: https://github.com/dongphilyoo/pix2pix-ml5-demo
 *
 * Used MS Paint to draw the images to transfer under folder Images > Drawings, the other images were drawn in the live preview
 */

const SIZE = 256;
let inputImg, inputCanvas, outputContainer, statusMsg, transferBtn, clearBtn;

function setup() {
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class("border-box").parent("canvasContainer");

  // Display initial input image
  inputImg = loadImage("images/input_handbag.png", drawImage);   // Changed input image here by editing filename

  outputContainer = select("#output");

  statusMsg = select("#status");

  transferBtn = select("#transferBtn");

  clearBtn = select("#clearBtn");

  clearBtn.mousePressed(function () {
    clearCanvas();
  });

  stroke(0);
  pixelDensity(1);
}

function draw() {
  if (mouseIsPressed) {
    strokeWeight(2);
    stroke(0);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function drawImage() {
  image(inputImg, 0, 0, SIZE, SIZE);

  ml5.pix2pix("models/edges2handbags_AtoB.pict").ready.then((model) => {   // Changed model here by editing filename
    statusMsg.html("Model Loaded!");

    transfer(model);

    transferBtn.mousePressed(function () {
      transfer(model);
    });
  });
}

function clearCanvas() {
  background(255);
}

function transfer(pix2pix) {
  statusMsg.html("Applying Style Transfer...!");

  const canvasElement = select("canvas").elt;

  pix2pix.transfer(canvasElement).then((result) => {
    outputContainer.html("");
    createImg(result.src).class("border-box").parent("output");
    statusMsg.html("Done!");
  });
}
