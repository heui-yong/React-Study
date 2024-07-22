import axios from "axios";
import { useCallback, useState } from "react";

export default function usePatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patchContent = useCallback(async (url, content, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const currentTime = new Date().toISOString();
      console.log(currentTime);
      const response = await axios.patch(url, { content, time: currentTime });

      if (response.status === 200) {
        if (onSuccess) onSuccess(response.data);
      } else {
        throw new Error("메모 수정 요청이 실패했습니다.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("메모 수정 중 오류가 발생했습니다.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return { patchContent, loading, error };
}
