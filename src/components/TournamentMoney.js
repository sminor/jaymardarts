import React, { useState, useEffect } from 'react';

const TournamentMoney = ({ tournamentPlayers }) => {
  const [entryFee, setEntryFee] = useState(10); // Default to $10
  const [barContribution, setBarContribution] = useState(6); // Default to $6
  const [potBonus, setPotBonus] = useState(0); // Default to $0
  const [payoutSpots, setPayoutSpots] = useState(3); // Default to 3 places

  // Load values from localStorage on mount
  useEffect(() => {
    const storedEntryFee = localStorage.getItem('entryFee');
    const storedBarContribution = localStorage.getItem('barContribution');
    const storedPotBonus = localStorage.getItem('potBonus');
    const storedPayoutSpots = localStorage.getItem('payoutSpots');

    if (storedEntryFee) setEntryFee(parseFloat(storedEntryFee));
    if (storedBarContribution) setBarContribution(parseFloat(storedBarContribution));
    if (storedPotBonus) setPotBonus(parseFloat(storedPotBonus));
    if (storedPayoutSpots) setPayoutSpots(parseInt(storedPayoutSpots, 10));
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('entryFee', entryFee);
  }, [entryFee]);

  useEffect(() => {
    localStorage.setItem('barContribution', barContribution);
  }, [barContribution]);

  useEffect(() => {
    localStorage.setItem('potBonus', potBonus);
  }, [potBonus]);

  useEffect(() => {
    localStorage.setItem('payoutSpots', payoutSpots);
  }, [payoutSpots]);

  // Calculate the expected total fees based on the number of players
  const totalExpectedFees = tournamentPlayers.length * entryFee;

  // Calculate the total fees collected from paid players
  const totalCollectedFees = tournamentPlayers
    .filter(player => player.paid)
    .length * entryFee;

  // Calculate the bar's total contribution
  const totalBarFees = tournamentPlayers.length * barContribution;

  // Calculate the tournament software fees (set aside $1 per player)
  const tournamentSoftwareFees = tournamentPlayers.length * 1;

  // Calculate the amount from the bar going into the prize pool
  const barContributionToPrizePool = totalBarFees - tournamentSoftwareFees;

  // Calculate total prize pool based on expected fees
  const totalPrizePool = totalExpectedFees + barContributionToPrizePool + potBonus;

  // Determine the display for the fees
  let entryFeesDisplay;
  if (totalCollectedFees === totalExpectedFees) {
    // If fully collected, show in green
    entryFeesDisplay = (
      <span className="green">
        ${totalExpectedFees.toFixed(2)}
      </span>
    );
  } else {
    // Show expected vs collected in red
    entryFeesDisplay = (
      <span className="red">
        ${totalExpectedFees.toFixed(2)} / (${totalCollectedFees.toFixed(2)})
      </span>
    );
  }

  // Updated calculatePayouts function
  const calculatePayouts = () => {
    const spots = Math.max(payoutSpots, 1);
    let remainingPool = totalPrizePool;
    let payouts = [];

    // Step 1: Allocate initial amounts with adjusted percentages
    const percentages = [0.35, 0.30, 0.20]; // Adjusted percentages for the first 3 places
    for (let i = 0; i < spots; i++) {
      const percentage = percentages[i] || (percentages[percentages.length - 1] / 2);
      let payout = remainingPool * percentage;
      payouts.push(payout);
      remainingPool -= payout;
    }

    // Step 2: Ensure each payout is at least entryFee * 2
    payouts = payouts.map((payout, index) => {
      const minimumPayout = entryFee * 2;
      if (payout < minimumPayout) {
        remainingPool -= (minimumPayout - payout);
        return minimumPayout;
      }
      return payout;
    });

    // Step 3: Round each payout to the nearest $10
    payouts = payouts.map(payout => Math.round(payout / 10) * 10);

    // Step 4: Calculate total after rounding
    let totalPayouts = payouts.reduce((sum, payout) => sum + payout, 0);
    let discrepancy = totalPrizePool - totalPayouts;

    // Step 5: Distribute the remaining pool starting from the lowest place
    let index = payouts.length - 1;
    while (Math.abs(discrepancy) >= 10) {
      const adjustment = discrepancy > 0 ? 10 : -10;
      if (index > 0 && payouts[index] + adjustment > payouts[index - 1]) {
        index--;
        continue;
      }
      payouts[index] += adjustment;
      discrepancy -= adjustment;
      payouts[index] = Math.round(payouts[index] / 10) * 10;
      index = index > 0 ? index - 1 : payouts.length - 1;
    }

    // Step 6: Handle any small remaining discrepancy (less than $10)
    if (Math.abs(discrepancy) > 0) {
      payouts[payouts.length - 1] += discrepancy;
    }

    return payouts;
  };

  const roundedPayouts = calculatePayouts();

  // Function to get the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    if (num > 3 && num < 21) return 'th'; // catch 11th to 20th
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="tournament-money">
      <h3>Tournament Money</h3>

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
              <td><label htmlFor="entry-fee">Entry Fee ($):</label></td>
              <td>
                <input
                  id="entry-fee"
                  type="number"
                  min="0"
                  value={entryFee}
                  onChange={(e) => setEntryFee(parseFloat(e.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="bar-contribution">Bar Contribution ($):</label></td>
              <td>
                <input
                  id="bar-contribution"
                  type="number"
                  min="0"
                  value={barContribution}
                  onChange={(e) => setBarContribution(parseFloat(e.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="pot-bonus">Other Contributions ($):</label></td>
              <td>
                <input
                  id="pot-bonus"
                  type="number"
                  min="0"
                  value={potBonus}
                  onChange={(e) => setPotBonus(parseFloat(e.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="payout-spots">Payout Spots:</label></td>
              <td>
                <input
                  id="payout-spots"
                  type="number"
                  min="1"
                  value={payoutSpots}
                  onChange={(e) => setPayoutSpots(parseInt(e.target.value, 10))}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Data Summary Table */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Entry Fees:</strong></td>
              <td>{entryFeesDisplay}</td>
            </tr>
            <tr>
              <td><strong>Bar Fees:</strong></td>
              <td>${totalBarFees.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Tournament Fees:</strong></td>
              <td>${tournamentSoftwareFees.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Other Contributions:</strong></td>
              <td>${potBonus.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Total Prize Pool:</strong></td>
              <td>${totalPrizePool.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Prize Payouts Table */}
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
                <td>${payout.toFixed(2)} (${(payout / 2).toFixed(2)} each)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentMoney;
