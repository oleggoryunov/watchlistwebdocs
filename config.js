// Конфигурация Watchlist WebApp
window.WatchlistConfig = {
    // URL для webapp (будет заменен на GitHub Pages URL)
    webappUrl: 'https://GITHUB_USERNAME.github.io/GITHUB_REPO_NAME-webapp',
    
    // Настройки уведомлений
    notifications: {
        duration: 3000, // Длительность показа уведомлений в мс
        position: 'top-right' // Позиция уведомлений
    },
    
    // Настройки валидации
    validation: {
        minMovieLength: 2, // Минимальная длина названия фильма
        maxMovieLength: 100 // Максимальная длина названия фильма
    },
    
    // Настройки интерфейса
    ui: {
        autoFocus: true, // Автофокус на поле ввода
        confirmDelete: true, // Подтверждение удаления
        showLoading: true // Показ индикатора загрузки
    },
    
    // Настройки Telegram Web App
    telegram: {
        expandOnReady: true, // Развернуть webapp при готовности
        enableClosingConfirmation: false, // Подтверждение закрытия
        disableNotification: false // Отключить уведомления
    },
    
    // Режим работы: local (локальный) или remote (удаленный)
    mode: 'local',
    
    // Информация о том, что все данные идут через бота
    info: {
        description: 'Webapp работает локально, все данные передаются через Telegram бота',
        noExternalServers: true
    }
};

// Функция для получения конфигурации
function getConfig(key) {
    return window.WatchlistConfig[key];
}

// Функция для установки конфигурации
function setConfig(key, value) {
    window.WatchlistConfig[key] = value;
}

// Экспорт для использования в других модулях
window.getConfig = getConfig;
window.setConfig = setConfig; 