import React, { useState, useEffect, useCallback } from 'react';

const TournamentMoney = ({ tournamentPlayers, registerResetFunction }) => {
  const [entryFee, setEntryFee] = useState(() => parseFloat(localStorage.getItem('entryFee')) || 10.00);
  const [barContribution, setBarContribution] = useState(() => parseFloat(localStorage.getItem('barContribution')) || 6.00);
  const [tournamentFee, setTournamentFee] = useState(() => parseFloat(localStorage.getItem('tournamentFee')) || 1.00);
  const [potBonus, setPotBonus] = useState(() => parseFloat(localStorage.getItem('potBonus')) || 0.00);
  const [payoutSpots, setPayoutSpots] = useState(() => parseInt(localStorage.getItem('payoutSpots'), 10) || 3);

  // Reset function to revert to default values
  const reset = useCallback(() => {
    setEntryFee(10.00);
    setBarContribution(6.00);
    setTournamentFee(1.00);
    setPotBonus(0.00);
    setPayoutSpots(3);
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  useEffect(() => {
    localStorage.setItem('entryFee', entryFee);
  }, [entryFee]);

  useEffect(() => {
    localStorage.setItem('barContribution', barContribution);
  }, [barContribution]);

  useEffect(() => {
    localStorage.setItem('tournamentFee', tournamentFee);
  }, [tournamentFee]);

  useEffect(() => {
    localStorage.setItem('potBonus', potBonus);
  }, [potBonus]);

  useEffect(() => {
    localStorage.setItem('payoutSpots', payoutSpots);
  }, [payoutSpots]);

  // Calculate the expected total fees based on the number of players
  const totalExpectedFees = tournamentPlayers.length * entryFee;
  const totalCollectedFees = tournamentPlayers.filter(player => player.paid).length * entryFee;
  const totalBarFees = tournamentPlayers.length * barContribution;
  const tournamentSoftwareFees = tournamentPlayers.length * tournamentFee;
  const totalPrizePool = totalExpectedFees + totalBarFees + potBonus - tournamentSoftwareFees;

  let entryFeesDisplay;
  if (totalCollectedFees === totalExpectedFees) {
    entryFeesDisplay = (
      <span className="green">
        ${totalExpectedFees.toFixed(2)}
      </span>
    );
  } else {
    entryFeesDisplay = (
      <span className="red">
        ${totalExpectedFees.toFixed(2)} / (${totalCollectedFees.toFixed(2)})
      </span>
    );
  }

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
                  <span className="spacer"></span> {/* Mimics the dollar sign space */}
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
              <td>{entryFeesDisplay}</td>
            </tr>
            <tr>
              <td><strong>Bar Input:</strong></td>
              <td>${totalBarFees.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Usage Fees:</strong></td>
              <td>${tournamentSoftwareFees.toFixed(2)}</td>
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
