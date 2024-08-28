// add two numbers
function add(a, b) {
    return a + b;
}

// function that translates common english into slang english
function slangify(word) {
    if (word === 'hello') {
        return 'yo';
    } else if (word === 'goodbye') {
        return 'peace';
    } else {
        return 'I dunno what you said';
    }
}