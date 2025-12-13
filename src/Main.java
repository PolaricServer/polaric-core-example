package no.polaric.core.test; 
import no.polaric.core.*;
import no.polaric.core.httpd.*;
import io.javalin.Javalin;
import java.util.*;



/**
 * Server Main class. 
 * It implements the ServerConfig interface and starts the server. 
 */

public class Main extends ConfigBase implements ServerConfig {

    public  WebServer webserver;
    private  List<ServerConfig.SimpleCb> _shutdown = new ArrayList<ServerConfig.SimpleCb>();
      

      
    /** 
     * Important settings. 
     * The alloworigin setting is for CORS access
     * The other settings are config file locations. Config files are placed the 
     * conf subdirectory
     */
    private void settings() {
        setProperty("httpserver.alloworigin", ".*");
        setProperty("httpserver.userfile",    "conf/users.dat");
        setProperty("httpserver.groupfile",   "conf/groups");
        setProperty("httpserver.passwdfile",  "conf/passwd");
        setProperty("httpserver.keyfile",     "conf/peers");
        setProperty("httpserver.loginkeyfile","conf/logins.dat");
    }
    
       
       
    public WebServer getWebserver()
        { return webserver; }
        
        
    /**
     * Add shutdown handler function. Differnet parts of the app may 
     * use this (with lambda functions) to do cleanup when server shuts down.
     */
    public void addShutdownHandler(SimpleCb cb){
        _shutdown.add(cb);
    }


    /**
     * Create and start the webserver. 
     */
    public void start() {
        webserver = new MyWebServer(this, 7070);
        webserver.start();
    }
    
    
    /** 
     * To be called when server terminates. Cleanup. 
     */
    public void stop() {
         for (ServerConfig.SimpleCb f: _shutdown)
            f.cb(); 
    }
    
    
    /**
     * The main method. Sets up and runs the server instance. 
     */
    public static void main(String[] args) 
    {
        Main setup = new Main(); 
        setup.settings();
        setup.start();        
        
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            setup.stop();
        }));
    }
}

