<html>
<?php
$firstname = $_POST["firstname"] . PHP_EOL;
$lastname = $_POST["lastname"] . PHP_EOL;
$servername = "setapproject.org";
$dbname = "csc412";
$username = "csc412";
$password = "csc412";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";
$sql = "INSERT INTO McCarterRibakoff (FirstName, LastName)
VALUES ('$firstname', '$lastname')";
if ($conn->query($sql) === TRUE) {
    echo "<br>New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$sql = "SELECT FirstName, LastName FROM McCarterRibakoff";
$result = $conn->query($sql);



?>
    <body>
        <br>
        Welcome <?php echo $firstname;?>!<br>
        Thank you for visiting!<br>
        Past visitors:
    </body>

<?php
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<br> " . $row["FirstName"]. " " . $row["LastName"];
    }
} else {
    echo "0 results";
}
$conn->close();  
?>
</html>
<?php
    /*
    $visitLog = fopen("visitLog.txt", "r+") or die("Cannot open file");
            while(!feof($visitLog)) {
                echo fgets($visitLog) . "<br>";
            }
    fwrite($visitLog, $firstname);
    fwrite($visitLog, $lastname);
    fwrite($visitLog, $email);
    fclose($visitLog);
     */
?>
