var utils = Utils.prototype;

// Public
module.exports = Utils;

function Utils() {}

utils.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

utils.formatTime = function (timestamp) {   

      var a = new Date(timestamp);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      //var month = months[a.getMonth()];
      var month = a.getMonth();
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      var time = year+'-'+month+'-'+date+'T'+hour+':'+min+':'+sec;//%Y-%m-%dT%H:%M:%S
      return time;
};