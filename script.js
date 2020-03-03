const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const { exec } = require('child_process');
const LCD = require('lcdi2c');

//database config
const { database, user, pass, user, host } = process.env;
//-------
const ver = 1;
const lcdPort = 0x27;
const displayLength = 16;
const displayLines = 2;
const repeatTime = 5000;

const lcd = new LCD( ver, lcdPort, displayLength, displayLines );

//TODO: update Python return signature
setInterval(() => { 
  exec('python3 py/AdafruitDHT.py 22 4',
        (error, stdout, stderr) => {
	  
	  const array = stdout.split(' ')
	  const temp = array[0];
	  const hum = array[2].substring(0, array[2].length - 1);
	  
	  lcd.clear();
	  lcd.print(temp.padEnd(40, ' '));
	  lcd.print(hum);
	  
	  console.log(new Date(), temp, hum)
          
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
	
  }, repeatTime);


const sequelize = new Sequelize(database, user, pass, {
    host: host,
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  });

sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
