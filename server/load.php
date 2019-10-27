<?php
  $filename = 'somefile.txt';
  $arr = array();

  $file = file($filename);

  if (filesize($filename) <= 3){

    echo json_encode('Файл пуст');

  } else{

    foreach ($file as &$value) {
      $str = trim($value);
      array_push($arr, explode(" :: ", $str));
    };


    foreach ($arr as &$value) {
        $num = $value[3] * $value[4];
        array_push($value, $num);
    };
        
    echo json_encode($arr);
  }
?>