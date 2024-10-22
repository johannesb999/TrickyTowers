const { Engine, Render, World, Bodies, Body, Events } = Matter;

// Globale Variable für die Fallgeschwindigkeit
let fallSpeed = 0.35; // Standardwert, kann angepasst werden
// import { hand } from "./hand.js";
let currentBlock;
// Erstellen des Engines
const engine = Engine.create({
  positionIterations: 50, //das hier bringt was aber ist immer noch Müll
  velocityIterations: 50,
  constraintIterations: 2,
});
engine.world.gravity.y = fallSpeed; // Anpassen der Gravitation
// engine.render.options.background = "white";

// Erstellen des Renderers

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    background: "black",
    width: canvasWidth,
    height: canvasHeight,
  },
});

console.log("running")
// Dicke des Bodens
const groundHeight = 60;
// Größe und Position der Plattform
const platformWidth = canvasWidth / 2;
const platformHeight = 30; // Angenommene Dicke der Plattform
const blockHeight = 40; // Angenommene Höhe eines Blocks
const platformY =
  canvasHeight - 2 * blockHeight - groundHeight / 2 + platformHeight / 4;

// Erstellen des Bodens am unteren Ende des Canvas
const ground = Bodies.rectangle(
  canvasWidth / 2,
  canvasHeight + groundHeight / 2 + 200,
  canvasWidth,
  groundHeight,
  { isStatic: true }
);

let platform;

// creatPlatform();
function creatPlatform() {
  // let part = [
  // (stump = Bodies.rectangle(
  //   canvasWidth / 2,
  //   platformY + platformHeight,
  //   platformWidth / 6,
  //   platformHeight * 2.8
  //   // { render: { fillStyle: "#785188" }, isStatic: true }
  // )),
  (platform = Bodies.rectangle(
    canvasWidth / 2,
    platformY,
    platformWidth,
    platformHeight,
    {
      render: { fillStyle: "#848484" },
      isStatic: true,
    }
  )),
    // ];

    // platform = Body.create({
    //   parts: part,
    //   isStatic: true,
    // });
    World.add(engine.world, [platform]);
}
const axisWidth = 10; // Breite der Achse
// const axisHeight = canvasHeight - (platformY - platformHeight / 2);
// const axisY = axisHeight / 2;
// const axisX = canvasWidth - axisWidth / 2; // X-Position der Achse am rechten Rand

const axisX = canvasWidth - axisWidth / 2; // X-Position der Achse am rechten Rand
const axisTopY = 0; // Oberes Ende des Canvas
const axisBottomY = platformY - platformHeight / 2; // Obere Kante der Plattform
const axisHeight = axisBottomY - axisTopY; // Höhe der Achse

// Erstellen und Hinzufügen der Achse zur Welt
const axis = Bodies.rectangle(
  axisX,
  axisTopY + axisHeight / 2,
  axisWidth,
  axisHeight,
  { isStatic: true, isSensor: true }
);
World.add(engine.world, [ground]);

// Nachdem die Achse erstellt und zur Welt hinzugefügt wurde
const axisContext = render.context;

// Zeichnen der Zahl '0' am unteren Ende der Achse
axisContext.fillStyle = "black";
axisContext.font = "20px Arial";
axisContext.fillText("0", axisX - 10, canvasHeight - 10);

// Zeichnen der Zahl '45' am oberen Ende der Achse
axisContext.fillText("45", axisX - 25, 20);

// console.error(platformHeight);
// console.error(canvasHeight);
// console.error(platformY);

// console.error(axisHeight);
// console.error(axisY);

// Erstellen der Achse
// const axis = Bodies.rectangle(axisX, axisY, axisWidth, canvasHeight, { isStatic: true });

// Hinzufügen der Achse zur Welt
// const Lock = Bodies.rectangle(canvasWidth / 2 - 150, platformY + 30, 10, 10, {isStatic: true

// const leftWall = Bodies.rectangle(0, canvasHeight / 2, 10, canvasHeight, {
//   isStatic: true,
// });
// const rightWall = Bodies.rectangle(
//   canvasWidth,
//   canvasHeight / 2,
//   10,
//   canvasHeight,
//   { isStatic: true }
// );

// // Hinzufügen von Boden und Wänden zur Welt
// World.add(engine.world, [ground, leftWall, rightWall]);

// Liste der Blöcke
let blocks = [];

// Liste der möglichen Blocktypen
const blockTypes = [
  "square",
  "square",
  "square",
  "square", // 4x square
  "line",
  "line",
  "line",
  "line", // 4x line
  "l-block",
  "l-block",
  "l-block",
  "l-block", // 4x l-block
  "t-block",
  "t-block",
  "t-block",
  "t-block", // 4x t-block
  "reverse-l-block",
  "reverse-l-block",
  "reverse-l-block",
  "reverse-l-block", // 4x reverse-l-block
  "special-block", // 1x special-block
  // "special-block", // 1x special-block
  // "special-block", // 1x special-block
  // "special-block", // 1x special-block
];
// Funktion, um zufällig einen Blocktyp auszuwählen
function getRandomBlockType() {
  const randomIndex = Math.floor(Math.random() * blockTypes.length);
  return blockTypes[randomIndex];
}

// Modifizierte Funktion zum Erstellen eines neuen Blocks
function createRandomBlock() {
  const blockType = getRandomBlockType();
  // const blockType = "square";
  // const blockType = "line";
  // const blockType = "l-block";
  // const blockType = "reverse-l-block";
  // const blockType = 't-block';
  // const blockType = "special-block";
  return createBlock(blockType);
}

// Funktion zum Erstellen eines neuen Blocks
function createBlock(type) {
  const x = 400;
  const y = 0;
  const blockWidth = 40;
  const blockHeight = 40;
  let parts = [];
  const friction = 1;
  const strokeColor = "black";

  switch (type) {
    case "square":
      // //console.log("Square-Block");
      parts = [
        // Bodies.rectangle(x, y, blockHeight * 2, blockWidth * 2)
        Bodies.rectangle(x, y, blockWidth, blockWidth, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#C900A8",
          },
        }),
        Bodies.rectangle(x + blockWidth, y, blockWidth, blockWidth, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#C900A8",
          },
        }),
        Bodies.rectangle(x, y + blockWidth, blockWidth, blockWidth, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#C900A8",
          },
        }),
        Bodies.rectangle(
          x + blockWidth,
          y + blockWidth,
          blockWidth,
          blockWidth,
          {
            friction: friction,
            render: {
              lineWidth: 3,
              strokeStyle: strokeColor,
              fillStyle: "#C900A8",
            },
          }
        ),
      ];
      break;
    case "line":
      //console.log("Line-Block");
      parts = [
        Bodies.rectangle(x, y, blockWidth, blockHeight * 4, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#009BF5",
          },
        }),
        Bodies.rectangle(x + 0, y - blockHeight, blockWidth - 1, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        Bodies.rectangle(x + 0, y, blockWidth - 1, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        Bodies.rectangle(x + 0, y + blockHeight, blockWidth - 1, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
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
    case "reverse-l-block":
      //console.log("Reverse-L-Block");
      parts = [
        // Basis des L-Blocks
        Bodies.rectangle(x, y, blockWidth, blockHeight * 3, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#7DC300",
          },
        }),
        Bodies.rectangle(x, y - blockHeight / 2, blockWidth, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        Bodies.rectangle(x, y - 1 + blockHeight / 2, blockWidth, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        // Bodies.rectangle(x, y + blockHeight, blockWidth, 1, { friction: friction }),

        // // Basis des L-Blocks
        // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // // Kurzer Arm des L-Blocks
        Bodies.rectangle(
          x - blockWidth,
          y + blockHeight,
          blockWidth,
          blockHeight,
          {
            render: {
              lineWidth: 3,
              strokeStyle: strokeColor,
              fillStyle: "#7DC300",
            },
          }
        ),
      ];
      break;
    case "l-block":
      //console.log("L-Block");
      parts = [
        Bodies.rectangle(x, y, blockWidth, blockHeight * 3, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#FF6400",
          },
        }),
        Bodies.rectangle(x, y - blockHeight / 2, blockWidth, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        Bodies.rectangle(x, y + blockHeight / 2, blockWidth, 1, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        // Bodies.rectangle(x, y + blockHeight, blockWidth, 1, { friction: friction }),

        // // Basis des L-Blocks
        // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, { render: { fillStyle: 'green' } }),
        // // Kurzer Arm des L-Blocks
        Bodies.rectangle(
          x + blockWidth,
          y + blockHeight,
          blockWidth,
          blockHeight,
          {
            render: {
              lineWidth: 3,
              strokeStyle: strokeColor,
              fillStyle: "#FF6400",
            },
          }
        ),
      ];
      break;
    case "t-block":
      //console.log("T-Block");
      parts = [
        // Basis des T-Blocks
        Bodies.rectangle(x, y, blockWidth * 3, blockHeight, {
          friction: friction,
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#544BAD",
          },
        }),
        Bodies.rectangle(x - blockWidth / 2, y, 0.5, blockWidth, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),
        Bodies.rectangle(x + blockWidth / 2, y, 0.5, blockWidth, {
          friction: friction,
          render: { fillStyle: strokeColor },
        }),

        // Bodies.rectangle(x, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
        // Bodies.rectangle(x - 1 - blockWidth, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
        // Bodies.rectangle(x + 1 + blockWidth, y, blockWidth, blockHeight, { render: { fillStyle: 'blue' } }),
        // Mitte des T-Blocks
        Bodies.rectangle(x, y + blockHeight, blockWidth, blockHeight, {
          render: {
            lineWidth: 3,
            strokeStyle: strokeColor,
            fillStyle: "#544BAD",
          },
        }),
      ];
      break;
    case "test-block":
      //console.log("Test-Block");
      parts = [Bodies.rectangle(x, y, blockWidth, blockWidth)];
      break;
    case "special-block":
      parts = [
        Bodies.rectangle(x, y, platformWidth / 2, blockHeight, {
          friction: friction,
          render: {
            sprite: { texture: "hfg2.svg" },
          },
        }),
      ];
      break;
  }

  const block = Body.create({
    parts: parts,
    isStatic: false,
    sleepThreshold: Infinity,
  });

  block.isControllable = true;
  block.hasCollided = false;
  block.customtype = type;
  block.mass = 5;
  World.add(engine.world, [block]);
  blocks.push(block);
  return block;
  // updateColorLabel;
}

const randomColorArray = [
  "#FF6400",
  "#7DC300",
  "#C900A8",
  "#544BAD",
  "#009BF5",
];

let nichtBlocks = [];
function spawnFlyingBlocks(numberOfBlocks) {
  for (let i = 0; i < numberOfBlocks; i++) {
    // Zufällige Positionen und Geschwindigkeiten für die Blöcke festlegen
    const x = i % 2 === 0 ? 0 : canvasWidth; // Blöcke von links oder rechts starten
    const y = Math.random() * canvasHeight + 150; // Zufällige Höhe

    const speed = Math.random() * 5 * (i % 2 === 0 ? 2 : -2); // Geschwindigkeit nach rechts oder links

    const colorIndex = Math.round(Math.random() * randomColorArray.length - 1);
    // //console.log(colorIndex);

    const nichtBlock = Bodies.rectangle(x, y, 40, 40, {
      render: { fillStyle: randomColorArray[colorIndex] },
      isSensor: true,
      // isSleeping: true,
    }); // Größe des nichtBlocks festlegen
    Body.setVelocity(nichtBlock, { x: speed, y: 0 }); // Geschwindigkeit setzen

    World.add(engine.world, nichtBlock); // Block zur Welt hinzufügen
    nichtBlocks.push(nichtBlock); // Block zur Arrayliste der Blöcke hinzufügen

    setTimeout(() => {
      World.remove(engine.world, nichtBlock);
      const index = nichtBlocks.indexOf(nichtBlock);
      if (index > -1) {
        nichtBlocks.splice(index, 1);
      }
    }, 2000);
  }
}

startStopLoop();

function startStopLoop() {
  if (isLoopRunning) {
    // Stoppe den Loop
    isLoopRunning = false;
  } else {
    // Starte den Loop
    isLoopRunning = true;
    loopFunction();
  }
}

function loopFunction() {
  if (isLoopRunning) {
    spawnFlyingBlocks(10); // Erzeuge 10 fliegende Blöcke
    setTimeout(loopFunction, 300); // Setze den Loop alle 5 Sekunden fort
  }
}
function getBlockDimensions(block) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  block.parts.forEach((part) => {
    minX = Math.min(minX, part.bounds.min.x);
    maxX = Math.max(maxX, part.bounds.max.x);
    minY = Math.min(minY, part.bounds.min.y);
    maxY = Math.max(maxY, part.bounds.max.y);
  });

  const width = maxX - minX;
  const height = maxY - minY;

  return { width, height };
}
// Globale Variable, um das Block-Spawning zu steuern
let spawnBlocks = true;
// let newBlock;
// //console.log(spawnBlocks);
// Kollisionserkennung
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((pair) => {
    blocks.forEach((block, index) => {
      if (
        block.parts.some((part) => part === pair.bodyA || part === pair.bodyB)
      ) {
        if (block.customtype === "special-block" && !block.hasCollided) {
          // Speichern der aktuellen Position und Eigenschaften
          const { x, y } = block.position;
          const dimensions = getBlockDimensions(block);
          // console.log(dimensions.width, dimensions.height);

          // Entfernen des aktuellen Blocks
          World.remove(engine.world, block);
          blocks.splice(index, 1);

          // Erstellen und Hinzufügen des neuen statischen Blocks
          const newBlock = Bodies.rectangle(
            x,
            y,
            dimensions.width,
            dimensions.height,
            {
              isStatic: true,
              render: { sprite: { texture: "hfg2.svg" } },
              // Weitere Eigenschaften kopieren
            }
          );

          newBlock.hasCollided = true;
          newBlock.isControllable = false;
          newBlock.customtype = "special-block";
          newBlock.mass = 50;
          World.add(engine.world, newBlock);
          blocks.push(newBlock);
          // console.log(blocks);
        }
        if (pair.bodyA === ground || pair.bodyB === ground) {
          // Logik für Kollision mit dem Boden
          World.remove(engine.world, block); // Entfernen des Blocks
          blocks.splice(index, 1); // Entfernen des Blocks aus der Liste

          if (block === currentBlock) {
            // console.log("Ein fallender Block hat den Boden berührt und wurde entfernt.");
            if (spawnBlocks) {
              currentBlock = createRandomBlock(); // Erzeugen eines neuen Blocks
            }
          }
        } else if (pair.bodyA === platform || pair.bodyB === platform) {
          // Logik für Kollision mit der Plattform

          block.hasCollided = true;

          setTimeout(() => {
            block.isControllable = false; // Block nach 1 Sekunde nicht mehr steuerbar machen

            if (block === currentBlock && spawnBlocks) {
              // console.log("Ein fallender Block hat die Plattform berührt.");
              currentBlock = createRandomBlock(); // Neuen Block nach 1 Sekunde spawnen
            }
          }, 200);

          // Überprüfen, ob die Höhe des Blocks 20 oder darunter ist
          if (block.position.y <= 20) {
            resetGame(); // Deaktivieren des Block-Spawnings
          }

          // Hier die masse ändern;
          // const newMass = block.mass * 10; // Beispiel: Verdopple die Masse
          // Body.setMass(block, newMass);

          // if (block === currentBlock && spawnBlocks) {
          //   currentBlock = createRandomBlock();
          // }
        }

        if (
          pair.bodyA !== ground &&
          pair.bodyA !== ground
          // &&
          // pair.bodyA != axis &&
          // pair.bodyB != axis
          // pair.bodyA !== leftWall &&
          // pair.bodyA !== rightWall &&
          // pair.bodyB !== leftWall &&
          // pair.bodyB !== rightWall
        ) {
          blocks.forEach(() => {
            if (
              !block.hasCollided &&
              block.parts.some(
                (part) => part === pair.bodyA || part === pair.bodyB
              )
            ) {
              block.hasCollided = true; // Setze die Kollisionsflagge
              //console.log("Zwei Blöcke haben kollidiert.");
              // Führen Sie hier die gewünschte Aktion aus
              // Zum Beispiel: Deaktivieren der Steuerbarkeit beider Blöcke
              if (block.position.y <= 20) {
                spawnBlocks = false; // Deaktivieren des Block-Spawnings
              }
              setTimeout(() => {
                block.isControllable = false; // Block nach 1 Sekunde nicht mehr steuerbar machen

                if (block === currentBlock && spawnBlocks) {
                  // console.log("Ein fallender Block hat die Plattform berührt.");
                  currentBlock = createRandomBlock(); // Neuen Block nach 1 Sekunde spawnen
                }
              }, 200);
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
    cache = 40;
  } else if (cache > canvasWidth) {
    cache = canvasWidth;
  }
  // //console.log("Cache:", cache);
  return cache;
}

let lastPalmCenter = null;
let lastChangeTime = Date.now();
let spawnTimer = null;

function updateBlockPosition() {
  if (currentBlock && currentBlock.isControllable) {
    // //console.log("Yes");
    const palmCenter =
      canvasWidth - test(palmBaseCenterX, 0, 1, 0, canvasWidth, false);
    // //console.log("palmBaseCenterX:", palmCenter);
    // Verwenden Sie die Handposition, um die X-Position des Blocks zu setzen
    Body.setPosition(currentBlock, {
      x: palmCenter,
      y: currentBlock.position.y,
    });
    // code zum resetten des games
    if (lastPalmCenter !== palmCenter) {
      lastPalmCenter = palmCenter;
      lastChangeTime = Date.now();

      // Timer zurücksetzen
      clearTimeout(spawnTimer);
      spawnTimer = setTimeout(() => {
        resetGame();
        // //console.log("Blockspawning deaktiviert.");
      }, 7000); // 10 Sekunden
    }
    if (thumbDown) {
      Body.setPosition(currentBlock, {
        x: currentBlock.position.x,
        y: currentBlock.position.y + 10,
      });

      // Optional: weitere Steuerungen basierend auf Gesten oder Bewegungen
    }
  }
}
let scoreboard = [];
function resetGame() {
  // createDemoBlocks(true);
  spawnBlocks = false;
  wasGestureRecognized2 = false;
  platform.isStatic = false;

  setTimeout(() => {
    document.getElementById("gifBox").style.display = "block";
    document.getElementById("gifBox2").style.display = "block";
    document.getElementById("titel").style.display = "block";
    startStopLoop();
  }, 2000);

  blocks.forEach((block) => {
    // Prüfen, ob es sich um einen 'special-block' handelt
    if (block.customtype === "special-block") {
      block.isStatic = false; // Setze isStatic zurück
      // World.remove(engine.world, block); // Entferne den Block aus der Welt
    }
  });
  thumbCheck = false;
  scoreboard.push(highscore);
  console.log(scoreboard);
  // stump.isStatic = false;
}

let wasGestureRecognized = false;
let wasGestureRecognized2 = false;

function updateBlockRotation() {
  if (
    currentBlock &&
    currentBlock.isControllable &&
    currentBlock.customtype != "special-block"
  ) {
    if (fist && !wasGestureRecognized) {
      // Drehen des Blocks um 90° im Uhrzeigersinn
      Body.rotate(currentBlock, -Math.PI / 2);
    }
    wasGestureRecognized = fist; // Aktualisieren der Hilfsvariable
  }
  if (fist === false) wasGestureRecognized = false;
}

let thumbCheck = false;
// Ihre Animationsschleife
(function run() {
  Engine.update(engine, 1000 / 60);
  Render.world(render);
  //   //console.log(actualise);
  if (actualise) {
    updateBlockPosition(); // Aktualisiert die Position des Blocks basierend auf der Handposition
    updateBlockRotation();
  }
  if (victory && !wasGestureRecognized2) {
    // nichtBlocks.forEach((nichtBlock) => {
    //   nichtBlock.isSleeping = true;
    // });
    blocks.forEach((block) => {
      World.remove(engine.world, block);
    });
    blocks = [];
    spawnBlocks = true;
    currentBlock = createRandomBlock();
    creatPlatform();
    startStopLoop();
    // createDemoBlocks(false);
    wasGestureRecognized2 = true;
    victory = false;
  }
  if (thumbUp && !thumbCheck) {
    thumbCheck = true;
    // startStopLoop();
    // resetGame();
  }

  requestAnimationFrame(run);
})();

let stackedBlocksCount = 0;

function calculateTowerHeightInBlocks() {
  let highestBlock = null;
  let minHeight = canvasHeight;

  blocks.forEach((block) => {
    if (block.hasCollided && block.position.y < minHeight) {
      highestBlock = block;
      minHeight = block.position.y;
    }
  });

  if (highestBlock) {
    // //console.log("Test-Start")
    // //console.log(highestBlock.position.y);
    // //console.log(platformHeight);
    // //console.log(canvasHeight);
    const highestY = highestBlock.position.y;
    // //console.log(highestY);
    const towerHeight = canvasHeight - platformHeight - highestY + 17;
    // //console.log(towerHeight);
    // Teilen Sie die Gesamthöhe durch die Höhe eines Blocks
    const heightInBlocks = towerHeight / blockHeight / 2;
    return Math.round(heightInBlocks);
  }

  return 0;
}
let highscore;
function drawStackCount() {
  const ctx = render.context;
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.textAlign = "right";
  highscore = calculateTowerHeightInBlocks();
  ctx.fillText(`${highscore}`, canvasWidth - 10, 30);
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Gestapelte Blöcke`, canvasWidth - 70, 50);
}
(function run() {
  // Zeichne die Anzahl der gestapelten Blöcke in jedem Frame
  drawStackCount();

  requestAnimationFrame(run);
})();
