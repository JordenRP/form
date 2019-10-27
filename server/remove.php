<?php
    $filename = 'somefile.txt';
    $req = json_decode(file_get_contents('php://input'), true);
  
    $file = file($filename);
    $line = implode(' :: ', $req);
    $length = count($file);

    for( $i = 0; $i < $length; $i++) {
        if(trim($file[$i]) === $line) {
            unset($file[$i]);
        };
    };

    $fo = fopen($filename, "w+");

    foreach($file as &$value) {
        fwrite($fo, $value);
    };
        
    
    fclose($fo);
    

    echo json_encode($req[3]*$req[4])
?>