import { io, type Socket } from "socket.io-client";

import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@repo/shared";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_BACKEND_LAN_URL;

type AppSocket = Socket<
    ServerToClientEvents,
    ClientToServerEvents
>;

let socket: AppSocket | null = null;

export const createSocket = (): AppSocket => {
    if (!socket) {
        socket = io(SOCKET_URL!, {
            autoConnect: true,
            withCredentials: true,
        }) as AppSocket;
    }

    return socket;
};