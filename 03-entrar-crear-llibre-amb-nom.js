    // carreguem les llibreries
    const { BaseTest } = require("./BaseTest.js")
    const { By, until } = require("selenium-webdriver");
    const assert = require('assert');
     
    //.env
    require('dotenv').config()
    console.log(process.env)
    const book_title = process.env.book_title;

     
    class MyTest extends BaseTest
    {
        async test() {
            // Login test
            //////////////////////////////////////////////////////
            var site = process.env.URL
            var driver = this.driver
            await driver.get(site+"/admin/login/");
     
            // 1 cercar login box
            let usernameInput = await driver.wait(until.elementLocated(
                    By.id('id_username')), 10000);
            let passwordInput = await driver.wait(until.elementLocated(
                    By.id('id_password')), 10000);
     
            // 2 posar usuari i pass
            usernameInput.sendKeys(process.env.USUARI)
            passwordInput.sendKeys(process.env.CONTRASENYA)
     
            // 3 boto send .click()
            let sendButton = await driver.wait(until.elementLocated(
                    By.css('input[value="Iniciar sessió"]')), 10000);
            sendButton.click()

        // 5. Esperem que aparegui l'enllaç per afegir un llibre
        await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/admin/biblio/llibre/add/']")), 5000);
        await this.driver.findElement(By.xpath("//a[@href='/admin/biblio/llibre/add/']")).click();

        // 6. Afegim el títol del llibre
        await this.driver.findElement(By.xpath("//input[@name='titol']")).sendKeys(book_title);

        // 7. Desem el llibre
        await this.driver.findElement(By.xpath("//input[@value='Desar']")).click();

        // 8. Esperem un moment i tanquem la sessió
        await this.driver.sleep(1000);
        await this.driver.findElement(By.xpath("//button[@type='submit']")).click();

        console.log("TEST OK");
    }
}

// Executem el test
(async function test_example() {
    const test = new MyTest();
    await test.run(); // Executem el test
    console.log("END");
})();
