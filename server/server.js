'use strict';
var express = require('express'),
  q = require('q'),
  _ = require('lodash'),
  utils = require('./utils');

var app = express();
var config = require('../config.js');

app
  .use(require('body-parser').json())
  //Introduce some latency to the mix
  .use(function(req, res, next){
    var latency = parseInt(process.env.LATENCY || config.mock_server.latency, 10) || 0;
    setTimeout(next, (0.8 + Math.random() * 0.4) * latency);
  })
  .use(require('cors')())
  .use(express.static('client'));

//Creating stores
var db = require('./repositories.js');

//Helper function for creating a promise express handler
function qExpressJson(func){
  return function(req, res){
    q.promised(func)(req, res).then(function(data){
      return res.json(data).end();
    }).done();
  };
}
//Hooking up basic api
function constructChildren(documents, parentId){
  parentId = parentId || null;
  var documentsMap = _.indexBy(documents, 'id');
  var rootChildren = [];
  _.each(documents, function(document){
    var childrenArray;
    if(document.parentId !== parentId){
      var parent = documentsMap[document.parentId];
      if(!parent) return;
      if(!parent.children) parent.children = [];
      childrenArray = parent.children;
    } else {
      childrenArray = rootChildren;
    }
    childrenArray.push(document);
  });
  return rootChildren;
}
var queryDocuments = function(req){
  var params = {},
    parentId = parseInt(req.query.parentId, 10) || null,
    search = req.query.search,
    includeChildren = req.query.includeChildren === '1' || false;

  if(search){
    var searchRegExp = new RegExp(search, 'i');
    params['$or'] = [{ number: searchRegExp }, { name: searchRegExp }];
  }
  
  if(parentId != null){
    params.ancestor = { $elemMatch: parentId };
  }

  return db.documents.qfind(params).then(function(documents){
    var ids = _.chain(documents)
      .map(_.property('ancestor'))
      .map(function(ancestor){
        if(parentId != null){
          var index = ancestor.indexOf(parentId);
          var value = _.take(ancestor, index);
          return value;
        }
        return ancestor;
      })
      .flatten()
      .unique()
      .value();

    var folderParams = {
      type : 'folder',
      id : {
        '$in' : ids
      }
    };

    return db.documents.qfind(folderParams).then(function(folders){
      var filteredDocuments = _.chain(documents).concat(folders).filter(function(document){
        return includeChildren || document.parentId == parentId;
      }).uniq(false, 'id').value();
      return constructChildren(utils.sort(filteredDocuments), parentId);
    });
  });
};

app.route('/documents').get(qExpressJson(function(req){
  return queryDocuments(req);
}));

module.exports = {
  start : function(){
    var server = app.listen(process.env.PORT || config.mock_server.port || 3000, function(){
      console.log('server started on port %d', server.address().port);
    });

    return server;
  }
};