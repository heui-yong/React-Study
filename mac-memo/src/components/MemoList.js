import { NavLink, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";
import MemoListTopbar from "./MemoListTopbar";
import { useAppContext } from "../AppContext";
import { useEffect } from "react";
import { sortByLatestTime } from "../utils/sortingUtils";
import { formatDateKo } from "../utils/formatUtils";

const MemoListDiv = styled.div`
  height: 100%;
  width: 13rem;
  border-right: 2px solid #000000; // 오른쪽에 수직선 추가
`;

const MemoListUl = styled.ul`
  list-style-type: none;
  padding: 10px;
  margin: 0;
  height: 100%;
  justify-content: center;
`;

const MemoItemLi = styled.li`
  margin-bottom: 10px;
`;

const MemoLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  flex-direction: column; /* 세로 방향으로 배치 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  text-decoration: none;
  color: inherit;
  border-radius: 5px;
  padding: 10px;
  padding-left: 30px;

  &.active {
    background-color: rgb(160, 130, 40);
    color: white;
  }
`;

const TitleTextDiv = styled.div`
  width: 100px; /* 원하는 너비 설정 */
  white-space: nowrap; /* 텍스트 줄 바꿈을 방지합니다. */
  overflow: hidden; /* 넘치는 부분을 숨깁니다. */
  text-overflow: ellipsis; /* 넘치는 텍스트에 줄임표를 추가합니다. */
  color: white;
  font-size: 1.1em;
  font-weight: bold;
`;

const DateTimeTextDiv = styled.div`
  color: white;
  font-size: 0.9em; /* 날짜 텍스트의 폰트 크기 설정 */
  margin-top: 2px;
  margin-bottom: 2px;
`;

const FolderTextDiv = styled.div`
  color: rgb(160, 150, 150);
  font-size: 0.9em; /* 날짜 텍스트의 폰트 크기 설정 */
`;

export default function MemoList() {
  const { folderId } = useParams();
  const url =
    folderId === "1"
      ? `http://localhost:3001/memo`
      : `http://localhost:3001/memo?folder=${folderId}`;

  const { data, loading, error } = useFetch(url);
  const location = useLocation();
  const { state, updateState } = useAppContext();

  useEffect(() => {
    if (
      location.state &&
      location.state.folderName &&
      location.state.folderName !== state.folderName
    ) {
      updateState({ folderName: location.state.folderName });
    }
  }, [location.state, updateState, state.folderName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MemoListDiv>
      <MemoListTopbar />
      <MemoListUl>
        {sortByLatestTime(data).map((memo) => (
          <MemoItemLi key={memo.id}>
            <MemoLink to={`/folder/${folderId}/memo/${memo.id}`}>
              <TitleTextDiv>{memo.content}</TitleTextDiv>
              <DateTimeTextDiv>{formatDateKo(memo.time)}</DateTimeTextDiv>
              <FolderTextDiv>{state.folderName}</FolderTextDiv>
            </MemoLink>
          </MemoItemLi>
        ))}
      </MemoListUl>
    </MemoListDiv>
  );
}
