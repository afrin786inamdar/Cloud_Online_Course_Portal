//this is server.js file

const express=require(`express`)

const videoRouter = require(`./routes/admin/videos/CRUD`)
const app=express()

app.use(express.json())
app.use("/videos",videoRouter)

app.listen(`3000`,`localhost`,()=>{
      console.log(`server is started on port 3000`)
})