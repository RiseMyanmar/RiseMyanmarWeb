export async function translateText(text, targetLang = "my") {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: targetLang,
          format: "text"
        })
      }
    );
  
    const data = await res.json();
    return data.data.translations[0].translatedText;
  }

