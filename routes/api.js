'use strict';
const ProjectModel = require('../models').Project;
const IssueModel = require('../models').Issue;
const db = require('../db-connection');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let filter = req.query;

      function isEmpty(o){
        return (Object.entries(o).length === 0 && o.constructor === Object);
      }

      if(mongoose.connection.readyState == 1){
        var isProject = await ProjectModel.findOne({name: project});
        console.log('issuesA', isProject);
        console.log('000: ', req.query);
        if(isEmpty(filter)) {
          console.log('issuesB', isProject.issues);
          res.json(isProject.issues)
        } else {
          // console.log('Query', new Map([filter]));
          console.log('Query', filter);
          let issuesArray = isProject.issues;
          let resArray = [];
          for(let [key, value] of Object.entries(filter)){
            // console.log('KEY: ', key, value);
            issuesArray.filter(issue => {
              // console.log('filtering: ', key, value, issue[key], issue);
              if(issue[key] == value) resArray.push(issue);
            }); 
          };
          console.log('JSON', resArray);
          res.json(resArray);
        }
      }
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if(!issue_title || !issue_text || !created_by){
        res.json({ error: 'required field(s) missing' });
        return;
      }

      const newIssue = new IssueModel({ 
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      });
      console.log('=>', mongoose.connection.readyState);
      if(mongoose.connection.readyState == 1){
        var isProject = await ProjectModel.findOne({name: project});
        console.log('issues', isProject);
        if(!isProject) {
          var newProject = new ProjectModel({name: project});
          console.log('proj', newProject);
          newProject.issues.push(newIssue);
          newProject.save()
          .then(data => {
            console.log('DATA: ',data);
            res.json(newIssue);
          })
          .catch(err => console.error(err));
        } else {
          console.log('isProjectExists', isProject);
          isProject.issues.push(newIssue);
          isProject.save()
          .then(data => {
            console.log('DATA2: ',data);
            res.json(newIssue);
          })
          .catch(err => console.error(err));
        }
      }
      // res.json();
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      // console.log('RICK: ', req.body);
      if(mongoose.connection.readyState == 1){
        var isProject = await ProjectModel.findOne({name: project});
        console.log('issuesA', isProject);
        if(!_id){
          res.json({error: 'missing id'});
        }

      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};

//  const {  
//         issue_title,
//         issue_text,
//         created_on,
//         updated_on,
//         created_by,
//         assigned_to,
//         open,
//         status_text,
//         _id
//       } = req.query;
      
  // console.log('AssignedRTo: ', assigned_to);

  //     // console.log('=>', mongoose.connection.readyState);
  //     if( mongoose.connection.readyState == 1) {
  //       ProjectModel.aggregate([
  //         { $match: { name: project } },
  //         { $unwind: "$issues" },
  //         _id != undefined 
  //         ? { $match: { _id: ObjectId(_id) }} 
  //         : { $match: {} },
  //         issue_title != undefined 
  //         ? { $match: { issue_title: issue_title }} 
  //         : { $match: {} },
  //         issue_text != undefined 
  //         ? { $match: { issue_text: issue_text }} 
  //         : { $match: {} },
  //         created_on != undefined 
  //         ? { $match: { created_on: created_on }} 
  //         : { $match: {} },
  //         updated_on != undefined 
  //         ? { $match: { updated_on: updated_on }} 
  //         : { $match: {} },
  //         created_by != undefined
  //         ? { $match: { created_by: created_by }} 
  //         : { $match: {} },
  //         assigned_to != undefined
  //         ?{ $match: { assigned_to: assigned_to }} 
  //         : { $match: {} },
  //         (open != undefined)
  //         ? { $match: { open: open }} 
  //         : { $match: {} },
  //         status_text != undefined 
  //         ? { $match: { status_text: status_text }} 
  //         : { $match: {} }
  //       ])
  //       .exec()
  //       .then(data => {
  //           console.log('DATA: ', data);
  //           let mappedData = data.map((item) => item.issues);
  //           console.log('DATABC: ', mappedData);
  //           res.json(mappedData);
  //       })
  //       .catch(err => console.error(err));  
  //     }