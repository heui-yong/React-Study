import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Word from "./Word";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";

export default function Day() {
  const { day } = useParams();
  const navigate = useNavigate();
  const wordList = useFetch(`http://localhost:3001/words?day=${day}`);
  const location = useLocation();
  const { total, id } = location.state || {};
  const [isMin, setIsMin] = useState(false);
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    setIsMin(day === "1");
    setIsMax(day === total);
  }, [total, day]);

  function del_day() {
    if (window.confirm("삭제 하시겠습니까?")) {
      fetch(`http://localhost:3001/days/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          navigate("/");
        }
      });
    }
  }

  return (
    <div>
      <div>
        <div className="day-header">
          <h2>Day {day}</h2>
          <button onClick={del_day}>Day 삭제</button>
        </div>
        {wordList.length === 0 && <span>Loading...</span>}
      </div>
      <table>
        <tbody>
          {wordList.map((word) => (
            <Word word={word} key={word.id} />
          ))}
        </tbody>
      </table>
      <div className="navigation-links">
        {!isMin && (
          <Link to={`/day/${Number(day) - 1}`} className="prev-link">
            뒤
          </Link>
        )}
        <div className="spacer"></div>
        {!isMax && (
          <Link to={`/day/${Number(day) + 1}`} className="next-link">
            앞
          </Link>
        )}
      </div>
    </div>
  );
}
