const formatTextDateString = (date) => {
    var d = new Date(date);
    if (!!d.valueOf()) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
        const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
        return `${day}.${month}.${year}`;
    } else {
        console.warn("Invalid date");
        return "";
    }
};

const formatInputDateString = (date) => {
    var d = new Date(date);
    if (!!d.valueOf()) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
        const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
        return `${year}-${month}-${day}`;
    } else {
        console.warn("Invalid date");
        return "";
    }
};

const createPlaceholderOptionElement = (placeholderText) => {
    const placeholderOptionElement = document.createElement("option");
    placeholderOptionElement.disabled = true;
    placeholderOptionElement.selected = true;
    placeholderOptionElement.label = placeholderText;
    placeholderOptionElement.innerText = placeholderText;
    return placeholderOptionElement;
}

const addDigitGrouping = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};