/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
var aqp = require('api-query-params');

module.exports = function (app) {


  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;

      

      let update_issue=aqp(req.query);
      
     
      mongo.connect(process.env.CONNECTION_STRING, (err, dbo) => {
        if(err) console.log('Database error: ' + err);
          let db = dbo.db('test');
      
         console.log(update_issue.filter);
      if(req.query.id){
        let id = ObjectId(req.query.id);
        db.collection(project).find({_id : id}).toArray(
          (err, data)=>{
          console.log(data);
          return res.send(data);
        })
      }

      else if(Object.keys(update_issue).length !== 0 ){
        db.collection(project).find(update_issue.filter).toArray(
          (err, data)=>{
          console.log(data);
          return res.send(data);
        })
      }
      else{
      db.collection(project).find().toArray((err, data)=>{
        res.send(data);
      })
    
      }
    });
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue = {
       issue_title: req.query.issue_title,
       issue_text: req.query.issue_text,
       created_by: req.query.created_by,
       created_on: new Date(),
       updated_on: new Date(),
       assigned_to: req.query.assigned_to || '',
       status_text: req.query.status_text || '',
       open: true
      }
      mongo.connect(process.env.CONNECTION_STRING, (err, dbo) => {
        if(err) console.log('Database error: ' + err);
          let db = dbo.db('test');
          console.log('connected to test inside post ..')
      
      db.collection(project).insert(issue, (err, data)=>{
        if(err){console.log(err);}
        res.type('text').send('inserted');
      });
      
    });
    //end post
    })

    
    .put(function (req, res){
      var project = req.params.project;
      let update_issue={ updated_on: new Date() };
      if(req.query.issue_title){update_issue.issue_title = req.query.issue_title}
      if(req.query.issue_text){update_issue.issue_text = req.query.issue_text}
      if(req.query.created_by){ update_issue.created_by = req.query.created_by }
      if(req.query.open){ update_issue.open = req.query.open }
      if(req.query.assigned_to){ update_issue.assigned_to = req.query.assigned_to }
      if(req.query.status_text){ update_issue.status_text = req.query.status_text }

      mongo.connect(process.env.CONNECTION_STRING, (err, dbo) => {
        if(err) console.log('Database error: ' + err);
          let db = dbo.db('test');

          const tmp = {$set:{}};
          let keys = Object.keys(update_issue);
          for(var k of keys) { tmp.$set[k] = update_issue[k] };
          console.log(tmp);

          let id = ObjectId(req.query.id);
          console.log(id);
      
      db.collection(project).updateOne({_id:id}, tmp , (err,data )=>{
        console.log('updating .......')
        console.log(data.modifiedCount);
        if (err){
          console.log(err);
          res.tetx('could not Update  '+ id);
        }
        res.type('text').send('Updated Successfully');

      });

    });
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let id=ObjectId(req.query.id);
      if(!id){
        res.text('_id error')
      }
      mongo.connect(process.env.CONNECTION_STRING, (err, dbo) => {
        if(err) console.log('Database error: ' + err);
          let db = dbo.db('test');
      
      db.collection(project).deleteOne({_id:id}, (err, data)=>{
        if(err){
          console.log(err);
          res.type('text').send('could not delete  '+ id);
        }
        res.type('text').send('deleted  '+ id);
      })

    });
      
    });
    

//end exports    
};
