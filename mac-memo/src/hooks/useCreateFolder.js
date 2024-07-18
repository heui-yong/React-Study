// hooks/useCreateFolder.js

import { useState } from "react";

function useCreateFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFolder = async (url, folders, newFolderName, setFolders) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `${folders.length}`,
          name: newFolderName,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const newFolder = await response.json();
      alert("생성이 완료 되었습니다.");
      setFolders((prevFolders) => [...prevFolders, newFolder]);
    } catch (err) {
      console.error("Error:", err);
      alert("폴더 생성 중 오류가 발생했습니다.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createFolder, loading, error };
}

export default useCreateFolder;
