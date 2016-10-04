<?php

if (empty($_GET['ext']) || strpos($_GET['ext'], '.') !== false || !file_exists($_GET['ext'].'.png')) {
    header('Location:XXX.png');
} else {
    header('Location:'.$_GET['ext'].'.png');
}
