This project is for download files or upload files to **Amazon S3**.

To run this project you should have node.js and npm in your local machine.

**To upload files to the Amazon S3 server**
>Download all the dependencies using command
```
npm install
```
>Run the **uploadSchedule.js** to schedule a task using command  
```
node uploadSchedule.js
```
>You can change the upload job period ,file directory/name and schedule time/date in **config.js**

**To download files from the Amazon S3 server**
>Download all the dependencies using command
```
npm install
```
>Run the file **downloadAction.js** using command
```
node downloadAction.js
```
>Now select the file you want to download, Enter your choice space separated value
```
```
>Enter the "from" to "to" date in **MM/DD/YYYY** format space separated

You are done!!