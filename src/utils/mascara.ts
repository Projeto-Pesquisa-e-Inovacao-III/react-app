export function cpfMask(input: React.FormEvent<HTMLInputElement>): void{
    // \D - Apenas números
    // /g - string toda
    let value: string = input.currentTarget.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    input.currentTarget.value = value
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function cepMask(input: React.FormEvent<HTMLInputElement>): void{
    let value: string = input.currentTarget.value.replace(/\D/g, '');

    if (value.length > 8) {
        value = value.slice(0, 8);
    }

    input.currentTarget.value = value
        .replace(/^(\d{5})(\d)/, '$1-$2')
}

export function cellphoneMask(input: React.FormEvent<HTMLInputElement>): void{
    let value: string = input.currentTarget.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // \s - espaço em branco
    input.currentTarget.value = value
        .replace(/^(\d{2})/, '($1) ')
        .replace(/^(\(\d{2}\)\s)(\d{5})/, '$1$2-')
}

