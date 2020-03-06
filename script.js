const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const { exec } = require('child_process');
const LCD = require('lcdi2c');
const WeatherModel = require('./db/models/weather').WeatherModel;

// dotenv config
dotenv.config({ path: '.env' });
// database config
const { database, user, pass, dbuser, host } = process.env;
// python script config
const SCRIPT_PATH = 'python3 py/AdafruitDHT.py 22 4';
// LCD config
const ver = 1;
const lcdPort = 0x27;
const displayLength = 16;
const displayLines = 2;
const repeatTime = 5000; //5sec
const longLoop = 1 * 1000 * 60 * 30; //30 mins

const lcd = new LCD( ver, lcdPort, displayLength, displayLines );

// TODO: update Python return signature
// temporary workaround on python code
const stringToNum = (text) => parseInt(text.match(/\d/g).join(''));
let counter = 0;
setInterval(() => { 
  exec(SCRIPT_PATH,
        (error, stdout, stderr) => {
	  const array = stdout.split(' ')
	  const temp = array[0];
	  const hum = array[2].substring(0, array[2].length - 1);
	    
	  lcd.clear();
	  lcd.print(temp.padEnd(40, ' '));
	  lcd.print(hum);
	  console.log(temp, hum, new Date(), counter)
	  
	  counter++;
	  if(counter >= 360) {
	    saveToDB(stringToNum(temp), stringToNum(hum));
	    counter = 0;
	  }
          
	  if (error !== null) {
	    console.log(`exec error: ${error}`);
          }
        });
  }, repeatTime);


// convert to dotent
const sequelize = new Sequelize('pi', 'raspi', 'raspi', {
    host: 'localhost',
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  });



const weather = WeatherModel(sequelize, Sequelize);

async function saveToDB(t, h) {
  try {
    let newValue = await weather.create({
    temperature: t,
    humidity: h,
    date: new Date()
    });
    await newValue.save();
    console.log(`sucessfully saved`)
  } catch (error) {
    console.log(`oops, something went wrong with db while creating ${error}`)
  }	
}

sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
