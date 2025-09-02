import { UserDTO } from "../models/user";

export function isBlank(value: string): boolean{
    const emptyFieldRegex: RegExp = /^\s*$/;

    return emptyFieldRegex.test(value)
}

export function isNullOrBlank(user: UserDTO): string{
    let response: string = ""

    Object.entries(user).slice(0).forEach(([field, value]) => {
        if(value == null || isBlank(value))
            response += `${field} está vazio\n`
        }
    )

    return response
}

export function validateEmail(email: string): string{
    const parts: string[] = email.split("@")
    let response: string = ""

    if (parts.length !== 2) {
        response += "O email deve conter exatamente um '@'.\n"
        return response
    }

    const user: string = parts[0]
    const domain: string = parts[1];

    const regexUser: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
    if (!regexUser.test(user)) {
        response += "A parte do usuário (parte antes de '@') contém caracteres inválidos ou está mal formatada.\n";
    }

    const regexDomain: RegExp = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
    if (!regexDomain.test(domain)) {
        response += "O domínio do email (parte pós '@') é inválido ou mal formatado.\n";
    }

    return response || "Email válido!";
}

export function validatePassword(password: string): string{
    let response: string = ""
    
    if (!/[a-z]/.test(password)) {
        response += "A password deve conter pelo menos uma letra minúscula.\n"
    }
    
    if (!/[A-Z]/.test(password)) {
        response += "A password deve conter pelo menos uma letra maiúscula.\n"
    }

    if (!/[0-9]/.test(password)) {
        response += "A password deve conter pelo menos um número.\n"
    }
    
    if (!/[\W_]/.test(password)) {
        response += "A password deve conter pelo menos um caractere especial.\n"
    }
    
    if (password.length <= 12) {
        response += "A password deve ter no mínimo 12 caracteres.\n"
    }

    console.log(response)
    
    return response || "password válida!"
}
