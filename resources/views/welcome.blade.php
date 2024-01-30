<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" href="/logo.svg" type="image/svg">

    <title>BIT | Home</title>
</head>
<body>
<div id='root'></div>

@vitereactrefresh
@vite(['resources/ts/main.tsx'])
</body>
</html>
