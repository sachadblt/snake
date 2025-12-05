import ThreeAtmModel from '../components/atoms/ThreeAtmModel'
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

const PagEarth = () => {
    return (
        <PageContainer>
            <PageTitle>Character 3D</PageTitle>
            <ThreeOrgScene backgroundColor={props => props.theme.colors.skyBlue}>
                <ThreeAtmModel position={[0, 0, 0]}/>
            </ThreeOrgScene>
            <Description>
                Voici bob.
            </Description>
        </PageContainer>
    )
}

export default PagEarth