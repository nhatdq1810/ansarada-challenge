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
  return _.reduce(documents, function(array, document){
    if(document.parentId === parentId){
      array.push(document);
    } else {
      var parent = _.find(documents, {id : document.parentId});
      if(parent){
        if(!parent.children){
          parent.children = [];
        }
        parent.children.push(document);
      }
    }

    return array;
  },[]);
}
var queryDocuments = function(req){
  var params = {},
    parentId = req.query.parentId,
    expandedFolders = req.query.expandedFolders,
    search = req.query.search,
    expandAll = !!req.query.expanded || false,
    parentIds;

  if(parentId !== undefined){
    parentId = parseInt(parentId, 10) || null;
  }
  if(expandedFolders){
    expandedFolders = _.map( (expandedFolders || '').split(','), function(str){
      return parseInt(str, 10);
    });
  }

  if(parentId !== undefined || expandedFolders){
    parentIds = (parentId === undefined) ? [] : [parentId];
    parentIds.push.apply(parentIds, expandedFolders || []);
  } else {
    parentIds = [];
  }


  if(search){
    params.number = params.name = new RegExp(search, 'i');
  }

  params.type = {
    '$ne' : 'folder'
  };

  if(parentId){
    params.ancestor = parentId;
  }

  return db.documents.qfind(params).then(function(documents){
    var ids = _.chain(documents)
      .map(_.property('ancestor'))
      .flatten()
      .unique()
      .value();

    var folderParams = {
      type : 'folder',
      id : {
        '$in' : ids
      }
    };

    if(expandAll){
      //Do nothing, it should find it all by default
    } else if(parentIds.length){
      folderParams.parentId = {
        '$in' : parentIds
      };
    }

    return db.documents.qfind(folderParams).then(function(folders){
      var filteredDocuments = _.filter(documents, function(document){
        return expandAll || !!~parentIds.indexOf(document.parentId);
      });
      return constructChildren(utils.sort(filteredDocuments.concat(folders)), parentId);
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