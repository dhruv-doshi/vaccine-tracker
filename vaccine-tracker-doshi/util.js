const axios = require('axios')
const chalk = require('chalk')

module.exports = {
    vaccine_checker: (district_code, todaysDate, age) => {
        // get the vaccine availability based on age and district
        axios.get('https://www.cowin.gov.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' 
        + district_code + '&date=' + todaysDate)
    .then((response) => {
      return response.data.centers
    })
    .catch((error) => {
      console.log("Vaccine Data could not be retreived");
    })
    .then((data) => {

      let vaccine_availability = false

      // check if the vaccines are available
      for(let i =0; i<data.length ; i=i+1) {
          for(let j = 0; j<data[i].sessions.length; j=j+1) {
              if(data[i].sessions[j].available_capacity > 0 && 
                    data[i].sessions[j].min_age_limit < age) {
                        vaccine_availability = true
                        // console.log(data[i])
                        // uncomment the above line to also give the output of the centre details
                    }
          }
      }
      if(vaccine_availability) {
        console.log('\x07')
        console.log(chalk.green('Vaccines are available'))
      } else {
        console.log(chalk.red('Vaccines are not available'))
      }
  }); 
    }
}