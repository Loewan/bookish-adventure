const PIECES = { EMPTY:0, wP:1, wN:2, wB:3, wR:4, wQ:5, wK:6, bP:7, bN:8, bB:9, bR:10, bQ:11, bK:12 };
const BRD_SQ_NUM = 120;
const FILES = {A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, NONE:8};
const RANKS = {R1:0, R2:1, R3:2, R4:3, R5:4, R6:5, R7:6, R8:7, NONE:8};
const COLORS = { white: 0, black: 1, both: 2};
const CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8};
const SQUARES = { A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,
                  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98,
                  NO_SQ:99, OFFBOARD:100 };
const BOOL = { TRUE: 1, FALSE: 0 };
const MAXGAMEMOVES = 2048;
const MAXPOSITIONMOVES = 256;
const MAXDEPTH = 64;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

function FR2SQ(f,r) {
  return ( (21 + f) + (r * 10));
}

var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLORS.both, COLORS.white, COLORS.white, COLORS.white, COLORS.white, COLORS.white, COLORS.white,
	COLORS.black, COLORS.black, COLORS.black, COLORS.black, COLORS.black, COLORS.black ];

var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
var RkDir = [-1, -10, 1, 10];
var BiDir = [-9, -11, 11, 9];
var KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];

var PieceKeys = new Array(14*120);
var SideKey;
var CastleKeys = new Array(16);

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);



function RAND_32(){
  return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
        | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

function SQ64(sq120){
  return Sq120ToSq64[sq64];
}

function SQ120(sq64){
  return Sq64ToSq120[sq64];
}

function PCEINDEX(pce, pceNum) {
  return (pce * 10 + pceNum);
}