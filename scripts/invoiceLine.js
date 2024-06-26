let invoiceLines = [];

const vatRatesInfo = [
    {
        id: "hoy",
        label: "25%",
        name: "Høy 25%",
        rate: 25
    },
    {
        id: "middels",
        label: "15%",
        name: "Middels 15%",
        rate: 15
    },
    {
        id: "lav",
        label: "12%",
        name: "Lav 12%",
        rate: 12
    },
    {
        id: "fritatt",
        label: "0% Fritatt",
        name: "Fritatt 0%",
        rate: 0
    },
    {
        id: "untatt",
        label: "0% Untatt",
        name: "Untatt 0%",
        rate: 0
    },
    {
        id: "eksport",
        label: "0% Eksport",
        name: "Eksport 0%",
        rate: 0
    }
];

const createInvoiceLineElement = (index, invoiceLine) => {
    // Row
    const rowElement = document.createElement("tr");
    rowElement.classList.add("text-small");

    // Description
    const descriptionTdElement = document.createElement("td");
    descriptionTdElement.classList.add("text-align-left");
    const descriptionInputElement = document.createElement("input");
    descriptionInputElement.value = invoiceLine?.description || "";
    descriptionInputElement.onkeyup = (event) => handleInvoiceLineDescriptionChange(event.target.value, index);
    descriptionTdElement.appendChild(descriptionInputElement);

    // Price
    const priceTdElement = document.createElement("td");
    priceTdElement.classList.add("text-align-right");
    const priceInputElement = document.createElement("input");
    priceInputElement.classList.add("price");
    priceInputElement.classList.add("hidden");
    priceInputElement.type = "number";
    priceInputElement.step = ".01";
    priceInputElement.placeholder = "0,00";
    priceInputElement.value = invoiceLine?.price || "";

    const priceInputPreviewElement = document.createElement("span");
    priceInputPreviewElement.classList.add("text-align-right");
    priceInputPreviewElement.classList.add("input");
    priceInputPreviewElement.classList.add("price");
    priceInputPreviewElement.innerText = addDigitGrouping(parseFloat(invoiceLine?.price || 0).toFixed(2)).replace(
        ".",
        ","
    );
    priceInputPreviewElement.onclick = () => {
        priceInputElement.classList.remove("hidden");
        priceInputElement.focus();
        priceInputPreviewElement.classList.add("hidden");
    };

    priceInputElement.onkeyup = (event) => handleInvoiceLinePriceChange(event.target.value, index);
    priceInputElement.onblur = (event) => {
        const inputValue = parseFloat(event.target.value || 0).toFixed(2);
        priceInputElement.value = inputValue;
        priceInputPreviewElement.innerText = addDigitGrouping(inputValue).replace(".", ",");
        priceInputElement.classList.add("hidden");
        priceInputPreviewElement.classList.remove("hidden");
    };

    priceTdElement.appendChild(priceInputPreviewElement);
    priceTdElement.appendChild(priceInputElement);

    // Quantity
    const quantityTdElement = document.createElement("td");
    quantityTdElement.classList.add("text-align-right");
    const quantityInputElement = document.createElement("input");
    quantityInputElement.type = "number";
    quantityInputElement.placeholder = "0";
    quantityInputElement.value = invoiceLine?.quantity || 0;
    quantityInputElement.onkeyup = (event) => handleInvoiceLineQuantityChange(event.target.value, index);
    quantityTdElement.appendChild(quantityInputElement);

    // Discount
    const discountTdElement = document.createElement("td");
    discountTdElement.classList.add("text-align-right");
    const discountInputElement = document.createElement("input");
    discountInputElement.classList.add("has-addon");
    discountInputElement.type = "number";
    discountInputElement.placeholder = "0";
    discountInputElement.value = invoiceLine?.discount || 0;
    discountInputElement.onkeyup = (event) => handleInvoiceLineDicountChange(event.target.value, index);
    const discountInputElementAddon = document.createElement("span");
    discountInputElementAddon.classList.add("addon");
    discountInputElementAddon.innerText = "%";
    discountTdElement.appendChild(discountInputElement);
    discountTdElement.appendChild(discountInputElementAddon);

    // VAT
    const vatTdElement = document.createElement("td");
    vatTdElement.classList.add("text-align-right");

    const vatSelectElement = document.createElement("select");
    vatSelectElement.classList.add("invoice-line-vat-rate");
    if (subjectToVat) {
        vatSelectElement.onchange = (event) => handleInvoiceLineVatChange(event.target.value, index);
        vatRatesInfo.forEach((vatRateInfo) => {
            const vatRateOptionElement = document.createElement("option");
            vatRateOptionElement.value = vatRateInfo.id;
            vatRateOptionElement.innerText = vatRateInfo.label;
            if (invoiceLine?.vat?.id === vatRateInfo.id) {
                vatRateOptionElement.selected = true;
            }
            vatSelectElement.appendChild(vatRateOptionElement);
        });
    } else {
        vatSelectElement.readOnly = true;
        vatSelectElement.disabled = true;
        const vatRateOptionElement = document.createElement("option");
        vatRateOptionElement.innerText = "0%";
        vatRateOptionElement.selected = true;
        vatSelectElement.appendChild(vatRateOptionElement);
    }
    vatTdElement.appendChild(vatSelectElement);

    // Total
    const totalTdElement = document.createElement("td");
    totalTdElement.classList.add("text-align-right");
    const totalInputElement = document.createElement("span");
    totalInputElement.classList.add("total");
    totalInputElement.classList.add("input");
    totalInputElement.id = `invoice-line-total-${index}`;
    totalInputElement.type = "number";
    totalInputElement.innerText = addDigitGrouping(parseFloat(invoiceLine?.total || 0).toFixed(2)).replace(".", ",");
    totalInputElement.readOnly = true;
    totalTdElement.appendChild(totalInputElement);

    rowElement.appendChild(descriptionTdElement);
    rowElement.appendChild(priceTdElement);
    rowElement.appendChild(quantityTdElement);
    rowElement.appendChild(discountTdElement);
    rowElement.appendChild(vatTdElement);
    rowElement.appendChild(totalTdElement);

    if (invoiceLines.length > 1) {
        // Remove line button
        const removeLineTdElement = document.createElement("td");
        removeLineTdElement.classList.add("hidden-from-print");
        removeLineTdElement.classList.add("remove-invoice-line");
        const removeLineButtonElement = document.createElement("button");
        removeLineButtonElement.innerText = "✕";
        removeLineButtonElement.onclick = () => removeInvoiceLine(index);

        removeLineTdElement.appendChild(removeLineButtonElement);

        rowElement.appendChild(removeLineTdElement);
    }

    return rowElement;
};

const renderInvoiceLines = () => {
    const invoiceLinesElement = document.getElementById("invoice-lines");
    invoiceLinesElement.innerHTML = "";
    invoiceLines.forEach((invoiceLine, index) => {
        const invoiceLineElement = createInvoiceLineElement(index, invoiceLine);
        invoiceLinesElement.appendChild(invoiceLineElement);
    });
};

const updateInvoiceLineTotalElement = (index) => {
    const invoiceLineTotalElement = document.getElementById(`invoice-line-total-${index}`);
    invoiceLineTotalElement.innerText = addDigitGrouping(invoiceLines[index].total).replace(".", ",");
};

const updateNetAmount = () => {
    const netAmountElement = document.getElementById("net-amount");
    const netAmount = calculateNetAmount();
    netAmountElement.innerText = addDigitGrouping(netAmount).replace(".", ",");
    if (netAmount < 0) {
        setDocumentType("creditNote");
    } else {
        setDocumentType("invoice");
    }
};

const updateTotalAmount = () => {
    const totalAmount = addDigitGrouping(parseFloat(calculateTotalAmount() || 0).toFixed(2)).replace(".", ",");
    const invoiceTotalElement = document.getElementById("invoice-total");
    const paymentInfoInvoiceTotalElement = document.getElementById("payment-info-invoice-total");
    invoiceTotalElement.innerText = totalAmount;
    paymentInfoInvoiceTotalElement.innerText = totalAmount;
};

const createVatSummaryLineElementForSubjectToVat = (subjectToVat, vatAmountGroup, vatRateInfo) => {
    const rowElement = document.createElement("tr");
    rowElement.classList.add("text-small");
    rowElement.classList.add("text-dark-gray");
    const vatNameTdElement = document.createElement("td");
    const vatBaseTdElement = document.createElement("td");
    const vatAmountTdElement = document.createElement("td");

    vatNameTdElement.classList.add("text-align-left");
    vatBaseTdElement.classList.add("text-align-right");
    vatAmountTdElement.classList.add("text-align-right");

    const vatAmountName = vatRateInfo.name;
    const vatAmountBase = vatAmountGroup.base;
    const vatAmountTotal = vatAmountGroup.total;
    vatNameTdElement.innerText = vatAmountName;
    vatBaseTdElement.innerText = addDigitGrouping(vatAmountBase).replace(".", ",");
    vatAmountTdElement.innerText = addDigitGrouping(vatAmountTotal).replace(".", ",");
    rowElement.appendChild(vatNameTdElement);
    rowElement.appendChild(vatBaseTdElement);
    rowElement.appendChild(vatAmountTdElement);
    return rowElement;
};

const createVatSummaryLineElementForNotSubjectToVat = (netAmount) => {
    const rowElement = document.createElement("tr");
    rowElement.classList.add("text-small");
    rowElement.classList.add("text-dark-gray");
    const vatNameTdElement = document.createElement("td");
    const vatBaseTdElement = document.createElement("td");
    const vatAmountTdElement = document.createElement("td");

    vatNameTdElement.classList.add("text-align-left");
    vatBaseTdElement.classList.add("text-align-right");
    vatAmountTdElement.classList.add("text-align-right");

    vatNameTdElement.innerText = "0%";
    vatBaseTdElement.innerText = addDigitGrouping(netAmount).replace(".", ",");
    vatAmountTdElement.innerText = "0,00";
    rowElement.appendChild(vatNameTdElement);
    rowElement.appendChild(vatBaseTdElement);
    rowElement.appendChild(vatAmountTdElement);
    return rowElement;
};

const updateVatAmount = () => {
    const vatAmountElement = document.getElementById("vat-amount");
    const vatSummaryLinesElement = document.getElementById("vat-summary-lines");
    vatSummaryLinesElement.innerHTML = "";
    if (subjectToVat) {
        const vatAmount = calculateVatAmount();
        vatAmountElement.innerText = addDigitGrouping(vatAmount.sum.total).replace(".", ",");
        Object.keys(vatAmount)
            .filter((vatAmountKey) => {
                return vatAmountKey !== "sum";
            })
            .forEach((vatAmountKey) => {
                const vatAmountGroup = vatAmount[vatAmountKey];
                const vatRateInfo = vatRatesInfo.find((vatRateInfo) => {
                    return vatRateInfo.id === vatAmountKey;
                });
                const vatSummaryLineElement = createVatSummaryLineElementForSubjectToVat(
                    subjectToVat,
                    vatAmountGroup,
                    vatRateInfo
                );
                vatSummaryLinesElement.appendChild(vatSummaryLineElement);
            });
    } else {
        vatAmountElement.innerText = "0,00";
        const netAmount = calculateNetAmount();
        const vatSummaryLineElement = createVatSummaryLineElementForNotSubjectToVat(netAmount);
        vatSummaryLinesElement.appendChild(vatSummaryLineElement);
    }
};

const setInvoiceLineDescription = (value, index) => {
    invoiceLines[index].description = value;
};

const setInvoiceLinePrice = (value, index) => {
    invoiceLines[index].price = parseFloat(value).toFixed(2) || 0.0;
};

const setInvoiceLineQuantity = (value, index) => {
    invoiceLines[index].quantity = parseInt(value) || 0;
};

const setInvoiceLineDiscount = (value, index) => {
    invoiceLines[index].discount = parseInt(value) || 0;
};

const setInvoiceLineVat = (value, index) => {
    invoiceLines[index].vat = value;
};

const setInvoiceLineTotal = (value, index) => {
    invoiceLines[index].total = parseFloat(value).toFixed(2) || 0.0;
};

const handleInvoiceLineDescriptionChange = (value, index) => {
    setInvoiceLineDescription(value, index);
};

const handleInvoiceLinePriceChange = (value, index) => {
    setInvoiceLinePrice(value, index);
    const total = calculateInvoiceLineTotal(invoiceLines[index]);
    setInvoiceLineTotal(total, index);
    updateInvoiceLineTotalElement(index);
    updateNetAmount();
    updateVatAmount();
    updateTotalAmount();
};

const handleInvoiceLineQuantityChange = (value, index) => {
    setInvoiceLineQuantity(value, index);
    const total = calculateInvoiceLineTotal(invoiceLines[index]);
    setInvoiceLineTotal(total, index);
    updateInvoiceLineTotalElement(index);
    updateNetAmount();
    updateVatAmount();
    updateTotalAmount();
};

const handleInvoiceLineDicountChange = (value, index) => {
    setInvoiceLineDiscount(value, index);
    const total = calculateInvoiceLineTotal(invoiceLines[index]);
    setInvoiceLineTotal(total, index);
    updateInvoiceLineTotalElement(index);
    updateNetAmount();
    updateVatAmount();
    updateTotalAmount();
};

const handleInvoiceLineVatChange = (vatRateId, index) => {
    const value = vatRatesInfo.find((vatRateInfo) => {
        return vatRateInfo.id === vatRateId;
    });
    setInvoiceLineVat(value, index);
    updateVatAmount();
    updateTotalAmount();
};

const calculateInvoiceLineTotal = (invoiceLine) => {
    const price = parseFloat(invoiceLine?.price) || 0;
    const quantity = parseInt(invoiceLine?.quantity) || 0;
    const sum = price * quantity;

    const discountPercentage = parseInt(invoiceLine?.discount) / 100 || 0;
    const discountOfSum = sum * discountPercentage;
    return (sum - discountOfSum).toFixed(2);
};

const calculateNetAmount = () => {
    let netAmount = 0;
    invoiceLines.forEach((invoiceLine) => {
        netAmount += parseFloat(calculateInvoiceLineTotal(invoiceLine));
    });
    return netAmount.toFixed(2);
};

const calculateVatAmount = () => {
    let vatAmount = {
        sum: {
            base: 0,
            total: 0
        }
    };

    invoiceLines.forEach((invoiceLine) => {
        const vatRatePercentage = parseInt(invoiceLine?.vat?.rate) / 100 || 0;
        if (!vatAmount[invoiceLine.vat.id]) {
            vatAmount[invoiceLine.vat.id] = {
                base: 0,
                total: 0
            };
        }
        const vatAmountOfInvoiceLineTotal = parseFloat(invoiceLine.total * vatRatePercentage);
        vatAmount[invoiceLine.vat.id].base += parseFloat(invoiceLine.total);
        vatAmount[invoiceLine.vat.id].total += vatAmountOfInvoiceLineTotal;
        vatAmount.sum.base += parseFloat(invoiceLine.total);
        vatAmount.sum.total += vatAmountOfInvoiceLineTotal;
    });
    let vatAmountRounded = {};
    Object.keys(vatAmount).forEach((key) => {
        if (!vatAmountRounded[key]) {
            vatAmountRounded[key] = {
                base: 0,
                total: 0
            };
        }
        vatAmountRounded[key].total = vatAmount[key].total.toFixed(2);
        vatAmountRounded[key].base = vatAmount[key].base.toFixed(2);
    });
    return vatAmountRounded;
};

const calculateTotalAmount = () => {
    let netAmount = parseFloat(calculateNetAmount());
    let vatAmount = subjectToVat ? parseFloat(calculateVatAmount().sum.total) : 0;
    return netAmount + vatAmount;
};

const addInvoiceLine = () => {
    invoiceLines.push({
        description: "",
        price: 0.0,
        quantity: 1,
        discount: 0,
        vat: vatRatesInfo.find((vatRateInfo) => {
            return vatRateInfo.id === "hoy";
        }),
        total: 0.0
    });
    renderInvoiceLines();
};

const removeInvoiceLine = (index) => {
    invoiceLines.splice(index, 1);
    renderInvoiceLines();
    updateNetAmount();
    updateVatAmount();
    updateTotalAmount();
};
