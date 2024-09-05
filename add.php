<?php
    require "config.php";

    $studentId = uniqid();
    $itemName= $_POST["item"]??"";
    $itemPrice = $_POST["price"]??"";



    $response = [];
    if (empty($itemName)){
        $response["status"] = "Error";
        $response["message"] = "Item name cannot be empty!";
        echo json_encode($response);
        return;
    }
    if (empty($itemPrice)){
        $response["status"] = "Error";
        $response["message"] = "Item price cannot be empty!";
        echo json_encode($response);
        return;
    }
    if ($itemPrice > 1000) {
        $response["status"] = "Error";
        $response["message"] = "item price limited to 1,000 only!";
        echo json_encode($response);
        return;
    }


    $stmt = $conn->prepare("INSERT INTO expense_trackermark (item_id, item	, price) values (?,?,?)");
    $stmt->bind_param("sss", $studentId, $itemName, $itemPrice);

    if($stmt->execute()){
        // Calculate the updated total expenses after insertion
        $result = $conn->query("SELECT SUM(price) AS total FROM expense_trackermark");
        $row = $result->fetch_assoc();
        $response["totalExpenses"] = $row['total']; // Pass the updated total expenses

        $response["status"] = "success!";
        $response["message"] = "Added Successfully!";
        echo json_encode($response);
        return;
    }else{
        $response["status"] = "Error";
        $response["message"] = "Failed to execute query";
        echo json_encode($response);
        return;
    }
?>