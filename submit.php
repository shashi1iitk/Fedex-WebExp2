<?php
    if(isset($_POST['data'])){
        $pwd= getcwd();
        $data =  $_POST['data'];
        $email = $_POST['email'];

        $taskcode = $_POST['code'];
        $arr1 = array(
            'Email' => $_POST['email'],
            'Age' => $_POST['age'],
            'Gender' => $_POST['gender'],
            'Handedness' => $_POST['handedness']
            );
        $details = json_encode($arr1);
        
        $arr2 = array(
            'query1' => $_POST['q1'],
            'query2' => $_POST['q2'],
            'query3' => $_POST['q3'],
            'query4' => $_POST['q4']
            );
        $response = json_encode($arr2);
        
        $subject = "Taskcode to be entered on Amazon Mechanical Turk";
        $txt = "Hi!  Thank you once again for your participation.  Your task code is: ".$taskcode;
        $headers = "From: webexp@neuropsych.xyz" . "\r\n";
        
        mail($email,$subject,$txt,$headers);

        mkdir($pwd."/results/$taskcode",0777);
        echo  "Your taskcode is: ".$taskcode;
        file_put_contents($pwd.'/results/'.$taskcode.'/data.csv', $data);
        file_put_contents($pwd.'/results/'.$taskcode.'/details.json', $details);
        file_put_contents('./results/'.$taskcode.'/query_response.json', $response);
    }

?>