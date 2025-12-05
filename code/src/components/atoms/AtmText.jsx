import styled from 'styled-components';

const StyledText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.size || '1rem'};
  margin: 0;
  line-height: 1.5;
`;

const AtmText = ({ children, size, ...props }) => {
  return (
    <StyledText size={size} {...props}>
      {children}
    </StyledText>
  );
};

export default AtmText;