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
import moment from 'moment';

export interface NotificationProps{
    id: number;
    isNew?: boolean;
    image: string;
    date: string;
    title: string;
    url: string;
    repo: string;
    repoUrl: string;
}

const Notification: FunctionComponent<NotificationProps> = (props: NotificationProps) => {
    const elapsed = moment().diff(moment(props.date), "hours");
    return (
        <Container isNew={ elapsed < 24 }>
            
            {props.isNew && (
                <Badge>new</Badge>
            )}

            <Flex row={true}>
                <Coll1 marginRight={15}>
                    <Avatar src={props.image}></Avatar>
                </Coll1>
                <Coll2>
                    <Repo href={props.repoUrl} target="_blank">{props.repo}</Repo>
                    <Title href={props.url} target="_blank">{props.title}</Title>
                    <Date>
                        {moment().to(moment(props.date))}
                        <Tooltip placement="bottom">
                            <Tooltip.Arrow />
                            {moment(props.date).format('DD.MM.YYYY HH:mm:ss')}
                        </Tooltip>
                    </Date>
                </Coll2>
            </Flex>
            
        </Container>
    );
}

const Container = styled.div<{ isNew: boolean }>`
    padding: 10px;
    text-align: left;
    color: #fff;
    background-color: ${props => (props.isNew ? "#2E3438" : "#23272B")};
    border-left: 3px solid #41464C;
    margin-bottom: 2px;
    margin: 2px auto;
`;

const Title = styled.a`
    display: block;
    margin-top: 10px;
    font-size: 18px;
    color: #ddd;
    text-decoration: none;

    &:hover{
        text-decoration: underline;
    }
`;

const Repo = styled.a`
    display: inline-block;
    color: #737A82;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: bold;
    font-size: 12px;
`;

const Date = styled(Block)`
    font-size: 12px;
    margin-top: 5px;
    color: #ccc;
    display: inline-block;
`;

const Avatar = styled(BaseAvatar)`
    font-size: 40px;
`;

const Coll1 = styled(Flex)`
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Coll2 = styled(Block)`
`;

const Badge = styled(Block)`
    float: right;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    background-color: red;
    border-radius: 3px;
    padding: 3px 5px;
    text-transform: uppercase;
`;

export default Notification