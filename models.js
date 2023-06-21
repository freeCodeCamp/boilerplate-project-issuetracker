const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const isssue =  new Schema({ 
    // _id: { type: String, required: true, unique: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, required: true },
    assigned_to: String,
    open: Boolean,
    status_text: String
});
const Issue = mongoose.model('issue', isssue);

const projectSchema = new Schema({
    name: String,
    issues: [isssue]
}, 
{ collection: 'projectIssues' },
{ bufferCommands: false });
const Project = mongoose.model('project', projectSchema);

exports.Project = Project;
exports.Issue = Issue;
 