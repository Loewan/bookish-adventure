
function MOVE(from, to, captured, promoted, flag) {
    return (from | (to <<7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
    GameBoard.moveListStart[GameBoard.ply+1]++;
}

function AddQuietMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
    GameBoard.moveListStart[GameBoard.ply+1]++;
}

function AddEnPassantMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
    GameBoard.moveListStart[GameBoard.ply+1]++;
}

/*
GameBoard.moveListStart[] -> 'index' for the first move at a given ply
GameBoard.moveList[index] ->

ply 1 loop all moves
for(index = GameBoard.moveListStart[1]; index < GameBoard.moveListStart[2]; index++)
    move = moveList[index]
    .. use move
*/

function GenerateMoves() {

    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    var pceType;
    var pceNum;
    var sq;
    var pceIndex;
    var pce;
    var t_sq;
    var dir;

    if (GameBoard.side == COLORS.white) {
        pceType = PIECES.wP;

        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

            if(GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
                // Add pawn move
                if(RanksBrd[sq] == RANKS.R2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY) {
                    AddQuietMove( MOVE(sq, sq+20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }

            if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] == COLORS.black) {
                // Add pawn cap move
            }

            if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] == COLORS.black) {
                // Add pawn cap move
            }

            if(GameBoard.enPas != SQUARES.NO_SQ) {
                if(sq + 9 == GameBoard.enPas) {
                    AddEnPassantMove(MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if(sq + 11 == GameBoard.enPas) {
                    AddEnPassantMove(MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }

        if(GameBoard.castlePerm & CASTLEBIT.WKCA) {
            if(GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.F1, COLORS.black) == BOOL.FALSE && SqAttacked(SQUARES.G1, COLORS.black) == BOOL.FALSE) {
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1,PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.WQCA) {
            if(GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.D1, COLORS.black) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.black) == BOOL.FALSE) {
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1,PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }

    } else {
        pceType = PIECES.bP;

        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

            if(GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
                // Add pawn move
                if(RanksBrd[sq] == RANKS.R7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY) {
                    AddQuietMove( MOVE(sq, sq-20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }

            if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] == COLORS.white) {
                // Add pawn cap move
            }

            if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] == COLORS.white) {
                // Add pawn cap move
            }

            if(GameBoard.enPas != SQUARES.NO_SQ) {
                if(sq - 9 == GameBoard.enPas) {
                    AddEnPassantMove(MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if(sq - 11 == GameBoard.enPas) {
                    AddEnPassantMove(MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }

        if(GameBoard.castlePerm & CASTLEBIT.BKCA) {
            if(GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.F8, COLORS.white) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.white) == BOOL.FALSE) {
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8,PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.BQCA) {
            if(GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.D8, COLORS.white) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.white) == BOOL.FALSE) {
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8,PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }

    }

    // get pce for side wN, wK
    // loop all dir for pce -> need num dir for pce

    pceIndex = LoopNonSlideIndex[GameBoard.side];
    pce = LoopNonSlidePce[pceIndex++];

    while (pce != 0) {
        for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

            for(index = 0; index < DirNum[pce]; index++) {
                dir = PceDir[pce][index];
                t_sq = sq + dir;

                if(SQOFFBOARD(t_sq) == BOOL.FALSE){
                    continue;
                }

                if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
                    if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
                        AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                    }
                } else {
                    AddQuietMove(MOVE(sq, t_sq,PIECES.EMPTY, PIECES.EMPTY, 0));
                }
            }
            pce = LoopNonSlidePce[pceIndex++];
        }
        
    }

    pceIndex = LoopSlideIndex[GameBoard.side];
    pce = LoopSlidePce[pceIndex++];

    while (pce != 0) {
        for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

            for(index = 0; index < DirNum[pce]; index++) {
                dir = PceDir[pce][index];
                t_sq = sq + dir;

                while(SQOFFBOARD(t_sq) == BOOL.FALSE){

                    if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
                        if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
                            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
                    t_sq += dir;
                }


            }
            pce = LoopSlidePce[pceIndex++];
        }
        
    }

}