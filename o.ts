function calculate(s: string): number {
    const operators = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '(': '(',
        ')': ')',
        ' ': ' '
    } as const;

    type Operator = Exclude<keyof typeof operators, '(' | ')' | ' '>;

    let operand1: number = 0;
    let operand2: number = 0;
    let prevOperator: Operator | null = null;

    for (let i = 0; i < s.length; i++) {
        if (s[i] === operators[' ']) continue;
        else if (s[i] === operators['(']) {
            let level = 0;
            for (let j = i + 1; j < s.length; j++) {
                if (s[j] === operators['(']) level++;
                else if (s[j] === operators[')']) {
                    console.log('level is', level)
                    if (level === 0) {
                        console.log('recursing')
                        let operand = calculate(s.substring(i + 1, j));
                        if (prevOperator) {
                            operand2 = operand2 ? Number(String(operand2).concat(operand.toString())) : operand;
                            operand1 = performOperation(prevOperator);

                            // reset variables;
                            prevOperator = null;
                            operand2 = 0;
                        } else {
                            operand1 = operand1 ? Number(String(operand1).concat(operand.toString())) : operand;
                        }
                        i = j;
                        break;
                    } else level--
                }
            }
        } else if (isNaN(Number(s[i]))) {
            prevOperator = s[i] as Operator;
        } else {
            let operand = Number(s[i]);
            if (prevOperator) {
                operand2 = operand2 ? Number(String(operand2).concat(operand.toString())) : operand;
                operand1 = performOperation(prevOperator);

                // reset variables;
                prevOperator = null;
                operand2 = 0;
            } else {
                operand1 = operand1 ? Number(String(operand1).concat(operand.toString())) : operand;
            }
        }
    }

    function performOperation(operator: Operator) {

        console.log(operand1, operand2, operator)
        switch (operator) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '/':
                return operand1 / operand2;
            case '*':
                return operand1 * operand2;
        }
    }

    return operand1;
};


// console.log(calculate("1-11"))

function ArrayChallenge(arr: string[]): number {
    const str1 = arr[0];
    const str2 = arr[1];
    let count = 0;

    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            count++
        }
    }

    return count;
}

console.log(ArrayChallenge(['10011', '10100']))