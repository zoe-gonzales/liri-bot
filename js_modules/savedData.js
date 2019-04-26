const fs = require('fs');
require('colors');

class SavedData {
    // Retrieves and displays all data saved in log.txt
    getSavedData(){
        fs.readFile('./text/log.txt', 'utf8', (err, data) => {
            if (err) throw err;
            if (!data) {
                console.log('\nSorry, no data could be found.\n'.magenta);
            } else {
                console.log('\nHere is your requested data:\n'.magenta);
                let dataArr = data.split(',');
                dataArr.map(item => console.log(item.yellow));
            }
        });
    }
}

module.exports = SavedData;