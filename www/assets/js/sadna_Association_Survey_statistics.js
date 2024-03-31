function updateChartFromServer(chart, association, questionNum)
{
   
    fetch("/users/getAnswersInfo?association=" + association + "&question=" + questionNum, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => { 
                    // Example for data: {"1": 0, "2": 3, "3": 5, "4": 2, "5": 0}
                    console.log("answersInfo from server:", data);  
                    let arrResponse = [0,0,0,0,0];
                    //This command does: {"1": 0, "2": 3, "3": 5, "4": 2, "5": 0} ==> [0,3,5,2,0] 
                    Object.keys(data).forEach(answerNum => arrResponse[answerNum-1]=data[answerNum]);
                    let sum = 0;
                    // This command does: [0,3,5,2,0] ==> sum=11
                    arrResponse.forEach(num => {sum+=num});
                    
                    // This for loop does:  [0,3,5,2,0] => [0, 30, 50, 20, 0]  (in percentage)
                    for (let i=0; i<arrResponse.length; i++)
                    {
                      arrResponse[i] = arrResponse[i]*100/sum;
                    }

                    chart.data.datasets[0].data = arrResponse;
                    chart.update();
                  });
}


// User loggedin as an association.
// Username of this association was saved into localstorage when login done.
let association = localStorage.getItem("username");

let xValues = [
    "1- Strongly Disagree", 
    "2- Disagree", 
    "3- Neutral", 
    "4- Agree", 
    "5- Strongly Agree"
];
let barColors = ["red", "orange","yellow","lightgreen","darkgreen"];

var charts = [];

for (let i=1; i<=7; i++)
{
    charts[i] = new Chart("question_" + i, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: [0, 0, 0, 0, 0]  // Y values
        }]
      },
      options: {
        legend: {display: false},
        scales: {
            yAxes: [{ display: true, stacked: false, ticks: {min: 0, max: 100}}]
        },
        title: {
          display: true,
          text: "question " + i  ,fontSize: 30
        }
      }
    });

    updateChartFromServer(charts[i], association, i);
}


        
  






