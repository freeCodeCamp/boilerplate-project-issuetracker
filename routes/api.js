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
  	  res.json(result.ops[0]);
        });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const updatedObject = {updated_on: new Date()}

      Object.keys(req.body).forEach(key => {
        if(req.body[key] !== ''){
	  updatedObject[key] = req.body[key];
 	}
      });

      delete updatedObject._id;

      if(Object.keys(updatedObject).length === 1){
        res.type('text').send('no updated field sent');
      }

      db.collection(project)
        .updateOne({_id: ObjectId(req.body._id)},
          {$set: updatedObject},
	  function(err, result){
	   if(result.result.n === 1){
             res.type('text')
 		.send('Successfully updated');
  	   } else {
             res.type('text')
   		.send('Could not update '+_id);
           }
        }) 
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
      const _id = req.body._id;

      if(!_id){
        res.type('text').send('_id error');
      } 

      db.collection(project)
        .deleteOne({_id: ObjectId(_id)},
          (err, result)=>{
  	   if(result.result.n === 1){
             res.json({success: 'deleted '+_id});
  	   }
             res.json({failed: 'could not delete '+_id});
        })
    });

    app.use((req,res,next)=>{
      res.status(404)
         .type('text')
         .send('Not Found');
    });
  });    
};
