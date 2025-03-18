import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Button from "../../UI/Button/button.js";
import Input from "../../UI/Input/input.js";

const socket = io("http://localhost:3000"); // Update with your backend URL

export default function JoinGame() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [moves, setMoves] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("playerJoined", ({ username }) => {
            console.log(`${username} joined the match.`);
        });

        socket.on("matchStart", () => {
            setGameStarted(true);
            console.log("Game Started!");
        });

        socket.on("updateBoard", ({ move }) => {
            setMoves((prev) => [...prev, move]);
        });

        socket.on("playerDisconnected", () => {
            alert("Opponent disconnected.");
            setGameStarted(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinMatch = () => {
        if (!username.trim()) {
            alert("Please enter a Username.");
            return;
        }

        let generatedRoomId = roomId;
        if (!roomId.trim()) {
            generatedRoomId = Math.random().toString(36).substr(2, 6); // Generate random 6-character ID
            setRoomId(generatedRoomId);
        }

        console.log("Joining match with Room ID:", generatedRoomId);

        socket.emit("joinMatch", { roomId: generatedRoomId, username });

        navigate(`/game/${generatedRoomId}`); // Redirect to the game page
    };

    const sendMove = () => {
        const move = prompt("Enter your move:");
        if (move) {
            socket.emit("playerMove", { roomId, move });
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold mb-4">Real-Time Chess Game</h1>
            
            {!gameStarted ? (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold">Join a Room</h2>
                    <Input
                        placeholder="Enter Room ID (Leave empty to create new)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <Input
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={joinMatch}>Join Match</Button>
                    {roomId && (
                        <p className="mt-2 text-sm text-gray-500">
                            Room ID: <span className="font-bold">{roomId}</span>
                        </p>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <h2 className="text-lg font-bold">Game Started! 🎉</h2>
                    <p className="text-sm text-gray-600 mt-2">Room ID: <span className="font-bold">{roomId}</span></p>

                    <div className="border p-4 my-4">
                        <h3 className="font-bold mb-2">Moves:</h3>
                        <ul>
                            {moves.map((move, index) => (
                                <li key={index}>{move}</li>
                            ))}
                        </ul>
                    </div>

                    <Button onClick={sendMove} className="mt-4">Make a Move</Button>
                </div>
            )}
        </div>
    );
}
