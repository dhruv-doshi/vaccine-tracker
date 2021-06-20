const PORT = process.env.PORT || 5000

const prompts = require('prompts');
const axios = require('axios')
const chalk = require('chalk')

const {vaccine_checker} = require('./util') // calls the function from utils.js file

// Initialise express
const express = require('express');
const app = express();

let district_code, age, todaysDate;

// get the date
const d = new Date();
let day = d.getDate();
day = ("0" + day).slice(-2);
let month = d.getMonth() + 1;
month = ("0" + month).slice(-2);
const year = d.getFullYear();
todaysDate = day + "-" + month + "-" + year;

run = () => {
    // get the list of states
    axios.get('https://www.cowin.gov.in/api/v2/admin/location/states')
    .then((response) => {
      let result = []
      for(let i =0; i<response.data.states.length ; i=i+1) {
        result.push({
            title: response.data.states[i].state_name,
            value: response.data.states[i].state_id
        })
      }
      return result
    })
    .catch((error) => {
      console.log("State Data could not be retreived");
    })
    .then(async (stateData) => {
        // get user input on which state the user is from
        const stateSelection = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which state are you from?',
            choices: stateData
          });
        //console.log(stateSelection.value)

        // get list of districts
            axios.get('https://www.cowin.gov.in/api/v2/admin/location/districts/' + stateSelection.value)
            .then((response) => {
                let result = []
                for(let i =0; i<response.data.districts.length ; i=i+1) {
                    result.push({
                        title: response.data.districts[i].district_name,
                        value: response.data.districts[i].district_id
                    })
                }
                return result
            })
            .catch((error) => {
              console.log("District Data could not be retreived");
            })
            .then(async (districtData) => {
                // ask user for input on their district 
                const districtSelection = await prompts({
                    type: 'select',
                    name: 'value',
                    message: 'Which district are you from? ',
                    choices: districtData
                  });
                district_code = districtSelection.value;
                //console.log(districtSelection.value)

                // ask user for age
                const ageData = await prompts({
                    type: 'number',
                    name: 'value',
                    message: 'How old are you?'
                  });

                age = ageData.value
                //console.log(ageData.value)
                vaccine_checker(district_code, todaysDate, age) // checks if the vaccines are available
                // runs the code every 60s
                setInterval(() => {
                    vaccine_checker(district_code, todaysDate, age)     
                }, 60 * 1000);
          });
  });
}

run();

app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
    console.log(chalk.blue('Click on CLT + C to exit the program'))
})