let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];


const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikal
    [0, 4, 8], [2, 4, 6] // diagonal
];


let currentPlayer = 'circle';


function init() {
    render();
}


function render() {
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            tableHTML += '<td onclick="placeSymbol(' + (i * 3 + j) + ')">';
            const index = i * 3 + j;
            if (fields[index] === 'circle') {
                tableHTML += generateCircleSVG();
            } else if (fields[index] === 'cross') {
                tableHTML += generateCrossSVG();
            }
            tableHTML += '</td>';
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
}


function placeSymbol(index) {
    const gameStatus = checkGameStatus(); // Überprüfen des Spielstatus
    if (gameStatus === 'inprogress') {
        const clickedCell = document.getElementsByTagName('td')[index];
        if (fields[index] === null) {
            fields[index] = currentPlayer;
            clickedCell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
            clickedCell.onclick = null;

            if (checkGameStatus() !== 'inprogress') { // Überprüfen, ob das Spiel vorbei ist
                drawWinLine();
            }
        }
    }
}


function checkGameStatus() {
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return 'over';
        }
    }
    if (!fields.includes(null)) {
        return 'draw';
    }
    return 'inprogress';
}


function drawWinLine() {
    const winStatus = checkGameStatus();
    if (winStatus === 'over') {
        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
                const svgLine = generateWinLineSVG(a, b, c);
                document.getElementById('content').innerHTML += svgLine;
                break;
            }
        }
    }
}


function restartGame() {
    location.reload();
}


function generateWinLineSVG(index1, index2, index3) {
    const startX = (index1 % 3) * 100 + 50;
    const startY = Math.floor(index1 / 3) * 100 + 50;
    const endX = (index3 % 3) * 100 + 50;
    const endY = Math.floor(index3 / 3) * 100 + 50;

    return `
        <svg width="350" height="350" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="position: absolute;">
            <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="white" stroke-width="4" />
        </svg>
    `;
}


function generateCircleSVG() {
    const svgCode = `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="rgb(43, 216, 255)" stroke-width="8" fill="none" />
        </svg>
    `;
    return svgCode;
}


function generateCrossSVG() {
    const svgCode = `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="70" y2="70" stroke="yellow" stroke-width="8" stroke-linecap="round" />
            <line x1="70" y1="10" x2="10" y2="70" stroke="yellow" stroke-width="8" stroke-linecap="round" />
        </svg>
    `;
    return svgCode;
}