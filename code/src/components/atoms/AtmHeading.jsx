import styled from 'styled-components';

const StyledHeading = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: ${props => {
    switch (props.level) {
      case 1: return '2rem';
      case 2: return '1.5rem';
      case 3: return '1.25rem';
      case 4: return '1rem';
      case 5: return '0.875rem';
      case 6: return '0.75rem';
      default: return '2rem';
    }
  }};
  margin: 0;
  font-weight: bold;
`;

const AtmHeading = ({ level = 1, children, ...props }) => {
  return (
    <StyledHeading as={`h${level}`} level={level} {...props}>
      {children}
    </StyledHeading>
  );
};

export default AtmHeading;