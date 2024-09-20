import React, { useState, useEffect, useCallback } from 'react';

const TournamentMoney = ({ tournamentPlayers, registerResetFunction }) => {
  // Initialize state from localStorage or fallback to defaults
  const [entryFee, setEntryFee] = useState(() => {
    const savedEntryFee = localStorage.getItem('entryFee');
    return savedEntryFee ? parseFloat(savedEntryFee) : 10; // Default to $10
  });

  const [barContribution, setBarContribution] = useState(() => {
    const savedBarContribution = localStorage.getItem('barContribution');
    return savedBarContribution ? parseFloat(savedBarContribution) : 6; // Default to $6
  });

  const [potBonus, setPotBonus] = useState(() => {
    const savedPotBonus = localStorage.getItem('potBonus');
    return savedPotBonus ? parseFloat(savedPotBonus) : 0; // Default to $0
  });

  const [payoutSpots, setPayoutSpots] = useState(() => {
    const savedPayoutSpots = localStorage.getItem('payoutSpots');
    return savedPayoutSpots ? parseInt(savedPayoutSpots, 10) : 3; // Default to 3 places
  });

  // Reset function to revert to default values
  const reset = useCallback(() => {
    setEntryFee(10);
    setBarContribution(6);
    setPotBonus(0);
    setPayoutSpots(3);
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

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

  // CalculatePayouts function
  const calculatePayouts = () => {
    if (totalPrizePool === 0) {
      return new Array(payoutSpots).fill(0);
    }

    const spots = Math.max(payoutSpots, 1);
    let remainingPool = totalPrizePool;
    let payouts = [];
    const minPayout = entryFee * 2;

    // Step 1: Ensure each payout is at least entryFee * 2
    payouts = new Array(spots).fill(minPayout);
    remainingPool -= minPayout * spots;

    // Step 2: Apply Golden Ratio Distribution for the remaining pool
    const goldenRatio = 1.618;
    let sumOfRatios = 0;
    let ratioList = [];

    // Calculate the ratios for each spot based on the golden ratio
    for (let i = 0; i < spots; i++) {
        let ratio = Math.pow(1 / goldenRatio, i);
        ratioList.push(ratio);
        sumOfRatios += ratio;
    }

    // Step 3: Determine the allocation based on these ratios
    let adjustedRatios = ratioList.map(r => r / sumOfRatios); // Normalize to sum to 1
    let extraPool = remainingPool;

    for (let i = 0; i < spots; i++) {
        // Calculate additional amount using the normalized ratio
        let additionalAmount = Math.round((extraPool * adjustedRatios[i]) / 10) * 10;
        payouts[i] += additionalAmount;
        remainingPool -= additionalAmount;
    }

    // Step 4: Handle paired spots (5th/6th, 7th/8th, etc.) to ensure they are equal
    for (let i = 4; i < spots; i += 2) {
        if (i + 1 < spots) {
            let maxPayout = Math.max(payouts[i], payouts[i + 1]);
            maxPayout = Math.round(maxPayout / 10) * 10;
            payouts[i] = payouts[i + 1] = maxPayout;
        }
    }

    // Step 5: Distribute any remaining pool to the 1st place
    if (remainingPool > 0) {
        payouts[0] += Math.round(remainingPool / 10) * 10;
        remainingPool = 0;
    }

    // Step 6: Adjust the payouts to not exceed the total prize pool
    let totalPayouts = payouts.reduce((sum, payout) => sum + payout, 0);
    let discrepancy = totalPayouts - totalPrizePool;

    let index = 0;
    while (discrepancy > 0) {
        payouts[index] -= 10;
        discrepancy -= 10;
        index = (index + 1) % spots; // Move to the next place to take from
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setPayoutSpots(value === '' ? 1 : Math.max(1, parseInt(value, 10)));
                  }}
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
