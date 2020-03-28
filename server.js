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
    const output = await invokeAction(); // this takes 20-25 minutes!
    console.log(`output: ${output}`);

    /*
     * If I uncomment the line below, while commenting out line 69, i.e. if I return the
     * HTTP response to caller only AFTER awaiting the result of the invokeAction, 
     * executing the execFile() on the main thread, it takes 15-20 seconds!
     */
    //res.status(200).send(output);
  }
  
  // invoke the async function defined above
  invoke();

  /* 
   * If I remove the line below and instead return after awaiting the invokeAction call, 
   * the operation only takes 15-20 seconds.  But if I return the HTTP response to the caller 
   * immediately (so I can free up the main thread for more requests), as the code is 
   * currently written, the invokeAction call takes 20-25 minutes to complete.
   */
  res.status(200).send("running");
});

// Launch the API Server at PORT, or default port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('listening on port', port);
});
