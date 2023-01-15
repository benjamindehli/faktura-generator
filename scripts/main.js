let selectedOrganization;
let selectedOrganizationReference;
let subjectToVat;
let selectedCustomer;
let selectedCustomerReference;

/*---Reset select elements---*/
const resetOrganizationSelect = () => {
    const selectOrganizationElement = document.getElementById("select-organization");
    selectOrganizationElement.innerHTML = "";
    const placeholderOptionElement = createPlaceholderOptionElement("Velg foretak");
    selectOrganizationElement.appendChild(placeholderOptionElement);
};

const resetOrganizationReferenceSelect = () => {
    const selectOrganizationReferenceElement = document.getElementById("select-organization-reference");
    selectOrganizationReferenceElement.innerHTML = "";
    const placeholderOptionElement = createPlaceholderOptionElement("Velg kontaktperson");
    selectOrganizationReferenceElement.appendChild(placeholderOptionElement);
};

const resetCustomerSelect = () => {
    const selectCustomerElement = document.getElementById("select-customer");
    selectCustomerElement.innerHTML = "";
    const placeholderOptionElement = createPlaceholderOptionElement("Velg kunde");
    selectCustomerElement.appendChild(placeholderOptionElement);
};

const resetCustomerReferenceSelect = () => {
    const selectCustomerReferenceElement = document.getElementById("select-customer-reference");
    selectCustomerReferenceElement.innerHTML = "";
    const placeholderOptionElement = createPlaceholderOptionElement("Velg kontaktperson");
    selectCustomerReferenceElement.appendChild(placeholderOptionElement);
};

/*---Populate select elements---*/
const populateOrganizationSelect = () => {
    const selectOrganizationElement = document.getElementById("select-organization");
    organizations.forEach((organization) => {
        const organizationOptionElement = document.createElement("option");
        organizationOptionElement.value = organization.id;
        organizationOptionElement.label = organization.name;
        organizationOptionElement.innerText = organization.name;
        selectOrganizationElement.appendChild(organizationOptionElement);
    });
};

const populateOrganizationReferenceSelect = (selectedOrganization) => {
    const selectOrganizationReferenceElement = document.getElementById("select-organization-reference");
    if (!!selectedOrganization?.references?.length) {
        selectOrganizationReferenceElement.disabled = false;
        selectedOrganization.references.forEach((organizationReference) => {
            const organizationReferenceOptionElement = document.createElement("option");
            organizationReferenceOptionElement.value = organizationReference.id;
            organizationReferenceOptionElement.label = organizationReference.name;
            organizationReferenceOptionElement.innerText = organizationReference.name;
            selectOrganizationReferenceElement.appendChild(organizationReferenceOptionElement);
        });
    } else {
        selectOrganizationReferenceElement.disabled = true;
    }
};

const populateCustomerSelect = () => {
    const selectCustomerElement = document.getElementById("select-customer");
    customers.forEach((customer) => {
        const customerOptionElement = document.createElement("option");
        customerOptionElement.value = customer.id;
        customerOptionElement.label = customer.name;
        customerOptionElement.innerText = customer.name;
        selectCustomerElement.appendChild(customerOptionElement);
    });
};

const populateCustomerReferenceSelect = (selectedCustomer) => {
    const selectCustomerReferenceElement = document.getElementById("select-customer-reference");
    if (!!selectedCustomer?.references?.length) {
        selectCustomerReferenceElement.disabled = false;
        selectedCustomer.references.forEach((customerReference) => {
            const customerReferenceOptionElement = document.createElement("option");
            customerReferenceOptionElement.value = customerReference.id;
            customerReferenceOptionElement.label = customerReference.name;
            customerReferenceOptionElement.innerText = customerReference.name;
            selectCustomerReferenceElement.appendChild(customerReferenceOptionElement);
        });
    } else {
        selectCustomerReferenceElement.disabled = true;
    }
};
/*-----------------------------*/

/*---Populate invoice fields---*/
const populateOrganizationFields = (selectedOrganization) => {
    const organizationLogoElement = document.getElementById("organization-logo");
    const organizationNameElement = document.getElementById("organization-info-name");
    const organizationAddressLine = document.getElementById("organization-info-address-line");
    const organizationAddressZipCode = document.getElementById("organization-info-address-zip-code");
    const organizationAddressCity = document.getElementById("organization-info-address-city");

    const paymentSwiftElement = document.getElementById("payment-info-swift");
    const paymentAccountNoElement = document.getElementById("payment-info-account-no");
    const paymentIbanElement = document.getElementById("payment-info-iban");

    const organizationNameFooterElement = document.getElementById("footer-organization-name");
    const organizationNumberFooterElement = document.getElementById("footer-organization-number");
    const organizationTelephoneFooterElement = document.getElementById("footer-organization-phone-number");

    if (selectedOrganization) {
        organizationLogoElement.src = `data/organizationLogos/${selectedOrganization.logoFileName}`;
        organizationNameElement.innerHTML = selectedOrganization.name;
        organizationAddressLine.innerHTML = selectedOrganization.addressLine;
        organizationAddressZipCode.innerHTML = selectedOrganization.addressZipCode;
        organizationAddressCity.innerHTML = selectedOrganization.addressCity;

        paymentSwiftElement.innerHTML = selectedOrganization.swift;
        paymentAccountNoElement.innerHTML = selectedOrganization.accountNo;
        paymentIbanElement.innerHTML = selectedOrganization.iban;

        organizationNameFooterElement.innerHTML = selectedOrganization.name;
        organizationNumberFooterElement.innerHTML = selectedOrganization.orgNo;
        organizationTelephoneFooterElement.innerHTML = selectedOrganization.phoneNo;
    }
};

const populateOrganizationReferenceFields = (selectedOrganizationReference) => {
    const organizationReferenceNameElement = document.getElementById("organization-reference-name");
    if (selectedOrganizationReference?.name?.length) {
        organizationReferenceNameElement.innerHTML = selectedOrganizationReference.name;
    }
};

const populateCustomerFields = (selectedCustomer) => {
    const customerNameElement = document.getElementById("customer-name");
    const customerAddressLine = document.getElementById("customer-address-line");
    const customerAddressZipCode = document.getElementById("customer-address-zipcode");
    const customerAddressCity = document.getElementById("customer-address-city");

    if (selectedCustomer) {
        customerNameElement.innerHTML = selectedCustomer.name;
        customerAddressLine.innerHTML = selectedCustomer.addressLine;
        customerAddressZipCode.innerHTML = selectedCustomer.addressZipCode;
        customerAddressCity.innerHTML = selectedCustomer.addressCity;
    }
};

const populateCustomerReferenceFields = (selectedCustomerReference) => {
    const customerReferenceNameElement = document.getElementById("customer-reference-name");
    const customerReferenceAddressLineElement = document.getElementById("customer-reference-address-line");
    const customerReferenceZipCodeElement = document.getElementById("customer-reference-zip-code");
    const customerReferenceCityElement = document.getElementById("customer-reference-city");
    if (!!selectedCustomerReference) {
        customerReferenceNameElement.innerHTML = selectedCustomerReference?.name || "";
        customerReferenceAddressLineElement.innerHTML = selectedCustomerReference?.addressLine || "";
        customerReferenceZipCodeElement.innerHTML = selectedCustomerReference?.addressZipCode || "";
        customerReferenceCityElement.innerHTML = selectedCustomerReference?.addressCity || "";
    }
};

const populateDeliveryDateField = (deliveryDateString) => {
    const deliveryDateElement = document.getElementById("delivery-date");
    deliveryDateElement.innerHTML = deliveryDateString || "";
};

const populateInvoiceDateField = (invoiceDateString) => {
    const invoiceDateElement = document.getElementById("invoice-date");
    invoiceDateElement.innerHTML = invoiceDateString || "";
};

const populateDueDateField = (dueDateString) => {
    const dueDateElement = document.getElementById("due-date");
    dueDateElement.innerHTML = dueDateString || "";
};

const populateInvoiceNumberField = (invoiceNumberString) => {
    const invoiceNumberElement = document.getElementById("invoice-number");
    invoiceNumberElement.innerHTML = invoiceNumberString || "";
};

/*-----------------------------*/

/*---Event handlers---*/
const handleSelectOrganization = (organizationId) => {
    selectedOrganization = organizations.find((organization) => {
        return organization.id === organizationId;
    });
    populateOrganizationFields(selectedOrganization);
    resetOrganizationReferenceSelect();
    
    if (!selectedOrganization?.references?.length) {
        selectedOrganization.references = [
            {
                id: "1",
                name: selectedOrganization.name,
                addressCity: selectedOrganization.addressCity,
                addressLine: selectedOrganization.addressLine,
                addressZipCode: selectedOrganization.addressZipCode
            }
        ];
        handleSelectOrganizationReference("1");
        const selectOrganizationReferenceElement = document.getElementById("select-organization-reference");
        selectOrganizationReferenceElement.value = "1";
    }
    populateOrganizationReferenceSelect(selectedOrganization);
    autoSetInvoiceNumberInput(selectedOrganization);
};

const handleSelectOrganizationReference = (organizationReferenceId) => {
    selectedOrganizationReference = selectedOrganization.references.find((organizationReference) => {
        return organizationReference.id === organizationReferenceId;
    });
    populateOrganizationReferenceFields(selectedOrganizationReference);
};

const handleSelectCustomer = (customerId) => {
    selectedCustomer = customers.find((customer) => {
        return customer.id === customerId;
    });
    populateCustomerFields(selectedCustomer);
    resetCustomerReferenceSelect();
    if (!selectedCustomer?.references?.length) {
        selectedCustomer.references = [
            {
                id: "1",
                name: selectedCustomer.name,
                addressCity: selectedCustomer.addressCity,
                addressLine: selectedCustomer.addressLine,
                addressZipCode: selectedCustomer.addressZipCode
            }
        ];
        handleSelectCustomerReference("1");
        const selectCustomerReferenceElement = document.getElementById("select-customer-reference");
        selectCustomerReferenceElement.value = "1";
    }
    populateCustomerReferenceSelect(selectedCustomer);
};

const handleSelectCustomerReference = (customerReferenceId) => {
    selectedCustomerReference = selectedCustomer.references.find((customerReference) => {
        return customerReference.id === customerReferenceId;
    });
    populateCustomerReferenceFields(selectedCustomerReference);
};

const handleInputDeliveryDate = (deliveryDate) => {
    const deliveryDateString = formatTextDateString(deliveryDate);
    populateDeliveryDateField(deliveryDateString);
};

const handleInputInvoiceDate = (invoiceDate) => {
    const invoiceDateString = formatTextDateString(invoiceDate);
    populateInvoiceDateField(invoiceDateString);

    const inputDueDateElement = document.getElementById("input-due-date");
    inputDueDateElement.setAttribute("min", invoiceDate);
    // Add 14 days
    let dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 14);
    const dueDateInputString = formatInputDateString(dueDate);
    inputDueDateElement.value = dueDateInputString;
    handleInputDueDate(dueDateInputString);
};

const handleInputDueDate = (dueDate) => {
    const dueDateString = formatTextDateString(dueDate);
    populateDueDateField(dueDateString);
};

const handleInputInvoiceNumber = (invoiceNumber) => {
    populateInvoiceNumberField(invoiceNumber.toString());
};

const handleCheckboxSubjectToVat = (checked) => {
    subjectToVat = checked;
    renderInvoiceLines();
    updateVatAmount();
};
/*-----------------------------*/

const autoSetDateInputs = () => {
    const inputDateStringForToday = formatInputDateString(new Date());

    const inputDeliveryDateElement = document.getElementById("input-delivery-date");
    const inputInvoiceDateElement = document.getElementById("input-invoice-date");

    inputDeliveryDateElement.value = inputDateStringForToday;
    handleInputDeliveryDate(inputDateStringForToday);

    inputInvoiceDateElement.value = inputDateStringForToday;
    handleInputInvoiceDate(inputDateStringForToday);
};

const autoSetInvoiceNumberInput = (selectedOrganization) => {
    const inputInvoiceNumberElement = document.getElementById("input-invoice-number");
    const invoiceNumber = selectedOrganization.invoiceStartNo || 0;
    inputInvoiceNumberElement.value = invoiceNumber;
    handleInputInvoiceNumber(invoiceNumber.toString());
};

const setDocumentType = (documentType) => {
    const documentTitleElement = document.getElementById("document-title");
    const invoiceTotalLabelElement = document.getElementById("invoice-total-label");
    const inputDueDateElement = document.getElementById("input-due-date");
    const dueDateLabelElement = document.getElementById("due-date-label");
    const dueDateElement = document.getElementById("due-date");
    const paymentInfoLegalTextElement = document.getElementById("payment-info-legal-text");
    const paymentInfoTitleElement = document.getElementById("payment-info-title");
    const paymentInfoInstructionElement = document.getElementById("payment-info-instruction");
    const bankAccountDetailsElement = document.getElementById("bank-account-details");

    if (documentType === "invoice") {
        documentTitleElement.innerText = "Faktura";
        invoiceTotalLabelElement.innerText = "Å betale";
        inputDueDateElement.disabled = false;
        dueDateLabelElement.style.display = "inline-block";
        dueDateElement.style.display = "block";
        paymentInfoLegalTextElement.style.display = "block";
        paymentInfoTitleElement.innerText = "Betalingsinformasjon";
        paymentInfoInstructionElement.innerText = "Husk å merke betalingen med fakturanummer!";
        paymentInfoInstructionElement.classList.remove("text-red");
        paymentInfoInstructionElement.classList.add("text-black");
        bankAccountDetailsElement.style.display = "block";
    } else if (documentType === "creditNote") {
        documentTitleElement.innerText = "Kreditnota";
        invoiceTotalLabelElement.innerText = "Til gode";
        inputDueDateElement.disabled = true;
        dueDateLabelElement.style.display = "none";
        dueDateElement.style.display = "none";
        paymentInfoLegalTextElement.style.display = "none";
        paymentInfoTitleElement.innerText = "Kreditnotasammendrag";
        paymentInfoInstructionElement.innerText = "NB: DETTE ER EN KREDITNOTA. SKAL IKKE BETALES!";
        paymentInfoInstructionElement.classList.remove("text-black");
        paymentInfoInstructionElement.classList.add("text-red");
        bankAccountDetailsElement.style.display = "none";
    } else {
        console.warn("Invalid document type", documentType);
    }
};

resetOrganizationSelect();
resetOrganizationReferenceSelect();
resetCustomerSelect();
resetCustomerReferenceSelect();
populateOrganizationSelect();
populateCustomerSelect();
autoSetDateInputs();
addInvoiceLine();
renderInvoiceLines();
