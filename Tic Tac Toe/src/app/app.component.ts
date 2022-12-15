import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    firstPlayer: Player;
    secondPlayer: Player;
    gamePley: GamePley;
    gameBoard: GameBoard;

    startGame() {
        const firstPlayerName: string = (document.getElementById("first-player-name")as HTMLInputElement).value;
        const secondPlayerName: string = (document.getElementById("second-player-name")as HTMLInputElement).value;
        const whoFirst: boolean = (document.getElementById("who-first1")as HTMLInputElement).checked;
        const twoPlayers: boolean = (document.getElementById("solo-game1")as HTMLInputElement).checked;
        this.firstPlayer = new Player(firstPlayerName, whoFirst, "player-first-image");
        this.secondPlayer = new Player(secondPlayerName, !whoFirst, "player-second-image");
        this.gamePley = new GamePley(twoPlayers);
        this.gameBoard = new GameBoard();
        this.gameBoard.startGame(whoFirst ? firstPlayerName : secondPlayerName);
    }

    getdetails(button) {//:  HTMLButtonElement
        if (this.gameBoard === undefined || button.target.classList.contains(this.gameBoard.disabledBloc)) {
            return;
        }

        const buttonId = Number(button.target.id);
        this.gamePley.doStep(buttonId);
        if (this.firstPlayer.turn) {
            this.firstPlayer.doStep(buttonId);
            this.secondPlayer.skipTurn();
            this.gameBoard.doStep(buttonId, this.firstPlayer.playerImg, this.secondPlayer.name);
            if (this.gamePley.checkWinner(this.firstPlayer.state)) {
                this.gameBoard.victory(this.firstPlayer.name);
            }
        } else if (this.gamePley.twoPlayers) {
            this.secondPlayer.doStep(buttonId);
            this.firstPlayer.skipTurn();
            this.gameBoard.doStep(buttonId, this.secondPlayer.playerImg, this.firstPlayer.name);
            if (this.gamePley.checkWinner(this.secondPlayer.state)) {
                this.gameBoard.victory(this.secondPlayer.name);
            }
        }

        if (this.gamePley.checkEnd()) {
            this.gameBoard.gameEnd();
        }

        if (!this.gamePley.twoPlayers && !this.gamePley.gameEnd) {
            const randomStep = this.gamePley.randomStep();
            this.gamePley.doStep(randomStep);
            this.secondPlayer.doStep(randomStep);
            this.firstPlayer.skipTurn();
            this.gameBoard.doStep(randomStep, this.secondPlayer.playerImg, this.firstPlayer.name);
            if (this.gamePley.checkWinner(this.secondPlayer.state)) {
                this.gameBoard.victory(this.secondPlayer.name);
            }
        }
    }
}

class Player {
    #name: string;
    #turn: boolean;
    #playerImg: string;
    #state: number[] = [];

    constructor(name, turn, playerImg) {
        this.#name = name;
        this.#turn = turn;
        this.#playerImg = playerImg;
    }

    doStep(value) {
        this.#state.push(value);
        this.#turn = false;
    }

    skipTurn() {
        this.#turn = true;
    }

    get turn() {
        return this.#turn;
    }

    get state() {
        return this.#state;
    }

    get playerImg() {
        return this.#playerImg
    }

    get name() {
        return this.#name;
    }
}

class GamePley {
    #gameEnd: boolean = false;
    #twoPlayers: boolean;
    #usedState: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    #winningStates: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    constructor(numberPlayers) {
        this.#twoPlayers = numberPlayers;
    }

    doStep(buttonValue) {
        const oldUsedState = this.#usedState;
        this.#usedState = [];
        oldUsedState.forEach(number => {
            if (number != buttonValue) {
                this.#usedState.push(number);
            }
        });
        console.log(this.#usedState[Math.floor(Math.random() * this.#usedState.length)]);
    }

    randomStep() {
        return this.#usedState[Math.floor(Math.random() * this.#usedState.length)];
    }

    checkWinner(playerState) {
        let win: boolean = false;
        this.#winningStates.forEach(winningState => {
            const playerWins = winningState.every(state => playerState.includes(state));
            if (playerWins && !this.#gameEnd) {
                win = true;
            }
        });
        if (win) {
            this.#gameEnd = true;
            return true;
        }
        return false;
    }

    get gameEnd() {
        return this.#gameEnd;
    }

    get twoPlayers() {
        return this.#twoPlayers;
    }

    checkEnd() {
        if (this.#usedState.length === 0 && !this.#gameEnd) {
            this.#gameEnd = true;
            return true;
        }
        return false;
    }
}

class GameBoard {
    #disabledBloc: string = "disabled";
    #GameButton: string = "playing-field__button";
    #messageBloc: string = ".menu__message";
    #message = document.querySelector(this.#messageBloc);

    constructor() {
        document.querySelectorAll(`.${this.#GameButton}`).forEach(button => {
            button.className = this.#GameButton;
        })
    }

    doStep(buttonId, playerImg, nameNext) {
        const button: HTMLButtonElement = document.getElementById(buttonId.toString()) as HTMLButtonElement;
        button.classList.add(this.#disabledBloc);
        button.classList.add(playerImg);
        this.#message.textContent = `Хід ${nameNext}`;
    }

    victory(name) {
        this.#message.textContent = `${name} - Переміг`;
        document.querySelectorAll(`.${this.#GameButton}`).forEach(cell => cell.classList.add(this.#disabledBloc));
    }

    startGame(name) {
        this.#message.textContent = `Хід ${name}`;
    }

    get disabledBloc() {
        return this.#disabledBloc;
    }

    gameEnd() {
        this.#message.textContent = "Нічія!";
    }
}

