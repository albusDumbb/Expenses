<?php
   require "config.php";

   $sql = "SELECT * FROM expense_trackermark"; 
   $result = $conn->query($sql);

   $arr = [];
   $status = '';
   $totalExpenses = 0;

   if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
         $arr[] = $row;
         $totalExpenses += (int)$row['price']; //yung (int), i cconvert nya yung text type na field
         $status = "Success!";
      }
      
   } else {
      $status = "No data.";
   }

   $response = [
      "status" => $status, 
      "totalExpenses" => $totalExpenses,
      "data" => $arr
      
   ];

   

   echo json_encode($response);
   
?>
