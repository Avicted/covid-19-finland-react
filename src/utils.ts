export const getColor = (index: number | undefined): string => {
    const colors: string[] = [
        '#EF5350',
        '#EC407A',
        '#AB47BC',
        '#7E57C2',
        '#5C6BC0',
        '#42A5F5',
        '#29B6F6',
        '#26C6DA',
        '#26A69A',
        '#66BB6A',
        '#9CCC65',
        '#D4E157',
        '#FFEE58',
        '#FFCA28',
        '#FFA726',
        '#FF7043',
        '#8D6E63',
        '#BDBDBD',
        '#B71C1C',
        '#880E4F',
        '#4A148C',
        '#311B92',
        '#1A237E',
        '#0D47A1',
        '#C62828',
        '#AD1457',
        '#6A1B9A',
        '#4527A0',
        '#283593',
        '#1565C0',
    ];

    if (index === undefined) {
        return '';
    }

    return colors[index];
}
