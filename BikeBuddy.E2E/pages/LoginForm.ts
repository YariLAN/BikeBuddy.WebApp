import { Locator, Page } from "@playwright/test";

export class LoginForm {
    constructor(private readonly page: Page) {
        const form = page.locator('form');

        this.email = form.getByPlaceholder('Введите логин или email');
        this.password = form.locator('#password');
        
        this.loginButton = form.getByRole("button", {
            name: "Войти",
            exact: true
        });
    }

    
    readonly email: Locator
    readonly password: Locator 
    readonly loginButton: Locator;

    async login(email: string, password: string) {
        await this.email.fill(email);
        await this.email.press("Tab");

        await this.password.fill(password);

        await this.loginButton.click();
    }
}