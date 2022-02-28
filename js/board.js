function PceIndex(pce, pceNum) {
  return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLORS.white;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.ply = 0;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.materials = new Array(2); // White, black - material of pieces
GameBoard.pceNum = new Array(13); //indexed by PIECES
GameBoard.pList = new Array(14*10)
GameBoard.posKey = 0;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES)
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES)
GameBoard.moveListStart = new Array(MAXDEPTH)

function GeneratePosKey() {

  var sq = 0;
  var finalKey = 0;
  var piece = PIECES.EMPTY;

  for(sq = 0; sq < BRD_SQ_NUM; sq++) {
    piece = GameBoard.pieces[sq];
    if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
      finalKey ^= PiecesKeys[(piece * 120) + sq];
    }
  }

  if (GameBoard.Side == COLORS.white) {
    finalKey ^= SideKey;
  }

  if (GameBoard.enPas != SQUARES.NO_SQ) {
    finalKey ^= PieceKeys[GameBoard.enPas];
  }

  finalKey ^= CastleKeys[GameBoard.castlePerm];

  return finalKey;
}

function ResetBoard() {

  for (var i = 0; i < BRD_SQ_NUM; i++) {
    GameBoard.Pieces[i] = SQUARES.OFFBOARD;
  }

  for (var i = 0; i < 64; i++) {
    GameBoard.pieces[SQ120(i)] = PIECES.EMPTY;
  }

  for (var i = 0; i < 14 * 120; i++) {
    GameBoard.pList[i] = PIECES.EMPTY;
  }

  for (var i = 0; i < 2; i++) {
    GameBoard.material[i] = 0;
  }

  for (var i = 0; i < 13; i++) {
    GameBoard.pceNum[i] = 0;
  }

  GameBoard.side = COLORS.both;
  GameBoard.enPas = SQUARES.NO_SQ;
  GameBoard.fiftyMove = 0;
  GameBoard.ply = 0;
  GameBoard.hisPly = 0;
  GameBoard.castlePerm = 0;
  GameBoard.posKey = 0;
  GameBoard.moveListStart[GameBoard.ply] = 0;

}

function ParseFen(fen) {

  ResetBoard();

  var rank = RANKS.R8;
  var file = FILES.A;
  var piece = 0;
  var count = 0;
  var i = 0;
  var sq120 = 0;
  var fenCnt = 0;

  while ((rank >= RANKS.R1) && (fenCnt < fen.length)) {
    count = 1;

    switch (fen[fenCnt]) {
      case 'p': piece = PIECES.bP; break;
      case 'r': piece = PIECES.bR; break;
      case 'n': piece = PIECES.bN; break;
      case 'b': piece = PIECES.bB; break;
      case 'k': piece = PIECES.bK; break;
      case 'q': piece = PIECES.bQ; break;
      case 'P': piece = PIECES.wP; break;
      case 'R': piece = PIECES.wR; break;
      case 'N': piece = PIECES.wN; break;
      case 'B': piece = PIECES.wB; break;
      case 'K': piece = PIECES.wK; break;
      case 'Q': piece = PIECES.wQ; break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
          piece = PIECES.EMPTY;
          count = Number(fen[fenCnt]);
          break;

      case '/':
      case ' ':
          rank--;
          file = FILES.A;
          fenCnt++;
          continue;

      default:
          console.log("FEN Error");
          return;
    }

    for (var i = 0; i < count; i++) {
      sq120 = FR2SQ(file, rank);
      GameBoard.Pieces[sq120] = piece;
      file++;
    }
    fenCnt++;
  }

}





}
/*

loop (pieces[])
if(piece on sq == side to move)
then genmove() for piece on sq

sqofpice = PlistArray[index];

index?

wP * 10 + wPNum
wN * 10 + wNNum

for(pceNum = 0; pceNum < GameBoard.pceNum[wP]; ++pceNum) {
  sq = PlistArray[wp * 10 + pceNum]
}


*/
