'use strict';

// Функция для добавления нового пользователя в таблицу
async function addUserToTable(name, email, totalUsers) {
    const tableBody = document.querySelector('.form__table-body');
    const newRow = tableBody.insertRow();
    const share = (100 / totalUsers).toFixed(2);
    newRow.innerHTML = `<td class="form__table-d">${name}</td><td class="form__table-d">${email}</td><td class="form__table-d">${share}€</td>`;
}

// Функция для очистки таблицы и формы
function resetTableAndForm() {
    document.querySelector('.form__table-body').innerHTML = '';
    document.querySelector('#form__paymentForm').reset();
}

// Функция для обновления таблицы с пользователями
async function updateUserTable() {
    try {
        const response = await fetch('./api/User.php?action=get');
        if (!response.ok) {
            throw new Error('Произошла ошибка при получении пользователей.');
        }
        const users = await response.json();
        const totalUsers = users.length;
        resetTableAndForm();
        users.forEach(user => addUserToTable(user.name, user.email, totalUsers));
    } catch (error) {
        alert(error.message);
    }
}

// Обработчик события отправки формы
document.querySelector('#form__paymentForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    if (name === '' || email === '') {
        alert('Пожалуйста, заполните все поля формы.');
        return;
    }
    try {
        const response = await fetch('./api/User.php?action=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
        });
        if (!response.ok) {
            throw new Error('Произошла ошибка при сохранении пользователя.');
        }
        await updateUserTable();
    } catch (error) {
        alert(error.message);
    }
});

// Функция для сброса пользователей на странице
async function resetUsersOnPage() {
    try {
        const response = await fetch('./api/User.php?action=reset', {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Произошла ошибка при сбросе пользователей.');
        }
        resetTableAndForm();
    } catch (error) {
        alert(error.message);
    }
}

// Обработчик клика на кнопке "Сбросить"
document.querySelector('#resetButton').addEventListener('click', resetUsersOnPage);

// При загрузке страницы сразу загружаем список пользователей
updateUserTable();


