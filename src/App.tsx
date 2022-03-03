import styled from "./styled";

const Container = styled.div`
  display: flex;
  background-color: red;
`;
const Button = styled.button``;

const App = () => {
  return (
    <div>
      <Container>하이하이</Container>
      <Button>안녕</Button>
    </div>
  );
};

export default App;
