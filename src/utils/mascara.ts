export function cpfMask(input: React.InputEvent<HTMLInputElement>): void {
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

export function cepMask(value: string): string {
    value = value.replace(/\D/g, '').slice(0, 8);
    
    return value.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function cellphoneMask(input: React.InputEvent<HTMLInputElement>): void {
    let value: string = input.currentTarget.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    input.currentTarget.value = value
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}

export function crefMask(input: React.InputEvent<HTMLInputElement>): void {
  const v = input.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  input.currentTarget.value = v
    .replace(/^(\d{6})(\w)/, "$1-$2")      
    .replace(/-(\w{1})(\w)/, "-$1/$2")   
    .substring(0, 11);                 
};

