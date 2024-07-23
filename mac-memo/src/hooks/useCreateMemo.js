import axios from "axios";
import { useCallback, useState } from "react";

export default function useCreateMemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMemo = useCallback(async (url, folderId, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const currentTime = new Date().toISOString();
      const response = await axios.post(
        url,
        {
          folder: folderId,
          time: currentTime,
          content: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        if (onSuccess) onSuccess(response.data);
      } else {
        throw new Error("폴더 생성 요청이 실패했습니다.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("폴더 생성 중 오류가 발생했습니다.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createMemo, loading, error };
}
