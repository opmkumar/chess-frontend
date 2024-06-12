import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaEquals } from "react-icons/fa";

function ArchiveFormat({ playerWhite, playerBlack, winner, status }) {
  const [usernameBlack, setUsernameBlack] = useState("");
  const [usernameWhite, setUsernameWhite] = useState("");
  const [gameSymbol, setGameSymbol] = useState(null);

  useEffect(() => {
    async function fetchUserDetails(id, setUsername) {
      try {
        const res = await fetch(`/api/v1/users/${id}`);
        const data = await res.json();
        console.log(data.data.data.username);
        setUsername(data.data.data.username);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserDetails(playerBlack, setUsernameBlack);
    fetchUserDetails(playerWhite, setUsernameWhite);
  }, [playerBlack, playerWhite]);

  useEffect(
    function () {
      const id = sessionStorage.getItem("id");
      if (winner) {
        if (winner === id) {
          setGameSymbol("won");
        } else {
          setGameSymbol("lost");
        }
      } else {
        setGameSymbol("draw");
      }
    },
    [winner],
  );
  return (
    <Card>
      <CardContent className="flex justify-between">
        <div>
          <p
            className={
              winner
                ? playerWhite === winner
                  ? "text-green-500"
                  : "text-red-500"
                : "text-gray-600"
            }
          >
            {usernameWhite}
          </p>
          <p
            className={
              winner
                ? playerBlack === winner
                  ? "text-green-500"
                  : "text-red-500"
                : "text-gray-600"
            }
          >
            {usernameBlack}
          </p>
        </div>
        <div className="my-auto">
          {gameSymbol === "won" ? (
            <FaPlus className="bg-green-500 text-gray-600" />
          ) : gameSymbol === "lost" ? (
            <FaMinus className="bg-red-500  text-gray-600" />
          ) : (
            <FaEquals className="bg-gray-400  text-gray-600" />
          )}
        </div>
        <div className={`my-auto w-20 text-center text-gray-400`}>{status}</div>
      </CardContent>
    </Card>
  );
}

export default ArchiveFormat;
