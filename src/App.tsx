import styled from "./styled/index";

const Div = styled.div`
  background-color: red;
  display: flex;
  flex-direction: column;
`;
const Button = styled.button``;
const A = styled.a`
  color: red;
`;
const H1 = styled.h1``;

const App = () => {
  return (
    <Div>
      <Button style={{ display: "grid" }}>버튼</Button>
      <A href="https://www.naver.com">앵커태그</A>
      <H1>안녕하세요</H1>
    </Div>
  );
};

export default App;
