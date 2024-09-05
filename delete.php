
<?php
    require "config.php";

    $data = json_decode(file_get_contents('php://input'), true);
    $itemId = $data["item_id"] ?? "";

    $response = [];

    if (empty($itemId)) {
        $response["status"] = "Error";
        $response["message"] = "Item ID cannot be empty!";
        echo json_encode($response);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM expense_trackermark WHERE item_id = ?");
    $stmt->bind_param("s", $itemId);

    if ($stmt->execute()) {
        // Calculate the updated total expenses after deletion
        $result = $conn->query("SELECT SUM(price) AS total FROM expense_trackermark");
        $row = $result->fetch_assoc();
        $response["totalExpenses"] = $row['total']; // Pass the updated total expenses
        
        $response["status"] = "success!";
        $response["message"] = "Deleted Successfully!";
        echo json_encode($response);
        return;
    } else {
        $response["status"] = "Error";
        $response["message"] = "Failed to execute query";
        echo json_encode($response);
        return;
    }
?>


