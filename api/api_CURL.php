<?php
// Cross-Origin Resource Sharing Header
header('Access-Control-Allow-Origin: *');
header("Content-Type: text/html; charset=utf-8");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');

$url=$_GET['url'];

function load_contents($url)
{
    $curl=curl_init(); // 初始化
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl,CURLOPT_URL,$url);
    $data=curl_exec($curl);
    curl_close($curl);
    return $data;
}

echo $content=load_contents($url);
?>