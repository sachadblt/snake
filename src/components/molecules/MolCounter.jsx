import { useDispatch } from "react-redux"
import AtmButton from "../atoms/AtmButton"
import styled from 'styled-components';

const CounterContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const CounterTitle = styled.h1`
  font-size: ${props => props.theme.fontSize.subtitle};
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
`;

const MolCounter = ({ name, handler, value, resetValue = 0 }) => {
    const dispatch = useDispatch()

    return (
    <CounterContainer>
      <CounterTitle>{name}: {value}</CounterTitle>

      <ButtonContainer>
        <AtmButton
          label="Incrémenter"
          onClick={() => dispatch(handler.increment())}
        />
        <AtmButton
          label="Décrémenter"
          onClick={() => dispatch(handler.decrement())}
        />
        <AtmButton
          label="Réinitialiser"
          onClick={() => dispatch(handler.setValue(resetValue))}
        />
      </ButtonContainer>
    </CounterContainer>
  )
}

export default MolCounter