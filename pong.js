// Importieren der matter.js-Bibliothek
import Matter from "https://cdn.jsdelivr.net/npm/matter-js@0.14.2/build/matter.min.js";

const { Engine, Render, World, Bodies, Body, Events } = Matter;

// Globale Variable für die Fallgeschwindigkeit
let fallSpeed = 0.1; // Standardwert, kann angepasst werden
import { hand } from "./hand.js";

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
  // const blockType = getRandomBlockType();
  // const blockType = 'square';
  const blockType = "line";
  // const blockType = 'l-block';
  // const blockType = 'reverse-l-block';
  // const blockType = 't-block';
  return createBlock(blockType);
}

// Funktion zum Erstellen eines neuen Blocks
function createBlock(type) {
  //   console.log(hand.palmBaseCenterX);
  const x = 400;
  const y = 0;
  const blockWidth = 40;
  const blockHeight = 40;
  let parts = [];
  const friction = 1;

  switch (type) {
    case "square":
      console.log("Square-Block");
      parts = [
        Bodies.rectangle(x, y, blockWidth, blockWidth),
        Bodies.rectangle(x + 1 + blockWidth, y, blockWidth, blockWidth),
        Bodies.rectangle(x, y + 1 + blockWidth, blockWidth, blockWidth),
        Bodies.rectangle(
          x + 1 + blockWidth,
          y + 1 + blockWidth,
          blockWidth,
          blockWidth
        ),
      ];
      break;
    case "line":
      console.log("Line-Block", y);
      parts = [
        Bodies.rectangle(x, y, blockWidth, blockHeight * 4, {
          friction: friction,
        }),
        // Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, 1, {
        //   friction: friction,
        // }),
        Bodies.rectangle(x, y - blockHeight, blockWidth, 1, {
          friction: friction,
        }),
        Bodies.rectangle(x, y, blockWidth, 1, {
          friction: friction,
        }),
        Bodies.rectangle(x, y + blockHeight, blockWidth, 1, {
          friction: friction,
        }),
      ];
      break;
    case "reverse-l-block":
      console.log("Reverse-L-Block");
      parts = [
        // Basis des L-Blocks
        Bodies.rectangle(x, y, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        // Kurzer Arm des L-Blocks
        Bodies.rectangle(
          x - blockWidth - 1,
          y + 1 + 2 * blockHeight,
          blockWidth,
          blockHeight,
          { render: { fillStyle: "green" } }
        ),
      ];
      break;
    case "l-block":
      console.log("L-Block");
      parts = [
        // Basis des L-Blocks
        Bodies.rectangle(x, y, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        Bodies.rectangle(x, y + 1 + 2 * blockHeight, blockWidth, blockHeight, {
          render: { fillStyle: "green" },
        }),
        // Kurzer Arm des L-Blocks
        Bodies.rectangle(
          x + blockWidth + 1,
          y + 1 + 2 * blockHeight,
          blockWidth,
          blockHeight,
          { render: { fillStyle: "green" } }
        ),
      ];
      break;
    case "t-block":
      console.log("T-Block");
      parts = [
        // Basis des T-Blocks
        Bodies.rectangle(x, y, blockWidth, blockHeight, {
          render: { fillStyle: "blue" },
        }),
        Bodies.rectangle(x - 1 - blockWidth, y, blockWidth, blockHeight, {
          render: { fillStyle: "blue" },
        }),
        Bodies.rectangle(x + 1 + blockWidth, y, blockWidth, blockHeight, {
          render: { fillStyle: "blue" },
        }),
        // Mitte des T-Blocks
        Bodies.rectangle(x, y + 1 + blockHeight, blockWidth, blockHeight, {
          render: { fillStyle: "blue" },
        }),
      ];
      break;
  }

  const block = Body.create({
    parts: parts,
    isStatic: false,
  });

  block.isControllable = true;
  block.hasCollided = false;
  block.mass = 1;
  World.add(engine.world, [block]);
  blocks.push(block);
  return block;
}

// Erster Block
let currentBlock = createRandomBlock();

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

        if (
          pair.bodyA !== ground &&
          pair.bodyA !== ground &&
          pair.bodyA !== leftWall &&
          pair.bodyA !== rightWall &&
          pair.bodyB !== leftWall &&
          pair.bodyB !== rightWall
        ) {
          blocks.forEach(() => {
            if (
              !block.hasCollided &&
              block.parts.some(
                (part) => part === pair.bodyA || part === pair.bodyB
              )
            ) {
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

// ...

function updateBlockPosition() {
  if (currentBlock && currentBlock.isControllable) {
    // Verwenden Sie die Handposition, um die X-Position des Blocks zu setzen
    Body.setPosition(currentBlock, {
      x: hand.palmBaseCenterX,
    });

    // Optional: weitere Steuerungen basierend auf Gesten oder Bewegungen
  }
}

// Ihre Animationsschleife
(function run() {
  Engine.update(engine, 1000 / 60);
  Render.world(render);
  //   updateBlockPosition(); // Aktualisiert die Position des Blocks basierend auf der Handposition

  requestAnimationFrame(run);
})();
