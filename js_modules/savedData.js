
var fs = require('fs');
require('colors');

function SavedData(){
    // Retrieves and displays all data saved in log.txt
    this.getSavedData = function(){
        fs.readFile('./text/log.txt', 'utf8', function(err, data){
            if (err) throw err;
            if (!data) {
                console.log('\nSorry, no data could be found.\n'.magenta);
            } else {
                console.log('\nHere is your requested data:\n'.magenta);
                var dataArr = data.split(',');
                dataArr.forEach(item => console.log(item.yellow));
            }
        });
    }
}

module.exports = SavedData;