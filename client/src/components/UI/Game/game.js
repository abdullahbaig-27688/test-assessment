import { useParams } from "react-router-dom";

export default function Game() {
    const { roomId } = useParams();

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold">Game Room: {roomId}</h1>
            <p>Game in progress...</p>
        </div>
    );
}
