const { Engine, Render, World, Bodies, Body, Events } = Matter;

// Globale Variable für die Fallgeschwindigkeit
let fallSpeed = 0.05; // Standardwert, kann angepasst werden
// import { hand } from "./hand.js";
let currentBlock;
// Erstellen des Engines
const engine = Engine.create();
engine.world.gravity.y = fallSpeed; // Anpassen der Gravitation

// Erstellen des Renderers
const canvasWidth = 800;
const canvasHeight = 900;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // fillStyle: 'red',
    width: canvasWidth,
    height: canvasHeight,
  },
});

// Dicke des Bodens
const groundHeight = 60;
// Größe und Position der Plattform
const platformWidth = canvasWidth / 3;
const platformHeight = 200; // Angenommene Dicke der Plattform
const blockHeight = 20; // Angenommene Höhe eines Blocks
const platformY =
  canvasHeight - 2 * blockHeight - groundHeight / 2 + platformHeight / 4;

// Erstellen des Bodens am unteren Ende des Canvas
const ground = Bodies.rectangle(
  canvasWidth / 2,
  canvasHeight + groundHeight / 2,
  canvasWidth,
  groundHeight,
  { isStatic: true }
);
const platform = Bodies.rectangle(
  canvasWidth / 2,
  platformY,
  platformWidth,
  platformHeight,
  { isStatic: true }
);
const leftWall = Bodies.rectangle(-30, 500, 60, 1000, { isStatic: true });
const rightWall = Bodies.rectangle(830, 500, 60, 1000, { isStatic: true });

// Hinzufügen von Boden und Wänden zur Welt
World.add(engine.world, [ground, platform, leftWall, rightWall]);

// Liste der Blöcke
let blocks = [];

// Liste der möglichen Blocktypen
const blockTypes = ["square", "line", "l-block", "t-block", "reverse-l-block"];

// Funktion, um zufällig einen Blocktyp auszuwählen
function getRandomBlockType() {
  const randomIndex = Math.floor(Math.random() * blockTypes.length);
  return blockTypes[randomIndex];
}

// Modifizierte Funktion zum Erstellen eines neuen Blocks
function createRandomBlock() {
  const blockType = getRandomBlockType();
  // const blockType = 'square';
  // const blockType = "line";
  // const blockType = 'l-block';
  // const blockType = 'reverse-l-block';
  // const blockType = 't-block';
  return createBlock(blockType);
}

// Funktion zum Erstellen eines neuen Blocks
function createBlock(type) {
  const x = 400;
  const y = 0;
  const blockWidth = 40;
  const blockHeight = 40;
  let parts = [];
  const friction = 0;

  switch (type) {
      case 'square':
          console.log("Square-Block");
          parts =[ 
              Bodies.rectangle(x, y, blockWidth, blockWidth),
              Bodies.rectangle(x + blockWidth, y, blockWidth, blockWidth),
              Bodies.rectangle(x, y + blockWidth, blockWidth, blockWidth),
              Bodies.rectangle(x + blockWidth, y + blockWidth, blockWidth, blockWidth) 
          ]
          break;
      case 'line':
          console.log("Line-Block");
          parts = [
              Bodies.rectangle(x, y, blockWidth, blockHeight * 4, { friction: friction }),
              Bodies.rectangle(x, y - blockHeight, blockWidth, 1, { friction: friction }),
              Bodies.rectangle(x, y, blockWidth, 1, { friction: friction }),
              Bodies.rectangle(x, y + blockHeight, blockWidth, 1, { friction: friction }),
              // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, 1, {
              //   friction: friction,
              // }),
              // Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, {
              //   friction: friction,
              // }),
              // Bodies.rectangle(x, y + 1 + 3 * blockHeight, blockWidth, blockHeight, {
              //   friction: friction,
              // }),
            ];
          break;
      case 'reverse-l-block':
          console.log("Reverse-L-Block");
          parts = [
              // Basis des L-Blocks
              Bodies.rectangle(x, y, blockWidth, blockHeight * 3, { friction: friction }),
              Bodies.rectangle(x, y - blockHeight / 2, blockWidth, 1, { friction: friction }),
              Bodies.rectangle(x, y + blockHeight / 2, blockWidth, 1, { friction: friction }),
              // Bodies.rectangle(x, y + blockHeight, blockWidth, 1, { friction: friction }),



              // // Basis des L-Blocks
              // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
              // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
              // Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
              // // Kurzer Arm des L-Blocks
              Bodies.rectangle(x - blockWidth, y +  blockHeight, blockWidth, blockHeight, { render: { strokeStyle: 'green' } })
          ];
          break;
      case 'l-block':
              console.log("L-Block");
              parts = [
                  Bodies.rectangle(x, y, blockWidth, blockHeight * 3, { friction: friction }),
                  Bodies.rectangle(x, y - blockHeight / 2, blockWidth, 1, { friction: friction }),
                  Bodies.rectangle(x, y + blockHeight / 2, blockWidth, 1, { friction: friction }),
                  // Bodies.rectangle(x, y + blockHeight, blockWidth, 1, { friction: friction }),



                  // // Basis des L-Blocks
                  // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
                  // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
                  // Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
                  // // Kurzer Arm des L-Blocks
                  Bodies.rectangle(x + blockWidth, y +  blockHeight, blockWidth, blockHeight, { render: { sprite: { texture: 'large-green-square_1f7e9.png'} } })
              ];
          break;    
      case 't-block':
          console.log("T-Block");
          parts = [
              // Basis des T-Blocks
              Bodies.rectangle(x, y, blockWidth * 3, blockHeight, { friction: friction }),
              Bodies.rectangle(x - blockWidth / 2, y, 0.5, blockWidth, { friction: friction }),
              Bodies.rectangle(x + blockWidth / 2, y, 0.5, blockWidth, { friction: friction }),


              // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
              // Bodies.rectangle(x - 1 - blockWidth, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
              // Bodies.rectangle(x + 1 + blockWidth, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
              // Mitte des T-Blocks
              Bodies.rectangle(x, y + blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'blue' } })
          ];
          break;
      case 'test-block':
          console.log("Test-Block");
          parts = [Bodies.rectangle(x, y, blockWidth, blockWidth),]
  }

  const block = Body.create({
      parts: parts,
      isStatic: false
  });
  
  block.isControllable = true;
  block.hasCollided = false;
  // block.mass = 1;
  World.add(engine.world, [block]);
  blocks.push(block);
  return block;
}

// Erster Block
// let currentBlock = createRandomBlock();

// Event-Listener für Tastatureingaben

// Globale Variable, um das Block-Spawning zu steuern
let spawnBlocks = true;
console.log(spawnBlocks);
// Kollisionserkennung
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((pair) => {
    blocks.forEach((block, index) => {
      if (
        block.parts.some((part) => part === pair.bodyA || part === pair.bodyB)
      ) {
        if (pair.bodyA === ground || pair.bodyB === ground) {
          // Logik für Kollision mit dem Boden
          World.remove(engine.world, block); // Entfernen des Blocks
          blocks.splice(index, 1); // Entfernen des Blocks aus der Liste

          if (block === currentBlock) {
            console.log(
              "Ein fallender Block hat den Boden berührt und wurde entfernt."
            );
            if (spawnBlocks) {
              currentBlock = createRandomBlock(); // Erzeugen eines neuen Blocks
            }
          }
        } else if (pair.bodyA === platform || pair.bodyB === platform) {
          // Logik für Kollision mit der Plattform
          block.isControllable = false;
          block.hasCollided = true;

          // Überprüfen, ob die Höhe des Blocks 20 oder darunter ist
          if (block.position.y <= 20) {
            spawnBlocks = false; // Deaktivieren des Block-Spawnings
          }

          // Hier die masse ändern;
          // const newMass = block.mass * 10; // Beispiel: Verdopple die Masse
          // Body.setMass(block, newMass);

          if (block === currentBlock && spawnBlocks) {
            console.log("Ein fallender Block hat die Plattform berührt.");
            currentBlock = createRandomBlock();
          }
        }

        if (pair.bodyA !== ground && pair.bodyA !== ground && pair.bodyA !== leftWall && pair.bodyA !== rightWall && pair.bodyB !== leftWall && pair.bodyB !== rightWall) {
          blocks.forEach(() => {
            if (!block.hasCollided && block.parts.some((part) => part === pair.bodyA || part === pair.bodyB)) {
              block.hasCollided = true; // Setze die Kollisionsflagge
              console.log("Zwei Blöcke haben kollidiert.");
              // Führen Sie hier die gewünschte Aktion aus
              // Zum Beispiel: Deaktivieren der Steuerbarkeit beider Blöcke
              if (block.position.y <= 20) {
                spawnBlocks = false; // Deaktivieren des Block-Spawnings
              }
              block.isControllable = false;
              block.hasCollided = true;

              if (block === currentBlock && spawnBlocks) {
                currentBlock = createRandomBlock();
              }
            }
          });
        }
      }
    });
  });
});

function test(value, startLow, startHigh, endLow, endHigh, reverse) {
  let cache;
  if (reverse) {
    cache =
      ((startHigh - value) / Math.abs(startHigh - startLow)) *
        Math.abs(endHigh - endLow) +
      endLow;
  } else {
    cache =
      ((value - startLow) / Math.abs(startHigh - startLow)) *
        Math.abs(endHigh - endLow) +
      endLow;
  }
  if (cache < 0) {
    cache = 0;
  } else if (cache > canvasWidth) {
    cache = canvasWidth;
  }
  // console.log("Cache:", cache);
  return cache;
}



let lastPalmCenter = null;
let lastChangeTime = Date.now();
let spawnTimer = null;

function updateBlockPosition() {
  if (currentBlock && currentBlock.isControllable) {
    // console.log("Yes");
    const palmCenter = canvasWidth - test(palmBaseCenterX, 0, 1, 0, canvasWidth, false);
    console.log("palmBaseCenterX:",palmCenter);
    // Verwenden Sie die Handposition, um die X-Position des Blocks zu setzen
    Body.setPosition(currentBlock, {
      x: palmCenter,
      y: currentBlock.position.y
    });


    // code zum resetten des games
    if (lastPalmCenter !== palmCenter) {
      lastPalmCenter = palmCenter;
      lastChangeTime = Date.now();

      // Timer zurücksetzen
      clearTimeout(spawnTimer);
      spawnTimer = setTimeout(() => {
        spawnBlocks = false;
        console.log("Blockspawning deaktiviert.");
      }, 10000); // 10 Sekunden
    }
    // Optional: weitere Steuerungen basierend auf Gesten oder Bewegungen
  }
}


let wasGestureRecognized = false;
let wasGestureRecognized2 = false;

function updateBlockRotation() {
  if (currentBlock && currentBlock.isControllable) {
    if (fist && !wasGestureRecognized) {
      // Drehen des Blocks um 90° im Uhrzeigersinn
      Body.rotate(currentBlock, Math.PI / 2);
    }
    wasGestureRecognized = fist; // Aktualisieren der Hilfsvariable
  }
  if(fist === false) wasGestureRecognized = false;
}


// Ihre Animationsschleife
(function run() {
  Engine.update(engine, 1000 / 60);
  Render.world(render);
  //   console.log(vneiwdjlfdgswopg);
  if (vneiwdjlfdgswopg) {
    updateBlockPosition(); // Aktualisiert die Position des Blocks basierend auf der Handposition
    updateBlockRotation();
  }
  if(victory && !wasGestureRecognized2) {
    currentBlock = createRandomBlock();
    wasGestureRecognized2 = true;
  }

  requestAnimationFrame(run);
})();
