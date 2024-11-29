import React, { useEffect, useRef } from 'react';
import { Client as GuacamoleClient } from '@guacamole-client/client';
import { Tunnel as GuacamoleTunnel } from '@guacamole-client/tunnel';

const App = () => {
    const terminalRef = useRef(null);
    const guacClient = useRef(null);

    useEffect(() => {
        // Create a Guacamole tunnel (change to your Guacamole server WebSocket URL)
        const tunnel = new GuacamoleTunnel('ws://192.210.197.55:4822/tunnel');
        guacClient.current = new GuacamoleClient(tunnel);

        // Attach the client display to the terminal div
        guacClient.current.getDisplay().onresize = () => {
            if (terminalRef.current) {
                const display = guacClient.current.getDisplay().getElement();
                terminalRef.current.innerHTML = '';
                terminalRef.current.appendChild(display);
            }
        };

        // Connect to the Guacamole server with the connection ID
        guacClient.current.connect("token=your-connection-token");

        // Cleanup on component unmount
        return () => {
            if (guacClient.current) {
                guacClient.current.disconnect();
            }
        };
    }, []);

    return (
        <div>
            <h1>SSH Web Terminal (Guacamole)</h1>
            <div
                ref={terminalRef}
                style={{ height: '80vh', width: '100%', background: '#000' }}
            ></div>
        </div>
    );
};

export default App;