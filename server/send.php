<?php
    $filename = 'somefile.txt';
    $arr = array();
    $req = json_decode(file_get_contents('php://input'), true);

    foreach($req as &$value) {
        array_push($arr, $value);
    }

    $data = file($filename);

    if (filesize($filename) > 3) {
        $lastLine = explode(' :: ', trim($data[count($data)-1]));
        $id = $lastLine[0] + 1;
    } else {
        $id = 1;
    };

    $text = $id.' :: '.implode(' :: ', $req)."\n";
       
    file_put_contents($filename, $text, FILE_APPEND);

    $num = $req['number'] * $req['cost'];
    
    array_push($arr, $num);
    array_unshift($arr, $id);

    echo json_encode($arr)
?>