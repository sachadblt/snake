import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.primary};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.primaryHover};
  }
`;

const AtmButton = ({ label, onClick, disabled }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {label}
    </StyledButton>
  )
}

export default AtmButton