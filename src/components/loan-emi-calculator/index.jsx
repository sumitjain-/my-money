import React from 'react';
import numeral from 'numeral';

const EPSILON = 1e-6;
const currencyFormatted = x => (x > EPSILON ? numeral(x).format('1,2.00') : '0.00');

const RegisterRow = ({idx, emi, interestPaid, principalPaid, loanRemaining, principal}) => {
    return (
        <tr>
            <td>{idx + 1}</td>
            <td title={loanRemaining}>{`₹${currencyFormatted(loanRemaining)} (${
                currencyFormatted(loanRemaining / principal * 100)
            }%)`}</td>
            <td title={interestPaid}>{`₹${currencyFormatted(interestPaid)} (${
                currencyFormatted(interestPaid / emi * 100)
            }%)`}</td>
            <td title={principalPaid}>{`₹${currencyFormatted(principalPaid)} (${
                currencyFormatted(principalPaid / emi * 100)
            }%)`}</td>
        </tr>
    )
}

const LoanEmiCalculator = () => {
    const [principal, setPrincipal] = React.useState(250000);
    const [interest, setInterest] = React.useState(6);
    const [tenure, setTenure] = React.useState(30);

    let emi = 0;
    let instalmentRegister = [];
    let stats = {};

    if (principal && interest && tenure) {
        const interestRate = interest / 100;
        emi = (
            principal * (interestRate) * Math.pow(1 + interestRate, tenure)
        ) / (
            Math.pow(1 + interestRate, tenure) - 1
        );
        let amountLeft = principal;
        for (let i = 0; i < tenure; i++) {
            const previousInstalment = instalmentRegister.length ? instalmentRegister[instalmentRegister.length - 1] : {
                instalment: 0,
                interestPaid: 0,
                principalPaid: 0,
                loanRemaining: amountLeft,
            };
            amountLeft = amountLeft * (1 + interestRate) - emi;
            const newInstalment = {
                instalment: emi,
                interestPaid: emi - (previousInstalment.loanRemaining - amountLeft),
                principalPaid: previousInstalment.loanRemaining - amountLeft,
                loanRemaining: amountLeft,
            }
            instalmentRegister.push(newInstalment);
        }

        stats.instalmentAmount = emi;
        stats.totalPayment = emi*tenure;
        stats.totalInterest = stats.totalPayment - principal;
        stats.interestPercent = stats.totalInterest/stats.totalPayment * 100;
        stats.principalPercent = 100 - stats.interestPercent;
    }
    return (
        <div>
            <h1 className="mt-4">
                Loan EMI Calculator
            </h1>
            <div className="text-left row mt-4">
                <div className="form-group col">
                    <label className="font-weight-bold" htmlFor="principal">Principal Amount</label>
                    <input type="number" id="principal" className="form-control" value={principal}
                           onChange={(e) => {
                               setPrincipal(parseFloat(e.target.value));
                           }}/>
                </div>
                <div className="form-group col">
                    <label className="font-weight-bold" htmlFor="interest">Interest Rate (%)</label>
                    <input type="number" id="interest" className="form-control" value={interest}
                           onChange={(e) => {
                               setInterest(parseFloat(e.target.value));
                           }}/>
                </div>
                <div className="form-group col">
                    <label className="font-weight-bold" htmlFor="tenure">Tenure (years)</label>
                    <input type="number" id="tenure" className="form-control" value={tenure}
                           onChange={(e) => {
                               setTenure(parseInt(e.target.value));
                           }}/>
                </div>
            </div>
            {
                !!principal && (
                    <>
                        <div className="row mt-2 text-left">
                            <div className="col">
                                {`Instalment Amount: ₹${currencyFormatted(stats.instalmentAmount)}`}
                            </div>
                        </div>
                        <div className="row mt-2 text-left">
                            <div className="col">
                                {`Total Payment: ₹${currencyFormatted(stats.totalPayment)}`}
                            </div>
                            <div className="col">
                                {`Total Interest: ₹${currencyFormatted(stats.totalInterest)}`}
                            </div>
                        </div>
                        <div className="row mt-2 text-left">
                            <div className="col">
                                {`Interest (% of total): ${currencyFormatted(stats.interestPercent)}%`}
                            </div>
                            <div className="col">
                                {`Principal (% of total): ${currencyFormatted(stats.principalPercent)}%`}
                            </div>
                        </div>
                    </>
                )
            }
            <div className="mt-4">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Instalment #</th>
                        <th>Loan Remaining</th>
                        <th>Interest Paid</th>
                        <th>Principal Paid</th>
                    </tr>
                    {instalmentRegister.length && instalmentRegister.map((inst, idx) => (
                        <RegisterRow key={`row-${idx}`} idx={idx} {...inst} principal={principal} emi={emi}/>
                    ))}
                    </thead>
                </table>
            </div>
        </div>
    );
}

export default LoanEmiCalculator;
