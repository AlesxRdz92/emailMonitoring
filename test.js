var i = 1;
console.log(i);
var a = {
    b: 'hola',
    c: (() => {
        if (i === 1)
            return 'hola';
    })()
};

console.log(a.c);