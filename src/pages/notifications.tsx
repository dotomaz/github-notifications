import React, { 
    FunctionComponent, 
    useState, 
    useEffect
} from 'react';
import Notification, { NotificationProps } from '../components/notification';
import Section, { SectionProps, SectionInterface } from '../components/section';
import GithubService from '../core/github';
import { styled, Provider, Button as BaseButton } from "reakit";
import { animated, useTrail } from 'react-spring/hooks'
import theme from "reakit-theme-default";
import Loader from '../components/loader';

import { 
    indexOf as _indexOf,
    flatMap as _flatMap,
    difference as _diff,
    map as _map,
} from 'lodash';
import moment from 'moment';
// import Logo from '../logo.svg';

const Notifications = () => {
    const [notifications, setNotifications] = useState([] as SectionInterface[]);
    const [allNotifications, setAllNotifications] = useState([] as NotificationProps[]);
    const [loading, setLoading] = useState(true);

    const refresh = () => {
        setLoading(true);

        GithubService.notifications('review_requested').then((res)=> {
            const notifications: NotificationProps[] = [];

            res.forEach( (n: any, i: number) => {
                const match = /\d+$/.exec(n.subject.url);
                let url = '';
                if(match){
                    url = n.repository.html_url + '/pull/'+ match[0];
                }

                notifications.push({
                    id: n.id,
                    image: n.repository.owner.avatar_url,
                    title: n.subject.title,
                    url,
                    repo: n.repository.name,
                    repoUrl: n.repository.html_url,
                    date: n.updated_at,
                })
            });
            updateNotifications(notifications);
            setLoading(false);
        });
    }

    const updateNotifications = (list: NotificationProps[]) => {
        const existingIds = _flatMap(allNotifications, (n: NotificationProps) => [n.id]);
        const newIds = _diff(_flatMap(list, (n: NotificationProps) => [n.id]), existingIds);
        const newList = _map( list, (n: NotificationProps) => {
            return {...n, isNew: _indexOf(newIds, n.id) >= 0 };
        });
        // console.log(existingIds,newIds,newList);
        setAllNotifications(newList);
        setNotifications(toSections(newList));
    }

    useEffect(() => {
        refresh();
    }, []);

    const toSections = (list: NotificationProps[]) => {
        const today = moment(moment().format("YYYY-MM-DD 00:00:00"));
        let startOfWeek = moment(moment().day(1).format("YYYY-MM-DD 00:00:00"));
        let startOfLastWeek = moment(moment().day(-6).format("YYYY-MM-DD 00:00:00"));

        return [
            {
                title: "Today",
                items: list.filter((el:NotificationProps) => today.diff(moment(el.date), "days") === 0)
            },
            {
                title: "Yesterday",
                items: list.filter((el:NotificationProps) => today.diff(moment(el.date), "days") === 1)
            },
            {
                title: "This week",
                items: list.filter((el:NotificationProps) => 
                    today.diff(moment(el.date), "days") > 1 && 
                    startOfWeek.diff(moment(el.date), "days") < 0)
            },
            {
                title: "Last week",
                items: list.filter((el:NotificationProps) => 
                    today.diff(moment(el.date), "days") > 1 && 
                    startOfWeek.diff(moment(el.date), "days") >= 0 && 
                    startOfLastWeek.diff(moment(el.date), "days") < 0)
            },
            {
                title: "Older",
                items: list.filter((el:NotificationProps) => 
                    startOfLastWeek.diff(moment(el.date), "days") >= 0)
            }
        ]
    }

    // const config = { tension: 210, friction: 18, clamp: true }
    // const trail = useTrail( notifications.length, {
    //     config,
    //     x: 0, 
    //     from: { 
    //         x: -100, 
    //     }
    // });

    return (
    <>
    <Provider theme={theme}>
        <div>
            <Button onClick={()=>refresh()}>Refresh</Button>
            
            { loading && (
                <Loader color="#fff" size={20} duration={1.3}/>
            ) }

            { !loading && notifications.map( (section: SectionInterface, i: number) => { 
                return (
                    <Container key={i}>
                    { section.items.length > 0 && (
                        <Section title={section.title}>
                            { section.items.map((n: NotificationProps, j: number) => (
                                <Notification key={j} {...n}></Notification>
                            ))}
                        </Section>
                    )}
                    </Container>
                )}
            )}

            {/* !loading && trail.map( ({x, ...rest}, index) => (
                <animated.div
                    key={notifications[index].id}
                    style={{ ...rest, transform: x.interpolate(x => `translate3d(${x}%,0,0)`) }}
                >{items[index]}</animated.div>
            ))*/}
        </div>
    </Provider>
    </>
    )
};

const Button = styled(BaseButton)`
    margin-bottom: 15px;
    margin-top: 15px;
`;

const Container = styled.div`
    margin: 0 10px;
`;

export default Notifications
