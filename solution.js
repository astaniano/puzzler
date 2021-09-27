// todo typeArrays; validation

function findEdgeToTheRight(matchedEdge) {
  const goToRightPuzzleFrom = {
    right: "left",
    top: "bottom",
    bottom: "top",
    left: "right",
  };

  return goToRightPuzzleFrom[matchedEdge];
}

function getIdsFromRow(currentPuzz, currentPuzzEdgeObj, map) {
  const res = [];

  // currentPuzzEdgeObj equals null when the row is travered
  while (currentPuzzEdgeObj !== null) {
    const structsOfMatchedPuzzles = map.get(currentPuzzEdgeObj.edgeTypeId);

    const nextPuzzIndex =
      structsOfMatchedPuzzles[0].puzzleRef.id === currentPuzz.id ? 1 : 0;
    const nextPuzz = structsOfMatchedPuzzles[nextPuzzIndex].puzzleRef;
    const nextPuzzleEdge =
      structsOfMatchedPuzzles[nextPuzzIndex].matchedEdge;

    res.push(nextPuzz.id);

    currentPuzz = nextPuzz;
    const currentPuzzMatchedEdge = findEdgeToTheRight(nextPuzzleEdge);
    currentPuzzEdgeObj = currentPuzz.edges[currentPuzzMatchedEdge];
  }

  return res;
}

function isFirstPuzzleTurnedCorrectly(puzzleEdges) {
  return puzzleEdges.top === null && puzzleEdges.left === null;
}

function isLeftMostPuzzleTurnedCorrectly(puzzleEdges, idOfEdgeThatMustBeOnTop) {
  return puzzleEdges.top?.edgeTypeId === idOfEdgeThatMustBeOnTop;
}

function turnPuzzle(isPuzzleTurnedCorrectlyCB, puzzleEdges, idOfEdgeThatMustBeOnTop) {
  const maxNumberOfTurns = 3;
  for (let i = 0; i < maxNumberOfTurns; i++) {
    if (isPuzzleTurnedCorrectlyCB(puzzleEdges, idOfEdgeThatMustBeOnTop)) {
      break;
    }

    // turn puzzle left
    const topBeforeTurn = puzzleEdges.top;
    puzzleEdges.top = puzzleEdges.right;
    puzzleEdges.right = puzzleEdges.bottom;
    puzzleEdges.bottom = puzzleEdges.left;
    puzzleEdges.left = topBeforeTurn;
  }
}

/* [
    {puzzleRef: {}, matchedEdge: "left"},
    {puzzleRef: {}, matchedEdge: "bottom"}
] */


/*
    {puzzleRef: {}, matchedEdge: "bottom"}
*/
function Struct(puzzleRef, matchedEdge) {
  this.puzzleRef = puzzleRef;
  this.matchedEdge = matchedEdge;
}

function validate(inputArr) {
  if (inputArr.length === 0) {
    return false;
  }

  return true;
}

function createMatchingEdgesMap(inputArr) {
  // key: edgeTypeId; value: Array<Struct>
  const map = new Map();

  inputArr.forEach((puzzle) => {
    for (const side in puzzle.edges) {
      const edge = puzzle.edges[side];
  
      if (edge !== null) {
        const arrOfStructs = map.get(edge.edgeTypeId);
        const struct = new Struct(puzzle, side);
  
        if (arrOfStructs === undefined) {
          map.set(edge.edgeTypeId, [struct]);
        } else {
          arrOfStructs.push(struct);
        }
      }
    }
  });

  return map;
}

function findRes(firstPuzzInArr, map) {
  let res = [];

  let currentPuzz = firstPuzzInArr;
  res.push(currentPuzz.id);
  let currentPuzzRightEdgeObj = currentPuzz.edges["right"];
  let puzzleIdsFromRow = getIdsFromRow(currentPuzz, currentPuzzRightEdgeObj, map);
  res = res.concat(puzzleIdsFromRow);
  let currentPuzzBottomEdge = currentPuzz.edges["bottom"];

  // currentPuzzBottomEdge === null when all the rows have been traversed
  while (currentPuzzBottomEdge !== null) {
    const structsOfMatchedPuzzles = map.get(currentPuzzBottomEdge.edgeTypeId);
    const nextPuzzIndex =
        structsOfMatchedPuzzles[0].puzzleRef.id === currentPuzz.id ? 1 : 0;
    const nextPuzz = structsOfMatchedPuzzles[nextPuzzIndex].puzzleRef;
    const nextPuzzleMatchedEdge =
        structsOfMatchedPuzzles[nextPuzzIndex].matchedEdge;
    const idOfEdgeInNextPuzzle = nextPuzz.edges[nextPuzzleMatchedEdge].edgeTypeId;
    
    turnPuzzle(isLeftMostPuzzleTurnedCorrectly, nextPuzz.edges, idOfEdgeInNextPuzzle);
    
    currentPuzz = nextPuzz;
    res.push(currentPuzz.id);
    currentPuzzRightEdgeObj = currentPuzz.edges["right"];

    puzzleIdsFromRow = getIdsFromRow(currentPuzz, currentPuzzRightEdgeObj, map);
    res = res.concat(puzzleIdsFromRow);
    currentPuzzBottomEdge = currentPuzz.edges["bottom"];
  }
  
  return res;
}

function solvePuzzle(inputArr) {
  if (!validate(inputArr)) {
    return [];
  }

  const firstPuzzle = inputArr[0];
  turnPuzzle(isFirstPuzzleTurnedCorrectly, firstPuzzle.edges, null);

  // key: edgeTypeId; value: Array<Struct>
  const map = createMatchingEdgesMap([...inputArr]);

  return findRes(firstPuzzle, map);
}

const inputArr = [
  {
    id: 1,
    edges: {
      top: null,
      right: null,
      bottom: { edgeTypeId: 7, type: "outside" },
      left: { edgeTypeId: 5, type: "inside" },
    },
  },
  {
    id: 9,
    edges: {
      top: { edgeTypeId: 8, type: "inside" },
      right: { edgeTypeId: 15, type: "inside" },
      bottom: null,
      left: { edgeTypeId: 5, type: "outside" },
    },
  },
  {
    id: 5,
    edges: {
      top: null,
      right: { edgeTypeId: 2, type: "inside" },
      bottom: { edgeTypeId: 1, type: "inside" },
      left: null,
    },
  },
  {
    id: 4,
    edges: {
      top: { edgeTypeId: 34, type: "inside" },
      right: { edgeTypeId: 11, type: "outside" },
      bottom: { edgeTypeId: 7, type: "inside" },
      left: null,
    },
  },
  {
    id: 3,
    edges: {
      top: { edgeTypeId: 2, type: "outside" },
      right: null,
      bottom: { edgeTypeId: 4, type: "outside" },
      left: { edgeTypeId: 6, type: "inside" },
    },
  },
  {
    id: 2,
    edges: {
      top: { edgeTypeId: 3, type: "outside" },
      right: { edgeTypeId: 34, type: "outside" },
      bottom: null,
      left: null,
    },
  },
  {
    id: 8,
    edges: {
      top: null,
      right: { edgeTypeId: 15, type: "outside" },
      bottom: { edgeTypeId: 4, type: "inside" },
      left: null,
    },
  },
  {
    id: 7,
    edges: {
      top: { edgeTypeId: 3, type: "inside" },
      right: null,
      bottom: { edgeTypeId: 1, type: "outside" },
      left: { edgeTypeId: 10, type: "inside" },
    },
  },
  {
    id: 6,
    edges: {
      top: { edgeTypeId: 11, type: "inside" },
      right: { edgeTypeId: 10, type: "outside" },
      bottom: { edgeTypeId: 6, type: "outside" },
      left: { edgeTypeId: 8, type: "outside" },
    },
  },
];

const res = solvePuzzle(inputArr);
console.log(res);

const correctRes = [1, 4, 2, 9, 6, 7, 8, 3, 5];
let correct = true;
correctRes.forEach((el, i) => {
  if (el !== res[i]) {
    correct = false;
  }
})
console.log(correct);
