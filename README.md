Для создания базы данных достаточно:
1) зайти в файл migrations/migrations.js и настроить host port user password
2) запустить в терминале node migrations/migrations.js up , база и необходимая таблица должна появиться
3) проверить так же файл db.php так как там как раз настройки соединения с базой, то есть host user password
4) по хорошему страничка должна работать