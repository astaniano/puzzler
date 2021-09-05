// todo typeArrays; validation

// key: edgeTypeId; value: Array<Struct>
const map = new Map();

function findEdgeToTheRight(matchedEdge) {
  const goToRightPuzzleFrom = {
    right: "left",
    top: "bottom",
    bottom: "top",
    left: "right",
  };

  return goToRightPuzzleFrom[matchedEdge];
}

/* [
    {puzzleRef: {}, matchedEdge: "left"},
    {puzzleRef: {}, matchedEdge: "bottom"}
] */

function getIdsFromRow(currentPuzz, currentPuzzEdgeObj) {
  const res = [];

  // currentPuzzEdgeObj equals null when the row is travered
  while (currentPuzzEdgeObj !== null) {
    const structsOfMatchedPuzzles = map.get(currentPuzzEdgeObj.edgeTypeId);

    const nextPuzzIndex =
      structsOfMatchedPuzzles[0].puzzleRef.id === currentPuzz.id ? 1 : 0;
    const nextPuzz = structsOfMatchedPuzzles[nextPuzzIndex].puzzleRef;
    const nextPuzzleEdgeObj =
      structsOfMatchedPuzzles[nextPuzzIndex].matchedEdge;

    res.push(nextPuzz.id);

    currentPuzz = nextPuzz;
    const currentPuzzMatchedEdge = findEdgeToTheRight(nextPuzzleEdgeObj);
    currentPuzzEdgeObj = currentPuzz.edges[currentPuzzMatchedEdge];
  }

  return res;
}

function findRes(firstPuzzInArr) {
  let res = [1];

  let firstPuzzleInTheRow = firstPuzzInArr;
  let currentPuzzMatchedEdge = "right";
  let currentPuzzRightEdgeObj = firstPuzzleInTheRow.edges[currentPuzzMatchedEdge];

  const idsFromRow = getIdsFromRow(firstPuzzInArr, currentPuzzRightEdgeObj);
  res = res.concat(idsFromRow);

  firstPuzzleInTheRow = firstPuzzleInTheRow.edges["bottom"];

  console.log(res);
}

function turnFirstPuzzle(puzzleEdges) {
  const maxNumberOfTurns = 3;
  for (let i = 0; i < maxNumberOfTurns; i++) {
    if (puzzleEdges.top === null && puzzleEdges.left === null) {
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

function solvePuzzle(inputArr) {
  if (inputArr.length === 0) {
    return;
  }

  function Struct(puzzleRef, matchedEdge) {
    this.puzzleRef = puzzleRef;
    this.matchedEdge = matchedEdge;
  }

  const firstPuzzle = inputArr[0];
  turnFirstPuzzle(firstPuzzle.edges);

  inputArr.forEach((puzzle) => {
    for (const side in puzzle.edges) {
      const edge = puzzle.edges[side];

      if (edge !== null) {
        const foundArr = map.get(edge.edgeTypeId);

        if (foundArr !== undefined) {
          const obj = new Struct(puzzle, side);
          foundArr.push(obj);
        } else {
          const arr = [];
          const obj = new Struct(puzzle, side);
          arr.push(obj);
          map.set(edge.edgeTypeId, arr);
        }
      }
    }
  });

  findRes(firstPuzzle);
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

solvePuzzle(inputArr);
// console.log(solvePuzzle(inputArr));
