import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.TRANSLATE_API_KEY;
const locales = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'];

const baseTranslations = {
  "drink_tracker": "Drink Tracker",
  "quick_log": "Quick Log",
  "todays_log": "Today's Log",
  "no_drinks_logged": "No drinks logged today",
  "tap_above_to_log": "Tap a drink above to log",
  "logged": "logged",
  "standard_drink": "standard drink",
  "standard_drinks": "standard drinks",
  "std_drink": "std drink",
  "std_drinks": "std drinks",
  "today": "Today",
  "this_week": "This Week",
  "last_week": "Last Week",
  "drinks": "drinks",
  "last_7_days": "Last 7 days",
  "beer": "Beer",
  "wine": "Wine",
  "spirit": "Spirit",
  "cocktail": "Cocktail",
  "page_not_found": "Oops! Page not found",
  "return_to_home": "Return to Home"
};

async function run() {
  const keys = Object.keys(baseTranslations);
  const values = Object.values(baseTranslations);

  for (const lang of locales) {
    console.log(`Translating to ${lang}...`);
    const translatedJson: Record<string, string> = {};
    if (lang === 'en') {
      keys.forEach((key, i) => {
        translatedJson[key] = values[i];
      });
    } else {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            q: values,
            target: lang,
            format: 'text'
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json() as any;
        if (data.error) {
           console.error(`Error in translation response for ${lang}:`, JSON.stringify(data.error));
           keys.forEach((key, i) => { translatedJson[key] = values[i]; });
        } else {
          keys.forEach((key, i) => {
            translatedJson[key] = data.data.translations[i].translatedText;
          });
        }
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
        keys.forEach((key, i) => { translatedJson[key] = values[i]; });
      }
    }

    const dir = path.join(__dirname, '../src/i18n/locales', lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'translation.json'), JSON.stringify(translatedJson, null, 2));
  }
  console.log('All translations generated!');
}

// run().catch(console.error);
console.log('Script is disabled after generation.');
