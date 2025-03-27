<?php
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Cargar .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "error" => "No se recibieron datos"]);
    exit;
}

$nombre = htmlspecialchars($data["nombre"]);
$correo = htmlspecialchars($data["correo"]);
$asunto = htmlspecialchars($data["asunto"]);
$mensaje = htmlspecialchars($data["mensaje"]);

$apiKey = $_ENV["RESEND_API_KEY"];
$from = $_ENV["RESEND_FROM"];
$to = $_ENV["RESEND_TO"];

$payload = json_encode([
    "from" => $from,
    "to" => [$to],
    "subject" => $asunto,
    "html" => "
        <p><strong>Nombre:</strong> $nombre</p>
        <p><strong>Correo:</strong> $correo</p>
        <p><strong>Mensaje:</strong><br>$mensaje</p>"
]);

$ch = curl_init("https://api.resend.com/emails");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($statusCode === 200 || $statusCode === 202) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $response]);
}
