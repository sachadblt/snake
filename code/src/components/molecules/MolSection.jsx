import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: ${props => props.theme.spacing.medium};
  margin: ${props => props.theme.spacing.medium} 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const MolSection = ({ title, children }) => {
  return (
    <SectionContainer>
      {title && <h2>{title}</h2>}
      {children}
    </SectionContainer>
  );
};

export default MolSection;