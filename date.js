//jshint esversion:6

//EXPORTS SHORTCUT


//USING ANONYMOUS FUNCTIONS AND SAVING TO VARIABLE.
//AND also using 'exports' instead of 'module.exports'

exports.getDate = function() {

    var today = new Date();
    const options = {
        weekday: "long",
        day:"numeric",
        month:"long"
    };
    
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {

    var today = new Date();
    const options = {
        weekday: "long"
    };
    
    return today.toLocaleDateString("en-US", options);

}



// FUNCTION DECLARATION

// module.exports.getDate = getDate;
// module.exports.getDay = getDay;

// function getDate() {

//     var today = new Date();
//     var options = {
//         weekday: "long",
//         day:"numeric",
//         month:"long"
//     };
    
//     return today.toLocaleDateString("en-US", options);
// }

// function getDay() {

//     var today = new Date();
//     var options = {
//         weekday: "long"
//     };
    
//     return today.toLocaleDateString("en-US", options);

// }
