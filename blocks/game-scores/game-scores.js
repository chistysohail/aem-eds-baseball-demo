export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length >= 2) {
      cells[0].classList.add('team-name');
      cells[1].classList.add('team-score');
    }
  });
}