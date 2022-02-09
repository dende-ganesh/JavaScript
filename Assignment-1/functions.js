function getDetails(phoneNum,getFullName){
    let fullName=getFullName('ganesh','dende');
    console.log(fullName);
    console.log(phoneNum);
}
function getFullName(fName,lName){
    return fName+" "+lName;
}
getDetails('+9179954 96405',getFullName);