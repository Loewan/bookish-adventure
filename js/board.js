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
