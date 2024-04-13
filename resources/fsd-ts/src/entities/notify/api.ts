import { Channel } from 'pusher-js';
import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';

export async function authBroadcastingMutation(params: {
    channel: Channel;
    socketId: any;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl('/broadcasting/auth'),
            method: 'POST',
            body: JSON.stringify({
                socket_id: params.socketId,
                channel_name: params.channel.name,
            }),
        },
        response: {
            contract: zodContract(z.any()),
            mapData: (data) => data,
        },
    });
}
