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
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  projectname: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});

var Project = mongoose.model('Project', ProjectSchema);

var CONNECTION_STRING=process.env.CONNECTION_STRING? process.env.CONNECTION_STRING:
 'mongodb://freecodecampjfse:freecodecampjfse@cluster0-shard-00-00-d6jzq.mongodb.net:27017,cluster0-shard-00-01-d6jzq.mongodb.net:27017,cluster0-shard-00-02-d6jzq.mongodb.net:27017/fcc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true });

module.exports = function (app) {
    app.route('/api/issues/:project')
      .get(function (req, res){
        var project = req.params.project;
        Project.find({projectname: project})
          .or(req.query)
          .sort({_id: -1})
          .exec((err, data)=>{
          if(err){
            res.send('project(s) not found');
          } else {
            res.send(data);
          }
        });

      })

      .post(function (req, res){
        var project = req.params.project;
        let issue_title = req.body.issue_title;
        let issue_text = req.body.issue_text;
        let created_by = req.body.created_by;
        let assigned_to = req.body.assigned_to;
        let status_text = req.body.status_text;


        var project = new Project({
          projectname: project,
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          status_text: status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        })

        project.save((err, data)=> {
          if(err){
            res.send('missing inputs');
          } else {
            res.json(data);
          }

        })
      })

      .put(function (req, res){
        var project = req.params.project;
        Project.find({projectname: project}, (err, data)=>{
          if(err){
            res.send('project not found');
          } else {
            data.forEach(proj=>{
                if(req.body.issue_title) {proj.issue_title = req.body.issue_title;}
                if(req.body.issue_text) {proj.issue_text = req.body.issue_text; }
                if(req.body.created_by) {proj.created_by = req.body.created_by; }
                if(req.body.assigned_to) {proj.assigned_to = req.body.assigned_to; }
                if(req.body.status_text) {proj.status_text = req.body.status_text; }
                proj.open = req.body.open;
                proj.save((err, updateData)=> {
                      if(err){
                        res.send('missing inputs');
                      } else {
                        res.send('successfully updated');
                      }
                });
              });
          }
        })
      })

      .delete(function (req, res){
        Project.findOneAndDelete({_id: req.body._id}, (err, data)=>{
          if(err){
            res.send('failed!')
          } else {
            res.send('deleted ' + req.body._id);
          }
        });

      });

};
