$(function() {
    $("div.calculator-loan :input").keydown(function() {
        Calculator_Loan($(this));
    }).keyup(function() {
        Calculator_Loan($(this));
    }).change(function() {
        Calculator_Loan($(this));
    }).blur(function() {
        Calculator_Loan($(this));
    });

    $("div.calculator-lease :input").keydown(function() {
        Calculator_Lease($(this));
    }).keyup(function() {
        Calculator_Lease($(this));
    }).change(function() {
        Calculator_Lease($(this));
    }).blur(function() {
        Calculator_Lease($(this));
    });

    $("div.calculator-afford :input").keydown(function() {
        Calculator_Afford($(this));
    }).keyup(function() {
        Calculator_Afford($(this));
    }).change(function() {
        Calculator_Afford($(this));
    }).blur(function() {
        Calculator_Afford($(this));
    });

    $("#btnCalc").on("click",
        function () {
            var paymentMethod = $("#paymentType").val();
            switch (paymentMethod.toLowerCase()) {
            case "loan":
                Calculate_Loan_Modal($("#calc"));
                break;
            case "lease":
                Calculator_Lease_Modal($("#calc"));
                break;
            case "afford":
                Calculator_Afford_Modal($("#calc"));
                break;
            }
        });
});
function Calculate_Loan_Modal(field) {
    var calcDiv = field;
    var vehiclePrice = parseFloat(calcDiv.find(".calc-vehicle-price").val());
    var downPayment = parseFloat(calcDiv.find(".calc-down-payment").val());
    var tradeInValue = parseFloat(calcDiv.find(".calc-trade-in-value").val());
    var salesTax = parseFloat(calcDiv.find(".calc-sales-tax").val());
    var interestRate = parseFloat(calcDiv.find(".calc-interest-rate").val());
    var loanTerm = parseInt(calcDiv.find(".calc-loan-term").val());

    var loanAmount = 0;
    var monthlyPayment = 0;

    if (isNaN(interestRate)) interestRate = 0;

    if (vehiclePrice > 0) {
        loanAmount += vehiclePrice;
        if (salesTax > 0) loanAmount += loanAmount * (salesTax / 100);
        if (downPayment > 0) loanAmount -= downPayment;
        if (tradeInValue > 0) loanAmount -= tradeInValue;
    }

    if (loanAmount > 0 && loanTerm > 0 && interestRate >= 0) {
        if (interestRate == 0) {
            monthlyPayment = (loanAmount / loanTerm);
        } else {
            monthlyPayment = (loanAmount * (interestRate / 1200) * Math.pow((1 + (interestRate / 1200)), loanTerm)) / (Math.pow((1 + (interestRate / 1200)), loanTerm) - 1);
        };
        calcDiv.find(".calc-loan-amount").text(FormatNumber(loanAmount, 2, true));
        calcDiv.find(".calc-monthly-payment").text(FormatNumber(monthlyPayment, 2, true));
    } else {
        calcDiv.find(".calc-loan-amount").text("");
        calcDiv.find(".calc-monthly-payment").text("");
    }
}
function Calculator_Lease_Modal(field) {
    var calcDiv = field;
    var vehiclePrice = parseFloat(calcDiv.find(".calc-vehicle-price").val());
    var downPayment = parseFloat(calcDiv.find(".calc-down-payment").val());
    var tradeInValue = vehiclePrice * parseFloat(calcDiv.find(".calc-trade-in-value").val())/100;
    var salesTax = parseFloat(calcDiv.find(".calc-sales-tax").val());
    var residualValue = parseFloat(calcDiv.find(".calc-residual-value").val());
    var moneyFactor = parseFloat(calcDiv.find(".calc-money-factor").val());
    var loanTerm = parseInt(calcDiv.find(".calc-loan-term").val());

    var amountFinanced = 0;
    var monthlyPayment = 0;

    if (vehiclePrice > 0) {
        amountFinanced += vehiclePrice;
        if (downPayment > 0) amountFinanced -= downPayment;
        if (tradeInValue > 0) amountFinanced -= tradeInValue;
    }

    if (amountFinanced > 0 && loanTerm > 0 && moneyFactor >= 0) {
        if (!(residualValue > 0)) residualValue = 0;
        var depreciation = (amountFinanced - residualValue) / loanTerm;
        var leaseCharge = (residualValue + amountFinanced) * moneyFactor;
        monthlyPayment = leaseCharge + depreciation;

        if (salesTax > 0) monthlyPayment += monthlyPayment * (salesTax / 100);

        var leasePrice = monthlyPayment * loanTerm;

        calcDiv.find(".calc-loan-amount").text(FormatNumber(leasePrice, 2, true));
        calcDiv.find(".calc-monthly-payment").text(FormatNumber(monthlyPayment, 2, true));
    } else {
        calcDiv.find(".calc-loan-amount").text("");
        calcDiv.find(".calc-monthly-payment").text("");
    }
}

function Calculator_Afford_Modal(field) {
    var calcTable = field;
    var monthlyPayment = parseFloat(calcTable.find(".calc-vehicle-price").val());
    var downPayment = parseFloat(calcTable.find(".calc-down-payment").val());
    var tradeInValue = parseFloat(calcTable.find(".calc-trade-in-value").val());
    var salesTax = parseFloat(calcTable.find(".calc-sales-tax").val());
    var interestRate = parseFloat(calcTable.find(".calc-interest-rate").val());
    var loanTerm = parseInt(calcTable.find(".calc-loan-term").val());

    var loanAmount = 0;
    var vehiclePrice = 0;

    if (isNaN(interestRate)) interestRate = 0;

    if (monthlyPayment > 0) {
        if (interestRate > 0) {
            var denom = 1 - Math.pow((1 + (interestRate / 1200)), (-1 * loanTerm));
            vehiclePrice = monthlyPayment * denom / (interestRate / 1200);
        } else {
            vehiclePrice = monthlyPayment * loanTerm;
        }

        if (!(salesTax > 0)) salesTax = 0;
        if (!(downPayment > 0)) downPayment = 0;
        if (!(tradeInValue > 0)) tradeInValue = 0;
        vehiclePrice = (vehiclePrice + downPayment + tradeInValue) / (1 + (salesTax / 100));

        var vehiclePriceTax = vehiclePrice * (salesTax / 100);
        loanAmount = vehiclePriceTax + vehiclePrice - downPayment - tradeInValue;

        calcTable.find(".calc-loan-amount").text(FormatNumber(loanAmount, 2, true));
        calcTable.find(".calc-monthly-payment").text(FormatNumber(vehiclePrice, 2, true));
    } else {
        calcTable.find(".calc-loan-amount").text("");
        calcTable.find(".calc-monthly-payment").text("");
    }
}
function Calculator_Loan(field) {

    var calcDiv = field.closest("div.calculator-loan");
    var vehiclePrice = parseFloat(calcDiv.find(".calc-vehicle-price").val());
    var downPayment = parseFloat(calcDiv.find(".calc-down-payment").val());
    var tradeInValue = parseFloat(calcDiv.find(".calc-trade-in-value").val());
    var salesTax = parseFloat(calcDiv.find(".calc-sales-tax").val());
    var interestRate = parseFloat(calcDiv.find(".calc-interest-rate").val());
    var loanTerm = parseInt(calcDiv.find(".calc-loan-term").val());

    var loanAmount = 0;
    var monthlyPayment = 0;

    if (isNaN(interestRate)) interestRate = 0;

    if (vehiclePrice > 0) {
        loanAmount += vehiclePrice;
        if (salesTax > 0) loanAmount += loanAmount * (salesTax / 100);
        if (downPayment > 0) loanAmount -= downPayment;
        if (tradeInValue > 0) loanAmount -= tradeInValue;
    }

    if (loanAmount > 0 && loanTerm > 0 && interestRate >= 0) {
        if (interestRate == 0) {
            monthlyPayment = (loanAmount / loanTerm);
        } else {
            monthlyPayment = (loanAmount * (interestRate / 1200) * Math.pow((1 + (interestRate / 1200)), loanTerm)) / (Math.pow((1 + (interestRate / 1200)), loanTerm) - 1);
        };
        calcDiv.find(".calc-loan-amount").val(FormatNumber(loanAmount, 2, true));
        calcDiv.find(".calc-monthly-payment").val(FormatNumber(monthlyPayment, 2, true));
    } else {
        calcDiv.find(".calc-loan-amount").val("");
        calcDiv.find(".calc-monthly-payment").val("");
    }
}

function Calculator_Lease(field) {
    var calcDiv = field.closest("div.calculator-lease");
    var vehiclePrice = parseFloat(calcDiv.find(".calc-vehicle-price").val());
    var downPayment = parseFloat(calcDiv.find(".calc-down-payment").val());
    var tradeInValue = parseFloat(calcDiv.find(".calc-trade-in-value").val());
    var salesTax = parseFloat(calcDiv.find(".calc-sales-tax").val());
    var residualValue = parseFloat(calcDiv.find(".calc-residual-value").val());
    var moneyFactor = parseFloat(calcDiv.find(".calc-money-factor").val());
    var loanTerm = parseInt(calcDiv.find(".calc-loan-term").val());

    var amountFinanced = 0;
    var monthlyPayment = 0;

    if (isNaN(moneyFactor)) moneyFactor = 0;

    if (vehiclePrice > 0) {
        amountFinanced += vehiclePrice;
        if (downPayment > 0) amountFinanced -= downPayment;
        if (tradeInValue > 0) amountFinanced -= tradeInValue;
    }

    if (amountFinanced > 0 && loanTerm > 0 && moneyFactor >= 0) {
        if (!(residualValue > 0)) residualValue = 0;
        var depreciation = (amountFinanced - residualValue) / loanTerm;
        var leaseCharge = (residualValue + amountFinanced) * moneyFactor;
        monthlyPayment = leaseCharge + depreciation;

        if (salesTax > 0) monthlyPayment += monthlyPayment * (salesTax / 100);

        var leasePrice = monthlyPayment * loanTerm;

        calcDiv.find(".calc-lease-price").val(FormatNumber(leasePrice, 2, true));
        calcDiv.find(".calc-monthly-payment").val(FormatNumber(monthlyPayment, 2, true));
    } else {
        calcDiv.find(".calc-lease-price").val("");
        calcDiv.find(".calc-monthly-payment").val("");
    }
}

function Calculator_Afford(field) {
    var calcTable = field.closest("div.calculator-afford");
    var monthlyPayment = parseFloat(calcTable.find(".calc-monthly-payment").val());
    var downPayment = parseFloat(calcTable.find(".calc-down-payment").val());
    var tradeInValue = parseFloat(calcTable.find(".calc-trade-in-value").val());
    var salesTax = parseFloat(calcTable.find(".calc-sales-tax").val());
    var interestRate = parseFloat(calcTable.find(".calc-interest-rate").val());
    var loanTerm = parseInt(calcTable.find(".calc-loan-term").val());

    var loanAmount = 0;
    var vehiclePrice = 0;

    if (isNaN(interestRate)) interestRate = 0;

    if (monthlyPayment > 0) {
        if (interestRate > 0) {
            var denom = 1 - Math.pow((1 + (interestRate / 1200)), (-1 * loanTerm));
            vehiclePrice = monthlyPayment * denom / (interestRate / 1200);
        } else {
            vehiclePrice = monthlyPayment * loanTerm;
        }

        if (!(salesTax > 0)) salesTax = 0;
        if (!(downPayment > 0)) downPayment = 0;
        if (!(tradeInValue > 0)) tradeInValue = 0;
        vehiclePrice = (vehiclePrice + downPayment + tradeInValue) / (1 + (salesTax / 100));

        var vehiclePriceTax = vehiclePrice * (salesTax / 100);
        loanAmount = vehiclePriceTax + vehiclePrice - downPayment - tradeInValue;

        calcTable.find(".calc-loan-amount").val(FormatNumber(loanAmount, 2, true));
        calcTable.find(".calc-vehicle-price").val(FormatNumber(vehiclePrice, 2, true));
    } else {
        calcTable.find(".calc-loan-amount").val("");
        calcTable.find(".calc-vehicle-price").val("");
    }
}

function Calculator_ShowLeaseTerms() {
    var info = "<div style='width: 400px;'><b style='color: #00f;'>Residual Value:</b>&nbsp; This is the projected market value of a vehicle at the end of the lease which is used to determine the cost of the lease.<br/><br/>"
        + "<b style='color: #00f;'>Money Factor:</b>&nbsp; For a lease, the &quot;money factor&quot; is a fractional number used to calculate the lease charge or fee. "
        + "Your monthly payment for a lease is a combination of the depreciation charge and this fee.<br/><br/>"
        + "To compare the money factor with a more typical APR, multiply it by 2,400. The result will be a slightly higher than the equivalent APR. "
        + "This value is more useful for comparing leases with each other than with loans, however, because it doesn’t account for all fees and only loans build equity.</div>"
    Dialog_Info("Lease Calculator Terms", info);
}