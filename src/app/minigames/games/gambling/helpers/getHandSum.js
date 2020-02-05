module.exports = function(array) {
    let sum = 0;
    let hasAce = 0;
    let cardFace;

    for (i in array) {
        cardFace = array[i].face;

        if (cardFace == 0) hasAce++;
        else if (cardFace > 0 && cardFace < 10) sum += cardFace + 1;
        else if (cardFace >= 10) sum += 10;
    }
    
    while (hasAce > 0) {
        if (sum <= 10 && hasAce == 1) sum += 11;
        else sum++;
        hasAce--;
    }

    return sum;
}