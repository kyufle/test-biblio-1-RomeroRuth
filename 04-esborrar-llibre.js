const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// .env
require('dotenv').config();

const book_title = process.env.book_title;

class MyTest extends BaseTest {
    async test() {
        // Login test
        //////////////////////////////////////////////////////
        var site = process.env.URL;
        var driver = this.driver;
        await driver.get(site + "/admin/login/");

        // 1 cercar login box
        let usernameInput = await driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        let passwordInput = await driver.wait(until.elementLocated(
            By.id('id_password')), 10000);

        // 2 posar usuari i pass
        usernameInput.sendKeys(process.env.USUARI);
        passwordInput.sendKeys(process.env.CONTRASENYA);

        // 3 boto send .click()
        let sendButton = await driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Esperar que aparegui el link "Llibres"
        let llibresLink = await driver.wait(until.elementLocated(By.xpath("//a[text()='Llibres']")), 10000);
        await llibresLink.click();

        // Espera fins que aparegui el llibre que volem esborrar
        let bookLink = await driver.wait(until.elementLocated(By.xpath("//a[text()='" + book_title + "']")), 10000);
        await bookLink.click();

        // 5 Esborra llibre
        let deleteButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'deletelink')]")), 10000);
        await deleteButton.click();

        await driver.wait(until.elementLocated(By.xpath("//input[@type='submit']")), 10000);
        await driver.findElement(By.xpath("//input[@type='submit']")).click();

        // Esperar que es completi l'eliminació abans de tancar la sessió
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        console.log("TEST OK");
    }
}

// executem el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
