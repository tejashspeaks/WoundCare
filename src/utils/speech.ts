// Web Speech API helper for multilingual audio playback (English, Hindi, Tamil)

export function speakText(text: string, lang: 'en' | 'hi' | 'ta'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment');
      return resolve();
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set locale code
    switch (lang) {
      case 'hi':
        utterance.lang = 'hi-IN';
        break;
      case 'ta':
        utterance.lang = 'ta-IN';
        break;
      case 'en':
      default:
        utterance.lang = 'en-IN';
        break;
    }

    utterance.rate = 0.9; // Slightly slower for clear rural comprehension
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
