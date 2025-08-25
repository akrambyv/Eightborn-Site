import fs from "fs";
import path from "path";
import translate from "google-translate-api-x";

const __dirname = process.cwd();

const sourceLang = "tr";
const targetLangs = ["en", "az", "ru"];

const sourceFile = path.join(__dirname, `src/locales/${sourceLang}/translation.json`);

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Mənbə faylı tapılmadı: ${sourceFile}`);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function autoTranslate() {
  console.log("🚀 Tərcümə prosesi başladı...\n");
  
  for (let lang of targetLangs) {
    console.log(`📝 ${lang.toUpperCase()} dilinə tərcümə edilir...`);
    
    const translatedData = {};
    const keys = Object.keys(sourceData);
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const text = sourceData[key];
      
      try {
        if (i > 0) await delay(100);
        
        const res = await translate(text, { 
          from: sourceLang, 
          to: lang,
          requestOptions: {
            timeout: 5000
          }
        });
        
        translatedData[key] = res.text;
        console.log(`✔ [${lang}] "${key}": "${text}" → "${res.text}"`);
        
      } catch (err) {
        console.error(`❌ Tərcümə xətası [${lang}] "${key}":`, err.message);
        translatedData[key] = text; 
      }
    }

    const targetDir = path.join(__dirname, `src/locales/${lang}`);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const targetFile = path.join(targetDir, "translation.json");
    
    fs.writeFileSync(
      targetFile,
      JSON.stringify(translatedData, null, 2),
      "utf8"
    );

    console.log(`✅ ${lang.toUpperCase()} dili üçün tərcümə faylı yaradıldı: ${targetFile}\n`);
  }
  
  console.log("🎉 Bütün tərcümələr tamamlandı!");
}

autoTranslate().catch(err => {
  console.error("❌ Tərcümə prosesində xəta:", err);
  process.exit(1);
});