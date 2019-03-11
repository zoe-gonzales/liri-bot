
// getting api keys
var keys = require("./keys");
var fs = require('fs');
require('colors');

// Code for handling watson language translator data
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var languageTranslator = new LanguageTranslatorV3(keys.translator);

function Translator(){
    // Array holds the languages supported for translation to and from English
    this.supportedLanguages = ['Arabic', 'Czech', 'Danish', 'Dutch', 'Finnish', 'French', 'German', 'Hindi', 'Italian', 'Japanese', 'Korean', 'Norwegian Bokmal', 'Polish', 'Portuguese', 'Russian', 'Simplified Chinese', 'Spanish', 'Swedish', 'Traditional Chinese', 'Turkish'];
    // Supported language codes (ordered in respect to supportedLanguages)
    this.supportedLanguageCodes = ['ar', 'cs', 'da', 'nl', 'fi', 'fr', 'de', 'hi', 'it', 'ja', 'ko', 'nb', 'pl', 'pt', 'ru', 'zh', 'es', 'sv', 'zh-TW', 'tr'];
    // Determines the code of a language based on the user's selection
    this.findLangCode = function(language){
        // loops through array until the selected language is found
        for (var i=0; i < this.supportedLanguages.length; i++) {
            if (this.supportedLanguages[i] === language) {
                // assigns exact index to supportedLanguageCodes since both arrays are in the same order
                var langFromCode = this.supportedLanguageCodes[i];
            }
        }
        return langFromCode;
    };
    // Handles the translation functionality - calls to API and displays response in CL
    this.translate = function(string, one, two) {
        // Parameters to be passed through translate functionality below
        // supported translation models here: https://console.bluemix.net/docs/services/language-translator/translation-models.html#translation-models
        var parameters = {
            text: string,
            model_id: `${one}-${two}`
            };
    
        // call to WLT applying the parameters gained from user input
        languageTranslator.translate(
            parameters,
            function(error, response) {
                if (error) {
                console.log(error);
                } else {
                    // loops through response array in case there is more than one translation
                    response.translations.forEach(text => {
                    console.log(text.translation.cyan);
                    // Saving translation to log.txt
                        fs.appendFile('text/log.txt', ',' + text.translation, function(err){
                            if (err) console.log(err);
                        });
                    });
                } 
            }
        );
    }
}

module.exports = Translator;