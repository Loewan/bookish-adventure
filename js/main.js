$(function() {
  init();
  console.log("Main INIT called")
  ParseFen(START_FEN);
  PrintBoard();

  /*
    unique?
    piece on sq
    side
    castle
    enpass

    posKey ^= RandNum for all pces on sq
    posKey ^= RandNum side

  */

});

function InitFilesRanksBrd() {
  var file = FILES.A;
  var rank = RANKS.R1;
  var sq = SQUARES.A1;

  for (var i = 0; i < BRD_SQ_NUM; i++) {
    FilesBrd[i] = SQUARES.OFFBOARD;
    RanksBrd[i] = SQUARES.OFFBOARD
  }

  for (rank = RANKS.R1; rank <= RANKS.R8; rank++) {
    for (file = FILES.A; file <= FILES.H; file++) {
      sq = FR2SQ(file, rank);
      FilesBrd[sq] = file;
      RanksBrd[sq] = rank;
    }
  }
  console.log("FilesBrd[0]:" + FilesBrd[0] + " RanksBrd[0]:" + RanksBrd[0]);
  console.log("FilesBrd[SQUARES.A1]:" + FilesBrd[SQUARES.A1] + " RanksBrd[SQUARES.A1]:" + RanksBrd[SQUARES.A1]);
  console.log("FilesBrd[SQUARES.E8]:" + FilesBrd[SQUARES.E8] + " RanksBrd[SQUARES.E8]:" + RanksBrd[SQUARES.E8]);

}

function InitHashKeys(){
  for (var i = 0; i < 14 * 120; i++) {
    PieceKeys[i] = RAND_32();
  }

  SideKey = RAND_32();

  for (var i = 0; i < 16; i++) {
    CastleKeys[i] = RAND_32();
  }
}

function InitSq120To64(){
  var file = FILES.A;
  var rank = RANKS.R1;
  var sq = SQUARES.A1;
  var sq64 = 0;

  for (var i = 0; i < BRD_SQ_NUM; i++) {
    Sq120ToSq64[i] = 65;
  }

  for (var i = 0; i < 64; i++) {
    Sq64ToSq120[i] = 120;
  }

  for (rank = RANKS.R1; rank <= RANKS.R8; rank++) {
    for (file = FILES.A; file <= FILES.H; file++) {
      sq = FR2SQ(file, rank);
      Sq64ToSq120[sq64] = sq;
      Sq120ToSq64[sq] = sq64;
      sq64++;
    }
  }
}

function init() {
  console.log("init() called");
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq120To64();
}
