import {ACCES_TOKEN} from './secret';

export default class GithubService{
    static notifications(reason: string){
        return fetch(
            'https://api.github.com/notifications',
            {
                headers: {
                    'Authorization': 'token '+ ACCES_TOKEN
                }
            }
        )
        .then(response => response.json())
        .then(list => list.filter((n:any)=>n.reason === reason));
    }
}