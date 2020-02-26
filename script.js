const { exec } = require('child_process');
const LCD = require('lcdi2c');

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
