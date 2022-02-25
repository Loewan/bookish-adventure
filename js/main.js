$(function() {
  init();
  console.log("Main INIT called")
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

function init() {
  console.log("init() called");
  InitFilesRanksBrd();
}
