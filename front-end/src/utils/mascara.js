export const telefone = numero => {
    if (!numero) return;
    numero = numero.replace(/[^0-9]/g, '');
    if (numero.length === 0) return '';
    if (numero.length > 11) numero = numero.substring(0, 11);
    let numeroMascara = '(';
    numeroMascara += numero.substring(0, Math.min(2, numero.length));
    if (numero.length <= 2) return numeroMascara;
    numeroMascara += ') ';
    const posicaoHifen = numero.length === 11 ? 7 : 6;
    numeroMascara += numero.substring(2, Math.min(posicaoHifen, numero.length));
    if (numero.length <= 6) return numeroMascara;
    numeroMascara += '-';
    numeroMascara += numero.substring(posicaoHifen, numero.length);
    return numeroMascara;
};
