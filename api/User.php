<?php
require_once '../db.php';

class User {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function resetUsers() {
        $sql = "DELETE FROM users";
        if ($this->conn->query($sql) === TRUE) {
            return 'success';
        } else {
            return 'Ошибка при сбросе пользователей: ' . $this->conn->error;
        }
    }

    public function getUsers() {
        $sql = "SELECT * FROM users";
        $result = $this->conn->query($sql);
        $users = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        }
        return json_encode($users);
    }

    public function addUser($name, $email) {
        $sql = "INSERT INTO users (name, email) VALUES ('$name', '$email')";
        if ($this->conn->query($sql) === TRUE) {
            return 'success';
        } else {
            return 'Ошибка при добавлении пользователя: ' . $this->conn->error;
        }
    }
}

$userHandler = new User($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'reset':
        echo $userHandler->resetUsers();
        break;
    case 'get':
        echo $userHandler->getUsers();
        break;
    case 'add':
        $name = $_POST['name'];
        $email = $_POST['email'];
        echo $userHandler->addUser($name, $email);
        break;
    default:
        echo 'Invalid action';
}

$conn->close();
?>
