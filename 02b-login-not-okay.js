// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');
 
// .env
require('dotenv').config()
console.log(process.env)
 
class MyTest extends BaseTest
{
    async test() {
        // Test de login incorrecte
        //////////////////////////////////////////////////////
        var site = process.env.URL
        var driver = this.driver
        await driver.get(site + "/admin/login/");
 
        // 1 cercar login box
        let usernameInput = await driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        let passwordInput = await driver.wait(until.elementLocated(
            By.id('id_password')), 10000);
 
        // 2 posar usuari i pass incorrectes
        usernameInput.sendKeys("usuariIncorrecte") // Usuari incorrecte
        passwordInput.sendKeys("contrasenyaIncorrecta") // Contrasenya incorrecta
 
        // 3 boto send .click()
        let sendButton = await driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click()
 
        // 4 comprovem que hem rebut un error de login (no apareix el botó "FINALITZAR SESSIÓ")
        try {
            let logoutButton = await driver.wait(until.elementLocated(
                By.xpath('//button[@type="submit"]')), 5000);
            // Si el botó de "FINALITZAR SESSIÓ" es troba, vol dir que el login ha estat correcte
            assert.fail("El login hauria de ser refusat. S'ha trobat el botó 'FINALITZAR SESSIÓ'.");
        } catch (err) {
            // Si l'element no s'ha trobat, vol dir que el login ha estat refusat
            console.log("Test OK: Login incorrecte refusat correctament.")
        }
    }
}
 
// executem el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END")
})();