import React, {version} from 'react';
import FixTabPanel from '@stateless/FixTabPanel';
import TypedText from '@stateless/TypedText';
import UserIP from '@stateless/UserIP';
// import MultiColorBorder from '@stateless/MultiColorBorder';

const Home = () => (
    <FixTabPanel>
        <h2>
            <TypedText>Cool! Hi, welcome to DWMF</TypedText>
        </h2>
        <h2>React version: {version}</h2>
        <UserIP />
    </FixTabPanel>
);

export default Home;
