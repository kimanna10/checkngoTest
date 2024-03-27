'use strict';

const mysql = require('mysql');

// Создание подключения к базе данных
const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root'
});

// Подключение к базе данных
connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных успешно установлено');

  // Функция миграции вверх
  function migrateUp(db) {
    console.log('Выполняется миграция вверх');
    return new Promise((resolve, reject) => {

      // Создание базы данных, если ее нет
      db.query("CREATE DATABASE IF NOT EXISTS checkngo", (error, results) => {
        if (error) {
          console.error('Ошибка при создании базы данных:', error);
          reject(error);
          return;
        }
        console.log('База данных успешно создана или уже существует');

        // Использование созданной базы данных
        db.query("USE checkngo", (error, results) => {
          if (error) {
            console.error('Ошибка при выборе базы данных:', error);
            reject(error);
            return;
          }
          console.log('База данных успешно выбрана');

          // Создание таблицы пользователей
          db.query(`
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL
            )
          `, (error, results) => {
            if (error) {
              console.error('Ошибка при создании таблицы пользователей:', error);
              reject(error);
              return;
            }
            console.log('Таблица пользователей успешно создана или уже существует');
            resolve();
          });
        });
      });
    });
  }

  // Функция миграции вниз
function migrateDown(db) {
  console.log('Выполняется миграция вниз');
  return new Promise((resolve, reject) => {
    // Использование базы данных
    db.query("USE checkngo", (error, results) => {
      if (error) {
        console.error('Ошибка при выборе базы данных:', error);
        reject(error);
        return;
      }

      // Удаление таблицы пользователей
      db.query("DROP TABLE IF EXISTS users", (error, results) => {
        if (error) {
          console.error('Ошибка при удалении таблицы пользователей:', error);
          reject(error);
          return;
        }
        console.log('Таблица пользователей успешно удалена');

        // Удаление базы данных
        db.query("DROP DATABASE IF EXISTS checkngo", (error, results) => {
          if (error) {
            console.error('Ошибка при удалении базы данных:', error);
            reject(error);
            return;
          }
          console.log('База данных успешно удалена');
          resolve();
        });
      });
    });
  });
}


  // Обработка аргументов командной строки
  const command = process.argv[2];
  if (command === 'up') {

    // Выполнение миграции вверх
    migrateUp(connection)
      .then(() => {
        console.log('Миграция вверх успешно выполнена');
        connection.end();
      })
      .catch((error) => {
        console.error('Ошибка при выполнении миграции вверх:', error);
        connection.end();
      });
  } else if (command === 'down') {
    
    // Выполнение миграции вниз
    migrateDown(connection)
      .then(() => {
        console.log('Миграция вниз успешно выполнена');
        connection.end();
      })
      .catch((error) => {
        console.error('Ошибка при выполнении миграции вниз:', error);
        connection.end();
      });
  } else {
    console.error('Неизвестная команда. Используйте "up" для миграции вверх или "down" для миграции вниз');
    connection.end();
  }
});
