/* 
 * Simple demo of REST calls (foo and bar) and login. 
 */
 

/* Call foo rest service */
async function callFoo() {
    fetch('http://osys.no:7070/foo')
        .then(res => restresult(res))
}  
      

/* Call bar REST service with Arctic-Hmac authentication */
async function callBar(userid) {
  fetch('http://osys.no:7070/bar', {
      headers : await genHeaders(mykey, ""),
  })
    .then(res => restresult(res))
}

  
/* Show result of REST calls */
function restresult(res) {
    let testres = document.getElementById("restresult");
    if (res.status==200)
        res.text().then( txt => 
           testres.innerText = " > OK: "+txt 
        );
     else
        testres.innerText = " > Failed: "+res.status
}




/* 
 * At sucessful login. Set these variables to the useid and the 
 * session key returned. Note that logout is simply to reset these to null. 
 */
var mykey = null;
var userid = null;

  
/*
 * Perform a login with username and password. If sucessful, this will 
 * return a session key. 
 */
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  let loginres = document.getElementById("loginresult");
  
  fetch('http://osys.no:7070/directLogin', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
    .then(res => {
        if (res.status==200) {
          loginres.innerText = " > Login success";
          res.body.getReader().read()
            .then( async x=> {
                userid = username;
                mykey = await security.hmac_getKey(x.value);
              }); 
        }
        else 
          loginres.innerText = " > Login failed";
      
      })
}


    
/* 
 * Generate authentication string (HMAC based) for use in REST API 
 * requests (see also genHeaders function below). 
 */
async function genAuthString(key, message) {
    if (key==null)
      return null;
  
    /* Generate nonce */
    const nonce = security.getRandom(8);
    
    /* If message is non-empty, we use a hash of the message */
    let msgHash = "";
    if (message != null && message != "")
      msgHash = await security.Sha256_B64(message); 
    
    /* Generate the hmac, using key, nonce and hash of the message */
    const hmac = await security.hmac_Sha256_B64(key, nonce + msgHash);
    if (hmac == null)
        return null;

    return userid+';'+nonce+';'+hmac;
}

    
/*
 * Generate authorization header on requests
 */
async function genHeaders(key, message) {
    const str = await this.genAuthString(key, message);
    if (str==null)
        return {};
    return {'Authorization' : 'Arctic-Hmac '+str};
}



    

