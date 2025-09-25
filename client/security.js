/* 
 * Helper functions for Arctic Hmac
 * Uses the built-in subtle crypto library. 
 */


var security = security || {};

 
/* Base-64 encoding */
security.bin2base64 = function(arr) {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // base64 alphabet
    const bin = n => n.toString(2).padStart(8,0); // convert num to 8-bit binary string
    const l = arr.length
    let result = '';

    for(let i=0; i<=(l-1)/3; i++) {
        let c1 = i*3+1>=l; // case when "=" is on end
        let c2 = i*3+2>=l; // case when "=" is on end
        let chunk = bin(arr[3*i]) + bin(c1? 0:arr[3*i+1]) + bin(c2? 0:arr[3*i+2]);
        let r = chunk.match(/.{1,6}/g).map((x,j)=> j==3&&c2 ? '=' :(j==2&&c1 ? '=':abc[+('0b'+x)]));  
        result += r.join('');
    }
    return result;
}


/* 
 * Generate a secret key (in a format that can be used to generate a hmac) 
 * from some byte-array representing a secret
 */
security.hmac_getKey = async function(secret) {
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const _key = await crypto.subtle.importKey(
        "raw",
        secret,
        algorithm,
        false, ["sign", "verify"]
    );
    return _key;
}


/* 
 * Generate a hmac-sha256 hash from key and message 
 */
security.hmac_Sha256_B64 = async function(key, message) {
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const enc = new TextEncoder("utf-8");
    const hashBuffer = await crypto.subtle.sign (
        algorithm.name, 
        key, 
        enc.encode(message)
    );  
    const hashArray = Array.from(new Uint8Array(hashBuffer));  
    const hashHex = security.bin2base64(hashArray);
    return hashHex;
}



/* 
 * Generate a Sha256 hash from a message 
 */
security.Sha256_B64 = async function(message) {
    const enc = new TextEncoder("utf-8");
    const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(message));  
    const hashArray = Array.from(new Uint8Array(hashBuffer));  
    const hashHex = await security.bin2base64(hashArray);
    return hashHex;
}


/*
 * Generate a 64 bit (8 bytes) random number. 
 * Base64 encoded. 
 */
security.getRandom = function(n) {
    /* 8 bytes is 64 bits */
    const rnd = new Uint8Array(n);
    crypto.getRandomValues(rnd);
    return security.bin2base64(rnd);
}


