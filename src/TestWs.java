 
package no.arctic.core.test; 
import no.arctic.core.*;
import no.arctic.core.httpd.*;
import no.arctic.core.auth.*;
import io.javalin.Javalin;
import java.util.*;
import java.util.concurrent.*;
import io.javalin.websocket.*; 

 
/*
 * Simple Websocket example. 
 * It simply echoes all that is received. 
 */
 
public class TestWs extends WsNotifier {
    
    /**
     * Client handler class. For each client connecting
     * one instance will be made. 
     */
    public class Client extends WsNotifier.Client {
        public Client(WsContext ctx) {
            super(ctx);
        }
        
        /*
         * Print out info about the incoming messasge and echo
         * its content to the sender. uid() is a unique client-session-id. See also the
         * WsNotifier.Client class and the Javalin documentation. 
         */
        public void handleTextFrame(String text) {
            System.out.println("Received from "+uid()+"@"+host()+": "+text);
            _ctx.send("Echo: "+text);
        }
    }
    
    
    public TestWs(ServerConfig conf) {
        super(conf);
    }
    
    
    /** Factory method. Create client handler instance. */
    public Client newClient(WsContext ctx) {
        return new Client(ctx);
    }
    
}
