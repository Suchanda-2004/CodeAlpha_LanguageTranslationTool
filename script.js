document.addEventListener('DOMContentLoaded', () => {
    const sourceTextarea = document.getElementById('sourceText');
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const translateButton = document.getElementById('translateButton');
    const translatedTextarea = document.getElementById('translatedText');
    const copyButton = document.getElementById('copyButton');
    const textToSpeechButton = document.getElementById('textToSpeechButton');
    // Select the checkbox input for the toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // --- Dark Mode Logic ---
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true; // Ensure the toggle is checked if dark mode is active
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => { // Use 'change' event for checkboxes
        console.log('Dark mode toggle clicked!'); // Debug log
        body.classList.toggle('dark-mode');
        // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    // --- End Dark Mode Logic ---


    // Populate language dropdowns (example, you might fetch a more complete list)
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' },
        { code: 'ar', name: 'Arabic' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'it', name: 'Italian' }, // Added more
        { code: 'nl', name: 'Dutch' },
        // Add more languages as needed based on your chosen API's supported list
    ];

    function populateLanguages(selectElement) {
        // Clear existing options first (important if called multiple times)
        selectElement.innerHTML = '';
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            selectElement.appendChild(option);
        });
    }

    populateLanguages(sourceLanguageSelect);
    populateLanguages(targetLanguageSelect);

    // Set default selections
    sourceLanguageSelect.value = 'en'; // Default source to English
    targetLanguageSelect.value = 'es'; // Default target to Spanish

    // Translate button event listener
    translateButton.addEventListener('click', async () => {
        const textToTranslate = sourceTextarea.value.trim();
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;

        if (!textToTranslate) {
            alert('Please enter text to translate.');
            return;
        }

        translatedTextarea.value = 'Translating...';

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textToTranslate,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                }),
            });

            const data = await response.json();

            if (response.ok) {
                translatedTextarea.value = data.translatedText;
            } else {
                console.error('Translation error from server:', data.error);
                translatedTextarea.value = `Error: ${data.error ? (data.error.message || data.error) : 'Translation failed'}`;
            }
        } catch (error) {
            console.error('Network or server error:', error);
            translatedTextarea.value = 'Error: Could not connect to translation service. Check your server and network.';
        }
    });

    // Copy button event listener
    copyButton.addEventListener('click', () => {
        translatedTextarea.select();
        translatedTextarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 1500);
    });

    // Text-to-speech button event listener (Web Speech API)
    textToSpeechButton.addEventListener('click', () => {
        const textToSpeak = translatedTextarea.value;
        if (!textToSpeak) {
            alert('No text to speak.');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = targetLanguageSelect.value;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in this browser.');
        }
    });
});
