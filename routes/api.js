/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

MongoClient.connect(CONNECTION_STRING, 
  function(err, client) {
  if(err){ console.log(err); }

  const db = client.db('issuestracker');

  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      let queryObject = {};

      Object.keys(req.query)
        .forEach(key => {
         queryObject[key] = req.query[key] == 'true' ? true : req.query[key];
      });
      console.log(queryObject);

      db.collection(project)
        .find(queryObject).toArray((err,docs)=>{
          if(err){ console.log(err); }
	  res.json(docs);
        });      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to || '';
      const status_text = req.body.status_text || '';
      const created_on = new Date();
      const updated_on = new Date();
      const open = true;

      db.collection(project)
        .insertOne({
          issue_title,
    	  issue_text,
          created_by,
          assigned_to,
     	  status_text,
          created_on,
          updated_on,
          open
        }, (err, result)=>{
          if(err){console.log(err);}
          //console.log(result);
  	  res.json(result.ops[0]);
        });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });

    app.use((req,res,next)=>{
      res.status(404)
         .type('text')
         .send('Not Found');
    });
  });    
};
