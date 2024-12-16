// Import React oraz używanych bibliotek, hooków, styli i efektów
import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Confetti from 'react-confetti';
import { FaRegLightbulb, FaRegChartBar, FaHeart, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoWhite from './splotylogowhite.png';
import logoDark from './splotylogodark.png';
import { Rainify } from 'rainify';
import IconPopup from './IconPopup';
import DarkModeToggle from './components/DarkModeToggle';
import './darkstyles.css';

// Komponent wyświetlający informację o wyniku gry po jej zakończeniu
const Popup = ({ closePopup, isWin }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <button className="close-button" onClick={closePopup}>
                    <FaTimes />
                </button>
                {/* Sprawdzenie, czy gracz wygrał -> wyświetlenie odpowiedniego komunikatu */}
                {isWin ? (
                    <>
                        <h2>Gratulacje!</h2>
                        <p>Gra zakończona! Do zobaczenia w następnej rundzie!</p>
                        <p className="fun-fact"><strong>Ciekawostka dnia:</strong><br />
                            Księżyc stopniowo oddala się od Ziemi o około 3,8 cm rocznie. 
                            Gdy powstał, był 15 razy bliżej naszej planety niż obecnie.</p>
                    </>
                ) : (
                    <>
                        <h2>Było blisko!</h2>
                        <p>Gra zakończona. Do zobaczenia w następnej rundzie!</p>
                    </>
                )}
            </div>
        </div>
    );
};

// Komponent zawierający logikę gry oraz hasła słowne
const App = () => {

    const [categories, setCategories] = useState({});
    // Definiowanie stanu gry za pomocą useState
    const [wordsData, setWordsData] = useState(null);
    const [words, setWords] = useState([]); // Wszystkie dostępne słowa (wymieszane)
    const [selectedWords, setSelectedWords] = useState([]); // Słowa aktualnie wybrane przez użytkownika
    const [completedCategories, setCompletedCategories] = useState([]); // Lista ukończonych kategorii
    const [lives, setLives] = useState(4); // Liczba żyć gracza
    const [showConfetti, setShowConfetti] = useState(false); // Pokazuje konfetti w przypadku wygranej
    const [rainEffect, setRainEffect] = useState(false); // Pokazuje deszcz w przypadku przegranej
    const [guessButtonText, setGuessButtonText] = useState(''); // Tekst na przycisku do zgadywania
    const [gameOver, setGameOver] = useState(false); // Flaga końca gry
    const [previousGuesses, setPreviousGuesses] = useState([]); // Poprzednie próby użytkownika
    const [hasGuessedWrong, setHasGuessedWrong] = useState(false); // Flaga nieprawidłowej próby
    const [nextGameTime, setNextGameTime] = useState(''); // Czas do następnej gry (o północy)
    const [showPopup, setShowPopup] = useState(false); // Pokazuje Popup końca gry
    const [isWin, setIsWin] = useState(false); // Status wygranej gry
    const [showIconPopup, setShowIconPopup] = useState(false); // Pokazuje Popup z informacjami (ikony)
    const [iconPopupType, setIconPopupType] = useState(null); // Typ Popup z informacjami (ikony)
    const [showFooterPopup, setShowFooterPopup] = useState(false); // State for footer popup
    const [footerPopupContent, setFooterPopupContent] = useState(null); // Content for footer popup
    const [dynamicCategories, setDynamicCategories] = useState({});
    const today = new Date();
    const currentDate = today.setHours(0, 0, 0, 0);

    const categoryColors = {
        'category1': '#92ccdd', 
        'category2': '#c7eff0', 
        'category3': '#f5d5fd', 
        'category4': '#fdc4ec', 
    };


    const fetchWordsForToday = useCallback(async () => {
        try {
            const today = new Date();
            const currentDate = today.toISOString().split('T')[0];
            console.log('Fetching words for date:', currentDate);

            const response = await fetch(`http://localhost:5000/words/${currentDate}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching words:', errorText);
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            // sprawdzenie struktury danych
            if (data.category1 && data.words1) {
                const categoriesMapping = {
                    'category1': data.category1,
                    'category2': data.category2,
                    'category3': data.category3,
                    'category4': data.category4
                };

                // nowe kategorie
                const categoriesObj = {
                    'category1': data.words1,
                    'category2': data.words2,
                    'category3': data.words3,
                    'category4': data.words4
                };

                setDynamicCategories(categoriesMapping);
                setCategories(categoriesObj);

                const allWords = [];
                for (let i = 1; i <= 4; i++) {
                    if (data[`words${i}`]) {
                        allWords.push(...data[`words${i}`]);
                    }
                }
                const shuffledWords = allWords.sort(() => 0.5 - Math.random());
                setWords(shuffledWords);
            } else {
                console.error('Data format is incorrect:', data);
            }
        } catch (error) {
            console.error('Complete error details:', error);
            console.error('Error fetching words:', error.message);
        }
    }, []);

    useEffect(() => {
        fetchWordsForToday(); // fetch
    }, []);


    // useEffect -> inicjalizacja słów i przycisk do zgadywania po załadowaniu komponentu
    useEffect(() => {
        const shuffledWords = [...Object.values(categories).flat()].sort(() => 0.5 - Math.random());
        setWords(shuffledWords); // Wstawienie wymieszanych słów na tablicę 'words'

        const buttonTexts = ['zgaduj', 'próbujemy?', 'sprawdzamy', 'czy to to?', 'zatwierdź', 'ok', 'lets gooo', 'weryfikacja', 'klik', 'czy to to?'];
        setGuessButtonText(buttonTexts.sort(() => 0.5 - Math.random())[0]); // Losowy tekst na przycisku do zgadywania
    }, [categories]);


    // Funkcja obliczająca czas do północy
    const calculateTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const timeDiff = midnight - now;

        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const [timer, setTimer] = useState(calculateTimeUntilMidnight());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(calculateTimeUntilMidnight());
        }, 1000);
        return () => clearInterval(intervalId); 
    }, []);


    // Add this function to your App component


// Uruchom funkcję po załadowaniu strony

    // Funkcja dodająca/odejmująca słowo z listy zaznaczonych po kliknięciu przez użytkownika
    // Funkcja obsługująca kliknięcie na słowo
    const handleWordClick = (word) => {
        if (selectedWords.length < 4 && !selectedWords.includes(word) && !completedCategories.flat().includes(word)) {
            setSelectedWords([...selectedWords, word]);
        } else if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter(w => w !== word));
        }
    };

    // Funkcja obsługująca proces zgadywania
    const handleGuess = () => {
        // Sprawdzenie, czy użytkownik zaznaczył wszystkie 4 hasła
        if (selectedWords.length !== 4) {
            toast.error('Nie zapomnij zaznaczyć wszystkich haseł!'); // Wyświetlenie komunikatu błędu
            return;

        }


        // Sprawdzenie, czy słowa zostały już zgadnięte
        const alreadyGuessed = previousGuesses.some(guess =>
            JSON.stringify(guess.sort()) === JSON.stringify(selectedWords.sort())
        );
        if (alreadyGuessed) {
            toast.error('Już było próbowane!'); 
            return;
        }

        // Sprawdzenie, czy zaznaczone słowa należą do tej samej kategorii
        const correctCategory = Object.keys(categories).find(category =>
            JSON.stringify(categories[category].sort()) === JSON.stringify(selectedWords.sort())
        );

        // Sprawdzenie, czy 3 z 4 słów są poprawne
        const correctWordsCount = Object.values(categories).some(category =>
            selectedWords.filter(word => category.includes(word)).length === 3
        );

        if (correctWordsCount) {
            toast.info('Było blisko!');
            setLives(prevLives => {
                const newLives = prevLives - 1;
                if (newLives <= 0) {
                    const allCompletedCategories = Object.keys(categories).map(category => ({
                        category: category,
                        words: categories[category]
                    }));
                    setCompletedCategories(allCompletedCategories);
                    setGameOver(true);
                    handleLoss();
                }
                return Math.max(newLives, 0);
            });
            return;
        }

        // Jeżeli odgadnięto poprawną kategorię
        if (correctCategory) {
            const newCompletedCategories = [...completedCategories, {
                category: correctCategory,
                words: selectedWords
            }];
            // Aktualizacja ukończonych kategorii
            setCompletedCategories(newCompletedCategories);
            // Usunięcie odgadniętych słów z dostępnych słów
            setWords(words.filter(word => !selectedWords.includes(word)));
            setSelectedWords([]); // Resetowanie zaznaczonych słów
            setPreviousGuesses([...previousGuesses, selectedWords]); // Dodanie do historii prób

            // Sprawdzenie, czy wszystkie kategorie zostały ukończone
            if (newCompletedCategories.length === Object.keys(categories).length) {
                setGameOver(true); // Ustawienie flagi końca gry
                handleWin(); // Obsługa wygranej
            }
            setHasGuessedWrong(false); // Resetowanie flagi błędnej próby
        } else {
            // Jeżeli zgadnięcie było błędne, dodaj efekt wstrząsu do słów
            selectedWords.forEach(word => {
                const wordElement = document.getElementById(word);
                if (wordElement) {
                    wordElement.classList.add('shake'); // Dodanie klasy 'shake' dla efektu
                }
            });

            // Usunięcie efektu wstrząsu po 500ms
            setTimeout(() => {
                selectedWords.forEach(word => {
                    const wordElement = document.getElementById(word);
                    if (wordElement) {
                        wordElement.classList.remove('shake');
                    }
                });
            }, 500);

            setHasGuessedWrong(true); // Ustawienie flagi błędnej próby
            toast.error('Nie tym razem...'); // Wyświetlenie komunikatu błędu
            setLives(prevLives => {
                const newLives = prevLives - 1; // Zmniejszenie liczby żyć
                // Sprawdzenie, czy gracz stracił wszystkie życia
                if (newLives <= 0) {
                    const allCompletedCategories = Object.keys(categories).map(category => ({
                        category: category,
                        words: categories[category]
                    }));
                    setCompletedCategories(allCompletedCategories); // Ustawienie wszystkich kategorii jako ukończone
                    setGameOver(true); // Ustawienie flagi końca gry
                    handleLoss(); // Obsługa przegranej
                }
                return Math.max(newLives, 0); // Upewnienie się, że liczba żyć nie jest ujemna
            });
            setPreviousGuesses([...previousGuesses, selectedWords]); // Dodanie do historii prób
        }

        // Zmiana tekstu przycisku zgadywania w zależności od wyniku próby
        const buttonTexts = hasGuessedWrong
            ? ['może teraz?', 'może teraz....', ]
            : ['zgaduj', 'próbujemy?', 'sprawdzamy', 'czy to to?', 'zatwierdź', 'ok', 'lets gooo', 'weryfikacja', 'klik', 'czy to to?'];
        setGuessButtonText(buttonTexts.sort(() => 0.5 - Math.random())[0]); // Ustawienie losowego tekstu na przycisku
    };

    // Funkcja do losowania nowych słów
    const handleRandomize = () => {
        const shuffledWords = [...words].sort(() => 0.5 - Math.random()); // Losowe wymieszanie słów
        setWords(shuffledWords); // Ustawienie wymieszanych słów
        setSelectedWords([]); // Resetowanie zaznaczonych słów
    };

    // Funkcja do czyszczenia zaznaczonych słów
    const handleClearSelection = () => {
        setSelectedWords([]); // Resetowanie zaznaczonych słów
    };

    // Funkcja obsługująca wygraną gracza i zmianę stanów
    const handleWin = () => {
        setShowConfetti(true); 
        setRainEffect(false); 
        setNextGameTime(calculateTimeUntilMidnight()); 
        setIsWin(true); 
        setShowPopup(true); 
    };

    // Funkcja obsługująca przegraną gracza i zmianę stanów
    const handleLoss = () => {
        setRainEffect(true); 
        setNextGameTime(calculateTimeUntilMidnight()); 
        setIsWin(false); 
        setShowPopup(true); 
    };

    // Zamykanie Popupa po końcu gry
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    // Funkcja obsługująca wyświetlanie okienka informacyjnego po kliknięciu ikony -> żarówki, wykresu.
    const handleIconClick = (type) => {
        setIconPopupType(type);
        setShowIconPopup(true);
    };

    // Zamykanie Popupa po kliknięciu ikony
    const handleCloseIconPopup = () => {
        setShowIconPopup(false);
        setIconPopupType(null);
    };

    // Funkcja obsługująca kliknięcia w linki w stopce
    const handleFooterLinkClick = (link) => {
        let content;
        switch (link) {
            case "/about":
                content = <p><span className="sploty">Sploty</span> to prosta, rozwijająca gra słowna. Sprawdź swoją wiedzę ogólną i dopasowuj słowa do kategorii!<br/><br/>Inspirowane <b><a href="https://www.nytimes.com/games/connections" target="_blank" rel="noopener noreferrer">Connections.nyt </a></b></p>;
                break;
            case "/contact":
                content = <p>Widzisz błąd? <br/>Masz propozycję haseł dla społeczności? <br/>Chcesz się czegoś dowiedzieć?<br/>Napisz na <b>sploty@gmail.com <br/><br/>Na pewno otrzymasz odpowiedź ;)</b></p>;
                break;
            case "/cookie-policy":
                content = <p>Strona wykorzystuje ciasteczka, które są wykorzystywane do śledzenia twoich codziennych wyników. Jeżeli chcesz je sprawdzić swoje statystyki, kliknij w ikonę wykresu po prawej stronie.</p>;
                break;
            default:
                content = <p>No content for this link.</p>;
        }
        setShowFooterPopup(true);
        setFooterPopupContent(content);
    };

    // Zamykanie Popupa po kliknięciu w linki w stopce
    const handleCloseFooterPopup = () => {
        setShowFooterPopup(false);
        setFooterPopupContent(null);
    };


    // Hook useEffect, który reaguje na zmianę stanu `showConfetti`.
    // Jeżeli `showConfetti` jest ustawione na `true`, to po 3 sekundach
    // ustawiane jest na `false`, co powoduje, że konfetti zniknie po pewnym czasie.
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 3000); // Po 3 sekundach wyłączamy konfetti
            return () => clearTimeout(timer); // Czyścimy timer, gdy komponent zostanie odmontowany lub showConfetti się zmieni
        }
    }, [showConfetti]); // hook działa przy każdej zmianie `showConfetti`

    // Główna struktura komponentu
    return (
        <div className="App container d-flex flex-column min-vh-100">
            {rainEffect && (
                <Rainify
                    isRaining
                    intensity={200} 
                    color='rgba(23, 51, 168, 0.5)' 
                    zIndex={0}
                    speed={3} 
                    wind={1} 
                    thickness={2} 
                    splashColor='rgba(23, 51, 168, 0.5)' 
                    splashDuration={15} 
                />
            )}



            <header className="d-flex flex-column align-items-center top-bar">
                {/* Logo aplikacji */}
                <img src={document.body.classList.contains('dark-mode') ? logoDark : logoWhite} alt="Logo" id="logo" className="logo-image" />
                <div className="horizontal-line" id="horizontal-line-above"></div>
                <div className="caption-icons-container">
                    {/* Tekst zachęcający gracza do odkrywania motywów */}
                    <div className="caption">znajdź ukryte motywy!</div>

                    <div className="icons-caption-container">
                        <DarkModeToggle className="icon" /> {/* Directly inside icons-caption-container */}
                        <div className="icon-container">
                            <FaRegLightbulb className="icon" onClick={() => handleIconClick('lightbulb')} />
                        </div>
                        <div className="icon-container">
                            <FaRegChartBar className="icon" onClick={() => handleIconClick('statistics')} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content flex-grow-1">
                {gameOver && (
                    <div className="completed-categories">
                        {completedCategories.map(({ category, words }, index) => (
        <div
            key={index}
            className="completed-category"
            style={{ backgroundColor: categoryColors[category] || '#e2f0d5' }}
        >
            <div className="category-name">{dynamicCategories[category] || category}</div>
            <div className="completed-words">{words.join(', ')}</div>
        </div>
    ))}
                        {/* Komunikat końcowy po zakończeniu gry */}
                        <div className="announcement mt-3 text-center">
                            Koniec gry. Nowe <span className="sploty"> sploty </span> już jutro!<br />
                            <span id="timer">Następna runda za: {timer}</span>
                        </div>
                        <div className="super-button-container">
                            {isWin ? (
                                <button className="btn" onClick={handleWin}>Super!</button>
                            ) : (
                                <button className="btnSzkoda" onClick={handleLoss}>Szkoda...</button>
                            )}
                        </div>
                    </div>
                )}

                {/* Jeżeli gra nadal trwa, wyświetlane są dostępne kategorie oraz słowa */}
                {!gameOver && (
                    <>
                        <div className="completed-categories">
            {completedCategories.map(({ category, words }, index) => (
                <div
                    key={index}
                    className="completed-category"
                    style={{ backgroundColor: categoryColors[category] || '#e2f0d5' }}
                >
                    <div className="category-name">{dynamicCategories[category] || category}</div>
                    <div className="completed-words">{words.join(', ')}</div>
                </div>
                            ))}
                        </div>

                        {/* Siatka słów, które gracz ma do odgadnięcia */}
                        <div id="word-grid" className="row">
                            {words.map((word, index) => (
                                <div key={index} className="col-3 mb-3">
                                    <div
                                        id={word}
                                        className={`word ${completedCategories.flat().includes(word) ? 'completed' : ''}
                                         ${selectedWords.includes(word) ? 'selected' : ''}`}
                                        onClick={() => handleWordClick(word)} 
                                    >
                                        {word}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Przycisk do zgadywania, losowania nowych słów oraz czyszczenia wyborów */}
                        <div className="action-buttons-container">
                            <button className="btn" onClick={handleGuess}>{guessButtonText}</button>
                            <button className="btn" onClick={handleRandomize}>losuj</button>
                            <button className="btn" onClick={handleClearSelection}>wyczyść</button>
                        </div>

                        {/* Wyświetlenie liczby dostępnych prób (żyć) gracza */}
                        <div className="lives mt-3 text-center">
                            <span> Pozostałe próby: </span>
                            {[...Array(lives)].map((_, index) => (
                                <FaHeart key={index} className="heart-icon" /> // Wyświetlanie ikony serca dla każdej próby
                            ))}
                        </div>
                    </>
                )}
            </main>

            <footer className="footer">
                <button
                    className="footer-link"
                    onClick={() => handleFooterLinkClick("/about")}
                >
                    O stronie
                </button>
                <button
                    className="footer-link"
                    onClick={() => handleFooterLinkClick("/contact")}
                >
                    Kontakt
                </button>
                <button
                    className="footer-link"
                    onClick={() => handleFooterLinkClick("/cookie-policy")}
                >
                    Polityka Ciasteczek 🍪
                </button>
            </footer>

            {/* Komponenty wyskakujących okienek */}
            {showConfetti && <Confetti />} {/* Wyświetlanie konfetti po wygranej */}
            {showPopup && <Popup closePopup={handleClosePopup} isWin={isWin} />} {/* Wyskakujące okno z informacją o zakończeniu gry */}
            {showIconPopup && (
                <IconPopup
                    type={iconPopupType}
                    closePopup={handleCloseIconPopup} // Okno z dodatkowymi informacjami na temat gry
                />
            )}
            {showFooterPopup && (
                <div className="popup">
                    <div className="popup-content large footer-popup">
                        <button className="close-button" onClick={handleCloseFooterPopup}>
                            <FaTimes />
                        </button>
                        {footerPopupContent}
                    </div>
                </div>
            )}

            {/* Komponent ToastContainer do wyświetlania powiadomień toast */}
            <ToastContainer />
        </div>
    );
};

export default App;
