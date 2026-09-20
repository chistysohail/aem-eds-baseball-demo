export default async function decorate(block) {
  // Read configuration BEFORE clearing the block
  const rows = [...block.children];

  let selectedTeam = 'Toronto Blue Jays';

  rows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();

      if (key === 'team') {
        selectedTeam = value;
      }
    }
  });

  // Show loading state
  block.innerHTML = `<p>Loading ${selectedTeam} games...</p>`;

  try {
    const response = await fetch(
      'https://statsapi.mlb.com/api/v1/schedule?sportId=1',
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    block.innerHTML = '';

    if (!data.dates || data.dates.length === 0) {
      block.innerHTML = '<p>No MLB games found today.</p>';
      return;
    }

    const games = data.dates[0].games;

    // Find only the game involving the selected team
    const selectedGame = games.find((game) => {
      const awayTeam = game.teams.away.team.name;
      const homeTeam = game.teams.home.team.name;

      return awayTeam === selectedTeam || homeTeam === selectedTeam;
    });

    if (!selectedGame) {
      block.innerHTML = `
        <p>No game found for ${selectedTeam} today.</p>
      `;
      return;
    }

    const awayName = selectedGame.teams.away.team.name;
    const homeName = selectedGame.teams.home.team.name;

    const awayScore = selectedGame.teams.away.score ?? '-';
    const homeScore = selectedGame.teams.home.score ?? '-';

    const gameRow = document.createElement('div');
    gameRow.classList.add('game');

    gameRow.innerHTML = `
      <div class="team">
        <span class="team-name">${awayName}</span>
        <span class="team-score">${awayScore}</span>
      </div>

      <div class="versus">VS</div>

      <div class="team">
        <span class="team-name">${homeName}</span>
        <span class="team-score">${homeScore}</span>
      </div>
    `;

    block.append(gameRow);
  } catch (error) {
    console.error('Unable to load MLB scores:', error);

    block.innerHTML = '<p>Unable to load MLB scores.</p>';
  }
}