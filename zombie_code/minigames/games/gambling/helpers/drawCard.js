function getNewCard(cardMap) {
    let cv = Math.floor(Math.random() * 52);
    if (cardMap.has(cv)) return getNewCard(cardMap);
    return cv;
}

module.exports = function (cardMap) {
    let cardVal = getNewCard(cardMap);
    let cardFace = Math.floor(cardVal % 13);
    let cardSuit = Math.floor(cardVal / 13);

    let cardText = '';
    switch (cardSuit) {
        case 0: cardText += ':spades: - '; break
        case 1: cardText += ':hearts: - '; break;
        case 2: cardText += ':clubs: - '; break;
        case 3: cardText += ':diamonds: - '; break;
    }
    if (cardFace == 0)
        cardText += 'Ace';
    else if (cardFace >= 10) {
        if (cardFace == 10) cardText += 'Jack';
        if (cardFace == 11) cardText += 'Queen';
        if (cardFace == 12) cardText += 'King'
    }
    else cardText += `${cardFace + 1}`;
    cardText += ` of `;
    switch (cardSuit) {
        case 0: cardText += 'Spades'; break
        case 1: cardText += 'Hearts'; break;
        case 2: cardText += 'Clubs'; break;
        case 3: cardText += 'Diamonds'; break;
    }

    let cardObject = {
        index: cardVal,
        face: cardFace,
        suit: cardSuit,
        text: cardText,
    }

    return cardObject;
}