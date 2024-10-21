import React, { useState, useEffect } from 'react';

const TournamentMoney = () => {
  const [entryFee, setEntryFee] = useState(10.00);
  const [barContribution, setBarContribution] = useState(6.00);
  const [tournamentFee, setTournamentFee] = useState(1.00);
  const [potBonus, setPotBonus] = useState(0.00);
  const [payoutSpots, setPayoutSpots] = useState(3);

  // Calculate the total prize pool based on input fields
  const totalExpectedFees = 0; // Placeholder until player management is built
  const totalCollectedFees = 0; // Placeholder until player management is built
  const totalBarFees = 0; // Placeholder until player management is built
  const tournamentSoftwareFees = 0; // Placeholder until player management is built
  const totalPrizePool = totalExpectedFees + totalBarFees + potBonus - tournamentSoftwareFees;

  const calculatePayouts = () => {
    if (totalPrizePool === 0) {
      return new Array(payoutSpots).fill(0);
    }

    const spots = Math.max(payoutSpots, 1);
    let remainingPool = totalPrizePool;
    let payouts = new Array(spots).fill(0);

    for (let i = 0; i < spots; i++) {
      payouts[i] = Math.round(remainingPool / (spots - i));
      remainingPool -= payouts[i];
    }

    return payouts;
  };

  const roundedPayouts = calculatePayouts();

  const getOrdinalSuffix = (num) => {
    if (num > 3 && num < 21) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="tournament-money-container">
      <h2>Tournament Money</h2>

      <div className="tournament-money-grid">
        {/* Settings Table */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Settings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><label htmlFor="entry-fee">Entry Cost:</label></td>
              <td>
                <div className="input-wrapper">
                  <span className="dollar-sign">$</span>
                  <input
                    type="number"
                    className="dollar-input"
                    id="entry-fee"
                    value={entryFee}
                    onChange={(e) => setEntryFee(parseFloat(e.target.value))}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="bar-contribution">Bar Input:</label></td>
              <td>
                <div className="input-wrapper">
                  <span className="dollar-sign">$</span>
                  <input
                    type="number"
                    className="dollar-input"
                    id="bar-contribution"
                    value={barContribution}
                    onChange={(e) => setBarContribution(parseFloat(e.target.value))}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="tournament-fee">Usage Fee:</label></td>
              <td>
                <div className="input-wrapper">
                  <span className="dollar-sign">$</span>
                  <input
                    type="number"
                    className="dollar-input"
                    id="tournament-fee"
                    value={tournamentFee}
                    onChange={(e) => setTournamentFee(parseFloat(e.target.value))}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="pot-bonus">Bonus Money:</label></td>
              <td>
                <div className="input-wrapper">
                  <span className="dollar-sign">$</span>
                  <input
                    type="number"
                    className="dollar-input"
                    id="pot-bonus"
                    value={potBonus}
                    onChange={(e) => setPotBonus(parseFloat(e.target.value))}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="payout-spots">Payout Spots:</label></td>
              <td>
                <div className="input-wrapper">
                  <input
                    type="number"
                    className="payout-input"
                    id="payout-spots"
                    value={payoutSpots}
                    onChange={(e) => setPayoutSpots(parseInt(e.target.value))}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary Table */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Entry Costs:</strong></td>
              <td>$0.00</td> {/* Placeholder */}
            </tr>
            <tr>
              <td><strong>Bar Input:</strong></td>
              <td>$0.00</td> {/* Placeholder */}
            </tr>
            <tr>
              <td><strong>Usage Fees:</strong></td>
              <td>$0.00</td> {/* Placeholder */}
            </tr>
            <tr>
              <td><strong>Bonus Money:</strong></td>
              <td>${potBonus.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Total Prize Pool:</strong></td>
              <td>${totalPrizePool.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payout Table */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Suggested Prize Payouts</th>
            </tr>
          </thead>
          <tbody>
            {roundedPayouts.map((payout, index) => (
              <tr key={index}>
                <td>{index + 1}{getOrdinalSuffix(index + 1)} Place</td>
                <td>${payout.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentMoney;
