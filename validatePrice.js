const validatePrice = price => {
    const priceAsArray = price.split(',');

    let isValid = true;

    priceAsArray.forEach(p => {
        if (!(["1","2","3","4"].find(a => p === a))) 
            isValid = false;
    });

    return isValid;
}

module.exports = validatePrice;