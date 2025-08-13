// Telegram Web App инициализация
let tg = null;
let user = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем доступность Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        
        // Инициализируем Telegram Web App
        try {
            tg.ready();
            tg.expand();
            
            // Добавляем обработчики событий
            tg.onEvent('mainButtonClicked', () => {
                showDebugInfo('📱 MainButton нажат', 'info');
            });
            
            tg.onEvent('backButtonClicked', () => {
                showDebugInfo('📱 BackButton нажат', 'info');
            });
            
            tg.onEvent('themeChanged', () => {
                showDebugInfo('🎨 Тема изменена', 'info');
                applyTelegramTheme();
            });
            
            showDebugInfo('✅ Telegram Web App инициализирован', 'success');
        } catch (error) {
            showDebugInfo(`❌ Ошибка инициализации: ${error.message}`, 'error');
        }
        
        // Получаем данные пользователя
        user = tg.initDataUnsafe?.user;
        
        // Загружаем список фильмов
        loadMovies();
        
        // Настраиваем обработчики событий
        setupEventListeners();
        
        // Применяем тему Telegram
        applyTelegramTheme();
        
    } else {
        showDebugInfo('❌ Telegram Web App недоступен', 'error');
        // Показываем сообщение об ошибке
        document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>❌ Ошибка</h2><p>Telegram Web App недоступен. Откройте этот файл через Telegram бота.</p></div>';
    }
});

// Применение темы Telegram
function applyTelegramTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f8f9fa');
}

// Настройка обработчиков событий
function setupEventListeners() {
    const addBtn = document.getElementById('addBtn');
    const movieInput = document.getElementById('movieInput');
    
    // Добавление фильма по кнопке
    addBtn.addEventListener('click', function() {
        addMovie();
    });
    
    // Добавление фильма по Enter
    movieInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMovie();
        }
    });
    
    // Автофокус на поле ввода
    movieInput.focus();
}

// Загрузка списка фильмов
async function loadMovies() {
    try {
        console.log('📋 Начинаем загрузку списка фильмов...');
        showLoading();
        
        console.log('📤 Отправляем команду get_movies боту...');
        
        // Отправляем команду боту для получения списка фильмов
        await sendBotCommand('get_movies');
        
        console.log('✅ Команда get_movies успешно отправлена боту');
        
        // Бот ответит через Telegram Web App API
        // Список будет обновлен автоматически
        showNotification('Запрос списка фильмов отправлен боту', 'info');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки фильмов:', error);
        showError('Не удалось загрузить список фильмов');
    }
}

// Отображение списка фильмов
function displayMovies(movies) {
    const container = document.getElementById('moviesContainer');
    
    if (!movies || movies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📝 Список пуст</h3>
                <p>У вас пока нет фильмов в списке для просмотра</p>
                <p>Добавьте первый фильм выше или отправьте скриншот боту!</p>
            </div>
        `;
        return;
    }
    
    const moviesList = document.createElement('div');
    moviesList.className = 'movies-list';
    
    movies.forEach((movie, index) => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-title">${escapeHtml(movie)}</div>
            <div class="movie-actions">
                <button class="btn btn-small btn-danger" onclick="removeMovie('${escapeHtml(movie)}', ${index})">
                    🗑️ Удалить
                </button>
            </div>
        `;
        moviesList.appendChild(movieItem);
    });
    
    container.innerHTML = '';
    container.appendChild(moviesList);
}

// Добавление нового фильма
async function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieTitle = movieInput.value.trim();
    
    showDebugInfo(`🎬 Попытка добавить фильм: ${movieTitle}`, 'info');
    console.log('🎬 Попытка добавить фильм:', movieTitle);
    
    if (!movieTitle) {
        showNotification('Введите название фильма', 'error');
        return;
    }
    
    if (movieTitle.length < 2) {
        showNotification('Название фильма должно содержать минимум 2 символа', 'error');
        return;
    }
    
    try {
        showDebugInfo('📤 Отправляем команду add_movie боту...', 'info');
        console.log('📤 Отправляем команду add_movie боту...');
        
        // Отправляем команду боту для добавления фильма
        await sendBotCommand('add_movie', { movie: movieTitle });
        
        showDebugInfo('✅ Команда успешно отправлена боту', 'success');
        console.log('✅ Команда успешно отправлена боту');
        showNotification('Команда добавления фильма отправлена боту!', 'success');
        movieInput.value = '';
        movieInput.focus();
        
        // Бот обновит список автоматически
        
    } catch (error) {
        showDebugInfo(`❌ Ошибка добавления фильма: ${error.message}`, 'error');
        console.error('❌ Ошибка добавления фильма:', error);
        showNotification('Не удалось добавить фильм', 'error');
    }
}

// Удаление фильма
async function removeMovie(movieTitle, index) {
    if (!confirm(`Удалить фильм "${movieTitle}" из списка?`)) {
        return;
    }
    
    try {
        // Отправляем команду боту для удаления фильма
        await sendBotCommand('remove_movie', { movie: movieTitle });
        
        showNotification('Команда удаления фильма отправлена боту!', 'success');
        
        // Бот обновит список автоматически
        
    } catch (error) {
        console.error('Ошибка удаления фильма:', error);
        showNotification('Не удалось удалить фильм', 'error');
    }
}

// Отправка команды боту через Telegram Web App
async function sendBotCommand(command, data = {}) {
    try {
        showDebugInfo('🚀 Начинаем отправку команды боту...', 'info');
        console.log('🚀 Начинаем отправку команды боту...');
        
        // Проверяем, что мы в Telegram Web App
        if (!tg) {
            const error = '❌ Telegram Web App не инициализирован';
            showDebugInfo(error, 'error');
            console.error(error);
            throw new Error('Telegram Web App не инициализирован');
        }
        
        showDebugInfo('✅ Telegram Web App доступен', 'success');
        console.log('✅ Telegram Web App доступен');
        console.log('📱 tg объект:', tg);
        
        // Проверяем доступные методы
        const availableMethods = [];
        if (tg.sendData) availableMethods.push('sendData');
        if (tg.postEvent) availableMethods.push('postEvent');
        if (tg.MainButton) availableMethods.push('MainButton');
        if (tg.BackButton) availableMethods.push('BackButton');
        
        showDebugInfo(`🔧 Доступные методы: ${availableMethods.join(', ')}`, 'info');
        console.log('🔧 Доступные методы:', availableMethods);
        
        // Формируем данные команды
        const commandData = {
            command: command,
            data: data,
            timestamp: Date.now()
        };
        
        showDebugInfo(`📤 Отправляем команду: ${command}`, 'info');
        console.log('📤 Отправляем команду боту:', commandData);
        console.log('📤 JSON данные:', JSON.stringify(commandData));
        
        // Отправляем данные через Telegram Web App
        let result;
        
        // Используем только рабочий метод sendData
        if (!tg || !tg.sendData) {
            throw new Error('sendData недоступен');
        }
        
        result = tg.sendData(JSON.stringify(commandData));
        showDebugInfo(`📤 Результат sendData: ${result}`, 'info');
        console.log('📤 Результат sendData:', result);
        
        // Отправляем команду боту и ждем ответа
        return { success: true, message: 'Команда отправлена боту' };
        
    } catch (error) {
        const errorMsg = `❌ Ошибка отправки команды боту: ${error.message}`;
        showDebugInfo(errorMsg, 'error');
        console.error('❌ Ошибка отправки команды боту:', error);
        throw error;
    }
}



// Показ загрузки
function showLoading() {
    const container = document.getElementById('moviesContainer');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Загружаем ваш список фильмов...</p>
        </div>
    `;
}

// Показ ошибки
function showError(message) {
    const container = document.getElementById('moviesContainer');
    container.innerHTML = `
        <div class="empty-state">
            <h3>❌ Ошибка</h3>
            <p>${escapeHtml(message)}</p>
            <button class="btn btn-secondary" onclick="loadMovies()">Повторить</button>
        </div>
    `;
}

// Показ уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Обработка сообщений от бота (если бот поддерживает)
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'bot_response') {
        handleBotResponse(event.data);
    }
});

// Обработка ответа от бота
function handleBotResponse(data) {
    switch (data.command) {
        case 'movies_updated':
            loadMovies();
            break;
            
        case 'notification':
            showNotification(data.message, data.type || 'info');
            break;
            
        default:
            console.log('Неизвестный тип сообщения от бота:', data);
    }
}

// Экспорт функций для отладки
window.WatchlistApp = {
    loadMovies,
    addMovie,
    removeMovie,
    showNotification
}; 

// Показ отладочной информации
function showDebugInfo(message, type = 'info') {
    console.log(`🐛 DEBUG: ${message}`);
    
    // Показываем видимое уведомление
    const debugContainer = document.getElementById('debugContainer') || createDebugContainer();
    
    const debugItem = document.createElement('div');
    debugItem.className = `debug-item ${type}`;
    debugItem.innerHTML = `
        <span class="debug-time">${new Date().toLocaleTimeString()}</span>
        <span class="debug-message">${message}</span>
    `;
    
    debugContainer.appendChild(debugItem);
    
    // Автоматически удаляем через 10 секунд
    setTimeout(() => {
        if (debugItem.parentNode) {
            debugItem.parentNode.removeChild(debugItem);
        }
    }, 10000);
}

// Создание контейнера для отладочной информации
function createDebugContainer() {
    const container = document.createElement('div');
    container.id = 'debugContainer';
    container.className = 'debug-container';
    container.innerHTML = '<h4>🐛 Отладочная информация:</h4>';
    
    // Вставляем после основного контента
    const mainContent = document.querySelector('.main-content') || document.body;
    mainContent.appendChild(container);
    
    return container;
} 