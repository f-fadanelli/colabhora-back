export const arraysNumericosIguais = (arr1: number[], arr2: number[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((valor, indice) => valor === arr2[indice]);
}

export const decimalParaHorasEMinutos = (decimal: number): string => {
    const horas: number = Math.floor(decimal);
    const minutos: number = Math.round((decimal - horas) * 60);

    let resultado = `${horas}h`;
    if (minutos !== 0) {
        resultado += ` ${minutos}min`;
    }

    return resultado;
};