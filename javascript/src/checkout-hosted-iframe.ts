import { includes, get } from 'lodash';

export default ($ : any, csEndpoint : string, onTokenSuccess : Function, onError : Function) => {

    // Bind event listener
    window.addEventListener('message', function(event : MessageEvent) {
        if (!includes(csEndpoint, event.origin)) {
            return;
        }
        try {
            console.log(JSON.parse(event.data));
            const token = get(JSON.parse(event.data), 'message', false);
            if (!token) {
                return onError('Failed to parse response from CardConnect.');
            }
            onTokenSuccess(get(JSON.parse(event.data), 'message'));
        } catch (e) {
            onError(e.toString());
        }
    }, false);
}
