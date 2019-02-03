import React, { 
    FunctionComponent,
} from 'react';
import {
    styled, 
    Flex, 
    Block, 
    Button,
    Avatar as BaseAvatar, 
    Tooltip,
    Box
} from 'reakit';
import { NotificationProps } from './notification';
import moment from 'moment';

export interface SectionProps{
    title: string;
    children: any;
}

export interface SectionInterface{
    title: string;
    items: NotificationProps[];
}

const Section: FunctionComponent<SectionProps> = (props: SectionProps) => {
    return (
        <Container>
            <Title>{props.title}</Title>
            {props.children}
        </Container>
    );
}

const Container = styled(Block)`
`;

const Title = styled(Block)`
    margin: 10px 0;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;

`;


export default Section