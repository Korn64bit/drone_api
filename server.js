const express = require("express");
const app = express();
const PORT = 8000;

const customers = [
  { id: 1234, name: "Steven Adams", birthdate: "1980-01-02" },
  { id: 5678, name: "James Lukather", birthdate: "1980-01-02" },
];

// make Express.js able to parse json body
app.use(express.json());
const url = "https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec";
const logs_url = "https://app-tracking.pockethost.io/api/collections/drone_logs/records"
const convert = response => response.json();

app.post("/logs",async (req,res)=>{
  console.log("posting log data");
  console.log(req.body)
  const rawData = await fetch(logs_url,
    {
      method : "POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(req.body)
    });
  res.send("OK");
});

app.get("/logs",async(req, res)=>{
  console.log("/logs")
  const rawData = await fetch(logs_url,{method:"GET"});
  const jsonData = await rawData.json();
  const logs = jsonData.items ;
  res.send(logs);

  try{

  }catch(error){
    console.log(error);
  }
  })

//1.)npm i express
/*
app.get("/config/:drone_id", (req, res) => {
  res.send( { name: "WTF BRO" }); // ลอง localhost:8000/config/65010131 => output บนหน้าจอเป็น WTF BRO
})
*/

//2.)npm nodemon -g => monitor code if it changes it auto run the new code
//nodemon server.js replace node server.js
//nodemon to run script is better

//3.)fetch <== function to get json from api link => fetch("https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec")

app.get("/configs/:my_drone_id", async (req, res) => {
  const id = req.params.my_drone_id;
  const rawData = await fetch(url, { method: "GET" }); //if no await return "promise"/ if await will wait in this line
  const jsonData = await rawData.json();

  const drones = jsonData.data;
  const myDrone = drones.find(item => item.drone_id == id);

  myDrone.max_speed = !myDrone.max_speed ? 100 : myDrone.max_speed;
  myDrone.max_speed = myDrone.max_speed > 110 ? 110 : myDrone.max_speed;
  //a ? b : c
  //const max = (myDrone.max_speed = null) ? 100 : myDrone.max_speed = 100;
  
  //myDrone.max_speed = !myDrone.max_speed ? 100 : myDrone.max_speed; //ย่อกว่าเดิม
  //myDrone.max_speed = myDrone.max_speed > 110 ? 110 : myDrone.max_speed;

  //.then(data => console.log(data));
  //res.send({ name: "WTF BRO" });
  /*
  if (myDrone.max_speed = null){
    myDrone.max_speed = 100;
  }
  if (myDrone.max_speed > 110){
    myDrone.max_speed = 110;
  } 
  res.send(myDrone);
  */
  res.send(myDrone);
})

app.get("/", (req, res) => {
  res.send("Hello API World!");
});

app.get("/customers", (req, res) => {

  // response with all customer data
  res.send(customers);
})

// http://localhost:3000/customers/1234
app.get("/customers/:id", (req, res) => {
  // get target id from request params
  const id = req.params.id;

  // find customer by id
  const myCustomer = customers.find(item => item.id == id);

  if (!myCustomer) { // if customer not found

    //response with error message
    res.status(404).send({ status: "error", message: "Customer not found" });

  } else {

    // response with customer data
    res.send(myCustomer);
  }

})

app.delete("/customers/:id", (req, res) => {
  // get target id from request params
  const id = req.params.id;

  // find index of the element that has the target id
  const index = customers.findIndex(item => item.id == id);
  // remove the element from the array
  customers.splice(index, 1);

  // response with successful message
  res.send({ status: "success", message: "Customer deleted" });
})

app.post("/customers", (req, res) => {

  // get new customer from request body
  const newCustomer = req.body;

  // insert new customer record
  customers.push(newCustomer);

  // response with successful message
  res.send({ status: "success", message: "Customer created" });
})

// running server on specified PORT
app.listen(PORT, () => {
  // inform admin that server is running
  console.log(`Server running on port ${PORT}`);
});
