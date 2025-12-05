import ThreeAtmCharacter from '../components/atoms/ThreeAtmCharacter'
import ThreeOrgScene from '../components/organisms/ThreeOrgScene'
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.medium};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSize.title};
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Description = styled.p`
  margin-top: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.text};
`;

const PagCharacter = () => {
    return (
        <PageContainer>
            <PageTitle>Character 3D</PageTitle>
            <ThreeOrgScene>
                <ThreeAtmCharacter/>
            </ThreeOrgScene>
            <Description>
                Voici bob.
            </Description>
        </PageContainer>
    )
}

export default PagCharacter