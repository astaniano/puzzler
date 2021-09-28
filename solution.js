/*
  The algorithm works as follows:

  First we iterate over array of puzzles and we search for all the matches of edgeId. 
  For that purpose we create a map where key is the edgeId which can be found on both edges in both puzzles; And the value of map is an array of Struct (Struct is a random name, because I could not think of a better name). Struct has the following structure: {puzzleRef: {}, matchedEdge: "bottom"} where puzzleRef is a reference to the puzzle itself, and matchedEdge is the edge of the puzzle that matched the next puzzle edge.

  So an example of map:
  key: 3, (id of edge that is present in both puzzles)
  value: [
    {puzzleRef: {}, matchedEdge: "left"}, (matchedEdge tells that the "left" edge has an id: 3)
    {puzzleRef: {}, matchedEdge: "bottom"} (matchedEdge tells that the "bottom" edge has an id: 3)
  ]
  And so two different puzzles can be connected by that common edge id which is the key in the map.

  Then we will turn only left most puzzles in right direction and based on their right edge will traverse through the row. I understand that this task can be completed without turning puzzles but for the sake of readability we will turn firstPuzzle and leftMostPuzzles.
  When we traverse through the row from left to right we do not turn puzzles. The next puzzle to the right is found thanks to the "findEdgeToTheRight" function.
*/

/*
  user for 

  returns true if the first 
*/
const isFirstPuzzleTurned = (puzzleEdges) => puzzleEdges.top === null && puzzleEdges.left === null;

const isLeftMostPuzzleTurned = (puzzleEdges, idOfEdgeThatMustBeOnTop) => puzzleEdges.top?.edgeTypeId === idOfEdgeThatMustBeOnTop;

function findEdgeToTheRight(matchedEdge) {
  const goToRightPuzzleFrom = {
    right: "left",
    top: "bottom",
    bottom: "top",
    left: "right",
  };

  return goToRightPuzzleFrom[matchedEdge];
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

function getIdsFromRow(currentPuzz, currentPuzzEdgeObj, map) {
  const res = [];

  // currentPuzzEdgeObj equals null when the row is travered
  while (currentPuzzEdgeObj !== null) {
    const structsOfMatchedPuzzles = map.get(currentPuzzEdgeObj.edgeTypeId);

    const rightPuzzIndex =
      structsOfMatchedPuzzles[0].puzzleRef.id === currentPuzz.id ? 1 : 0;
    const rightPuzz = structsOfMatchedPuzzles[rightPuzzIndex].puzzleRef;
    const rightPuzzleEdge = structsOfMatchedPuzzles[rightPuzzIndex].matchedEdge;

    res.push(rightPuzz.id);

    currentPuzz = rightPuzz;
    const currentPuzzMatchedEdge = findEdgeToTheRight(rightPuzzleEdge);
    currentPuzzEdgeObj = currentPuzz.edges[currentPuzzMatchedEdge];
  }

  return res;
}

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
  /* key: edgeTypeId; value: Array<Struct>; for example:
  [
    {puzzleRef: {}, matchedEdge: "left"},
    {puzzleRef: {}, matchedEdge: "bottom"}
  ] */
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

function getIdsOfPuzzles(firstPuzzInArr, map) {
  let res = [];
  let currentPuzz = firstPuzzInArr;

  while (true) {
    res.push(currentPuzz.id);
    const currentPuzzRightEdgeObj = currentPuzz.edges["right"];
    const puzzleIdsFromRow = getIdsFromRow(currentPuzz, currentPuzzRightEdgeObj, map);
    res = res.concat(puzzleIdsFromRow);
    const currentPuzzBottomEdge = currentPuzz.edges["bottom"];

    // currentPuzzBottomEdge === null when all the rows have been traversed
    if (currentPuzzBottomEdge === null) {
      break;
    }

    const structsOfMatchedPuzzles = map.get(currentPuzzBottomEdge.edgeTypeId);
    const belowPuzzIndex =
        structsOfMatchedPuzzles[0].puzzleRef.id === currentPuzz.id ? 1 : 0;
    const belowPuzz = structsOfMatchedPuzzles[belowPuzzIndex].puzzleRef;
    const belowPuzzMatchedEdge = structsOfMatchedPuzzles[belowPuzzIndex].matchedEdge;
    const idOfEdgeInBelowPuzz = belowPuzz.edges[belowPuzzMatchedEdge].edgeTypeId;
    
    turnPuzzle(isLeftMostPuzzleTurned, belowPuzz.edges, idOfEdgeInBelowPuzz);
    currentPuzz = belowPuzz;
  }
  
  return res;
}

function solvePuzzle(inputArr) {
  if (!validate(inputArr)) {
    return [];
  }

  const firstPuzzle = inputArr[0];
  turnPuzzle(isFirstPuzzleTurned, firstPuzzle.edges, null);

  // key: edgeTypeId; value: Array<Struct>
  const map = createMatchingEdgesMap(inputArr);

  return getIdsOfPuzzles(firstPuzzle, map);
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
