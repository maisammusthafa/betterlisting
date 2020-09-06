<!DOCTYPE html>

<!-- BetterListing - devCoster.com -->
<!-- Coster coster@devcoster.com -->
<!-- Version 1.0a -->

<html lang='en'>
    <head>
        <meta charset='utf-8' />

        <!-- Bootstrap Core CSS -->
        <link rel='stylesheet' href='/betterlisting/css/bootstrap-3.3.7.min.css'>

        <!-- Fonts -->
        <link rel='stylesheet' href='/betterlisting/css/nerd-fonts-2.0.0.min.css'>

        <!-- Styles -->
        <link rel='stylesheet' href='/betterlisting/css/app.css'>

        <!-- jQuery -->
        <script src='/betterlisting/js/jquery-3.5.1.slim.min.js'></script>

        <!-- JavaScript -->
        <script>
            var srvData = <?php
                $info = array(
                    'df' => round(disk_free_space('/') / pow(1024, 3), 2),
                    'dt' => round(disk_total_space('/') / pow(1024, 3), 2),
                    'srv' => $_SERVER['SERVER_SOFTWARE'],
                    'host' => php_uname($mode = 'n'),
                    'os' => sprintf('%s %s %s',
                        php_uname($mode = 's'),
                        php_uname($mode = 'r'),
                        php_uname($mode = 'm'),
                    ),
                );

                echo json_encode($info, JSON_HEX_TAG);
            ?>;
        </script>

        <script src='/betterlisting/js/app.js'></script>
    </head>

    <body>
        <div class='container'>
            <div class='row'>
                <div class='col-xs-11 col-centered' id='mainBox'>
    <!-- Start of nginx output -->
