// Конфигурация Watchlist WebApp
window.WatchlistConfig = {
    // URL для webapp (будет заменен на GitHub Pages URL)
    webappUrl: 'https://oleggoryunov.github.io/watchlistwebdocs',
    
    // Настройки уведомлений
    notifications: {
        duration: 3000, // 3 секунды
        types: ['success', 'error', 'info', 'warning']
    },
    
    // Валидация названий фильмов
    validation: {
        minLength: 2,
        maxLength: 100,
        allowedChars: /^[а-яёa-z0-9\s\-_.,!?()]+$/i
    },
    
    // Настройки UI
    ui: {
        theme: 'auto', // auto, light, dark
        language: 'ru',
        animations: true
    },
    
    // Настройки Telegram Web App
    telegram: {
        expandOnLoad: true,
        showMainButton: false,
        enableClosingConfirmation: false
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