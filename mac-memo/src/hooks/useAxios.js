import { useEffect, useState } from "react";
import axios from "axios";

export default function useAxios(url, onLoading, onError) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const axiosData = async () => {
      try {
        onLoading?.(true);

        const response = await axios.get(url, {
          cancelToken: source.token,
        });

        setData(response.data);
        onLoading?.(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          onError?.(error.message);
          onLoading?.(false);
        }
      }
    };

    axiosData();

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [url, onLoading, onError]);

  return { data };
}
