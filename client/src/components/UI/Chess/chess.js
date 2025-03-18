//The Code to display the simple chessboard


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import Button from "../../UI/Button/button.js";
import "./chess.css"

const socket = io("http://localhost:3000"); // Update with your backend URL

export default function ChessGame() {
    const { roomId } = useParams();
    const [chess, setChess] = useState(new Chess());
    const [fen, setFen] = useState(chess.fen());
    const [moves, setMoves] = useState([]);
    const [playerColor, setPlayerColor] = useState(null); // 'w' or 'b'
    const [currentTurn, setCurrentTurn] = useState("w");
    const [playerTurn, setPlayerTurn] = useState("w"); // 'w' for White, 'b' for Black


useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("assignColor", (color) => {
        setPlayerColor(color); // Assign player as "w" or "b"
    });

    socket.on("gameUpdate", ({ fen, move, turn }) => {
        setFen(fen);
        setPlayerTurn(turn); // Update turn state
    });

    return () => socket.disconnect();
}, [roomId]);


    useEffect(() => {
        socket.emit("joinRoom", { roomId });

        socket.on("assignColor", ({ color }) => {
            setPlayerColor(color);
        });

        socket.on("gameUpdate", ({ fen, move, turn }) => {
            setFen(fen);
            setMoves((prev) => [...prev, move]);
            setCurrentTurn(turn);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const handleMove = (move) => {
        // Only allow the player to move their own pieces
        if (playerColor == currentTurn) {
            alert("It's not your turn!");
            return;
        }

        const newGame = new Chess(chess.fen());
        const result = newGame.move(move);

        if (result) {
            setChess(newGame);
            setFen(newGame.fen());
            setCurrentTurn(newGame.turn());

            socket.emit("playerMove", { roomId, move, fen: newGame.fen(), turn: newGame.turn() });
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h3>Chess Game - Room {roomId}</h3>
            {/* <p>You are playing as: <strong>{playerColor === "w" ? "White" : "Black"}</strong></p> */}
            <p>Turn: <strong>{currentTurn === "w" ? "White" : "Black"}</strong></p>

            <Chessboard
                position={fen}
                onPieceDrop={(sourceSquare, targetSquare) => handleMove({ from: sourceSquare, to: targetSquare })}
                boardWidth={200}
                 
                boardOrientation={playerTurn === "b" ? "black" : "white"} // Flip board for black
            />

            {/* { <div className>
                <h3>Move History:</h3>
                <ul>
                    {moves.map((move, index) => (
                        <li key={index}>{move.from} → {move.to}</li>
                    ))}
                </ul>
            </div> } */}

            <Button className="exit mt-4" onClick={() => window.location.href = "/"}>Quit Game</Button>
        </div>
    );
}

