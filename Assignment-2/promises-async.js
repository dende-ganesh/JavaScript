async function getData(uId) {
    p=new Promise(function(resolve){
        setTimeout(() => {
            console.log("Fetched the data!");
            resolve("skc@gmail.com");
        }, 4000)
    });
    return(await p);
}

console.log("start");
getData("skc").then(value=>console.log("Email id of the user id is: " + value));
console.log("end");