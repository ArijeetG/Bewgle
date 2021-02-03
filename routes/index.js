
var express = require('express');
const { MongoClient } = require('mongodb')
const {URI} = require('../config')


var URL = require('url').URL
var router = express.Router();

const client = new MongoClient(URI)
client.connect()
function createJSON(req,client){
  
  var result = {
    date: new Date(Date.now()).toISOString(),
    method: req.method,
    headers: req.headers,
    path: req.originalUrl,
    query : req.query,
    body : req.body,
    duration : req.query.duration,
    responseTime : Date.now()-req.start
  }
  return result
}
async function databaseCRUD(result,client){
  const dbs = client.db('stats')
  await dbs.collection('records').insertOne(result)
    .then(()=>console.log("route added to db"))
}
router.route('/process?')
.get(async (req,res,next)=>{
  var result = createJSON(req,client)
  await databaseCRUD(result,client)
  console.log(result)
  setTimeout(()=>res.send(result),parseInt(result.duration) * 1000)
})
.post(async (req,res,next)=>{
  var result = createJSON(req,client)
  await databaseCRUD(result,client)
  console.log(result)
  setTimeout(()=>res.send(result),parseInt(result.duration) * 1000)
})
.put(async (req,res,next)=>{
  var result = createJSON(req,client)
  await databaseCRUD(result,client)
  console.log(result)
  setTimeout(()=>res.send(result),parseInt(result.duration) * 1000)
})
.delete(async (req,res,next)=>{
  var result = createJSON(req,client)
  await databaseCRUD(result,client)
  console.log(result)
  setTimeout(()=>res.send(result),parseInt(result.duration) * 1000)
})



//possible parameters fromDate? and toDate? or hours? or minutes?
router.get('/stats?',async(req,res,next)=>{
  const dbs = client.db('stats')
  var startDate = new Date()
  req.query.hours?startDate.setHours(startDate.getHours()-parseInt(req.query.hours)):req.query.minutes?startDate.setMinutes(startDate.getMinutes()-parseInt(req.query.minutes)):startDate=new Date('1970-01-01')
  startDate = startDate.toISOString()
  const query = {
    from: req.query.fromDate? new Date(req.query.fromDate).toISOString():startDate,
    to: req.query.toDate? new Date(req.query.toDate).toISOString():new Date(Date.now()).toISOString(),
  }
  //aggregation in database
  const statusResult = await dbs.collection('records').aggregate([
                                  {$match: {date:{$gt:query.from, $lt:query.to}}},
                                  {$group: {_id:"$method", count: {$sum:1}, average_response: {$avg: "$responseTime"}}}
  ]).toArray()
  console.log(statusResult)
  res.send(statusResult)
})
module.exports = router;
