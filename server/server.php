<?php

header('Access-Control-Allow-Origin: *'); //允许跨域

if ((($_FILES["file"]["type"] == "image/gif")
    || ($_FILES["file"]["type"] == "image/jpeg")
    || ($_FILES["file"]["type"] == "image/pjpeg")
    || ($_FILES["file"]["type"] == "image/png"))
    && ($_FILES["file"]["size"] < 2 * 1000 * 1000 * 1000)){
    if ($_FILES["file"]["error"] > 0) {
        echo "Return Code: ".$_FILES["file"]["error"]."<br />";
    } else {
        echo "Upload: ".$_FILES["file"]["name"]."<br />";
        echo "Type: ".$_FILES["file"]["type"]."<br />";
        echo "Size: ".($_FILES["file"]["size"] / 1024)." Kb<br />";
        echo "Temp file: ".$_FILES["file"]["tmp_name"]."<br />";

        move_uploaded_file($_FILES["file"]["tmp_name"], "upload/".'upload'.date('YMDHis').$_FILES['file']['name']);
        echo "Stored in: "."upload/".$_FILES["file"]["name"];
    }
} else {
  echo "Invalid file";
}
?>