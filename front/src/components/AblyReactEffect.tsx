import Ably from "ably/promises";
import { useEffect } from 'react'
import { config } from '@config';

const ably = new Ably.Realtime.Promise({ authUrl: config.serverURL + '/ably/auth' });

export function useChannel(channelName: string, callbackOnMessage: Function) {
    const channel = ably.channels.get(channelName);

    const onMount = () => {
        channel.subscribe(msg => { callbackOnMessage(msg); });
    }

    const onUnmount = () => {
        channel.unsubscribe();
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnmount(); };
    };

    useEffect(useEffectHook);

    return [channel, ably];
}