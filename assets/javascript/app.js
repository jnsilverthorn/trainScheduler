var config = {
    apiKey: "AIzaSyDQzbQvTwhbzTu9OvOIgNYgAN4k5pEHScA",
    authDomain: "trainscheduler-22c32.firebaseapp.com",
    databaseURL: "https://trainscheduler-22c32.firebaseio.com",
    projectId: "trainscheduler-22c32",
    storageBucket: "trainscheduler-22c32.appspot.com",
    messagingSenderId: "15057770212",
    appId: "1:15057770212:web:86e5c93f93aa60da9c3ef1"
};

firebase.initializeApp(config);

var database = firebase.database();
var tableRows;
var trainNameInput = $(".trainNameInput");
var destinationInput = $(".destinationInput");
var firstTrainTimeInput = $(".firstTrainTimeInput");
var frequencyInput = $(".frequencyInput");
var submitBtn = $(".submitBtn");

var trainData = {
    name: "",
    destination: "",
    firstTrainTime: "",
    frequency: ""
}

function addToTable() {
    database.ref().once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            //MORE OR LESS FROM CLASS ASSIGNMENTS: week 7 activity 21
            var tFrequency = childData.frequency;
            var firstTime = childData.firstTrainTime;
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes")
            var tRemainder = diffTime % tFrequency;
            var tMinutesTillTrain = tFrequency - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            //*******STUDY HOW TO USE MOMENT.JS BETTER!!!!! ***********
            $(".trainScheduleData").append(
                "<tr data-key='" + childSnapshot.key + "'>" +
                "<td>" + childData.name + "</td>" +
                "<td>" + childData.destination + "</td>" +
                "<td>" + childData.frequency + "</td>" +
                "<td>" + moment(nextTrain).format("hh:mm") + "</td>" +
                "<td>" + tMinutesTillTrain + "</td>" +
                "<td><input type='image' class='trash' src='assets/images/trash.png' height='10px' width='10px'></td>" +
                "</tr>"
            )
        })
    })
}

submitBtn.on("click", function () {
    tableRows++;
    trainData.name = trainNameInput.val().trim();
    trainData.destination = destinationInput.val().trim();
    trainData.firstTrainTime = firstTrainTimeInput.val().trim();
    trainData.frequency = frequencyInput.val().trim();
    if ((trainNameInput.val() !== "") && (destinationInput.val() !== "") && (firstTrainTimeInput.val() !== "") && (frequencyInput.val() !== "")) {
        database.ref().push({
            name: trainData.name,
            destination: trainData.destination,
            firstTrainTime: trainData.firstTrainTime,
            frequency: trainData.frequency
        })
        addToTable();
    } else {
        alert("Fill Out All Necessary Fields")
    }
})

addToTable();

$(document).on("click", ".trash", function () {
    let key = $(this).closest('tr').attr("data-key");
    database.ref(key).remove();
    $(this).closest('tr').remove()
    tableRows--;
})

