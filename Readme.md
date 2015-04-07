Your task is to create the MVP of an application to view a list of documents:

  - An API has been defined that will return a list of folders and documents. 
  - Its expected that only the top level documents are shown initially.
  - When you click on a folder, it should query the API for more data and update the view accordingly.

The purpose of this task is two fold:

  - We want to see how you code
  - We want to see how you think and communicate

To that end, you should write a quick paragraph describing how you would extend the MVP to add the following features:

  - Have a search input that will filter results to those that have its name or number match the search field
  - Have a button that will expand all the children, and another that will collapse all the children
  - Have a context menu pop up that shows the file size of the document when clicked
  
You do not need to actually build the extra features as part of the test.

Details on building the MVP:

  - Feel free to use any framework or libraries to do this task.
  - Also feel free to change the mock server located in /server however you see fit.
  - There are design mockups included in /designs to guide the look and feel.

Note that this task would take quite a long time if you did every possible thing - it is expected that you will set a time limit and prioritise the tasks which best demonstrate the skills most relevant to the role.

To get started, install NodeJS and then run (in the project folder):

```
npm install
node server/index.js
```
This will generate some dummy data to populate the api, as well as spin up a server at http://localhost:5000. Any files you put into the `client` folder will accessible.

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