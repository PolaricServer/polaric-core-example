Simple example of a server-app based on arctic-core. It sets up a server with a REST API and a websocket. 
It is work in progress.. 

## Building and running

Run script *build.sh* to build. It runs maven and pulls inn library code, including polaric-core

Run script *start.sh*. It will start a server instance listening on port 7070 (you may change this in the code). 

## Testing
A very simple test Javascript app shows how to use the REST API. It has two operations foo and bar that just says hello. bar is protected meaning you have to log in to access it. You can log in with username 'admin' and password 'polaric'. 

To test, point your browser to *test/index.html*
 
