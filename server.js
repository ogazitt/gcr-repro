const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');


const execAsync = (cmd, args, options) => {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, options, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

const invokeAction = async () => {
  try {
    const script = `./deploy.sh`;
    const start = new Date().toLocaleTimeString();    
    console.log(`executing command ${script} starting ${start}`);

    // execute the script and await the output
    const output = await execAsync(script);

    const end = new Date().toLocaleTimeString();
    console.log(`finished executing command ${script} at ${end}, returned ${output && output.stdout}`);

    return output;
  } catch (error) {
    console.log(`invokeAction: caught exception: ${error}`);
    return null;
  }
}

// create a new express app
const app = express();

// Enable CORS
app.use(cors());

// Enable the use of request body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Get metadata API endpoint
app.get('/', function(req, res){
  const invoke = async () => {
    const output = await invokeAction();
    console.log(`output: ${output}`);
  }
  invoke();
  res.status(200).send("running");
});

// Launch the API Server at PORT, or default port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('listening on port', port);
});
