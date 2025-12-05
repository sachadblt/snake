import ThreeAtmCube from '../components/atoms/ThreeAtmCube'
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

const PagCubes = () => {
    return (
        <PageContainer>
            <PageTitle>Cubes 3D</PageTitle>
            <ThreeOrgScene>
                <ThreeAtmCube position={[-1.5, 0, 0]} color='#ff3e00' size={1}/>
                <ThreeAtmCube position={[0, 0, 0]} color='#42b883' size={1.2}/>
                <ThreeAtmCube position={[1.5, 0, 0]} color='#61dafb' size={0.8} wireframe={true}/>
            </ThreeOrgScene>
            <Description>
                Vous pouvez faire pivoter la scène avec la souris et cliquer sur les cubes pour les agrandir.
            </Description>
        </PageContainer>
    )
}

export default PagCubes