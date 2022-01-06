function listToArray(cards) {
    return cards.split(', ')
}

function arrayToList(cards) {
    return cards.join(', ')
}

module.exports = {
    listToArray,
    arrayToList
}