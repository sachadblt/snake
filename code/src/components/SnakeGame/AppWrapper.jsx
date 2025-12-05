import React from 'react';
import { useKonamiCode } from './useKonamiCode';
import SnakeGame3D from './SnakeGame3D';

const AppWrapper = ({ children }) => {
    const { isActivated, setIsActivated } = useKonamiCode();

    return (
        <>
            {children}
            {isActivated && (
                <SnakeGame3D onClose={() => setIsActivated(false)} />
            )}
        </>
    );
};

export default AppWrapper;
