Your task is to create an application to view a list of documents.

An API has been defined that will return a list of folders and documents. Its expected that only the top level documents are shown initially. When you click on a folder, it should query the API for more data and update the view accordingly.

You should consider how you would implement these features, so we can discuss at a later time:
  - Have a search input that will filter results to those that have its name or number match the search field
  - Have a button that will expand all the children, and another that will collapse all the children
  - Have a context menu pop up that shows the file size of the document when clicked

Feel free to use any framework/libraries to do this task.
Also feel free to change the mock server located in /server however you see fit.

To get started, install NodeJS and then run (in the project folder):

```
npm install
node server/index.js
```
This will generate some dummy data to populate the api, as well as spin up a server at http://localhost:3000. Any files you put into the client folder will accessible.

API Definition:
```
/documents GET
  
  Gets the a collection of documents.

  Params:
    parentId - Gets the children of a particular parent. By default, it returns the top level documents.

  Returns:
    [
      {
        id : 4,
        parentId : 1,
        isFolder : false | true,
        name : "Name of the document",
        number : "Number of the document",
        fileSize : 1234556,
        children : [
          //List of this folder's children, if requested
        ]
      },
    ]
```