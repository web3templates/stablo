declare namespace _default {
    export const name: string;
    export const signature: string;
    export const description: string;
    export const action: any;
    export { helpText };
}
export default _default;
declare const helpText: "\nNotes\n  Changing the hostname or port number might require a new CORS-entry to be added.\n\nOptions\n  --port <port> TCP port to start server on. [default: 3333]\n  --host <host> The local network interface at which to listen. [default: \"127.0.0.1\"]\n\nExamples\n  sanity start --host=0.0.0.0\n  sanity start --port=1942\n";
//# sourceMappingURL=startCommand.d.ts.map