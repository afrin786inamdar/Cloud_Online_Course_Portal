//this is server.js file

const express=require(`express`)

const app=express()

app.listen(`3000`,`localhost`,()=>{
      console.log(`server is started on port 3000`)
})