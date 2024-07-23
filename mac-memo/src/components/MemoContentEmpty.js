import styled from "styled-components";
import MemoDetailEmpty from "./MemoDetailEmpty";

const MainContent = styled.div`
  flex: 1; /* 나머지 공간을 차지하게 설정 */
  display: flex;
  overflow: auto; /* 내용이 넘칠 때 스크롤 */
  flex-direction: column;
  background-color: rgb(28, 28, 28);
`;

export default function MemoContentEmpty() {
  return (
    <>
      <MainContent>
        <MemoDetailEmpty />
      </MainContent>
    </>
  );
}
