import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledButtonLink = styled(Link)`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.primary};
  border: none;
  text-decoration: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: inline-block;
  text-align: center;

  &:hover {
    background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.primaryHover};
  }
`;

const AtmButtonLink = ({ to, children, disabled, ...props }) => {
  return (
    <StyledButtonLink to={to} disabled={disabled} {...props}>
      {children}
    </StyledButtonLink>
  );
};

export default AtmButtonLink;