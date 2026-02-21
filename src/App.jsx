import React, { useState, useEffect, useCallback, useRef } from 'react';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';

/**
 * NEON SNAKE PRO
 * A high-performance, responsive Snake game built with React and Tailwind CSS.
 */

const App = () => {
  // --- Constants & Config ---
  const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
  const INITIAL_DIRECTION = 'UP';
  const DIFFICULTIES = {
    EASY: { speed: 200, increment: 5 },
    MEDIUM: { speed: 150, increment: 8 },
    HARD: { speed: 100, increment: 12 }
  };

  // --- State ---
  const [gridSize, setGridSize] = useState(20);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState('IDLE'); // IDLE, PLAYING, PAUSED, GAME_OVER
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [speed, setSpeed] = useState(DIFFICULTIES.MEDIUM.speed);

  // Refs for logic to avoid stale closures in intervals
  const directionRef = useRef(INITIAL_DIRECTION);
  const lastProcessedDir = useRef(INITIAL_DIRECTION);
  const gameLoopRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('snake-highscore');
    if (saved) setHighScore(parseInt(saved));

    // Handle responsive grid size
    const handleResize = () => {
      setGridSize(window.innerWidth < 768 ? 15 : 20);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  // --- Game Logic Helpers ---
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      // Check if food spawned on snake body
      const collision = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  }, [gridSize]);

  const resetGame = () => {
    const startSnake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    setSnake(startSnake);
    setDirection('UP');
    directionRef.current = 'UP';
    lastProcessedDir.current = 'UP';
    setScore(0);
    setSpeed(DIFFICULTIES[difficulty].speed);
    setFood(generateFood(startSnake));
    setStatus('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDir = directionRef.current;
      lastProcessedDir.current = currentDir;

      if (currentDir === 'UP') head.y -= 1;
      if (currentDir === 'DOWN') head.y += 1;
      if (currentDir === 'LEFT') head.x -= 1;
      if (currentDir === 'RIGHT') head.x += 1;

      // Wall Collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food Collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          // Speed increase every 5 foods
          if (newScore % 50 === 0) {
            setSpeed(prev => Math.max(prev - DIFFICULTIES[difficulty].increment, 50));
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gridSize, difficulty, generateFood]);

  // --- Game Loop ---
  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [status, speed, moveSnake]);

  // --- Controls ---
  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    if (key === ' ' && (status === 'IDLE' || status === 'GAME_OVER')) {
      resetGame();
      return;
    }
    if (key === 'p' || key === 'P') {
      setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev);
      return;
    }

    const move = (newDir) => {
      const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      // Prevent reversing into self using both current ref and last processed to avoid "suicide turn" on fast key presses
      if (opposites[newDir] !== directionRef.current && opposites[newDir] !== lastProcessedDir.current) {
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    if (['ArrowUp', 'w', 'W'].includes(key)) move('UP');
    if (['ArrowDown', 's', 'S'].includes(key)) move('DOWN');
    if (['ArrowLeft', 'a', 'A'].includes(key)) move('LEFT');
    if (['ArrowRight', 'd', 'D'].includes(key)) move('RIGHT');
  }, [status]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) handleDirectionChange(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 30) handleDirectionChange(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  const handleDirectionChange = (newDir) => {
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposites[newDir] !== directionRef.current) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setSpeed(DIFFICULTIES[newDifficulty].speed);
  };

  const handleTogglePause = () => {
    setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col gap-4 sm:gap-6">

        <ScoreBoard
          score={score}
          highScore={highScore}
        />

        <GameBoard
          snake={snake}
          food={food}
          gridSize={gridSize}
          status={status}
          score={score}
          difficulty={difficulty}
          direction={direction}
          onStart={resetGame}
          onResume={() => setStatus('PLAYING')}
          onDifficultyChange={handleDifficultyChange}
          touchStartRef={handleTouchStart}
          touchEndRef={handleTouchEnd}
        />

        <Controls
          direction={direction}
          status={status}
          difficulty={difficulty}
          onDirectionChange={handleDirectionChange}
          onTogglePause={handleTogglePause}
        />

      </div>
    </div>
  );
};

export default App;
