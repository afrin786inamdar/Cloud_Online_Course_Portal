const express = require("express")

//this is result.js file
function createResult(error,data){
    const result={}
    if(data)
    {
        result.status='success'
        result.data=data
    }
    else{
        result.status=`Error`
        result.error=error
    }
    return result
}

module.exports={
    createResult
}