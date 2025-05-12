"use client";

import { generateId } from "ai";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect } from "react";
import Chat from "./Chat";

function App() {
  const [userId, setUserId] = useLocalStorage<string | undefined>(
    "userId",
    undefined
  );

  const resetUserId = useCallback(() => {
    setUserId(generateId());
  }, [setUserId]);

  useEffect(() => {
    // Set the initial userId if it's not set
    if (!userId) resetUserId();
  }, [resetUserId, userId]);

  return userId ? (
    <Chat key={userId} userId={userId} resetUserId={resetUserId} />
  ) : null;
}

export default App;
