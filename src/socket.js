import openSocket from 'socket.io-client';
import { serverPort } from "./serverPort"
const  socket = openSocket(serverPort.host.replace("4242", "4000"));



export { socket };