 
 
package no.arctic.core.test; 
import no.arctic.core.*;
import no.arctic.core.httpd.*;
import no.arctic.core.auth.*;
import io.javalin.Javalin;



/**
 * Simple example of a RESTful API. 
 * See also the Javalin documentation. 
 */
 
public class TestApi extends ServerBase {
    
    public TestApi(ServerConfig conf) {
        super(conf);
    }
    
    

    public void start() {

        protect("/bar"); 
        
        
        /* 
         * Unprotected GET service: /foo. It just says hello 
         */
        a.get("/foo",  ctx -> {
            ctx.result("Hello (FOO)"); 
        });
        
        
        /* 
         * Protected service, Meaning you have to be logged in to use it. 
         * It says hello with your username. 
         */
        a.get("/bar", ctx -> {     
            AuthInfo auth = getAuthInfo(ctx); 
            ctx.result("Hello (BAR) "+auth.userid); 
        });
    }
    

}
