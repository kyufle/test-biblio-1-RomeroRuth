// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js");
const { By, until, Builder, Capabilities } = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

// .env
require('dotenv').config();

const categoria_pare = process.env.categoria_pare;
const categoria1 = process.env.categoria1;
const categoria2 = process.env.categoria2;
const categoria3 = process.env.categoria3;
const categoria4 = process.env.categoria4;
const categoria5 = process.env.categoria5;
const categoria6 = process.env.categoria6;
const categoria7 = process.env.categoria7;
const categoria8 = process.env.categoria8;

// Comprovem que les categories estiguin definides
if (!categoria_pare || !categoria1 || !categoria2 || !categoria3 || !categoria4 || !categoria5 || !categoria6 || !categoria7 || !categoria8) {
    console.log("Una o més categories no estan definides correctament.");
    process.exit(1);
}

// Configuració de la classe BaseTest
class MyTest extends BaseTest {
    async test() {
        // Login test
        //////////////////////////////////////////////////////
        var site = process.env.URL;
        await driver.get(site + "/admin/login/");
    
        // 1 cercar login box
        let usernameInput = await driver.wait(until.elementLocated(By.id('id_username')), 10000);
        let passwordInput = await driver.wait(until.elementLocated(By.id('id_password')), 10000);
    
        // 2 posar usuari i pass
        usernameInput.sendKeys(process.env.USUARI);
        passwordInput.sendKeys(process.env.CONTRASENYA);
    
        // 3 boto send .click()
        let sendButton = await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Esperem que la pàgina es carregui després del login
        await driver.wait(until.urlContains('/admin'), 10000);

        // 4 Afegeix categoria  
        try {
            await driver.wait(until.elementLocated(By.xpath("//a[@href='/admin/biblio/categoria/add/']")), 20000)
                .then(async (element) => {
                    await element.click();
                });
        } catch (err) {
            console.log("Element per afegir categoria no trobat:", err);
        }

        // Afegir categoria pare
        await this.afegirCategoria(categoria_pare, null);

        // Afegir categories fills
        await this.afegirCategoria(categoria1, categoria_pare);
        await this.afegirCategoria(categoria2, categoria_pare);
        await this.afegirCategoria(categoria3, categoria_pare);
        await this.afegirCategoria(categoria4, categoria_pare);
        await this.afegirCategoria(categoria5, categoria_pare);
        await this.afegirCategoria(categoria6, categoria_pare);
        await this.afegirCategoria(categoria7, categoria_pare);
        await this.afegirCategoria(categoria8, categoria_pare);

        // 6 Cerrar sessió
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        console.log("TEST OK");
    }

    async afegirCategoria(categoria, categoriaPare) {
        // Comprovem si la categoria està definida
        if (!categoria) {
            console.log("Categoria no definida:", categoria);
            return;
        }

        console.log("Afegint categoria: ", categoria);

        // Esperar fins que es carregui el formulari per afegir una categoria
        try {
            await driver.wait(until.elementLocated(By.xpath("//a[@href='/admin/biblio/categoria/add/']")), 20000)
                .then(async (element) => {
                    await element.click();
                });
        } catch (err) {
            console.log("No s'ha pogut trobar l'element per afegir categoria:", err);
            return;
        }

        // Afegir la categoria
        await driver.findElement(By.name("nom")).sendKeys(categoria);

        // Assegurem-nos que categoria_pare està definida i existeix
        if (categoriaPare && categoriaPare !== "undefined") {
            console.log("Seleccionant categoria pare:", categoriaPare);
            await driver.findElement(By.xpath("//select[@name='parent']/option[text()='" + categoriaPare + "']")).click();
        }

        await driver.findElement(By.xpath("//input[@value='Desar']")).click();
    }
}

// executem el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
