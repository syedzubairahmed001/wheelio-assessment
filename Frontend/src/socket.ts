import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL: any = process.env.NODE_ENV === 'production' ? undefined : 'ws://localhost:8000';

export const socket = io("ws://localhost:8000");
