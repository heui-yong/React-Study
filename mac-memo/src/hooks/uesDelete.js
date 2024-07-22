import { useState, useCallback } from "react";
import axios from "axios";

function useDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteContent = useCallback(async (url, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(url);

      if (response.status === 200) {
        alert("삭제가 완료되었습니다.");
        if (onSuccess) onSuccess();
      } else {
        throw new Error("삭제 요청이 실패했습니다.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("폴더 삭제 중 오류가 발생했습니다.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteContent, loading, error };
}

export default useDelete;
