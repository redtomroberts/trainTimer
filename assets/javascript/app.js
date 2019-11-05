$(document).ready(function(){
    var firebaseConfig = {
        apiKey: 'AIzaSyD1CNDBu-iOR-NhKbOkscWL8Xa5KkcV10k',
        authDomain: 'mbta-scheduler-8c354.firebaseapp.com',
        databaseURL: 'https://mbta-scheduler-8c354.firebaseio.com',
        projectId: 'mbta-scheduler-8c354',
        storageBucket: 'mbta-scheduler-8c354.appspot.com',
        messagingSenderId: '1057861022473',
        appId: '1:1057861022473:web:57e7edeae5a781a5c999d8',
        measurementId: 'G-XSBBPJ4W1F'
    };
    firebase.initializeApp(firebaseConfig);

    // A variable to reference the database.
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $('#add-train').on('click', function() {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $('#train-name').val().trim();
        destination = $('#destination').val().trim();
        firstTrain = $('#first-train').val().trim();
        frequency = $('#frequency').val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $('form')[0].reset();
    });

    database.ref().on('child_added', function(childSnapshot) {
        var nextArr;
        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain, 'hh:mm');
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), 'minutes');
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, 'minutes');
        nextTrain = moment(nextTrain).format('hh:mm');

        $('#add-row').append('<tr><td>' + childSnapshot.val().name +
                '</td><td>' + childSnapshot.val().destination +
                '</td><td>' + childSnapshot.val().frequency +
                '</td><td>' + nextTrain + 
                '</td><td>' + minAway + '</td></tr>');

            // Handle the errors
        }, function(errorObject) {
            console.log('Errors handled: ' + errorObject.code);
    });

    database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function(snapshot) {
        // Change the HTML to reflect
        $('#name-display').html(snapshot.val().name);
        $('#email-display').html(snapshot.val().email);
        $('#age-display').html(snapshot.val().age);
        $('#comment-display').html(snapshot.val().comment);
    });
});