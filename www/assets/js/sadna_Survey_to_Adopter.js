
/* 
// Google Apps Script code (Code.gs)

function doPost(e) {
    var ss = SpreadsheetApp.openById("1KNg1KeZBsqXody-s40g2lrHHaIF3n4A73nWw8p6eu-o"); // Replace with your Google Sheets ID
    var sheet = ss.getSheetByName("Sheet1"); // Replace with your sheet name
    var data = e.parameter;
    sheet.appendRow([data.name, data.association, data.date, data.communication, data.orderly_process, data.detailed_answers, data.info_from_association, data.info_from_website, data.association_support, data.recommended_veterinarians]);
    return ContentService.createTextOutput("Success");
  }

  // HTML/JavaScript code

let form = document.querySelector("#Form");

form.addEventListener('submit', (e) => {
     e.preventDefault();
     document.querySelector("#submit").value = "Submitting..";

     let data = new FormData(form);

     fetch('https://script.google.com/macros/s/AKfycbzfCU20rSjoFeTVHm8S8jT6FcnJgGuTfdNdNmS8xIKqFybS1NzkcDuao2Ll3nh03-Iw5w/exec', { // Replace with your deployed Google Apps Script URL
             method: "POST",
             body: data
         })
         .then(res => res.text())
         .then(data => {
             document.querySelector("#msg").innerHTML = data;
             document.querySelector("#submit").value = "Submit";
         })
         .catch(error => {
             console.error('Error submitting form:', error);
             document.querySelector("#msg").innerHTML = "Error submitting form.";
             document.querySelector("#submit").value = "Submit";
         });
});
*/

$(document).ready(function() {
  $("#form").submit(function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzmtY_NUJRQEjJpH9BqmHIKfIsAX29Z_zH7tGaqKyMgHOYMtHS4ALkvhQlfn2rwEiPq/exec",
      type: "POST",
      data: data,
      success: function(response) {
        console.log(response);
      }
    });
  });
});

