
function MOVE(from, to, captured, promoted, flag) {
    return (from | (to <<7) | (captured << 14) | (promoted << 20) | flag);
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

    GameBoaord.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    var pceType;
    var pceNum;
    var sq;

    if (GameBoard.side == COLORS.white) {
        pceType = PIECES.wP;

        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceType++) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

            if(GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
                // Add pawn move
                if(RanksBrd[sq] == RANKS.R2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY) {
                    // Quiet move
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
                    // Add enpas move
                }
                if(sq + 11 == GameBoard.enPas) {
                    // Add enpas move
                }
            }
        }

        if(GameBoard.castlePerm & CASTLEBIT.WKCA) {
            if(GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.F1, COLORS.black) == BOOL.FALSE && SqAttacked(SQUARES.G1, COLORS.black) == BOOL.FALSE) {
                    // Add quiet move
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.WQCA) {
            if(GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.D1, COLORS.black) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.black) == BOOL.FALSE) {
                    // Add quiet move
                }
            }
        }

        pceType = PIECES.wN;
    } else {
        pceType = PIECES.bP;

        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceType++) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

            if(GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
                // Add pawn move
                if(RanksBrd[sq] == RANKS.R7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY) {
                    // Quiet move
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
                    // Add enpas move
                }
                if(sq - 11 == GameBoard.enPas) {
                    // Add enpas move
                }
            }
        }

        if(GameBoard.castlePerm & CASTLEBIT.BKCA) {
            if(GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.F8, COLORS.white) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.white) == BOOL.FALSE) {
                    // Add quiet move
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.BQCA) {
            if(GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if(SqAttacked(SQUARES.D8, COLORS.white) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.white) == BOOL.FALSE) {
                    // Add quiet move
                }
            }
        }
        pceType = PIECES.bN;
    }

}