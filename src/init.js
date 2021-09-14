export default {
    methods: {
        createDeck() {
            let deck = []
            let tableau = []
            const suites = {
                heart: {
                    icon: '127152',
                    color: 'red'
                },
                diamond: {
                    icon: '127168',
                    color: 'red'
                },
                spade: {
                    icon: '127136',
                    color: 'black'
                },
                club: {
                    icon: '127184',
                    color: 'black'
                }
            }
            const card = (number, suite) => {
                let faces = {
                    1: 'Ace',
                    11: 'Jack',
                    12: 'Queen',
                    13: 'King'
                }
                return {
                    number,
                    face: faces[number] ? faces[number] : null,
                    suite,
                    color: suites[suite].color,
                    icon: number < 12 ? `&#${parseInt(suites[suite].icon) + parseInt(number)};` : `&#${parseInt(suites[suite].icon) + parseInt(number) + 1};`,
                    shown: false
                }
            }

            const addSuite = suite => {
                for(let i = 1; i < 14; i++) {
                    deck.push(card(i, suite))
                }
            }
            Object.keys(suites).forEach(suite => addSuite(suite))
            function shuffle(array) {
                var currentIndex = array.length,  randomIndex;
              
                // While there remain elements to shuffle...
                while (currentIndex != 0) {
              
                  // Pick a remaining element...
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex--;
              
                  // And swap it with the current element.
                  [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
              
                return array;
            }
            this.deck = shuffle(deck)
        },
        createTestDeck() {
            let deck = []
            let tableau = []
            const suites = {
                heart: {
                    icon: '127152',
                    color: 'red'
                },
                diamond: {
                    icon: '127168',
                    color: 'red'
                },
                spade: {
                    icon: '127136',
                    color: 'black'
                },
                club: {
                    icon: '127184',
                    color: 'black'
                }
            }
            const card = (number, suite) => {
                let faces = {
                    1: 'Ace',
                    11: 'Jack',
                    12: 'Queen',
                    13: 'King'
                }
                return {
                    number,
                    face: faces[number] ? faces[number] : null,
                    suite,
                    color: suites[suite].color,
                    icon: number < 12 ? `&#${parseInt(suites[suite].icon) + parseInt(number)};` : `&#${parseInt(suites[suite].icon) + parseInt(number) + 1};`,
                    shown: false
                }
            }

            const addSuite = suite => {
                for(let i = 1; i < 14; i++) {
                    deck.push(card(i, suite))
                }
            }
            Object.keys(suites).forEach(suite => addSuite(suite))
            // this.deck = shuffle(deck)
            this.deck = deck
            this.tableau = [
                [
                    card(1, 'diamond')
                ],
                [
                    card(3, 'spade'),
                    card(2, 'diamond')
                ],
                [
                    card(3, 'heart'),
                    card(4, 'heart'),
                    card(3, 'diamond'),
                ],
                [],
                [],
                [],
                []
            ]
            this.tableau[0][0].shown = true
            this.tableau[1][1].shown = true
            this.tableau[2][2].shown = true
        },
        createTableau() {
            for(let i = 0; i < 7; i++) {
                let t = this.deck.splice(0, i + 1)
                this.tableau.push(t)
                this.tableau[i][this.tableau[i].length - 1].shown = true
            }
        }
    }
}