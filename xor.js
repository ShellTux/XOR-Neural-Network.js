let cv, ctx;
let nn = new NeuralNetwork(2, 2, 1);
let button;
let training = [{
    inputs: [0, 0],
    targets: [0]
  },
  {
    inputs: [0, 1],
    targets: [1]
  },
  {
    inputs: [1, 0],
    targets: [1]
  },
  {
    inputs: [1, 1],
    targets: [0]
  }
];
let elem;

window.onload = function() {
  setup();
}

const setup = function() {
  cv = document.querySelector('canvas');
  ctx = cv.getContext('2d');
  elem = document.createElement('h2');
  updateElement();
  document.body.appendChild(elem);
  button = document.getElementById('save');
  button.addEventListener('click', function() {
    let save_string = nn.serialize();
    console.log(save_string);

    function download(text, name, type) {
      var a = document.getElementById("a");
      var file = new Blob([text], {
        type: type
      });
      a.href = URL.createObjectURL(file);
      a.download = name;
    }
    download(save_string, 'myfilename.txt', 'text/plain')
  });
  // draw();
  setInterval(draw, 200);
}

const draw = function() {
  background(cv, 'white');
  let w = 5;
  for (let i = 0; i < 1000; i++) {
    training.shuffle();
    for (let a of training) {
      nn.train(a.inputs, a.targets);
    }
  }

  updateElement();

  for (let x = 0; x < cv.width; x += w) {
    for (let y = 0; y < cv.height; y += w) {
      let x1 = map(x, 0, cv.width, 0, 1);
      let y1 = map(y, 0, cv.height, 0, 1);
      // console.log(x1, y1);
      let output = nn.feedforward([x1, y1]);
      // console.log(output);
      let color = Math.round(output[0] * 255);
      cor = `rgb(${color},${color},${color})`;
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, w, w);
    }
  }
}


const updateElement = function() {
  let casas = 3;
  let outputs = [
    Math.round(nn.feedforward([0, 0])[0], casas),
    Math.round(nn.feedforward([0, 1])[0], casas),
    Math.round(nn.feedforward([1, 0])[0], casas),
    Math.round(nn.feedforward([1, 1])[0], casas)
  ];
  elem.innerHTML =
    '[0, 0] => ' + outputs[0] + '<br />' +
    '[0, 1] => ' + outputs[1] + '<br />' +
    '[1, 0] => ' + outputs[2] + '<br />' +
    '[1, 1] => ' + outputs[3];
}
