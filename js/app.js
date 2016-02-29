function leadingZero(num){
  var str = num.toString();
  if(str.length == 1){
    return "0" + str;
  } else {
    return str;
  }
}

function timeStamp(){
  var mills, sec, min, hr, day, mon, yr, d;
  d = new Date();
  sec = d.getSeconds();
  min = d.getMinutes();
  hr = d.getHours();
  day = d.getDate();
  mon = d.getMonth() + 1;
  yr = d.getFullYear();

  return yr + '/' + leadingZero(mon) + '/' + leadingZero(day) + ' ' + leadingZero(hr) + ':' + leadingZero(min) + ':' + leadingZero(sec);
}

$(document).ready(function(){
  $('.left').on('click', '.item', function(){
    var div = $(this);
    var time = timeStamp(); // Creates/assigns timeStamp to time variable
    var name = $('.input-txt').val(); // Assigns the text in the text box to name
    if(name.length === 0){
      name = "Unknown"; // Unknown is assigned to name if the text box is left blank
    }
    div.hide('slow');
    // Dynamically creates and appends a new div using the key#, name, and timeStamp
    $('<div class="item out"><h2>' + div.text() + ' <span class="small">&emsp;Signed Out By: ' + name + ' &#64; ' + time + '</span><button type="button" class="remove">Sign Key In</button></h2></div>').show('slow').appendTo(".right");
    $('.input-txt').val(''); // Resets the text box
  });

  $('.right').on('click', '.remove', function(){
    var item, text, index, str;
    item = $(this).parent();
    text = $(this).parent().text(); // Assigns the text from the item to text variable
    index = text.indexOf('#'); // Gets the starting index of the key
    str = text.substring(index, index + 6); // Assigns a substring of the original text to str
    item.empty().remove(); // Removes the div/item from the "out" bin
    $('<div class="item hover"><h2>' + str + '</h2></div>').show('slow').appendTo(".left");
  });
});
