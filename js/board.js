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
GameBoard.material = new Array(2); // White, black - material of pieces
GameBoard.pceNum = new Array(13); //indexed by PIECES
GameBoard.pList = new Array(14*10)
GameBoard.posKey = 0;[]
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES)
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES)
GameBoard.moveListStart = new Array(MAXDEPTH)

function PrintBoard() {

  var sq, file, rank, piece;
  console.log("\nGame Board:\n");
  for(rank = RANKS.R8; rank >= RANKS.R1; rank--){
    var line = (RankChar[rank] + " ");
    for(file = FILES.A; file <= FILES.H; file++){
      sq = FR2SQ(file, rank);
      piece = GameBoard.pieces[sq];
      line+=(" " + PceChar[piece] + " ");
    }
    console.log(line);
  }

  console.log("");
  var line = "  ";
  for(file = FILES.A; file <= FILES.H; file++){
    line += (' ' + FileChar[file] + ' ');
  }

  console.log(line);
  console.log("side:" + SideChar[GameBoard.side]);
  console.log("enPas:" + GameBoard.enPas);
  line = "";

  if(GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
  if(GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
  if(GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
  if(GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
  console.log("castle:" + line);
  console.log("key:" + GameBoard.posKey.toString(16));
}



function GeneratePosKey() {

  var sq = 0;
  var finalKey = 0;
  var piece = PIECES.EMPTY;

  for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
    piece = GameBoard.pieces[sq];
    if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
      finalKey ^= PieceKeys[(piece * 120) + sq];
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

function PrintPieceLists() {
  var piece, pceNum;

  for(piece = PIECES.wP; piece <= PIECES.bK; ++piece){
    for(pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
      console.log('Piece ' + PceChar[piece] + ' on ' + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
    }
  }
}

function UpdateListsMaterials() {

  var piece, sq, index, color;

  for (var i = 0; i < 14 * 10; ++i) {
    GameBoard.pList[i] = PIECES.EMPTY;
  }

  for (var i = 0; i < 2; ++i) {
    GameBoard.material[i] = 0;
  }

  for (var i = 0; i < 13; ++i) {
    GameBoard.pceNum[i] = 0;
  }

  for (index = 0; index < 64; ++index) {
    sq = SQ120(index);
    piece = GameBoard.pieces[sq];

    if (piece != PIECES.EMPTY) {
      color = PieceCol[piece];

      GameBoard.material[color] += PieceVal[piece];

      GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = sq;
      GameBoard.pceNum[piece]++;
    }
  }

  PrintPieceLists();

}

function ResetBoard() {

  for (var i = 0; i < BRD_SQ_NUM; ++i) {
    GameBoard.pieces[i] = SQUARES.OFFBOARD;
  }

  for (var i = 0; i < 64; ++i) {
    GameBoard.pieces[SQ120(i)] = PIECES.EMPTY;
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
      GameBoard.pieces[sq120] = piece;
      file++;
    }
    fenCnt++;
  }

  GameBoard.side = (fen[fenCnt] == 'w') ? COLORS.white : COLORS.black;
  fenCnt += 2;

  for (var i = 0; i < 4; i++) {
    if (fen[fenCnt] == ' ') {
      break;
    }

    switch (fen[fenCnt]) {
      case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
      case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
      case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
      case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
      default:  break;
    }
    fenCnt++;
  }
  fenCnt++;

  if (fen[fenCnt] != '-') {
    file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
    rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();
    console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
    GameBoard.enPas = FR2SQ(file,rank);
  }

  GameBoard.posKey = GeneratePosKey();
  UpdateListsMaterials();
  PrintSqAttacked();
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

function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
	
	for(rank = RANKS.R8; rank >= RANKS.R1; rank--) {
		var line =((rank+1) + "  ");
		for(file = FILES.A; file <= FILES.H; file++) {
			sq = FR2SQ(file,rank);
			if(SqAttacked(sq, GameBoard.side) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

function SqAttacked(sq, side) {
  var pce;
  var t_sq;
  var index;

  if(side == COLORS.white) {
    if (GameBoard.pieces[sq-11] == PIECES.wP || GameBoard.pieces[sq-9] == PIECES.wP) {
      return BOOL.TRUE;
    }
  } else {
    if (GameBoard.pieces[sq+11] == PIECES.bP || GameBoard.pieces[sq+9] == PIECES.bP) {
      return BOOL.TRUE;
    }
  }

  for(index = 0; index < 8; index++)  {
    pce = GameBoard.pieces[sq + KnDir[index]];
    if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == BOOL.TRUE) {
      return BOOL.TRUE;
    }
  }

  for(index = 0; index < 4; ++index) {
    dir = RkDir[index];
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];
    while (pce != SQUARES.OFFBOARD) {
      if(pce != PIECES.EMPTY) {
        if(PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  for(index = 0; index < 4; ++index) {
    dir = BiDir[index];
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];
    while (pce != SQUARES.OFFBOARD) {
      if(pce != PIECES.EMPTY) {
        if(PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  for(index = 0; index < 8; index++)  {
    pce = GameBoard.pieces[sq + KiDir[index]];
    if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == BOOL.TRUE) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;

}

function CheckBoard() {   
 
	var t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [ 0, 0];
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for(t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; ++t_pce_num) {
			sq120 = GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
			if(GameBoard.pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}	
	}
	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if(t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return BOOL.FALSE;
			}	
	}
	
	if(t_material[COLORS.white] != GameBoard.material[COLORS.white] ||
			 t_material[COLORS.black] != GameBoard.material[COLORS.black]) {
				console.log('Error t_material');
				return BOOL.FALSE;
	}	
	
	if(GameBoard.side!=COLORS.white && GameBoard.side!=COLORS.black) {
				console.log('Error GameBoard.side');
				return BOOL.FALSE;
	}
	
	if(GeneratePosKey()!=GameBoard.posKey) {
				console.log('Error GameBoard.posKey');
				return BOOL.FALSE;
	}	
	return BOOL.TRUE;
}