const boxSpecs = {
  boxWidth: 10,
  boxHeight: 10,
  boxMargin: 0
};

const state = {
  canFillBoxes: false
};

// 0 === white space  === white
// 1 === obstacles    === black
// 2 === your path    === red
// 3 === end          === blue

const testMap = [
  [1, 3, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map = createMap(100, 100);
// const map = testMap;

// const startSpecs = {x: 10, y: 10};
// const endSpecs = {x: 80, y: 80};

// map = addStartToMap(map);
// map = addEndToMap(map);

const divMatrix = createDivMatrix(map);
const displayableGrid = createDisplayableGrid(divMatrix, boxSpecs);

displayGrid(displayableGrid);
paintMapToDisplayableGrid(map, divMatrix);

runGame(map);

// setTimeout(() => paintMapToDisplayableGrid(testMap, divMatrix), 3000);
// paintMapToDisplayableGrid(testMap, divMatrix);


function runGame(map) {

  setInterval(() => {

    if (!hasFoundEnd(map)) {
      moveCloserToEnd(map);
    }

    paintMapToDisplayableGrid(map, divMatrix);

  }, 20);
}

function hasFoundEnd(map) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  const endFlag = 3;

  const rows = map.length;
  const columns = map[0].length;

  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < columns; j++) {

      if (map[i][j] === endFlag) {
        return false;
      }
    }
  }

  return true;
}

function moveCloserToEnd(map) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  const endCoordinates = getEndCoordinates(map);
  const closestPlayerCoordinates = getClosestPlayerCoordinatesToEnd(map, endCoordinates);

  const coordinates = {
    endCoordinates: endCoordinates,
    closestPlayerCoordinates: closestPlayerCoordinates
  };

  moveCloser(map, coordinates);
}

function getEndCoordinates(map) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  const endFlag = 3;

  const rows = map.length;
  const columns = map[0].length;

  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < columns; j++) {

      if (map[i][j] === endFlag) {
        return {row: i, column: j};
      }
    }
  }

  return null;
}

function getClosestPlayerCoordinatesToEnd(map, endCoordinates) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  const rows = map.length;
  const columns = map[0].length;

  const closedCoordinatesFound = {row: 0, column: 0};
  let closestDistanceFound = 9999999;

  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < columns; j++) {

      if (map[i][j] === 2 && isValidClosestCoordinates(map, { row: i, column: j })) {

        const currentCoordinates = { row: i, column: j };
        const distanceToEnd = getDistanceToCoordinates(currentCoordinates, endCoordinates);

        if (distanceToEnd < closestDistanceFound) {

          closedCoordinatesFound.row = i;
          closedCoordinatesFound.column = j;
          closestDistanceFound = distanceToEnd;
        }
      }
    }
  }

  return closedCoordinatesFound;
}

function isValidClosestCoordinates(map, coordinates) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  if (typeof coordinates !== 'object' || coordinates === null || Array.isArray(coordinates)) {
    return;
  }

  const mapRows = map.length;
  const mapColumns = map[0].length;

  const chosenRow = coordinates.row;
  const chosenColumn = coordinates.column;

  if (chosenRow < 0 || chosenRow > mapRows - 1) {
    return false;
  }

  if (chosenColumn < 0 || chosenColumn > mapColumns - 1) {
    return false;
  }

  const obstacleFlag = 1;

  if (map[chosenRow] === undefined || map[chosenRow][chosenColumn] === undefined) {
    return false;
  }

  if (map[chosenRow][chosenColumn] === obstacleFlag) {
    return false;
  }

  const chosenRowBelow = chosenRow + 1;
  const chosenRowAbove = chosenRow - 1;
  const chosenColumnRight = chosenColumn + 1;
  const chosenColumnLeft = chosenColumn - 1;

  if (map[chosenRowAbove] && map[chosenRowAbove][chosenColumn] === 0) {
    return true;
  }

  if (map[chosenRow][chosenColumnRight] === 0) {
    return true;
  }

  if (map[chosenRowBelow] && map[chosenRowBelow][chosenColumn] === 0) {
    return true;
  }

  if (map[chosenRow][chosenColumnLeft] === 0) {
    return true;
  }

  return false;
}

function getDistanceToCoordinates(currentCoordinates, targetCoordinates) {

  if (typeof currentCoordinates !== 'object' || currentCoordinates === null || Array.isArray(currentCoordinates)) {
    return 0;
  }

  if (typeof targetCoordinates !== 'object' || targetCoordinates === null || Array.isArray(targetCoordinates)) {
    return 0;
  }

  if (typeof currentCoordinates.row !== 'number' || typeof currentCoordinates.column !== 'number') {
    return 0;
  }

  if (typeof targetCoordinates.row !== 'number' || typeof targetCoordinates.column !== 'number') {
    return 0;
  }

  return Math.abs((targetCoordinates.row - currentCoordinates.row) ** 2 + (targetCoordinates.column - currentCoordinates.column) ** 2);
}

function moveCloser(map, coordinates) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  if (typeof coordinates !== 'object' || coordinates === null || Array.isArray(coordinates)) {
    return;
  }

  const endCoordinates = coordinates.endCoordinates;
  const closestPlayerCoordinates = coordinates.closestPlayerCoordinates;

  if (typeof endCoordinates !== 'object' || endCoordinates === null || Array.isArray(endCoordinates)) {
    return;
  }

  if (typeof closestPlayerCoordinates !== 'object' || closestPlayerCoordinates === null || Array.isArray(closestPlayerCoordinates)) {
    return;
  }

  const closerVerticalCoordinatesUp = { row: closestPlayerCoordinates.row - 1, column: closestPlayerCoordinates.column };
  const closerVerticalCoordinatesDown = { row: closestPlayerCoordinates.row + 1, column: closestPlayerCoordinates.column };
  const closerHorizontalCoordinatesRight = { row: closestPlayerCoordinates.row, column: closestPlayerCoordinates.column + 1 };
  const closerHorizontalCoordinatesLeft = { row: closestPlayerCoordinates.row, column: closestPlayerCoordinates.column - 1 };

  const possibleCloserCoordinates = [
    closerVerticalCoordinatesUp,
    closerVerticalCoordinatesDown,
    closerHorizontalCoordinatesRight,
    closerHorizontalCoordinatesLeft
  ];

  let closerCoordinates = closestPlayerCoordinates;
  let closerDistance = 9999999;

  for (let i = 0; i < 4; i++) {

    const possibleCloserDistance = getDistanceToCoordinates(possibleCloserCoordinates[i], endCoordinates);

    if (possibleCloserDistance < closerDistance && isValidMapPlacement(map, possibleCloserCoordinates[i])) {
      closerCoordinates = possibleCloserCoordinates[i];
      closerDistance = possibleCloserDistance;
    }
  }

  const closestRow = closerCoordinates.row;
  const closestColumn = closerCoordinates.column;

  map[closestRow][closestColumn] = 2;
}

function isValidMapPlacement(map, coordinates) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  if (typeof coordinates !== 'object' || coordinates === null || Array.isArray(coordinates)) {
    return;
  }

  const mapRows = map.length;
  const mapColumns = map[0].length;

  const chosenRow = coordinates.row;
  const chosenColumn = coordinates.column;

  if (chosenRow < 0 || chosenRow > mapRows - 1) {
    return false;
  }

  if (chosenColumn < 0 || chosenColumn > mapColumns - 1) {
    return false;
  }

  const obstacleFlag = 1;
  const pathFlag = 2;

  if (map[chosenRow][chosenColumn] === obstacleFlag || map[chosenRow][chosenColumn] === pathFlag) {
    return false;
  }

  return true;
}

function createMap(rows, columns) {

  if (typeof rows !== 'number') {
    return [];
  }

  if (typeof columns !== 'number') {
    return [];
  }

  const map = [];

  for (let i = 0; i < rows; i++) {

    const row = [];

    for (let j = 0; j < columns; j++) {
      row.push(0);
    }
    
    map.push(row);
  }

  map[rows - 2][1] = 2;
  map[1][columns - 2] = 3;

  return map;
}

function addStartToMap(map) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return [];
  }

  const rows = map.length;
  const columns = map[0].length;

  
}

function createDivMatrix(map) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return [];
  }

  const rows = map.length;
  const columns = map[0].length;
  const mapMatrix = [];

  for (let i = 0; i < rows; i++) {

    const row = [];

    for (let j = 0; j < columns; j++) {

      const box = document.createElement('div');
      row.push(box);
    }

    mapMatrix.push(row);
  }

  return mapMatrix;
}

function createDisplayableGrid(divMatrix, boxSpecs) {

  if (!Array.isArray(divMatrix) || !Array.isArray(divMatrix[0])) {
    return;
  }

  const displayableGrid = document.createElement('div');
  const rows = divMatrix.length;

  for (let i = 0; i < rows; i++) {

    const divRow = divMatrix[i];
    const displayableRow = createDisplayableGridRow(divRow, boxSpecs);

    Array.from(displayableRow.children).forEach((box, j) => box.setAttribute('pos', `${i}-${j}`));
    displayableGrid.appendChild(displayableRow);
  }

  displayableGrid.addEventListener('mousedown', onGridMouseDown);
  displayableGrid.addEventListener('mouseup', onGridMouseUp);
  displayableGrid.addEventListener('mouseleave', onGridMouseLeave);

  return displayableGrid;
}

function createDisplayableGridRow(divRow, boxSpecs) {

  if (!Array.isArray(divRow)) {
    return [];
  }

  const {
    boxMargin
  } = boxSpecs;

  if (typeof boxMargin !== 'number') {
    return [];
  }

  const row = document.createElement('div');
  const columns = divRow.length;

  for (let i = 0; i < columns; i++) {

    const div = divRow[i];
    const box = createDisplayableGridRowBox(div, boxSpecs)

    row.appendChild(box);
  }

  row.className = 'row';
  row.style.marginBottom = `${boxSpecs.boxMargin}px`;

  return row;
}

function createDisplayableGridRowBox(divNode, boxSpecs) {

  const {
    boxWidth,
    boxHeight,
    boxMargin
  } = boxSpecs;

  if (typeof boxWidth !== 'number' || typeof boxHeight !== 'number' || typeof boxMargin !== 'number') {
    return divNode;
  }

  divNode.className = 'box';

  divNode.style.width = `${boxWidth}px`;
  divNode.style.height = `${boxHeight}px`;
  divNode.style.marginRight = `${boxMargin}px`;

  divNode.addEventListener('mouseover', onBoxMouseOver);
  divNode.addEventListener('click', onBoxClick);

  return divNode;
}

function displayGrid(displayableGrid) {

  const body = document.getElementById('body');
  body.appendChild(displayableGrid);
}

function paintMapToDisplayableGrid(map, divMatrix) {

  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    return;
  }

  if (!Array.isArray(divMatrix) || !Array.isArray(divMatrix[0])) {
    return;
  }

  const rows = map.length;
  const columns = map[0].length;

  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < columns; j++) {

      const div = divMatrix[i][j];

      if (map[i][j] === 0) {
        div.style.backgroundColor = '#eee';
      }

      if (map[i][j] === 1) {
        div.style.backgroundColor = '#000';
      }

      if (map[i][j] === 2) {
        div.style.backgroundColor = '#f00';
      }

      if (map[i][j] === 3) {
        div.style.backgroundColor = '#0f0';
      }
    }
  }
}

// Event Listeners

function onGridMouseDown(e) {
  state.canFillBoxes = true;
}

function onGridMouseUp(e) {
  state.canFillBoxes = false;
}

function onGridMouseLeave(e) {
  state.canFillBoxes = false;
}

function onBoxMouseOver(e) {

  if (!state.canFillBoxes) {
    return;
  }

  placeObstacle(map, e.srcElement);
  e.srcElement.style.backgroundColor = '#000';
}

function onBoxClick(e) {

  placeObstacle(map, e.srcElement);
  e.srcElement.style.backgroundColor = '#000';
}

function placeObstacle(map, box) {

  const [row, column] = box.getAttribute('pos').split('-');
  map[row][column] = 1;
}
