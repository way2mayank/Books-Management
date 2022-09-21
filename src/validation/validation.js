const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const enumvalid = function(value){
    let arr = ["Mr","Miss","Mrs"]
    for(let i=0;i<arr.length;i++){
        if(arr[i]==value) return true
    }
    return false
}

const regname = function(value){
    let regex = /^[a-zA-Z]+([_ -]?[a-zA-Z])*$/ 
    if(!regex.test(value.trim())) return false
    return true
}

const phoneregex = function(value){
    let regex = /^[6-9]{1}[0-9]{9}$/
    if(!regex.test(value)) return false
    return true
}

const emailregex = function(value){
    let regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
    if(!regex.test(value)) return false
    return true
}

const passregex = function(value){
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,15}$/
    if(!regex.test(value)) return false
    return true
}

const isbnregex = function(value){
    let regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    if(!regex.test(value)) return false
    return true
}

module.exports = {isValid,regname,phoneregex,emailregex,passregex,enumvalid,isbnregex}