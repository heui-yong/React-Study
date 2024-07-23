import useFetch from "../hooks/useFetch";

export default function FolderCount({ id }) {
  const url =
    id === "1"
      ? "http://localhost:3001/memo"
      : `http://localhost:3001/memo?folder=${id}`;

  const { data, loading, error } = useFetch(url);

  if (loading) {
    return <span>0</span>;
  }

  if (error) {
    return <span>0{error}</span>;
  }

  return <span>{data.length}</span>;
}
